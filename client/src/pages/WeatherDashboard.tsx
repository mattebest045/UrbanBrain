// src/components/WeatherDashboard.tsx
import React, { useState, useEffect, KeyboardEvent } from 'react';
import api from '@/api';
import { 
  Cloud,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Search,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { mapWeatherCodeToIcon } from '@/lib/weatherCodeToIcon';
import { CurrentData, ForecastData, AirQualityData, WeatherApiResponse } from '@/types/weatherData';
import { useAuth } from '@/hooks/AuthContext';

const WeatherDashboard: React.FC = () => {
  const defaultCity = 'Parma';

  const [searchCity, setSearchCity] = useState(defaultCity);
  const [currentCity, setCurrentCity] = useState(defaultCity);
  const [current, setCurrent] = useState<CurrentData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Generate random air quality values
  const generateRandomAQ = (): AirQualityData[] => {
    const params = [
      { parameter: 'PM2.5', unit: 'μg/m³', thresholds: [12, 35.4] },
      { parameter: 'PM10', unit: 'μg/m³', thresholds: [54, 154] },
      { parameter: 'NO2', unit: 'ppb', thresholds: [53, 100] },
      { parameter: 'O3', unit: 'ppb', thresholds: [70, 150] },
    ];
    return params.map(({ parameter, unit, thresholds }) => {
      const value = Math.round(Math.random() * (thresholds[1] * 1.2));
      let status = 'Good';
      let color = 'text-green-400';
      if (value > thresholds[1]) {
        status = 'Unhealthy'; color = 'text-red-400';
      } else if (value > thresholds[0]) {
        status = 'Moderate'; color = 'text-yellow-400';
      }
      return { parameter, value, unit, status, color };
    });
  };

  // useEffect(() => {
  //   const savedCity = localStorage.getItem('lastCity'); // Ricupera la città salvata nel localStorage
  //   setCurrentCity('Parma');

  //   if (user?.luogo) {
  //     setCurrentCity(user.luogo);
  //   } else if (savedCity) {
  //     setCurrentCity(savedCity);
  //   }

  //   fetchEvents();
  // }, [user]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get<WeatherApiResponse>(`/weather/${encodeURIComponent(currentCity)}`);
        const data = res.data.data as { 
          current: CurrentData; 
          forecast: Omit<ForecastData,'icon'>[] 
        };
        
        console.log('Weather API response:', res.data);
        console.log('Weather data fetched:', data);

        // set current
        setCurrent(data.current);

        // attach icons
        setForecast(
          data.forecast.map(f => ({
            ...f,
            icon: mapWeatherCodeToIcon(Number(f.weatherCode)) // Assuming condition is a number
          }))
        );

        console.log('Forecast with icons:', data.forecast);

        setAirQualityData(generateRandomAQ());
      } catch (err: any) {
        setError(err.response?.data?.message || 'Errore fetching meteo');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [currentCity]);

  const handleSearch = () => {
    console.log('Searching for:', searchCity, searchCity.trim());
    setCurrentCity(searchCity.trim());
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Weather Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time meteorological monitoring and environmental data
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-morphism p-6 rounded-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary flex items-center space-x-2">
              <Search className="h-4 w-4" /><span>Search</span>
            </button>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && <p>Caricamento in corso...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Current Weather */}
        {current && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 glass-morphism p-8 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">{currentCity.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase())}</h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-6xl font-bold text-primary">
                    {current.temperature}°C
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Feels like {current.feelsLike}°C
                  </div>
                  <div className="text-xl font-medium">
                    {current.condition}
                  </div>
                </div>
                <div className="text-right">
                  <Cloud className="h-24 w-24 text-primary/70 mb-4" />
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="space-y-4">
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="text-xl font-bold">{current.humidity}%</div>
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Wind className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="text-xl font-bold">{current.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-muted-foreground">Visibility</div>
                    <div className="text-xl font-bold">{current.visibility} km</div>
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Gauge className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-muted-foreground">Pressure</div>
                    <div className="text-xl font-bold">{current.pressure} hPa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="glass-morphism p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" /><span>5-Day Forecast</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.map((d, i) => {
                const Icon = d.icon || Cloud;
                return (
                  <div key={i} className="bg-background/30 p-4 rounded-lg text-center hover:bg-background/50 transition-all duration-300">
                    <div className="font-medium mb-2">{d.day}</div>
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground mb-2">{d.condition}</div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{d.high}°</span>
                      <span className="text-muted-foreground">{d.low}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Air Quality */}
        <div className="glass-morphism p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span>Air Quality Index</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {airQualityData.map((item, index) => (
              <div key={index} className="bg-background/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{item.parameter}</div>
                <div className="text-2xl font-bold mb-1">
                  {item.value} <span className="text-sm font-normal">{item.unit}</span>
                </div>
                <div className={`text-sm font-medium ${item.color}`}>{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
