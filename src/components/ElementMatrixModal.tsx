import React, { useState } from 'react';
import { X, Shield, Zap, Sparkles, Flame, Snowflake, Leaf, Wind, Sun, Moon, Orbit, CircleDot, Star } from 'lucide-react';
import { ELEMENTS_MAP, ElementInfo, getElementInfo } from '../data/arenaData';

interface ElementMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElementMatrixModal: React.FC<ElementMatrixModalProps> = ({ isOpen, onClose }) => {
  const [selectedElement, setSelectedElement] = useState<string>('fire');

  if (!isOpen) return null;

  const currentInfo = getElementInfo(selectedElement);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-950/60">
              ⚡🛡️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Bảng Khắc Chế Ngũ Hành & Nguyên Tố</span>
                <span className="text-amber-400 font-bold hidden md:inline">• Pet Elemental Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                Hiểu rõ quan hệ tương sinh tương khắc để tối ưu hóa sát thương (+35%) trong Pet Arena!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Element Select Grid */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chọn hệ nguyên tố ({Object.keys(ELEMENTS_MAP).length} hệ):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(ELEMENTS_MAP).map((elem) => {
                const isSelected = selectedElement === elem.id;
                return (
                  <button
                    key={elem.id}
                    onClick={() => setSelectedElement(elem.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl">{elem.icon}</span>
                    <div className="overflow-hidden">
                      <div className={`font-bold text-xs truncate ${elem.color}`}>{elem.nameVi.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 truncate">{elem.nameEn}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5 text-amber-200">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Quy Tắc Sát Thương Arena:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                <li><strong className="text-emerald-400">Khắc hệ (Super Effective):</strong> Gây <span className="text-amber-300 font-bold">1.35x</span> sát thương.</li>
                <li><strong className="text-amber-400">Trung lập (Neutral):</strong> Gây <span className="text-white font-bold">1.0x</span> sát thương.</li>
                <li><strong className="text-rose-400">Bị khắc (Not Very Effective):</strong> Gây <span className="text-rose-300 font-bold">0.75x</span> sát thương.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Detailed Element Breakdown */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner space-y-5">
            <div className="space-y-4">
              {/* Selected Element Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentInfo.bgGradient} flex items-center justify-center text-4xl shadow-xl shadow-black/50`}>
                  {currentInfo.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-black ${currentInfo.color}`}>{currentInfo.nameVi}</h3>
                  <p className="text-xs text-slate-400">{currentInfo.description}</p>
                </div>
              </div>

              {/* Strong Against */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>⚔️ Khắc Chế (Gây +35% sát thương lên):</span>
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {currentInfo.strongAgainst.map((targetKey) => {
                    const target = ELEMENTS_MAP[targetKey];
                    if (!target) return null;
                    return (
                      <div
                        key={target.id}
                        className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2"
                      >
                        <span className="text-xl">{target.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${target.color}`}>{target.nameVi}</div>
                          <div className="text-[10px] text-emerald-300">Siêu hiệu quả</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weak Against */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🛡️ Bị Khắc Chế Bới (Giảm sát thương khi đối đầu):</span>
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {currentInfo.weakAgainst.map((targetKey) => {
                    const target = ELEMENTS_MAP[targetKey];
                    if (!target) return null;
                    return (
                      <div
                        key={target.id}
                        className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center gap-2"
                      >
                        <span className="text-xl">{target.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${target.color}`}>{target.nameVi}</div>
                          <div className="text-[10px] text-rose-300">Kháng đòn</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 text-center text-xs text-indigo-200">
              💡 Mẹo: Hãy chọn Pet có hệ khắc chế NPC đối phương trước khi bắt đầu thách đấu trong Arena!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
