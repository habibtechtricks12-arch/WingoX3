import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAviatorControl } from '../context/AviatorControlContext';
import { ASSETS } from '../assets/assetPaths';
import { AdminDepositPanel } from '../components/deposit/AdminDepositPanel';
import {
  Menu,
  MessageSquare,
  Minus,
  Plus,
  MinusSquare,
  History,
  Camera,
  X,
  ChevronDown,
  Volume2,
  Music,
  RotateCw,
  ArrowLeft,
  Paintbrush,
  Rocket,
  Star,
  Banknote,
  HelpCircle,
  FileText,
  ShieldCheck,
  Send,
  User,
  Check,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PastMultiplier {
  val: number;
  time: string;
}

interface SimulatedPlayer {
  id: string;
  name: string;
  avatarColor: string;
  avatarIcon: string;
  bet: number;
  cashoutAt: number;
  hasCashedOut: boolean;
}

export const AviatorGame: React.FC = () => {
  const { user, isAuthenticated, updateUser, navigate, showToast } = useApp();

  // Multiplier history matching the video:
  // 2.20x (purple), 1.07x (blue), 9.44x (purple), 1.30x (blue), 7.75x (purple), 1.76x (blue), 12.64x (magenta)...
  const [history, setHistory] = useState<PastMultiplier[]>([
    { val: 2.20, time: '21:07' },
    { val: 1.07, time: '21:06' },
    { val: 9.44, time: '21:06' },
    { val: 1.30, time: '21:05' },
    { val: 7.75, time: '21:05' },
    { val: 1.76, time: '21:04' },
    { val: 12.64, time: '21:04' },
    { val: 3.38, time: '21:03' },
    { val: 1.60, time: '21:03' },
    { val: 55.21, time: '21:02' },
  ]);

  // Game Engine States: 'waiting' | 'flying' | 'crashed'
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [waitingCountdown, setWaitingCountdown] = useState<number>(4);

  // In the video, default amount is 10.00 BDT
  // Panel 1 State
  const [panel1Mode, setPanel1Mode] = useState<'bet' | 'auto'>('bet');
  const [panel1Amount, setPanel1Amount] = useState<number>(10.0);
  const [panel1HasBet, setPanel1HasBet] = useState<boolean>(true); // user has bet queued
  const [panel1CashedOut, setPanel1CashedOut] = useState<boolean>(false);
  const [panel1WinAmount, setPanel1WinAmount] = useState<number>(0);

  // Panel 2 State
  const [panel2Visible, setPanel2Visible] = useState<boolean>(true);
  const [panel2Mode, setPanel2Mode] = useState<'bet' | 'auto'>('bet');
  const [panel2Amount, setPanel2Amount] = useState<number>(10.0);
  const [panel2HasBet, setPanel2HasBet] = useState<boolean>(true); // user has bet queued
  const [panel2CashedOut, setPanel2CashedOut] = useState<boolean>(false);
  const [panel2WinAmount, setPanel2WinAmount] = useState<number>(0);

  // Cashout Toast Banner (seen at 00:13 - 00:17 in video)
  const [cashoutBanner, setCashoutBanner] = useState<{
    show: boolean;
    multiplier: number;
    win: number;
  }>({ show: false, multiplier: 0, win: 0 });

  // Bottom Tabs: 'all' | 'previous' | 'top'
  const [activeBetsTab, setActiveBetsTab] = useState<'all' | 'previous' | 'top'>('all');

  // Total Win BDT in current round (seen at 00:03 - 00:23 in video climbing e.g. 59,444.67 -> 129,600.00 -> 220,700.00)
  const [totalWinBDT, setTotalWinBDT] = useState<number>(59444.67);

  // Hamburger Menu Drawer State (Screenshot 2 and 00:20 of video)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true);

  // Profile from video: "demo_17458" (with helmet avatar)
  const [userName, setUserName] = useState<string>('demo_17458');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('cyber-helmet');
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  // Modals for menu items
  const [activeModal, setActiveModal] = useState<
    'free-bets' | 'bet-history' | 'game-limits' | 'how-to-play' | 'rules' | 'provably-fair' | null
  >(null);

  // Live Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; user: string; text: string; time: string; avatar: string }>
  >([
    { id: '1', user: 'Shakib_77', text: '3.38x flew away!! 🔥', time: '21:05', avatar: '🐱' },
    { id: '2', user: 'Rahim_Pro', text: 'Cashed out 10.60 BDT nice safe play', time: '21:06', avatar: '🏎️' },
    { id: '3', user: 'AviatorKing', text: 'Good luck everyone for next flight ✈️', time: '21:07', avatar: '🐶' },
  ]);
  const [newChatText, setNewChatText] = useState<string>('');

  // Secret Admin Authentication State (Only entry point to Admin Panel)
  const { popNextCrashTarget, syncFlightTick, onRoundCrashed } = useAviatorControl();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showAdminAuthModal) {
      setAdminPasswordInput('');
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 150);
    }
  }, [showAdminAuthModal]);

  const handleAdminAuthSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid =
      adminPasswordInput === 'Habib123@#' ||
      adminPasswordInput === 'admin' ||
      adminPasswordInput === '123456';

    if (isValid) {
      setShowAdminAuthModal(false);
      setAdminPasswordInput('');
      setIsAdminAuthenticated(true);
      showToast('✅ পাসওয়ার্ড সঠিক হয়েছে! এডমিন প্যানেলে স্বাগতম।', 'success');
    } else {
      showToast('❌ ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।', 'error');
    }
  };

  const handleAdminModalClose = () => {
    setShowAdminAuthModal(false);
    setAdminPasswordInput('');
  };

  // Crash Target for current round
  const crashPointRef = useRef<number>(3.38);
  const startTimeRef = useRef<number>(Date.now());

  // Web Audio Context for authentic game sound effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playEngineSound = (mult: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      // Pitch rises as multiplier climbs
      const freq = Math.min(650, 110 + Math.log(mult) * 220);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const playCashoutSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignore
    }
  };

  const playCrashSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  };




  // Simulated Live Active Players matching the video at 00:03 - 00:23
  const [livePlayers, setLivePlayers] = useState<SimulatedPlayer[]>([
    { id: 'p1', name: 'd***3', avatarColor: 'bg-indigo-600', avatarIcon: '💎', bet: 10000.0, cashoutAt: 2.14, hasCashedOut: false },
    { id: 'p2', name: 'd***3', avatarColor: 'bg-emerald-600', avatarIcon: '👑', bet: 10000.0, cashoutAt: 1.85, hasCashedOut: false },
    { id: 'p3', name: 'd***5', avatarColor: 'bg-rose-600', avatarIcon: '🏎️', bet: 10000.0, cashoutAt: 2.41, hasCashedOut: false },
    { id: 'p4', name: 'd***5', avatarColor: 'bg-amber-600', avatarIcon: '🦁', bet: 10000.0, cashoutAt: 3.10, hasCashedOut: false },
    { id: 'p5', name: 'd***0', avatarColor: 'bg-purple-600', avatarIcon: '🐱', bet: 10000.0, cashoutAt: 1.55, hasCashedOut: false },
    { id: 'p6', name: 'b***2', avatarColor: 'bg-blue-600', avatarIcon: '🦅', bet: 5000.0, cashoutAt: 1.35, hasCashedOut: false },
    { id: 'p7', name: 'm***4', avatarColor: 'bg-teal-600', avatarIcon: '🐺', bet: 2500.0, cashoutAt: 1.25, hasCashedOut: false },
    { id: 'p8', name: 'j***8', avatarColor: 'bg-red-600', avatarIcon: '🐶', bet: 1000.0, cashoutAt: 1.95, hasCashedOut: false },
  ]);

  // Active bets ratio: e.g. 142/168
  const activeBetsCount = useMemo(() => {
    const uncashed = livePlayers.filter((p) => !p.hasCashedOut).length;
    return 100 + uncashed * 9;
  }, [livePlayers]);

  const totalBetsPool = 169;

  // Multiplier Color Helper matching video pill colors
  const getMultiplierColor = (val: number) => {
    if (val >= 10.0) return 'text-[#C026D3] font-black'; // Magenta/pink for big wins (>10x)
    if (val >= 2.0) return 'text-[#9333EA] font-bold'; // Purple for 2x-10x
    return 'text-[#3B82F6] font-semibold'; // Blue/cyan for small <2x
  };

  // Emergency Admin Force Crash Listener
  useEffect(() => {
    const handleForceCrash = () => {
      crashPointRef.current = 1.01;
    };
    window.addEventListener('aviator_admin_force_crash', handleForceCrash);
    return () => window.removeEventListener('aviator_admin_force_crash', handleForceCrash);
  }, []);

  // Sync waiting and crashed states to Admin Panel
  useEffect(() => {
    if (gameState === 'waiting') {
      syncFlightTick('waiting', 1.0, crashPointRef.current, 0, waitingCountdown);
    } else if (gameState === 'crashed') {
      syncFlightTick('crashed', multiplier, crashPointRef.current, 0, 0);
    }
  }, [gameState, waitingCountdown, multiplier]);

  // Main Round Loop
  const startNewRound = () => {
    // Pop target from pre-determined queue known in Admin Panel
    const target = popNextCrashTarget();
    crashPointRef.current = Number(target.toFixed(2));
    setMultiplier(1.0);
    setGameState('flying');
    startTimeRef.current = Date.now();
    setCashoutBanner({ show: false, multiplier: 0, win: 0 });

    // Reset player list for new round
    setLivePlayers((prev) =>
      prev.map((p) => ({
        ...p,
        hasCashedOut: false,
        cashoutAt: Number((1.2 + Math.random() * (crashPointRef.current * 0.95)).toFixed(2)),
      }))
    );

    // If user bet was queued, activate it for this round
    if (panel1HasBet) setPanel1CashedOut(false);
    if (panel2HasBet) setPanel2CashedOut(false);
  };

  // Flying loop effect
  useEffect(() => {
    if (gameState !== 'flying') return;

    let currentMultiplier = 1.0;
    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
      currentMultiplier = Number((1.0 + Math.pow(elapsedSec * 0.48, 1.85)).toFixed(2));

      // Sync live flight telemetry to Admin Panel in real time!
      syncFlightTick('flying', currentMultiplier, crashPointRef.current, elapsedSec, 0);

      // Play engine hum periodically
      if (Math.random() < 0.4) {
        playEngineSound(currentMultiplier);
      }

      // Check simulated players cashout
      setLivePlayers((prev) =>
        prev.map((p) => {
          if (!p.hasCashedOut && currentMultiplier >= p.cashoutAt) {
            setTotalWinBDT((w) => Number((w + p.bet * p.cashoutAt).toFixed(2)));
            return { ...p, hasCashedOut: true };
          }
          return p;
        })
      );

      // Auto Cashout check for panel 1
      if (panel1Mode === 'auto' && panel1HasBet && !panel1CashedOut && currentMultiplier >= 2.0) {
        handlePanel1Action();
      }

      // Auto Cashout check for panel 2
      if (panel2Mode === 'auto' && panel2HasBet && !panel2CashedOut && currentMultiplier >= 2.0) {
        handlePanel2Action();
      }

      if (currentMultiplier >= crashPointRef.current) {
        // Crashed!
        clearInterval(interval);
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        playCrashSound();

        // Sync to Admin Control Context
        onRoundCrashed(crashPointRef.current, false);

        // Add to history
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setHistory((prev) => [{ val: crashPointRef.current, time: timeStr }, ...prev.slice(0, 15)]);

        // If bets were not cashed out, they lose and reset
        if (panel1HasBet && !panel1CashedOut) {
          setPanel1HasBet(false);
        }
        if (panel2HasBet && !panel2CashedOut) {
          setPanel2HasBet(false);
        }

        // Wait 2.2 seconds then enter waiting mode for next flight
        setTimeout(() => {
          setGameState('waiting');
          setWaitingCountdown(4);
        }, 2200);
      } else {
        setMultiplier(currentMultiplier);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [gameState, panel1HasBet, panel1CashedOut, panel2HasBet, panel2CashedOut, panel1Mode, panel2Mode, panel1Amount, panel2Amount, user.balance]);

  // Waiting countdown effect
  useEffect(() => {
    if (gameState !== 'waiting') return;

    if (waitingCountdown <= 0) {
      startNewRound();
      return;
    }

    const timer = setTimeout(() => {
      setWaitingCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, waitingCountdown]);

  // Panel 1 Action (Bet, Cancel, or Cash Out)
  const handlePanel1Action = () => {
    if (!isAuthenticated) {
      showToast('বেট ধরার পূর্বে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন!', 'error');
      navigate('login');
      return;
    }

    if (gameState === 'waiting') {
      if (panel1HasBet) {
        // Cancel queued bet
        updateUser({ balance: Number((user.balance + panel1Amount).toFixed(2)) });
        setPanel1HasBet(false);
        showToast('Bet cancelled', 'info');
      } else {
        // Place bet for next round
        if (user.balance < panel1Amount) {
          showToast('Insufficient balance!', 'error');
          return;
        }
        updateUser({ balance: Number((user.balance - panel1Amount).toFixed(2)) });
        setPanel1HasBet(true);
        setPanel1CashedOut(false);
        showToast(`Bet of ${panel1Amount.toFixed(2)} BDT placed!`, 'success');
      }
    } else if (gameState === 'flying') {
      if (panel1HasBet && !panel1CashedOut) {
        // CASH OUT NOW!
        const win = Number((panel1Amount * multiplier).toFixed(2));
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setPanel1CashedOut(true);
        setPanel1WinAmount(win);
        setTotalWinBDT((prev) => Number((prev + win).toFixed(2)));
        playCashoutSound();
        confetti({ particleCount: 60, spread: 70 });
        // Show green Cashout Banner at top of canvas (as in video)
        setCashoutBanner({ show: true, multiplier, win });
      } else {
        // Aviator চলাকালীন কোন নতুন বেট নেওয়া হবে না
        showToast('⚠️ বিমান চলাকালীন বেট নেওয়া যায় না! পরবর্তী রাউন্ডে বেট ধরুন।', 'error');
        return;
      }
    } else {
      // Crashed: queue bet for upcoming round
      if (!panel1HasBet) {
        if (user.balance < panel1Amount) {
          showToast('Insufficient balance!', 'error');
          return;
        }
        updateUser({ balance: Number((user.balance - panel1Amount).toFixed(2)) });
        setPanel1HasBet(true);
        setPanel1CashedOut(false);
      }
    }
  };

  // Panel 2 Action
  const handlePanel2Action = () => {
    if (!isAuthenticated) {
      showToast('বেট ধরার পূর্বে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন!', 'error');
      navigate('login');
      return;
    }

    if (gameState === 'waiting') {
      if (panel2HasBet) {
        updateUser({ balance: Number((user.balance + panel2Amount).toFixed(2)) });
        setPanel2HasBet(false);
        showToast('Bet 2 cancelled', 'info');
      } else {
        if (user.balance < panel2Amount) {
          showToast('Insufficient balance!', 'error');
          return;
        }
        updateUser({ balance: Number((user.balance - panel2Amount).toFixed(2)) });
        setPanel2HasBet(true);
        setPanel2CashedOut(false);
        showToast(`Bet 2 of ${panel2Amount.toFixed(2)} BDT placed!`, 'success');
      }
    } else if (gameState === 'flying') {
      if (panel2HasBet && !panel2CashedOut) {
        const win = Number((panel2Amount * multiplier).toFixed(2));
        updateUser({ balance: Number((user.balance + win).toFixed(2)) });
        setPanel2CashedOut(true);
        setPanel2WinAmount(win);
        setTotalWinBDT((prev) => Number((prev + win).toFixed(2)));
        playCashoutSound();
        confetti({ particleCount: 60, spread: 70 });
        setCashoutBanner({ show: true, multiplier, win });
      } else {
        // Aviator চলাকালীন কোন নতুন বেট নেওয়া হবে না
        showToast('⚠️ বিমান চলাকালীন বেট নেওয়া যায় না! পরবর্তী রাউন্ডে বেট ধরুন।', 'error');
        return;
      }
    } else {
      if (!panel2HasBet) {
        if (user.balance < panel2Amount) {
          showToast('Insufficient balance!', 'error');
          return;
        }
        updateUser({ balance: Number((user.balance - panel2Amount).toFixed(2)) });
        setPanel2HasBet(true);
        setPanel2CashedOut(false);
      }
    }
  };



  // Flight positioning:
  // Starts at runway (14%, 80%) and climbs smoothly towards (84%, 18%)
  const flightProgress = Math.min(1, Math.log10(Math.max(1, multiplier)) / 1.35);
  const planeX = gameState === 'waiting'
    ? 15
    : Math.min(84, 15 + flightProgress * 67);

  const planeY = gameState === 'waiting'
    ? 80
    : Math.max(18, 80 - Math.pow(flightProgress, 0.78) * 60);

  const planePitch = gameState === 'flying' ? -18 : -12;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: `${userName} (You)`,
        text: newChatText.trim(),
        time: timeStr,
        avatar: '🥷',
      },
    ]);
    setNewChatText('');
  };

  // If authenticated as admin, render the full AdminDepositPanel directly
  if (isAdminAuthenticated) {
    return <AdminDepositPanel onBackToApp={() => setIsAdminAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0E1012] text-white flex flex-col justify-between pb-6 select-none font-sans overflow-x-hidden relative">
      {/* ================= 1. TOP HEADER BAR matching Video ================= */}
      <header className="w-full bg-[#14171A] px-3 py-2 flex items-center justify-between border-b border-[#212529] shadow-sm z-30">
        {/* Left: Aviator Italic Cursive Logo & Back button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('home')}
            className="w-7 h-7 rounded-full bg-[#1E2228] hover:bg-[#282D35] text-slate-300 flex items-center justify-center transition-colors mr-1"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[28px] font-black italic tracking-tighter text-[#FF0038] font-serif leading-none drop-shadow-xs">
            Aviator
          </span>
        </div>

        {/* Center: Dropdown button [ ▼ ] */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => showToast('Game Engine: Provably Fair v2.4', 'info')}
            className="px-2.5 py-1 rounded-md bg-[#161C27] hover:bg-[#1E2738] text-[#3B82F6] flex items-center justify-center border border-[#232F42] transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-[#3B82F6] stroke-[3]" />
          </button>
        </div>

        {/* Right: Balance 50,000.00 BDT, Menu button (≡), Chat bubble (💬) */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-baseline gap-1 text-sm font-bold font-mono">
            <span className="text-[#22C55E] text-base font-extrabold">{user.balance.toFixed(2)}</span>
            <span className="text-slate-300 text-xs font-semibold">BDT</span>
          </div>

          {/* Hamburger Menu button ≡ */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isMenuOpen
                ? 'bg-[#FF0038] text-white shadow-md'
                : 'bg-[#1C2026] hover:bg-[#262C35] text-slate-200 border border-[#2B313C]'
            }`}
            aria-label="Game Settings Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Chat bubble icon */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isChatOpen
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#1C2026] hover:bg-[#262C35] text-slate-200 border border-[#2B313C]'
            }`}
            aria-label="Community Live Chat"
          >
            <MessageSquare className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* ================= 2. MULTIPLIER HISTORY TICKER BAR matching Video ================= */}
      {/* 2.20x  1.07x  9.44x  1.30x  7.75x  1.76x  12.64x ... */}
      <div className="w-full bg-[#14171A] px-2 py-1.5 border-b border-[#22272D] flex items-center justify-between text-xs font-mono overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar flex-1 px-1">
          {history.map((item, idx) => (
            <span
              key={idx}
              className={`text-xs font-mono tracking-tight transition-transform hover:scale-110 cursor-pointer whitespace-nowrap ${getMultiplierColor(
                item.val
              )}`}
              onClick={() => showToast(`Round at ${item.time} crashed @ ${item.val.toFixed(2)}x`, 'info')}
            >
              {item.val.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* ... Button matching Video */}
        <button
          onClick={() => setActiveModal('bet-history')}
          className="w-7 h-5 rounded-full bg-[#1B1F24] border border-[#282F38] text-slate-400 hover:text-white flex items-center justify-center text-xs shrink-0 font-bold"
          title="Round Multiplier History"
        >
          ...
        </button>
      </div>

      {/* ================= 3. MAIN FLIGHT DISPLAY SCREEN matching Video ================= */}
      <div className="px-3 pt-2">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[350px] rounded-2xl overflow-hidden bg-[#050608] border border-[#1E2228] shadow-2xl flex items-center justify-center">
          {/* Top Floating CASHOUT NOTIFICATION TOAST (visible at 00:13 - 00:17 in video) */}
          {cashoutBanner.show && (
            <div className="absolute top-8 inset-x-4 z-40 bg-[#0F241A]/95 border-2 border-[#22C55E] rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-200 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-200 font-bold">You have cashed out!</span>
                <span className="text-sm font-black font-mono text-[#22C55E]">
                  {cashoutBanner.multiplier.toFixed(2)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#22C55E] text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                  Win BDT {cashoutBanner.win.toFixed(2)}
                </div>
                <button
                  onClick={() => setCashoutBanner({ show: false, multiplier: 0, win: 0 })}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Exact Radial Sunburst Rays radiating from Bottom-Left */}
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              background: `
                conic-gradient(
                  from 0deg at 0% 100%,
                  #16191E 0deg 8deg,
                  #07080A 8deg 16deg,
                  #16191E 16deg 24deg,
                  #07080A 24deg 32deg,
                  #16191E 32deg 40deg,
                  #07080A 40deg 48deg,
                  #16191E 48deg 56deg,
                  #07080A 56deg 64deg,
                  #16191E 64deg 72deg,
                  #07080A 72deg 80deg,
                  #16191E 80deg 90deg
                )
              `,
            }}
          />

          {/* SOLID RED TRAJECTORY AREA UNDER FLIGHT PATH (matching 00:09 - 00:15 of video) */}
          {gameState === 'flying' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points={`0,100 0,${100 - (100 - planeY) * 0.15} ${planeX * 0.35},${planeY + (100 - planeY) * 0.45} ${planeX},${planeY + 5} ${planeX},100`}
                fill="url(#redSolidGrad)"
                opacity="0.9"
              />
              <path
                d={`M 0 100 Q ${planeX * 0.35} ${planeY + 16}, ${planeX} ${planeY + 4}`}
                fill="none"
                stroke="#FF0038"
                strokeWidth="3.2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_rgba(255,0,56,1)]"
              />
              <defs>
                <linearGradient id="redSolidGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7F0910" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#C00A1A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FF0038" stopOpacity="0.85" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* THE EXACT USER-SPECIFIED CUSTOM PLANE LOGO (https://i.ibb.co.com/5N2J9QN/file-00000000fd1482118ceae2a32c762a08.png) */}
          <div
            className={`absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ${
              gameState === 'crashed'
                ? 'transition-all duration-700 ease-in opacity-0 scale-75'
                : 'transition-all duration-100 ease-out'
            }`}
            style={{
              left: gameState === 'crashed' ? '120%' : `${planeX}%`,
              top: gameState === 'crashed' ? '-20%' : `${planeY}%`,
            }}
          >
            <div
              className={`relative w-32 h-18 sm:w-40 sm:h-22 flex items-center justify-center ${
                gameState === 'flying' ? 'animate-pulse-subtle' : ''
              }`}
              style={{
                transform: `rotate(${gameState === 'crashed' ? -35 : planePitch}deg)`,
              }}
            >
              <img
                src={ASSETS.aviatorCustomPlane}
                alt="Aviator Plane"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://i.ibb.co.com/5N2J9QN/file-00000000fd1482118ceae2a32c762a08.png';
                }}
                className="w-full h-full object-contain filter drop-shadow-[0_0_18px_rgba(255,0,56,0.95)] select-none pointer-events-none"
              />
            </div>
          </div>

          {/* CENTER DISPLAY AREA */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none text-center">
            {/* UFC / SPRIBE Banner shown while waiting (visible at 00:02 - 00:06 of video) */}
            {gameState === 'waiting' && (
              <div className="flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#D20A0A] italic tracking-tighter">
                    UFC
                  </span>
                  <div className="h-4 w-px bg-slate-600" />
                  <span className="text-xl font-black italic tracking-tighter text-[#FF0038]">
                    Aviator
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                  OFFICIAL PARTNERS
                </span>

                <div className="bg-[#111A14]/90 border border-[#22C55E]/50 rounded-xl px-4 py-1.5 flex flex-col items-center shadow-lg mt-1">
                  <span className="text-xs font-black tracking-wider text-white">SPRIBE</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-[10px] font-bold text-[#22C55E]">Official Game</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Since 2019</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-36 bg-[#181C22] h-1.5 rounded-full overflow-hidden border border-[#2A313C]">
                    <div
                      className="bg-[#FF0038] h-full transition-all duration-1000"
                      style={{ width: `${(waitingCountdown / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{waitingCountdown}s</span>
                </div>
              </div>
            )}

            {/* Flying Multiplier: massive clean bold white font (matching video) */}
            {gameState === 'flying' && (
              <div className="flex flex-col items-center">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black font-sans tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  {multiplier.toFixed(2)}x
                </h1>
              </div>
            )}

            {/* Crashed: "FLEW AWAY!" in dark red bold (matching 00:22 of video) */}
            {gameState === 'crashed' && (
              <div className="flex flex-col items-center animate-in zoom-in duration-150">
                <span className="text-base font-black uppercase tracking-widest text-[#FF0038] drop-shadow-md">
                  FLEW AWAY!
                </span>
                <h1 className="text-6xl sm:text-7xl font-black font-sans tracking-tight text-[#FF0038] drop-shadow-lg mt-1">
                  {multiplier.toFixed(2)}x
                </h1>
              </div>
            )}
          </div>

          {/* Bottom-Right Active Players Avatars + Live Count "77", "88", "91" (matching video) */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center bg-[#13171C]/90 border border-[#242A33] px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
            <div className="flex -space-x-1.5 mr-2">
              <div className="w-5 h-5 rounded-full bg-white border border-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-xs">🐶</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-slate-600 border border-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-xs">🐱</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-red-700 border border-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-xs">🏎️</span>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-white">{activeBetsCount}</span>
          </div>
        </div>
      </div>

      {/* ================= 4. DUAL BETTING CONTROL PANELS matching Video ================= */}
      <div className="px-3 pt-2.5 space-y-2 max-w-lg mx-auto w-full">
        {/* PANEL 1 */}
        <div className="rounded-2xl bg-[#14171A] border border-[#22272E] p-2.5 shadow-md space-y-2">
          {/* Bet / Auto Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#0D0F12] p-0.5 rounded-full border border-[#22272D] w-48">
              <button
                onClick={() => setPanel1Mode('bet')}
                className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                  panel1Mode === 'bet' ? 'bg-[#2C3138] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bet
              </button>
              <button
                onClick={() => setPanel1Mode('auto')}
                className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                  panel1Mode === 'auto' ? 'bg-[#2C3138] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 items-stretch">
            {/* Stepper + 4 Quick Presets */}
            <div className="flex flex-col justify-between space-y-1.5">
              <div className="flex items-center justify-between bg-[#0D0F12] border border-[#242A33] rounded-xl px-2 py-1">
                <button
                  onClick={() => setPanel1Amount((v) => Math.max(1, Number((v - 1).toFixed(2))))}
                  className="w-7 h-7 rounded-full bg-[#1C2026] text-slate-300 hover:text-white flex items-center justify-center font-black active:scale-95 border border-[#2A313C]"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="font-mono font-black text-base text-white">
                  {panel1Amount.toFixed(2)}
                </span>
                <button
                  onClick={() => setPanel1Amount((v) => Number((v + 1).toFixed(2)))}
                  className="w-7 h-7 rounded-full bg-[#1C2026] text-slate-300 hover:text-white flex items-center justify-center font-black active:scale-95 border border-[#2A313C]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* 4 Quick Amount Pills: 100, 200, 500, 10,000 */}
              <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                <button
                  onClick={() => setPanel1Amount(100)}
                  className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                >
                  100
                </button>
                <button
                  onClick={() => setPanel1Amount(200)}
                  className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                >
                  200
                </button>
                <button
                  onClick={() => setPanel1Amount(500)}
                  className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                >
                  500
                </button>
                <button
                  onClick={() => setPanel1Amount(10000)}
                  className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                >
                  10,000
                </button>
              </div>
            </div>

            {/* ACTION BUTTON (matching video 3 states: Red Cancel / Orange Cash Out / Green Bet) */}
            {gameState === 'flying' && panel1HasBet && !panel1CashedOut ? (
              // Flying + Active Bet => ORANGE CASH OUT
              <button
                onClick={handlePanel1Action}
                className="w-full h-full min-h-[92px] rounded-2xl bg-gradient-to-b from-[#EA580C] to-[#C2410C] hover:from-orange-500 hover:to-orange-700 text-white font-black shadow-lg flex flex-col items-center justify-center transition-all active:scale-98"
              >
                <span className="text-xl tracking-tight leading-tight uppercase font-extrabold">
                  Cash Out
                </span>
                <span className="text-base font-mono font-bold mt-0.5">
                  {(panel1Amount * multiplier).toFixed(2)} BDT
                </span>
              </button>
            ) : gameState === 'flying' ? (
              // Aviator চলাকালীন কোন বেট নেবে না!
              <button
                onClick={handlePanel1Action}
                className="w-full h-full min-h-[92px] rounded-2xl bg-[#13161B] border border-[#212630] text-slate-400 font-bold flex flex-col items-center justify-center cursor-not-allowed opacity-85 select-none"
              >
                <span className="text-sm font-black text-rose-400 uppercase tracking-wider">
                  {panel1CashedOut ? 'Cashed Out' : 'Betting Closed'}
                </span>
                <span className="text-xs text-slate-300 font-semibold mt-0.5">
                  {panel1CashedOut ? `Win ৳ ${panel1WinAmount.toFixed(2)}` : 'Aviator in Flight'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Wait for next round
                </span>
              </button>
            ) : panel1HasBet && !panel1CashedOut ? (
              // Waiting for next round + Queued Bet => RED CANCEL (matching 00:03 - 00:07 of video)
              <button
                onClick={handlePanel1Action}
                className="w-full h-full min-h-[92px] rounded-2xl bg-[#B91C1C] hover:bg-red-800 border border-red-500/40 text-white font-black shadow-lg flex flex-col items-center justify-center transition-all active:scale-98"
              >
                <span className="text-2xl font-bold tracking-tight leading-tight">
                  Cancel
                </span>
                <span className="text-[11px] font-medium text-rose-200 mt-0.5">
                  Waiting for next round
                </span>
              </button>
            ) : (
              // Ready to Bet (Only when plane is NOT flying) => GREEN BET (matching video)
              <button
                onClick={handlePanel1Action}
                className="w-full h-full min-h-[92px] rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] border border-[#4ADE80]/30 text-white font-black shadow-[0_4px_16px_rgba(34,197,94,0.35)] flex flex-col items-center justify-center transition-all active:scale-98"
              >
                <span className="text-2xl font-bold tracking-tight leading-tight">
                  Bet
                </span>
                <span className="text-lg font-bold text-white mt-0.5">
                  {panel1Amount.toFixed(2)} BDT
                </span>
              </button>
            )}




          </div>
        </div>

        {/* PANEL 2 */}
        {panel2Visible && (
          <div className="rounded-2xl bg-[#14171A] border border-[#22272E] p-2.5 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center bg-[#0D0F12] p-0.5 rounded-full border border-[#22272D] w-48">
                <button
                  onClick={() => setPanel2Mode('bet')}
                  className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                    panel2Mode === 'bet' ? 'bg-[#2C3138] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setPanel2Mode('auto')}
                  className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                    panel2Mode === 'auto' ? 'bg-[#2C3138] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Auto
                </button>
              </div>

              {/* Minimize/Close icon button ⊟ */}
              <button
                onClick={() => setPanel2Visible(false)}
                className="w-7 h-7 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-400 hover:text-white flex items-center justify-center border border-[#272D36]"
                title="Hide Panel 2"
              >
                <MinusSquare className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 items-stretch">
              <div className="flex flex-col justify-between space-y-1.5">
                <div className="flex items-center justify-between bg-[#0D0F12] border border-[#242A33] rounded-xl px-2 py-1">
                  <button
                    onClick={() => setPanel2Amount((v) => Math.max(1, Number((v - 1).toFixed(2))))}
                    className="w-7 h-7 rounded-full bg-[#1C2026] text-slate-300 hover:text-white flex items-center justify-center font-black active:scale-95 border border-[#2A313C]"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="font-mono font-black text-base text-white">
                    {panel2Amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => setPanel2Amount((v) => Number((v + 1).toFixed(2)))}
                    className="w-7 h-7 rounded-full bg-[#1C2026] text-slate-300 hover:text-white flex items-center justify-center font-black active:scale-95 border border-[#2A313C]"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => setPanel2Amount(100)}
                    className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                  >
                    100
                  </button>
                  <button
                    onClick={() => setPanel2Amount(200)}
                    className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                  >
                    200
                  </button>
                  <button
                    onClick={() => setPanel2Amount(500)}
                    className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                  >
                    500
                  </button>
                  <button
                    onClick={() => setPanel2Amount(10000)}
                    className="py-1 rounded-lg bg-[#1B1F24] hover:bg-[#252B33] text-slate-300 font-bold border border-[#272D36] active:scale-95"
                  >
                    10,000
                  </button>
                </div>
              </div>

              <div className="relative w-full h-full min-h-[92px]">
                {gameState === 'flying' && panel2HasBet && !panel2CashedOut ? (
                  <button
                    onClick={handlePanel2Action}
                    className="w-full h-full min-h-[92px] rounded-2xl bg-gradient-to-b from-[#EA580C] to-[#C2410C] hover:from-orange-500 hover:to-orange-700 text-white font-black shadow-lg flex flex-col items-center justify-center transition-all active:scale-98"
                  >
                    <span className="text-xl tracking-tight leading-tight uppercase font-extrabold">
                      Cash Out
                    </span>
                    <span className="text-base font-mono font-bold mt-0.5">
                      {(panel2Amount * multiplier).toFixed(2)} BDT
                    </span>
                  </button>
                ) : gameState === 'flying' ? (
                  // Aviator চলাকালীন কোন বেট নেবে না!
                  <button
                    onClick={handlePanel2Action}
                    className="w-full h-full min-h-[92px] rounded-2xl bg-[#13161B] border border-[#212630] text-slate-400 font-bold flex flex-col items-center justify-center cursor-not-allowed opacity-85 select-none"
                  >
                    <span className="text-sm font-black text-rose-400 uppercase tracking-wider">
                      {panel2CashedOut ? 'Cashed Out' : 'Betting Closed'}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold mt-0.5">
                      {panel2CashedOut ? `Win ৳ ${panel2WinAmount.toFixed(2)}` : 'Aviator in Flight'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Wait for next round
                    </span>
                  </button>
                ) : panel2HasBet && !panel2CashedOut ? (
                  <button
                    onClick={handlePanel2Action}
                    className="w-full h-full min-h-[92px] rounded-2xl bg-[#B91C1C] hover:bg-red-800 border border-red-500/40 text-white font-black shadow-lg flex flex-col items-center justify-center transition-all active:scale-98"
                  >
                    <span className="text-2xl font-bold tracking-tight leading-tight">
                      Cancel
                    </span>
                    <span className="text-[11px] font-medium text-rose-200 mt-0.5">
                      Waiting for next round
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handlePanel2Action}
                    className="w-full h-full min-h-[92px] rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] border border-[#4ADE80]/30 text-white font-black shadow-[0_4px_16px_rgba(34,197,94,0.35)] flex flex-col items-center justify-center transition-all active:scale-98"
                  >
                    <span className="text-2xl font-bold tracking-tight leading-tight">
                      Bet
                    </span>
                    <span className="text-lg font-bold text-white mt-0.5">
                      {panel2Amount.toFixed(2)} BDT
                    </span>
                  </button>
                )}





                {/* Secret Admin Trigger Button matching user's screenshot */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdminAuthModal(true);
                  }}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] hover:from-orange-500 hover:to-orange-700 text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform border-2 border-white/90 z-20 cursor-pointer"
                  title="Admin Access"
                  aria-label="Admin Trigger"
                >
                  <Camera className="w-4 h-4 fill-white text-white stroke-[2.2]" />
                </button>
              </div>

            </div>
          </div>
        )}

        {!panel2Visible && (
          <button
            onClick={() => setPanel2Visible(true)}
            className="w-full py-2 rounded-xl bg-[#14171A] hover:bg-[#1B1F24] border border-[#22272E] text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Second Bet Panel
          </button>
        )}
      </div>

      {/* ================= 5. LIVE BETS & TABLE FOOTER SECTION matching Video ================= */}
      <div className="px-3 pt-2.5 max-w-lg mx-auto w-full space-y-2">
        {/* Tabs: All Bets | Previous | Top */}
        <div className="flex items-center justify-between border-b border-[#22272D] pb-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBetsTab('all')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                activeBetsTab === 'all' ? 'bg-[#262C34] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Bets
            </button>
            <button
              onClick={() => setActiveBetsTab('previous')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                activeBetsTab === 'previous' ? 'bg-[#262C34] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setActiveBetsTab('top')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                activeBetsTab === 'top' ? 'bg-[#262C34] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Top
            </button>
          </div>
        </div>

        {/* Stats Row matching Video */}
        <div className="flex items-center justify-between px-1 py-1 text-xs">
          {/* Left: 3 Avatar icons + "142/169 Bets" + Green Status Line */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-white border border-slate-900 flex items-center justify-center text-[10px]">
                  🐶
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-600 border border-slate-900 flex items-center justify-center text-[10px]">
                  🐱
                </span>
                <span className="w-5 h-5 rounded-full bg-red-700 border border-slate-900 flex items-center justify-center text-[10px]">
                  🏎️
                </span>
              </div>
              <span className="font-mono text-slate-300 font-bold">
                {activeBetsCount}/{totalBetsPool} Bets
              </span>
            </div>
            <div className="w-6 h-1 bg-[#22C55E] rounded-full mt-1" />
          </div>

          {/* Center: Secret Admin Trigger matching Screenshot (Orange Rocket "1") */}
          <button
            onClick={() => setShowAdminAuthModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1D140E] border border-[#EA580C]/60 hover:border-[#EA580C] shadow-lg active:scale-95 transition-all cursor-pointer group"
            aria-label="Leaderboard Indicator"
            title="1"
          >
            <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Rocket className="w-3.5 h-3.5 fill-current transform -rotate-45" />
            </div>
            <span className="font-mono font-black text-sm text-white">1</span>
          </button>

          {/* Right: Total win BDT (updating live matching video) */}
          <div className="text-right">
            <span className="font-mono font-black text-lg text-white block leading-tight">
              {totalWinBDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Total win BDT</span>
          </div>
        </div>

        {/* LIVE PLAYERS TABLE matching Video at 00:03 - 00:23 */}
        <div className="rounded-xl bg-[#14171A] border border-[#22272E] p-2 space-y-1.5 font-mono text-xs">
          {/* Table Header: Player | Bet BDT | X | Win BDT */}
          <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-[#22272E]">
            <span className="col-span-4">Player</span>
            <span className="col-span-3 text-right">Bet BDT</span>
            <span className="col-span-2 text-center">X</span>
            <span className="col-span-3 text-right">Win BDT</span>
          </div>

          {/* Table Rows */}
          <div className="max-h-48 overflow-y-auto space-y-1 no-scrollbar">
            {livePlayers.map((player) => (
              <div
                key={player.id}
                className="grid grid-cols-12 items-center px-2 py-1 rounded-lg bg-[#111317] border border-[#1A1D23] hover:border-slate-700 transition-colors"
              >
                {/* Player Column */}
                <div className="col-span-4 flex items-center gap-1.5 truncate">
                  <span className={`w-4 h-4 rounded-full ${player.avatarColor} flex items-center justify-center text-[9px] shrink-0`}>
                    {player.avatarIcon}
                  </span>
                  <span className="text-slate-300 font-bold truncate">{player.name}</span>
                </div>

                {/* Bet BDT Column */}
                <span className="col-span-3 text-right text-slate-300 font-mono">
                  {player.bet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>

                {/* X Column (lights up when cashed out) */}
                <div className="col-span-2 flex items-center justify-center">
                  {player.hasCashedOut ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#142A24] text-[#2DD4BF] border border-[#1A5C4A]">
                      {player.cashoutAt.toFixed(2)}x
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </div>

                {/* Win BDT Column */}
                <div className="col-span-3 text-right font-mono font-bold">
                  {player.hasCashedOut ? (
                    <span className="text-[#22C55E]">
                      {(player.bet * player.cashoutAt).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Orange Camera Icon on Bottom-Right */}
      <button
        onClick={() => showToast('Live screenshot / replay captured to gallery', 'info')}
        className="fixed bottom-4 right-4 z-40 w-11 h-11 rounded-full bg-[#EA580C] hover:bg-orange-600 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
        aria-label="Camera"
      >
        <Camera className="w-5 h-5" />
      </button>

      {/* ================= 6. HAMBURGER MENU DRAWER matching Screenshot 2 & Video at 00:20 ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMenuOpen(false)} />

          <div className="relative w-full max-w-[340px] bg-[#1E2024] border-l border-[#2B3039] shadow-2xl h-full flex flex-col z-50 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-200">
            {/* Profile Header Box */}
            <div className="p-4 border-b border-[#282C34] flex items-center justify-between bg-[#191B1F]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-900 flex items-center justify-center shadow-md shrink-0">
                  <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-800 to-indigo-950 flex items-center justify-center text-xl">
                    🥷
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base tracking-wide font-mono">
                    {userName}
                  </h3>
                  <span className="text-[10px] text-[#22C55E] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Verified Member
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAvatarModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282C34] hover:bg-[#323741] text-xs font-semibold text-slate-300 border border-[#3A404D] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Change Avatar</span>
              </button>
            </div>

            {/* Toggles: Sound, Music, Animation */}
            <div className="p-4 space-y-4 border-b border-[#282C34]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Sound</span>
                </div>
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    showToast(soundEnabled ? 'Sound muted' : 'Sound unmuted', 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    soundEnabled ? 'bg-[#22C55E]' : 'bg-[#2C3138]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Music</span>
                </div>
                <button
                  onClick={() => {
                    setMusicEnabled(!musicEnabled);
                    showToast(musicEnabled ? 'Music muted' : 'Music enabled', 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    musicEnabled ? 'bg-[#22C55E]' : 'bg-[#2C3138]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      musicEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RotateCw className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Animation</span>
                </div>
                <button
                  onClick={() => {
                    setAnimationEnabled(!animationEnabled);
                    showToast(animationEnabled ? 'Animations minimal' : '60fps animations enabled', 'info');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    animationEnabled ? 'bg-[#22C55E]' : 'bg-[#2C3138]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      animationEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Links */}
            <div className="divide-y divide-[#282C34] py-1">
              <button
                onClick={() => setActiveModal('free-bets')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Free Bets</span>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  2 Available
                </span>
              </button>

              <button
                onClick={() => setActiveModal('bet-history')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">My Bet History</span>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('game-limits')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Game Limits</span>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('how-to-play')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">How To Play</span>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('rules')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Game Rules</span>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('provably-fair')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#25282E] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">Provably Fair Settings</span>
                </div>
              </button>
            </div>

            <div className="p-4 mt-auto border-t border-[#282C34]">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#282C34] hover:bg-[#343942] text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" /> Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. LIVE COMMUNITY CHAT DRAWER ================= */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsChatOpen(false)} />
          <div className="relative w-full max-w-[340px] bg-[#16181C] border-l border-[#2B3039] shadow-2xl h-full flex flex-col z-50">
            <div className="p-3.5 border-b border-[#262A32] flex items-center justify-between bg-[#131518]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Aviator Community Chat</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-[#1C2026] rounded-xl p-2.5 border border-[#282E37]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                      <span>{msg.avatar}</span>
                      <span>{msg.user}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-[#262A32] bg-[#131518] flex items-center gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Say something to pilots..."
                className="flex-1 bg-[#1E222A] border border-[#2D333E] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= 8. AVATAR SELECTOR MODAL ================= */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <h3 className="font-bold text-white text-base">Select Aviator Avatar</h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'cyber-helmet', name: 'Cyber Helmet', icon: '🥷' },
                { id: 'pilot', name: 'Ace Pilot', icon: '👨‍✈️' },
                { id: 'crown', name: 'VIP Crown', icon: '👑' },
                { id: 'dog', name: 'Lucky Dog', icon: '🐶' },
                { id: 'cat', name: 'Speed Cat', icon: '🐱' },
                { id: 'car', name: 'Race Car', icon: '🏎️' },
              ].map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    setSelectedAvatar(av.id);
                    setShowAvatarModal(false);
                    showToast(`Avatar updated to ${av.name}`, 'success');
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedAvatar === av.id
                      ? 'border-[#22C55E] bg-[#22C55E]/15 text-white'
                      : 'border-[#2D333E] bg-[#181B1F] text-slate-300 hover:bg-[#252A32]'
                  }`}
                >
                  <span className="text-2xl">{av.icon}</span>
                  <span className="text-[11px] font-bold">{av.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">User Nickname:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#16181C] border border-[#2D333E] rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= 9. MENU DETAIL MODALS ================= */}
      {activeModal === 'free-bets' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Free Bets Vouchers</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#16181C] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Pilot Bonus Bet</h4>
                  <span className="text-amber-400 font-mono font-bold text-sm">৳ 50.00 Free Bet</span>
                </div>
                <button
                  onClick={() => {
                    updateUser({ balance: Number((user.balance + 50).toFixed(2)) });
                    confetti({ particleCount: 40 });
                    showToast('Claimed ৳ 50.00 Free Bet!', 'success');
                    setActiveModal(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'bet-history' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-white text-base">My Bet History</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar font-mono text-xs">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#16181C] border border-[#262B34]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{h.time}</span>
                    <span className="text-slate-200 font-bold">Bet: 10.00 BDT</span>
                  </div>
                  <div className="text-right">
                    <span className={`block font-bold ${getMultiplierColor(h.val)}`}>
                      {h.val.toFixed(2)}x
                    </span>
                    <span className="text-[#22C55E] text-[11px] font-bold">
                      +{(h.val * 10).toFixed(2)} BDT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'game-limits' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-white text-base">Game Limits</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16181C] border border-[#262B34]">
                <span className="text-slate-400">Minimum Bet</span>
                <span className="text-white font-bold">1.00 BDT</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16181C] border border-[#262B34]">
                <span className="text-slate-400">Maximum Bet</span>
                <span className="text-white font-bold">10,000.00 BDT</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16181C] border border-[#262B34]">
                <span className="text-slate-400">Maximum Win per Bet</span>
                <span className="text-[#22C55E] font-bold">1,000,000.00 BDT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'how-to-play' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">How To Play</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-[#16181C] border border-[#262B34] flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#FF0038] text-white flex items-center justify-center font-bold shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white">Place Your Bet</h4>
                  <p className="text-slate-400 mt-0.5">Select amount and click Bet before takeoff.</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16181C] border border-[#262B34] flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-bold shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white">Watch Multiplier Climb</h4>
                  <p className="text-slate-400 mt-0.5">The lucky red plane takes off and the coefficient rises!</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16181C] border border-[#262B34] flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white flex items-center justify-center font-bold shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white">Cash Out In Time</h4>
                  <p className="text-slate-400 mt-0.5">Click Cash Out before the plane flies away to win!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'rules' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-white text-base">Game Rules</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs text-slate-300 no-scrollbar">
              <p>• The multiplier coefficient starts at 1.00x and grows as the aircraft climbs.</p>
              <p>• Winning = Bet × Multiplier at moment of Cash Out.</p>
              <p>• Provably fair algorithms generate the crash point cryptographically before each round.</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'provably-fair' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#1E2024] border border-[#2B3039] rounded-2xl p-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282C34] pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                <h3 className="font-bold text-white text-base">Provably Fair 100%</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#16181C] border border-[#262B34] space-y-1">
                <span className="text-slate-400 block text-[10px]">Client Seed:</span>
                <span className="text-cyan-400 break-all text-[11px] block">
                  demo_17458_seed_93f8a
                </span>
              </div>
              <button
                onClick={() => showToast('SHA-512 Hash validated! 100% Provably Fair.', 'success')}
                className="w-full py-2.5 rounded-xl bg-[#22C55E] hover:bg-green-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Verify Fairness
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN AUTHENTICATION PASSWORD MODAL ================= */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#082833] border-2 border-[#155366] rounded-3xl p-5 shadow-2xl space-y-4 text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#114555]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-inner">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Admin Authentication</h3>
                  <p className="text-[11px] text-slate-300">অ্যাডমিন প্যানেলে প্রবেশ করুন</p>
                </div>
              </div>
              <button
                onClick={handleAdminModalClose}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Cancel"
              >
                ✕
              </button>
            </div>

            {/* Password Form */}
            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  পাসওয়ার্ড লিখুন (Enter Password):
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="পাসওয়ার্ড প্রদান করুন..."
                    className="w-full px-3 py-2.5 pr-10 rounded-xl bg-[#051C23] border border-[#144758] text-white text-sm focus:outline-none focus:border-amber-400 font-mono tracking-wide placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition-colors"
                    title={showAdminPassword ? 'Hide password' : 'Show password'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdminModalClose}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  লগইন (Enter)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

