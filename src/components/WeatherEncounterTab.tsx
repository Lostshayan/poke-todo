import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  CheckCircle2,
  Circle,
  Sparkles,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Search,
} from 'lucide-react';
import { PokemonSpecies, PrepItem, WeatherCondition, WeatherData } from '../types';
import { TYPE_COLORS } from '../data/pokemonCatalog';
import { PokemonSprite } from './PokemonSprite';
import { WeatherCanvas } from './WeatherCanvas';

interface WeatherEncounterTabProps {
  weather: WeatherData;
  wildPokemon: PokemonSpecies;
  prepItems: PrepItem[];
  alreadyCaughtToday: boolean;
  onTogglePrep: (id: string) => void;
  onCatchSuccess: () => void;
  onRerollSpawn: () => void;
  onSimulateWeather: (condition: WeatherCondition) => void;
  onSearchCity: (city: string) => Promise<void>;
  onUseCurrentLocation: () => void;
}

const WEATHER_GRADIENTS: Record<WeatherCondition, string> = {
  sunny: 'from-amber-950/80 via-orange-950/60 to-slate-900',
  rain: 'from-sky-950/90 via-blue-950/70 to-slate-900',
  thunderstorm: 'from-indigo-950/95 via-purple-950/70 to-slate-950',
  snow: 'from-cyan-950/80 via-slate-900 to-slate-950',
  fog: 'from-slate-800/80 via-zinc-900 to-slate-950',
  windy: 'from-teal-950/80 via-emerald-950/50 to-slate-900',
  cloudy: 'from-slate-900 via-slate-800/80 to-slate-950',
};

export const WeatherEncounterTab: React.FC<WeatherEncounterTabProps> = ({
  weather,
  wildPokemon,
  prepItems,
  alreadyCaughtToday,
  onTogglePrep,
  onCatchSuccess,
  onRerollSpawn,
  onSimulateWeather,
  onSearchCity,
  onUseCurrentLocation,
}) => {
  const [cityInput, setCityInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [catchPhase, setCatchPhase] = useState<'idle' | 'throwing' | 'wobbling' | 'caught'>('idle');

  const completedPrep = prepItems.filter((p) => p.completed).length;
  const allPrepDone = prepItems.length > 0 && completedPrep === prepItems.length;
  const readinessPct = prepItems.length > 0 ? Math.round((completedPrep / prepItems.length) * 100) : 0;

  const handleThrowPokeball = () => {
    if (!allPrepDone || catchPhase !== 'idle') return;
    setCatchPhase('throwing');
    setTimeout(() => setCatchPhase('wobbling'), 650);
    setTimeout(() => {
      setCatchPhase('caught');
      onCatchSuccess();
    }, 2400);
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setSearching(true);
    await onSearchCity(cityInput.trim());
    setSearching(false);
    setCityInput('');
  };

  return (
    <div className="space-y-6">
      {/* Location & Weather Simulator Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleCitySubmit} className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Change city (e.g., Tokyo, London)..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-2 text-slate-200 transition"
          >
            {searching ? '...' : 'Set City'}
          </button>
          <button
            type="button"
            onClick={onUseCurrentLocation}
            title="Use GPS Location"
            className="inline-flex items-center gap-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold px-3 py-2 transition"
          >
            <MapPin className="w-3.5 h-3.5" /> GPS
          </button>
        </form>

        {/* Weather Preview Simulator */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Test Weather:
          </span>
          {(['sunny', 'rain', 'thunderstorm', 'snow', 'fog', 'windy'] as WeatherCondition[]).map(
            (cond) => (
              <button
                key={cond}
                onClick={() => {
                  setCatchPhase('idle');
                  onSimulateWeather(cond);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize border transition ${
                  weather.condition === cond
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cond}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wild Encounter Stage */}
        <section
          className={`lg:col-span-7 relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b ${WEATHER_GRADIENTS[weather.condition]} p-6 min-h-[420px] flex flex-col justify-between shadow-2xl`}
        >
          <WeatherCanvas condition={weather.condition} />

          {/* Weather HUD */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {weather.locationName}
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white">{weather.tempC}°C</span>
                <span className="text-sm font-medium text-slate-300">{weather.description}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2">
                <Sun className="w-3.5 h-3.5 text-amber-300 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">UV</div>
                <div className="text-xs font-bold text-white">{weather.uvIndex}</div>
              </div>
              <div className="rounded-xl bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2">
                <Droplets className="w-3.5 h-3.5 text-sky-300 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">Humid</div>
                <div className="text-xs font-bold text-white">{weather.humidity}%</div>
              </div>
              <div className="rounded-xl bg-black/30 backdrop-blur-md border border-white/10 px-3 py-2">
                <Wind className="w-3.5 h-3.5 text-emerald-300 mx-auto mb-0.5" />
                <div className="text-[10px] text-slate-400">Wind</div>
                <div className="text-xs font-bold text-white">{weather.windKmh}km/h</div>
              </div>
            </div>
          </div>

          {/* Center Animated Pokémon / Catching Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center my-6">
            {catchPhase === 'idle' && (
              <>
                <div className="relative">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black/45 blur-md" />
                  <PokemonSprite id={wildPokemon.id} name={wildPokemon.name} size="xl" />
                </div>
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-2xl font-extrabold text-white">Wild {wildPokemon.name}</h3>
                    {wildPokemon.types.map((t) => (
                      <span
                        key={t}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          TYPE_COLORS[t] || 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-300/90 mt-1 max-w-md">{wildPokemon.flavor}</p>
                </div>
              </>
            )}

            {catchPhase === 'throwing' && (
              <div className="flex flex-col items-center py-8">
                <PokemonSprite id={wildPokemon.id} name={wildPokemon.name} size="xl" capturing />
                <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-gradient-to-b from-rose-500 via-rose-500 to-white animate-pokeball-throw shadow-xl relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-900" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
                </div>
              </div>
            )}

            {catchPhase === 'wobbling' && (
              <div className="flex flex-col items-center py-12">
                <div className="w-14 h-14 rounded-full border-4 border-slate-900 bg-gradient-to-b from-rose-500 via-rose-500 to-white animate-pokeball-wobble shadow-2xl relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-900" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
                </div>
                <p className="mt-4 text-sm font-bold text-amber-300 animate-pulse">
                  Catching {wildPokemon.name}...
                </p>
              </div>
            )}

            {catchPhase === 'caught' && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="relative">
                  <Sparkles className="w-10 h-10 text-amber-300 absolute -top-3 -right-4 animate-sparkle-burst" />
                  <PokemonSprite id={wildPokemon.id} name={wildPokemon.name} size="xl" />
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-1 text-sm font-bold text-emerald-300">
                  Gotcha! {wildPokemon.name} was added to your Pokédex!
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="relative z-10 flex items-center justify-between gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setCatchPhase('idle');
                onRerollSpawn();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-black/35 hover:bg-black/50 border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reroll Wild Spawn
            </button>

            <button
              onClick={handleThrowPokeball}
              disabled={!allPrepDone || catchPhase !== 'idle' || alreadyCaughtToday}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition shadow-lg ${
                alreadyCaughtToday
                  ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 cursor-default'
                  : allPrepDone && catchPhase === 'idle'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white cursor-pointer'
                    : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {alreadyCaughtToday
                ? 'Caught Today ✓'
                : allPrepDone
                  ? 'Throw Pokéball!'
                  : `Complete Prep (${completedPrep}/${prepItems.length})`}
            </button>
          </div>
        </section>

        {/* Morning Prep Checklist Card */}
        <section className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Thermometer className="w-3.5 h-3.5" /> Morning Departure Prep
              </span>
              <span className="font-mono text-xs font-bold text-slate-300">{readinessPct}% Ready</span>
            </div>
            <h2 className="text-xl font-bold text-white">Today’s Weather Checklist</h2>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Generated from live local weather. Check off every item to unlock the Pokéball throw.
            </p>

            {/* Readiness Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden mb-5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${readinessPct}%` }}
              />
            </div>

            <div className="space-y-3">
              {prepItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTogglePrep(item.id)}
                  className={`w-full flex items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                    item.completed
                      ? 'bg-emerald-500/10 border-emerald-500/35'
                      : 'bg-slate-950/75 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-semibold ${
                        item.completed ? 'text-emerald-200 line-through' : 'text-white'
                      }`}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.reason}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-4 text-xs text-slate-400">
            <strong className="text-slate-200">Why this works:</strong> Every Pokémon in your Pokédex
            remembers the exact weather &amp; morning prep routine you completed on the day you caught it.
          </div>
        </section>
      </div>
    </div>
  );
};
