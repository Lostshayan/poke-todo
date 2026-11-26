export type WeatherCondition =
  | 'sunny'
  | 'rain'
  | 'thunderstorm'
  | 'cloudy'
  | 'snow'
  | 'fog'
  | 'windy';

export type TaskElementType = 'fire' | 'water' | 'grass' | 'electric' | 'psychic';

export interface WeatherData {
  condition: WeatherCondition;
  tempC: number;
  feelsLikeC: number;
  uvIndex: number;
  humidity: number;
  windKmh: number;
  locationName: string;
  description: string;
  isDay: boolean;
  updatedAt: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  types: string[];
  weatherAffinity: WeatherCondition[];
  flavor: string;
  isLegendary?: boolean;
  evolutionId?: number;
  evolutionLevel?: number;
}

export interface PrepItem {
  id: string;
  label: string;
  reason: string;
  icon: string;
  completed: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  xp: number;
  elementType: TaskElementType;
  createdAt: string;
  completedAt?: string;
}

export interface MilestoneGoal {
  id: string;
  title: string;
  period: 'weekly' | 'monthly';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardedPokemonId?: number;
  createdAt: string;
  completedAt?: string;
}

export interface CaughtPokemon {
  uid: string;
  pokemonId: number;
  name: string;
  types: string[];
  caughtAt: string;
  weatherCondition: WeatherCondition;
  tempC: number;
  locationName: string;
  prepCompleted: string[];
  tasksDoneThatDay: number;
  milestoneTitle?: string;
  isLegendary: boolean;
  xp: number;
  level: number;
  isFavorite: boolean;
}

export type AppTab = 'home' | 'weather' | 'planner' | 'pokedex';
