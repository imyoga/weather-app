import React from 'react'
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
	Tooltip,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
	ExpandMore as ExpandMoreIcon,
	Air as WindIcon,
	Opacity as HumidityIcon,
	Umbrella as RainIcon,
	AcUnit as SnowIcon,
} from '@mui/icons-material'
import type { ForecastResponse, ForecastItem } from '../types/weather'
import type { UnitSystem } from '../context/UnitsContextTypes'
import { useUnits } from '../hooks/useUnits'
import {
	formatTemperature,
	formatWindSpeed,
	formatDate,
	getWeatherIconUrl,
	formatPrecipitation,
} from '../services/weatherApi'

interface WeatherForecastProps {
	forecast: ForecastResponse
}

interface DailyForecast {
	date: string
	items: ForecastItem[]
	minTemp: number
	maxTemp: number
	mainWeather: string
	icon: string
}

const groupForecastByDay = (forecastList: ForecastItem[]): DailyForecast[] => {
	const grouped = forecastList.reduce((acc, item) => {
		const date = formatDate(item.dt)
		if (!acc[date]) {
			acc[date] = []
		}
		acc[date].push(item)
		return acc
	}, {} as Record<string, ForecastItem[]>)

	return Object.entries(grouped).map(([date, items]) => {
		const temps = items.map((item) => item.main.temp)
		const minTemp = Math.min(...temps)
		const maxTemp = Math.max(...temps)

		// Get the weather condition that appears most frequently during the day
		const weatherCounts = items.reduce((acc, item) => {
			const weather = item.weather[0].main
			acc[weather] = (acc[weather] || 0) + 1
			return acc
		}, {} as Record<string, number>)

		const mainWeather = Object.entries(weatherCounts).reduce((a, b) =>
			weatherCounts[a[0]] > weatherCounts[b[0]] ? a : b
		)[0]

		// Get icon from the item with this weather condition
		const iconItem = items.find((item) => item.weather[0].main === mainWeather)
		const icon = iconItem?.weather[0].icon || items[0].weather[0].icon

		return {
			date,
			items,
			minTemp,
			maxTemp,
			mainWeather,
			icon,
		}
	})
}

const ForecastDetail: React.FC<{
	item: ForecastItem
	unitSystem: UnitSystem
}> = ({ item, unitSystem }) => (
	<Box
		sx={{
			p: 1.5,
			border: 1,
			borderColor: 'divider',
			borderRadius: 1,
			minWidth: '140px',
			maxWidth: '160px',
			textAlign: 'center',
			backgroundColor: 'background.paper',
		}}
	>
		{/* Time */}
		<Typography
			variant='caption'
			fontWeight='medium'
			color='primary'
			sx={{ display: 'block', mb: 0.5 }}
		>
			{new Date(item.dt * 1000).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
			})}
		</Typography>

		{/* Weather Icon */}
		<Avatar
			src={getWeatherIconUrl(item.weather[0].icon)}
			sx={{ width: 60, height: 32, mx: 'auto', mb: 0.5 }}
		/>

		{/* Temperature with Feels Like */}
		<Typography
			variant='body1'
			fontWeight='bold'
			color='primary'
			sx={{ mb: 0.5 }}
		>
			{formatTemperature(item.main.temp, unitSystem)}{' '}
			<Tooltip
				title={`Feels like ${formatTemperature(
					item.main.feels_like,
					unitSystem
				)}`}
				arrow
			>
				<Typography
					component='span'
					variant='caption'
					color='text.secondary'
					fontWeight='normal'
					sx={{ cursor: 'help' }}
				>
					({formatTemperature(item.main.feels_like, unitSystem)})
				</Typography>
			</Tooltip>
		</Typography>

		{/* Weather Description - right below feels like */}
		<Typography
			variant='caption'
			color='text.secondary'
			sx={{
				textTransform: 'capitalize',
				display: 'block',
				mb: 1,
				lineHeight: 1.2,
				minHeight: '24px',
			}}
		>
			{item.weather[0].description}
		</Typography>

		{/* Weather Details */}
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 0.5,
			}}
		>
			{/* Wind & Humidity */}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.3,
					}}
				>
					<WindIcon fontSize='small' color='primary' />
					<Typography variant='caption'>
						{formatWindSpeed(item.wind.speed, unitSystem)}
					</Typography>
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.3,
					}}
				>
					<HumidityIcon fontSize='small' color='primary' />
					<Typography variant='caption'>{item.main.humidity}%</Typography>
				</Box>
			</Box>

			{/* Rain Info Box - grouped together */}
			{(item.pop > 0 || (item.rain && item.rain['3h'])) && (
				<Box
					sx={{
						border: 1,
						borderColor: 'info.light',
						borderRadius: 1,
						p: 0.5,
						backgroundColor: 'info.50',
						display: 'flex',
						flexDirection: 'column',
						gap: 0.2,
					}}
				>
					{item.pop > 0 && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 0.3,
							}}
						>
							<RainIcon fontSize='small' color='info' />
							<Typography variant='caption' color='info.main'>
								{Math.round(item.pop * 100)}% chance
							</Typography>
						</Box>
					)}

					{item.rain && item.rain['3h'] && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 0.3,
							}}
						>
							<RainIcon fontSize='small' color='info' />
							<Typography variant='caption' color='info.main'>
								{formatPrecipitation(item.rain['3h'], unitSystem)}
							</Typography>
						</Box>
					)}
				</Box>
			)}

			{/* Snow Info Box - grouped together */}
			{item.snow && item.snow['3h'] && (
				<Box
					sx={{
						border: 1,
						borderColor: 'info.light',
						borderRadius: 1,
						p: 0.5,
						backgroundColor: 'grey.50',
						display: 'flex',
						flexDirection: 'column',
						gap: 0.2,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 0.3,
						}}
					>
						<SnowIcon fontSize='small' color='info' />
						<Typography variant='caption' color='info.main'>
							{formatPrecipitation(item.snow['3h'], unitSystem)}
						</Typography>
					</Box>
				</Box>
			)}
		</Box>
	</Box>
)

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
	forecast,
}) => {
	const { unitSystem } = useUnits()
	const dailyForecasts = groupForecastByDay(forecast.list)

	return (
		<Card elevation={3}>
			<CardContent sx={{ p: 3 }}>
				<Typography variant='h5' component='h2' fontWeight='bold' gutterBottom>
					5-Day Weather Forecast
				</Typography>
				<Typography
					variant='body2'
					color='text.secondary'
					gutterBottom
					sx={{ mb: 3 }}
				>
					Detailed 3-hour forecast data for {forecast.city.name},{' '}
					{forecast.city.country}
				</Typography>

				{dailyForecasts.map((day, index) => (
					<Accordion key={day.date} defaultExpanded={index === 0}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Box
								sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
							>
								<Avatar
									src={getWeatherIconUrl(day.icon)}
									sx={{ width: 50, height: 50, mr: 2 }}
								/>
								<Box sx={{ flex: 1 }}>
									<Typography variant='h6' fontWeight='medium'>
										{day.date}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
										sx={{ textTransform: 'capitalize' }}
									>
										{day.mainWeather}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
									{day.items.some(
										(item) => item.rain || item.snow || item.pop > 0
									) && (
										<Chip
											label={`Rain Expected`}
											color='info'
											variant='outlined'
											size='small'
										/>
									)}
									<Chip
										label={`${formatTemperature(
											day.maxTemp,
											unitSystem
										)} / ${formatTemperature(day.minTemp, unitSystem)}`}
										color='primary'
										variant='filled'
										size='medium'
										sx={{ fontWeight: 'bold' }}
									/>

									<Typography variant='body2' color='text.secondary'>
										{day.items.length} updates
									</Typography>
								</Box>
							</Box>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant='h6' gutterBottom>
								3-Hour Intervals
							</Typography>
							<Box
								sx={{
									display: 'flex',
									gap: 1.5,
									overflowX: 'auto',
									pb: 1,
									'&::-webkit-scrollbar': {
										height: 8,
									},
									'&::-webkit-scrollbar-track': {
										backgroundColor: 'grey.100',
										borderRadius: 4,
									},
									'&::-webkit-scrollbar-thumb': {
										backgroundColor: 'grey.400',
										borderRadius: 4,
										'&:hover': {
											backgroundColor: 'grey.500',
										},
									},
								}}
							>
								{day.items.map((item) => (
									<ForecastDetail
										key={item.dt}
										item={item}
										unitSystem={unitSystem}
									/>
								))}
							</Box>
						</AccordionDetails>
					</Accordion>
				))}

				<Divider sx={{ my: 3 }} />

				{/* Forecast Summary */}
				<Typography variant='h6' gutterBottom>
					Forecast Summary & Location Info
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Typography variant='body2' color='text.secondary'>
							Total forecast data points: {forecast.cnt}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							City timezone: UTC{forecast.city.timezone >= 0 ? '+' : ''}
							{forecast.city.timezone / 3600}
						</Typography>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<Typography variant='body2' color='text.secondary'>
							GPS coordinates: {forecast.city.coord.lat.toFixed(4)},{' '}
							{forecast.city.coord.lon.toFixed(4)}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							Sunrise time:{' '}
							{new Date(
								(forecast.city.sunrise + forecast.city.timezone) * 1000
							).toLocaleTimeString('en-US', {
								timeZone: 'UTC',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}
