import React, { useState, useEffect } from 'react';
import { Eye, Volume2, ShieldCheck, AlertCircle, ArrowRight, Sparkles, Check, RotateCcw } from 'lucide-react';
import { VocabularyItem } from '../types';
import { speakEnglish, playStealthStep, playLaser, playAlertUp } from '../utils/soundEffects';

interface Stage1EyeMonsterProps {
  vocabularyList: VocabularyItem[];
  unitTitle: string;
  onCorrectWord: () => void;
  onWrongWord: () => void;
  onCompleteStage: () => void;
}

export const Stage1EyeMonster: React.FC<Stage1EyeMonsterProps> = ({
  vocabularyList,
  unitTitle,
  onCorrectWord,
  onWrongWord,
  onCompleteStage,
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'minigame'>('study');
  const [studiedWordIdx, setStudiedWordIdx] = useState(0);

  // Mini-game state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [laserAlertBlink, setLaserAlertBlink] = useState(false);
  const [passedCount, setPassedCount] = useState(0);

  // Shuffle 4 options for mini-game quiz
  const currentQuizItem = vocabularyList[currentQuizIdx] || vocabularyList[0];
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!currentQuizItem) return;
    const wrongPool = vocabularyList
      .filter((v) => v.word.toLowerCase() !== currentQuizItem.word.toLowerCase())
      .map((v) => v.word);

    // Shuffle wrong pool and take up to 3
    const shuffledWrong = [...wrongPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...shuffledWrong, currentQuizItem.word].sort(() => 0.5 - Math.random());
    setOptions(combined);
  }, [currentQuizIdx, vocabularyList]);

  const handleStudySpeak = (text: string) => {
    speakEnglish(text);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option.toLowerCase() === currentQuizItem.word.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      playStealthStep();
      setPassedCount((prev) => prev + 1);
      onCorrectWord();
    } else {
      playLaser();
      playAlertUp();
      setLaserAlertBlink(true);
      setTimeout(() => setLaserAlertBlink(false), 800);
      onWrongWord();
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx + 1 >= vocabularyList.length) {
      onCompleteStage();
    } else {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };

  return (
    <div id="stage-1-container" className="space-y-6">
      {/* Stage Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Eye className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                  Stage 1: Vocabulary Gauntlet
                </span>
                <span className="text-xs text-slate-400">{unitTitle}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Bypass the Eye Monster (B1 Vocabulary)
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-0.5">
                Recognize target vocabulary through audio and sentence context. Dodge the Eye Monster&apos;s laser sensors to advance!
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="stage1-tab-study"
              onClick={() => setActiveTab('study')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'study'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Vocabulary Study ({vocabularyList.length})
            </button>
            <button
              id="stage1-tab-minigame"
              onClick={() => setActiveTab('minigame')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'minigame'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2. Laser Gauntlet</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>
          </div>
        </div>

        {/* Eye Monster Laser Animation Stage */}
        <div className={`mt-5 rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden ${
          laserAlertBlink
            ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-950'
            : 'bg-slate-950/70 border-slate-800'
        }`}>
          {/* Laser beam beam-line */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span className="animate-spin inline-block">👁️</span> Eye Monster Laser Scanner
            </span>
            <span>Laser Beam Sensitivity: <span className="text-emerald-400 font-bold">ACTIVE</span></span>
          </div>

          <div className="relative h-7 bg-slate-900 rounded-lg overflow-hidden flex items-center px-3 border border-slate-800">
            {/* Animated Laser beam */}
            <div className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r ${laserAlertBlink ? 'from-rose-500 via-red-400 to-rose-500' : 'from-amber-400 via-yellow-200 to-amber-400'} opacity-80 blur-[2px] animate-pulse`}
              style={{
                left: `${(currentQuizIdx / vocabularyList.length) * 80}%`,
                transition: 'left 0.5s ease-out'
              }}
            />
            <div className="relative z-10 flex items-center justify-between w-full text-[11px] font-semibold text-slate-300">
              <span>Lair Entrance</span>
              <span className="text-xs text-amber-300">
                Stealth Progress: {passedCount}/{vocabularyList.length} steps to egg nest
              </span>
              <span>Dragon Egg Vault 🥚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Vocabulary Study Cards */}
      {activeTab === 'study' && (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Core B1 Vocabulary Card ({studiedWordIdx + 1}/{vocabularyList.length})</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setStudiedWordIdx((prev) => (prev > 0 ? prev - 1 : vocabularyList.length - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 border border-slate-700 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setStudiedWordIdx((prev) => (prev + 1) % vocabularyList.length)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 border border-slate-700 cursor-pointer"
              >
                Next Word
              </button>
            </div>
          </div>

          {/* Featured Vocabulary Card */}
          {(() => {
            const wordItem = vocabularyList[studiedWordIdx];
            return (
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-6 relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-3xl font-black text-amber-300 tracking-wide">
                        {wordItem.word}
                      </h4>
                      <button
                        onClick={() => handleStudySpeak(wordItem.word)}
                        className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 cursor-pointer transition-all active:scale-95"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm font-mono text-emerald-400 mt-1">
                      {wordItem.phonetic}
                    </p>
                    <p className="text-base font-semibold text-slate-100 mt-2">
                      👉 Meaning: <span className="text-amber-200">{wordItem.meaningVi}</span>
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-right">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">
                      Key Phoneme / Sound
                    </span>
                    <span className="text-sm font-extrabold text-amber-400">
                      {wordItem.keySound}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Example Sentence:
                  </p>
                  <p className="text-sm font-medium text-slate-200 italic">
                    &quot;{wordItem.exampleEn}&quot;
                  </p>
                  <p className="text-xs text-slate-400">
                    ({wordItem.exampleVi})
                  </p>
                </div>

                {/* Switch to Mini-game prompt */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveTab('minigame')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
                  >
                    <span>Enter Laser Gauntlet Mini-Game</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 2: Laser Dodging Mini-Game */}
      {activeTab === 'minigame' && (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Eye Monster Laser Round {currentQuizIdx + 1}/{vocabularyList.length}
            </span>
            <span className="text-xs text-slate-400">
              Correct Word = +1 Step towards egg | Mistake = Dragon stirs (+25% Alert)
            </span>
          </div>

          {/* Question / Target Prompt */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Meaning & Context:</span>
              <button
                onClick={() => speakEnglish(currentQuizItem.word)}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to audio cipher</span>
              </button>
            </div>
            <p className="text-lg md:text-xl font-bold text-white mt-2">
              {currentQuizItem.meaningVi}
            </p>
            <div className="mt-3 text-xs md:text-sm text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-semibold">Fill in the blank: </span>
              <span className="italic text-amber-200">
                {currentQuizItem.exampleEn.replace(new RegExp(currentQuizItem.word, 'gi'), '_______')}
              </span>
            </div>
          </div>

          {/* 4 Laser Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {options.map((option, idx) => {
              let btnClasses = 'bg-slate-950/80 hover:bg-slate-850 border-slate-800 text-slate-200';

              if (isAnswered) {
                if (option.toLowerCase() === currentQuizItem.word.toLowerCase()) {
                  btnClasses = 'bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-950';
                } else if (option === selectedOption) {
                  btnClasses = 'bg-rose-600/90 border-rose-400 text-white font-bold shadow-lg shadow-rose-950';
                } else {
                  btnClasses = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  id={`stage1-opt-${idx}`}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${btnClasses}`}
                >
                  <span className="text-base">{option}</span>
                  {isAnswered && option.toLowerCase() === currentQuizItem.word.toLowerCase() && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback Banner */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl mb-4 text-xs md:text-sm flex items-start gap-3 ${
              isCorrect
                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border border-rose-500/50 text-rose-200'
            }`}>
              <div className="mt-0.5">
                {isCorrect ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">
                  {isCorrect
                    ? '✨ Stealth step executed cleanly! (+1 Step towards the nest)'
                    : '🚨 Laser tripped! The sleeping dragon shifts (+25% Alertness)'}
                </p>
                <p className="mt-1">
                  Target Word: <span className="font-bold underline text-amber-300">{currentQuizItem.word}</span> {currentQuizItem.phonetic} — {currentQuizItem.meaningVi}.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons: Only advance if correct, or retry word to learn it */}
          {isAnswered && (
            <div className="flex justify-end gap-3">
              {!isCorrect ? (
                <button
                  id="stage1-retry-btn"
                  onClick={handleRetryQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry This Word (Learn & Master)</span>
                </button>
              ) : (
                <button
                  id="stage1-next-btn"
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-black rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
                >
                  <span>
                    {currentQuizIdx + 1 >= vocabularyList.length
                      ? 'Complete Stage 1 ➔ Proceed to Stage 2'
                      : 'Next Laser Beam'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
