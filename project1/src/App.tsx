import React, { useState, useEffect } from 'react';
import { MapContainer } from 'react-leaflet';
import { WeatherMap } from './components/WeatherMap';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { SearchBar } from './components/SearchBar';
import { WeatherAlerts } from './components/WeatherAlerts';
import { weatherAPI } from './services/weatherApi';
import { useGeolocation } from './hooks/useGeolocation';
import { CurrentWeather, ForecastData } from './types/weather';
import { Cloud, Satellite, AlertTriangle } from 'lucide-react';

function App() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  
  const geolocation = useGeolocation();

  // Sample weather alerts for demonstration
  const sampleAlerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Winter Storm Warning',
      description: 'Heavy snow expected. Total snow accumulations of 8 to 12 inches possible.',
      severity: 'high' as const,
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  ];

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeather(lat, lon),
        weatherAPI.getForecast(lat, lon)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setMapCenter([lat, lon]);
    } catch (err) {
      setError('Failed to fetch weather data. Please check your API key and try again.');
      console.error('Weather data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherAPI.getCurrentWeatherByCity(city),
        weatherAPI.getForecastByCity(city)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setMapCenter([weatherData.coord.lat, weatherData.coord.lon]);
    } catch (err) {
      setError(`Failed to fetch weather data for "${city}". Please check the city name and try again.`);
      console.error('City search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = () => {
    geolocation.getCurrentLocation();
  };

  const handleMapLocationSelect = (lat: number, lon: number) => {
    fetchWeatherData(lat, lon);
  };

  // Load user's location on mount
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      fetchWeatherData(geolocation.latitude, geolocation.longitude);
    }
  }, [geolocation.latitude, geolocation.longitude]);

  // Load default location (NYC) on mount if geolocation fails
  useEffect(() => {
    if (!currentWeather && !loading) {
      fetchWeatherData(40.7128, -74.0060); // NYC coordinates
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Satellite size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Global Weather Intelligence</h1>
              <p className="text-gray-400">Real-time weather monitoring and forecasting</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              <span className="text-green-400">●</span> Live Data
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleCitySearch}
          onLocationRequest={handleLocationRequest}
          loading={loading}
          className="mb-6"
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertTriangle size={20} className="text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Geolocation Error */}
        {geolocation.error && (
          <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertTriangle size={20} className="text-yellow-400" />
            <p className="text-yellow-200">Location access: {geolocation.error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg">Loading weather data...</span>
          </div>
        )}

        {/* Weather Dashboard */}
        {currentWeather && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Weather */}
            <div className="lg:col-span-1">
              <WeatherCard weather={currentWeather} />
            </div>

            {/* Weather Map */}
            <div className="lg:col-span-2 h-96 lg:h-auto">
              <div className="bg-gray-800 rounded-xl p-4 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Cloud size={20} className="mr-2 text-blue-400" />
                  Interactive Weather Map
                </h3>
                <WeatherMap
                  center={mapCenter}
                  weather={currentWeather}
                  onLocationSelect={handleMapLocationSelect}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Forecast and Alerts */}
        {forecast && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ForecastCard forecast={forecast.list} />
            <WeatherAlerts alerts={[]} />
          </div>
        )}

        {/* No Data State */}
        {!currentWeather && !loading && !error && (
          <div className="text-center py-12">
            <Cloud size={64} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">Welcome to Weather Intelligence</h3>
            <p className="text-gray-400 mb-4">Search for a city or allow location access to get started</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 p-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">Global Weather Intelligence Platform</p>
          <p className="text-sm">
            Powered by OpenWeatherMap API • Built for meteorological professionals
          </p>
          <div className="mt-4 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500">
            <p className="text-yellow-200 font-medium">API Configuration Required</p>
            <p className="text-yellow-300 text-sm mt-1">
              To use real weather data, please replace the demo API key in <code>src/services/weatherApi.ts</code> with your OpenWeatherMap API key.
              <br />
              Get your free API key at: <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">openweathermap.org/api</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;