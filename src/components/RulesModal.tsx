import React from 'react';
import { X, ShieldAlert, Sparkles, BookOpen, Flame, Mic, Zap, Eye, Footprints, Award } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
              📜
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-300">
                Explorer Field Manual: &quot;Egg Thief&quot;
              </h3>
              <p className="text-xs text-slate-400">
                Infiltration protocols, dragon lair mechanics, and B1 curriculum mastery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>1. Alert Level & Unit Unlock Conditions</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
              <li><strong className="text-white">Alert Level (0% - 100%):</strong> Every correct answer steps the explorer stealthily closer to the nest.</li>
              <li><strong className="text-rose-400">Dragon Stirring (+25%):</strong> Incorrect answers or failed pronunciations raise alert by 25%. Hitting 100% awakens the dragon and triggers an emergency rescue quiz!</li>
              <li><strong className="text-emerald-400">Unlock Condition (&ge; 80%):</strong> Score 8/10 or higher to successfully secure the dragon egg and unlock the next unit.</li>
              <li><strong className="text-amber-400">Golden Dragon Egg (10/10):</strong> Score a flawless 10/10 to claim a Golden Dragon Egg for rare companions!</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-indigo-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>2. Four Core Gameplay Stages</span>
            </h4>
            <div className="space-y-2">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-300">👁️ Stage 1: The All-Seeing Eye (B1 Vocabulary):</span> Identify target vocabulary through audio and contextual visuals. Navigate past the monster&apos;s sensor beam.
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-300">⚡ Stage 2: Grammar Trap:</span> Master high school entrance exam structures (Gerunds, Adverb Comparisons, Concession Clauses). <strong className="text-emerald-300">Vô hạn thời gian đọc!</strong> Trả lời trong 10 giây đầu để nhận thêm <strong className="text-emerald-300">&quot;Stealth Boots&quot;</strong> (-10% alert).
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-rose-300">🎙️ Stage 3: The Vocal Code (Speaking & AI Analysis):</span> Unlock the protective glass cage using voice passcodes. <strong className="text-emerald-300">Vô hạn thời gian đọc & phát âm!</strong> AI phoneme highlight gives real-time speech feedback.
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-rose-400">🏃 Stage 4: Dragon Chase (Tri-Unit Review Boss):</span> Triggers at every 3 units checkpoint! The guardian dragon chases you down as you solve 20 comprehensive review questions to escape!
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-emerald-300 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>3. AI Acoustic Sensor Color Feedback</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-emerald-950/60 p-2 rounded-xl border border-emerald-700/60 text-emerald-300 font-medium">
                <strong className="block text-emerald-200">🟢 Green</strong>
                Clear, loud, and accurately pronounced.
              </div>
              <div className="bg-amber-950/60 p-2 rounded-xl border border-amber-700/60 text-amber-300 font-medium">
                <strong className="block text-amber-200">🟡 Yellow</strong>
                Acceptable but lacks crisp ending sounds (/s/, /t/, /ed/, /f/).
              </div>
              <div className="bg-rose-950/60 p-2 rounded-xl border border-rose-700/60 text-rose-300 font-medium">
                <strong className="block text-rose-200">🔴 Red</strong>
                Inaudible, omitted, or mispronounced.
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>4. Companion Rarity Tiers</span>
            </h4>
            <p className="text-xs text-slate-400">
              Companions hatched in the Sanctuary grant perks including alert reduction and arena battle stats:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🌿 Living Companions (Tier 1-4):</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Common ➜ Uncommon ➜ Rare ➜ Epic</span>
                </span>
                <p className="text-slate-300 text-[11px] mt-1">
                  Common (Gray Wolf, Sand Cat, Barn Owl, Snow Hare) ➜ Uncommon (Golden Eagle, Arctic Fox, Sika Deer, Green Sea Turtle) ➜ Rare (Snow Leopard, Grizzly Bear, Orca Dolphin, Peregrine Falcon) ➜ Epic (Blue Whale, Bengal Tiger, King Cobra, Matriarch Elephant).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/50">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🦴 Prehistoric & Mythical Beasts (Tier 5-7):</span>
                  <span className="text-[10px] text-amber-400 font-normal">Legendary ➜ Mythical ➜ Ultimate</span>
                </span>
                <p className="text-slate-300 text-[11px] mt-1">
                  Legendary (Woolly Mammoth, Smilodon Saber-Tooth, Dodo Bird, Irish Elk) ➜ Mythical (Tyrannosaurus Rex, Quetzalcoatlus, Ankylosaurus, Terror Bird) ➜ Ultimate (Megalodon, Spinosaurus, Argentinosaurus, Giant Sea Scorpion).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-700/50">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <span>✨ Celestial & Cosmic Entities (Tier 8-10):</span>
                  <span className="text-[10px] text-purple-400 font-normal">Eternal ➜ Cosmic ➜ Secret</span>
                </span>
                <p className="text-slate-300 text-[11px] mt-1">
                  Eternal (Immortal Fire Phoenix, Pure Holy Unicorn, Azure Dragon, Abyss Leviathan) ➜ Cosmic (Nebula Astral Dragon, Supernova Phoenix, Event Horizon Cerberus) ➜ Secret (Void Ouroboros, Chronos Time Lord, Primordial Genesis Chimera).
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Early Unit Drop Rates & Pet Arena */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-extrabold text-rose-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>5. Drop Balancing & Companion PvP Arena</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 text-xs">
              <li>
                <strong className="text-amber-300">Early Unit Balancing:</strong> Early units (Units 1 & 2) drop standard eggs to ensure balanced progression, preventing high-tier creatures too early.
              </li>
              <li>
                <strong className="text-emerald-300">Advanced Unlocks (Units 3+):</strong> Scoring 10/10 on later units unlocks Golden Dragon Eggs for prehistoric and mythical companions.
              </li>
              <li>
                <strong className="text-rose-300">PvP vs NPC Trainers:</strong> Take your companions into battle against 5 NPC Masters (from Ranger Leo to Sovereign Malakor). Answer vocabulary and grammar questions to unleash devastating combos and claim Dragon Crystals and Boss Eggs!
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer"
          >
            Understood & Infiltrate Lair
          </button>
        </div>
      </div>
    </div>
  );
};
