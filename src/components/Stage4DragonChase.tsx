import React, { useState } from 'react';
import { Flame, ShieldAlert, Award, ArrowRight, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { REVIEW_QUESTIONS_UNITS_1_3 } from '../data/unitsData';
import { playStealthStep, playLaser, playAlertUp, playSuccessChime, playDragonGrowl } from '../utils/soundEffects';

interface Stage4DragonChaseProps {
  onEscapeSuccess: (score: number, total: number) => void;
  onReturnToNest: () => void;
}

export const Stage4DragonChase: React.FC<Stage4DragonChaseProps> = ({
  onEscapeSuccess,
  onReturnToNest,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  // Distance in meters: starts at 30m, safety exit is at 70m, dragon catches up if distance reaches 0m
  const [distanceMeters, setDistanceMeters] = useState(30);
  const [isFinished, setIsFinished] = useState(false);

  const questions = REVIEW_QUESTIONS_UNITS_1_3;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playSuccessChime();
      setCorrectCount((prev) => prev + 1);
      setDistanceMeters((prev) => Math.min(70, prev + 3));
    } else {
      playLaser();
      playAlertUp();
      playDragonGrowl();
      setDistanceMeters((prev) => Math.max(5, prev - 5));
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setIsFinished(true);
      if (correctCount >= 16) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onEscapeSuccess(correctCount, questions.length);
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  return (
    <div id="stage-4-container" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Flame className="w-8 h-8 animate-pulse text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/60">
                  Stage 4: Tri-Unit Review Boss
                </span>
                <span className="text-xs text-amber-300 font-semibold">Review Checkpoint Units 1-3</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Dragon Chase & Grand Synthesis Escape
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-0.5">
                Having stolen the dragon eggs, the dragon gives chase! Answer comprehensive review questions (Units 1-3 & Core B1 grammar) to safely escape!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Question Progress</span>
              <span className="text-sm font-extrabold text-amber-300">
                Question {currentIdx + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Chase Meter */}
        <div className="mt-5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span>🐉 DRAGON IN PURSUIT</span>
            </span>
            <span className="text-amber-300 font-bold">
              Safe Distance: {distanceMeters}m ({correctCount}/{questions.length} correct)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>ESCAPE CAVE EXIT 🏞️</span>
            </span>
          </div>

          {/* Visual Track */}
          <div className="relative h-9 bg-slate-900 rounded-xl overflow-hidden flex items-center px-4 border border-slate-800">
            <div className="absolute left-2 text-xl animate-bounce">
              🐉🔥
            </div>

            <div
              className="absolute text-xl transition-all duration-500"
              style={{ left: `${Math.max(10, Math.min(85, (distanceMeters / 70) * 85))}%` }}
            >
              🏃💨🥚
            </div>

            <div className="absolute right-2 text-xl">
              🏕️✨
            </div>
          </div>
        </div>
      </div>

      {/* Main Chase Question Box */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Question #{currentIdx + 1} • Origin: {currentQ.unitOrigin}
            </span>
            <span className="text-xs text-slate-400">
              Correct = Gain Distance (+3m) | Mistake = Dragon Closes In (-5m)
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5">
            <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'bg-slate-950/80 hover:bg-slate-850 border-slate-800 text-slate-200';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-950';
                } else if (idx === selectedOpt) {
                  btnClass = 'bg-rose-600/90 border-rose-400 text-white font-bold shadow-lg shadow-rose-950';
                } else {
                  btnClass = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  id={`chase-opt-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl mb-5 text-xs md:text-sm ${
              isCorrect
                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border border-rose-500/50 text-rose-200'
            }`}>
              <p className="font-bold text-sm mb-1">
                {isCorrect ? '✨ SPRINT SUCCESSFUL!' : '🚨 STUMBLED! DRAGON BREATHES FLAME NEARBY!'}
              </p>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                id="chase-next-btn"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
              >
                <span>
                  {currentIdx + 1 >= questions.length ? 'View Escape Outcome' : 'Next Question ➔'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Chase Finished Summary */
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-md text-center max-w-xl mx-auto">
          <div className="text-6xl mb-3">
            {correctCount >= 16 ? '🏆🎉🏞️' : '🐉💨'}
          </div>
          <h3 className="text-2xl font-black text-white">
            {correctCount >= 16
              ? 'SUCCESSFULLY ESCAPED THE DRAGON LAIR!'
              : 'CORNERED BY THE GUARDIAN DRAGON!'}
          </h3>
          <p className="text-sm text-slate-300 mt-2">
            Comprehensive Score: <span className="text-amber-400 font-extrabold text-lg">{correctCount}/{questions.length}</span> ({Math.round((correctCount / questions.length) * 100)}%)
          </p>

          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            {correctCount >= 16
              ? 'Stupendous work! You brought your Stolen Dragon Eggs safely to the Sanctuary Hatchery!'
              : 'You need at least 16/20 (80%) correct answers to complete the escape safely. Review the concepts and try again!'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setSelectedOpt(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setDistanceMeters(30);
                setIsFinished(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Escape</span>
            </button>
            <button
              onClick={onReturnToNest}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              Back to Units & Egg Hatchery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
