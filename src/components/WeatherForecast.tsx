import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Thermostat as ThermostatIcon,
  Air as WindIcon,
  Opacity as HumidityIcon,
  Cloud as CloudIcon,
  Umbrella as RainIcon,
  AcUnit as SnowIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import type { ForecastResponse, ForecastItem } from '../types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  formatDate,
  getWindDirection,
  getWeatherIconUrl,
  formatVisibility,
} from '../services/weatherApi';

interface WeatherForecastProps {
  forecast: ForecastResponse;
}

interface DailyForecast {
  date: string;
  items: ForecastItem[];
  minTemp: number;
  maxTemp: number;
  mainWeather: string;
  icon: string;
}

const groupForecastByDay = (forecastList: ForecastItem[]): DailyForecast[] => {
  const grouped = forecastList.reduce((acc, item) => {
    const date = formatDate(item.dt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  return Object.entries(grouped).map(([date, items]) => {
    const temps = items.map(item => item.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    // Get the weather condition that appears most frequently during the day
    const weatherCounts = items.reduce((acc, item) => {
      const weather = item.weather[0].main;
      acc[weather] = (acc[weather] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mainWeather = Object.entries(weatherCounts).reduce((a, b) => 
      weatherCounts[a[0]] > weatherCounts[b[0]] ? a : b
    )[0];
    
    // Get icon from the item with this weather condition
    const iconItem = items.find(item => item.weather[0].main === mainWeather);
    const icon = iconItem?.weather[0].icon || items[0].weather[0].icon;

    return {
      date,
      items,
      minTemp,
      maxTemp,
      mainWeather,
      icon,
    };
  });
};

const ForecastDetail: React.FC<{ item: ForecastItem }> = ({ item }) => (
  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar
        src={getWeatherIconUrl(item.weather[0].icon)}
        sx={{ width: 40, height: 40, mr: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight="medium">
          {new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
          {item.weather[0].description}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="bold" color="primary">
        {formatTemperature(item.main.temp)}
      </Typography>
    </Box>

                   <Grid container spacing={1} sx={{ fontSize: '0.875rem' }}>
        <Grid size={{ xs: 6, sm: 3 }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
           <ThermostatIcon fontSize="small" color="primary" />
           <Typography variant="body2">
             Feels {formatTemperature(item.main.feels_like)}
           </Typography>
         </Box>
       </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <WindIcon fontSize="small" color="primary" />
           <Typography variant="body2">
             {formatWindSpeed(item.wind.speed)} {getWindDirection(item.wind.deg)}
           </Typography>
         </Box>
       </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HumidityIcon fontSize="small" color="primary" />
           <Typography variant="body2">
             {item.main.humidity}%
           </Typography>
         </Box>
       </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CloudIcon fontSize="small" color="primary" />
           <Typography variant="body2">
             {item.clouds.all}%
           </Typography>
         </Box>
       </Grid>
      
                           {item.pop > 0 && (
          <Grid size={{ xs: 6, sm: 3 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
             <RainIcon fontSize="small" color="info" />
             <Typography variant="body2">
               {Math.round(item.pop * 100)}%
             </Typography>
           </Box>
         </Grid>
       )}
       
              {item.rain && item.rain['3h'] && (
          <Grid size={{ xs: 6, sm: 3 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
             <RainIcon fontSize="small" color="info" />
             <Typography variant="body2">
               {item.rain['3h']} mm
             </Typography>
           </Box>
         </Grid>
       )}
       
              {item.snow && item.snow['3h'] && (
          <Grid size={{ xs: 6, sm: 3 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
             <SnowIcon fontSize="small" color="info" />
             <Typography variant="body2">
               {item.snow['3h']} mm
             </Typography>
           </Box>
         </Grid>
       )}
              
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon fontSize="small" color="primary" />
           <Typography variant="body2">
             {formatVisibility(item.visibility)}
           </Typography>
         </Box>
       </Grid>
    </Grid>
  </Box>
);

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const dailyForecasts = groupForecastByDay(forecast.list);

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          5-Day Weather Forecast
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Detailed 3-hour forecast data for {forecast.city.name}, {forecast.city.country}
        </Typography>

        {dailyForecasts.map((day, index) => (
          <Accordion key={day.date} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar
                  src={getWeatherIconUrl(day.icon)}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="medium">
                    {day.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {day.mainWeather}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    label={`${formatTemperature(day.maxTemp)} / ${formatTemperature(day.minTemp)}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {day.items.length} forecasts
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" gutterBottom>
                3-Hour Intervals
              </Typography>
              {day.items.map((item) => (
                <ForecastDetail key={item.dt} item={item} />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

        <Divider sx={{ my: 3 }} />
        
        {/* Forecast Summary */}
        <Typography variant="h6" gutterBottom>
          Forecast Summary
        </Typography>
                                   <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
             <Typography variant="body2" color="text.secondary">
               Total forecast points: {forecast.cnt}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               City timezone: UTC{forecast.city.timezone >= 0 ? '+' : ''}{forecast.city.timezone / 3600}
             </Typography>
           </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Coordinates: {forecast.city.coord.lat.toFixed(4)}, {forecast.city.coord.lon.toFixed(4)}
             </Typography>
             <Typography variant="body2" color="text.secondary">
               Sunrise: {new Date((forecast.city.sunrise + forecast.city.timezone) * 1000).toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}
             </Typography>
           </Grid>
         </Grid>
      </CardContent>
    </Card>
  );
}; 