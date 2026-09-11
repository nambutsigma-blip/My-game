import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, AlertCircle, Sparkles, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import { GrammarTrapItem } from '../types';
import { playBootsBonus, playStealthStep, playLaser, playAlertUp } from '../utils/soundEffects';

interface Stage2GrammarTrapProps {
  grammarTraps: GrammarTrapItem[];
  unitTitle: string;
  onCorrectAnswer: (earnedBoots: boolean) => void;
  onWrongAnswer: () => void;
  onCompleteStage: () => void;
}

export const Stage2GrammarTrap: React.FC<Stage2GrammarTrapProps> = ({
  grammarTraps,
  unitTitle,
  onCorrectAnswer,
  onWrongAnswer,
  onCompleteStage,
}) => {
  const [currentTrapIdx, setCurrentTrapIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gotStealthBoots, setGotStealthBoots] = useState(false);

  // Reflex bonus timer: initial 10s window for bonus Stealth Boots.
  // USER INTENT: "ch time đọc là vô hạn" -> Reading time is INFINITE (vô hạn thời gian đọc & suy nghĩ).
  // No timeout penalty or forced failure: students can read and analyze as long as they want!
  const [bonusTimeLeft, setBonusTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);

  const currentTrap = grammarTraps[currentTrapIdx] || grammarTraps[0];

  useEffect(() => {
    let timer: any = null;
    if (timerActive && bonusTimeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        setBonusTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, bonusTimeLeft, isAnswered]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setTimerActive(false);
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.toLowerCase() === currentTrap.correctAnswer.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      // Award stealth boots if solved during bonus window
      const earnedBoots = bonusTimeLeft > 0;
      setGotStealthBoots(earnedBoots);

      if (earnedBoots) {
        playBootsBonus();
      } else {
        playStealthStep();
      }
      onCorrectAnswer(earnedBoots);
    } else {
      playLaser();
      playAlertUp();
      onWrongAnswer();
    }
  };

  const handleRetryTrap = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setGotStealthBoots(false);
    setBonusTimeLeft(10);
    setTimerActive(true);
  };

  const handleNextTrap = () => {
    if (currentTrapIdx + 1 >= grammarTraps.length) {
      onCompleteStage();
    } else {
      setCurrentTrapIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setGotStealthBoots(false);
      setBonusTimeLeft(10);
      setTimerActive(true);
    }
  };

  return (
    <div id="stage-2-container" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/60">
                  Stage 2: Grammar Defense
                </span>
                <span className="text-xs text-slate-400">{unitTitle}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Acoustic Grammar Traps (Entrance Exam Focus)
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-0.5">
                Target structures for High School Entrance & Destination B1. Vô hạn thời gian đọc! Trả lời trong 10s đầu để nhận thêm &quot;Giày Tàng Hình&quot; (-10% Báo động).
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Trap Progress</span>
              <span className="text-sm font-extrabold text-indigo-300">
                Trap {currentTrapIdx + 1}/{grammarTraps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Infinite Reading Time Bar with Reflex Bonus Zone */}
        <div className="mt-5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between text-xs mb-1.5 font-semibold gap-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Thời Gian Đọc & Phân Tích: <strong className="text-emerald-300">VÔ HẠN (∞)</strong></span>
            </span>
            <span className={`font-mono text-xs md:text-sm font-extrabold ${bonusTimeLeft > 0 ? 'text-emerald-400' : 'text-indigo-300'}`}>
              {bonusTimeLeft > 0 ? (
                <span>⚡ Còn {bonusTimeLeft}s để nhận Giày Tàng Hình</span>
              ) : (
                <span>⏱️ Vô hạn thời gian • Thong thả đọc kỹ & chọn đáp án</span>
              )}
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                bonusTimeLeft > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              }`}
              style={{ width: `${bonusTimeLeft > 0 ? (bonusTimeLeft / 10) * 100 : 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Grammar Trap Core */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
        {/* Instruction */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
            Deactivation Mission #{currentTrapIdx + 1}
          </span>
          {gotStealthBoots && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+1 Stealth Boots (-10% Alert)!</span>
            </span>
          )}
        </div>

        <p className="text-sm md:text-base font-semibold text-slate-200 mb-4">
          {currentTrap.instruction}
        </p>

        {/* Sentence Prompt in Wire Frame */}
        <div className="bg-slate-950 border-2 border-indigo-900/60 rounded-2xl p-5 mb-5 relative overflow-hidden">
          <div className="text-xs text-indigo-300 font-mono uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>⚡ Acoustic Tripwire Circuit</span>
          </div>
          <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
            {currentTrap.sentencePrompt}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {currentTrap.options.map((option, idx) => {
            let btnClass = 'bg-slate-950/80 hover:bg-slate-850 border-slate-800 text-slate-200';

            if (isAnswered) {
              if (option.toLowerCase() === currentTrap.correctAnswer.toLowerCase()) {
                btnClass = 'bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-950';
              } else if (option === selectedOption) {
                btnClass = 'bg-rose-600/90 border-rose-400 text-white font-bold shadow-lg shadow-rose-950';
              } else {
                btnClass = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                id={`grammar-opt-${idx}`}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${btnClass}`}
              >
                <span className="text-base font-mono">{option}</span>
                {isAnswered && option.toLowerCase() === currentTrap.correctAnswer.toLowerCase() && (
                  <CheckCircle className="w-5 h-5 text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Grade 10 Exam Tips */}
        {isAnswered && (
          <div className={`p-5 rounded-2xl mb-5 text-xs md:text-sm ${
            isCorrect
              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border border-rose-500/50 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className={`w-5 h-5 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span className="font-extrabold text-sm uppercase">
                {isCorrect ? '✨ TRIPWIRE DISARMED!' : '🚨 TRIPWIRE TRIGGERED!'}
              </span>
            </div>
            <p className="font-medium mb-1.5">
              <span className="font-bold underline text-indigo-300">Exam Grammar Concept:</span> {currentTrap.grammarRuleExplaining}
            </p>
            {gotStealthBoots && (
              <p className="text-emerald-300 font-bold mt-2 bg-emerald-900/40 p-2 rounded-lg border border-emerald-500/30">
                🎉 Swift reflex under 5 seconds! Received &quot;Stealth Boots&quot; reducing alarm by 10%!
              </p>
            )}
          </div>
        )}

        {/* Action: Retry if wrong to ensure true mastery; advance if correct */}
        {isAnswered && (
          <div className="flex justify-end gap-3">
            {!isCorrect ? (
              <button
                id="stage2-retry-btn"
                onClick={handleRetryTrap}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Trapwire (Review & Solve Correctly)</span>
              </button>
            ) : (
              <button
                id="stage2-next-btn"
                onClick={handleNextTrap}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 text-white font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-indigo-950/40 cursor-pointer transition-all"
              >
                <span>
                  {currentTrapIdx + 1 >= grammarTraps.length
                    ? 'Complete Stage 2 ➔ Unlock Voice Cipher'
                    : 'Next Grammar Trap'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
