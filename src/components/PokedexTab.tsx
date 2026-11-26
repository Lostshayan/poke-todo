import React, { useRef, useState } from 'react';
import { BookOpen, Star, Crown, CloudSun, CheckSquare, Search, X } from 'lucide-react';
import { CaughtPokemon } from '../types';
import { TYPE_COLORS } from '../data/pokemonCatalog';
import { PokemonSprite } from './PokemonSprite';

interface PokedexTabProps {
  caughtList: CaughtPokemon[];
  activeBuddyUid: string | null;
  onToggleFavorite: (uid: string) => void;
  onSetBuddy: (uid: string) => void;
}

export const PokedexTab: React.FC<PokedexTabProps> = ({
  caughtList,
  activeBuddyUid,
  onToggleFavorite,
  onSetBuddy,
}) => {
  const [filter, setFilter] = useState<'all' | 'weather' | 'legendary' | 'favorites'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CaughtPokemon | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const filtered = caughtList.filter((item) => {
    if (filter === 'legendary' && !item.isLegendary) return false;
    if (filter === 'weather' && item.isLegendary) return false;
    if (filter === 'favorites' && !item.isFavorite) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesPrep = item.prepCompleted.some((p) => p.toLowerCase().includes(q));
      const matchesMilestone = item.milestoneTitle?.toLowerCase().includes(q);
      return matchesName || matchesPrep || matchesMilestone;
    }
    return true;
  });

  const openDetail = (entry: CaughtPokemon) => {
    setSelected(entry);
    dialogRef.current?.showModal();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
              <BookOpen className="w-3.5 h-3.5" /> Productivity Archive
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">
              Pokédex ({caughtList.length} Caught)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any Pokémon to inspect the weather conditions, morning prep, and work done that day.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Pokémon or work..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'all', label: 'All Caught' },
              { id: 'weather', label: 'Weather Prep' },
              { id: 'legendary', label: 'Legendaries' },
              { id: 'favorites', label: 'Favorites' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition ${
                filter === tab.id
                  ? 'bg-rose-500/20 border-rose-400/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500 text-sm">
          No Pokémon match this filter yet. Complete your Morning Weather Prep or a Weekly Milestone!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => {
            const isBuddy = entry.uid === activeBuddyUid;
            return (
              <div
                key={entry.uid}
                className={`group relative rounded-2xl border p-4 transition cursor-pointer ${
                  entry.isLegendary
                    ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border-amber-500/35 hover:border-amber-400/60'
                    : 'bg-slate-900/75 border-slate-800 hover:border-slate-700'
                }`}
                onClick={() => openDetail(entry)}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] text-slate-500">
                    #{String(entry.pokemonId).padStart(3, '0')} · Lv.{entry.level}
                  </span>
                  <button
                    type="button"
                    aria-label="Toggle favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(entry.uid);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        entry.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <PokemonSprite id={entry.pokemonId} name={entry.name} size="md" floating={false} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-white truncate">{entry.name}</h3>
                      {entry.isLegendary && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.types.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            TYPE_COLORS[t] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 truncate">
                      {new Date(entry.caughtAt).toLocaleDateString()} · {entry.weatherCondition} (
                      {entry.tempC}°C)
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {entry.milestoneTitle
                      ? `🏆 ${entry.milestoneTitle}`
                      : `✅ ${entry.prepCompleted.length} prep · ${entry.tasksDoneThatDay} tasks`}
                  </span>
                  {isBuddy && (
                    <span className="text-amber-300 font-bold">Active Buddy</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <dialog
        ref={dialogRef}
        className="rounded-3xl border border-slate-700 bg-slate-900 p-0 text-slate-100 shadow-2xl max-w-md w-[92vw]"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {selected && (
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-slate-400">
                  #{String(selected.pokemonId).padStart(3, '0')} · Lv.{selected.level}
                </span>
                <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  {selected.name}
                  {selected.isLegendary && <Crown className="w-5 h-5 text-amber-400" />}
                </h3>
              </div>
              <button
                onClick={() => dialogRef.current?.close()}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-center my-4">
              <PokemonSprite id={selected.pokemonId} name={selected.name} size="xl" />
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CloudSun className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Caught on <strong>{new Date(selected.caughtAt).toLocaleDateString()}</strong> in{' '}
                  <strong>{selected.locationName}</strong> ({selected.weatherCondition},{' '}
                  {selected.tempC}°C)
                </span>
              </div>

              {selected.milestoneTitle ? (
                <div className="flex items-center gap-2 text-amber-300">
                  <Crown className="w-4 h-4 shrink-0" />
                  <span>Unlocked by Milestone: {selected.milestoneTitle}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckSquare className="w-4 h-4 shrink-0" />
                    <span>Tasks completed that day: {selected.tasksDoneThatDay}</span>
                  </div>
                  {selected.prepCompleted.length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="font-semibold text-slate-300 mb-1">Morning Prep Completed:</div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                        {selected.prepCompleted.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  onSetBuddy(selected.uid);
                  dialogRef.current?.close();
                }}
                className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 text-xs transition"
              >
                Set as Active Partner
              </button>
              <button
                onClick={() => {
                  onToggleFavorite(selected.uid);
                  setSelected({ ...selected, isFavorite: !selected.isFavorite });
                }}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 text-xs transition"
              >
                {selected.isFavorite ? 'Unfavorite' : 'Favorite ★'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};
