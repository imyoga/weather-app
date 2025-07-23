export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}

export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
  pod?: string; // Part of day (forecast only)
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: Weather[];
  base: string;
  main: MainWeather;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: Rain;
  snow?: Snow;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastCity {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// Geocoding API types
export interface GeocodeResult {
  annotations: {
    callingcode: number;
    currency: {
      name: string;
      code: string;
    };
    flag: string;
    timezone: {
      name: string;
      offset_sec: number;
    };
  };
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  components: {
    'ISO_3166-1_alpha-2': string;
    'ISO_3166-1_alpha-3': string;
    city?: string;
    country: string;
    country_code: string;
    state?: string;
    state_code?: string;
    postcode?: string;
    suburb?: string;
  };
  confidence: number;
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

export interface GeocodeResponse {
  documentation: string;
  licenses: Array<{
    name: string;
    url: string;
  }>;
  rate: {
    limit: number;
    remaining: number;
    reset: number;
  };
  results: GeocodeResult[];
  status: {
    code: number;
    message: string;
  };
  stay_informed: {
    blog: string;
    mastodon: string;
  };
  thanks: string;
  timestamp: {
    created_http: string;
    created_unix: number;
  };
  total_results: number;
}

export interface LocationSearchResult {
  formatted: string;
  city?: string;
  state?: string;
  country: string;
  coordinates: Coordinates;
} 