import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CurrentWeather } from '../types/weather';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  center: [number, number];
  weather?: CurrentWeather;
  onLocationSelect: (lat: number, lon: number) => void;
  className?: string;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

export function WeatherMap({ center, weather, onLocationSelect, className = '' }: WeatherMapProps) {
  const mapRef = useRef<L.Map>(null);

  return (
    <div className={`h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Weather overlay layers would go here in a real implementation */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=demo_key`}
          attribution='Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          opacity={0.6}
        />

        {weather && (
          <Marker position={[weather.coord.lat, weather.coord.lon]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{weather.name}</h3>
                <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
                <p className="capitalize">{weather.weather[0].description}</p>
                <p className="text-sm text-gray-600">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}