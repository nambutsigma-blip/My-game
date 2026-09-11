import React from 'react';
import { HelpCircle, Flame, Egg, Swords, ChevronLeft, ChevronRight, Sparkles, Zap, BookOpen, Globe } from 'lucide-react';
import { UnitData, StolenEgg } from '../types';

interface NavbarProps {
  units: UnitData[];
  currentUnitId: string;
  onSelectUnit: (unitId: string) => void;
  unlockedUnits: string[];
  stolenEggs: StolenEgg[];
  stealthBoots: number;
  onOpenHatchery: () => void;
  onOpenRules: () => void;
  onOpenArena: () => void;
  onOpenSkillTree: () => void;
  onOpenStudy: () => void;
  onOpenOnline: () => void;
  isChaseModeActive: boolean;
  onStartChaseMode: () => void;
  dragonCrystals?: number;
  activePerksCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  units,
  currentUnitId,
  onSelectUnit,
  unlockedUnits,
  stolenEggs,
  onOpenHatchery,
  onOpenRules,
  onOpenArena,
  onOpenSkillTree,
  onOpenStudy,
  onOpenOnline,
  isChaseModeActive,
  onStartChaseMode,
  dragonCrystals = 0,
  activePerksCount = 0,
}) => {
  const currentIndex = units.findIndex((u) => u.id === currentUnitId);
  const prevUnit = currentIndex > 0 ? units[currentIndex - 1] : null;
  const nextUnit = currentIndex < units.length - 1 ? units[currentIndex + 1] : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md px-3 md:px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectUnit('unit-1')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-xl shadow-lg shadow-amber-950/50">
            🥚🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Egg Thief</span>
                <span className="text-amber-400 font-extrabold hidden sm:inline">• Master English Heist</span>
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[9px] border border-amber-500/30">
                HIGH SCHOOL ENTRANCE • 40 UNITS
              </span>
              <span className="hidden md:inline">Global Success & Destination B1</span>
            </div>
          </div>
        </div>

        {/* Unit Selector Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 max-w-full">
          {/* Previous Unit Button */}
          <button
            id="nav-prev-unit-btn"
            onClick={() => prevUnit && unlockedUnits.includes(prevUnit.id) && onSelectUnit(prevUnit.id)}
            disabled={!prevUnit || !unlockedUnits.includes(prevUnit?.id || '')}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${
              prevUnit && unlockedUnits.includes(prevUnit.id)
                ? 'hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={prevUnit ? `Previous: ${prevUnit.title}` : 'No previous unit'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Unit Dropdown Selector */}
          <select
            id="nav-unit-select"
            value={isChaseModeActive ? 'chase' : currentUnitId}
            onChange={(e) => {
              if (e.target.value === 'chase') {
                onStartChaseMode();
              } else {
                onSelectUnit(e.target.value);
              }
            }}
            className="bg-slate-950 text-slate-200 text-xs font-bold py-1.5 px-2 rounded-lg border border-slate-700 hover:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[200px] sm:max-w-[260px] md:max-w-[320px] truncate"
          >
            <optgroup label="Tier 1: Units 1-10 (Tenses & Comparisons)">
              {units.slice(0, 10).map((u) => (
                <option key={u.id} value={u.id} disabled={!unlockedUnits.includes(u.id)}>
                  {unlockedUnits.includes(u.id) ? '✓ ' : '🔒 '}
                  {u.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tier 2: Units 11-20 (Passive, Conditionals & Reported Speech)">
              {units.slice(10, 20).map((u) => (
                <option key={u.id} value={u.id} disabled={!unlockedUnits.includes(u.id)}>
                  {unlockedUnits.includes(u.id) ? '✓ ' : '🔒 '}
                  {u.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tier 3: Units 21-30 (Articles, Prepositions & Word Formation)">
              {units.slice(20, 30).map((u) => (
                <option key={u.id} value={u.id} disabled={!unlockedUnits.includes(u.id)}>
                  {unlockedUnits.includes(u.id) ? '✓ ' : '🔒 '}
                  {u.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tier 4: Units 31-40 (Entrance Examination Mastery)">
              {units.slice(30, 40).map((u) => (
                <option key={u.id} value={u.id} disabled={!unlockedUnits.includes(u.id)}>
                  {unlockedUnits.includes(u.id) ? '✓ ' : '🔒 '}
                  {u.title}
                </option>
              ))}
            </optgroup>
            <option value="chase">🔥 Special Boss: Dragon Chase Escape</option>
          </select>

          {/* Next Unit Button */}
          <button
            id="nav-next-unit-btn"
            onClick={() => nextUnit && unlockedUnits.includes(nextUnit.id) && onSelectUnit(nextUnit.id)}
            disabled={!nextUnit || !unlockedUnits.includes(nextUnit?.id || '')}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${
              nextUnit && unlockedUnits.includes(nextUnit.id)
                ? 'hover:text-white hover:bg-slate-800 cursor-pointer'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title={nextUnit ? `Next: ${nextUnit.title}` : 'No next unit'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions: Study & AI, Crystals, Arena, Hatchery & Rules */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Study & AI Tutor Button */}
          <button
            id="nav-study-btn"
            onClick={onOpenStudy}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-950/90 to-purple-950/90 hover:from-indigo-900 border border-indigo-500/50 text-xs font-bold text-indigo-200 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Open Study System & AI Tutor (Vocabulary, Grammar & AI Chat)"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Học Bài & AI</span>
          </button>

          {/* Online Multiplayer & Google Auth Button */}
          <button
            id="nav-online-btn"
            onClick={onOpenOnline}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950/90 to-amber-950/90 hover:from-red-900 border border-red-500/50 text-xs font-bold text-red-200 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Online Multiplayer & Google Sign-In"
          >
            <Globe className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Online & Google</span>
          </button>

          {/* Dragon Crystals Wallet */}
          <div
            onClick={onOpenHatchery}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-500/40 text-xs font-black text-purple-300 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Dragon Crystals - Used to enchant pet companions in the Hatchery!"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{dragonCrystals}</span>
            <span className="hidden md:inline text-[10px] text-purple-400 font-semibold">💎</span>
          </div>

          {/* Pet PvP Arena Button */}
          <button
            id="nav-arena-btn"
            onClick={onOpenArena}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-slate-900 hover:from-rose-900/80 border border-rose-500/40 text-xs font-bold text-rose-300 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Open Companion Arena (PvP vs NPC Trainers)"
          >
            <Swords className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Arena</span>
          </button>

          {/* Pet Skill Tree Button */}
          <button
            id="nav-skill-tree-btn"
            onClick={onOpenSkillTree}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/90 to-slate-900 hover:from-purple-900/90 border border-purple-500/50 text-xs font-bold text-purple-300 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Open Pet Skill Tree (Unlock permanent passives with Dragon Crystals)"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Passives</span>
            {activePerksCount > 0 && (
              <span className="bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded-full text-[9px] font-black border border-purple-400/40">
                {activePerksCount}
              </span>
            )}
          </button>

          {/* Hatchery Quick Button */}
          <button
            id="nav-hatchery-btn"
            onClick={onOpenHatchery}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-xs font-bold text-amber-300 cursor-pointer transition-all active:scale-95"
            title="Open Sanctuary Egg Hatchery"
          >
            <Egg className="w-3.5 h-3.5 text-amber-400" />
            <span>Eggs ({stolenEggs.length})</span>
          </button>

          {/* Rules Guide Modal button */}
          <button
            id="nav-rules-btn"
            onClick={onOpenRules}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Game Rules & Mission Mechanics"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
