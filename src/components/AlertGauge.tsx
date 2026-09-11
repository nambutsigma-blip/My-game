import React from 'react';
import { Shield, Sparkles, Volume2, Footprints } from 'lucide-react';
import { playBootsBonus } from '../utils/soundEffects';

interface AlertGaugeProps {
  alertLevel: number; // 0 to 100
  stealthSteps: number;
  totalStepsNeeded: number;
  stealthBoots: number;
  onUseBoots: () => void;
  eggName: string;
  bootsAlertReduction?: number;
  activePassives?: {
    alertCooldownSeconds: number;
    alertCooldownAmount: number;
    crystalMultiplier: number;
    mistakePenalty: number;
    phantomVeilChance: number;
  };
  onOpenSkillTree?: () => void;
}

export const AlertGauge: React.FC<AlertGaugeProps> = ({
  alertLevel,
  stealthSteps,
  totalStepsNeeded,
  stealthBoots,
  onUseBoots,
  eggName,
  bootsAlertReduction = 10,
  activePassives,
  onOpenSkillTree,
}) => {
  // Determine dragon status
  let dragonStatus = 'Fast Asleep (Secure & Quiet)';
  let dragonEmoji = '😴';
  let dragonColor = 'text-emerald-400';
  let barColor = 'from-emerald-500 to-teal-500';

  if (alertLevel >= 100) {
    dragonStatus = '🚨 DRAGON AWAKENED! EMERGENCY RESCUE NEEDED!';
    dragonEmoji = '🐉🔥';
    dragonColor = 'text-rose-500 animate-bounce';
    barColor = 'from-rose-600 to-red-600 animate-pulse';
  } else if (alertLevel >= 75) {
    dragonStatus = 'Dragon growling, eyelids twitching!';
    dragonEmoji = '😠';
    dragonColor = 'text-red-400';
    barColor = 'from-amber-500 to-rose-600';
  } else if (alertLevel >= 50) {
    dragonStatus = 'Dragon stirring and shifting position!';
    dragonEmoji = '🥱';
    dragonColor = 'text-amber-400';
    barColor = 'from-yellow-400 to-amber-500';
  } else if (alertLevel >= 25) {
    dragonStatus = 'Dragon tail gently swishing';
    dragonEmoji = '😌';
    dragonColor = 'text-teal-300';
    barColor = 'from-teal-400 to-emerald-500';
  }

  const validTotalSteps = totalStepsNeeded && totalStepsNeeded > 0 ? totalStepsNeeded : 10;
  const stepPercentage = Math.min(100, Math.round(((stealthSteps || 0) / validTotalSteps) * 100));

  return (
    <div id="alert-gauge-panel" className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        {/* Dragon Alert State */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
            {dragonEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lair Alert Gauge
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${alertLevel >= 75 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'}`}>
                {alertLevel}%
              </span>
            </div>
            <p className={`text-sm font-semibold ${dragonColor} transition-colors duration-300`}>
              {dragonStatus}
            </p>
          </div>
        </div>

        {/* Stealth Steps Progress towards Egg */}
        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Distance to Nest</div>
            <div className="text-xs text-amber-300 font-bold">
              Step {stealthSteps}/{totalStepsNeeded} ({stepPercentage}%)
            </div>
          </div>
        </div>

        {/* Stealth Boots Item Button */}
        <div className="flex items-center gap-2">
          <button
            id="use-stealth-boots-btn"
            onClick={() => {
              if (stealthBoots > 0 && alertLevel > 0) {
                playBootsBonus();
                onUseBoots();
              }
            }}
            disabled={stealthBoots <= 0 || alertLevel <= 0}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              stealthBoots > 0 && alertLevel > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
            }`}
            title={`Use Stealth Boots to reduce alert by -${bootsAlertReduction}%`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Stealth Boots ({stealthBoots})</span>
            {stealthBoots > 0 && alertLevel > 0 && (
              <span className="bg-emerald-400/20 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                -{bootsAlertReduction}% Alert
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Passives Strip if any passives unlocked */}
      {activePassives && (activePassives.alertCooldownSeconds > 0 || activePassives.crystalMultiplier > 0 || activePassives.mistakePenalty < 25 || activePassives.phantomVeilChance > 0) && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <span>⚡ Pet Passives:</span>
            </span>

            {activePassives.alertCooldownSeconds > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold animate-pulse">
                💤 Cooldown: -{activePassives.alertCooldownAmount}% / {activePassives.alertCooldownSeconds}s
              </span>
            )}

            {activePassives.crystalMultiplier > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                💎 +{Math.round(activePassives.crystalMultiplier * 100)}% Crystals
              </span>
            )}

            {activePassives.mistakePenalty < 25 && (
              <span className="px-2 py-0.5 rounded-md bg-teal-950/80 border border-teal-500/30 text-teal-300 text-[10px] font-bold">
                🤫 Silent: +{activePassives.mistakePenalty}% alert/mistake
              </span>
            )}

            {activePassives.phantomVeilChance > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                🌫️ Veil: {Math.round(activePassives.phantomVeilChance * 100)}% evade alert
              </span>
            )}
          </div>

          {onOpenSkillTree && (
            <button
              onClick={onOpenSkillTree}
              className="text-[10px] text-purple-300 hover:text-purple-200 font-bold underline cursor-pointer"
            >
              Skill Tree →
            </button>
          )}
        </div>
      )}

      {/* Progress Bars */}
      <div className="space-y-2">
        {/* Dragon Alert Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>
              Alert Gauge (Each mistake = +{activePassives?.mistakePenalty ?? 25}%)
              {activePassives && activePassives.alertCooldownSeconds > 0 && (
                <span className="text-emerald-400 font-bold ml-1.5">
                  • Cooling down -{activePassives.alertCooldownAmount}% every {activePassives.alertCooldownSeconds}s
                </span>
              )}
            </span>
            <span className="font-semibold text-slate-300">{alertLevel}/100% (100% = Dragon wakes!)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, alertLevel)}%` }}
            />
          </div>
        </div>

        {/* Step to Target Egg Bar */}
        <div className="pt-1">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400">🎯 Target:</span>
              <span className="text-slate-200 font-medium">{eggName}</span>
            </span>
            <span className="text-amber-400 font-semibold">{stepPercentage}% reached</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${stepPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
