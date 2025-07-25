import React from 'react'
import {
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
	Divider,
	Avatar,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
	Thermostat as ThermostatIcon,
	Air as WindIcon,
	Visibility as VisibilityIcon,
	Opacity as HumidityIcon,
	Speed as PressureIcon,
	Cloud as CloudIcon,
	WbSunny as SunriseIcon,
	Brightness3 as SunsetIcon,
	Umbrella as RainIcon,
	AcUnit as SnowIcon,
	LocationOn as LocationIcon,
} from '@mui/icons-material'
import type { CurrentWeatherResponse } from '../types/weather'
import { useUnits } from '../hooks/useUnits'
import {
	formatTemperature,
	formatWindSpeed,
	formatPressure,
	formatVisibility,
	formatPrecipitation,
	getWindDirection,
	formatTime,
	getWeatherIconUrl,
} from '../services/weatherApi'

interface CurrentWeatherProps {
	weather: CurrentWeatherResponse
	locationName?: string
}

interface WeatherDetailProps {
	icon: React.ReactNode
	label: string
	value: string
	unit?: string
}

const WeatherDetail: React.FC<WeatherDetailProps> = ({
	icon,
	label,
	value,
	unit,
}) => (
	<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
		{icon}
		<Typography variant='body2' color='text.secondary' sx={{ minWidth: 80 }}>
			{label}:
		</Typography>
		<Typography variant='body2' fontWeight='medium'>
			{value}
			{unit && <span style={{ opacity: 0.7 }}> {unit}</span>}
		</Typography>
	</Box>
)

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
	weather,
	locationName,
}) => {
	const { unitSystem } = useUnits()
	const mainWeather = weather.weather[0]
	const sunrise = formatTime(weather.sys.sunrise, weather.timezone)
	const sunset = formatTime(weather.sys.sunset, weather.timezone)

	return (
		<Card elevation={3}>
			<CardContent sx={{ p: 3 }}>
				{/* Header */}
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<LocationIcon color='primary' sx={{ mr: 1 }} />
					<Typography variant='h5' component='h2' fontWeight='bold'>
						{locationName || weather.name}, {weather.sys.country}
					</Typography>
				</Box>

				{/* Main Weather Info */}
				<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
					<Avatar
						src={getWeatherIconUrl(mainWeather.icon, '4x')}
						sx={{ width: 100, height: 100, mr: 3 }}
					/>
					<Box>
						<Typography
							variant='h2'
							component='div'
							fontWeight='bold'
							color='primary'
						>
							{formatTemperature(weather.main.temp, unitSystem)}
						</Typography>
						<Typography
							variant='h6'
							color='text.secondary'
							sx={{ textTransform: 'capitalize' }}
						>
							{mainWeather.description}
						</Typography>
						<Typography variant='body1' color='text.secondary'>
							Feels like{' '}
							{formatTemperature(weather.main.feels_like, unitSystem)}
						</Typography>
					</Box>
				</Box>

				{/* Key Weather Highlights */}
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
					<Chip
						label={`High: ${formatTemperature(
							weather.main.temp_max,
							unitSystem
						)}`}
						color='error'
						variant='filled'
						size='medium'
						sx={{ fontWeight: 'bold' }}
					/>
					<Chip
						label={`Low: ${formatTemperature(
							weather.main.temp_min,
							unitSystem
						)}`}
						color='info'
						variant='filled'
						size='medium'
						sx={{ fontWeight: 'bold' }}
					/>
					{(weather.rain?.['1h'] || weather.snow?.['1h']) && (
						<Chip
							label={`Rain: ${
								weather.rain?.['1h']
									? formatPrecipitation(weather.rain['1h'], unitSystem)
									: 'None'
							}`}
							color='secondary'
							variant='filled'
							size='medium'
							sx={{ fontWeight: 'bold' }}
						/>
					)}
					<Chip
						label={`Humidity: ${weather.main.humidity}%`}
						color='primary'
						variant='outlined'
					/>
				</Box>

				<Divider sx={{ my: 2 }} />

				{/* Detailed Weather Information */}
				<Typography variant='h6' gutterBottom>
					Weather Details
				</Typography>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<WeatherDetail
							icon={<ThermostatIcon color='primary' />}
							label='Feels Like Temperature'
							value={formatTemperature(weather.main.feels_like, unitSystem)}
						/>
						<WeatherDetail
							icon={<WindIcon color='primary' />}
							label='Wind Speed & Direction'
							value={`${formatWindSpeed(
								weather.wind.speed,
								unitSystem
							)} ${getWindDirection(weather.wind.deg)}`}
						/>
						{weather.wind.gust && (
							<WeatherDetail
								icon={<WindIcon color='primary' />}
								label='Wind Gusts'
								value={formatWindSpeed(weather.wind.gust, unitSystem)}
							/>
						)}
						<WeatherDetail
							icon={<HumidityIcon color='primary' />}
							label='Air Humidity'
							value={`${weather.main.humidity}%`}
						/>
						<WeatherDetail
							icon={<PressureIcon color='primary' />}
							label='Atmospheric Pressure'
							value={formatPressure(weather.main.pressure)}
						/>
						{weather.main.sea_level && (
							<WeatherDetail
								icon={<PressureIcon color='primary' />}
								label='Sea Level Pressure'
								value={formatPressure(weather.main.sea_level)}
							/>
						)}
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<WeatherDetail
							icon={<VisibilityIcon color='primary' />}
							label='Visibility Distance'
							value={formatVisibility(weather.visibility, unitSystem)}
						/>
						<WeatherDetail
							icon={<CloudIcon color='primary' />}
							label='Cloud Coverage'
							value={`${weather.clouds.all}%`}
						/>
						<WeatherDetail
							icon={<SunriseIcon color='warning' />}
							label='Sunrise Time'
							value={sunrise}
						/>
						<WeatherDetail
							icon={<SunsetIcon color='warning' />}
							label='Sunset Time'
							value={sunset}
						/>
						{weather.rain && weather.rain['1h'] && (
							<WeatherDetail
								icon={<RainIcon color='info' />}
								label='Rain (Last Hour)'
								value={formatPrecipitation(weather.rain['1h'], unitSystem)}
							/>
						)}
						{weather.snow && weather.snow['1h'] && (
							<WeatherDetail
								icon={<SnowIcon color='info' />}
								label='Snow (Last Hour)'
								value={formatPrecipitation(weather.snow['1h'], unitSystem)}
							/>
						)}
					</Grid>
				</Grid>

				{/* Additional Information */}
				<Divider sx={{ my: 2 }} />
				<Typography variant='h6' gutterBottom>
					Additional Information
				</Typography>

				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 6 }}>
						<WeatherDetail
							icon={<LocationIcon color='primary' />}
							label='GPS Coordinates'
							value={`${weather.coord.lat.toFixed(
								4
							)}, ${weather.coord.lon.toFixed(4)}`}
						/>
						<WeatherDetail
							icon={<LocationIcon color='primary' />}
							label='Data Source'
							value={weather.base}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<WeatherDetail
							icon={<LocationIcon color='primary' />}
							label='Weather Condition ID'
							value={mainWeather.id.toString()}
						/>
						{weather.main.grnd_level && (
							<WeatherDetail
								icon={<PressureIcon color='primary' />}
								label='Ground Level Pressure'
								value={formatPressure(weather.main.grnd_level)}
							/>
						)}
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}
