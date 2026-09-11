export type StageType = 'stage1_eye' | 'stage2_grammar' | 'stage3_speaking' | 'stage4_chase';

export type WordStatus = 'green' | 'yellow' | 'red';

export interface WordScore {
  word: string;
  status: WordStatus;
  note?: string;
}

export interface SpeechAnalysisResult {
  grammarCorrect: boolean;
  grammarFeedback: string;
  pronunciationFeedback: string;
  pronunciationTip: string;
  score: number;
  dragonStirs: boolean;
  wordScores: WordScore[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  keySound: string; // e.g. "/f/", "/s/", "/i:/"
  distractors: string[]; // for the Eye Monster laser game
}

export interface GrammarTrapItem {
  id: string;
  instruction: string;
  sentencePrompt: string; // Sentence with blank or scrambled
  options: string[];
  correctAnswer: string;
  grammarRuleExplaining: string;
  scrambledWords?: string[];
}

export interface SpeakingCipher {
  id: string;
  title: string;
  targetPhrase: string;
  phonetic: string;
  meaningVi: string;
  targetSounds: string[]; // e.g. ["/f/", "/s/", "/t/"]
  expectedGrammarRule: string;
  dragonGatekeeperPrompt: {
    question: string;
    suggestedPattern: string;
    sampleAnswers: string[];
  };
}

export interface ReviewQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  unitOrigin: string; // e.g. "Unit 1", "Unit 2", "Unit 3", "Tri-Unit Review"
}

export type EggTierType = 'common' | 'silver' | 'golden' | 'king' | 'titan' | 'deity' | 'god' | 'king_of_god' | 'secret';

export interface UnitData {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  gradeLevel: string;
  eggName: string;
  eggType: EggTierType;
  eggImage: string;
  description: string;
  themeColor: string;
  vocabulary: VocabularyItem[];
  grammarTraps: GrammarTrapItem[];
  speakingCipher: SpeakingCipher;
  isReviewUnit?: boolean;
  reviewQuestions?: ReviewQuestion[]; // for Tri-Unit Review Checkpoint
}

export type CreatureRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythical'
  | 'ultimate'
  | 'eternal'
  | 'cosmic'
  | 'secret'
  | 'king'
  | 'titan'
  | 'deity'
  | 'god'
  | 'king_of_god';

export type CreatureClassification = 'living' | 'extinct' | 'mythical' | 'divine';

export interface CombatSkill {
  name: string;
  type: 'normal' | 'elemental' | 'ultimate';
  damageMultiplier: number;
  rageCost?: number;
  description: string;
  element: string;
}

export interface PetCompanion {
  id: string;
  name: string;
  title: string;
  rarity: CreatureRarity;
  classification: CreatureClassification; // living, extinct, mythical, divine
  element: 'fire' | 'frost' | 'thunder' | 'shadow' | 'gold' | 'nature' | 'wind' | 'cosmic' | 'void' | 'divine';
  buffDescription: string;
  hatchedAt: string;
  description: string;
  avatarIcon: string;
  tierRank: number; // 1 to 15 (10 = Secret, 11 = King, 12 = Titan, 13 = Deity, 14 = God, 15 = King of God)
  habitat?: string;
  dietOrPower?: string;
  enchantmentLevel?: number; // 0 to 5 stars
  skills?: CombatSkill[];
  isFavorite?: boolean; // Pinned to top of companion list
}

export interface StolenEgg {
  id: string;
  unitId: string;
  unitTitle: string;
  eggType: EggTierType;
  obtainedScore: number;
  stolenAt: string;
  isHatched: boolean;
  petHatched?: PetCompanion;
}

export interface GameState {
  currentUnitId: string;
  activeStage: StageType;
  alertLevel: number; // 0% to 100%
  stealthSteps: number; // 0 to 10 steps towards the nest pedestal
  totalStepsNeeded: number;
  stealthBoots: number; // inventory items (can be used to drop -10% alert)
  scoreTotal: number;
  scoreMax: number;
  completedUnits: string[];
  unlockedUnits: string[];
  stolenEggs: StolenEgg[];
  hatchedPets: PetCompanion[];
  dragonCrystals: number;
  activeRescueModal: boolean;
  missionFinished: boolean;
  lastMissionResult?: {
    unitId: string;
    score: number;
    maxScore: number;
    eggType: EggTierType | null;
    success: boolean;
  };
}

export type SkillBranchId = 'stealth' | 'economy' | 'combat' | 'hatching';

export interface PetSkillNode {
  id: string;
  name: string;
  vietnameseTitle: string;
  branch: SkillBranchId;
  tier: number; // 1, 2, 3, 4
  icon: string;
  maxLevel: number;
  costs: number[]; // Crystal costs for level 1, level 2, etc.
  prerequisites: string[]; // IDs of prerequisite skill nodes
  descriptions: string[]; // Detail effect text for each level
  shortEffect: string;
  statBonusType:
    | 'alert_cooldown'
    | 'mistake_mitigation'
    | 'enhanced_boots'
    | 'phantom_veil'
    | 'crystal_multiplier'
    | 'scholar_bounty'
    | 'arena_plunder'
    | 'hatch_rebate'
    | 'pet_hp_bonus'
    | 'rage_and_damage'
    | 'divine_shield';
}

export type SkillTreeState = Record<string, number>; // { [skillId]: currentLevel }
