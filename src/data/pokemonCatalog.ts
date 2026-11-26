import { PokemonSpecies, WeatherCondition } from '../types';

export const getAnimatedSpriteUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;

export const getOfficialArtworkUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const POKEMON_CATALOG: Record<number, PokemonSpecies> = {
  // Grass / Sunny / Mild
  1: {
    id: 1,
    name: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    weatherAffinity: ['sunny', 'cloudy'],
    flavor: 'Soaks up morning sunlight through the seed on its back.',
    evolutionId: 2,
    evolutionLevel: 5,
  },
  2: {
    id: 2,
    name: 'Ivysaur',
    types: ['Grass', 'Poison'],
    weatherAffinity: ['sunny', 'cloudy'],
    flavor: 'Its bud swells when exposed to warm daylight.',
    evolutionId: 3,
    evolutionLevel: 10,
  },
  3: {
    id: 3,
    name: 'Venusaur',
    types: ['Grass', 'Poison'],
    weatherAffinity: ['sunny'],
    flavor: 'Thrives in bright weather, releasing a calming aroma.',
  },
  // Fire / Sunny
  4: {
    id: 4,
    name: 'Charmander',
    types: ['Fire'],
    weatherAffinity: ['sunny'],
    flavor: 'Its tail flame burns brightest on clear, dry mornings.',
    evolutionId: 5,
    evolutionLevel: 5,
  },
  5: {
    id: 5,
    name: 'Charmeleon',
    types: ['Fire'],
    weatherAffinity: ['sunny'],
    flavor: 'Drawn to high-UV afternoons and intense heat.',
    evolutionId: 6,
    evolutionLevel: 10,
  },
  6: {
    id: 6,
    name: 'Charizard',
    types: ['Fire', 'Flying'],
    weatherAffinity: ['sunny', 'windy'],
    flavor: 'Soars high above clear skies.',
  },
  // Water / Rain
  7: {
    id: 7,
    name: 'Squirtle',
    types: ['Water'],
    weatherAffinity: ['rain', 'cloudy'],
    flavor: 'Loves splashing through fresh morning puddles.',
    evolutionId: 8,
    evolutionLevel: 5,
  },
  8: {
    id: 8,
    name: 'Wartortle',
    types: ['Water'],
    weatherAffinity: ['rain'],
    flavor: 'Hides in rain-slicked streets with ears twitching.',
    evolutionId: 9,
    evolutionLevel: 10,
  },
  9: {
    id: 9,
    name: 'Blastoise',
    types: ['Water'],
    weatherAffinity: ['rain'],
    flavor: 'Unfazed by even the heaviest downpours.',
  },
  // Electric / Thunderstorm
  25: {
    id: 25,
    name: 'Pikachu',
    types: ['Electric'],
    weatherAffinity: ['thunderstorm', 'sunny'],
    flavor: 'Its cheeks crackle when storm clouds gather overhead.',
    evolutionId: 26,
    evolutionLevel: 6,
  },
  26: {
    id: 26,
    name: 'Raichu',
    types: ['Electric'],
    weatherAffinity: ['thunderstorm'],
    flavor: 'Absorbs static electricity from humid storm air.',
  },
  125: {
    id: 125,
    name: 'Electabuzz',
    types: ['Electric'],
    weatherAffinity: ['thunderstorm'],
    flavor: 'Appears near power lines whenever lightning strikes.',
  },
  // Ghost / Fog
  92: {
    id: 92,
    name: 'Gastly',
    types: ['Ghost', 'Poison'],
    weatherAffinity: ['fog', 'cloudy'],
    flavor: 'Drifts silently through thick morning mist.',
    evolutionId: 93,
    evolutionLevel: 5,
  },
  93: {
    id: 93,
    name: 'Haunter',
    types: ['Ghost', 'Poison'],
    weatherAffinity: ['fog'],
    flavor: 'Lurks where visibility drops below a few meters.',
    evolutionId: 94,
    evolutionLevel: 10,
  },
  94: {
    id: 94,
    name: 'Gengar',
    types: ['Ghost', 'Poison'],
    weatherAffinity: ['fog'],
    flavor: 'Chills the air around it by 5°C on foggy evenings.',
  },
  // Eevee & Rain/Sun
  133: {
    id: 133,
    name: 'Eevee',
    types: ['Normal'],
    weatherAffinity: ['cloudy', 'sunny', 'windy'],
    flavor: 'Adapts effortlessly to shifting daily weather.',
    evolutionId: 134,
    evolutionLevel: 6,
  },
  134: {
    id: 134,
    name: 'Vaporeon',
    types: ['Water'],
    weatherAffinity: ['rain'],
    flavor: 'Its cells resemble water molecules; it melts into rain.',
  },
  135: {
    id: 135,
    name: 'Jolteon',
    types: ['Electric'],
    weatherAffinity: ['thunderstorm'],
    flavor: 'Charged up by ionized storm fronts.',
  },
  136: {
    id: 136,
    name: 'Flareon',
    types: ['Fire'],
    weatherAffinity: ['sunny'],
    flavor: 'Keeps warm even when temperatures swing.',
  },
  // Snow / Ice
  220: {
    id: 220,
    name: 'Swinub',
    types: ['Ice', 'Ground'],
    weatherAffinity: ['snow'],
    flavor: 'Sniffs out frozen paths under fresh snowfall.',
    evolutionId: 221,
    evolutionLevel: 6,
  },
  221: {
    id: 221,
    name: 'Piloswine',
    types: ['Ice', 'Ground'],
    weatherAffinity: ['snow'],
    flavor: 'Thick fur shields it from biting winter winds.',
  },
  361: {
    id: 361,
    name: 'Snorunt',
    types: ['Ice'],
    weatherAffinity: ['snow'],
    flavor: 'Said to bring prosperity to homes it visits on snowy days.',
  },
  363: {
    id: 363,
    name: 'Spheal',
    types: ['Ice', 'Water'],
    weatherAffinity: ['snow', 'rain'],
    flavor: 'Rolls happily across icy sidewalks.',
  },
  // Rain / Windy / Castform
  270: {
    id: 270,
    name: 'Lotad',
    types: ['Water', 'Grass'],
    weatherAffinity: ['rain'],
    flavor: 'Carries rainwater on the broad leaf atop its head.',
    evolutionId: 271,
    evolutionLevel: 5,
  },
  271: {
    id: 271,
    name: 'Lombre',
    types: ['Water', 'Grass'],
    weatherAffinity: ['rain'],
    flavor: 'Becomes energetic right after rain showers start.',
    evolutionId: 272,
    evolutionLevel: 10,
  },
  272: {
    id: 272,
    name: 'Ludicolo',
    types: ['Water', 'Grass'],
    weatherAffinity: ['rain'],
    flavor: 'Dances in the rain without a single worry.',
  },
  351: {
    id: 351,
    name: 'Castform',
    types: ['Normal'],
    weatherAffinity: ['cloudy', 'windy', 'sunny', 'rain', 'snow'],
    flavor: 'Its molecular structure transforms with every weather shift.',
  },
  333: {
    id: 333,
    name: 'Swablu',
    types: ['Normal', 'Flying'],
    weatherAffinity: ['cloudy', 'windy'],
    flavor: 'Floats alongside cumulus clouds like cotton wings.',
    evolutionId: 334,
    evolutionLevel: 7,
  },
  334: {
    id: 334,
    name: 'Altaria',
    types: ['Dragon', 'Flying'],
    weatherAffinity: ['cloudy', 'windy'],
    flavor: 'Glides effortlessly on high-altitude wind currents.',
  },
  18: {
    id: 18,
    name: 'Pidgeot',
    types: ['Normal', 'Flying'],
    weatherAffinity: ['windy'],
    flavor: 'Rides brisk gusts at Mach 2 speeds.',
  },
  182: {
    id: 182,
    name: 'Bellossom',
    types: ['Grass'],
    weatherAffinity: ['sunny'],
    flavor: 'Petals open wide whenever the sun breaks through.',
  },
  338: {
    id: 338,
    name: 'Solrock',
    types: ['Rock', 'Psychic'],
    weatherAffinity: ['sunny'],
    flavor: 'Radiates intense solar energy on high-UV days.',
  },
  198: {
    id: 198,
    name: 'Murkrow',
    types: ['Dark', 'Flying'],
    weatherAffinity: ['fog', 'windy'],
    flavor: 'Spots shiny objects even through dense fog.',
  },

  // LEGENDARY POOL (Weekly & Monthly Milestone Rewards)
  144: {
    id: 144,
    name: 'Articuno',
    types: ['Ice', 'Flying'],
    weatherAffinity: ['snow', 'windy'],
    flavor: 'Legendary bird of ice. Rewards unwavering winter discipline.',
    isLegendary: true,
  },
  145: {
    id: 145,
    name: 'Zapdos',
    types: ['Electric', 'Flying'],
    weatherAffinity: ['thunderstorm', 'windy'],
    flavor: 'Legendary bird of lightning. Drawn to high-momentum streaks.',
    isLegendary: true,
  },
  146: {
    id: 146,
    name: 'Moltres',
    types: ['Fire', 'Flying'],
    weatherAffinity: ['sunny'],
    flavor: 'Legendary bird of flame. Appears for trainers on a hot streak.',
    isLegendary: true,
  },
  150: {
    id: 150,
    name: 'Mewtwo',
    types: ['Psychic'],
    weatherAffinity: ['fog', 'cloudy'],
    flavor: 'Ultimate psychic powerhouse. Earned through deep focus.',
    isLegendary: true,
  },
  249: {
    id: 249,
    name: 'Lugia',
    types: ['Psychic', 'Flying'],
    weatherAffinity: ['rain', 'thunderstorm'],
    flavor: 'Guardian of the seas. Calms storms for prepared trainers.',
    isLegendary: true,
  },
  382: {
    id: 382,
    name: 'Kyogre',
    types: ['Water'],
    weatherAffinity: ['rain'],
    flavor: 'Titan of the oceans. Commands torrential rains.',
    isLegendary: true,
  },
  383: {
    id: 383,
    name: 'Groudon',
    types: ['Ground'],
    weatherAffinity: ['sunny'],
    flavor: 'Titan of the land. Radiates unstoppable sunlight.',
    isLegendary: true,
  },
  384: {
    id: 384,
    name: 'Rayquaza',
    types: ['Dragon', 'Flying'],
    weatherAffinity: ['windy', 'cloudy'],
    flavor: 'Sky-high guardian of the ozone. Master of all weather.',
    isLegendary: true,
  },
  491: {
    id: 491,
    name: 'Darkrai',
    types: ['Dark'],
    weatherAffinity: ['fog'],
    flavor: 'Emerges from the mist to honor monthly milestone mastery.',
    isLegendary: true,
  },
};

export const LEGENDARY_IDS = Object.values(POKEMON_CATALOG)
  .filter((p) => p.isLegendary)
  .map((p) => p.id);

export function getWildPoolForWeather(condition: WeatherCondition): PokemonSpecies[] {
  const matches = Object.values(POKEMON_CATALOG).filter(
    (p) => !p.isLegendary && p.weatherAffinity.includes(condition)
  );
  if (matches.length > 0) return matches;
  return [POKEMON_CATALOG[351], POKEMON_CATALOG[133]];
}

export function pickRandomLegendary(excludeIds: number[] = []): PokemonSpecies {
  const available = LEGENDARY_IDS.filter((id) => !excludeIds.includes(id));
  const pool = available.length > 0 ? available : LEGENDARY_IDS;
  const chosenId = pool[Math.floor(Math.random() * pool.length)];
  return POKEMON_CATALOG[chosenId];
}

export const TYPE_COLORS: Record<string, string> = {
  Fire: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Water: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  Grass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Electric: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  Ice: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40',
  Ghost: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Poison: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  Flying: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/40',
  Normal: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
  Dragon: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  Psychic: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  Dark: 'bg-zinc-600/30 text-zinc-200 border-zinc-500/40',
  Ground: 'bg-yellow-700/30 text-yellow-300 border-yellow-600/40',
  Rock: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
};
