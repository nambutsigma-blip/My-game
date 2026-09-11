import React, { useState, useEffect } from 'react';
import { Sparkles, Swords, Shield, Heart, Award, X, RotateCcw, Check, Zap, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PetCompanion } from '../types';
import { EvolvedPetSprite, getElementAuraColors } from './EvolvedPetSprite';
import { calculatePetStats } from '../data/arenaData';
import { playEvolutionSound, playMythicFanfare, playEnchantSound } from '../utils/soundEffects';

interface PetEvolutionModalProps {
  isOpen: boolean;
  pet: PetCompanion | null;
  onClose: () => void;
}

type EvolutionPhase = 'gathering' | 'cocoon' | 'awakening' | 'showcase';

export const PetEvolutionModal: React.FC<PetEvolutionModalProps> = ({
  isOpen,
  pet,
  onClose,
}) => {
  const [phase, setPhase] = useState<EvolutionPhase>('gathering');
  const [showFlash, setShowFlash] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Play full cinematic progression
  useEffect(() => {
    if (!isOpen || !pet) {
      setPhase('gathering');
      setProgressPercent(0);
      setShowFlash(false);
      return;
    }

    // Phase 1: Gathering energy
    setPhase('gathering');
    setProgressPercent(15);
    playEnchantSound();

    const t1 = setTimeout(() => {
      // Phase 2: Cocoon of Light
      setPhase('cocoon');
      setProgressPercent(45);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }, 1600);

    const t2 = setTimeout(() => {
      // Phase 3: Awakening & Wings Sprout
      setPhase('awakening');
      setProgressPercent(80);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);

      playEvolutionSound();
      playMythicFanfare();

      // Golden & celestial confetti rain
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#facc15', '#f59e0b', '#ec4899', '#38bdf8', '#c084fc', '#ffffff'],
      });
    }, 3200);

    const t3 = setTimeout(() => {
      // Phase 4: Showcase & Stats
      setPhase('showcase');
      setProgressPercent(100);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, pet]);

  const handleReplay = () => {
    if (!pet) return;
    setPhase('gathering');
    setProgressPercent(15);
    playEnchantSound();

    setTimeout(() => {
      setPhase('cocoon');
      setProgressPercent(45);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
    }, 1600);

    setTimeout(() => {
      setPhase('awakening');
      setProgressPercent(80);
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 500);
      playEvolutionSound();
      playMythicFanfare();

      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#facc15', '#f59e0b', '#ec4899', '#38bdf8', '#c084fc', '#ffffff'],
      });
    }, 3200);

    setTimeout(() => {
      setPhase('showcase');
      setProgressPercent(100);
    }, 4800);
  };

  if (!isOpen || !pet) return null;

  const elementColors = getElementAuraColors(pet.element);
  const baseStats = calculatePetStats({ ...pet, enchantmentLevel: 4 });
  const evolvedStats = calculatePetStats({ ...pet, enchantmentLevel: 5 });

  return (
    <div
      id="evolution-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/92 backdrop-blur-xl animate-fade-in"
    >
      {/* Blinding screen flash during metamorphosis */}
      {showFlash && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-500 opacity-90" />
      )}

      {/* Main Evolution Stage Container */}
      <div
        className={`relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-purple-950/80 border-2 border-yellow-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-yellow-500/20 flex flex-col items-center text-center overflow-hidden transition-all ${
          phase === 'gathering' || phase === 'cocoon' ? 'animate-rumble' : ''
        }`}
      >
        {/* Ambient cosmic nebula vortex backdrop */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-40"
          title="Đóng hoạt cảnh"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cinematic Header Phase Title */}
        <div className="relative z-10 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/60 text-[11px] font-black uppercase tracking-widest text-amber-300 shadow-lg">
            <Crown className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>
              {phase === 'gathering' && 'Giai Đoạn 1: Ngưng Tụ Tinh Hoa Rồng Thần'}
              {phase === 'cocoon' && 'Giai Đoạn 2: Phá Vỡ Giới Hạn Phàm Thể'}
              {phase === 'awakening' && 'Giai Đoạn 3: Đôi Cánh Thần Thoại Thức Tỉnh!'}
              {phase === 'showcase' && 'TIẾN HOÁ HOÀN TẤT • VẠN CỔ THẦN THÚ'}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mt-1.5 tracking-tight">
            {phase === 'showcase' ? `${pet.name} (Transcended Form)` : `Tiến Hoá Cấp 5: ${pet.name}`}
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-medium max-w-md mx-auto">
            {phase === 'gathering' && 'Hàng triệu tinh thể rồng đang hợp nhất, khai mở huyết mạch cổ đại...'}
            {phase === 'cocoon' && 'Kén ánh sáng bao bọc, cấu trúc linh hồn đang chuyển hóa thành bậc Thần Thánh!'}
            {phase === 'awakening' && 'Đôi cánh thiên giới bùng nổ, hào quang vương giả ngập tràn thiên địa!'}
            {phase === 'showcase' && 'Linh thú đã đạt cảnh giới tối cao 5 Sao, tăng vọt 160% toàn bộ thuộc tính và sở hữu đôi cánh thần thánh!'}
          </p>
        </div>

        {/* Center Stage: Transforming Sprite Display */}
        <div className="relative z-20 my-6 py-6 w-full flex items-center justify-center min-h-[220px]">
          {/* Phase 1: Gathering Energy Rings */}
          {phase === 'gathering' && (
            <div className="relative flex items-center justify-center">
              {/* Converging energy rings */}
              <div className="absolute w-44 h-44 rounded-full border-2 border-amber-400/60 animate-ping opacity-60 pointer-events-none" />
              <div className="absolute w-56 h-56 rounded-full border border-purple-400/50 animate-pulse pointer-events-none" />
              <EvolvedPetSprite pet={pet} size="xl" isEvolved={false} />
            </div>
          )}

          {/* Phase 2: Cocoon of Blinding Metamorphosis */}
          {phase === 'cocoon' && (
            <div className="relative flex items-center justify-center">
              {/* Glowing shockwave pulses */}
              <div className="absolute w-36 h-36 rounded-full border-4 border-yellow-300 animate-shockwave pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full border-2 border-cyan-300 animate-shockwave pointer-events-none" style={{ animationDelay: '0.4s' }} />

              {/* Luminous chrysalis glow */}
              <div className="absolute w-36 h-36 rounded-full bg-yellow-200/90 blur-xl animate-pulse" />

              {/* Sprite transforming inside cocoon */}
              <div className="filter brightness-200 contrast-125 scale-110 transition-all duration-700">
                <EvolvedPetSprite pet={pet} size="giant" isEvolved={false} />
              </div>
            </div>
          )}

          {/* Phase 3 & 4: Wings Sprout & Fully Transcended Awakened God Form */}
          {(phase === 'awakening' || phase === 'showcase') && (
            <div className="relative flex items-center justify-center animate-fade-in">
              <EvolvedPetSprite
                pet={pet}
                size="giant"
                isEvolved={true}
                isSproutingWings={phase === 'awakening'}
              />
            </div>
          )}
        </div>

        {/* Phase Progress Bar */}
        <div className="w-full max-w-md bg-slate-950/80 p-1.5 rounded-full border border-slate-800 my-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-purple-500 transition-all duration-700 shadow-md shadow-amber-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats & Perk Boost Showcase (Revealed when reaching phase 4) */}
        {phase === 'showcase' && (
          <div className="w-full relative z-20 mt-3 animate-fade-in space-y-3">
            {/* Stat comparison grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto">
              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[11px] text-rose-400 font-bold mb-0.5">
                  <Heart className="w-3.5 h-3.5" /> HP Tối Đa
                </div>
                <div className="text-base font-black text-white">{evolvedStats.maxHp}</div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  +{evolvedStats.maxHp - baseStats.maxHp} (+160% Total)
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold mb-0.5">
                  <Swords className="w-3.5 h-3.5" /> Tấn Công
                </div>
                <div className="text-base font-black text-white">{evolvedStats.atk}</div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  +{evolvedStats.atk - baseStats.atk} (+160% Total)
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-center shadow-md">
                <div className="flex items-center justify-center gap-1 text-[11px] text-blue-400 font-bold mb-0.5">
                  <Shield className="w-3.5 h-3.5" /> Phòng Thủ
                </div>
                <div className="text-base font-black text-white">{evolvedStats.def}</div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  +{evolvedStats.def - baseStats.def} (+90% Total)
                </div>
              </div>
            </div>

            {/* Unlocked Divine Passive Banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/80 border border-yellow-400/50 max-w-lg mx-auto text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-xl shrink-0 shadow-lg">
                🪽
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300 uppercase">
                  <span>Thiên Cánh & Long Uy Tối Thượng</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/40">
                    5★ Perk
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  Tăng 35% tỉ lệ chí mạng trong Đấu Trường Rồng và kích hoạt Hào Quang Bất Diệt!
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="replay-evolution-btn"
                onClick={handleReplay}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem Lại Hoạt Cảnh</span>
              </button>

              <button
                id="confirm-evolution-btn"
                onClick={onClose}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-950/50 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Tiếp Nhận Thần Thú & Hoàn Tất</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
