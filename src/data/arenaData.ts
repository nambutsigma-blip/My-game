import { CreatureRarity, CreatureClassification, EggTierType } from '../types';

export interface ArenaNPC {
  id: string;
  name: string;
  title: string;
  avatar: string;
  difficulty: 'Novice' | 'Intermediate' | 'Veteran' | 'Scholar' | 'King' | 'Titan' | 'Deity' | 'God' | 'King of God';
  diffColor: string;
  petName: string;
  petAvatar: string;
  petElement: string;
  petRarity: CreatureRarity;
  petHp: number;
  petAtk: number;
  petDef: number;
  skillName: string;
  introDialog: string;
  winDialog: string;
  loseDialog: string;
  rewardCrystals: number;
  rewardEggType: EggTierType;
}

export interface ArenaQuestion {
  id: string;
  type: 'vocab' | 'grammar' | 'speed';
  typeLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ARENA_NPCS: ArenaNPC[] = [
  {
    id: 'npc-1',
    name: 'Forest Ranger Leo',
    title: 'Sanctuary Frontier Scout',
    avatar: '🏹🧑‍🌾',
    difficulty: 'Novice',
    diffColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-700',
    petName: 'Timberland Gray Wolf',
    petAvatar: '🐺',
    petElement: 'Wind',
    petRarity: 'common',
    petHp: 130,
    petAtk: 24,
    petDef: 10,
    skillName: 'Swift Wolf Pounce',
    introDialog: 'My companion is the swiftest in this forest. Test your vocabulary skills against me!',
    winDialog: 'Haha, as expected! You need to review more B1 English vocabulary!',
    loseDialog: 'Incredible! Your English vocabulary is pinpoint accurate... I yield!',
    rewardCrystals: 60,
    rewardEggType: 'common',
  },
  {
    id: 'npc-2',
    name: 'Frost Sorceress Freya',
    title: 'Glacial Magic Scholar',
    avatar: '❄️🧙‍♀️',
    difficulty: 'Intermediate',
    diffColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-700',
    petName: 'Aurora Snow Fox',
    petAvatar: '🦊',
    petElement: 'Frost',
    petRarity: 'uncommon',
    petHp: 190,
    petAtk: 36,
    petDef: 16,
    skillName: 'Freezing Blizzard',
    introDialog: 'The Arctic chill freezes all who hesitate over adverb comparisons!',
    winDialog: 'The chill has slowed your reflex! Review your comparative adverbs and try again!',
    loseDialog: 'Your grammar mastery melted right through my glacial shield!',
    rewardCrystals: 120,
    rewardEggType: 'silver',
  },
  {
    id: 'npc-3',
    name: 'Warlord Drake',
    title: 'Commander of the Fang Vanguard',
    avatar: '⚔️🧝‍♂️',
    difficulty: 'Veteran',
    diffColor: 'text-amber-400 bg-amber-950/60 border-amber-700',
    petName: 'Royal Bengal Tiger',
    petAvatar: '🐅',
    petElement: 'Nature',
    petRarity: 'epic',
    petHp: 280,
    petAtk: 52,
    petDef: 24,
    skillName: 'Roaring Tiger Strike',
    introDialog: 'My Bengal tiger commands fierce claws. Have you mastered concession clauses and gerunds?',
    winDialog: 'Battlefield discipline triumphs over careless mistakes! Back to the books!',
    loseDialog: 'Outstanding tactical thinking! Your squad is truly worthy of the legendary dragon eggs!',
    rewardCrystals: 220,
    rewardEggType: 'silver',
  },
  {
    id: 'npc-4',
    name: 'Paleo-Professor Victor',
    title: 'Prehistoric Fossil Archaeologist',
    avatar: '🦴👨‍🔬',
    difficulty: 'Scholar',
    diffColor: 'text-orange-400 bg-orange-950/60 border-orange-700',
    petName: 'Apex Predator T-Rex',
    petAvatar: '🦖',
    petElement: 'Fire',
    petRarity: 'mythical',
    petHp: 400,
    petAtk: 72,
    petDef: 34,
    skillName: 'Tyrant Earthshaker Crush',
    introDialog: 'A colossus from 66 million years ago has awakened! Only true mastery over Units 1-3 can pacify it!',
    winDialog: 'The T-Rex shows no mercy for basic grammar blunders! Review and return!',
    loseDialog: 'Superb scholarship! Your linguistic precision has tamed the prehistoric apex predator!',
    rewardCrystals: 350,
    rewardEggType: 'golden',
  },
  {
    id: 'npc-5',
    name: 'Dragon Monarch Ignis',
    title: 'Sovereign of the Imperial Court',
    avatar: '🐉👑🔥',
    difficulty: 'King',
    diffColor: 'text-yellow-400 bg-gradient-to-r from-amber-950 via-red-950 to-yellow-950 border-yellow-500 font-extrabold',
    petName: 'Sovereign Dragon King Ignis',
    petAvatar: '🐉👑🔥',
    petElement: 'Fire',
    petRarity: 'king',
    petHp: 650,
    petAtk: 108,
    petDef: 52,
    skillName: 'Imperium Dragonflame Reign',
    introDialog: 'Bow before the royal dragon crown! Only those who have conquered the highest vocabulary challenges may stand before my throne!',
    winDialog: 'Royal authority is absolute! Return to your studies, young adventurer!',
    loseDialog: 'Astonishing valor and linguistic wisdom! I acknowledge you as a true King among scholars!',
    rewardCrystals: 650,
    rewardEggType: 'king',
  },
  {
    id: 'npc-6',
    name: 'Titan Vanguard Hyperion',
    title: 'Commander of the World Mantle',
    avatar: '🗿⚡',
    difficulty: 'Titan',
    diffColor: 'text-amber-300 bg-amber-950/80 border-amber-500 font-extrabold',
    petName: 'Titan Colossus Atlas',
    petAvatar: '🗿',
    petElement: 'Gold',
    petRarity: 'titan',
    petHp: 820,
    petAtk: 130,
    petDef: 68,
    skillName: 'Vault of Heavens Cataclysm',
    introDialog: 'I command the tectonic plates beneath your feet! Only peerless B1 grammatical precision can withstand my Titan hammer!',
    winDialog: 'The earth has reclaimed you! Sharpen your conditional sentences and try again!',
    loseDialog: 'Astonishing! The tectonic mantle yielded to the precision of your mind! Accept this Titan tribute!',
    rewardCrystals: 950,
    rewardEggType: 'titan',
  },
  {
    id: 'npc-7',
    name: 'Archangel Seraphina',
    title: 'Deity of the Empyrean Heavens',
    avatar: '🕊️✨💫',
    difficulty: 'Deity',
    diffColor: 'text-cyan-300 bg-gradient-to-r from-cyan-950 via-indigo-950 to-purple-950 border-cyan-400 font-extrabold',
    petName: 'Seraphim Light Deity Seraphina',
    petAvatar: '🕊️👑✨',
    petElement: 'Divine',
    petRarity: 'deity',
    petHp: 1020,
    petAtk: 155,
    petDef: 80,
    skillName: 'Six-Wing Archangel Genesis',
    introDialog: 'Bask in the sacred light of the heavens. Will your English mastery shine with untarnished purity?',
    winDialog: 'Even the gentlest shadow can cloud your mind. Cleanse your doubts and challenge heaven again!',
    loseDialog: 'Miraculous! The heavens sing praise for your peerless grammar and vocabulary!',
    rewardCrystals: 1400,
    rewardEggType: 'deity',
  },
  {
    id: 'npc-8',
    name: 'Supreme Creator Deus',
    title: 'Lord of the Omniverse Throne',
    avatar: '👑✨🕊️',
    difficulty: 'God',
    diffColor: 'text-yellow-300 bg-gradient-to-r from-purple-950 via-amber-950 to-cyan-950 border-yellow-400 font-black animate-pulse',
    petName: 'Supreme Dragon Deity Deus',
    petAvatar: '🐲👑✨',
    petElement: 'Divine',
    petRarity: 'god',
    petHp: 1300,
    petAtk: 190,
    petDef: 95,
    skillName: 'Genesis Supernova Omnipotence',
    introDialog: 'Mortal scholar, you have reached the summit of all realms. Let the symphony of English mastery determine your destiny!',
    winDialog: 'Your syntax wavered for a split second! Return to the sacred scrolls and achieve true enlightenment!',
    loseDialog: 'Transcendent! You have mastered the language of creation itself! Wear the mantle of the Supreme Champion!',
    rewardCrystals: 2000,
    rewardEggType: 'god',
  },
  {
    id: 'npc-9',
    name: 'Void Sovereign Ouroboros',
    title: 'King of Gods of the Endless Void',
    avatar: '👑🌌🕳️',
    difficulty: 'King of God',
    diffColor: 'text-amber-300 bg-gradient-to-r from-purple-950 via-rose-950 to-amber-950 border-amber-400 font-black animate-pulse shadow-lg shadow-purple-950',
    petName: 'Void King',
    petAvatar: '👑🕳️🌌',
    petElement: 'Void',
    petRarity: 'king_of_god',
    petHp: 1650,
    petAtk: 230,
    petDef: 115,
    skillName: 'Monarch of Nothingness Judgment',
    introDialog: 'You stand before the King of Gods. Primordial chaos and the infinite void obey my command. Let us see if your English scholarship can pierce eternity!',
    winDialog: 'Even gods bow to the void! Transcend your syntax limits and challenge eternity once more!',
    loseDialog: 'Unbelievable! You have conquered the throne of the King of Gods! The entire omniverse salutes your supreme linguistic mastery!',
    rewardCrystals: 3500,
    rewardEggType: 'king_of_god',
  },
];

export const ARENA_QUESTIONS: ArenaQuestion[] = [
  {
    id: 'aq-1',
    type: 'vocab',
    typeLabel: 'B1 Rural Life Vocabulary',
    question: 'Which word means "to collect or gather ripe crops" from fields in rural life (Unit 2)?',
    options: ['harvest', 'pasture', 'cattle', 'orchard'],
    correctIndex: 0,
    explanation: '"Harvest" means the gathering of crops from farmland.',
  },
  {
    id: 'aq-2',
    type: 'grammar',
    typeLabel: 'Gerunds & Preferences',
    question: 'Choose the correct form: "She enjoys _______ handcrafted pottery in her leisure time."',
    options: ['making', 'to make', 'made', 'make'],
    correctIndex: 0,
    explanation: 'Verbs expressing preferences like "enjoy" take the gerund V-ing ("making").',
  },
  {
    id: 'aq-3',
    type: 'vocab',
    typeLabel: 'B1 Vocabulary',
    question: 'What does the word "nomadic" describe regarding lifestyle?',
    options: ['Moving from place to place with seasonal herds', 'Urban and industrial', 'Living in modern high-rises', 'Crowded and noisy'],
    correctIndex: 0,
    explanation: '"Nomadic" refers to people who move from place to place to find pasture for animals.',
  },
  {
    id: 'aq-4',
    type: 'grammar',
    typeLabel: 'Comparative of Adverbs',
    question: 'Choose the correct comparative: "Tigers run _______ than elephants through dense jungles."',
    options: ['more swiftly', 'swiftlier', 'swiftly', 'most swiftly'],
    correctIndex: 0,
    explanation: 'For multi-syllable adverbs ending in -ly, use "more + adverb" ("more swiftly").',
  },
  {
    id: 'aq-5',
    type: 'vocab',
    typeLabel: 'Prehistoric Ecology',
    question: 'What term describes an animal that primarily hunts and feeds on other animals?',
    options: ['carnivore', 'herbivore', 'omnivore', 'forager'],
    correctIndex: 0,
    explanation: '"Carnivore" refers to meat-eating organisms.',
  },
  {
    id: 'aq-6',
    type: 'grammar',
    typeLabel: 'Concession Clauses',
    question: 'Complete the sentence: "_______ the dragon was slumbering, its keen ears detected every footstep."',
    options: ['Although', 'Despite', 'Because', 'Since'],
    correctIndex: 0,
    explanation: '"Although" introduces a clause of concession with a full subject and verb.',
  },
  {
    id: 'aq-7',
    type: 'speed',
    typeLabel: 'Fast Vocabulary',
    question: 'Select the synonym for "massive" or "colossal":',
    options: ['gigantic', 'minute', 'microscopic', 'feeble'],
    correctIndex: 0,
    explanation: '"Gigantic" means extremely large, synonymous with colossal and massive.',
  },
  {
    id: 'aq-8',
    type: 'grammar',
    typeLabel: 'Modal Verbs of Obligation',
    question: 'Choose the correct modal: "Explorers _______ remain silent to avoid waking the guardian dragon."',
    options: ['must', 'might', 'could', 'would'],
    correctIndex: 0,
    explanation: '"Must" expresses strict necessity and urgent obligation.',
  },
  {
    id: 'aq-9',
    type: 'vocab',
    typeLabel: 'B1 Habitat Vocabulary',
    question: 'Which term refers to a vast, flat, treeless Arctic region where the subsoil is permanently frozen?',
    options: ['tundra', 'canopy', 'plateau', 'oasis'],
    correctIndex: 0,
    explanation: '"Tundra" is the treeless cold biome characterized by permafrost.',
  },
  {
    id: 'aq-10',
    type: 'grammar',
    typeLabel: 'Result Clauses (So... that)',
    question: 'Complete the sentence: "The dragon was _______ powerful that its roar shook the mountain."',
    options: ['so', 'such', 'very', 'too'],
    correctIndex: 0,
    explanation: '"So + adjective + that" expresses cause and extreme result.',
  },
  {
    id: 'aq-11',
    type: 'speed',
    typeLabel: 'Synonyms',
    question: 'Select the word that means the opposite of "fragile":',
    options: ['resilient', 'delicate', 'frail', 'brittle'],
    correctIndex: 0,
    explanation: '"Resilient" means strong and able to withstand damage, opposite of fragile.',
  },
  {
    id: 'aq-12',
    type: 'grammar',
    typeLabel: 'Reason Clauses',
    question: 'Choose the conjunction: "The infiltration squad stayed silent _______ the dragon had keen hearing."',
    options: ['because', 'although', 'even though', 'despite'],
    correctIndex: 0,
    explanation: '"Because" introduces a clause stating the cause or reason.',
  },
];

// Helper to calculate pet stats for battle with Enchantment multiplier
export function calculatePetStats(pet: { tierRank: number; rarity: CreatureRarity; enchantmentLevel?: number }) {
  const rank = pet.tierRank || 1;
  const enchant = pet.enchantmentLevel || 0;

  // Ranks 1 to 12 (11 = Titan, 12 = God)
  const baseHp = 120 + rank * 42;
  const baseAtk = 24 + rank * 9.5;
  const baseDef = 8 + rank * 4.2;

  // Crystal enchantment provides +25% HP and +25% ATK per star
  const enchantMultiplier = 1 + enchant * 0.25;
  const maxHp = Math.round(baseHp * enchantMultiplier);
  const atk = Math.round(baseAtk * enchantMultiplier);
  const def = Math.round(baseDef * enchantMultiplier);

  return { maxHp, atk, def, enchantMultiplier };
}

// ================= ELEMENTAL SYSTEM & COUNTER-ADVANTAGES =================
export type ElementType = 'fire' | 'frost' | 'thunder' | 'shadow' | 'gold' | 'nature' | 'wind' | 'cosmic' | 'void' | 'divine';

export interface ElementInfo {
  id: ElementType;
  nameVi: string;
  nameEn: string;
  icon: string;
  color: string;
  bgGradient: string;
  strongAgainst: ElementType[];
  weakAgainst: ElementType[];
  description: string;
}

export const ELEMENTS_MAP: Record<string, ElementInfo> = {
  fire: {
    id: 'fire',
    nameVi: 'Hỏa (Fire)',
    nameEn: 'Fire',
    icon: '🔥',
    color: 'text-rose-400',
    bgGradient: 'from-rose-600 to-orange-600',
    strongAgainst: ['frost', 'nature'],
    weakAgainst: ['thunder', 'wind', 'water' as ElementType],
    description: 'Sức mạnh bùng nổ, khắc chế Băng và Thảo.',
  },
  frost: {
    id: 'frost',
    nameVi: 'Băng (Frost)',
    nameEn: 'Frost',
    icon: '❄️',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-600 to-blue-600',
    strongAgainst: ['nature', 'wind'],
    weakAgainst: ['fire', 'gold', 'thunder'],
    description: 'Hơi thở lạnh giá, đông cứng Thảo và Phong.',
  },
  nature: {
    id: 'nature',
    nameVi: 'Thảo (Nature)',
    nameEn: 'Nature',
    icon: '🌿',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-600 to-green-600',
    strongAgainst: ['thunder', 'gold'],
    weakAgainst: ['fire', 'frost'],
    description: 'Sự sống hoang dã, khắc chế Lôi và Kim.',
  },
  thunder: {
    id: 'thunder',
    nameVi: 'Lôi (Thunder)',
    nameEn: 'Thunder',
    icon: '⚡',
    color: 'text-amber-400',
    bgGradient: 'from-amber-500 to-yellow-600',
    strongAgainst: ['wind', 'fire'],
    weakAgainst: ['nature', 'cosmic'],
    description: 'Tia chớp chí mạng, khắc chế Phong và Hỏa.',
  },
  wind: {
    id: 'wind',
    nameVi: 'Phong (Wind)',
    nameEn: 'Wind',
    icon: '💨',
    color: 'text-teal-400',
    bgGradient: 'from-teal-500 to-cyan-700',
    strongAgainst: ['fire', 'thunder'],
    weakAgainst: ['frost', 'shadow'],
    description: 'Cơn lốc sắc bén, khắc chế Hỏa và Lôi.',
  },
  gold: {
    id: 'gold',
    nameVi: 'Kim (Gold)',
    nameEn: 'Gold',
    icon: '☀️',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500 to-amber-700',
    strongAgainst: ['frost', 'shadow'],
    weakAgainst: ['nature', 'void'],
    description: 'Ánh sáng vàng rực, khắc chế Băng và Hắc Ám.',
  },
  shadow: {
    id: 'shadow',
    nameVi: 'Hắc Ám (Shadow)',
    nameEn: 'Shadow',
    icon: '🌑',
    color: 'text-purple-400',
    bgGradient: 'from-purple-700 to-slate-900',
    strongAgainst: ['cosmic', 'void'],
    weakAgainst: ['gold', 'divine'],
    description: 'Bóng đêm u tối, khắc chế Vũ Trụ và Hư Không.',
  },
  cosmic: {
    id: 'cosmic',
    nameVi: 'Vũ Trụ (Cosmic)',
    nameEn: 'Cosmic',
    icon: '🌌',
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-600 to-purple-800',
    strongAgainst: ['void', 'divine'],
    weakAgainst: ['shadow', 'thunder'],
    description: 'Năng lượng ngân hà, khắc chế Hư Không và Thần Thánh.',
  },
  void: {
    id: 'void',
    nameVi: 'Hư Không (Void)',
    nameEn: 'Void',
    icon: '🕳️',
    color: 'text-violet-400',
    bgGradient: 'from-violet-800 to-slate-950',
    strongAgainst: ['divine', 'gold'],
    weakAgainst: ['shadow', 'cosmic'],
    description: 'Vực thẳm vô tận, khắc chế Thần Thánh và Kim.',
  },
  divine: {
    id: 'divine',
    nameVi: 'Thần Thánh (Divine)',
    nameEn: 'Divine',
    icon: '✨',
    color: 'text-amber-300',
    bgGradient: 'from-amber-300 to-yellow-500',
    strongAgainst: ['shadow', 'cosmic'],
    weakAgainst: ['void'],
    description: 'Ánh sáng tối cao, khắc chế Hắc Ám và Vũ Trụ.',
  },
};

export function getElementInfo(elementKey: string): ElementInfo {
  const key = (elementKey || 'wind').toLowerCase();
  return ELEMENTS_MAP[key] || {
    id: 'wind',
    nameVi: 'Phong (Wind)',
    nameEn: 'Wind',
    icon: '💨',
    color: 'text-teal-400',
    bgGradient: 'from-teal-500 to-cyan-700',
    strongAgainst: ['fire', 'thunder'],
    weakAgainst: ['frost'],
    description: 'Cơn lốc sắc bén.',
  };
}

export function calculateElementMultiplier(
  attackerElem: string,
  defenderElem: string
): { multiplier: number; label: string; advantage: 'super' | 'weak' | 'neutral' } {
  const att = getElementInfo(attackerElem);
  const defKey = (defenderElem || 'wind').toLowerCase();

  if (att.strongAgainst.includes(defKey as ElementType)) {
    return { multiplier: 1.35, label: '⚔️ Khắc hệ! (+35% Sát thương)', advantage: 'super' };
  }
  if (att.weakAgainst.includes(defKey as ElementType)) {
    return { multiplier: 0.75, label: '🛡️ Bị khắc hệ! (-25% Sát thương)', advantage: 'weak' };
  }
  return { multiplier: 1.0, label: '⚖️ Trung lập', advantage: 'neutral' };
}

