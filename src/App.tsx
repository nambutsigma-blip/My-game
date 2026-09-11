/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Sparkles, Volume2, Eye, Zap, Mic, Flame, Award, Footprints, RotateCcw, Egg, ArrowRight, HelpCircle } from 'lucide-react';
import { StageType, UnitData, StolenEgg, PetCompanion, GameState, SkillTreeState } from './types';
import { UNITS_DATA } from './data/unitsData';
import { getEnchantmentConfig } from './data/creaturesData';
import { PET_SKILL_NODES, getPassiveBonuses, calculateTotalSpentCrystals } from './data/skillTreeData';
import { Navbar } from './components/Navbar';
import { AlertGauge } from './components/AlertGauge';
import { EmergencyRescueModal } from './components/EmergencyRescueModal';
import { Stage1EyeMonster } from './components/Stage1EyeMonster';
import { Stage2GrammarTrap } from './components/Stage2GrammarTrap';
import { Stage3VoiceCode } from './components/Stage3VoiceCode';
import { Stage4DragonChase } from './components/Stage4DragonChase';
import { HatcheryModal } from './components/HatcheryModal';
import { PetArenaModal } from './components/PetArenaModal';
import { PetSkillTreeModal } from './components/PetSkillTreeModal';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { RulesModal } from './components/RulesModal';
import { StudySystemModal } from './components/StudySystemModal';
import { OnlineMultiplayerModal } from './components/OnlineMultiplayerModal';
import { playAlarmSiren, playDragonGrowl, playBootsBonus } from './utils/soundEffects';

export default function App() {
  const [currentUnitId, setCurrentUnitId] = useState<string>('unit-1');
  const [activeStage, setActiveStage] = useState<StageType>('stage1_eye');
  const [alertLevel, setAlertLevel] = useState<number>(0);
  const [stealthSteps, setStealthSteps] = useState<number>(0);
  const totalStepsNeeded = 10;
  const [stealthBoots, setStealthBoots] = useState<number>(1); // starts with 1 pair of boots

  const [unlockedUnits, setUnlockedUnits] = useState<string[]>(['unit-1', 'unit-2']);
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [stolenEggs, setStolenEggs] = useState<StolenEgg[]>([]);
  const [hatchedPets, setHatchedPets] = useState<PetCompanion[]>([]);
  const [dragonCrystals, setDragonCrystals] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('egg_thief_crystals');
      const val = saved ? parseInt(saved, 10) : 450;
      return Number.isNaN(val) ? 450 : val;
    } catch {
      return 450;
    }
  });

  // Skill Tree State & Persistence
  const [skillTreeState, setSkillTreeState] = useState<SkillTreeState>(() => {
    try {
      const saved = localStorage.getItem('egg_thief_skill_tree');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Calculate active passive modifiers
  const passiveBonuses = useMemo(() => getPassiveBonuses(skillTreeState), [skillTreeState]);

  // Sync crystals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('egg_thief_crystals', dragonCrystals.toString());
    } catch {
      // ignore storage errors
    }
  }, [dragonCrystals]);

  // Sync skill tree to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('egg_thief_skill_tree', JSON.stringify(skillTreeState));
    } catch {
      // ignore storage errors
    }
  }, [skillTreeState]);

  // Mission scoring (out of 10 points: Stage 1 = 4 pts, Stage 2 = 3 pts, Stage 3 = 3 pts)
  const [stage1Score, setStage1Score] = useState(0);
  const [stage2Score, setStage2Score] = useState(0);
  const [stage3Score, setStage3Score] = useState(0);

  // Modals
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isHatcheryOpen, setIsHatcheryOpen] = useState(false);
  const [isArenaOpen, setIsArenaOpen] = useState(false);
  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isOnlineOpen, setIsOnlineOpen] = useState(false);
  const [isMissionCompleteOpen, setIsMissionCompleteOpen] = useState(false);

  // Dragon Chase Special Review Mode
  const [isChaseModeActive, setIsChaseModeActive] = useState(false);

  const currentUnit = UNITS_DATA.find((u) => u.id === currentUnitId) || UNITS_DATA[0];

  // Natural Alert Cooldown passive (Dragon Repose)
  useEffect(() => {
    if (isChaseModeActive || alertLevel <= 0 || passiveBonuses.alertCooldownSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setAlertLevel((prev) => Math.max(0, prev - passiveBonuses.alertCooldownAmount));
    }, passiveBonuses.alertCooldownSeconds * 1000);

    return () => clearInterval(interval);
  }, [isChaseModeActive, alertLevel, passiveBonuses.alertCooldownSeconds, passiveBonuses.alertCooldownAmount]);

  // Check alert level threshold
  useEffect(() => {
    if (alertLevel >= 100 && !isRescueOpen) {
      playAlarmSiren();
      playDragonGrowl();
      setIsRescueOpen(true);
    }
  }, [alertLevel, isRescueOpen]);

  // Handle wrong answer -> alert penalty modified by Silent Infiltration & Phantom Veil
  const handleWrongAnswer = () => {
    // Phantom Veil: chance to evade alert increase completely
    if (passiveBonuses.phantomVeilChance > 0 && Math.random() < passiveBonuses.phantomVeilChance) {
      return;
    }
    const penalty = passiveBonuses.mistakePenalty;
    setAlertLevel((prev) => Math.min(100, prev + penalty));
  };

  // Handle correct answer in Stage 1
  const handleStage1Correct = () => {
    setStealthSteps((prev) => Math.min(totalStepsNeeded, prev + 1));
    setStage1Score((prev) => prev + 1);
  };

  // Handle Stage 1 complete -> proceed to Stage 2
  const handleStage1Complete = () => {
    setActiveStage('stage2_grammar');
  };

  // Handle Stage 2 correct
  const handleStage2Correct = (awardedBoots: boolean) => {
    setStealthSteps((prev) => Math.min(totalStepsNeeded, prev + 1));
    setStage2Score((prev) => prev + 1);
    if (awardedBoots) {
      setStealthBoots((prev) => prev + 1);
      // Immediately cool down alert by -10% as well
      setAlertLevel((prev) => Math.max(0, prev - 10));
    }
  };

  // Handle Stage 2 complete -> proceed to Stage 3
  const handleStage2Complete = () => {
    setActiveStage('stage3_speaking');
  };

  // Handle Stage 3 correct
  const handleStage3Correct = () => {
    setStealthSteps((prev) => Math.min(totalStepsNeeded, prev + 1));
    setStage3Score((prev) => Math.min(3, prev + 1));
  };

  // Handle Stage 3 Egg Stolen - Strictly prevents infinite duplicate eggs
  const handleEggStolenSuccess = (voiceScore: number) => {
    const finalScore = Math.min(10, Math.max(0, stage1Score + stage2Score + 3));
    const is10 = finalScore === 10;
    const isUnlocked = finalScore >= 8;

    if (isUnlocked) {
      let eggType: 'golden' | 'silver' | 'common' = 'common';
      if (currentUnit.id === 'unit-1') {
        eggType = is10 ? 'silver' : 'common';
      } else if (currentUnit.id === 'unit-2') {
        eggType = is10 ? (Math.random() < 0.15 ? 'golden' : 'silver') : 'common';
      } else {
        eggType = is10 ? 'golden' : 'silver';
      }

      setStolenEggs((prev) => {
        const existingIdx = prev.findIndex((e) => e.unitId === currentUnit.id);
        if (existingIdx !== -1) {
          // If already earned egg for this unit, upgrade if score improved, never duplicate
          const existing = prev[existingIdx];
          if (finalScore > existing.obtainedScore) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...existing,
              obtainedScore: finalScore,
              eggType: is10 ? 'golden' : existing.eggType,
            };
            return updated;
          }
          return prev;
        }

        const newEgg: StolenEgg = {
          id: `egg-${currentUnit.id}`,
          unitId: currentUnit.id,
          unitTitle: currentUnit.title,
          eggType,
          obtainedScore: finalScore,
          stolenAt: new Date().toLocaleTimeString('en-US'),
          isHatched: false,
        };
        return [newEgg, ...prev];
      });

      setCompletedUnits((prev) => (prev.includes(currentUnit.id) ? prev : [...prev, currentUnit.id]));

      // Award Dragon Crystals for academic accomplishment with passives
      const baseEarned = is10 ? 150 : 75;
      const multipliedEarned = Math.round(baseEarned * (1 + (passiveBonuses?.crystalMultiplier || 0)));
      const totalEarned = multipliedEarned + (is10 ? (passiveBonuses?.scholarBonus || 0) : 0);
      setDragonCrystals((prev) => (Number.isNaN(prev) ? 450 : prev + totalEarned));

      // Unlock next unit if available
      const nextIdx = UNITS_DATA.findIndex((u) => u.id === currentUnit.id) + 1;
      if (nextIdx < UNITS_DATA.length) {
        const nextId = UNITS_DATA[nextIdx].id;
        setUnlockedUnits((prev) => (prev.includes(nextId) ? prev : [...prev, nextId]));
      }
    }

    setIsMissionCompleteOpen(true);
  };

  // Use stealth boots from inventory
  const handleUseBoots = () => {
    if (stealthBoots > 0 && alertLevel > 0) {
      setStealthBoots((prev) => prev - 1);
      setAlertLevel((prev) => Math.max(0, prev - passiveBonuses.bootsAlertReduction));
    }
  };

  // Rescue Success handler
  const handleRescueSuccess = () => {
    setIsRescueOpen(false);
    setAlertLevel(50); // cooled down to 50%
  };

  // Rescue Fail handler
  const handleRescueFail = () => {
    setIsRescueOpen(false);
    setAlertLevel(75);
  };

  // Select a unit to start fresh mission
  const handleSelectUnit = (unitId: string) => {
    setCurrentUnitId(unitId);
    setActiveStage('stage1_eye');
    setAlertLevel(0);
    setStealthSteps(0);
    setStealthBoots(passiveBonuses.startingBootsCount);
    setStage1Score(0);
    setStage2Score(0);
    setStage3Score(0);
    setIsChaseModeActive(false);
    setIsMissionCompleteOpen(false);
  };

  // Restart current mission
  const handleRetryMission = () => {
    handleSelectUnit(currentUnitId);
  };

  // Upgrade a pet skill in the skill tree
  const handleUpgradeSkill = (skillId: string): boolean => {
    const node = PET_SKILL_NODES.find((n) => n.id === skillId);
    if (!node) return false;

    const currentLevel = skillTreeState[skillId] || 0;
    if (currentLevel >= node.maxLevel) return false;

    const cost = node.costs[currentLevel];
    if (dragonCrystals < cost) return false;

    // Verify prerequisites
    const prereqsMet = node.prerequisites.every((preId) => (skillTreeState[preId] || 0) > 0);
    if (!prereqsMet) return false;

    setDragonCrystals((prev) => Math.max(0, prev - cost));
    setSkillTreeState((prev) => ({
      ...prev,
      [skillId]: (prev[skillId] || 0) + 1,
    }));
    return true;
  };

  // Reset skill tree with 100% refund
  const handleResetSkills = () => {
    const refund = calculateTotalSpentCrystals(skillTreeState);
    setDragonCrystals((prev) => prev + refund);
    setSkillTreeState({});
  };

  // Proceed to next unit
  const handleNextUnit = () => {
    const nextIdx = UNITS_DATA.findIndex((u) => u.id === currentUnitId) + 1;
    if (nextIdx < UNITS_DATA.length) {
      handleSelectUnit(UNITS_DATA[nextIdx].id);
    } else {
      setIsChaseModeActive(true);
      setIsMissionCompleteOpen(false);
    }
  };

  // Egg hatched in Hatchery
  const handleEggHatched = (eggId: string, pet: PetCompanion) => {
    setStolenEggs((prev) =>
      prev.map((e) => (e.id === eggId ? { ...e, isHatched: true, petHatched: pet } : e))
    );
    setHatchedPets((prev) => [...prev, pet]);
  };

  // Enchant a pet companion with Dragon Crystals
  const handleEnchantPet = (petId: string): boolean => {
    const targetPet = hatchedPets.find((p) => p.id === petId);
    if (!targetPet) return false;
    const currentLvl = targetPet.enchantmentLevel || 0;
    if (currentLvl >= 5) return false;

    const nextTierConfig = getEnchantmentConfig(currentLvl + 1);
    if (!nextTierConfig || dragonCrystals < nextTierConfig.crystalCost) {
      return false;
    }

    setDragonCrystals((prev) => Math.max(0, prev - nextTierConfig.crystalCost));
    setHatchedPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, enchantmentLevel: currentLvl + 1 } : p))
    );
    return true;
  };

  const currentTotalScore = Math.min(10, stage1Score + stage2Score + stage3Score);
  const activePerksCount = (Object.values(skillTreeState) as number[]).reduce((acc, lvl) => acc + (lvl || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        units={UNITS_DATA}
        currentUnitId={currentUnitId}
        onSelectUnit={handleSelectUnit}
        unlockedUnits={unlockedUnits}
        stolenEggs={stolenEggs}
        stealthBoots={stealthBoots}
        onOpenHatchery={() => setIsHatcheryOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenArena={() => setIsArenaOpen(true)}
        onOpenSkillTree={() => setIsSkillTreeOpen(true)}
        onOpenStudy={() => setIsStudyOpen(true)}
        onOpenOnline={() => setIsOnlineOpen(true)}
        activePerksCount={activePerksCount}
        isChaseModeActive={isChaseModeActive}
        onStartChaseMode={() => setIsChaseModeActive(true)}
        dragonCrystals={dragonCrystals}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Mission Status Bar (Only in Unit Missions) */}
        {!isChaseModeActive && (
          <div className="space-y-4">
            {/* Alert Level Gauge & Stealth Progress */}
            <AlertGauge
              alertLevel={alertLevel}
              stealthSteps={stealthSteps}
              totalStepsNeeded={totalStepsNeeded}
              stealthBoots={stealthBoots}
              onUseBoots={handleUseBoots}
              eggName={currentUnit.eggName}
              activePassives={passiveBonuses}
              bootsReductionAmount={passiveBonuses.bootsAlertReduction}
            />

            {/* Stages Stepper */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
              <button
                id="stage-tab-1"
                onClick={() => setActiveStage('stage1_eye')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeStage === 'stage1_eye'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stage 1:</span>
                <span>The All-Seeing Eye</span>
              </button>

              <button
                id="stage-tab-2"
                onClick={() => setActiveStage('stage2_grammar')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeStage === 'stage2_grammar'
                    ? 'bg-indigo-500 text-white shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stage 2:</span>
                <span>Grammar Trap</span>
              </button>

              <button
                id="stage-tab-3"
                onClick={() => setActiveStage('stage3_speaking')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeStage === 'stage3_speaking'
                    ? 'bg-rose-600 text-white shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stage 3:</span>
                <span>Vocal Cipher</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Stage View */}
        {isChaseModeActive ? (
          <Stage4DragonChase
            onEscapeSuccess={(score, total) => {
              setStolenEggs((prev) => {
                if (prev.some((e) => e.unitId === 'review-units-1-3')) {
                  return prev;
                }
                const newEgg: StolenEgg = {
                  id: 'egg-chase-review-units-1-3',
                  unitId: 'review-units-1-3',
                  unitTitle: 'Dragon Chase: Review Units 1-3',
                  eggType: 'golden',
                  obtainedScore: 10,
                  stolenAt: new Date().toLocaleTimeString('en-US'),
                  isHatched: false,
                };
                return [newEgg, ...prev];
              });
            }}
            onReturnToNest={() => {
              setIsChaseModeActive(false);
              handleSelectUnit('unit-1');
            }}
          />
        ) : activeStage === 'stage1_eye' ? (
          <Stage1EyeMonster
            vocabularyList={currentUnit.vocabulary}
            unitTitle={currentUnit.title}
            onCorrectWord={handleStage1Correct}
            onWrongWord={handleWrongAnswer}
            onCompleteStage={handleStage1Complete}
          />
        ) : activeStage === 'stage2_grammar' ? (
          <Stage2GrammarTrap
            grammarTraps={currentUnit.grammarTraps}
            unitTitle={currentUnit.title}
            onCorrectAnswer={handleStage2Correct}
            onWrongAnswer={handleWrongAnswer}
            onCompleteStage={handleStage2Complete}
          />
        ) : (
          <Stage3VoiceCode
            speakingCipher={currentUnit.speakingCipher}
            unitTitle={currentUnit.title}
            onCorrectSpeaking={handleStage3Correct}
            onWrongSpeaking={handleWrongAnswer}
            onEggStolenSuccess={handleEggStolenSuccess}
          />
        )}
      </main>

      {/* Footer info */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Egg Thief — Grade 8 English High School Entrance Exam Mastery</span>
          <span>Speech Recognition & AI Evaluation Engine</span>
        </div>
      </footer>

      {/* Modals */}
      <EmergencyRescueModal
        isOpen={isRescueOpen}
        onRescueSuccess={handleRescueSuccess}
        onRescueFail={handleRescueFail}
      />

      <HatcheryModal
        isOpen={isHatcheryOpen}
        onClose={() => setIsHatcheryOpen(false)}
        stolenEggs={stolenEggs}
        hatchedPets={hatchedPets}
        onEggHatched={handleEggHatched}
        onOpenArena={() => {
          setIsHatcheryOpen(false);
          setIsArenaOpen(true);
        }}
        onOpenSkillTree={() => {
          setIsHatcheryOpen(false);
          setIsSkillTreeOpen(true);
        }}
        dragonCrystals={dragonCrystals}
        onEnchantPet={handleEnchantPet}
        hatchBonusRate={passiveBonuses.hatchBonusRate}
        hatchRebate={passiveBonuses.incubatorRebate}
        onAddDragonCrystals={(amt) => setDragonCrystals((prev) => prev + amt)}
      />

      <PetArenaModal
        isOpen={isArenaOpen}
        onClose={() => setIsArenaOpen(false)}
        hatchedPets={hatchedPets}
        onOpenHatchery={() => {
          setIsArenaOpen(false);
          setIsHatcheryOpen(true);
        }}
        onOpenSkillTree={() => {
          setIsArenaOpen(false);
          setIsSkillTreeOpen(true);
        }}
        passiveBonuses={passiveBonuses}
        onAddStolenEgg={(egg) => {
          setStolenEggs((prev) => {
            if (prev.some((e) => e.unitId === egg.unitId)) {
              return prev;
            }
            return [egg, ...prev];
          });
        }}
        dragonCrystals={dragonCrystals}
        onAddDragonCrystals={(amt) => setDragonCrystals((prev) => prev + amt)}
        onEnchantPet={handleEnchantPet}
      />

      <PetSkillTreeModal
        isOpen={isSkillTreeOpen}
        onClose={() => setIsSkillTreeOpen(false)}
        dragonCrystals={dragonCrystals}
        skillTreeState={skillTreeState}
        onUpgradeSkill={handleUpgradeSkill}
        onResetSkills={handleResetSkills}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <StudySystemModal
        isOpen={isStudyOpen}
        onClose={() => setIsStudyOpen(false)}
        currentUnit={currentUnit}
        allUnits={UNITS_DATA}
      />

      <OnlineMultiplayerModal
        isOpen={isOnlineOpen}
        onClose={() => setIsOnlineOpen(false)}
        dragonCrystals={dragonCrystals}
        setDragonCrystals={setDragonCrystals}
        hatchedPets={hatchedPets}
        setHatchedPets={setHatchedPets}
        stolenEggs={stolenEggs}
        skillTreeState={skillTreeState}
        setSkillTreeState={setSkillTreeState}
      />

      <MissionCompleteModal
        isOpen={isMissionCompleteOpen}
        score={currentTotalScore}
        maxScore={10}
        unitTitle={currentUnit.title}
        eggName={currentUnit.eggName}
        onOpenHatchery={() => {
          setIsMissionCompleteOpen(false);
          setIsHatcheryOpen(true);
        }}
        onNextUnit={handleNextUnit}
        onRetry={handleRetryMission}
      />
    </div>
  );
}
