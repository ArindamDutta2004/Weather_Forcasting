import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap
} from 'lucide-react';
import { CurrentWeather } from '../types/weather';
import { format } from 'date-fns';

interface WeatherCardProps {
  weather: CurrentWeather;
  className?: string;
}

function getWeatherIcon(iconCode: string, size: number = 24) {
  const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    '01d': Sun,
    '01n': Moon,
    '02d': Cloud,
    '02n': Cloud,
    '03d': Cloud,
    '03n': Cloud,
    '04d': Cloud,
    '04n': Cloud,
    '09d': CloudRain,
    '09n': CloudRain,
    '10d': CloudRain,
    '10n': CloudRain,
    '11d': Zap,
    '11n': Zap,
    '13d': CloudSnow,
    '13n': CloudSnow,
  };

  const IconComponent = iconMap[iconCode] || Cloud;
  return <IconComponent size={size} className="text-blue-400" />;
}

export function WeatherCard({ weather, className = '' }: WeatherCardProps) {
  const sunrise = new Date(weather.sys.sunrise * 1000);
  const sunset = new Date(weather.sys.sunset * 1000);

  return (
    <div className={`bg-gray-800 rounded-xl p-6 text-white shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{weather.name}</h2>
          <p className="text-gray-400">{weather.sys.country}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-gray-400 capitalize">{weather.weather[0].description}</p>
        </div>
      </div>

      {/* Weather Icon and Feel */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-700 rounded-full p-4 mr-4">
          {getWeatherIcon(weather.weather[0].icon, 48)}
        </div>
        <div>
          <p className="text-lg">Feels like <span className="font-semibold">{Math.round(weather.main.feels_like)}°C</span></p>
          <p className="text-gray-400">
            H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°
          </p>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Droplets size={20} className="text-blue-400 mr-2" />
            <span className="text-gray-400">Humidity</span>
          </div>
          <p className="text-xl font-semibold">{weather.main.humidity}%</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Wind size={20} className="text-blue-400 mr-2" />
            <span className="text-gray-400">Wind Speed</span>
          </div>
          <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Gauge size={20} className="text-blue-400 mr-2" />
            <span className="text-gray-400">Pressure</span>
          </div>
          <p className="text-xl font-semibold">{weather.main.pressure} hPa</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Eye size={20} className="text-blue-400 mr-2" />
            <span className="text-gray-400">Visibility</span>
          </div>
          <p className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Sun size={20} className="text-yellow-400 mr-2" />
            <span className="text-gray-400">Sunrise</span>
          </div>
          <p className="text-lg font-semibold">{format(sunrise, 'HH:mm')}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Moon size={20} className="text-indigo-400 mr-2" />
            <span className="text-gray-400">Sunset</span>
          </div>
          <p className="text-lg font-semibold">{format(sunset, 'HH:mm')}</p>
        </div>
      </div>
    </div>
  );
}