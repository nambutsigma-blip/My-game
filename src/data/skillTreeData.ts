import { PetSkillNode, SkillBranchId, SkillTreeState } from '../types';

export interface SkillBranchConfig {
  id: SkillBranchId;
  name: string;
  vietnameseTitle: string;
  badge: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
}

export const SKILL_BRANCHES: SkillBranchConfig[] = [
  {
    id: 'stealth',
    name: 'Stealth & Alert Arts',
    vietnameseTitle: 'Nghệ Thuật Lẩn Trốn & Giảm Báo Động',
    badge: '🥷 STEALTH',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
    description: 'Tự động hạ nhiệt báo động Rồng theo thời gian, giảm hình phạt khi trả lời sai và tăng hiệu năng Giày Tàng Hình.',
  },
  {
    id: 'economy',
    name: 'Dragon Crystal Economy',
    vietnameseTitle: 'Khai Thác Tinh Thể Rồng',
    badge: '💎 ECONOMY',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/70 via-slate-900 to-slate-950',
    description: 'Nhân đôi phần thưởng Tinh Thể Rồng kiếm được, nhận tiền thưởng học bổng điểm 10 và hoàn tiền khi ấp trứng.',
  },
  {
    id: 'combat',
    name: 'Arena Companion Mastery',
    vietnameseTitle: 'Chiến Tướng Đấu Trường Linh Thú',
    badge: '⚔️ ARENA',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgGradient: 'from-rose-950/70 via-slate-900 to-slate-950',
    description: 'Gia tăng HP, tăng sát thương tuyệt kỹ, tích nộ khí siêu tốc và kích hoạt khiên hộ mệnh Titan chặn đòn kẻ địch.',
  },
];

export const PET_SKILL_NODES: PetSkillNode[] = [
  // ================= BRANCH 1: STEALTH =================
  {
    id: 'node_faster_alert_cooldown',
    name: 'Dragon Repose',
    vietnameseTitle: 'Hơi Thở Ru Ngủ (Faster Alert Cooldown)',
    branch: 'stealth',
    tier: 1,
    icon: '💤',
    maxLevel: 3,
    costs: [100, 220, 380],
    prerequisites: [],
    descriptions: [
      'Cấp 1: Ổ Rồng tự động hạ nhiệt -1% báo động mỗi 4 giây khi bạn đang đọc và suy nghĩ ở mọi Stage.',
      'Cấp 2: Tự động hạ nhiệt -2% báo động mỗi 3 giây. Rồng chuyển dần sang trạng thái ngủ say.',
      'Cấp 3: Tự động hạ nhiệt -3% báo động mỗi 2.5 giây. Siêu hạ nhiệt liên tục giúp bạn an toàn tối đa!',
    ],
    shortEffect: 'Tự động giảm đến -3% Alert / 2.5s',
    statBonusType: 'alert_cooldown',
  },
  {
    id: 'node_mistake_mitigation',
    name: 'Silent Stride',
    vietnameseTitle: 'Bước Chân Vô Ảnh (Giảm Phạt Trả Lời Sai)',
    branch: 'stealth',
    tier: 2,
    icon: '🤫',
    maxLevel: 2,
    costs: [150, 300],
    prerequisites: ['node_faster_alert_cooldown'],
    descriptions: [
      'Cấp 1: Khi trả lời sai hoặc phát âm lỗi, mức tăng báo động Rồng giảm từ +25% xuống chỉ còn +18%.',
      'Cấp 2: Mức tăng báo động Rồng giảm sâu xuống chỉ còn +12% mỗi lần mắc lỗi.',
    ],
    shortEffect: 'Mỗi lỗi chỉ tăng +12% Alert (thay vì +25%)',
    statBonusType: 'mistake_mitigation',
  },
  {
    id: 'node_enhanced_boots',
    name: 'Shadow Cobbler',
    vietnameseTitle: 'Giày Tàng Hình Cải Tiến (Boots Mastery)',
    branch: 'stealth',
    tier: 3,
    icon: '👟',
    maxLevel: 2,
    costs: [220, 420],
    prerequisites: ['node_mistake_mitigation'],
    descriptions: [
      'Cấp 1: Bắt đầu mỗi Unit với sẵn 2 Giày Tàng Hình. Mỗi lần kích hoạt giày giảm -15% Alert (thay vì -10%).',
      'Cấp 2: Bắt đầu mỗi Unit với sẵn 3 Giày Tàng Hình. Mỗi lần dùng giày hạ ngay -20% Alert!',
    ],
    shortEffect: 'Bắt đầu +3 Giày & Giảm -20% Alert/lần',
    statBonusType: 'enhanced_boots',
  },
  {
    id: 'node_phantom_veil',
    name: 'Phantom Veil',
    vietnameseTitle: 'Màn Chắn Ảo Ảnh (Né Cảnh Báo)',
    branch: 'stealth',
    tier: 4,
    icon: '🌫️',
    maxLevel: 2,
    costs: [350, 650],
    prerequisites: ['node_enhanced_boots'],
    descriptions: [
      'Cấp 1: Có 25% tỷ lệ khi học sinh chọn sai đáp án, thú cưng lập tức tạo ảo ảnh đánh lạc hướng khiến mức Alert KHÔNG hề tăng!',
      'Cấp 2: Tỷ lệ thú cưng tạo ảo ảnh né phạt cảnh báo tăng lên 45%!',
    ],
    shortEffect: '45% cơ hội miễn nhiễm tăng Alert khi sai',
    statBonusType: 'phantom_veil',
  },

  // ================= BRANCH 2: ECONOMY =================
  {
    id: 'node_crystal_multiplier',
    name: 'Dragon Midas',
    vietnameseTitle: 'Bàn Tay Midas (Increased Crystal Yield)',
    branch: 'economy',
    tier: 1,
    icon: '✨',
    maxLevel: 3,
    costs: [120, 250, 480],
    prerequisites: [],
    descriptions: [
      'Cấp 1: Tăng +30% Tinh Thể Rồng thưởng sau mọi nhiệm vụ Unit và chiến thắng Arena.',
      'Cấp 2: Tăng +60% Tinh Thể Rồng thưởng sau mọi nhiệm vụ và thử thách.',
      'Cấp 3: Tăng +100% (Gấp Đôi Tinh Thể!) vĩnh viễn cho tất cả nguồn thu trong game!',
    ],
    shortEffect: '+100% Tinh Thể Rồng thưởng vĩnh viễn',
    statBonusType: 'crystal_multiplier',
  },
  {
    id: 'node_scholar_bounty',
    name: 'Scholarly Hoard',
    vietnameseTitle: 'Kho Báu Học Giả (Thưởng Điểm 10 Tuyệt Đối)',
    branch: 'economy',
    tier: 2,
    icon: '📜',
    maxLevel: 2,
    costs: [180, 360],
    prerequisites: ['node_crystal_multiplier'],
    descriptions: [
      'Cấp 1: Mỗi khi hoàn thành Unit đạt điểm 10/10, nhận thêm ngay +100 Tinh Thể Rồng học bổng.',
      'Cấp 2: Thưởng thêm tới +200 Tinh Thể Rồng cho mỗi thành tích điểm 10/10 hoàn hảo!',
    ],
    shortEffect: '+200 Tinh Thể cho mỗi điểm 10/10',
    statBonusType: 'scholar_bounty',
  },
  {
    id: 'node_arena_plunder',
    name: 'Warlord Plunder',
    vietnameseTitle: 'Chiến Lợi Phẩm Đấu Trường',
    branch: 'economy',
    tier: 3,
    icon: '🏆',
    maxLevel: 2,
    costs: [240, 480],
    prerequisites: ['node_scholar_bounty'],
    descriptions: [
      'Cấp 1: Đả bại Huấn luyện viên NPC tại Đấu trường Arena nhận thêm +50% Tinh Thể Rồng.',
      'Cấp 2: Chiến thắng Arena nhận thêm +100% Tinh Thể Rồng cho mỗi trận hạ gục đối thủ!',
    ],
    shortEffect: '+100% Tinh Thể khi thắng NPC Arena',
    statBonusType: 'arena_plunder',
  },
  {
    id: 'node_hatch_rebate',
    name: 'Incubator Alchemy',
    vietnameseTitle: 'Cộng Hưởng Lồng Ấp (Hoàn Tinh Thể & Tăng Tỷ Lệ Thần Thoại)',
    branch: 'economy',
    tier: 4,
    icon: '🔮',
    maxLevel: 2,
    costs: [350, 700],
    prerequisites: ['node_arena_plunder'],
    descriptions: [
      'Cấp 1: Mỗi khi ấp 1 quả trứng rồng, hoàn lại ngay +80 Tinh Thể Rồng; tỷ lệ nở thú Mythical/Titan/God tăng +15%.',
      'Cấp 2: Hoàn lại +160 Tinh Thể Rồng mỗi quả trứng; tỷ lệ nở thú Cấp Thần Thoại tăng +30%!',
    ],
    shortEffect: 'Hoàn +160 Tinh Thể & +30% Tỷ Lệ Thú Thần Thoại',
    statBonusType: 'hatch_rebate',
  },

  // ================= BRANCH 3: COMBAT =================
  {
    id: 'node_pet_hp_bonus',
    name: 'Primal Vigor',
    vietnameseTitle: 'Sinh Lực Nguyên Thủy (Tăng Máu Linh Thú)',
    branch: 'combat',
    tier: 1,
    icon: '❤️',
    maxLevel: 2,
    costs: [120, 260],
    prerequisites: [],
    descriptions: [
      'Cấp 1: Tất cả thú cưng tăng thêm +25% Lượng Máu Tối Đa (Max HP) trong Đấu Trường Arena.',
      'Cấp 2: Lượng Máu Tối Đa của tất cả thú cưng tăng thêm +50%!',
    ],
    shortEffect: '+50% Max HP cho tất cả thú cưng',
    statBonusType: 'pet_hp_bonus',
  },
  {
    id: 'node_rage_and_damage',
    name: 'Elemental Surge',
    vietnameseTitle: 'Cuồng Nộ Nguyên Tố (Sát Thương & Nộ Khí)',
    branch: 'combat',
    tier: 2,
    icon: '⚡',
    maxLevel: 2,
    costs: [200, 420],
    prerequisites: ['node_pet_hp_bonus'],
    descriptions: [
      'Cấp 1: Kỹ năng Nguyên Tố & Tuyệt Kỹ gây thêm +25% sát thương; khởi đầu trận với sẵn 35 Nộ Khí.',
      'Cấp 2: Kỹ năng gây thêm +50% sát thương; khởi đầu trận với sẵn 50 Nộ Khí (kích hoạt Tuyệt Kỹ ngay vòng 1)!',
    ],
    shortEffect: '+50% Dame Kỹ Năng & 50 Nộ Khí khởi đầu',
    statBonusType: 'rage_and_damage',
  },
  {
    id: 'node_divine_shield',
    name: 'Titan Aegis',
    vietnameseTitle: 'Khiên Hộ Vệ Titan Thần Thánh',
    branch: 'combat',
    tier: 3,
    icon: '🛡️',
    maxLevel: 2,
    costs: [320, 600],
    prerequisites: ['node_rage_and_damage'],
    descriptions: [
      'Cấp 1: Khi bước vào trận đấu Arena, thú cưng được phủ khiên thần thánh chặn đứng hoàn toàn đòn đánh đầu tiên của đối thủ.',
      'Cấp 2: Khiên hộ mệnh chặn đứng hoàn toàn 2 đòn tấn công đầu tiên từ đối thủ!',
    ],
    shortEffect: 'Chặn đứng 2 đòn đánh đầu tiên của đối thủ',
    statBonusType: 'divine_shield',
  },
];

// Helper to calculate total crystals invested in the skill tree
export function calculateTotalSpentCrystals(treeState: SkillTreeState): number {
  let total = 0;
  for (const node of PET_SKILL_NODES) {
    const level = treeState[node.id] || 0;
    for (let i = 0; i < level; i++) {
      if (node.costs[i]) {
        total += node.costs[i];
      }
    }
  }
  return total;
}

// Helper to calculate active passive bonus values
export interface PassiveBonuses {
  alertCooldownSeconds: number; // 0 = inactive, or 4, 3, 2.5
  alertCooldownAmount: number; // -1, -2, -3
  mistakePenalty: number; // 25 (default), 18, 12
  startingBootsCount: number; // 1 (default), 2, 3
  bootsAlertReduction: number; // 10 (default), 15, 20
  phantomVeilChance: number; // 0 (default), 0.25, 0.45
  crystalMultiplier: number; // 0 (default), 0.30, 0.60, 1.0
  scholarBonus: number; // 0 (default), 100, 200
  arenaCrystalMultiplier: number; // 0 (default), 0.50, 1.0
  hatchRebate: number; // 0 (default), 80, 160
  hatchBonusRate: number; // 0 (default), 0.15, 0.30
  petHpMultiplier: number; // 0 (default), 0.25, 0.50
  petSkillDamageMultiplier: number; // 0 (default), 0.25, 0.50
  startingRageBonus: number; // 0 (default), 15, 30
  divineShieldHits: number; // 0 (default), 1, 2
  unlockedPerksCount: number;
}

export function getPassiveBonuses(treeState: SkillTreeState): PassiveBonuses {
  // Dragon Repose
  const reposeLvl = treeState['node_faster_alert_cooldown'] || 0;
  let alertCooldownSeconds = 0;
  let alertCooldownAmount = 0;
  if (reposeLvl === 1) {
    alertCooldownSeconds = 4;
    alertCooldownAmount = 1;
  } else if (reposeLvl === 2) {
    alertCooldownSeconds = 3;
    alertCooldownAmount = 2;
  } else if (reposeLvl >= 3) {
    alertCooldownSeconds = 2.5;
    alertCooldownAmount = 3;
  }

  // Silent Stride
  const strideLvl = treeState['node_mistake_mitigation'] || 0;
  const mistakePenalty = strideLvl === 1 ? 18 : strideLvl >= 2 ? 12 : 25;

  // Shadow Cobbler
  const cobblerLvl = treeState['node_enhanced_boots'] || 0;
  const startingBootsCount = cobblerLvl === 1 ? 2 : cobblerLvl >= 2 ? 3 : 1;
  const bootsAlertReduction = cobblerLvl === 1 ? 15 : cobblerLvl >= 2 ? 20 : 10;

  // Phantom Veil
  const veilLvl = treeState['node_phantom_veil'] || 0;
  const phantomVeilChance = veilLvl === 1 ? 0.25 : veilLvl >= 2 ? 0.45 : 0;

  // Dragon Midas
  const midasLvl = treeState['node_crystal_multiplier'] || 0;
  const crystalMultiplier = midasLvl === 1 ? 0.3 : midasLvl === 2 ? 0.6 : midasLvl >= 3 ? 1.0 : 0;

  // Scholar Hoard
  const scholarLvl = treeState['node_scholar_bounty'] || 0;
  const scholarBonus = scholarLvl === 1 ? 100 : scholarLvl >= 2 ? 200 : 0;

  // Arena Plunder
  const plunderLvl = treeState['node_arena_plunder'] || 0;
  const arenaCrystalMultiplier = plunderLvl === 1 ? 0.5 : plunderLvl >= 2 ? 1.0 : 0;

  // Incubator Alchemy
  const alchemyLvl = treeState['node_hatch_rebate'] || 0;
  const hatchRebate = alchemyLvl === 1 ? 80 : alchemyLvl >= 2 ? 160 : 0;
  const hatchBonusRate = alchemyLvl === 1 ? 0.15 : alchemyLvl >= 2 ? 0.3 : 0;

  // Primal Vigor
  const vigorLvl = treeState['node_pet_hp_bonus'] || 0;
  const petHpMultiplier = vigorLvl === 1 ? 0.25 : vigorLvl >= 2 ? 0.5 : 0;

  // Elemental Surge
  const surgeLvl = treeState['node_rage_and_damage'] || 0;
  const petSkillDamageMultiplier = surgeLvl === 1 ? 0.25 : surgeLvl >= 2 ? 0.5 : 0;
  const startingRageBonus = surgeLvl === 1 ? 15 : surgeLvl >= 2 ? 30 : 0;

  // Titan Aegis
  const aegisLvl = treeState['node_divine_shield'] || 0;
  const divineShieldHits = aegisLvl === 1 ? 1 : aegisLvl >= 2 ? 2 : 0;

  // Count active perks
  let unlockedPerksCount = 0;
  for (const node of PET_SKILL_NODES) {
    if ((treeState[node.id] || 0) > 0) {
      unlockedPerksCount++;
    }
  }

  return {
    alertCooldownSeconds,
    alertCooldownAmount,
    mistakePenalty,
    startingBootsCount,
    bootsAlertReduction,
    phantomVeilChance,
    crystalMultiplier,
    scholarBonus,
    arenaCrystalMultiplier,
    hatchRebate,
    hatchBonusRate,
    petHpMultiplier,
    petSkillDamageMultiplier,
    startingRageBonus,
    divineShieldHits,
    unlockedPerksCount,
  };
}
