import { PrepItem, WeatherCondition, WeatherData } from '../types';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  daily?: {
    uv_index_max?: number[];
  };
}

function mapWmoCodeToCondition(code: number, windKmh: number): { condition: WeatherCondition; description: string } {
  if (code >= 95) return { condition: 'thunderstorm', description: 'Thunderstorm & Lightning' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { condition: 'snow', description: 'Snowfall & Freezing Air' };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return { condition: 'rain', description: 'Rain Showers' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'fog', description: 'Dense Fog & Low Visibility' };
  }
  if (windKmh >= 28) {
    return { condition: 'windy', description: 'Brisk Gusty Winds' };
  }
  if (code === 0 || code === 1) {
    return { condition: 'sunny', description: 'Clear & Sunny Skies' };
  }
  return { condition: 'cloudy', description: 'Overcast & Mild' };
}

export async function fetchLocalWeather(
  lat?: number,
  lon?: number,
  customLocationName?: string
): Promise<WeatherData> {
  // Default to a sensible fallback if geolocation is unavailable or denied
  const targetLat = lat ?? 28.6139;
  const targetLon = lon ?? 77.209;
  const fallbackName = customLocationName ?? (lat ? 'Local Area' : 'New Delhi (Default)');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=uv_index_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = (await res.json()) as OpenMeteoResponse;
  const { condition, description } = mapWmoCodeToCondition(
    data.current.weather_code,
    data.current.wind_speed_10m
  );

  return {
    condition,
    tempC: Math.round(data.current.temperature_2m),
    feelsLikeC: Math.round(data.current.apparent_temperature),
    humidity: Math.round(data.current.relative_humidity_2m),
    windKmh: Math.round(data.current.wind_speed_10m),
    uvIndex: Math.round(data.daily?.uv_index_max?.[0] ?? 4),
    isDay: data.current.is_day === 1,
    locationName: fallbackName,
    description,
    updatedAt: new Date().toISOString(),
  };
}

export async function searchCityCoordinates(query: string): Promise<{
  name: string;
  lat: number;
  lon: number;
} | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const first = json?.results?.[0];
  if (!first) return null;
  return {
    name: `${first.name}${first.country_code ? `, ${first.country_code}` : ''}`,
    lat: first.latitude,
    lon: first.longitude,
  };
}

export function generateMorningPrepChecklist(weather: WeatherData): PrepItem[] {
  const items: PrepItem[] = [];

  if (weather.condition === 'rain' || weather.condition === 'thunderstorm') {
    items.push({
      id: 'prep-umbrella',
      label: 'Pack an umbrella or waterproof shell',
      reason: `${weather.description} expected outside`,
      icon: '☔',
      completed: false,
    });
    items.push({
      id: 'prep-shoes',
      label: 'Wear water-resistant footwear',
      reason: `Humidity at ${weather.humidity}% with wet streets`,
      icon: '🥾',
      completed: false,
    });
  }

  if (weather.condition === 'snow' || weather.tempC <= 8) {
    items.push({
      id: 'prep-thermal',
      label: 'Layer up with a warm coat or thermal',
      reason: `Feels like ${weather.feelsLikeC}°C outdoors`,
      icon: '🧥',
      completed: false,
    });
  } else if (weather.tempC <= 18 && weather.condition !== 'rain') {
    items.push({
      id: 'prep-jacket',
      label: 'Grab a light jacket or hoodie',
      reason: `Cool ${weather.tempC}°C breeze outside`,
      icon: '🧥',
      completed: false,
    });
  }

  if (weather.uvIndex >= 5 || weather.condition === 'sunny') {
    items.push({
      id: 'prep-sunscreen',
      label: 'Apply SPF 30+ sunscreen',
      reason: `UV index is ${weather.uvIndex} today`,
      icon: '🧴',
      completed: false,
    });
    items.push({
      id: 'prep-sunglasses',
      label: 'Bring sunglasses & water bottle',
      reason: weather.tempC >= 26 ? `Warm ${weather.tempC}°C — stay hydrated` : 'Bright glare protection',
      icon: '🕶️',
      completed: false,
    });
  }

  if (weather.condition === 'fog') {
    items.push({
      id: 'prep-visibility',
      label: 'Allow extra commute buffer for low visibility',
      reason: 'Foggy roads and slower transit',
      icon: '🌫️',
      completed: false,
    });
  }

  if (weather.condition === 'windy' || weather.windKmh >= 25) {
    items.push({
      id: 'prep-windbreaker',
      label: 'Wear a windbreaker & secure loose items',
      reason: `Wind gusts at ${weather.windKmh} km/h`,
      icon: '💨',
      completed: false,
    });
  }

  // Always ensure at least 3 meaningful prep items so catching feels rewarding
  if (items.length < 3) {
    items.push({
      id: 'prep-keys-wallet',
      label: 'Pocket check: Keys, Wallet, Phone charged',
      reason: 'Zero-stress departure check',
      icon: '🔑',
      completed: false,
    });
  }
  if (items.length < 3) {
    items.push({
      id: 'prep-water',
      label: 'Fill reusable water bottle before heading out',
      reason: 'Daily hydration habit',
      icon: '💧',
      completed: false,
    });
  }

  return items.slice(0, 4);
}

export const WEATHER_PRESETS: Record<WeatherCondition, WeatherData> = {
  sunny: {
    condition: 'sunny',
    tempC: 29,
    feelsLikeC: 31,
    uvIndex: 8,
    humidity: 40,
    windKmh: 11,
    locationName: 'Simulated: Sunny Day',
    description: 'Clear & Sunny Skies',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  rain: {
    condition: 'rain',
    tempC: 17,
    feelsLikeC: 16,
    uvIndex: 2,
    humidity: 88,
    windKmh: 18,
    locationName: 'Simulated: Rainy Morning',
    description: 'Rain Showers',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  thunderstorm: {
    condition: 'thunderstorm',
    tempC: 21,
    feelsLikeC: 22,
    uvIndex: 1,
    humidity: 92,
    windKmh: 34,
    locationName: 'Simulated: Thunderstorm',
    description: 'Thunderstorm & Lightning',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  snow: {
    condition: 'snow',
    tempC: -2,
    feelsLikeC: -6,
    uvIndex: 2,
    humidity: 76,
    windKmh: 16,
    locationName: 'Simulated: Snowfall',
    description: 'Snowfall & Freezing Air',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  fog: {
    condition: 'fog',
    tempC: 12,
    feelsLikeC: 11,
    uvIndex: 1,
    humidity: 95,
    windKmh: 6,
    locationName: 'Simulated: Dense Fog',
    description: 'Dense Fog & Low Visibility',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  windy: {
    condition: 'windy',
    tempC: 16,
    feelsLikeC: 13,
    uvIndex: 4,
    humidity: 55,
    windKmh: 36,
    locationName: 'Simulated: Gusty Winds',
    description: 'Brisk Gusty Winds',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
  cloudy: {
    condition: 'cloudy',
    tempC: 20,
    feelsLikeC: 20,
    uvIndex: 3,
    humidity: 62,
    windKmh: 12,
    locationName: 'Simulated: Overcast',
    description: 'Overcast & Mild',
    isDay: true,
    updatedAt: new Date().toISOString(),
  },
};
