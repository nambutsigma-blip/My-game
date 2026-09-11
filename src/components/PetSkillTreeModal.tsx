import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Info,
  Footprints,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillBranchId, SkillTreeState, PetSkillNode } from '../types';
import {
  PET_SKILL_NODES,
  SKILL_BRANCHES,
  calculateTotalSpentCrystals,
  getPassiveBonuses,
} from '../data/skillTreeData';
import { playEnchantSound } from '../utils/soundEffects';

interface PetSkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dragonCrystals: number;
  skillTreeState: SkillTreeState;
  onUpgradeSkill: (skillId: string) => boolean;
  onResetSkills: () => void;
}

export const PetSkillTreeModal: React.FC<PetSkillTreeModalProps> = ({
  isOpen,
  onClose,
  dragonCrystals,
  skillTreeState,
  onUpgradeSkill,
  onResetSkills,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<SkillBranchId | 'all'>('all');
  const [inspectNode, setInspectNode] = useState<PetSkillNode | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (!isOpen) return null;

  const totalInvested = calculateTotalSpentCrystals(skillTreeState);
  const passiveBonuses = getPassiveBonuses(skillTreeState);

  const filteredNodes = PET_SKILL_NODES.filter((node) => {
    if (selectedBranch === 'all') return true;
    return node.branch === selectedBranch;
  });

  const handleUpgrade = (node: PetSkillNode) => {
    const currentLevel = skillTreeState[node.id] || 0;
    if (currentLevel >= node.maxLevel) return;

    const cost = node.costs[currentLevel];
    if (dragonCrystals < cost) return;

    // Check prerequisites
    const prereqsMet = node.prerequisites.every(
      (preId) => (skillTreeState[preId] || 0) > 0
    );
    if (!prereqsMet) return;

    const success = onUpgradeSkill(node.id);
    if (success) {
      playEnchantSound();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#fbbf24', '#34d399', '#38bdf8'],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border-2 border-purple-500/70 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-950/60">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Pet Skill Tree</span>
                  <span className="text-purple-400 font-bold hidden sm:inline">• Permanent Passive Sanctum</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Spend Dragon Crystals to unlock permanent passives: Faster Alert Cooldown, Increased Crystal Yield & Arena Perks!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dragon Crystals Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-xs font-black text-purple-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{dragonCrystals}</span>
              <span className="text-[10px] text-purple-400 font-bold hidden sm:inline">Crystals</span>
            </div>

            {/* Close button */}
            <button
              id="skill-tree-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Skill Tree"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Active Passives Quick Status Strip */}
        <div className="my-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Perks ({passiveBonuses.unlockedPerksCount}):</span>
            </span>

            {passiveBonuses.alertCooldownSeconds > 0 ? (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                <span>💤 -{passiveBonuses.alertCooldownAmount}% Alert / {passiveBonuses.alertCooldownSeconds}s</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-500 text-[11px]">
                💤 Alert Cooldown Inactive
              </span>
            )}

            {passiveBonuses.crystalMultiplier > 0 ? (
              <span className="px-2 py-0.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-[11px] font-bold text-purple-300 flex items-center gap-1">
                <span>💎 +{Math.round(passiveBonuses.crystalMultiplier * 100)}% Crystal Yield</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-500 text-[11px]">
                💎 Crystal Boost Inactive
              </span>
            )}

            {passiveBonuses.mistakePenalty < 25 && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-950/70 border border-teal-500/40 text-[11px] font-bold text-teal-300 flex items-center gap-1">
                <span>🤫 Mistake: +{passiveBonuses.mistakePenalty}% (Not +25%)</span>
              </span>
            )}

            {passiveBonuses.startingBootsCount > 1 && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                <span>👟 {passiveBonuses.startingBootsCount} Boots (-{passiveBonuses.bootsAlertReduction}%)</span>
              </span>
            )}

            {passiveBonuses.petHpMultiplier > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-[11px] font-bold text-rose-300 flex items-center gap-1">
                <span>⚔️ +{Math.round(passiveBonuses.petHpMultiplier * 100)}% Pet HP</span>
              </span>
            )}
          </div>

          {/* Reset / Respec Points Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Invested: <strong className="text-purple-300">{totalInvested}</strong> 💎
            </span>
            {totalInvested > 0 && (
              <button
                onClick={() => setConfirmResetOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-950/70 hover:border-rose-500/40 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-rose-300 flex items-center gap-1 transition-all cursor-pointer"
                title="Reset skill tree and refund 100% of invested Dragon Crystals"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (100% Refund)</span>
              </button>
            )}
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950/90 p-1.5 rounded-2xl mb-3 border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedBranch('all')}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedBranch === 'all'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌌 All Passives</span>
            <span className="text-[10px] opacity-75">({PET_SKILL_NODES.length})</span>
          </button>

          {SKILL_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                  isSelected
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white font-black border border-slate-600 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{branch.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Skill Tree Nodes Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Branch Section Headers if filtered by branch */}
          {selectedBranch !== 'all' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black text-white">
                  {SKILL_BRANCHES.find((b) => b.id === selectedBranch)?.vietnameseTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-bold border border-slate-700">
                  {SKILL_BRANCHES.find((b) => b.id === selectedBranch)?.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {SKILL_BRANCHES.find((b) => b.id === selectedBranch)?.description}
              </p>
            </div>
          )}

          {/* Skill Tree Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredNodes.map((node) => {
              const currentLevel = skillTreeState[node.id] || 0;
              const isMaxed = currentLevel >= node.maxLevel;
              const nextCost = !isMaxed ? node.costs[currentLevel] : 0;
              const canAfford = !isMaxed && dragonCrystals >= nextCost;

              // Check prerequisites
              const prereqsMet = node.prerequisites.every(
                (preId) => (skillTreeState[preId] || 0) > 0
              );
              const prereqNode = node.prerequisites.length > 0
                ? PET_SKILL_NODES.find((n) => n.id === node.prerequisites[0])
                : null;

              const isLocked = !prereqsMet && currentLevel === 0;

              // Branch styling
              const branchConfig = SKILL_BRANCHES.find((b) => b.id === node.branch);
              const borderStyle = isMaxed
                ? 'border-amber-500/70 shadow-amber-950/30'
                : currentLevel > 0
                ? 'border-purple-500/60 shadow-purple-950/20'
                : isLocked
                ? 'border-slate-800/80 opacity-60'
                : 'border-slate-700/80 hover:border-slate-600';

              return (
                <div
                  key={node.id}
                  id={`skill-node-${node.id}`}
                  className={`p-4 rounded-2xl bg-slate-950/85 border-2 ${borderStyle} flex flex-col justify-between gap-3 relative transition-all duration-200 hover:scale-[1.01] shadow-lg`}
                >
                  {/* Top: Icon, Level Pips, Tier Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-11 h-11 rounded-2xl bg-slate-900 border ${currentLevel > 0 ? 'border-amber-400/60' : 'border-slate-800'} flex items-center justify-center text-2xl shadow-inner relative`}>
                          {node.icon}
                          {currentLevel > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-black flex items-center justify-center text-slate-950">
                              ✓
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-white">{node.name}</h4>
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 leading-tight">
                            {node.vietnameseTitle}
                          </p>
                        </div>
                      </div>

                      {/* Tier & Level Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isMaxed
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : currentLevel > 0
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isMaxed ? 'MAXED' : `Lv. ${currentLevel}/${node.maxLevel}`}
                        </span>
                        {/* Progress Pips */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: node.maxLevel }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx < currentLevel
                                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                                  : 'bg-slate-800 border border-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Short Effect Banner */}
                    <div className="my-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs font-semibold text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-amber-300/90">{node.shortEffect}</span>
                    </div>

                    {/* Current & Next Level Effect Description */}
                    <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                      {currentLevel > 0 ? (
                        <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300">
                          <strong className="text-emerald-400">Đang kích hoạt (Lv. {currentLevel}):</strong>{' '}
                          {node.descriptions[currentLevel - 1]}
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
                          <strong>Cấp 1:</strong> {node.descriptions[0]}
                        </div>
                      )}

                      {!isMaxed && currentLevel > 0 && (
                        <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
                          <strong className="text-purple-400">Cấp kế tiếp (Lv. {currentLevel + 1}):</strong>{' '}
                          {node.descriptions[currentLevel]}
                        </div>
                      )}
                    </div>

                    {/* Prerequisite warning if locked */}
                    {isLocked && prereqNode && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>Yêu cầu mở khóa trước: <strong>{prereqNode.name}</strong> (Lv. 1+)</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Cost & Upgrade Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    {!isMaxed ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <span>Giá:</span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-200">
                          <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                          <span>{nextCost}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã đạt tối đa</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleUpgrade(node)}
                      disabled={isMaxed || isLocked || !canAfford}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        isMaxed
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : isLocked
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : !canAfford
                          ? 'bg-slate-800 text-purple-400/60 border border-slate-700/60 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 via-amber-500 to-purple-600 hover:from-purple-500 hover:to-amber-400 text-white shadow-lg shadow-purple-950/50 hover:shadow-purple-700/40'
                      }`}
                    >
                      {isMaxed ? (
                        <span>MAX LEVEL</span>
                      ) : isLocked ? (
                        <span>🔒 KHÓA</span>
                      ) : !canAfford ? (
                        <span>Thiếu Tinh Thể</span>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>{currentLevel === 0 ? 'Mở Khóa' : 'Nâng Cấp'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Mọi nội tại (Passives) đều có hiệu lực vĩnh viễn trong mọi màn trộm trứng, làm bài tập tiếng Anh và thi đấu Đấu Trường!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white transition-all cursor-pointer shadow-md"
            >
              Xác Nhận & Trở Lại Sào Huyệt
            </button>
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        {confirmResetOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/70 rounded-3xl p-5 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-400 flex items-center justify-center text-2xl mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Tẩy Điểm Cây Kỹ Năng?</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Hệ thống sẽ hoàn trả <strong>100%</strong> ({totalInvested} 💎) Tinh Thể Rồng về ví của bạn để phân phối lại theo chiến thuật mới.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  onClick={() => {
                    onResetSkills();
                    setConfirmResetOpen(false);
                    playEnchantSound();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white shadow-lg shadow-rose-950/60 cursor-pointer"
                >
                  Đồng Ý Tẩy Điểm (+{totalInvested} 💎)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
