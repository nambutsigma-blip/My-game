import React, { useState } from 'react';
import { X, BookOpen, Volume2, Sparkles, Send, Search, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { UnitData, VocabularyItem, GrammarTrapItem } from '../types';
import { playSuccessChime, playLaser } from '../utils/soundEffects';

interface StudySystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUnit: UnitData;
  allUnits: UnitData[];
}

export const StudySystemModal: React.FC<StudySystemModalProps> = ({
  isOpen,
  onClose,
  currentUnit,
  allUnits,
}) => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'ai'>('vocab');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState(currentUnit.id);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `🤖 Chào bạn! Tôi là Trợ lý AI Gia Sư Tiếng Anh. Hãy hỏi tôi bất cứ điều gì về từ vựng, ngữ pháp, mẹo thi vào 10 hoặc cấu trúc của bài "${currentUnit.title}" nhé!`,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const targetUnit = allUnits.find((u) => u.id === selectedUnitId) || currentUnit;
  const vocabList = targetUnit.vocabulary || [];
  const grammarList = targetUnit.grammarTraps || [];

  const filteredVocab = vocabList.filter(
    (v) =>
      v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.meaningVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.exampleEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGrammar = grammarList.filter(
    (g) =>
      g.instruction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.sentencePrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.grammarRuleExplaining.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAiLoading) return;

    const question = userInput.trim();
    setUserInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/study-ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: question,
          unitTitle: targetUnit.title,
          vocabulary: vocabList,
          grammar: grammarList,
        }),
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || '🤖 [AI Gia Sư]: Xin lỗi, tôi chưa nhận được phản hồi phù hợp.' },
      ]);
      playSuccessChime();
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: '🤖 [AI Gia Sư]: Có lỗi kết nối mạng. Hãy thử lại câu hỏi nhé!' },
      ]);
      playLaser();
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-indigo-500/70 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-950/60">
              📖
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Hệ Thống Học Bài & Trợ Lý AI</span>
                <span className="text-indigo-400 font-bold hidden md:inline">• Ôn Thi Vào 10</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tra cứu từ vựng, bảng ngữ pháp trọng tâm và đặt câu hỏi cho Gia Sư AI thông minh!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Selector */}
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-700 hover:border-indigo-500 focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[240px] truncate"
            >
              {allUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bảng Từ Vựng ({vocabList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bảng Ngữ Pháp ({grammarList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Gia Sư AI 24/7</span>
          </button>
        </div>

        {/* Search Bar (for vocab & grammar tabs) */}
        {activeTab !== 'ai' && (
          <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-900/50">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng, nghĩa tiếng Việt hoặc cấu trúc ngữ pháp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* ================= TAB 1: VOCABULARY TABLE ================= */}
          {activeTab === 'vocab' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Danh sách từ vựng trọng tâm bài {targetUnit.title}</span>
                <span>Bấm vào biểu tượng loa để nghe phát âm</span>
              </div>

              {filteredVocab.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-semibold">Không tìm thấy từ vựng phù hợp.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredVocab.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-indigo-300">{v.word}</h4>
                            <span className="text-xs font-mono text-slate-400">{v.phonetic}</span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-400 mt-0.5">{v.meaningVi}</p>
                        </div>
                        <button
                          onClick={() => speakWord(v.word)}
                          className="p-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 cursor-pointer transition-all active:scale-95"
                          title="Nghe phát âm chuẩn"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                        <p className="text-slate-200 italic">&ldquo;{v.exampleEn}&rdquo;</p>
                        <p className="text-slate-400">{v.exampleVi}</p>
                      </div>

                      {v.keySound && (
                        <div className="text-[10px] text-purple-300 font-medium">
                          🎵 Trọng âm / Âm lưu ý: <span className="font-bold">{v.keySound}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: GRAMMAR TABLE ================= */}
          {activeTab === 'grammar' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Cấu trúc ngữ pháp & Mẫubẫy bài {targetUnit.title}</span>
                <span>Ôn thi học sinh giỏi & Vào 10</span>
              </div>

              {filteredGrammar.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-base font-semibold">Không tìm thấy cấu trúc ngữ pháp phù hợp.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGrammar.map((g, index) => (
                    <div
                      key={g.id || index}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/40">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">{g.instruction}</h4>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300">
                        {g.sentencePrompt}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>Đáp án chuẩn: {g.correctAnswer}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200 leading-relaxed">
                        <span className="font-bold text-indigo-300 block mb-0.5">💡 Giải thích chi tiết quy tắc:</span>
                        {g.grammarRuleExplaining}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: AI STUDY ASSISTANT ================= */}
          {activeTab === 'ai' && (
            <div className="flex flex-col h-[52vh] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md'
                      }`}
                    >
                      {msg.sender === 'user' ? '🧑‍🎓' : '🤖'}
                    </div>
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse p-2">
                    <span>🤖 Gia Sư AI đang soạn câu trả lời...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendAiMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Hỏi Gia Sư AI về từ vựng, ngữ pháp bài "${targetUnit.title}"...`}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !userInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi hỏi</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
