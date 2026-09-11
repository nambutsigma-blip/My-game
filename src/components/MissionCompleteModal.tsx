import React from 'react';
import { Award, Sparkles, ArrowRight, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playLaser } from '../utils/soundEffects';

interface MissionCompleteModalProps {
  isOpen: boolean;
  score: number;
  maxScore: number;
  unitTitle: string;
  eggName: string;
  onOpenHatchery: () => void;
  onNextUnit: () => void;
  onRetry: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  isOpen,
  score,
  maxScore,
  unitTitle,
  eggName,
  onOpenHatchery,
  onNextUnit,
  onRetry,
}) => {
  const validMax = maxScore && maxScore > 0 ? maxScore : 10;
  const percentage = Math.round(((score || 0) / validMax) * 100);
  const isPerfect = score === maxScore; // 10/10 -> Golden Dragon Egg
  const isPassed = score >= 8; // >= 80% -> Unlocked

  React.useEffect(() => {
    if (!isOpen) return;
    if (isPassed) {
      confetti({ particleCount: isPerfect ? 180 : 100, spread: 80, origin: { y: 0.6 } });
      playSuccessChime();
    } else {
      playLaser();
    }
  }, [isOpen, isPassed, isPerfect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-7 shadow-2xl text-white text-center relative overflow-hidden">
        {/* Visual Badge */}
        <div className="text-6xl mb-3 animate-bounce">
          {isPerfect ? '🥚👑✨' : isPassed ? '🥚🥈🎉' : '🐉❌'}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-black">
          {isPerfect
            ? 'LEGENDARY HEIST FLAWLESS VICTORY (10/10)!'
            : isPassed
            ? 'DRAGON EGG RETRIEVED SAFELY!'
            : 'INFILTRATION FAILED (BELOW 80%)'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{unitTitle}</p>

        {/* Score Display */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase">Mission Score</div>
          <div className="text-4xl font-black text-amber-400 mt-1">
            {score}/{maxScore} <span className="text-lg text-slate-300 font-medium">({percentage}%)</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
            {isPerfect ? (
              <p className="text-amber-300 font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PERFECT 10/10: Awarded Mythical Golden Dragon Egg!</span>
              </p>
            ) : isPassed ? (
              <p className="text-emerald-300 font-semibold">
                ✨ Scored over 80% (8/10)! Awarded Silver Dragon Egg and unlocked the next unit!
              </p>
            ) : (
              <p className="text-rose-400 font-semibold">
                ⚠️ Need at least 8/10 (80%) to retrieve the egg and unlock the next lesson.
              </p>
            )}
          </div>
        </div>

        {/* Reward card if passed */}
        {isPassed && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 mb-5 text-left flex items-center gap-3">
            <div className="text-3xl">
              {isPerfect ? '🥚✨' : '🥚'}
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase">Reward Added to Inventory:</div>
              <div className="text-sm font-bold text-white">
                {isPerfect ? 'Mythical Golden Dragon Egg' : eggName}
              </div>
              <div className="text-xs text-slate-400">Can be hatched into rare companions in the Sanctuary Hatchery!</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {isPassed ? (
            <>
              <button
                id="modal-next-unit-btn"
                onClick={onNextUnit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-950/40"
              >
                Unlock & Begin Next Unit ➔
              </button>
              <button
                id="modal-hatch-btn"
                onClick={onOpenHatchery}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-pointer"
              >
                Go to Hatchery Now
              </button>
            </>
          ) : (
            <button
              id="modal-retry-btn"
              onClick={onRetry}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white font-black text-sm uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Retry Mission (Need 8/10)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
