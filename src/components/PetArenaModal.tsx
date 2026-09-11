import React, { useState, useMemo } from 'react';
import {
  X,
  Swords,
  Shield,
  Heart,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Trophy,
  AlertCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PetCompanion, StolenEgg } from '../types';
import {
  ARENA_NPCS,
  ARENA_QUESTIONS,
  ArenaNPC,
  ArenaQuestion,
  calculatePetStats,
  calculateElementMultiplier,
  getElementInfo,
} from '../data/arenaData';
import { getRarityConfig, getClassificationConfig, getEnchantmentConfig } from '../data/creaturesData';
import { playSuccessChime, playLaser, playAlertUp, playMythicFanfare, playEnchantSound, playBootsBonus } from '../utils/soundEffects';
import { ElementMatrixModal } from './ElementMatrixModal';

interface PetArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hatchedPets: PetCompanion[];
  onOpenHatchery: () => void;
  onOpenSkillTree?: () => void;
  onAddStolenEgg: (egg: StolenEgg) => void;
  dragonCrystals: number;
  onAddDragonCrystals: (amount: number) => void;
  onEnchantPet: (petId: string) => boolean;
  passiveBonuses?: {
    petHpMultiplier: number;
    petSkillDamageMultiplier: number;
    startingRageBonus: number;
    divineShieldHits: number;
    arenaCrystalMultiplier: number;
  };
}

// Fallback starter pet if student has not hatched any yet
const STARTER_PET: PetCompanion = {
  id: 'starter-wolf',
  name: 'Apprentice Gray Wolf',
  title: 'Novice Infiltration Companion',
  rarity: 'common',
  classification: 'living',
  element: 'wind',
  tierRank: 1,
  avatarIcon: '🐺',
  buffDescription: 'Nimble pounce helps explorers learn the ropes in the Arena.',
  hatchedAt: 'Verdant Forest Outpost',
  description: 'A loyal young wolf eager to assist explorers in their quest through the dragon sanctuary.',
  enchantmentLevel: 0,
  skills: [
    { name: 'Swift Pounce', type: 'normal', damageMultiplier: 1.0, description: 'Rapid physical strike', element: 'wind' },
    { name: 'Gale Fang', type: 'elemental', damageMultiplier: 1.5, rageCost: 20, description: 'Bites with slicing wind', element: 'wind' },
    { name: 'Alpha Moon Howl', type: 'ultimate', damageMultiplier: 2.2, rageCost: 50, description: 'Ancestral spirit burst', element: 'wind' },
  ],
};

export const PetArenaModal: React.FC<PetArenaModalProps> = ({
  isOpen,
  onClose,
  hatchedPets,
  onOpenHatchery,
  onOpenSkillTree,
  onAddStolenEgg,
  dragonCrystals,
  onAddDragonCrystals,
  onEnchantPet,
  passiveBonuses,
}) => {
  const availablePets = useMemo(() => {
    return hatchedPets.length > 0 ? hatchedPets : [STARTER_PET];
  }, [hatchedPets]);

  const [selectedPetId, setSelectedPetId] = useState<string>(availablePets[0].id);
  const [selectedNPC, setSelectedNPC] = useState<ArenaNPC>(ARENA_NPCS[0]);
  const [battleState, setBattleState] = useState<'lobby' | 'fighting' | 'victory' | 'defeat'>('lobby');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isElementMatrixOpen, setIsElementMatrixOpen] = useState(false);

  const returnToLobby = () => {
    setIsTransitioning(true);
    setBattleState('lobby');
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  const [arenaWins, setArenaWins] = useState(0);
  // Track defeated NPC IDs to prevent infinite egg exploits
  const [defeatedBossIds, setDefeatedBossIds] = useState<string[]>([]);
  const [justWonEgg, setJustWonEgg] = useState<boolean>(false);

  // Combat State
  const activePet = useMemo(() => {
    return availablePets.find((p) => p.id === selectedPetId) || availablePets[0];
  }, [availablePets, selectedPetId]);

  const playerBaseStats = useMemo(() => calculatePetStats(activePet), [activePet]);

  // Apply Pet HP Multiplier from Skill Tree (Primal Vigor)
  const effectiveMaxHp = useMemo(() => {
    const hpBoost = passiveBonuses?.petHpMultiplier || 0;
    return Math.round(playerBaseStats.maxHp * (1 + hpBoost));
  }, [playerBaseStats.maxHp, passiveBonuses?.petHpMultiplier]);

  const [playerHp, setPlayerHp] = useState(effectiveMaxHp);
  const [playerRage, setPlayerRage] = useState(20);
  const [divineShieldCharges, setDivineShieldCharges] = useState(0);
  const [npcHp, setNpcHp] = useState(selectedNPC.petHp);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Question Prompt State during player turn
  const [activeQuestion, setActiveQuestion] = useState<ArenaQuestion | null>(null);
  const [activeActionType, setActiveActionType] = useState<'normal' | 'elemental' | 'ultimate' | null>(null);
  const [qAnswered, setQAnswered] = useState(false);
  const [qCorrect, setQCorrect] = useState(false);

  // Companion skills
  const normalSkill = activePet.skills?.[0] || {
    name: 'Swift Strike',
    type: 'normal',
    damageMultiplier: 1.0,
    description: 'Swift physical strike',
    element: activePet.element || 'wind',
  };
  const elementalSkill = activePet.skills?.[1] || {
    name: 'Elemental Burst',
    type: 'elemental',
    damageMultiplier: 1.6,
    rageCost: 20,
    description: 'Elemental discharge',
    element: activePet.element || 'fire',
  };
  const ultimateSkill = activePet.skills?.[2] || {
    name: 'Primeval Beast Ultimate',
    type: 'ultimate',
    damageMultiplier: 2.5,
    rageCost: 50,
    description: 'Supreme finisher move',
    element: activePet.element || 'cosmic',
  };

  // Sync HP when new combat begins
  const startBattle = (npc: ArenaNPC) => {
    if (isTransitioning) return;
    setSelectedNPC(npc);
    const pStats = calculatePetStats(activePet);
    const startMaxHp = Math.round(pStats.maxHp * (1 + (passiveBonuses?.petHpMultiplier || 0)));
    const startRage = 25 + (passiveBonuses?.startingRageBonus || 0);
    const shields = passiveBonuses?.divineShieldHits || 0;

    setPlayerHp(startMaxHp);
    setPlayerRage(startRage);
    setDivineShieldCharges(shields);
    setNpcHp(npc.petHp);
    setIsPlayerTurn(true);

    const initialLogs = [
      `⚔️ Battle begins! ${npc.name} (${npc.title}) enters the arena with ${npc.petName}!`,
      ...(shields > 0 ? [`🛡️ TITAN AEGIS: ${shields} Divine Shield charges activated!`] : []),
      ...(startRage > 25 ? [`⚡ ELEMENTAL SURGE: Pet starts battle with ${startRage} Rage!`] : []),
      `💬 ${npc.name}: "${npc.introDialog}"`,
    ];
    setBattleLogs(initialLogs);
    setBattleState('fighting');
  };

  // Select Player Combat Action (Triggers Academic Question)
  const handleSelectCombatAction = (type: 'normal' | 'elemental' | 'ultimate') => {
    if (!isPlayerTurn || activeQuestion) return;

    if (type === 'ultimate' && playerRage < 50) {
      return;
    }

    setActiveActionType(type);
    setQAnswered(false);
    setQCorrect(false);

    // Pick appropriate question based on attack type
    let qPool = ARENA_QUESTIONS;
    if (type === 'normal') {
      qPool = ARENA_QUESTIONS.filter((q) => q.type === 'vocab' || q.type === 'speed');
    } else if (type === 'elemental') {
      qPool = ARENA_QUESTIONS.filter((q) => q.type === 'grammar');
    }

    const randomQ = qPool[Math.floor(Math.random() * qPool.length)] || ARENA_QUESTIONS[0];
    setActiveQuestion(randomQ);
  };

  // Submit Answer to Battle Question
  const handleAnswerQuestion = (selectedIndex: number) => {
    if (!activeQuestion || qAnswered) return;

    setQAnswered(true);
    const isRight = selectedIndex === activeQuestion.correctIndex;
    setQCorrect(isRight);

    if (isRight) {
      playSuccessChime();
    } else {
      playLaser();
    }

    setTimeout(() => {
      executePlayerAttack(isRight);
      setActiveQuestion(null);
      setActiveActionType(null);
    }, 1200);
  };

  // Execute Player Damage with Companion Skill
  const executePlayerAttack = (isRight: boolean) => {
    let skill = normalSkill;
    let rageGain = 15;

    if (activeActionType === 'elemental') {
      skill = elementalSkill;
      rageGain = 20;
    } else if (activeActionType === 'ultimate') {
      skill = ultimateSkill;
      rageGain = -50;
      playMythicFanfare();
    }

    let multiplier = skill.damageMultiplier;
    // Apply Elemental Surge multiplier from Skill Tree
    if ((activeActionType === 'elemental' || activeActionType === 'ultimate') && passiveBonuses?.petSkillDamageMultiplier) {
      multiplier *= (1 + passiveBonuses.petSkillDamageMultiplier);
    }

    // Elemental Counter-Advantage multiplier
    const elemCheck = calculateElementMultiplier(skill.element || activePet.element, selectedNPC.petElement);
    multiplier *= elemCheck.multiplier;

    if (!isRight) {
      multiplier *= 0.4; // penalty for incorrect answer
    }

    const rawDmg = Math.round((playerBaseStats.atk * multiplier) - (selectedNPC.petDef * 0.4));
    const damage = Math.max(14, rawDmg);

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    const nextNpcHp = Math.max(0, npcHp - damage);
    setNpcHp(nextNpcHp);
    setPlayerRage((prev) => Math.min(100, Math.max(0, prev + rageGain)));

    const hitDesc = isRight ? '🔥 CRITICAL HIT!' : '⚠️ Incorrect answer (Reduced Damage)';
    setBattleLogs((prev) => [
      `⚡ ${activePet.name} unleashed [${skill.name}] (${skill.element.toUpperCase()}) dealing ${damage} DMG to ${selectedNPC.petName}! [${elemCheck.label}] (${hitDesc})`,
      ...prev.slice(0, 5),
    ]);

    // Check if NPC Defeated
    if (nextNpcHp <= 0) {
      setTimeout(() => {
        handleBattleVictory();
      }, 700);
      return;
    }

    // Switch to NPC turn
    setIsPlayerTurn(false);
    setTimeout(() => {
      executeNpcTurn(nextNpcHp);
    }, 1300);
  };

  // Use Healing Salve
  const handleUseHeal = () => {
    if (!isPlayerTurn) return;
    const healAmount = Math.round(effectiveMaxHp * 0.35);
    setPlayerHp((prev) => Math.min(effectiveMaxHp, prev + healAmount));
    playSuccessChime();

    setBattleLogs((prev) => [
      `🧪 You used Healing Salve, restoring +${healAmount} HP to ${activePet.name}!`,
      ...prev.slice(0, 5),
    ]);

    setIsPlayerTurn(false);
    setTimeout(() => {
      executeNpcTurn(npcHp);
    }, 1200);
  };

  // NPC Action
  const executeNpcTurn = (currentNpcHp: number) => {
    if (currentNpcHp <= 0) return;

    // Check Titan Aegis Divine Shield
    if (divineShieldCharges > 0) {
      setDivineShieldCharges((prev) => prev - 1);
      playBootsBonus();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      setBattleLogs((prev) => [
        `🛡️ TITAN AEGIS: Divine Shield completely absorbed ${selectedNPC.name}'s ${selectedNPC.petName} attack! (0 DMG taken, ${divineShieldCharges - 1} shields remaining)`,
        ...prev.slice(0, 5),
      ]);
      setIsPlayerTurn(true);
      return;
    }

    playAlertUp();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    const npcElemCheck = calculateElementMultiplier(selectedNPC.petElement, activePet.element);
    const npcDmgRaw = Math.round((selectedNPC.petAtk * npcElemCheck.multiplier) - (playerBaseStats.def * 0.4));
    const npcDmg = Math.max(12, npcDmgRaw);

    const nextPlayerHp = Math.max(0, playerHp - npcDmg);
    setPlayerHp(nextPlayerHp);

    setBattleLogs((prev) => [
      `💥 ${selectedNPC.name}'s ${selectedNPC.petName} countered with [${selectedNPC.skillName}] dealing ${npcDmg} DMG! [${npcElemCheck.label}]`,
      ...prev.slice(0, 5),
    ]);

    // Check if Player Defeated
    if (nextPlayerHp <= 0) {
      setTimeout(() => {
        setBattleState('defeat');
      }, 700);
      return;
    }

    setIsPlayerTurn(true);
  };

  // Handle Victory: Rewards Dragon Crystals and rare egg (first victory only)
  const handleBattleVictory = () => {
    setBattleState('victory');
    setArenaWins((prev) => prev + 1);

    // Apply Warlord Plunder crystal multiplier
    const crystalMult = 1 + (passiveBonuses?.arenaCrystalMultiplier || 0);
    const totalRewardCrystals = Math.round(selectedNPC.rewardCrystals * crystalMult);

    // Add crystals to global player balance
    onAddDragonCrystals(totalRewardCrystals);

    // Award boss egg ONLY if not already defeated
    const isFirstClear = !defeatedBossIds.includes(selectedNPC.id);
    setJustWonEgg(isFirstClear);
    if (isFirstClear) {
      setDefeatedBossIds((prev) => [...prev, selectedNPC.id]);

      const bossEgg: StolenEgg = {
        id: `egg-arena-${selectedNPC.id}`,
        unitId: `arena-${selectedNPC.id}`,
        unitTitle: `Arena Boss: ${selectedNPC.name}`,
        eggType: selectedNPC.rewardEggType,
        obtainedScore: 10,
        stolenAt: new Date().toLocaleTimeString('en-US'),
        isHatched: false,
      };

      onAddStolenEgg(bossEgg);
    } else {
      // Bonus crystals if already cleared
      onAddDragonCrystals(100);
    }

    playMythicFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  if (!isOpen) return null;

  const currentEnchantLvl = activePet.enchantmentLevel || 0;
  const nextConfig = getEnchantmentConfig(currentEnchantLvl + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-slate-900 border-2 border-rose-500/70 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-rose-950/60">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>Companion Arena</span>
                  <span className="text-rose-400 font-bold hidden md:inline">• Academic Turn-Based Duels</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Answer curriculum questions to command your companion&apos;s moves against {ARENA_NPCS.length} Legendary NPC Arena Masters!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dragon Crystals Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/50 text-xs font-black text-purple-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{dragonCrystals}</span>
              <span className="text-[10px] text-purple-400 font-bold hidden sm:inline">Crystals</span>
            </div>

            {/* Element Matrix Codex Button */}
            <button
              onClick={() => setIsElementMatrixOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-slate-900 hover:from-amber-900 border border-amber-500/50 text-xs font-bold text-amber-200 transition-all cursor-pointer shadow-sm"
              title="View Element Counter-Advantages Matrix"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Hệ Khắc Chế</span>
            </button>

            {/* Quick Skill Tree Shortcut */}
            {onOpenSkillTree && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSkillTree();
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all cursor-pointer shadow-sm"
                title="Open Pet Skill Tree & Passives"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Skill Tree</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Arena"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= VIEW 1: ARENA LOBBY ================= */}
        {battleState === 'lobby' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
            {/* Active Companion Banner & Quick Enchant */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-rose-500/50 flex items-center justify-center text-4xl shrink-0 shadow-lg relative">
                  {activePet.avatarIcon}
                  {currentEnchantLvl > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-purple-600 border border-purple-300 text-[9px] font-black text-white shadow-md">
                      ★{currentEnchantLvl}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase text-rose-400">
                      Active Battle Companion
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      Rank {activePet.tierRank || 1} • {getRarityConfig(activePet.rarity).nameEn}
                    </span>
                    {currentEnchantLvl > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-600 font-bold">
                        ★ {currentEnchantLvl}/5 Stars (+{currentEnchantLvl * 25}% Stats)
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-white">{activePet.name}</h4>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-rose-300 font-bold">❤️ HP: {playerBaseStats.maxHp}</span>
                    <span className="text-amber-300 font-bold">⚔️ ATK: {playerBaseStats.atk}</span>
                    <span className="text-blue-300 font-bold">🛡️ DEF: {playerBaseStats.def}</span>
                  </div>
                </div>
              </div>

              {/* Pet Switcher & Quick Enchant Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {currentEnchantLvl < 5 && nextConfig && (
                  <button
                    onClick={() => {
                      const ok = onEnchantPet(activePet.id);
                      if (ok) {
                        playEnchantSound();
                        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                      }
                    }}
                    disabled={dragonCrystals < nextConfig.crystalCost}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      dragonCrystals >= nextConfig.crystalCost
                        ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white hover:from-purple-500 shadow-md active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                    title={`Enchant to ★${currentEnchantLvl + 1} (${nextConfig.crystalCost} Crystals)`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Enchant ({nextConfig.crystalCost} 💎)</span>
                  </button>
                )}

                {availablePets.length > 1 ? (
                  <select
                    value={selectedPetId}
                    onChange={(e) => setSelectedPetId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 cursor-pointer focus:outline-none focus:border-rose-500"
                  >
                    {availablePets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.avatarIcon} {pet.name} (Rank {pet.tierRank || 1} • ★{pet.enchantmentLevel || 0})
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHatchery();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🥚 Hatch More Companions</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of NPC Challengers */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🏆</span> {ARENA_NPCS.length} Legendary NPC Arena Masters
                </h4>
                <span className="text-xs text-slate-400">Defeat to earn Dragon Crystals & Rare Boss Eggs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ARENA_NPCS.map((npc) => {
                  const alreadyDefeated = defeatedBossIds.includes(npc.id);

                  return (
                    <div
                      key={npc.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                            {npc.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${npc.diffColor}`}>
                                {npc.difficulty}
                              </span>
                              {alreadyDefeated && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  ✓ Cleared
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-sm text-white">{npc.name}</h5>
                            <p className="text-[11px] text-slate-400">{npc.title}</p>
                          </div>
                        </div>

                        {/* NPC Pet preview */}
                        <div className="text-right">
                          <div className="text-2xl">{npc.petAvatar}</div>
                          <span className="text-[10px] text-slate-400 font-semibold block">{npc.petName}</span>
                        </div>
                      </div>

                      {/* Stats & Rewards */}
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                        <div className="text-slate-400 flex items-center gap-2">
                          <span className="text-rose-400 font-medium">HP: {npc.petHp}</span>
                          <span className="text-amber-400 font-medium">ATK: {npc.petAtk}</span>
                          <span className="text-emerald-400 font-bold">+{npc.rewardCrystals} 💎</span>
                        </div>

                        <button
                          onClick={() => !isTransitioning && startBattle(npc)}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            if (!isTransitioning) startBattle(npc);
                          }}
                          disabled={isTransitioning}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1 touch-manipulation"
                        >
                          <span>Challenge</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: ACTIVE COMBAT STAGE ================= */}
        {battleState === 'fighting' && (
          <div className="flex-1 flex flex-col justify-between py-2 overflow-y-auto space-y-3">
            {/* Battle Arena Stage Display */}
            <div className={`relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[260px] transition-transform ${isShaking ? 'scale-102 ring-2 ring-rose-500' : ''}`}>
              {/* Top: Opponent NPC Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                    {selectedNPC.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{selectedNPC.name}</span>
                      <span className="text-[9px] px-1.5 rounded bg-slate-800 text-slate-300 font-semibold">{selectedNPC.petElement}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{selectedNPC.petName}</div>
                  </div>
                </div>

                {/* NPC HP Bar */}
                <div className="w-48 max-w-[50%]">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-400">Boss HP</span>
                    <span className="font-mono font-bold text-rose-400">{npcHp} / {selectedNPC.petHp}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, (npcHp / selectedNPC.petHp) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Center Battle Field: Pet Avatars Facing Off */}
              <div className="flex items-center justify-around py-4">
                {/* Player Pet */}
                <div className="text-center">
                  <div className={`text-6xl sm:text-7xl transition-transform ${isPlayerTurn ? 'scale-110 animate-pulse' : 'scale-95 opacity-90'}`}>
                    {activePet.avatarIcon}
                  </div>
                  <div className="mt-2 text-xs font-black text-amber-300 flex items-center justify-center gap-1">
                    <span>{activePet.name}</span>
                    {currentEnchantLvl > 0 && (
                      <span className="text-[9px] text-purple-300">★{currentEnchantLvl}</span>
                    )}
                  </div>
                </div>

                {/* Versus Badge */}
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-rose-500/70 flex items-center justify-center text-sm font-black text-rose-400 shadow-lg">
                    VS
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                    {isPlayerTurn ? 'Your Turn' : 'Enemy Action...'}
                  </div>
                </div>

                {/* NPC Pet */}
                <div className="text-center">
                  <div className={`text-6xl sm:text-7xl transition-transform ${!isPlayerTurn ? 'scale-110 animate-pulse' : 'scale-95 opacity-90'}`}>
                    {selectedNPC.petAvatar}
                  </div>
                  <div className="mt-2 text-xs font-black text-rose-400">
                    {selectedNPC.petName}
                  </div>
                </div>
              </div>

              {/* Bottom: Player Pet Stats & Rage Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  {/* Player HP */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Player HP</span>
                      <span className="font-mono font-bold text-emerald-400">{playerHp} / {effectiveMaxHp}</span>
                    </div>
                    <div className="w-36 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, (playerHp / effectiveMaxHp) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Player Rage */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">Rage Gauge</span>
                      <span className="font-mono font-bold text-amber-400">{playerRage}%</span>
                    </div>
                    <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${playerRage}%` }}
                      />
                    </div>
                  </div>

                  {/* Divine Shield Badge if active */}
                  {divineShieldCharges > 0 && (
                    <div className="px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/50 text-[10px] font-black text-indigo-300 flex items-center gap-1 animate-pulse">
                      <Shield className="w-3 h-3 text-indigo-400" />
                      <span>{divineShieldCharges} Shield</span>
                    </div>
                  )}
                </div>

                <div className="text-right text-[10px] text-slate-400 hidden sm:block">
                  Perk: <span className="text-amber-300">{activePet.buffDescription}</span>
                </div>
              </div>
            </div>

            {/* Combat Logs Ticker */}
            <div className="my-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 max-h-16 overflow-y-auto text-[11px] font-mono space-y-1">
              {battleLogs.map((log, i) => (
                <div key={i} className="text-slate-300">
                  {log}
                </div>
              ))}
            </div>

            {/* Combat Actions Controls */}
            {isPlayerTurn && !activeQuestion && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleSelectCombatAction('normal')}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleSelectCombatAction('normal');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-400 text-left cursor-pointer transition-all active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white truncate">
                    <span>⚔️</span> {normalSkill.name}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Vocab Quiz ({Math.round(normalSkill.damageMultiplier * 100)}% ATK)
                  </p>
                </button>

                <button
                  onClick={() => handleSelectCombatAction('elemental')}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleSelectCombatAction('elemental');
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-indigo-700/60 hover:border-indigo-400 text-left cursor-pointer transition-all active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-300 truncate">
                    <span>⚡</span> {elementalSkill.name}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Grammar Quiz ({Math.round(elementalSkill.damageMultiplier * 100)}% ATK)
                  </p>
                </button>

                <button
                  onClick={() => handleSelectCombatAction('ultimate')}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    if (playerRage >= 50) handleSelectCombatAction('ultimate');
                  }}
                  disabled={playerRage < 50}
                  className={`p-2.5 rounded-xl border text-left transition-all touch-manipulation ${
                    playerRage >= 50
                      ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/60 border-amber-400 cursor-pointer shadow-md active:scale-95'
                      : 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300 truncate">
                    <span>🔮</span> {ultimateSkill.name}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Requires &ge;50% Rage ({Math.round(ultimateSkill.damageMultiplier * 100)}% ATK)
                  </p>
                </button>

                <button
                  onClick={handleUseHeal}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleUseHeal();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-emerald-700/60 hover:border-emerald-400 text-left cursor-pointer transition-all active:scale-95 touch-manipulation"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                    <span>🧪</span> Healing Salve
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Recover +35% HP</p>
                </button>
              </div>
            )}

            {/* In-battle Question Prompt Popup */}
            {activeQuestion && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border-2 border-amber-400/80 animate-fade-in">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {activeQuestion.typeLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">Answer correctly to trigger powerful companion move!</span>
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-white mb-2">{activeQuestion.question}</h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeQuestion.options.map((opt, idx) => {
                    let optStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-400';
                    if (qAnswered) {
                      if (idx === activeQuestion.correctIndex) {
                        optStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                      } else {
                        optStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuestion(idx)}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          if (!qAnswered) handleAnswerQuestion(idx);
                        }}
                        disabled={qAnswered}
                        className={`p-2.5 rounded-xl border text-xs text-left cursor-pointer transition-all active:scale-95 touch-manipulation ${optStyle}`}
                      >
                        <span className="font-bold text-amber-400 mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 3: VICTORY SCREEN ================= */}
        {battleState === 'victory' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 px-2 text-center overflow-y-auto animate-fade-in">
            <div className="text-6xl mb-3 animate-bounce">🏆🎉</div>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              RESOUNDING VICTORY!
            </span>
            <h3 className="text-2xl font-black text-amber-300 mb-1">
              Defeated {selectedNPC.name}!
            </h3>
            <p className="text-xs text-slate-300 max-w-md italic mb-4">
              &quot;{selectedNPC.loseDialog}&quot;
            </p>

            {/* Rewards Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 max-w-sm w-full mb-5 text-left space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Rewards Claimed:</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">💎 Dragon Crystals:</span>
                <span className="font-bold text-amber-300">+{selectedNPC.rewardCrystals}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">🥚 Arena Boss Egg:</span>
                <span className="font-bold text-emerald-300 uppercase">
                  {justWonEgg
                    ? `🎁 1x ${selectedNPC.rewardEggType.toUpperCase()} EGG`
                    : '+100 Crystals (Egg Already Claimed)'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={returnToLobby}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  returnToLobby();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer active:scale-95 touch-manipulation"
              >
                Return to Lobby
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenHatchery();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  onClose();
                  onOpenHatchery();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 touch-manipulation"
              >
                Go to Hatchery & Bestiary
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: DEFEAT SCREEN ================= */}
        {battleState === 'defeat' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 px-2 text-center overflow-y-auto animate-fade-in">
            <div className="text-6xl mb-3 opacity-80">💥💀</div>
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2">
              TACTICAL DEFEAT
            </span>
            <h3 className="text-2xl font-black text-white mb-1">
              {activePet.name} Was Overwhelmed!
            </h3>
            <p className="text-xs text-slate-400 max-w-md italic mb-4">
              &quot;{selectedNPC.winDialog}&quot;
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm w-full mb-5 text-left text-xs space-y-1">
              <span className="text-amber-400 font-bold block">💡 Scholar&apos;s Advice:</span>
              <p className="text-slate-300">
                Enhance your companion&apos;s stats with Dragon Crystals in the Hatchery Shrine, or answer questions accurately to deal full damage!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => startBattle(selectedNPC)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  startBattle(selectedNPC);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-black text-xs cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 touch-manipulation"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Challenge</span>
              </button>
              <button
                onClick={returnToLobby}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  returnToLobby();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer active:scale-95 touch-manipulation"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        )}
      </div>

      <ElementMatrixModal isOpen={isElementMatrixOpen} onClose={() => setIsElementMatrixOpen(false)} />
    </div>
  );
};
