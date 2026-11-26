import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Droplets,
  Zap,
  Leaf,
  Sparkles,
  Plus,
  Trash2,
  CloudSun,
  ArrowRight,
  Star,
} from 'lucide-react';
import { CaughtPokemon, TaskElementType, TodoItem, WeatherData } from '../types';
import { POKEMON_CATALOG, TYPE_COLORS } from '../data/pokemonCatalog';
import { PokemonSprite } from './PokemonSprite';

interface HomeTabProps {
  weather: WeatherData | null;
  buddy: CaughtPokemon | null;
  favorites: CaughtPokemon[];
  todos: TodoItem[];
  todayCaught: boolean;
  onAddTodo: (title: string, type: TaskElementType) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onSelectBuddy: (uid: string) => void;
  onNavigateWeather: () => void;
}

const ELEMENT_META: Record<
  TaskElementType,
  { label: string; xp: number; icon: React.ReactNode; badge: string }
> = {
  fire: {
    label: 'Urgent',
    xp: 35,
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  },
  water: {
    label: 'Deep Work',
    xp: 30,
    icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  },
  electric: {
    label: 'Quick Win',
    xp: 15,
    icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  grass: {
    label: 'Routine',
    xp: 20,
    icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />,
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  psychic: {
    label: 'Strategy',
    xp: 25,
    icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
    badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  },
};

export const HomeTab: React.FC<HomeTabProps> = ({
  weather,
  buddy,
  favorites,
  todos,
  todayCaught,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onSelectBuddy,
  onNavigateWeather,
}) => {
  const [newTask, setNewTask] = useState('');
  const [selectedType, setSelectedType] = useState<TaskElementType>('water');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAddTodo(trimmed, selectedType);
    setNewTask('');
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const buddySpecies = buddy ? POKEMON_CATALOG[buddy.pokemonId] : null;
  const xpIntoLevel = buddy ? buddy.xp % 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Active Buddy + Favorite Squad + Weather Quick Banner */}
      <div className="lg:col-span-5 space-y-6">
        {/* Active Buddy Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-6 shadow-xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> Active Partner
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">
                {buddy ? buddy.name : 'No Partner Selected'}
              </h2>
            </div>
            {buddy && (
              <span className="rounded-full bg-slate-800/90 border border-slate-700 px-3 py-1 font-mono text-xs font-bold text-amber-300">
                Lv. {buddy.level}
              </span>
            )}
          </div>

          {buddy ? (
            <div className="flex flex-col items-center py-3">
              <div className="relative flex items-center justify-center w-44 h-44 rounded-full bg-radial from-indigo-500/15 to-transparent">
                <div className="absolute bottom-3 w-24 h-4 rounded-full bg-black/40 blur-sm" />
                <PokemonSprite id={buddy.pokemonId} name={buddy.name} size="xl" />
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {buddy.types.map((t) => (
                  <span
                    key={t}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      TYPE_COLORS[t] || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* XP Bar */}
              <div className="w-full mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Partner EXP (Complete tasks to level up)</span>
                  <span className="font-mono text-slate-300">{xpIntoLevel} / 100 XP</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${xpIntoLevel}%` }}
                  />
                </div>
                {buddySpecies?.evolutionId && buddySpecies.evolutionLevel && (
                  <p className="text-[11px] text-indigo-300/90 text-right">
                    Evolves into {POKEMON_CATALOG[buddySpecies.evolutionId]?.name} at Lv.{' '}
                    {buddySpecies.evolutionLevel}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-8 text-center">
              Catch a Pokémon or favorite one in your Pokédex to set your partner!
            </p>
          )}

          {/* Favorite Squad Quick Switcher */}
          {favorites.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-slate-400 mb-2.5">
                Favorite Squad ({favorites.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {favorites.map((fav) => {
                  const isActive = buddy?.uid === fav.uid;
                  return (
                    <button
                      key={fav.uid}
                      onClick={() => onSelectBuddy(fav.uid)}
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 border text-left transition shrink-0 ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400/50 text-amber-200'
                          : 'bg-slate-800/60 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <PokemonSprite id={fav.pokemonId} name={fav.name} size="sm" floating={false} />
                      <div className="pr-1">
                        <div className="text-xs font-bold leading-tight">{fav.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Lv.{fav.level}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Morning Weather Prep Callout */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-300">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {weather ? `${weather.tempC}°C · ${weather.description}` : 'Checking local weather...'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {todayCaught
                  ? 'Morning prep completed & today’s spawn caught!'
                  : 'A wild weather Pokémon is waiting! Complete your morning prep to catch it.'}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateWeather}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-3.5 py-2.5 transition"
          >
            {todayCaught ? 'View' : 'Prep Now'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </div>

      {/* Right Column: Daily To-Do List */}
      <section className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Daily To-Do List</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Check off tasks to feed EXP to {buddy?.name || 'your partner'} and advance weekly goals.
            </p>
          </div>
          <div className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-mono text-slate-300">
            {completedCount} / {todos.length} Done
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task for today (e.g., Finish API integration)..."
              className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-4 py-2.5 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(ELEMENT_META) as TaskElementType[]).map((type) => {
              const meta = ELEMENT_META[type];
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? `${meta.badge} ring-1 ring-white/25`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {meta.icon}
                  {meta.label}
                  <span className="font-mono text-[10px] opacity-75">+{meta.xp}XP</span>
                </button>
              );
            })}
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
          {todos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center text-slate-500 text-sm">
              No tasks yet. Add your first task above to start training!
            </div>
          ) : (
            todos.map((todo) => {
              const meta = ELEMENT_META[todo.elementType];
              return (
                <div
                  key={todo.id}
                  className={`group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition ${
                    todo.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-65'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-amber-400 shrink-0 transition" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.badge}`}
                    >
                      {meta.icon}
                      +{todo.xp} XP
                    </span>
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      aria-label="Delete task"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
