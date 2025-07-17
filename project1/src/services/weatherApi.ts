import axios from 'axios';
import { CurrentWeather, ForecastData } from '../types/weather';

const API_KEY = process.env.API_KEY ||; // Your working OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherAPI {
  private apiKey: string;

  constructor(apiKey: string = API_KEY) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    try {
      const response = await axios.get<CurrentWeather>(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch current weather data');
    }
  }

  async getCurrentWeatherByCity(city: string): Promise<CurrentWeather> {
    try {
      const response = await axios.get<CurrentWeather>(
        `${BASE_URL}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw new Error('Failed to fetch weather data for the specified city');
    }
  }

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    try {
      const response = await axios.get<ForecastData>(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getForecastByCity(city: string): Promise<ForecastData> {
    try {
      const response = await axios.get<ForecastData>(
        `${BASE_URL}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast by city:', error);
      throw new Error('Failed to fetch forecast data for the specified city');
    }
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export const weatherAPI = new WeatherAPI();
