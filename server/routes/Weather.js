const express = require('express');
const axios = require('axios');
const { constants, sendResponse } = require('../utils');
const router = express.Router();
const validateCityParam = require('../middlewares/validate/validateWeather');

/**
 * @route GET /weather/:city
 * @description Restituisce info meteo per la città richiesta
 * @access Public
 */
router.get('/:city', validateCityParam, async (req, res) => {
    const city = req.params.city;

    try {
        // 1️⃣ - Geocoding: ottengo latitudine e longitudine
        const geoRes = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: city,
                count: 1,
                language: 'it',
                format: 'json'
            }
        });

        if (!geoRes.data.results || geoRes.data.results.length === 0) {
            return sendResponse(res, constants.NOT_FOUND, false, 'Città non trovata');
        }

        const { latitude, longitude, name, country } = geoRes.data.results[0];

        // 🔍 DEBUG: Verifica coordinate ottenute
        console.log('📍 Coordinate trovate:', { latitude, longitude, name, country });

        // 2️⃣ - Meteo: ottengo il meteo per le coordinate trovate
        const meteoParams = {
            latitude,
            longitude,
            current: 'temperature_2m,apparent_temperature,precipitation,weathercode,cloudcover,wind_speed_10m,visibility,pressure_msl',
            daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,weathercode,apparent_temperature_mean,cloud_cover_mean,wind_speed_10m_mean,visibility_mean,pressure_msl_mean',
            timezone: 'auto'
        };

        console.log('🌤️ Parametri chiamata meteo:', meteoParams);

        const meteoResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: meteoParams
        });

        // ✅ CORREZIONE: usa meteoResponse.data.current invece di current_weather
        const currentWeather = meteoResponse.data.current;
        const dailyWeather = meteoResponse.data.daily;

        return sendResponse(res, constants.OK, true, `Dati meteo per ${city}`, {
            location: { name, country, latitude, longitude },
            current: currentWeather,
            daily: dailyWeather
        });

    } catch (error) {
        console.error('🔴 ERRORE COMPLETO:', error);

        if (error.response) {
            // Errore dalla API esterna - mostra dettagli completi
            console.error('📡 Errore Response API:');
            // console.error('Status:', error.response.status);
            // console.error('Headers:', error.response.headers);
            // console.error('Data:', error.response.data);
            // console.error('URL chiamata:', error.config?.url);
            // console.error('Parametri:', error.config?.params);
            return sendResponse(res, constants.BAD_REQUEST, false, `Errore API meteo: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // Errore di rete
            console.error('🌐 Errore Request (rete):', error.request);
            return sendResponse(res, constants.INTERNAL_SERVER_ERROR, false, 'Errore di connessione al servizio meteo');
        } else {
            // Altri errori
            console.error('⚠️ Altro errore:', error.message);
            return sendResponse(res, constants.INTERNAL_SERVER_ERROR, false, `Errore interno: ${error.message}`);
        }
    }
});

module.exports = router;


/** 
Esempio di richiesta:
GET /weather/Roma

Risposta:
 "data": {
        "location": {
            "name": "Roma",                     // Nome della città
            "country": "Italia",                // Paese della città
            "latitude": 41.89193,               // Latitudine della città
            "longitude": 12.51133               // Longitudine della città
        },
        "current": {
            "time": "2025-06-26T12:15",         // Timestamp dei dati (ISO 8601)
            "interval": 900,                    // Intervallo di aggiornamento dei dati in secondi
            "temperature_2m": 34,               // Temperatura attuale a 2 metri dal suolo (°C)
            "apparent_temperature": 35.6,       // Temperatura percepita (°C)
            "precipitation": 0,                 // Precipitazione attuale (mm)
            "weathercode": 0,                   // Codice del tempo attuale (vedi tabella dei codici meteo sotto)
            "cloudcover": 0,                    // Copertura nuvolosa attuale (0-100%)
            "wind_speed_10m": 10,               // Velocità del vento a 10 metri dal suolo (km/h)
            "visibility": 78360,                // Visibilità attuale (metri)
            "pressure_msl": 1015.5              // Pressione atmosferica al livello del mare (hPa)
        },
        "daily": {
            "time": [                           // Date array delle previsioni giornaliere
                "2025-06-26",
                "2025-06-27",
                "2025-06-28",
                "2025-06-29",
                "2025-06-30",
                "2025-07-01",
                "2025-07-02"
            ],
            "temperature_2m_max": [             // Temperatura massima giornaliera a 2 metri dal suolo (°C)
                34.5,
                36.4,
                38.3,
                37.3,
                37,
                34,
                34.1
            ],
            "temperature_2m_min": [             // Temperatura minima giornaliera a 2 metri dal suolo (°C)
                21.6,
                22,
                25.1,
                23.9,
                24.1,
                23.8,
                22.3
            ],
            "weathercode": [                    // Codice del tempo giornaliero (vedi tabella dei codici meteo sotto)
                0,
                3,
                2,
                2,
                1,
                1,
                1
            ]
        }
    }


// Tabella dei codici meteo:
const weatherCodes = {
    0: "Sereno",
    1: "Prevalentemente sereno", 
    2: "Parzialmente nuvoloso",
    3: "Nuvoloso",
    45: "Nebbia",
    48: "Nebbia con brina",
    51: "Pioggerella leggera",
    53: "Pioggerella moderata", 
    55: "Pioggerella intensa",
    61: "Pioggia leggera",
    63: "Pioggia moderata",
    65: "Pioggia intensa",
    71: "Neve leggera",
    73: "Neve moderata",
    75: "Neve intensa",
    80: "Rovesci leggeri",
    81: "Rovesci moderati",
    82: "Rovesci intensi",
    95: "Temporale",
    96: "Temporale con grandine leggera",
    99: "Temporale con grandine intensa"
};
return weatherCodes[code] || "Condizione sconosciuta";
*/