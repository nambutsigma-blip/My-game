import React, { useState, useEffect } from 'react';
import { X, Shield, Zap, Sparkles, Trophy, Users, LogIn, LogOut, Swords, Globe, RefreshCw, CheckCircle, UserCheck } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, doc, setDoc, getDoc, collection, getDocs, updateDoc, increment, serverTimestamp, User } from '../lib/firebase';
import { PetCompanion, StolenEgg } from '../types';
import { playSuccessChime, playLaser, playAlertUp } from '../utils/soundEffects';

interface OnlineMultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dragonCrystals: number;
  setDragonCrystals: React.Dispatch<React.SetStateAction<number>>;
  hatchedPets: PetCompanion[];
  setHatchedPets: React.Dispatch<React.SetStateAction<PetCompanion[]>>;
  stolenEggs: StolenEgg[];
  skillTreeState: any;
  setSkillTreeState: React.Dispatch<React.SetStateAction<any>>;
}

interface OnlinePlayer {
  uid: string;
  displayName: string;
  photoURL: string;
  crystals: number;
  wins: number;
  activePetName: string;
  activePetPower: number;
  lastActive: any;
}

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  crystals: number;
  wins: number;
}

export const OnlineMultiplayerModal: React.FC<OnlineMultiplayerModalProps> = ({
  isOpen,
  onClose,
  dragonCrystals,
  setDragonCrystals,
  hatchedPets,
  setHatchedPets,
  stolenEggs,
  skillTreeState,
  setSkillTreeState,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'lobby' | 'matchmaking' | 'leaderboard'>('lobby');
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isDuelling, setIsDuelling] = useState(false);
  const [duelOpponent, setDuelOpponent] = useState<OnlinePlayer | null>(null);
  const [duelLog, setDuelLog] = useState<string[]>([]);
  const [duelResult, setDuelResult] = useState<'victory' | 'defeat' | null>(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user to firestore
        await syncUserToFirestore(currentUser);
        fetchOnlinePlayers();
        fetchLeaderboard();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoadingAuth(true);
      playAlertUp();
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await syncUserToFirestore(result.user);
      playSuccessChime();
      fetchOnlinePlayers();
      fetchLeaderboard();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      alert('Đăng nhập Google thất bại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSyncStatus('Đã đăng xuất');
      playLaser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const syncUserToFirestore = async (currentUser: User) => {
    if (!currentUser) return;
    try {
      const bestPet = hatchedPets.length > 0 ? hatchedPets[0] : null;
      const petPower = bestPet ? bestPet.level * 150 + bestPet.happiness * 10 : 100;

      const userDocRef = doc(db, 'users', currentUser.uid);
      const onlineDocRef = doc(db, 'onlinePlayers', currentUser.uid);
      const leaderDocRef = doc(db, 'leaderboard', currentUser.uid);

      const userData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Nhà Thám Hiểm',
        photoURL: currentUser.photoURL || '',
        crystals: dragonCrystals,
        wins: (skillTreeState?.arenaWins || 0),
        activePetName: bestPet ? bestPet.name : 'Chưa có Pet',
        activePetPower: petPower,
        hatchedPetsCount: hatchedPets.length,
        lastActive: serverTimestamp(),
      };

      await setDoc(userDocRef, userData, { merge: true });
      await setDoc(onlineDocRef, userData, { merge: true });
      await setDoc(leaderDocRef, {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Nhà Thám Hiểm',
        photoURL: currentUser.photoURL || '',
        crystals: dragonCrystals,
        wins: (skillTreeState?.arenaWins || 0),
      }, { merge: true });

      setSyncStatus('☁️ Đã đồng bộ Cloud thành công!');
      setTimeout(() => setSyncStatus(''), 3000);
    } catch (err) {
      console.error('Cloud Sync error:', err);
      setSyncStatus('⚠️ Lỗi đồng bộ Cloud');
    }
  };

  const fetchOnlinePlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'onlinePlayers'));
      const players: OnlinePlayer[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as OnlinePlayer;
        if (data.uid !== user?.uid) {
          players.push(data);
        }
      });
      setOnlinePlayers(players);
    } catch (err) {
      console.error('Fetch online players error:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'leaderboard'));
      const list: LeaderboardEntry[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as LeaderboardEntry);
      });
      list.sort((a, b) => b.crystals - a.crystals || b.wins - a.wins);
      setLeaderboard(list);
    } catch (err) {
      console.error('Fetch leaderboard error:', err);
    }
  };

  const startLiveDuel = (opponent: OnlinePlayer) => {
    playLaser();
    setDuelOpponent(opponent);
    setIsDuelling(true);
    setDuelResult(null);
    setDuelLog([
      `⚔️ Trận chiến trực tuyến bắt đầu: ${user?.displayName || 'Bạn'} vs ${opponent.displayName}!`,
      `🐾 Thú cưng ra trận: Chiến đấu giữa lực chiến lực lượng...`,
    ]);

    setTimeout(() => {
      const myPower = (hatchedPets[0]?.level || 1) * 200 + dragonCrystals;
      const opPower = opponent.activePetPower || 500;
      const won = myPower + Math.random() * 300 >= opPower;

      if (won) {
        setDuelResult('victory');
        setDragonCrystals((prev) => prev + 150);
        setDuelLog((prev) => [
          `🏆 CHIẾN THẮNG TRỰC TUYẾN! Bạn đã đánh bại ${opponent.displayName}! Nhận +150 Kim Cương!`,
          ...prev,
        ]);
        playSuccessChime();
      } else {
        setDuelResult('defeat');
        setDuelLog((prev) => [
          `💥 THẤT BẠI! Thú cưng của ${opponent.displayName} quá mạnh trong trận đấu này!`,
          ...prev,
        ]);
        playAlertUp();
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-indigo-500/60 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-950/60">
              🌐
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Hệ Thống Online & Đăng Nhập Google</span>
                <span className="text-indigo-400 font-bold hidden md:inline">• Cloud Multiplayer</span>
              </h3>
              <p className="text-xs text-slate-400">
                Đồng bộ tài khoản đám mây, đấu trường PVP trực tuyến và Bảng xếp hạng toàn cầu.
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

        {/* Auth Bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />
              <div>
                <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>{user.displayName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{user.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Chưa đăng nhập tài khoản Google.</span>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {syncStatus && <span className="text-xs text-amber-300 animate-pulse">{syncStatus}</span>}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => syncUserToFirestore(user)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đồng Bộ Cloud</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={loadingAuth}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập Với Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4">
          <button
            onClick={() => {
              setActiveTab('lobby');
              if (user) fetchOnlinePlayers();
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'lobby'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Đấu Trường Trực Tuyến ({onlinePlayers.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('leaderboard');
              fetchLeaderboard();
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Xếp Hạng Toàn Cầu</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-3xl shadow-inner">
                🔒
              </div>
              <h4 className="text-lg font-bold text-white">Yêu Cầu Đăng Nhập Tài Khoản</h4>
              <p className="text-xs text-slate-400 max-w-md">
                Hãy đăng nhập bằng tài khoản Google để tham gia đấu trường trực tuyến PvP, lưu dữ liệu thú cưng & kho báu vĩnh viễn trên Cloud, và tranh tài trên bảng xếp hạng toàn cầu!
              </p>
              <button
                onClick={handleGoogleLogin}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 text-white font-black text-xs shadow-lg cursor-pointer active:scale-95"
              >
                Đăng Nhập Ngay
              </button>
            </div>
          ) : activeTab === 'lobby' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Danh sách đấu sĩ online ({onlinePlayers.length})
                </h4>
                <button
                  onClick={fetchOnlinePlayers}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Làm mới</span>
                </button>
              </div>

              {isDuelling && duelOpponent ? (
                <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 space-y-4 text-center">
                  <div className="text-2xl font-black text-amber-300 animate-pulse">⚔️ Đang Giao Tranh PVP Trực Tuyến ⚔️</div>
                  <div className="flex items-center justify-center gap-6 my-4">
                    <div className="text-center">
                      <img src={user.photoURL || ''} alt="You" className="w-14 h-14 rounded-full border-2 border-amber-500 mx-auto mb-1 object-cover" />
                      <div className="font-bold text-xs">{user.displayName}</div>
                      <div className="text-[10px] text-slate-400">Bạn</div>
                    </div>
                    <div className="text-2xl font-black text-rose-500 animate-bounce">VS</div>
                    <div className="text-center">
                      <img src={duelOpponent.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=op'} alt="Opponent" className="w-14 h-14 rounded-full border-2 border-indigo-500 mx-auto mb-1 object-cover" />
                      <div className="font-bold text-xs">{duelOpponent.displayName}</div>
                      <div className="text-[10px] text-slate-400">{duelOpponent.activePetName}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1 font-mono max-h-36 overflow-y-auto">
                    {duelLog.map((log, idx) => (
                      <div key={idx} className="text-slate-300">{log}</div>
                    ))}
                  </div>

                  {duelResult && (
                    <div className="pt-2">
                      <button
                        onClick={() => setIsDuelling(false)}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                      >
                        Hoàn Thành Trận Đấu
                      </button>
                    </div>
                  )}
                </div>
              ) : onlinePlayers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <div className="text-3xl">👥</div>
                  <div className="text-xs">Chưa có người chơi nào khác online trong sảnh. Hãy rủ bạn bè cùng tham gia nhé!</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {onlinePlayers.map((player) => (
                    <div
                      key={player.uid}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=dummy'}
                          alt={player.displayName}
                          className="w-11 h-11 rounded-full border border-indigo-500 object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs text-white">{player.displayName}</div>
                          <div className="text-[10px] text-slate-400">🐾 Pet: <span className="text-amber-300 font-bold">{player.activePetName}</span></div>
                          <div className="text-[10px] text-indigo-400">💎 Crystals: {player.crystals} | Thắng: {player.wins}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => startLiveDuel(player)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Thách Đấu</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bảng Xếp Hạng Top Đấu Sĩ & Sưu Tầm Kim Cương
              </h4>

              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const isTop3 = index < 3;
                  return (
                    <div
                      key={entry.uid}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        entry.uid === user?.uid
                          ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            index === 0
                              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50'
                              : index === 1
                              ? 'bg-slate-300 text-slate-950'
                              : index === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <img
                          src={entry.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=lb'}
                          alt={entry.displayName}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <span>{entry.displayName}</span>
                            {entry.uid === user?.uid && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                Bạn
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">Trận thắng: {entry.wins}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-xs sm:text-sm text-amber-400 flex items-center gap-1 justify-end">
                          <span>💎 {entry.crystals}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">Dragon Crystals</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
