import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../assets/assetPaths';
import {
  Search,
  History,
  Heart,
  ChevronLeft,
  Flame,
  Sparkles,
  Play,
  RotateCw,
  X,
  Volume2,
  Trophy,
  Plane,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlotGame {
  id: string;
  name: string;
  provider: 'JILI' | 'PG' | 'SPRIBE' | 'PRAGMATIC' | 'FC' | 'JDB' | 'MICROGAMING';
  image: string;
  topBadge?: string;
  jlBadge?: boolean;
  type: 'slot' | 'crash';
  gradient: string;
}

export const SLOTS_DATA: SlotGame[] = [
  {
    id: 'super-ace',
    name: 'Super Ace',
    provider: 'JILI',
    image: ASSETS.slotSuperAce,
    jlBadge: true,
    type: 'slot',
    gradient: 'from-amber-600 to-yellow-800',
  },
  {
    id: 'wild-athena',
    name: 'Wild Athena Rising',
    provider: 'JILI',
    image: ASSETS.slotAthena,
    jlBadge: true,
    type: 'slot',
    gradient: 'from-amber-500 to-teal-900',
  },
  {
    id: 'flyx',
    name: 'FlyX',
    provider: 'MICROGAMING',
    image: ASSETS.slotFlyx,
    type: 'crash',
    gradient: 'from-slate-900 to-indigo-950',
  },
  {
    id: 'aviator',
    name: 'Aviator',
    provider: 'SPRIBE',
    image: ASSETS.slotAviator,
    type: 'crash',
    gradient: 'from-rose-900 to-red-950',
  },
  {
    id: 'wild-bounty',
    name: 'Wild Bounty Showdown',
    provider: 'PG',
    image: ASSETS.slotWildBounty,
    type: 'slot',
    gradient: 'from-amber-800 to-stone-900',
  },
  {
    id: 'pirate-legends',
    name: 'Pirate Legends',
    provider: 'JILI',
    image: ASSETS.slotPirate,
    topBadge: '$BUY',
    type: 'slot',
    gradient: 'from-red-900 to-amber-950',
  },
  {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    provider: 'FC',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    topBadge: '10000X',
    type: 'slot',
    gradient: 'from-red-800 to-yellow-900',
  },
  {
    id: 'fruity-bonanza',
    name: 'Fruity Bonanza',
    provider: 'JDB',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80',
    type: 'slot',
    gradient: 'from-purple-900 to-indigo-950',
  },
  {
    id: 'fortune-gems-3',
    name: 'Fortune Gems 3',
    provider: 'JILI',
    image: ASSETS.slotFortuneGems,
    jlBadge: true,
    type: 'slot',
    gradient: 'from-amber-700 to-teal-950',
  },
  {
    id: 'boxing-king',
    name: 'Boxing King',
    provider: 'JILI',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80',
    jlBadge: true,
    type: 'slot',
    gradient: 'from-rose-800 to-slate-950',
  },
  {
    id: 'super-ace-deluxe',
    name: 'Super Ace Deluxe',
    provider: 'JILI',
    image: ASSETS.slotSuperAce,
    jlBadge: true,
    type: 'slot',
    gradient: 'from-amber-500 to-emerald-950',
  },
  {
    id: 'super-elements',
    name: 'Super Elements 2',
    provider: 'FC',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    topBadge: '10000X',
    type: 'slot',
    gradient: 'from-sky-700 to-indigo-950',
  },
];

export const SlotsLobby: React.FC<{ isEmbedded?: boolean; onBack?: () => void }> = ({
  isEmbedded = false,
  onBack,
}) => {
  const { user, updateUser, showToast, goBack, navigate } = useApp();

  const [activeProvider, setActiveProvider] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['super-ace', 'aviator', 'fortune-gems-3']);
  const [historyIds, setHistoryIds] = useState<string[]>(['super-ace', 'wild-bounty']);
  const [showHistoryOnly, setShowHistoryOnly] = useState<boolean>(false);

  // Active Demo Game Modal
  const [activeGame, setActiveGame] = useState<SlotGame | null>(null);

  // Slot Demo State
  const [slotBet, setSlotBet] = useState<number>(20);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reels, setReels] = useState<string[]>(['👑', '💎', '7️⃣']);
  const [slotWinMessage, setSlotWinMessage] = useState<string>('');

  // Aviator Demo State
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [planeMultiplier, setPlaneMultiplier] = useState<number>(1.0);
  const [isCashedOut, setIsCashedOut] = useState<boolean>(false);

  const providers = [
    { id: 'ALL', label: 'All' },
    { id: 'JILI', label: 'JILI' },
    { id: 'PG', label: 'PG' },
    { id: 'SPRIBE', label: 'SPRIBE' },
    { id: 'PRAGMATIC', label: 'PRAGMATIC PLAY' },
    { id: 'FC', label: 'FC' },
    { id: 'JDB', label: 'JDB' },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((i) => i !== id) : [...prev, id];
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites', 'info');
      return next;
    });
  };

  const filteredGames = useMemo(() => {
    return SLOTS_DATA.filter((game) => {
      if (activeProvider !== 'ALL' && game.provider !== activeProvider) return false;
      if (favoritesOnly && !favoriteIds.includes(game.id)) return false;
      if (showHistoryOnly && !historyIds.includes(game.id)) return false;
      if (searchQuery.trim() && !game.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [activeProvider, favoritesOnly, showHistoryOnly, favoriteIds, historyIds, searchQuery]);

  const handleLaunchGame = (game: SlotGame) => {
    if (game.id === 'aviator' || game.name.toLowerCase().includes('aviator')) {
      navigate('aviator');
      return;
    }
    if (game.id === 'super-ace' || game.name.toLowerCase().includes('super ace')) {
      navigate('super-ace');
      return;
    }
    setActiveGame(game);
    setHistoryIds((prev) => (prev.includes(game.id) ? prev : [game.id, ...prev]));
    setSlotWinMessage('');
    setIsSpinning(false);
    setIsFlying(false);
  };

  // Slot Machine Spin Handler
  const spinSlot = () => {
    if (user.balance < slotBet) {
      showToast('Insufficient demo balance! Please deposit demo funds.', 'error');
      return;
    }

    updateUser({ balance: Number((user.balance - slotBet).toFixed(2)) });
    setIsSpinning(true);
    setSlotWinMessage('');

    const symbols = ['👑', '💎', '7️⃣', '🃏', '⭐', '🔔'];

    setTimeout(() => {
      const r1 = symbols[Math.floor(Math.random() * symbols.length)];
      const r2 = symbols[Math.floor(Math.random() * symbols.length)];
      const r3 = symbols[Math.floor(Math.random() * symbols.length)];
      setReels([r1, r2, r3]);
      setIsSpinning(false);

      if (r1 === r2 && r2 === r3) {
        // Jackpot!
        const win = slotBet * 10;
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setSlotWinMessage(`🎉 MEGA WIN! +৳ ${win.toFixed(2)} (10X Jackpot)`);
        confetti({ particleCount: 80, spread: 80 });
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 Match
        const win = slotBet * 2.5;
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setSlotWinMessage(`✨ NICE WIN! +৳ ${win.toFixed(2)} (2.5X)`);
        confetti({ particleCount: 40, spread: 50 });
      } else {
        setSlotWinMessage('Try again for lucky symbols!');
      }
    }, 700);
  };

  // Aviator Flight Simulator
  const startAviator = () => {
    if (user.balance < slotBet) {
      showToast('Insufficient demo balance!', 'error');
      return;
    }
    updateUser({ balance: Number((user.balance - slotBet).toFixed(2)) });
    setIsFlying(true);
    setIsCashedOut(false);
    setPlaneMultiplier(1.0);

    const crashAt = 1.2 + Math.random() * 4.5;
    let current = 1.0;

    const interval = setInterval(() => {
      current += 0.05;
      setPlaneMultiplier(Number(current.toFixed(2)));

      if (current >= crashAt) {
        clearInterval(interval);
        setIsFlying(false);
        setSlotWinMessage(`💥 FLEW AWAY at ${current.toFixed(2)}X!`);
      }
    }, 120);
  };

  const cashOutAviator = () => {
    if (!isFlying || isCashedOut) return;
    setIsCashedOut(true);
    const win = Number((slotBet * planeMultiplier).toFixed(2));
    updateUser({ balance: Number((user.balance + win).toFixed(2)) });
    setSlotWinMessage(`💰 CASHED OUT at ${planeMultiplier.toFixed(2)}X! Won ৳ ${win.toFixed(2)}`);
    confetti({ particleCount: 50 });
  };

  return (
    <div className="bg-[#09222B] text-slate-100 min-h-screen">
      {/* Top Header matching the screenshot: Teal bar with golden back arrow and bold gold 'Slots' title */}
      {!isEmbedded && (
        <header className="sticky top-0 z-30 w-full bg-[#09222B] border-b border-[#0F3644] px-4 py-3 shadow-md">
          <div className="max-w-lg mx-auto flex items-center justify-between relative">
            <button
              onClick={onBack || goBack}
              className="w-9 h-9 rounded-full bg-[#0C3542] hover:bg-[#124555] text-amber-400 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            <h1 className="text-xl font-extrabold text-amber-400 tracking-wide absolute left-1/2 -translate-x-1/2">
              Slots
            </h1>

            <div className="w-9" />
          </div>
        </header>
      )}

      {/* Main Container */}
      <div className="max-w-lg mx-auto px-3.5 py-3 space-y-3">
        {/* Provider Tabs matching screenshot */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {providers.map((p) => {
            const active = activeProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProvider(p.id);
                  setFavoritesOnly(false);
                  setShowHistoryOnly(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight shrink-0 transition-all ${
                  active
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md scale-102'
                    : 'bg-[#0E3A48] hover:bg-[#13495B] text-white border border-[#164E61]/60'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Actions matching screenshot */}
        <div className="flex items-center gap-2">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Game name"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#071C23] border border-[#124252] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </span>
          </div>

          {/* History Button */}
          <button
            onClick={() => {
              setShowHistoryOnly(!showHistoryOnly);
              setFavoritesOnly(false);
            }}
            title="Played History"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              showHistoryOnly
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-[#0E3A48] text-teal-300 border border-[#164E61]/60 hover:bg-[#13495B]'
            }`}
          >
            <History className="w-4 h-4" />
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => {
              setFavoritesOnly(!favoritesOnly);
              setShowHistoryOnly(false);
            }}
            title="Favorite Games"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              favoritesOnly
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-[#0E3A48] text-teal-300 border border-[#164E61]/60 hover:bg-[#13495B]'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* 3-Column Games Grid exactly matching the screenshot! */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {filteredGames.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p>No games found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveProvider('ALL');
                  setFavoritesOnly(false);
                  setShowHistoryOnly(false);
                }}
                className="mt-2 text-amber-400 underline font-bold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredGames.map((game) => {
              const isFav = favoriteIds.includes(game.id);

              return (
                <div
                  key={game.id}
                  onClick={() => handleLaunchGame(game)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#071D25] border border-[#113E4E]/80 shadow-md cursor-pointer hover:border-amber-400/80 active:scale-96 transition-all"
                >
                  {/* Aspect Ratio 3:4 Game Poster Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                    <img
                      src={game.image}
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (game.id === 'aviator') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/gLjnZKW4/IMG-20260928-183427.png';
                        } else if (game.id === 'super-ace') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/20zQjTN0/IMG-20260928-183639.png';
                        } else if (game.id === 'wild-athena') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/Q3hpB6CG/IMG-20260929-102729.png';
                        } else if (game.id === 'flyx') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/Rk1RCtRn/IMG-20260929-103014.png';
                        } else if (game.id === 'wild-bounty') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/PLLS1zg/IMG-20260929-105452.png';
                        } else if (game.id === 'pirate-legends') {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://i.ibb.co.com/Rxx59R8/IMG-20260929-105853.png';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                    {/* Top-Left Provider Crown / JL Badge if present */}
                    {game.jlBadge && (
                      <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-0.5">
                        <span>JL</span>
                      </div>
                    )}

                    {/* Custom Top Badge (like 2000X or 500X) */}
                    {game.topBadge && (
                      <div className="absolute top-1.5 left-1.5 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                        {game.topBadge}
                      </div>
                    )}

                    {/* Top-Right Favorite Heart Icon exactly as in screenshot */}
                    <button
                      onClick={(e) => toggleFavorite(game.id, e)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:text-rose-400 active:scale-90 transition-transform z-10"
                      aria-label="Favorite"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Title & Provider Tag */}
                    <div className="absolute bottom-1.5 inset-x-1.5 text-center pointer-events-none z-10">
                      <h4 className="text-[11px] font-black tracking-tight text-white drop-shadow-md truncate leading-tight">
                        {game.name}
                      </h4>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300/90 block">
                        {game.provider}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= INTERACTIVE DEMO GAME SIMULATOR MODAL ================= */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0C323F] to-[#071920] border-2 border-amber-400 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            {/* Game Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#08232C] border-b border-[#144758]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-extrabold text-white">{activeGame.name}</h3>
                  <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">
                    {activeGame.provider} DEMO
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveGame(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Game Screen Content */}
            <div className="p-4 space-y-4">
              {/* SLOTS SIMULATOR */}
              {activeGame.type === 'slot' && (
                <div className="space-y-4">
                  {/* Slot Machine Display */}
                  <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-900/40 p-3 border border-amber-400/40 text-center shadow-inner">
                    <div className="grid grid-cols-3 gap-2 bg-[#05141A] p-4 rounded-xl border border-[#144758] shadow-inner mb-3">
                      {reels.map((symbol, i) => (
                        <div
                          key={i}
                          className={`h-20 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center text-4xl shadow-md border border-slate-700/60 ${
                            isSpinning ? 'animate-bounce' : ''
                          }`}
                        >
                          {symbol}
                        </div>
                      ))}
                    </div>

                    {slotWinMessage ? (
                      <div className="text-xs font-black text-amber-300 animate-pulse font-mono">
                        {slotWinMessage}
                      </div>
                    ) : (
                      <div className="text-[11px] text-teal-300">
                        Match 3 symbols for 10X jackpot! Match 2 for 2.5X!
                      </div>
                    )}
                  </div>

                  {/* Bet Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Bet Amount:</span>
                      <span className="font-mono font-bold text-amber-400">৳ {slotBet.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[10, 20, 50, 100].map((b) => (
                        <button
                          key={b}
                          onClick={() => setSlotBet(b)}
                          className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            slotBet === b
                              ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                              : 'bg-[#0E3A48] text-white hover:bg-[#13495B]'
                          }`}
                        >
                          ৳{b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spin Button */}
                  <button
                    disabled={isSpinning}
                    onClick={spinSlot}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                    {isSpinning ? 'Spinning...' : `SPIN (৳${slotBet})`}
                  </button>
                </div>
              )}

              {/* AVIATOR CRASH SIMULATOR */}
              {activeGame.type === 'crash' && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#05141A] p-4 border border-rose-500/40 text-center relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center">
                    {/* Trajectory Art */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10">
                      <Plane
                        className={`w-12 h-12 text-rose-500 mx-auto transition-transform ${
                          isFlying ? 'animate-pulse scale-125' : ''
                        }`}
                      />
                      <div className="text-3xl font-black font-mono text-white mt-2">
                        {planeMultiplier.toFixed(2)}x
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {isFlying ? 'Flight Climbing...' : 'Ready for Takeoff'}
                      </span>
                    </div>

                    {slotWinMessage && (
                      <div className="relative z-10 text-xs font-bold text-amber-300 mt-2">
                        {slotWinMessage}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isFlying}
                      onClick={startAviator}
                      className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-all shadow-md"
                    >
                      Start Flight (৳{slotBet})
                    </button>
                    <button
                      disabled={!isFlying || isCashedOut}
                      onClick={cashOutAviator}
                      className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs disabled:opacity-50 transition-all shadow-md"
                    >
                      Cash Out
                    </button>
                  </div>
                </div>
              )}

              {/* Wallet info */}
              <div className="pt-2 border-t border-[#144758] flex items-center justify-between text-xs text-slate-400">
                <span>Demo Balance:</span>
                <span className="font-mono font-bold text-amber-400">৳ {user.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
