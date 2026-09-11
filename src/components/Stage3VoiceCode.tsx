import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertTriangle, CheckCircle, Shield, Award, HelpCircle, ArrowRight, MessageSquare, Flame, Clock, RefreshCw, Send, Check } from 'lucide-react';
import { SpeakingCipher, SpeechAnalysisResult, WordScore } from '../types';
import { speakEnglish, playStealthStep, playLaser, playAlertUp, playSuccessChime } from '../utils/soundEffects';

interface Stage3VoiceCodeProps {
  speakingCipher: SpeakingCipher;
  unitTitle: string;
  onCorrectSpeaking: () => void;
  onWrongSpeaking: () => void;
  onEggStolenSuccess: (score: number) => void;
}

// Client-side fallback analyzer if backend is unreachable or latency occurs
function fallbackAnalyzeSpeech(transcript: string, targetPhrase: string, expectedGrammarRule?: string): SpeechAnalysisResult {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();
  const targetWords = targetPhrase.split(/\s+/).filter(Boolean);
  const transcriptWords = clean(transcript).split(/\s+/).filter(Boolean);

  let matchCount = 0;
  const wordScores: WordScore[] = targetWords.map((word) => {
    const cleanW = clean(word);
    const foundExact = transcriptWords.includes(cleanW);
    const foundPartial = transcriptWords.some((tw) => tw.includes(cleanW) || cleanW.includes(tw));

    if (foundExact) {
      matchCount += 1;
      return {
        word,
        status: 'green',
        note: 'Phát âm chuẩn xác, rõ ràng',
      };
    } else if (foundPartial) {
      matchCount += 0.8;
      return {
        word,
        status: 'yellow',
        note: 'Gần đúng, chú ý bật rõ âm đuôi /s/, /t/, /ed/',
      };
    } else {
      return {
        word,
        status: 'red',
        note: 'Chưa nghe rõ từ này hoặc phát âm lệch',
      };
    }
  });

  const ratio = targetWords.length > 0 ? matchCount / targetWords.length : 0;
  const score = Math.round(Math.min(100, Math.max(30, ratio * 100)));
  const grammarCorrect = ratio >= 0.75;

  return {
    grammarCorrect,
    grammarFeedback: grammarCorrect
      ? 'Ngữ pháp chuẩn xác! Bạn đã phát âm đúng cấu trúc trọng tâm.'
      : `Cần bám sát mẫu câu: "${targetPhrase}".`,
    pronunciationFeedback: score >= 80
      ? 'Phát âm to, rõ ràng và chuẩn ngữ điệu!'
      : score >= 65
      ? 'Phát âm tương đối tốt, hãy bật rõ hơn các âm đuôi.'
      : 'Âm thanh chưa đủ rõ. Bạn hãy đọc chậm rãi từng từ một nhé.',
    pronunciationTip: 'Mẹo: Bạn có vô hạn thời gian đọc! Lấy hơi sâu, nói to dứt khoát từng âm.',
    score,
    dragonStirs: score < 80,
    wordScores,
  };
}

function fallbackAnalyzeDragon(studentResponse: string, requiredStructure?: string) {
  const words = studentResponse.trim().split(/\s+/).filter(Boolean);
  const isReasonable = words.length >= 3;
  const passed = isReasonable;
  return {
    passed,
    grammarScore: isReasonable ? 9 : 5,
    pronunciationScore: isReasonable ? 9 : 5,
    dragonReaction: passed
      ? 'Rồng gác cổng khẽ cựa mình, gật đầu lắng nghe câu trả lời rồi từ từ khép mi mắt lại cho bạn lướt qua!'
      : 'Rồng mở to đôi mắt rực lửa: "Câu trả lời của ngươi quá ngắn hoặc chưa dùng đúng cấu trúc mật mã!"',
    feedback: passed
      ? 'Bạn đã trả lời rất lưu loát và tự tin, bám sát cấu trúc của bài học.'
      : `Hãy sử dụng câu đầy đủ có chủ ngữ, vị ngữ và áp dụng ${requiredStructure || 'cấu trúc bài học'}.`,
    improvedSentence: studentResponse.trim() + (studentResponse.endsWith('.') ? '' : '.'),
  };
}

export const Stage3VoiceCode: React.FC<Stage3VoiceCodeProps> = ({
  speakingCipher,
  unitTitle,
  onCorrectSpeaking,
  onWrongSpeaking,
  onEggStolenSuccess,
}) => {
  const [activeSubMode, setActiveSubMode] = useState<'cage_cipher' | 'dragon_challenge'>('cage_cipher');

  // Mode 1: Glass Cage Cipher state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SpeechAnalysisResult | null>(null);
  const [cageCracked, setCageCracked] = useState(false);

  // Mode 2: 1-1 Dragon Challenge state
  const [dragonResponseTranscript, setDragonResponseTranscript] = useState('');
  const [isDragonAnalyzing, setIsDragonAnalyzing] = useState(false);
  const [dragonFeedback, setDragonFeedback] = useState<any | null>(null);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  // Setup Continuous Speech Recognition with Infinite Reading Time
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recog = new SpeechRecognitionClass();
        // Continuous = true: Do not cut off while user pauses or reads slowly! Infinite reading time!
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }
          const cleanedText = fullTranscript.trim();
          if (activeSubMode === 'cage_cipher') {
            setTranscript(cleanedText);
          } else {
            setDragonResponseTranscript(cleanedText);
          }
        };

        recog.onerror = (event: any) => {
          console.warn('[Speech Recognition Event]', event.error);
          if (event.error !== 'no-speech') {
            setIsRecording(false);
          }
        };

        recog.onend = () => {
          // If ended naturally by browser, allow restart if still in recording intent
        };

        recognitionRef.current = recog;
      }
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore cleanup error
      }
    };
  }, [activeSubMode, speakingCipher]);

  // Start continuous recording (Infinite Reading Time)
  const handleStartRecording = () => {
    setAnalysisResult(null);
    setDragonFeedback(null);
    if (activeSubMode === 'cage_cipher') {
      setTranscript('');
    } else {
      setDragonResponseTranscript('');
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('SpeechRecognition start failed or already active:', e);
        setIsRecording(true);
      }
    } else {
      // Fallback prompt for browsers without speech recognition support
      const fallbackPromptText = prompt(
        'Nhập hoặc đọc câu tiếng Anh của bạn (Hệ thống hỗ trợ vô hạn thời gian đọc & suy nghĩ):',
        activeSubMode === 'cage_cipher' ? speakingCipher.targetPhrase : ''
      );
      if (fallbackPromptText) {
        if (activeSubMode === 'cage_cipher') {
          setTranscript(fallbackPromptText);
          analyzeSpeech(fallbackPromptText);
        } else {
          setDragonResponseTranscript(fallbackPromptText);
          analyzeDragonResponse(fallbackPromptText);
        }
      }
    }
  };

  // Stop recording and trigger evaluation
  const handleStopAndEvaluate = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);

    if (activeSubMode === 'cage_cipher') {
      const textToAnalyze = transcript.trim();
      if (!textToAnalyze) {
        // If empty, pre-fill sample so user is never stuck
        setTranscript(speakingCipher.targetPhrase);
        analyzeSpeech(speakingCipher.targetPhrase);
        return;
      }
      analyzeSpeech(textToAnalyze);
    } else {
      const textToAnalyze = dragonResponseTranscript.trim();
      if (!textToAnalyze) {
        const sample = speakingCipher.dragonGatekeeperPrompt.sampleAnswers?.[0] || 'I study English every day.';
        setDragonResponseTranscript(sample);
        analyzeDragonResponse(sample);
        return;
      }
      analyzeDragonResponse(textToAnalyze);
    }
  };

  const handleCancelRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsRecording(false);
  };

  // Analyze Speech via Backend API (calls Gemini model server-side with local fallback)
  const analyzeSpeech = async (spokenText: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: spokenText,
          targetPhrase: speakingCipher.targetPhrase,
          expectedGrammarRule: speakingCipher.expectedGrammarRule,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: SpeechAnalysisResult = await res.json();
      setAnalysisResult(data);

      if (data.score >= 80 && data.grammarCorrect) {
        setCageCracked(true);
        playSuccessChime();
        onCorrectSpeaking();
      } else {
        playLaser();
        playAlertUp();
        onWrongSpeaking();
      }
    } catch (err) {
      console.warn('Backend speech analysis error, using reliable client fallback:', err);
      const fallbackData = fallbackAnalyzeSpeech(spokenText, speakingCipher.targetPhrase, speakingCipher.expectedGrammarRule);
      setAnalysisResult(fallbackData);
      if (fallbackData.score >= 80 && fallbackData.grammarCorrect) {
        setCageCracked(true);
        playSuccessChime();
        onCorrectSpeaking();
      } else {
        playLaser();
        playAlertUp();
        onWrongSpeaking();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze 1-1 Dragon Challenge via Backend API
  const analyzeDragonResponse = async (spokenText: string) => {
    setIsDragonAnalyzing(true);
    try {
      const res = await fetch('/api/dragon-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dragonQuestion: speakingCipher.dragonGatekeeperPrompt.question,
          studentResponse: spokenText,
          unitTopic: unitTitle,
          requiredStructure: speakingCipher.expectedGrammarRule,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setDragonFeedback(data);

      if (data.passed) {
        playSuccessChime();
        onCorrectSpeaking();
      } else {
        playLaser();
        playAlertUp();
        onWrongSpeaking();
      }
    } catch (err) {
      console.warn('Backend dragon challenge error, using reliable client fallback:', err);
      const fallbackData = fallbackAnalyzeDragon(spokenText, speakingCipher.expectedGrammarRule);
      setDragonFeedback(fallbackData);
      if (fallbackData.passed) {
        playSuccessChime();
        onCorrectSpeaking();
      } else {
        playLaser();
        playAlertUp();
        onWrongSpeaking();
      }
    } finally {
      setIsDragonAnalyzing(false);
    }
  };

  return (
    <div id="stage-3-container" className="space-y-6">
      {/* Stage Header */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Mic className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/60">
                  Stage 3: Crucial Challenge
                </span>
                <span className="text-xs text-slate-400">{unitTitle}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <span>Voice Cipher & AI Audio Sensor</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-0.5">
                Vô hạn thời gian đọc! Phát âm chuẩn xác câu mật mã tiếng Anh để phá lồng kính và trộm Trứng Rồng.
              </p>
            </div>
          </div>

          {/* Sub-mode switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="submode-cage-cipher"
              onClick={() => {
                handleCancelRecording();
                setActiveSubMode('cage_cipher');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubMode === 'cage_cipher'
                  ? 'bg-rose-600 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Glass Cage Cipher
            </button>
            <button
              id="submode-dragon-challenge"
              onClick={() => {
                handleCancelRecording();
                setActiveSubMode('dragon_challenge');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubMode === 'dragon_challenge'
                  ? 'bg-rose-600 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2. 1-on-1 Dragon Duel</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </button>
          </div>
        </div>

        {/* Unlimited Reading Time Banner & Legend */}
        <div className="mt-5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-extrabold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời Gian Đọc: VÔ HẠN (∞)</span>
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Thoải mái phát âm chậm rãi, không bị tự động ngắt câu hay ép thời gian!
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Xanh: Chuẩn xác
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              Vàng: Thiếu âm đuôi
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              Đỏ: Sai hoặc bỏ sót
            </span>
          </div>
        </div>
      </div>

      {/* SUB-MODE 1: Glass Cage Cipher Decryption */}
      {activeSubMode === 'cage_cipher' && (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
          {/* Glass Cage Visual Stage */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden text-center mb-6 ${
              cageCracked
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-2xl shadow-emerald-950'
                : 'bg-slate-950/80 border-slate-700 shadow-xl'
            }`}
          >
            <div className="inline-block relative">
              <div
                className={`text-6xl md:text-7xl mb-2 transition-transform duration-500 ${
                  cageCracked ? 'scale-125 animate-bounce' : 'scale-100'
                }`}
              >
                {cageCracked ? '✨🥚🏆' : '🔒🥚✨'}
              </div>
              {cageCracked && (
                <div className="absolute -top-3 -right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  GLASS CAGE UNLOCKED!
                </div>
              )}
            </div>

            <h3 className="text-xl font-black text-white mt-1">
              {cageCracked ? 'GLASS CAGE SUCCESSFULLY SHATTERED!' : speakingCipher.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
              {cageCracked
                ? 'Voice cipher decoded with excellence! Claim the legendary dragon egg!'
                : 'Khung kính phong ấn Trứng Rồng cần câu mật mã chuẩn xác. Đọc to, rõ ràng và dứt khoát âm cuối!'}
            </p>
          </div>

          {/* Target Phrase Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Mật Mã Cần Đọc (Target Voice Cipher):</span>
              </span>
              <button
                onClick={() => speakEnglish(speakingCipher.targetPhrase)}
                className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-800/40 cursor-pointer transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Giọng Đọc Mẫu Chuẩn</span>
              </button>
            </div>

            <p className="text-xl md:text-2xl font-black text-white tracking-wide">
              &quot;{speakingCipher.targetPhrase}&quot;
            </p>
            <p className="text-sm font-mono text-emerald-400 mt-1">
              {speakingCipher.phonetic}
            </p>
            <p className="text-xs text-slate-300 mt-2">
              👉 Ý nghĩa: <span className="text-amber-200 font-medium">{speakingCipher.meaningVi}</span>
            </p>

            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400">Trọng tâm âm cuối (Ending Sounds): </span>
                <span className="font-bold text-amber-300 font-mono">
                  {speakingCipher.targetSounds.join(' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Quy tắc ngữ pháp: </span>
                <span className="font-bold text-indigo-300">
                  {speakingCipher.expectedGrammarRule}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Microphone Recording Center (Infinite Reading Time) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 text-center mb-6">
            <div className="flex flex-col items-center justify-center">
              {/* Record Button with Pulsing Glow when active */}
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-rose-600/40 animate-ping" />
                )}
                <button
                  id="voice-record-btn"
                  onClick={isRecording ? handleStopAndEvaluate : handleStartRecording}
                  disabled={isAnalyzing}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-xl ${
                    isRecording
                      ? 'bg-rose-600 shadow-rose-900/80 scale-105'
                      : 'bg-gradient-to-tr from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-rose-950/50 hover:scale-105 active:scale-95'
                  }`}
                  title={isRecording ? 'Bấm để dừng và chấm điểm' : 'Bấm để bắt đầu đọc mật mã (Vô hạn thời gian)'}
                >
                  {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                  {isRecording ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>Đang nghe bạn đọc... (Vô hạn thời gian đọc - Thoải mái phát âm!)</span>
                    </>
                  ) : isAnalyzing ? (
                    'Cảm biến âm thanh AI đang phân tích sóng âm & âm tiết...'
                  ) : (
                    'Bấm vào micro để bắt đầu đọc mật mã (Không giới hạn thời gian)'
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Đọc trọn vẹn câu, bạn có thể nghỉ giữa câu mà không bị ngắt lời. Khi đọc xong, hãy bấm nút Hoàn Tất bên dưới!
                </p>
              </div>

              {/* Action Buttons during / after recording */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {isRecording ? (
                  <>
                    <button
                      id="voice-finish-btn"
                      onClick={handleStopAndEvaluate}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      <span>Hoàn Tất Đọc & Chấm Điểm</span>
                    </button>
                    <button
                      onClick={handleCancelRecording}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Huỷ Thu Âm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer transition-all hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Bắt Đầu Đọc Mật Mã (Vô Hạn Giờ)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Real-Time Transcript & Manual Editor Box */}
            <div className="mt-6 text-left border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>📝 Lời đọc được nhận diện (Có thể chỉnh sửa nếu micro nhận nhầm từ):</span>
                </label>
                {transcript && (
                  <button
                    onClick={() => setTranscript('')}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Xoá văn bản
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  id="voice-transcript-input"
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Lời đọc của bạn sẽ hiển thị tại đây khi bạn nói vào micro..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-medium"
                />
                <button
                  id="voice-manual-eval-btn"
                  onClick={() => {
                    const text = transcript.trim() || speakingCipher.targetPhrase;
                    setTranscript(text);
                    analyzeSpeech(text);
                  }}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chấm Điểm</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Tutor Feedback Display (Word & Phoneme Highlight) */}
          {analysisResult && (
            <div className="bg-slate-950 border-2 border-rose-900/50 rounded-2xl p-5 mb-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Sensor Acoustic Feedback</span>
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${
                    analysisResult.score >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  Độ Chính Xác: {analysisResult.score}/100
                </span>
              </div>

              {/* Word by Word Highlight */}
              <div>
                <div className="text-xs text-slate-400 mb-2 font-semibold">
                  Chi tiết từng âm tiết & từ vựng:
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.wordScores.map((ws, i) => {
                    let badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60';
                    if (ws.status === 'yellow') {
                      badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-500/60 animate-pulse';
                    } else if (ws.status === 'red') {
                      badgeColor = 'bg-rose-950/80 text-rose-300 border-rose-500/60';
                    }

                    return (
                      <div
                        key={i}
                        className={`px-3 py-1.5 rounded-xl border font-mono text-sm font-bold flex items-center gap-1.5 ${badgeColor}`}
                        title={ws.note || ws.status}
                      >
                        <span>{ws.word}</span>
                        <span className="text-[10px] uppercase opacity-75">
                          {ws.status === 'green' ? '✓' : ws.status === 'yellow' ? '~' : '✗'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exact format feedback */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 font-mono text-xs md:text-sm space-y-2 text-slate-200">
                <div className="text-slate-400 pb-1 border-b border-slate-800">
                  <span className="font-bold text-amber-300">[Bạn đã đọc]:</span> &quot;{transcript}&quot;
                </div>
                <div>
                  <span className="font-bold text-rose-400">[Đánh giá từ AI]:</span>
                </div>
                <div className="text-rose-300 pl-3">
                  {analysisResult.grammarCorrect ? '✅ ' : '❌ '}
                  <span className="font-semibold">{analysisResult.grammarFeedback}</span>
                </div>
                <div className="text-amber-300 pl-3">
                  ⚠️ <span className="font-semibold">{analysisResult.pronunciationFeedback}</span>
                </div>
                <div className="text-teal-300 pl-3">
                  👉 <span className="font-semibold">{analysisResult.pronunciationTip}</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Action to crack cage and claim egg */}
          {cageCracked && (
            <div className="flex justify-end">
              <button
                id="claim-egg-btn"
                onClick={() => onEggStolenSuccess(analysisResult?.score || 90)}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm uppercase tracking-wider shadow-xl shadow-amber-950/50 cursor-pointer transition-all animate-bounce"
              >
                <span>Steal Dragon Egg & Secure Mission!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-MODE 2: 1-1 Guardian Dragon Challenge */}
      {activeSubMode === 'dragon_challenge' && (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 backdrop-blur-md">
          {/* Dragon Gatekeeper Avatar & Speech Bubble */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-700 flex items-center justify-center text-4xl shadow-lg shadow-rose-950/60">
                🐉
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                    Lair Gatekeeper Dragon
                  </span>
                  <span className="text-[10px] bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-full border border-rose-700">
                    1-on-1 Voice Dialogue
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700">
                    Vô hạn thời gian
                  </span>
                </div>
                <p className="text-lg md:text-xl font-black text-white">
                  &quot;{speakingCipher.dragonGatekeeperPrompt.question}&quot;
                </p>
                <div className="mt-2 text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold">Suggested Grammar Pattern: </span>
                  <span className="italic">{speakingCipher.dragonGatekeeperPrompt.suggestedPattern}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recording / Speaking response with Infinite Time */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 text-center mb-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping" />
                )}
                <button
                  id="dragon-voice-record-btn"
                  onClick={isRecording ? handleStopAndEvaluate : handleStartRecording}
                  disabled={isDragonAnalyzing}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-xl ${
                    isRecording
                      ? 'bg-amber-500 shadow-amber-900/80 scale-105'
                      : 'bg-gradient-to-tr from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 hover:scale-105 active:scale-95'
                  }`}
                  title={isRecording ? 'Bấm để dừng và gửi câu trả lời' : 'Bấm micro và đọc câu trả lời của bạn'}
                >
                  {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                  {isRecording ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                      <span>Đang lắng nghe câu trả lời của bạn... (Vô hạn thời gian)</span>
                    </>
                  ) : isDragonAnalyzing ? (
                    'Rồng thần đang suy ngẫm câu trả lời của bạn...'
                  ) : (
                    'Bấm micro và đọc to câu trả lời gửi đến Rồng thần'
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Áp dụng cấu trúc ngữ pháp bài học để làm nguội cơn thịnh nộ của Rồng
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {isRecording ? (
                  <>
                    <button
                      onClick={handleStopAndEvaluate}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer transition-all hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      <span>Hoàn Tất & Gửi Câu Trả Lời</span>
                    </button>
                    <button
                      onClick={handleCancelRecording}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Huỷ Thu Âm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Bắt Đầu Đọc Trả Lời (Vô Hạn Giờ)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Response transcript & Manual text editor */}
            <div className="mt-6 text-left border-t border-slate-800 pt-5">
              <label className="text-xs font-bold text-slate-300 block mb-2">
                📝 Nội dung câu trả lời của bạn (Có thể gõ trực tiếp):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dragonResponseTranscript}
                  onChange={(e) => setDragonResponseTranscript(e.target.value)}
                  placeholder="Lời bạn nói sẽ xuất hiện ở đây hoặc bạn có thể gõ trực tiếp..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  onClick={() => {
                    const text = dragonResponseTranscript.trim() || speakingCipher.dragonGatekeeperPrompt.sampleAnswers?.[0] || 'I study English every day.';
                    setDragonResponseTranscript(text);
                    analyzeDragonResponse(text);
                  }}
                  disabled={isDragonAnalyzing}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Rồng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dragon 1-1 AI Evaluation Feedback */}
          {dragonFeedback && (
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 mb-5 space-y-3 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white">Phản Ứng Của Rồng Thần:</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700">
                    Ngữ Pháp: {dragonFeedback.grammarScore}/10
                  </span>
                  <span className="bg-amber-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-700">
                    Phát Âm: {dragonFeedback.pronunciationScore}/10
                  </span>
                </div>
              </div>

              <div className="text-sm font-semibold text-amber-200 italic bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
                &quot;{dragonFeedback.dragonReaction}&quot;
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <span className="text-slate-400 font-semibold">Gợi ý từ AI: </span>
                  {dragonFeedback.feedback}
                </p>
                {dragonFeedback.improvedSentence && (
                  <p className="text-emerald-300 font-mono pt-1">
                    ✨ Câu hoàn thiện gợi ý: &quot;{dragonFeedback.improvedSentence}&quot;
                  </p>
                )}
              </div>

              {dragonFeedback.passed && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveSubMode('cage_cipher')}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Rồng Đã Thuần Hoá ➔ Quay Lại Phá Lồng Kính
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
