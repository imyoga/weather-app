# 🌤️ Comprehensive Weather Dashboard

A modern, feature-rich weather application built with React, TypeScript, and Material-UI that displays comprehensive meteorological data from OpenWeatherMap's free API.

![Weather Dashboard](https://via.placeholder.com/800x400/1976d2/white?text=Weather+Dashboard)

## ✨ Features

### 🌡️ Current Weather Display
- **Temperature**: Current, feels-like, min/max temperatures
- **Weather Conditions**: Description, weather icons, cloudiness
- **Wind Information**: Speed, direction, gusts
- **Atmospheric Data**: Pressure (sea level, ground level), humidity
- **Visibility**: Current visibility distance
- **Sun Information**: Sunrise and sunset times
- **Precipitation**: Rain and snow data (when available)
- **Location Details**: Coordinates, timezone, country

### 📅 5-Day Weather Forecast
- **3-Hour Intervals**: Detailed forecast every 3 hours
- **Daily Summaries**: Min/max temperatures, dominant weather conditions
- **Precipitation Probability**: Chance of rain/snow
- **Expandable Details**: Click to see hourly breakdowns
- **Complete Data**: All available meteorological parameters

### 🔍 Location Search & Detection
- **Smart Search**: City, state, country search with autocomplete
- **Current Location**: Automatic geolocation detection
- **Global Coverage**: Search anywhere in the world
- **Location History**: Easy access to recent searches

### 🎨 Modern UI/UX
- **Dark/Light Theme**: Automatic system detection + manual toggle
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material Design**: Clean, modern interface with MUI components
- **Smooth Animations**: Polished transitions and hover effects
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 Technical Features
- **TypeScript**: Full type safety
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Loading States**: Beautiful loading indicators
- **Offline Support**: Graceful handling of network issues
- **Performance**: Optimized API calls and component rendering

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and yarn package manager
- OpenWeatherMap API key (free tier available)
- OpenCage Geocoding API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure API Keys**
   The API keys are already configured in `src/envs/code.ts`:
   - OpenWeatherMap API Key: `b81cd1a66eaee287ea9830aa66250511`
   - OpenCage Geocoding API Key: `066c930b1b9f4d9bb89733fb93e9827b`

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Building for Production
```bash
yarn build
yarn preview
```

## 📊 Available Weather Data

Based on OpenWeatherMap's free tier, the app displays:

### Current Weather (`/weather` endpoint)
- **Location**: City name, country, coordinates
- **Temperature**: Current, feels-like, min, max (°C)
- **Weather**: Main condition, description, icon
- **Wind**: Speed (km/h), direction, gusts
- **Atmospheric**: Pressure (hPa), humidity (%), visibility (km)
- **Clouds**: Cloud coverage percentage
- **Precipitation**: Rain/snow volume (mm) - when available
- **Sun**: Sunrise/sunset times
- **System**: Country code, timezone offset

### 5-Day Forecast (`/forecast` endpoint)
- **40 Data Points**: 3-hour intervals for 5 days
- **All Current Weather Fields**: Plus precipitation probability
- **Daily Grouping**: Automatic grouping by date
- **Extended Data**: Sea/ground level pressure when available

## 🎯 Usage

### Search for a Location
1. Use the search bar at the top of the page
2. Type at least 3 characters of a city, state, or country name
3. Select from the autocomplete suggestions
4. Weather data will load automatically

### Use Current Location
1. Click the location icon in the app bar or the "Use Current Location" button
2. Allow location access when prompted
3. Your local weather will be displayed

### Toggle Dark/Light Mode
- Click the sun/moon icon in the app bar
- The theme preference is saved automatically

### View Detailed Forecast
- Scroll down to the 5-Day Forecast section
- Click on any day to expand detailed 3-hour intervals
- Each interval shows comprehensive weather data

## 🏗️ Technical Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── CurrentWeather.tsx    # Current weather display
│   ├── WeatherForecast.tsx   # 5-day forecast
│   ├── SearchBar.tsx         # Location search
│   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── LoadingSpinner.tsx    # Loading indicators
│   └── ErrorBoundary.tsx     # Error handling
├── context/            # React contexts
│   └── ThemeContext.tsx      # Theme management
├── services/           # API services
│   └── weatherApi.ts         # Weather and geocoding APIs
├── types/              # TypeScript types
│   └── weather.ts            # Weather data interfaces
├── theme/              # Material-UI theme
│   └── index.ts              # Theme configuration
├── envs/               # Environment configuration
│   └── code.ts               # API keys and URLs
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
├── App.css            # Component-specific styles
└── main.css           # Global styles
```

### Key Technologies
- **React 19** with TypeScript
- **Material-UI (MUI) v7** for components and theming
- **Vite** for build tooling and development
- **OpenWeatherMap API** for weather data
- **OpenCage Geocoding API** for location search

### API Rate Limits
- **OpenWeatherMap**: 60 calls/minute, 1,000,000 calls/month
- **OpenCage Geocoding**: 2,500 requests/day (free tier)

## 🎨 Customization

### Themes
The app supports full theme customization. Edit `src/theme/index.ts` to modify:
- Color schemes
- Typography
- Component styling
- Dark/light mode palettes

### Adding New Weather Data
To display additional weather fields:
1. Update TypeScript interfaces in `src/types/weather.ts`
2. Add display logic in weather components
3. Update formatting utilities in `src/services/weatherApi.ts`

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: Geolocation, Fetch API, CSS Grid, Flexbox

## 🔒 Privacy & Security

- **No Data Storage**: No user data is stored locally except theme preference
- **API Keys**: Included for demo purposes (replace with your own for production)
- **HTTPS Only**: All API calls use secure HTTPS connections
- **Location**: Geolocation is only used when explicitly requested

## 🐛 Troubleshooting

### Common Issues

**Weather data not loading**
- Check internet connection
- Verify API keys are valid
- Check browser console for errors

**Location search not working**
- Ensure you're typing at least 3 characters
- Check if geocoding API is accessible
- Try different search terms

**Dark mode not saving**
- Check if localStorage is enabled
- Clear browser cache and try again

**App not loading**
- Check if JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing comprehensive weather data
- **OpenCage** for geocoding services
- **Material-UI** for the excellent component library
- **React Team** for the amazing framework

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

Built with ❤️ using React, TypeScript, and Material-UI
