import React, { useEffect, useState } from 'react';
import { Home, CloudSun, CalendarCheck2, BookOpen, Sparkles } from 'lucide-react';
import {
  AppTab,
  CaughtPokemon,
  MilestoneGoal,
  PokemonSpecies,
  PrepItem,
  TaskElementType,
  TodoItem,
  WeatherCondition,
  WeatherData,
} from './types';
import {
  POKEMON_CATALOG,
  getWildPoolForWeather,
  pickRandomLegendary,
} from './data/pokemonCatalog';
import {
  WEATHER_PRESETS,
  fetchLocalWeather,
  generateMorningPrepChecklist,
  searchCityCoordinates,
} from './services/weatherService';
import { HomeTab } from './components/HomeTab';
import { WeatherEncounterTab } from './components/WeatherEncounterTab';
import { PlannerTab } from './components/PlannerTab';
import { PokedexTab } from './components/PokedexTab';

const STORAGE_KEY = 'castform_prep_state_v1';

interface SavedState {
  caughtList: CaughtPokemon[];
  activeBuddyUid: string | null;
  todos: TodoItem[];
  milestones: MilestoneGoal[];
  lastWeatherCatchDate: string | null;
}

const DEFAULT_STARTER: CaughtPokemon = {
  uid: 'starter-eevee',
  pokemonId: 133,
  name: 'Eevee',
  types: ['Normal'],
  caughtAt: new Date().toISOString(),
  weatherCondition: 'sunny',
  tempC: 24,
  locationName: 'Starter Lab',
  prepCompleted: ['Pocket check: Keys, Wallet, Phone charged'],
  tasksDoneThatDay: 1,
  isLegendary: false,
  xp: 40,
  level: 1,
  isFavorite: true,
};

const DEFAULT_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Complete Morning Weather Prep & catch today’s spawn',
    completed: false,
    xp: 30,
    elementType: 'water',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'todo-2',
    title: 'Clear inbox & reply to urgent messages',
    completed: false,
    xp: 15,
    elementType: 'electric',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_MILESTONES: MilestoneGoal[] = [
  {
    id: 'ms-weekly-1',
    title: 'Complete 5 Morning Prep Routines',
    period: 'weekly',
    targetCount: 5,
    currentCount: 2,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ms-monthly-1',
    title: 'Ship Major Monthly Project',
    period: 'monthly',
    targetCount: 4,
    currentCount: 1,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

function loadSavedState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as SavedState;
    }
  } catch {
    // ignore corrupted storage
  }
  return {
    caughtList: [DEFAULT_STARTER],
    activeBuddyUid: DEFAULT_STARTER.uid,
    todos: DEFAULT_TODOS,
    milestones: DEFAULT_MILESTONES,
    lastWeatherCatchDate: null,
  };
}

export function App() {
  const [initial] = useState<SavedState>(() => loadSavedState());

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [caughtList, setCaughtList] = useState<CaughtPokemon[]>(initial.caughtList);
  const [activeBuddyUid, setActiveBuddyUid] = useState<string | null>(initial.activeBuddyUid);
  const [todos, setTodos] = useState<TodoItem[]>(initial.todos);
  const [milestones, setMilestones] = useState<MilestoneGoal[]>(initial.milestones);
  const [lastWeatherCatchDate, setLastWeatherCatchDate] = useState<string | null>(
    initial.lastWeatherCatchDate
  );

  const [weather, setWeather] = useState<WeatherData>(WEATHER_PRESETS.sunny);
  const [wildPokemon, setWildPokemon] = useState<PokemonSpecies>(POKEMON_CATALOG[351]);
  const [prepItems, setPrepItems] = useState<PrepItem[]>(() =>
    generateMorningPrepChecklist(WEATHER_PRESETS.sunny)
  );
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Persist state
  useEffect(() => {
    const payload: SavedState = {
      caughtList,
      activeBuddyUid,
      todos,
      milestones,
      lastWeatherCatchDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [caughtList, activeBuddyUid, todos, milestones, lastWeatherCatchDate]);

  const applyWeather = (data: WeatherData) => {
    setWeather(data);
    const pool = getWildPoolForWeather(data.condition);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setWildPokemon(pick);
    setPrepItems(generateMorningPrepChecklist(data));
  };

  const loadGpsWeather = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await fetchLocalWeather(pos.coords.latitude, pos.coords.longitude);
            applyWeather(data);
          } catch {
            // fallback silently
          }
        },
        async () => {
          try {
            const data = await fetchLocalWeather();
            applyWeather(data);
          } catch {
            // keep preset
          }
        },
        { timeout: 5000 }
      );
    } else {
      fetchLocalWeather().then(applyWeather).catch(() => {});
    }
  };

  useEffect(() => {
    loadGpsWeather();
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);
  const alreadyCaughtToday = lastWeatherCatchDate === todayKey;

  const activeBuddy =
    caughtList.find((c) => c.uid === activeBuddyUid) ?? caughtList[0] ?? null;
  const favorites = caughtList.filter((c) => c.isFavorite);

  const grantBuddyXp = (amount: number) => {
    if (!activeBuddy) return;
    setCaughtList((prev) =>
      prev.map((c) => {
        if (c.uid !== activeBuddy.uid) return c;
        const nextXp = Math.max(0, c.xp + amount);
        const nextLevel = Math.floor(nextXp / 100) + 1;
        const species = POKEMON_CATALOG[c.pokemonId];

        if (
          species?.evolutionId &&
          species.evolutionLevel &&
          nextLevel >= species.evolutionLevel
        ) {
          const evo = POKEMON_CATALOG[species.evolutionId];
          if (evo) {
            showToast(`✨ What?! ${c.name} evolved into ${evo.name}!`);
            return {
              ...c,
              pokemonId: evo.id,
              name: evo.name,
              types: evo.types,
              xp: nextXp,
              level: nextLevel,
            };
          }
        }
        return { ...c, xp: nextXp, level: nextLevel };
      })
    );
  };

  const handleAddTodo = (title: string, elementType: TaskElementType) => {
    const xpMap: Record<TaskElementType, number> = {
      fire: 35,
      water: 30,
      psychic: 25,
      grass: 20,
      electric: 15,
    };
    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      title,
      completed: false,
      xp: xpMap[elementType],
      elementType,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [item, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;
    const becomingComplete = !target.completed;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: becomingComplete,
              completedAt: becomingComplete ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    grantBuddyXp(becomingComplete ? target.xp : -target.xp);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTogglePrep = (id: string) => {
    setPrepItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p))
    );
  };

  const handleCatchSuccess = () => {
    const tasksDone = todos.filter((t) => t.completed).length;
    const newCatch: CaughtPokemon = {
      uid: `catch-${Date.now()}`,
      pokemonId: wildPokemon.id,
      name: wildPokemon.name,
      types: wildPokemon.types,
      caughtAt: new Date().toISOString(),
      weatherCondition: weather.condition,
      tempC: weather.tempC,
      locationName: weather.locationName,
      prepCompleted: prepItems.filter((p) => p.completed).map((p) => p.label),
      tasksDoneThatDay: tasksDone,
      isLegendary: false,
      xp: 0,
      level: 1,
      isFavorite: false,
    };
    setCaughtList((prev) => [newCatch, ...prev]);
    setLastWeatherCatchDate(todayKey);
    showToast(`🎉 Caught ${wildPokemon.name}! Logged to your Pokédex.`);
  };

  const handleRerollSpawn = () => {
    const pool = getWildPoolForWeather(weather.condition).filter((p) => p.id !== wildPokemon.id);
    const pick =
      pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : wildPokemon;
    setWildPokemon(pick);
    setLastWeatherCatchDate(null);
  };

  const handleSimulateWeather = (condition: WeatherCondition) => {
    applyWeather(WEATHER_PRESETS[condition]);
    setLastWeatherCatchDate(null);
  };

  const handleSearchCity = async (city: string) => {
    const coords = await searchCityCoordinates(city);
    if (!coords) {
      showToast(`Could not find city "${city}".`);
      return;
    }
    try {
      const data = await fetchLocalWeather(coords.lat, coords.lon, coords.name);
      applyWeather(data);
      showToast(`Updated weather for ${coords.name}`);
    } catch {
      showToast('Weather lookup failed. Try again.');
    }
  };

  const handleAddMilestone = (title: string, period: 'weekly' | 'monthly', targetCount: number) => {
    const goal: MilestoneGoal = {
      id: `ms-${Date.now()}`,
      title,
      period,
      targetCount,
      currentCount: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setMilestones((prev) => [goal, ...prev]);
  };

  const handleIncrementMilestone = (id: string): PokemonSpecies | null => {
    let unlocked: PokemonSpecies | null = null;
    const ownedLegendaries = caughtList.filter((c) => c.isLegendary).map((c) => c.pokemonId);

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id || m.completed) return m;
        const nextCount = m.currentCount + 1;
        if (nextCount >= m.targetCount) {
          unlocked = pickRandomLegendary(ownedLegendaries);
          const legendaryCatch: CaughtPokemon = {
            uid: `legend-${Date.now()}`,
            pokemonId: unlocked.id,
            name: unlocked.name,
            types: unlocked.types,
            caughtAt: new Date().toISOString(),
            weatherCondition: weather.condition,
            tempC: weather.tempC,
            locationName: weather.locationName,
            prepCompleted: [],
            tasksDoneThatDay: todos.filter((t) => t.completed).length,
            milestoneTitle: m.title,
            isLegendary: true,
            xp: 0,
            level: 50,
            isFavorite: true,
          };
          setCaughtList((cPrev) => [legendaryCatch, ...cPrev]);
          return {
            ...m,
            currentCount: nextCount,
            completed: true,
            rewardedPokemonId: unlocked.id,
            completedAt: new Date().toISOString(),
          };
        }
        return { ...m, currentCount: nextCount };
      })
    );
    return unlocked;
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleFavorite = (uid: string) => {
    setCaughtList((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    {
      id: 'weather',
      label: 'Weather Prep',
      icon: <CloudSun className="w-4 h-4" />,
      badge: alreadyCaughtToday ? undefined : 'Wild!',
    },
    { id: 'planner', label: 'Planner', icon: <CalendarCheck2 className="w-4 h-4" /> },
    {
      id: 'pokedex',
      label: 'Pokédex',
      icon: <BookOpen className="w-4 h-4" />,
      badge: String(caughtList.length),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-b from-rose-500 via-rose-500 to-white relative shadow">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-slate-900" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-none">
                Castform Prep
              </h1>
              <span className="text-[11px] text-slate-400">Weather · Routine · Pokédex</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition shrink-0 ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                        active
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-slate-900/95 backdrop-blur-md px-4 py-3 text-xs font-bold text-amber-200 shadow-2xl">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          {toast}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HomeTab
            weather={weather}
            buddy={activeBuddy}
            favorites={favorites}
            todos={todos}
            todayCaught={alreadyCaughtToday}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onSelectBuddy={(uid) => setActiveBuddyUid(uid)}
            onNavigateWeather={() => setActiveTab('weather')}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherEncounterTab
            weather={weather}
            wildPokemon={wildPokemon}
            prepItems={prepItems}
            alreadyCaughtToday={alreadyCaughtToday}
            onTogglePrep={handleTogglePrep}
            onCatchSuccess={handleCatchSuccess}
            onRerollSpawn={handleRerollSpawn}
            onSimulateWeather={handleSimulateWeather}
            onSearchCity={handleSearchCity}
            onUseCurrentLocation={loadGpsWeather}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerTab
            milestones={milestones}
            onAddMilestone={handleAddMilestone}
            onIncrementMilestone={handleIncrementMilestone}
            onDeleteMilestone={handleDeleteMilestone}
          />
        )}

        {activeTab === 'pokedex' && (
          <PokedexTab
            caughtList={caughtList}
            activeBuddyUid={activeBuddy?.uid ?? null}
            onToggleFavorite={handleToggleFavorite}
            onSetBuddy={(uid) => {
              setActiveBuddyUid(uid);
              setActiveTab('home');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
