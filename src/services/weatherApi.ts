import { WEATHER_API_URL, WEATHER_API_KEY, GEO_API_URL, GEO_API_KEY } from '../envs/code';
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  GeocodeResponse, 
  LocationSearchResult 
} from '../types/weather';
import type { UnitSystem } from '../context/UnitsContextTypes';

// Weather API functions
export const getCurrentWeather = async (lat: number, lon: number, units: UnitSystem = 'metric'): Promise<CurrentWeatherResponse> => {
  const url = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }
  
  return response.json();
};

export const getForecast = async (lat: number, lon: number, units: UnitSystem = 'metric'): Promise<ForecastResponse> => {
  const url = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.statusText}`);
  }
  
  return response.json();
};

// Geocoding API functions
export const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
  if (!query.trim()) {
    return [];
  }

  const url = `${GEO_API_URL}?q=${encodeURIComponent(query)}&key=${GEO_API_KEY}&limit=5&pretty=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }
    
    const data: GeocodeResponse = await response.json();
    
    return data.results.map(result => ({
      formatted: result.formatted,
      city: result.components.city,
      state: result.components.state,
      country: result.components.country,
      coordinates: {
        lat: result.geometry.lat,
        lon: result.geometry.lng
      }
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const url = `${GEO_API_URL}?q=${lat}+${lon}&key=${GEO_API_KEY}&pretty=1`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.statusText}`);
    }
    
    const data: GeocodeResponse = await response.json();
    
    if (data.results.length > 0) {
      return data.results[0].formatted;
    }
    
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
};

// Utility functions
export const getWeatherIconUrl = (icon: string, size: '2x' | '4x' = '2x'): string => {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
};

export const formatTemperature = (temp: number, unitSystem: UnitSystem = 'metric'): string => {
  const roundedTemp = Math.round(temp);
  switch (unitSystem) {
    case 'metric':
      return `${roundedTemp}°C`;
    case 'imperial':
      return `${roundedTemp}°F`;
    case 'standard':
      return `${roundedTemp}K`;
    default:
      return `${roundedTemp}°C`;
  }
};

export const formatWindSpeed = (speed: number, unitSystem: UnitSystem = 'metric'): string => {
  switch (unitSystem) {
    case 'metric':
      // OpenWeatherMap returns m/s for metric, convert to km/h
      return `${Math.round(speed * 3.6)} km/h`;
    case 'imperial':
      // OpenWeatherMap returns mph for imperial
      return `${Math.round(speed)} mph`;
    case 'standard':
      // OpenWeatherMap returns m/s for standard
      return `${Math.round(speed * 10) / 10} m/s`;
    default:
      return `${Math.round(speed * 3.6)} km/h`;
  }
};

export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

export const formatVisibility = (visibility: number, unitSystem: UnitSystem = 'metric'): string => {
  switch (unitSystem) {
    case 'metric':
    case 'standard':
      return `${(visibility / 1000).toFixed(1)} km`;
    case 'imperial':
      return `${(visibility / 1609.34).toFixed(1)} mi`; // Convert meters to miles
    default:
      return `${(visibility / 1000).toFixed(1)} km`;
  }
};

export const formatPrecipitation = (amount: number, unitSystem: UnitSystem = 'metric'): string => {
  switch (unitSystem) {
    case 'metric':
    case 'standard':
      return `${amount} mm`;
    case 'imperial':
      return `${(amount / 25.4).toFixed(2)} in`; // Convert mm to inches
    default:
      return `${amount} mm`;
  }
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    timeZone: 'UTC',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  });
}; 