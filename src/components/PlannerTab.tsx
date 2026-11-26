import React, { useRef, useState } from 'react';
import { Trophy, Plus, Crown, CheckCircle2, Trash2, Sparkles, Calendar } from 'lucide-react';
import { MilestoneGoal, PokemonSpecies } from '../types';
import { POKEMON_CATALOG, TYPE_COLORS } from '../data/pokemonCatalog';
import { PokemonSprite } from './PokemonSprite';

interface PlannerTabProps {
  milestones: MilestoneGoal[];
  onAddMilestone: (title: string, period: 'weekly' | 'monthly', targetCount: number) => void;
  onIncrementMilestone: (id: string) => PokemonSpecies | null;
  onDeleteMilestone: (id: string) => void;
}

export const PlannerTab: React.FC<PlannerTabProps> = ({
  milestones,
  onAddMilestone,
  onIncrementMilestone,
  onDeleteMilestone,
}) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [targetCount, setTargetCount] = useState(5);
  const [unlockedLegendary, setUnlockedLegendary] = useState<{
    pokemon: PokemonSpecies;
    milestoneTitle: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAddMilestone(trimmed, period, Math.max(1, targetCount));
    setTitle('');
    setTargetCount(5);
  };

  const handleStep = (goal: MilestoneGoal) => {
    const reward = onIncrementMilestone(goal.id);
    if (reward) {
      setUnlockedLegendary({ pokemon: reward, milestoneTitle: goal.title });
      dialogRef.current?.showModal();
    }
  };

  const weekly = milestones.filter((m) => m.period === 'weekly');
  const monthly = milestones.filter((m) => m.period === 'monthly');

  const renderSection = (heading: string, badge: string, items: MilestoneGoal[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          {heading}
        </h3>
        <span className="text-xs font-semibold text-slate-400">{badge}</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
          No {heading.toLowerCase()} yet. Create one above to unlock a Legendary encounter!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));
            const rewardSpecies = goal.rewardedPokemonId
              ? POKEMON_CATALOG[goal.rewardedPokemonId]
              : null;

            return (
              <div
                key={goal.id}
                className={`rounded-2xl border p-5 transition ${
                  goal.completed
                    ? 'bg-gradient-to-br from-amber-950/35 to-slate-900 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1.5 ${
                        goal.period === 'monthly'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {goal.period} Milestone
                    </span>
                    <h4 className="text-base font-bold text-white">{goal.title}</h4>
                  </div>
                  <button
                    onClick={() => onDeleteMilestone(goal.id)}
                    aria-label="Delete milestone"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-mono font-bold text-slate-200">
                      {goal.currentCount} / {goal.targetCount}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        goal.completed
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                          : 'bg-gradient-to-r from-indigo-500 to-sky-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {goal.completed && rewardSpecies ? (
                  <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-semibold text-amber-200">
                        Unlocked {rewardSpecies.name}!
                      </span>
                    </div>
                    <PokemonSprite id={rewardSpecies.id} name={rewardSpecies.name} size="sm" floating={false} />
                  </div>
                ) : (
                  <button
                    onClick={() => handleStep(goal)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-100 font-bold text-xs py-2.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Progress (+1)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header + Create Milestone Form */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Crown className="w-3.5 h-3.5" /> Legendary Raid Milestones
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">Weekly &amp; Monthly Planner</h2>
            <p className="text-xs text-slate-400 mt-1">
              Set bigger goals. Reaching 100% on any milestone summons and unlocks a random Legendary Pokémon.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 px-4 py-2 text-xs font-semibold text-amber-300">
            <Trophy className="w-4 h-4" />
            {milestones.filter((m) => m.completed).length} Legendaries Unlocked
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Milestone goal (e.g., 4 Gym Workouts, Ship Portfolio v2)..."
            className="md:col-span-6 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60"
          />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly')}
            className="md:col-span-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-400/60"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="md:col-span-2 flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3">
            <span className="text-xs text-slate-400 shrink-0">Target:</span>
            <input
              type="number"
              min={1}
              max={100}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="w-full bg-transparent py-2.5 text-sm font-mono text-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-4 py-2.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </form>
      </section>

      {renderSection('Weekly Goals', 'Short-term sprints', weekly)}
      {renderSection('Monthly Boss Goals', 'Long-term mastery', monthly)}

      {/* Legendary Unlock Modal */}
      <dialog
        ref={dialogRef}
        className="rounded-3xl border border-amber-500/40 bg-slate-900 p-0 text-slate-100 shadow-2xl max-w-md w-[92vw]"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        {unlockedLegendary && (
          <div className="p-6 text-center bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> LEGENDARY ENCOUNTER UNLOCKED!
            </div>
            <h3 className="text-2xl font-extrabold text-white">{unlockedLegendary.pokemon.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Milestone Completed: <strong className="text-slate-200">{unlockedLegendary.milestoneTitle}</strong>
            </p>

            <div className="my-5 flex justify-center">
              <PokemonSprite
                id={unlockedLegendary.pokemon.id}
                name={unlockedLegendary.pokemon.name}
                size="xl"
              />
            </div>

            <div className="flex justify-center gap-1.5 mb-3">
              {unlockedLegendary.pokemon.types.map((t) => (
                <span
                  key={t}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    TYPE_COLORS[t] || 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-300 mb-6">{unlockedLegendary.pokemon.flavor}</p>

            <button
              onClick={() => dialogRef.current?.close()}
              className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-2.5 text-sm transition"
            >
              Awesome! Added to Pokédex
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
};
