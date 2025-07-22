// src/hooks/weatherCodeToIcon.ts
import {
  Ban,
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Zap
} from 'lucide-react';
import type { FC } from 'react';

export const mapWeatherCodeToIcon = (code: number): FC<any> => {
  switch (code) {
    case 0:
    case 1:
      return Sun;
    case 2:
      return CloudSun;
    case 3:
      return Cloud;
    case 45:
    case 48:
      return CloudFog;
    case 51:
    case 53:
    case 55:
      return CloudDrizzle;
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return CloudRain;
    case 71:
    case 73:
    case 75:
      return CloudSnow;
    case 95:
      return CloudLightning;
    case 96:
    case 99:
      return Zap;
    default:
      return Ban;
  }
};
