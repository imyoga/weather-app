import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  CloudQueue as WeatherIcon,
  MyLocation as LocationIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { ThemeProvider } from './context/ThemeContext';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherForecast } from './components/WeatherForecast';
import { ThemeToggle } from './components/ThemeToggle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getCurrentWeather, getForecast, reverseGeocode } from './services/weatherApi';
import type { CurrentWeatherResponse, ForecastResponse, LocationSearchResult, Coordinates } from './types/weather';
import './App.css';

interface AppState {
  currentWeather?: CurrentWeatherResponse;
  forecast?: ForecastResponse;
  loading: boolean;
  error?: string;
  selectedLocation?: LocationSearchResult;
  currentLocationName?: string;
}

const WeatherApp: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: false,
  });

  const fetchWeatherData = async (coordinates: Coordinates, locationResult?: LocationSearchResult) => {
    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const [currentWeather, forecast] = await Promise.all([
        getCurrentWeather(coordinates.lat, coordinates.lon),
        getForecast(coordinates.lat, coordinates.lon)
      ]);

      let locationName = locationResult?.formatted;
      if (!locationName) {
        locationName = await reverseGeocode(coordinates.lat, coordinates.lon);
      }

      setState(prev => ({
        ...prev,
        currentWeather,
        forecast,
        loading: false,
        selectedLocation: locationResult,
        currentLocationName: locationName,
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
      }));
    }
  };

  const handleLocationSelect = (location: LocationSearchResult) => {
    fetchWeatherData(location.coordinates, location);
  };

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setState(prev => ({ ...prev, loading: true, error: undefined }));
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: Coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          fetchWeatherData(coordinates);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Unable to get your current location. Please search for a location manually.'
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser. Please search for a location manually.'
      }));
    }
  };

  // Load a default location on first load
  useEffect(() => {
    // Load weather for a default location (New York) on first load
    const defaultCoordinates: Coordinates = { lat: 40.7128, lon: -74.0060 };
    fetchWeatherData(defaultCoordinates);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <WeatherIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h1" fontWeight="bold" color="text.primary">
              Weather Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Get current location weather">
              <IconButton 
                onClick={handleGetCurrentLocation} 
                disabled={state.loading}
                color="primary"
              >
                <LocationIcon />
              </IconButton>
            </Tooltip>
            
            <ThemeToggle />
            
            <Tooltip title="View source code">
              <IconButton 
                component="a" 
                href="https://github.com/your-username/weather-app" 
                target="_blank"
                color="primary"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom align="center">
            Comprehensive Weather Information
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Get detailed current weather and 5-day forecast with all available meteorological data
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SearchBar onLocationSelect={handleLocationSelect} disabled={state.loading} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<LocationIcon />}
              onClick={handleGetCurrentLocation}
              disabled={state.loading}
              sx={{ borderRadius: 8 }}
            >
              Use Current Location
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {state.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        {/* Loading State */}
        {state.loading && (
          <LoadingSpinner message="Fetching weather data..." />
        )}

        {/* Weather Data */}
        {!state.loading && state.currentWeather && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Weather */}
            <CurrentWeather 
              weather={state.currentWeather} 
              locationName={state.currentLocationName}
            />

            {/* 5-Day Forecast */}
            {state.forecast && (
              <WeatherForecast forecast={state.forecast} />
            )}
          </Box>
        )}

        {/* Welcome message when no data */}
        {!state.loading && !state.currentWeather && !state.error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <WeatherIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Welcome to Weather Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Search for a location or use your current location to get started
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<LocationIcon />}
              onClick={handleGetCurrentLocation}
              sx={{ borderRadius: 8 }}
            >
              Get My Weather
            </Button>
          </Box>
        )}
      </Container>

      {/* Floating Action Button for quick location access */}
      {state.currentWeather && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleGetCurrentLocation}
          disabled={state.loading}
        >
          <LocationIcon />
        </Fab>
      )}
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <WeatherApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
