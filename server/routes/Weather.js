// routes/weather.js
const express = require('express');
const axios = require('axios');
const { constants, sendResponse } = require('../utils');
const router = express.Router();
const validateCityParam = require('../middlewares/validate/validateWeather');

// Mappa codici Open‑Meteo → descrizione
const weatherCodes = {
    0: "Sunny",
    1: "Mostly sunny",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Foggy with frost",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Light showers",
    81: "Moderate showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail"
};

// Route GET /weather/:city
router.get('/:city', validateCityParam, async (req, res) => {
  const city = req.params.city;
  try {
    // 1. Geocoding
    const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: { 
        name: city, 
        count: 1, 
        language: 'it', 
        format: 'json' 
      }
    });
    const geo = geoRes.data.results?.[0];
    if (!geo) return sendResponse(res, constants.NOT_FOUND, false, 'Città non trovata');

    const { latitude, longitude } = geo;

    // 2. Meteo
    const meteoRes = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        "latitude": latitude,
	      "longitude": longitude,
	      "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "visibility_mean"],
	      "hourly": "visibility",
	      "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "wind_speed_10m", "pressure_msl"],
	      "timezone": "auto"
      }
    });
    const current_weather = meteoRes.data.current;
    const hourly_weather = meteoRes.data.hourly;
    const daily_weather = meteoRes.data.daily;

    // console.log(`Current Weather per ${city}:`, current_weather);
    // console.log(`Hourly Weather per ${city}:`, hourly_weather);
    // console.log(`Daily Weather per ${city}:`, daily_weather);

    // 3. Trasforma in shape frontend
    // Current
    const current = {
      temperature: current_weather.temperature_2m,
      feelsLike: current_weather.apparent_temperature,
      condition: weatherCodes[current_weather.weather_code] || 'Unknown',
      humidity: current_weather.relative_humidity_2m,
      windSpeed: current_weather.wind_speed_10m,
      visibility: +(hourly_weather.visibility[hourly_weather.time.indexOf(current_weather.time)] / 1000).toFixed(1), // km
      pressure: current_weather.pressure_msl,
      uvIndex: null, // Open‑Meteo non fornisce UV in questo endpoint
      weatherCode: current_weather.weather_code // Aggiunto per icone
    };

    // Forecast a 5 giorni [(Today + 1), (Today + 5)]
    const forecast = daily_weather.time.slice(1, 6).map((dateStr, i) => {
      const day = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
      return {
        day,
        high: daily_weather.temperature_2m_max[i],
        low: daily_weather.temperature_2m_min[i],
        condition: weatherCodes[daily_weather.weather_code[i]] || 'Unknown',
        weatherCode: daily_weather.weather_code[i],
        icon: null // il frontend mapperà condition → icona
      };
    });

    // 4. Restituisci solo quello che serve
    return sendResponse(res, constants.OK, true, `Meteo per ${city}`, {
      current,
      forecast
    });

  } catch (err) {
    console.error(err);
    return sendResponse(res, constants.INTERNAL_SERVER_ERROR, false, 'Errore nel servizio meteo');
  }
});

module.exports = router;