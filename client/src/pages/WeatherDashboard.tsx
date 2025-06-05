
import React, { useState } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
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

const WeatherDashboard = () => {
  const [searchCity, setSearchCity] = useState('New York');
  const [currentCity, setCurrentCity] = useState('New York');

  // Mock weather data
  const weatherData = {
    current: {
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      uvIndex: 6,
      feelsLike: 25
    },
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Tomorrow', high: 26, low: 20, condition: 'Sunny', icon: Sun },
      { day: 'Wednesday', high: 21, low: 16, condition: 'Rainy', icon: CloudRain },
      { day: 'Thursday', high: 23, low: 17, condition: 'Cloudy', icon: Cloud },
      { day: 'Friday', high: 25, low: 19, condition: 'Sunny', icon: Sun },
    ]
  };

  const airQualityData = [
    { parameter: 'PM2.5', value: 12, unit: 'μg/m³', status: 'Good', color: 'text-green-400' },
    { parameter: 'PM10', value: 24, unit: 'μg/m³', status: 'Good', color: 'text-green-400' },
    { parameter: 'NO2', value: 18, unit: 'ppb', status: 'Moderate', color: 'text-yellow-400' },
    { parameter: 'O3', value: 45, unit: 'ppb', status: 'Good', color: 'text-green-400' },
  ];

  const handleSearch = () => {
    setCurrentCity(searchCity);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city name..."
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 glass-morphism p-8 rounded-xl">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{currentCity}</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-6xl font-bold text-primary">
                  {weatherData.current.temperature}°C
                </div>
                <div className="text-lg text-muted-foreground">
                  Feels like {weatherData.current.feelsLike}°C
                </div>
                <div className="text-xl font-medium">
                  {weatherData.current.condition}
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
                  <div className="text-xl font-bold">{weatherData.current.humidity}%</div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Wind className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Wind Speed</div>
                  <div className="text-xl font-bold">{weatherData.current.windSpeed} km/h</div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Visibility</div>
                  <div className="text-xl font-bold">{weatherData.current.visibility} km</div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Gauge className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Pressure</div>
                  <div className="text-xl font-bold">{weatherData.current.pressure} hPa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="glass-morphism p-6 rounded-xl mb-8">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>5-Day Forecast</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className="bg-background/30 p-4 rounded-lg text-center hover:bg-background/50 transition-all duration-300">
                  <div className="font-medium mb-2">{day.day}</div>
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">{day.condition}</div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                <div className="text-2xl font-bold mb-1">{item.value} <span className="text-sm font-normal">{item.unit}</span></div>
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
