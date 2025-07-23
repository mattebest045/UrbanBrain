import { FC } from 'react';

/**
 * Dati meteo correnti restituiti dal backend
 */
export interface CurrentData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number | null;
  weatherCode?: number; // Codice meteo opzionale, utile per icone
}

/**
 * Previsione giornaliera restituita dal backend
 */
export interface ForecastData {
  day: string;
  high: number;
  low: number;
  condition: string;
  weatherCode?: number; // Codice meteo opzionale, utile per icone
  icon?: FC<any>; // Icona opzionale, può essere un componente
}

/**
 * Genera dati casuali per la qualità dell'aria
 */
export interface AirQualityData {
  parameter: string;
  value: number;
  unit: string;
  status: string;
  color: string;
}

/**
 * Interfaccia per la risposta completa dell'endpoint /weather/:city
 */
export interface WeatherApiResponse {
  success: boolean;
  message: string;
  data: {
    current: CurrentData;
    forecast: ForecastData[];
  };
}
