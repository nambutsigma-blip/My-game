import React, { useState } from 'react';
import { ShieldAlert, Sparkles, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { RESCUE_QUESTIONS } from '../data/unitsData';
import { playSuccessChime, playLaser, playBootsBonus } from '../utils/soundEffects';

interface EmergencyRescueModalProps {
  isOpen: boolean;
  onRescueSuccess: () => void;
  onRescueFail: () => void;
}

export const EmergencyRescueModal: React.FC<EmergencyRescueModalProps> = ({
  isOpen,
  onRescueSuccess,
  onRescueFail,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!isOpen) return null;

  const currentQ = RESCUE_QUESTIONS[currentIdx % RESCUE_QUESTIONS.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
    } else {
      playLaser();
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      playBootsBonus();
      onRescueSuccess();
      // Reset
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      onRescueFail();
      setSelectedOpt(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-rose-600 rounded-3xl p-6 shadow-2xl shadow-rose-950/60 text-white relative overflow-hidden">
        {/* Glowing Warning Header */}
        <div className="flex items-center gap-3 mb-4 text-rose-400">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center animate-pulse">
            <Flame className="w-7 h-7 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <span>Alert 100%: Dragon Awakened!</span>
            </h3>
            <p className="text-xs text-slate-300">
              The lair guardian spotted your team! Solve the emergency grammar question to deploy sleeping dust!
            </p>
          </div>
        </div>

        {/* Dragon Animated Graphic */}
        <div className="bg-slate-950/80 border border-rose-900/50 rounded-2xl p-4 text-center mb-5">
          <div className="text-5xl mb-2 animate-bounce">🐲🔥💨</div>
          <p className="text-sm font-semibold text-amber-300">
            &quot;Who dares trespass into my golden nest!?&quot;
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Answer the rescue challenge accurately to calm the dragon and decrease alert level back to 50%!
          </p>
        </div>

        {/* Question Content */}
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Emergency Rescue Challenge:
          </div>
          <div className="text-sm md:text-base font-semibold text-slate-100 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            {currentQ.question}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200';
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-bold';
              } else if (idx === selectedOpt) {
                btnStyle = 'bg-rose-600/90 border-rose-400 text-white';
              } else {
                btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`rescue-opt-${idx}`}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback after answering */}
        {isAnswered && (
          <div className={`p-3 rounded-xl mb-4 text-xs ${isCorrect ? 'bg-emerald-950/60 border border-emerald-600/50 text-emerald-200' : 'bg-rose-950/60 border border-rose-600/50 text-rose-200'}`}>
            <p className="font-bold mb-0.5">
              {isCorrect ? '✨ RESCUE SUCCESSFUL!' : '❌ INCORRECT!'}
            </p>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        {/* Action Button */}
        {isAnswered && (
          <button
            id="rescue-confirm-btn"
            onClick={handleContinue}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 text-white'
            }`}
          >
            {isCorrect ? 'Calm Dragon & Reduce Alert to 50%' : 'Try Another Rescue Question'}
          </button>
        )}
      </div>
    </div>
  );
};
