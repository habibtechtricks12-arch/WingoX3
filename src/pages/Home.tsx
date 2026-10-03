import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Header } from '../components/Header';
import { TopDownloadBanner } from '../components/TopDownloadBanner';
import { FloatingSocialBar } from '../components/FloatingSocialBar';
import { JackpotBanner } from '../components/JackpotBanner';
import { SLOTS_DATA } from '../components/SlotsLobby';
import { ASSETS } from '../assets/assetPaths';
import {
  Volume2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Heart,
  Dices,
  Play,
  RotateCw,
  X,
  Plane,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Wallet,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Home: React.FC = () => {
  const { user, updateUser, navigate, showToast } = useApp();
  const { activeBanners, branding } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'hot' | 'favorites' | 'slots'>('hot');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['super-ace', 'wild-athena', 'aviator']);

  // Carousel dot state & auto-play
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds (per user prompt: "এগুলো ব্যানার প্রতি ৫ সেকেন্ড চেঞ্জ হবে")
  const intervalSeconds = branding.bannerIntervalSeconds || 5;

  useEffect(() => {
    if (!branding.bannerAutoPlay || activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % activeBanners.length);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [activeBanners.length, branding.bannerAutoPlay, intervalSeconds, isPaused]);

  // Keep carouselIndex in bounds if banners change in admin
  useEffect(() => {
    if (activeBanners.length === 0) return;
    if (carouselIndex >= activeBanners.length) {
      setCarouselIndex(0);
    }
  }, [activeBanners.length, carouselIndex]);

  const handlePrevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBanners.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBanners.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const currentBanner = activeBanners[carouselIndex] || activeBanners[0];

  // Demo Game Modal State
  const [activeGame, setActiveGame] = useState<any | null>(null);
  const [slotBet, setSlotBet] = useState(20);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['👑', '💎', '7️⃣']);
  const [slotWinMessage, setSlotWinMessage] = useState('');

  // Aviator demo state
  const [isFlying, setIsFlying] = useState(false);
  const [planeMultiplier, setPlaneMultiplier] = useState(1.0);
  const [isCashedOut, setIsCashedOut] = useState(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((i) => i !== id) : [...prev, id];
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites', 'info');
      return next;
    });
  };

  const handleLaunchGame = (game: any) => {
    if (game.id === 'aviator' || game.name.toLowerCase().includes('aviator')) {
      navigate('aviator');
      return;
    }
    if (game.id === 'super-ace' || game.name.toLowerCase().includes('super ace')) {
      navigate('super-ace');
      return;
    }
    setActiveGame(game);
    setSlotWinMessage('');
    setIsSpinning(false);
    setIsFlying(false);
  };

  // Slot machine demo spin
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
        const win = slotBet * 10;
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setSlotWinMessage(`🎉 MEGA WIN! +৳ ${win.toFixed(2)} (10X Jackpot)`);
        confetti({ particleCount: 80, spread: 80 });
      } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        const win = slotBet * 2.5;
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setSlotWinMessage(`✨ NICE WIN! +৳ ${win.toFixed(2)} (2.5X)`);
        confetti({ particleCount: 40, spread: 50 });
      } else {
        setSlotWinMessage('Try again for lucky symbols!');
      }
    }, 700);
  };

  // Aviator demo flight
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

  // Games row 1 and row 2 (Hot Games from Screenshot 1 & 2)
  const hotGamesRow1And2 = SLOTS_DATA.slice(0, 6);
  // Games row 3 (Below Jackpot from Screenshot 2)
  const gamesBelowJackpot = SLOTS_DATA.slice(6, 9);
  // More slots for slots section
  const moreSlots = SLOTS_DATA.slice(9, 12);

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      {/* 1. Top App Download Banner matching Screenshot 1 */}
      <TopDownloadBanner />

      {/* 2. Main Header matching Screenshot 1 & 2 */}
      <Header isHome={true} />

      <main className="max-w-lg mx-auto px-3 py-2.5 space-y-3">
        {/* 3. Announcement Marquee Bar */}
        {branding.announcementActive !== false && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#082935] border border-[#0F4758] rounded-full text-xs text-amber-300 overflow-hidden shadow-xs">
            <Volume2 className="w-4 h-4 text-orange-400 shrink-0 animate-bounce" />
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div
                className="inline-block animate-ck-marquee font-medium"
                style={{ animationDuration: `${branding.announcementSpeedSec || 20}s` }}
              >
                {branding.announcementText}
              </div>
            </div>
          </div>
        )}

        {/* 4. Hero Promotional Banner Carousel (Changes every 5s automatically or by clicking) */}
        {currentBanner && (
          <div
            onClick={() => navigate((currentBanner.linkRoute as any) || 'invite')}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${
              currentBanner.bgGradient || 'from-[#200B1A] via-[#100720] to-[#08182B]'
            } border border-[#2B1B38] shadow-xl cursor-pointer group select-none min-h-[150px] transition-all`}
          >
            {/* Decorative glowing ambient spots */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-600/25 rounded-full blur-2xl pointer-events-none" />

            {/* Manual Navigation Arrows (< and >) */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={handlePrevBanner}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-xs"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 backdrop-blur-xs"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="relative z-10 p-4 min-h-[148px] flex flex-col justify-between">
              {/* Header Lockup in Banner */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-2xl font-black text-[#22C55E] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {branding.siteName ? `${branding.siteName} ${branding.siteNameMiddle} ${branding.siteNameSuffix}`.trim() : 'Wingo X 3'}
                    </span>
                    {currentBanner.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase shadow-xs ${
                          currentBanner.badgeBg || 'bg-amber-400 text-slate-950'
                        }`}
                      >
                        {currentBanner.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-amber-400 drop-shadow-md mt-1 leading-snug">
                    {currentBanner.title}
                  </h2>
                  <div className="text-xl sm:text-2xl font-black text-[#EF4444] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-tight">
                    {currentBanner.highlightText}
                  </div>
                  {currentBanner.tagline && (
                    <p className="text-[11px] font-bold text-yellow-300 drop-shadow-xs mt-0.5">
                      {currentBanner.tagline}
                    </p>
                  )}
                </div>

                {/* Banner Promo Graphic / Model / Custom Image */}
                {currentBanner.imageUrl && (
                  <div className="w-24 h-28 relative shrink-0 -mt-2 -mr-1">
                    <img
                      src={currentBanner.imageUrl}
                      alt={currentBanner.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-xl border border-purple-500/40 shadow-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
              </div>

              {/* Pagination Dots supporting unlimited banners */}
              {activeBanners.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2 overflow-x-auto py-0.5 no-scrollbar max-w-[260px] mx-auto">
                  {activeBanners.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        carouselIndex === idx ? 'bg-amber-400 w-4' : 'bg-slate-500/60 w-1.5 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 5-Second Auto Progress Bar (Resets on every slide) */}
            {branding.bannerAutoPlay && activeBanners.length > 1 && !isPaused && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40 overflow-hidden">
                <div
                  key={`progress-${carouselIndex}`}
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse"
                  style={{
                    animation: `marqueeProgress ${intervalSeconds}s linear`,
                    width: '100%',
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 5. Deposit & Withdraw Action Buttons matching Screenshot 1 */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Deposit Button */}
          <button
            onClick={() => navigate('deposit')}
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#09323F] hover:bg-[#0E3D4C] border border-[#144859] shadow-md active:scale-98 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#FACC15] tracking-wide">
              Deposit
            </span>
          </button>

          {/* Withdraw Button */}
          <button
            onClick={() => navigate('withdrawal')}
            className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#09323F] hover:bg-[#0E3D4C] border border-[#144859] shadow-md active:scale-98 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-[#FACC15] tracking-wide">
              Withdraw
            </span>
          </button>
        </div>

        {/* 6. Category Tabs matching Screenshot 1 (HOT GAMES, FAVORITES, SLOTS) */}
        <div className="grid grid-cols-3 gap-2">
          {/* HOT GAMES TAB */}
          <button
            onClick={() => setActiveTab('hot')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-black transition-all ${
              activeTab === 'hot'
                ? 'bg-[#0A3645] text-[#2DD4BF] border border-[#1A5C70] shadow-sm'
                : 'bg-[#082833] text-slate-300 border border-[#0F3947] hover:bg-[#0C3544]'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="truncate">HOT GAMES</span>
          </button>

          {/* FAVORITES TAB */}
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-black transition-all ${
              activeTab === 'favorites'
                ? 'bg-[#0A3645] text-[#2DD4BF] border border-[#1A5C70] shadow-sm'
                : 'bg-[#082833] text-slate-300 border border-[#0F3947] hover:bg-[#0C3544]'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">FAVORITES</span>
          </button>

          {/* SLOTS TAB */}
          <button
            onClick={() => navigate('slots')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl text-xs font-black transition-all ${
              activeTab === 'slots'
                ? 'bg-[#0A3645] text-[#2DD4BF] border border-[#1A5C70] shadow-sm'
                : 'bg-[#082833] text-slate-300 border border-[#0F3947] hover:bg-[#0C3544]'
            }`}
          >
            <Dices className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">SLOTS</span>
          </button>
        </div>

        {/* 7. HOT GAMES Section Header matching Screenshot 1 */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="text-base font-black text-[#2DD4BF] tracking-tight">
            {branding.hotGamesTitle || 'HOT GAMES'}
          </h3>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate('slots')}
              className="px-3 py-1 rounded-lg bg-[#0A323F] hover:bg-[#0E3C4B] border border-[#124555] text-xs font-bold text-slate-200 transition-colors"
            >
              See All
            </button>
            <button
              onClick={() => showToast('Scrolling games', 'info')}
              className="w-7 h-7 rounded-lg bg-[#0A323F] hover:bg-[#0E3C4B] border border-[#124555] text-slate-300 flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Scrolling games', 'info')}
              className="w-7 h-7 rounded-lg bg-[#0A323F] hover:bg-[#0E3C4B] border border-[#124555] text-slate-300 flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 8. 3-Column Game Grid Rows 1 & 2 matching Screenshot 1 & 2 */}
        <div className="grid grid-cols-3 gap-2.5">
          {hotGamesRow1And2.map((game) => {
            const isFav = favoriteIds.includes(game.id);

            return (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#071D25] border border-[#113E4E]/80 shadow-md cursor-pointer hover:border-amber-400/80 active:scale-96 transition-all"
              >
                {/* 3:4 Game Card Poster Container */}
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

                  {/* JL Badge on Top Left matching screenshot */}
                  {game.jlBadge && (
                    <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                      JL
                    </div>
                  )}

                  {/* Custom Top Badge like $BUY */}
                  {game.topBadge && (
                    <div className="absolute top-1.5 left-1.5 bg-purple-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                      {game.topBadge}
                    </div>
                  )}

                  {/* Top-Right Favorite White Heart Icon matching screenshot */}
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

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
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
          })}
        </div>

        {/* 9. Big Jackpot Odometer Banner matching Screenshot 2 */}
        <JackpotBanner />

        {/* 10. Games Below Jackpot Row 3 matching Screenshot 2 */}
        <div className="grid grid-cols-3 gap-2.5">
          {gamesBelowJackpot.map((game) => {
            const isFav = favoriteIds.includes(game.id);

            return (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#071D25] border border-[#113E4E]/80 shadow-md cursor-pointer hover:border-amber-400/80 active:scale-96 transition-all"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img
                    src={game.image}
                    alt={game.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {game.topBadge && (
                    <div className="absolute top-1.5 left-1.5 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                      {game.topBadge}
                    </div>
                  )}

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
          })}
        </div>

        {/* 11. SLOTS Section Header matching Screenshot 2 */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-base font-black text-[#2DD4BF] tracking-tight">
            SLOTS
          </h3>

          <button
            onClick={() => navigate('slots')}
            className="px-3 py-1 rounded-lg bg-[#0A323F] hover:bg-[#0E3C4B] border border-[#124555] text-xs font-bold text-amber-400 transition-colors flex items-center gap-0.5"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 4 More Slots */}
        <div className="grid grid-cols-3 gap-2.5">
          {moreSlots.map((game) => {
            const isFav = favoriteIds.includes(game.id);

            return (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#071D25] border border-[#113E4E]/80 shadow-md cursor-pointer hover:border-amber-400/80 active:scale-96 transition-all"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  <img
                    src={game.image}
                    alt={game.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {game.jlBadge && (
                    <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm z-10">
                      JL
                    </div>
                  )}

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
          })}
        </div>
      </main>

      {/* 12. Floating Social Quick Actions matching Screenshot 1 & 2 */}
      <FloatingSocialBar />

      {/* ================= INTERACTIVE DEMO GAME SIMULATOR MODAL ================= */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0C323F] to-[#071920] border-2 border-amber-400 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
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

            <div className="p-4 space-y-4">
              {activeGame.type === 'slot' && (
                <div className="space-y-4">
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

              {activeGame.type === 'crash' && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#05141A] p-4 border border-rose-500/40 text-center relative overflow-hidden min-h-[160px] flex flex-col items-center justify-center">
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
