import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Moon, Zap, Droplets } from 'lucide-react';
import { ForecastItem } from '../types/weather';
import { format } from 'date-fns';

interface ForecastCardProps {
  forecast: ForecastItem[];
  className?: string;
}

function getWeatherIcon(iconCode: string, size: number = 32) {
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

export function ForecastCard({ forecast, className = '' }: ForecastCardProps) {
  // Group forecast by day and take the first 5 days
  const dailyForecast = forecast.reduce((acc, item) => {
    const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  const forecastDays = Object.entries(dailyForecast).slice(0, 5);

  return (
    <div className={`bg-gray-800 rounded-xl p-6 text-white shadow-xl ${className}`}>
      <h3 className="text-xl font-bold mb-6 text-white">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecastDays.map(([date, dayForecast]) => {
          const dayData = dayForecast[0]; // Use first forecast of the day
          const maxTemp = Math.max(...dayForecast.map(f => f.main.temp_max));
          const minTemp = Math.min(...dayForecast.map(f => f.main.temp_min));
          const avgPop = dayForecast.reduce((sum, f) => sum + f.pop, 0) / dayForecast.length;

          return (
            <div key={date} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    {getWeatherIcon(dayData.weather[0].icon)}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-white">
                      {format(new Date(date), 'EEEE')}
                    </p>
                    <p className="text-sm text-gray-400 capitalize">
                      {dayData.weather[0].description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {Math.round(maxTemp)}° / {Math.round(minTemp)}°
                  </p>
                  <div className="flex items-center justify-end text-sm text-gray-400">
                    <Droplets size={14} className="mr-1" />
                    <span>{Math.round(avgPop * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}