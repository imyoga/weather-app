import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Collapse,
  Divider,
  useTheme,
} from "@mui/material";
import type { Theme } from "@mui/material";
import { Grid } from "@mui/material";
import {
  Air as WindIcon,
  Visibility as VisibilityIcon,
  Opacity as HumidityIcon,
  Cloud as CloudIcon,
  WbSunny as SunriseIcon,
  Umbrella as RainIcon,
  AcUnit as SnowIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ThermostatAuto as FeelsLikeIcon,
} from "@mui/icons-material";
import type { CurrentWeatherResponse } from "../types/weather";
import { useUnits } from "../hooks/useUnits";
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatPrecipitation,
  getWindDirection,
  formatTime,
  getWeatherIconUrl,
} from "../services/weatherApi";

interface CurrentWeatherProps {
  weather: CurrentWeatherResponse;
  locationName?: string;
}

const getTemperatureColor = (temp: number, theme: Theme) => {
  const isDark = theme.palette.mode === 'dark';
  
  if (temp < 0) return isDark ? theme.palette.info.light : theme.palette.info.main; // Blue for freezing
  if (temp < 10) return isDark ? theme.palette.info.main : theme.palette.info.dark; // Light blue for cold
  if (temp < 25) return isDark ? theme.palette.success.light : theme.palette.success.main; // Green for comfortable
  if (temp < 30) return isDark ? theme.palette.warning.light : theme.palette.warning.main; // Orange for warm
  return isDark ? theme.palette.error.light : theme.palette.error.main; // Red for hot
};

const getPrecipitationInfo = (weather: CurrentWeatherResponse, theme: Theme) => {
  if (weather.rain?.["1h"]) {
    return {
      type: "rain",
      amount: weather.rain["1h"],
      icon: <RainIcon />,
      label: "Rain",
      color: theme.palette.info.main,
    };
  }
  if (weather.snow?.["1h"]) {
    return {
      type: "snow",
      amount: weather.snow["1h"],
      icon: <SnowIcon />,
      label: "Snow",
      color: theme.palette.secondary.main,
    };
  }
  return null;
};

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  locationName,
}) => {
  const { unitSystem } = useUnits();
  const [showDetails, setShowDetails] = useState(false);
  const theme = useTheme();
  const mainWeather = weather.weather[0];
  const precipInfo = getPrecipitationInfo(weather, theme);
  const tempColor = getTemperatureColor(weather.main.temp, theme);

  return (
    <Card elevation={3}>
      <CardContent sx={{ p: 0 }}>
        {/* Hero Section - Main Temperature Display */}
        <Box
          sx={{
            background: theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.primary.dark}20 0%, ${theme.palette.primary.main}30 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}25 100%)`,
            p: 3,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Location Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography variant="h6" fontWeight="600" color="text.primary">
              {locationName || weather.name}
            </Typography>
          </Box>

          {/* Main Temperature and Weather */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Avatar
              src={getWeatherIconUrl(mainWeather.icon, "4x")}
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h1"
                component="div"
                fontWeight="300"
                sx={{
                  fontSize: "4rem",
                  lineHeight: 0.9,
                  color: tempColor,
                  textShadow: theme.palette.mode === 'dark' 
                    ? "0 2px 8px rgba(0,0,0,0.5)" 
                    : "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {Math.round(weather.main.temp)}°
              </Typography>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                {mainWeather.description}
              </Typography>
            </Box>
          </Box>

          {/* Feels Like Temperature */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
            <FeelsLikeIcon sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body1" color="text.secondary">
              Feels like {formatTemperature(weather.main.feels_like, unitSystem)}
            </Typography>
          </Box>
        </Box>

        {/* Key Information Strip */}
        <Box sx={{ 
          px: 3, 
          py: 2, 
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.default 
            : theme.palette.grey[50] 
        }}>
          <Grid container spacing={2} alignItems="center">
            {/* Min/Max Temperature */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Today's Range
                </Typography>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Chip
                    label={`↑ ${Math.round(weather.main.temp_max)}°`}
                    color="error"
                    variant="filled"
                    size="medium"
                    sx={{ fontWeight: "bold", minWidth: 70 }}
                  />
                  <Chip
                    label={`↓ ${Math.round(weather.main.temp_min)}°`}
                    color="info"
                    variant="filled"
                    size="medium"
                    sx={{ fontWeight: "bold", minWidth: 70 }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Precipitation */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Precipitation
                </Typography>
                {precipInfo ? (
                  <Chip
                    icon={precipInfo.icon}
                    label={`${formatPrecipitation(precipInfo.amount, unitSystem)} ${precipInfo.label}`}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? `${precipInfo.color}30` 
                        : `${precipInfo.color}20`,
                      color: precipInfo.color,
                      border: `1px solid ${precipInfo.color}`,
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <Chip
                    label="None"
                    color="default"
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>
            </Grid>

            {/* Humidity */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Humidity
                </Typography>
                <Chip
                  icon={<HumidityIcon />}
                  label={`${weather.main.humidity}%`}
                  color={weather.main.humidity > 70 ? "warning" : "primary"}
                  variant={weather.main.humidity > 70 ? "filled" : "outlined"}
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Wind and Quick Info */}
        <Box sx={{ px: 3, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <WindIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="body2" fontWeight="500">
                  {formatWindSpeed(weather.wind.speed, unitSystem)} {getWindDirection(weather.wind.deg)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="body2" fontWeight="500">
                  {formatVisibility(weather.visibility, unitSystem)}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => setShowDetails(!showDetails)}
              size="small"
              sx={{ 
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Detailed Information - Collapsible */}
        <Collapse in={showDetails}>
          <Divider />
          <Box sx={{ 
            p: 3, 
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.background.default 
              : theme.palette.grey[100] 
          }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: "text.secondary" }}>
              Detailed Information
            </Typography>
            
            <Grid container spacing={3}>
              {/* Atmospheric Details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: "primary.main" }}>
                    <CloudIcon sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }} />
                    Atmospheric
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Pressure:</Typography>
                      <Typography variant="body2" fontWeight="500">{formatPressure(weather.main.pressure)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Cloud Cover:</Typography>
                      <Typography variant="body2" fontWeight="500">{weather.clouds.all}%</Typography>
                    </Box>
                    {weather.main.sea_level && (
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">Sea Level:</Typography>
                        <Typography variant="body2" fontWeight="500">{formatPressure(weather.main.sea_level)}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              {/* Sun Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: "primary.main" }}>
                    <SunriseIcon sx={{ mr: 1, fontSize: 18, verticalAlign: "middle" }} />
                    Sun Times
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Sunrise:</Typography>
                      <Typography variant="body2" fontWeight="500">{formatTime(weather.sys.sunrise, weather.timezone)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Sunset:</Typography>
                      <Typography variant="body2" fontWeight="500">{formatTime(weather.sys.sunset, weather.timezone)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" color="text.secondary">Coordinates:</Typography>
                      <Typography variant="body2" fontWeight="500">{weather.coord.lat.toFixed(2)}°, {weather.coord.lon.toFixed(2)}°</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
