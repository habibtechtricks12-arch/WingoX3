import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
  RotateCw,
  HelpCircle,
  X,
  Play,
  Sparkles,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Card Symbol Types
type CardSuit = 'spade' | 'heart' | 'diamond' | 'club';
type SymbolType = 'ace' | 'king' | 'queen' | 'jack' | CardSuit | 'wild' | 'scatter';

interface CardItem {
  id: string;
  type: SymbolType;
  suit?: CardSuit;
  isGolden: boolean;
  isWild: boolean;
  isScatter: boolean;
  isWinning?: boolean;
}

const BET_OPTIONS = [
  1000, 50, 5,
  500, 40, 3,
  200, 30, 2,
  100, 20, 1,
  80, 10, 0.5,
];

// Base payout multipliers for 3, 4, 5 matches
const PAYTABLE: Record<string, [number, number, number]> = {
  ace: [1.0, 2.0, 5.0],
  king: [0.8, 1.6, 4.0],
  queen: [0.6, 1.2, 3.0],
  jack: [0.4, 0.8, 2.0],
  spade: [0.2, 0.4, 1.0],
  heart: [0.2, 0.4, 1.0],
  diamond: [0.15, 0.3, 0.8],
  club: [0.15, 0.3, 0.8],
};

export const SuperAceGame: React.FC = () => {
  const { user, updateUser, navigate, goBack } = useApp();

  // Screens
  const [showSplash, setShowSplash] = useState(true);
  const [showPlayStart, setShowPlayStart] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Sound & Turbo
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTurbo, setIsTurbo] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  const [showBuyBonusModal, setShowBuyBonusModal] = useState(false);

  // Betting & Balance
  const [bet, setBet] = useState(2);
  const [showBetGrid, setShowBetGrid] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [lastTotalWin, setLastTotalWin] = useState(0);
  const [transactionId] = useState('24374-013580-00120049');

  // Multipliers & Combos
  const [comboLevel, setComboLevel] = useState(0); // 0=none, 1=x1, 2=x2, 3=x3, 4=x5 (or x2, x4, x6, x10 in free spin)
  const [comboAnnouncement, setComboAnnouncement] = useState<string | null>(null);

  // Free Spins State
  const [isFreeSpinMode, setIsFreeSpinMode] = useState(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState(0);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showFreeSpinEndModal, setShowFreeSpinEndModal] = useState(false);

  // Autoplay
  const [autoplayCount, setAutoplayCount] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [showAutoplayModal, setShowAutoplayModal] = useState(false);

  // Grid State: 5 reels x 4 rows
  const [grid, setGrid] = useState<CardItem[][]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [scatterCount, setScatterCount] = useState(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSynthSound = (type: 'spin' | 'stop' | 'win' | 'combo' | 'scatter' | 'free_start') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'spin') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'stop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.15, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.2);
        });
      } else if (type === 'combo') {
        [600, 750, 900, 1200].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      } else if (type === 'scatter') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'free_start') {
        [440, 554.37, 659.25, 880, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.25, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.4);
        });
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Helper to generate a random card
  const generateRandomCard = (colIndex: number): CardItem => {
    const symbolsPool: SymbolType[] = [
      'ace', 'ace',
      'king', 'king',
      'queen', 'queen',
      'jack', 'jack',
      'spade', 'spade',
      'heart', 'heart',
      'diamond', 'diamond',
      'club', 'club',
    ];

    // Low chance for Scatter (approx 5% per position)
    const isScatter = Math.random() < 0.045;
    if (isScatter) {
      return {
        id: Math.random().toString(36).substring(2, 9),
        type: 'scatter',
        isGolden: false,
        isWild: false,
        isScatter: true,
      };
    }

    // Normal symbol
    const pickedType = symbolsPool[Math.floor(Math.random() * symbolsPool.length)];
    // Golden card can only appear on reels 2, 3, 4 (0-indexed: 1, 2, 3)
    const isGolden = (colIndex >= 1 && colIndex <= 3) && Math.random() < 0.22;

    const suits: CardSuit[] = ['spade', 'heart', 'diamond', 'club'];
    const suit = suits[Math.floor(Math.random() * suits.length)];

    return {
      id: Math.random().toString(36).substring(2, 9),
      type: pickedType,
      suit: suit,
      isGolden,
      isWild: false,
      isScatter: false,
    };
  };

  // Initialize starting grid
  useEffect(() => {
    const initialGrid: CardItem[][] = [];
    for (let c = 0; c < 5; c++) {
      const col: CardItem[] = [];
      for (let r = 0; r < 4; r++) {
        col.push(generateRandomCard(c));
      }
      initialGrid.push(col);
    }
    setGrid(initialGrid);
  }, []);

  // Check wins logic (Ways to Win from Reel 0 to 4)
  const evaluateWins = (
    currentGrid: CardItem[][]
  ): { winningPositions: { col: number; row: number }[]; totalWinRate: number; matchedSymbolName: string | null } => {
    if (!currentGrid || currentGrid.length < 5) {
      return { winningPositions: [], totalWinRate: 0, matchedSymbolName: null };
    }

    const regularSymbols = ['ace', 'king', 'queen', 'jack', 'spade', 'heart', 'diamond', 'club'];
    let totalWinRate = 0;
    const winningPosMap = new Set<string>();
    let lastMatchName: string | null = null;

    regularSymbols.forEach((sym) => {
      // Check consecutive reels from 0 onwards containing sym or wild
      const matchingRowsPerReel: number[][] = [];
      for (let c = 0; c < 5; c++) {
        const rows: number[] = [];
        for (let r = 0; r < 4; r++) {
          const item = currentGrid[c][r];
          if (item && (item.type === sym || item.isWild)) {
            rows.push(r);
          }
        }
        if (rows.length > 0) {
          matchingRowsPerReel.push(rows);
        } else {
          break; // Stop at first non-matching reel
        }
      }

      const matchLen = matchingRowsPerReel.length;
      if (matchLen >= 3) {
        // Calculate ways: product of matching symbol counts on each reel
        let ways = 1;
        for (let i = 0; i < matchLen; i++) {
          ways *= matchingRowsPerReel[i].length;
        }

        const payIndex = matchLen - 3; // 0 for 3, 1 for 4, 2 for 5
        const payout = (PAYTABLE[sym]?.[payIndex] || 0.2) * ways;
        totalWinRate += payout;
        lastMatchName = sym.toUpperCase();

        // Mark winning coordinates
        for (let c = 0; c < matchLen; c++) {
          matchingRowsPerReel[c].forEach((r) => {
            winningPosMap.add(`${c},${r}`);
          });
        }
      }
    });

    const winningPositions: { col: number; row: number }[] = [];
    winningPosMap.forEach((key) => {
      const [c, r] = key.split(',').map(Number);
      winningPositions.push({ col: c, row: r });
    });

    return { winningPositions, totalWinRate, matchedSymbolName: lastMatchName };
  };

  // Multiplier mapping based on combo and mode
  const getMultiplierVal = (combo: number, freeSpin: boolean): number => {
    if (!freeSpin) {
      if (combo <= 1) return 1;
      if (combo === 2) return 2;
      if (combo === 3) return 3;
      return 5;
    } else {
      // In Free Spins, elimination multipliers are DOUBLED (x2, x4, x6, x10)
      if (combo <= 1) return 2;
      if (combo === 2) return 4;
      if (combo === 3) return 6;
      return 10;
    }
  };

  // Perform cascading reel step
  const executeCascade = async (
    currentGrid: CardItem[][],
    currentCombo: number,
    isFree: boolean,
    accumulatedWin: number
  ) => {
    const { winningPositions, totalWinRate, matchedSymbolName } = evaluateWins(currentGrid);

    if (winningPositions.length === 0) {
      // No more combos
      setComboAnnouncement(null);
      setIsSpinning(false);
      if (accumulatedWin > 0) {
        setLastTotalWin(accumulatedWin);
        updateUser({ balance: Number((user.balance + accumulatedWin).toFixed(2)) });
        if (accumulatedWin > bet * 5) {
          confetti({ particleCount: 60, spread: 70 });
        }
      }
      return;
    }

    // A win has occurred! Highlight winning cards
    const mult = getMultiplierVal(currentCombo + 1, isFree);
    const stepWin = Number((totalWinRate * bet * mult).toFixed(2));
    const newAccumulated = accumulatedWin + stepWin;
    setWinAmount(newAccumulated);
    setComboLevel(currentCombo + 1);

    // Announce combo
    setComboAnnouncement(`COMBO ${currentCombo + 1}`);
    playSynthSound('combo');

    // Mark winning cards
    const markedGrid = currentGrid.map((col, c) =>
      col.map((item, r) => {
        const isWin = winningPositions.some((p) => p.col === c && p.row === r);
        return isWin ? { ...item, isWinning: true } : item;
      })
    );
    setGrid(markedGrid);

    // Pause to show the winning cards glowing
    await new Promise((resolve) => setTimeout(resolve, isTurbo ? 350 : 650));

    // Transform Golden Cards to Wilds, and remove other winning cards
    const nextGrid: CardItem[][] = markedGrid.map((col, c) => {
      const newCol: CardItem[] = [];
      for (let r = 0; r < col.length; r++) {
        const item = col[r];
        if (item.isWinning) {
          if (item.isGolden) {
            // Golden card transforms to WILD!
            newCol.push({
              id: Math.random().toString(36).substring(2, 9),
              type: 'wild',
              isGolden: false,
              isWild: true,
              isScatter: false,
              isWinning: false,
            });
          }
          // Normal winning cards eliminate (dropped)
        } else {
          newCol.push({ ...item, isWinning: false });
        }
      }

      // Fill up the top with fresh cards so every column has 4 items
      while (newCol.length < 4) {
        newCol.unshift(generateRandomCard(c));
      }
      return newCol;
    });

    setGrid(nextGrid);
    playSynthSound('stop');

    await new Promise((resolve) => setTimeout(resolve, isTurbo ? 300 : 500));

    // Recurse for the next cascade combo!
    executeCascade(nextGrid, currentCombo + 1, isFree, newAccumulated);
  };

  // Spin trigger
  const handleSpin = async (forceFreeSpin: boolean = false) => {
    if (isSpinning) return;

    const actualIsFree = isFreeSpinMode || forceFreeSpin;

    if (!actualIsFree) {
      if (user.balance < bet) {
        alert('Insufficient balance! Please deposit to continue.');
        setIsAutoplayActive(false);
        return;
      }
      // Deduct bet from balance
      updateUser({ balance: Number((user.balance - bet).toFixed(2)) });
    }

    setIsSpinning(true);
    setWinAmount(0);
    setComboLevel(0);
    setComboAnnouncement(null);
    playSynthSound('spin');

    // Generate brand new spin result
    const newGrid: CardItem[][] = [];
    let scattersFound = 0;

    for (let c = 0; c < 5; c++) {
      const col: CardItem[] = [];
      for (let r = 0; r < 4; r++) {
        const card = generateRandomCard(c);
        if (card.isScatter) {
          scattersFound++;
        }
        col.push(card);
      }
      newGrid.push(col);
    }

    // Simulate animated reel spin delay
    const spinDelay = isTurbo ? 250 : 550;
    await new Promise((resolve) => setTimeout(resolve, spinDelay));

    setGrid(newGrid);
    setScatterCount(scattersFound);
    playSynthSound('stop');

    // Check for 3 or more SCATTERs!
    if (scattersFound >= 3) {
      playSynthSound('scatter');
      confetti({ particleCount: 100, spread: 90 });
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Trigger 10 Free Spins!
      setShowCongratsModal(true);
      playSynthSound('free_start');
      setIsSpinning(false);
      return;
    }

    // Evaluate base wins and start cascade
    await new Promise((resolve) => setTimeout(resolve, 300));
    executeCascade(newGrid, 0, actualIsFree, 0);
  };

  // Start Free Game from Congratulations Screen
  const startFreeGames = () => {
    setShowCongratsModal(false);
    setIsFreeSpinMode(true);
    setFreeSpinsLeft(10);
    setFreeSpinsTotalWin(0);
  };

  // Free spins loop runner
  useEffect(() => {
    if (!isFreeSpinMode) return;

    if (freeSpinsLeft > 0 && !isSpinning && !showCongratsModal && !showFreeSpinEndModal) {
      const timer = setTimeout(() => {
        setFreeSpinsLeft((prev) => prev - 1);
        handleSpin(true);
      }, isTurbo ? 1000 : 1800);

      return () => clearTimeout(timer);
    } else if (freeSpinsLeft === 0 && !isSpinning && !showCongratsModal) {
      // Free spins finished
      setShowFreeSpinEndModal(true);
    }
  }, [isFreeSpinMode, freeSpinsLeft, isSpinning, showCongratsModal, showFreeSpinEndModal]);

  // Autoplay handler
  useEffect(() => {
    if (!isAutoplayActive || isFreeSpinMode || isSpinning) return;

    if (autoplayCount > 0) {
      const timer = setTimeout(() => {
        setAutoplayCount((prev) => prev - 1);
        handleSpin();
      }, isTurbo ? 800 : 1400);

      return () => clearTimeout(timer);
    } else {
      setIsAutoplayActive(false);
    }
  }, [isAutoplayActive, autoplayCount, isSpinning, isFreeSpinMode]);

  // Buy Bonus handler (10 Free Spins directly for 100x bet)
  const handleBuyBonus = () => {
    const cost = bet * 100;
    if (user.balance < cost) {
      alert(`Insufficient balance to Buy Bonus! Cost is ৳ ${cost.toFixed(2)}.`);
      return;
    }
    updateUser({ balance: Number((user.balance - cost).toFixed(2)) });
    setShowBuyBonusModal(false);
    setShowCongratsModal(true);
    playSynthSound('free_start');
  };

  // Render a single Card Symbol
  const renderCard = (card: CardItem) => {
    if (card.isScatter) {
      return (
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#3D0A0A] to-[#140202] border-2 border-[#EAB308] flex flex-col items-center justify-center p-1 shadow-[0_0_14px_rgba(234,179,8,0.7)] animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] flex items-center justify-center shadow-lg border border-amber-200">
            <span className="text-xl font-black text-amber-950 font-serif drop-shadow-sm">$</span>
          </div>
          <span className="text-[10px] font-black tracking-wider text-white bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-2 py-0.5 rounded-full mt-1 border border-yellow-300 uppercase shadow-md">
            SCATTER
          </span>
        </div>
      );
    }

    if (card.isWild) {
      return (
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0F2F38] via-[#081F26] to-[#041014] border-2 border-cyan-400 flex flex-col items-center justify-center p-1 shadow-[0_0_16px_rgba(34,211,238,0.8)]">
          {/* Colorful Jester Hat / Crown */}
          <div className="relative flex items-center justify-center">
            <div className="text-3xl drop-shadow-md">👑</div>
            <div className="absolute -top-1 -right-1 text-xs">✨</div>
          </div>
          <span className="text-[10px] font-black tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 px-2.5 py-0.5 rounded-full mt-0.5 border border-white uppercase shadow-md">
            WILD
          </span>
        </div>
      );
    }

    // Regular Card Face
    const isGold = card.isGolden;

    // Card face colors & illustrations
    const suitSymbol = card.suit === 'heart' ? '♥' : card.suit === 'diamond' ? '♦' : card.suit === 'spade' ? '♠' : '♣';
    const isRedSuit = card.suit === 'heart' || card.suit === 'diamond';

    const getSymbolGraphic = () => {
      switch (card.type) {
        case 'ace':
          return (
            <div className="flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${isRedSuit ? 'text-rose-600' : 'text-slate-900'}`}>
                {suitSymbol}
              </span>
              <span className="text-[10px] font-black tracking-widest text-slate-800 -mt-1">ACE</span>
            </div>
          );
        case 'king':
          return (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl">🤴</div>
              <span className="text-[10px] font-black text-blue-900 leading-none">KING</span>
            </div>
          );
        case 'queen':
          return (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl">👸</div>
              <span className="text-[10px] font-black text-rose-800 leading-none">QUEEN</span>
            </div>
          );
        case 'jack':
          return (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl">💂</div>
              <span className="text-[10px] font-black text-indigo-900 leading-none">JACK</span>
            </div>
          );
        default:
          return (
            <div className="flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${isRedSuit ? 'text-rose-600' : 'text-slate-900'}`}>
                {suitSymbol}
              </span>
            </div>
          );
      }
    };

    return (
      <div
        className={`relative w-full h-full rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-200 select-none ${
          isGold
            ? 'bg-gradient-to-b from-[#FFF2B2] via-[#EAB308] to-[#92400E] border-2 border-amber-300 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
            : 'bg-white border-2 border-[#CBD5E1] shadow-md'
        } ${card.isWinning ? 'ring-4 ring-amber-400 scale-105 z-10 brightness-110 animate-bounce' : ''}`}
      >
        {/* Corner Suit pip */}
        <div className="absolute top-1 left-1.5 flex flex-col items-center text-[10px] font-bold leading-none">
          <span className={isRedSuit ? 'text-rose-600' : 'text-slate-900'}>
            {card.type === 'ace'
              ? 'A'
              : card.type === 'king'
              ? 'K'
              : card.type === 'queen'
              ? 'Q'
              : card.type === 'jack'
              ? 'J'
              : suitSymbol}
          </span>
        </div>

        {/* Center Graphic */}
        {getSymbolGraphic()}

        {/* Bottom Corner Suit pip */}
        <div className="absolute bottom-1 right-1.5 flex flex-col items-center text-[10px] font-bold leading-none rotate-180">
          <span className={isRedSuit ? 'text-rose-600' : 'text-slate-900'}>
            {card.type === 'ace'
              ? 'A'
              : card.type === 'king'
              ? 'K'
              : card.type === 'queen'
              ? 'Q'
              : card.type === 'jack'
              ? 'J'
              : suitSymbol}
          </span>
        </div>
      </div>
    );
  };

  // SPLASH / INTRO SCREEN (Matching 00:00 - 00:02 of Video)
  if (showSplash) {
    return (
      <div className="relative min-h-screen bg-[#07130F] flex flex-col items-center justify-center p-4 overflow-hidden text-white">
        {/* Background Sunburst Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A4D2E_0%,#051510_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-sm w-full bg-[#0D241C]/90 backdrop-blur-md border border-[#22C55E]/40 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
          {/* Super Ace Title */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-md font-serif">
              SuperAce
            </h1>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-300">
              <span>Volatility</span>
              <div className="flex text-rose-500">🌶️🌶️🌶️🌶️<span className="opacity-30">🌶️</span></div>
            </div>
          </div>

          {/* Golden poker tutorial preview card matching video */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-400/40 p-3 bg-black/40 shadow-inner">
            <div className="grid grid-cols-4 gap-1.5 w-52 h-44 mx-auto items-center justify-center">
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">K♠</div>
              <div className="bg-amber-300 rounded-lg p-2 text-center text-xs font-bold text-amber-950 border border-amber-500 animate-pulse">
                👑 WILD
              </div>
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">Q♥</div>
              <div className="bg-amber-300 rounded-lg p-2 text-center text-xs font-bold text-amber-950 border border-amber-500 animate-pulse">
                👑 WILD
              </div>
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">A♠</div>
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">J♠</div>
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">A♦</div>
              <div className="bg-white rounded-lg p-2 text-center text-xs font-bold text-slate-900">K♥</div>
            </div>

            <p className="text-xs text-amber-200/90 font-medium mt-3 px-2">
              After the Golden poker wins, it will turn into wild in the same place.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              setShowSplash(false);
              setShowPlayStart(true);
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-slate-950 font-black text-lg tracking-wide shadow-lg shadow-emerald-900/40 active:scale-95 transition-all"
          >
            Continue
          </button>

          {/* Don't show next time */}
          <label className="flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded bg-black/40 border-slate-600 text-emerald-500 focus:ring-0"
            />
            <span>Don't show next time</span>
          </label>
        </div>
      </div>
    );
  }

  // PLAY SCREEN ON POKER TABLE (Matching 00:02 - 00:04 of Video)
  if (showPlayStart) {
    return (
      <div className="relative min-h-screen bg-[#1A0B05] flex flex-col items-center justify-center p-4 text-white overflow-hidden">
        {/* Felt Table Edge */}
        <div className="relative w-full max-w-sm rounded-[36px] overflow-hidden bg-gradient-to-b from-[#0A261D] via-[#0E382A] to-[#0A261D] border-8 border-[#3A170A] shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6 flex flex-col items-center justify-between min-h-[520px]">
          {/* Top Multiplier Housing */}
          <div className="w-full bg-[#180A04] border border-[#3E1D0C] rounded-xl px-4 py-2 flex items-center justify-around shadow-inner">
            <span className="text-xl font-black font-mono text-amber-400">x1</span>
            <span className="text-xl font-black font-mono text-amber-200/50">x2</span>
            <span className="text-xl font-black font-mono text-amber-200/50">x3</span>
            <span className="text-xl font-black font-mono text-amber-200/50">x5</span>
          </div>

          {/* Central Logo & PLAY */}
          <div className="flex flex-col items-center space-y-6 my-auto">
            <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-serif">
              SuperAce
            </h1>

            <button
              onClick={() => {
                setShowPlayStart(false);
                playSynthSound('free_start');
              }}
              className="px-12 py-3.5 rounded-2xl bg-gradient-to-b from-[#EA580C] via-[#C2410C] to-[#9A3412] hover:brightness-110 text-white font-black text-2xl tracking-widest shadow-[0_6px_20px_rgba(194,65,12,0.6)] active:scale-95 transition-all border border-amber-300"
            >
              PLAY
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">Tap PLAY to enter casino table</span>
        </div>
      </div>
    );
  }

  // MAIN ACTIVE GAMEPLAY SCREEN (00:05 - 01:23)
  return (
    <div className="min-h-screen bg-[#06110D] text-slate-100 flex flex-col justify-between max-w-lg mx-auto relative overflow-hidden select-none">
      {/* 1. TOP HEADER & MULTIPLIER ROLLER BAR */}
      <div className="bg-[#120703] border-b border-[#2C1205] shadow-lg sticky top-0 z-30">
        {/* Navigation & Controls Row */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#240E04]">
          <button
            onClick={() => navigate('slots')}
            className="w-8 h-8 rounded-lg bg-[#240E04] hover:bg-[#381608] flex items-center justify-center text-slate-300 transition-colors"
            title="Back to Lobby"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-500 font-serif">
            SuperAce
          </span>

          <div className="flex items-center gap-1.5">
            {/* BUY BONUS BUTTON (Matching video 00:06 top right) */}
            <button
              onClick={() => setShowBuyBonusModal(true)}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 text-slate-950 font-black text-[10px] tracking-tight uppercase shadow-md flex items-center gap-1 animate-pulse"
            >
              <ShoppingBag className="w-3 h-3 text-slate-950 stroke-[3]" />
              <span>BUY BONUS</span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 rounded-lg bg-[#240E04] hover:bg-[#381608] flex items-center justify-center text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Elimination Multiplier Slots Roller matching video (x1, x2, x3, x5 OR in free spin: x2, x4, x6, x10) */}
        <div className="px-3 py-2 bg-gradient-to-b from-[#1C0A04] to-[#120703]">
          {isFreeSpinMode ? (
            <div className="flex items-center justify-between px-2 py-0.5">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                FREE SPIN <span className="text-white text-base ml-1">{freeSpinsLeft}</span>
              </span>
              <span className="text-xs font-black text-rose-400 animate-pulse">2X MULTIPLIERS!</span>
            </div>
          ) : null}

          <div
            className={`w-full rounded-xl px-2 py-1.5 flex items-center justify-around border shadow-inner transition-colors ${
              isFreeSpinMode
                ? 'bg-[#3A0707] border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-[#180A04] border-[#3E1D0C]'
            }`}
          >
            {isFreeSpinMode ? (
              // Free Spins: x2, x4, x6, x10
              [
                { label: 'x2', lvl: 1 },
                { label: 'x4', lvl: 2 },
                { label: 'x6', lvl: 3 },
                { label: 'x10', lvl: 4 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center py-0.5 rounded-lg transition-all font-mono font-black text-lg ${
                    comboLevel >= item.lvl
                      ? 'bg-gradient-to-b from-rose-500 to-red-700 text-white shadow-md scale-105'
                      : 'text-rose-300/40'
                  }`}
                >
                  {item.label}
                </div>
              ))
            ) : (
              // Normal Mode: x1, x2, x3, x5
              [
                { label: 'x1', lvl: 1 },
                { label: 'x2', lvl: 2 },
                { label: 'x3', lvl: 3 },
                { label: 'x5', lvl: 4 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center py-0.5 rounded-lg transition-all font-mono font-black text-lg ${
                    comboLevel === 0 && item.lvl === 1
                      ? 'bg-amber-400/20 text-amber-400'
                      : comboLevel >= item.lvl
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-md scale-105'
                      : 'text-amber-200/40'
                  }`}
                >
                  {item.label}
                </div>
              ))
            )}
          </div>

          {/* Marquee ticker banner below multipliers matching video */}
          <div className="text-[11px] text-amber-200/80 font-medium text-center truncate pt-1">
            {isFreeSpinMode
              ? 'Up to 10x puzzle multiplier reward in Free Game.'
              : comboAnnouncement || 'Get a Golden Card and have a chance to win Wilds!'}
          </div>
        </div>
      </div>

      {/* 2. REELS DISPLAY (5 COLUMNS x 4 ROWS) */}
      <div className="flex-1 px-2.5 py-2 flex flex-col justify-center relative">
        {/* Felt Table Background Frame */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#092B21] via-[#0E3D30] to-[#08261D] border-4 border-[#2D150A] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] p-2">
          {/* Watermark logo on table felt matching video */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="text-5xl font-black font-serif text-white tracking-widest">SuperAce</span>
          </div>

          {/* Combo overlay toast */}
          {comboAnnouncement && (
            <div className="absolute top-2 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-white font-black text-sm px-4 py-1 rounded-full shadow-xl border border-yellow-300 animate-bounce tracking-widest uppercase">
                {comboAnnouncement} 🔥
              </div>
            </div>
          )}

          {/* 5 columns grid */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {grid.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col gap-1.5 sm:gap-2">
                {col.map((card) => (
                  <div key={card.id} className="aspect-[3/4] w-full">
                    {renderCard(card)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CONTROL CONSOLE MATCHING VIDEO */}
      <div className="bg-[#120703] border-t-2 border-[#2C1205] p-3 space-y-2 relative z-20">
        {/* Row A: WIN readout */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#EAB308] uppercase">WIN</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            {winAmount.toFixed(3)}
          </span>
        </div>

        {/* Row B: Bet Selector + Main Spin Button + Autoplay / Turbo */}
        <div className="flex items-center justify-between px-2 gap-2">
          {/* Bet Selector Button (Matching video "Bet 2", "Bet 5", "Bet 50", etc.) */}
          <div className="relative">
            <button
              onClick={() => setShowBetGrid(!showBetGrid)}
              disabled={isSpinning || isFreeSpinMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#240E04] hover:bg-[#361506] border border-[#4A1E0B] text-slate-100 font-bold text-xs shadow-md active:scale-95 disabled:opacity-50"
            >
              <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">
                ৳
              </div>
              <span className="font-mono text-sm">Bet {bet}</span>
            </button>

            {/* Bet Denominations Grid Popup (15 values matching video 00:10 & 00:23) */}
            {showBetGrid && (
              <div className="absolute bottom-12 left-0 z-50 bg-[#160803] border-2 border-[#5C270F] rounded-2xl p-2 shadow-2xl w-52 grid grid-cols-3 gap-1.5 animate-in slide-in-from-bottom duration-150">
                {BET_OPTIONS.map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setBet(val);
                      setShowBetGrid(false);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      bet === val
                        ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                        : 'bg-[#2A1005] hover:bg-[#3E1808] text-slate-200'
                    }`}
                  >
                    {val >= 1000 ? '1,000' : val}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Golden Center Spin Wheel Button matching Video */}
          <button
            onClick={() => handleSpin()}
            disabled={isSpinning || isFreeSpinMode}
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#92400E] border-4 border-[#FFFBEB] flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.7)] active:scale-90 transition-transform ${
              isSpinning ? 'animate-spin opacity-80' : 'hover:brightness-110'
            } disabled:opacity-60`}
            title="Press to Spin"
          >
            <div className="w-12 h-12 rounded-full border-2 border-amber-950/40 flex items-center justify-center bg-gradient-to-b from-amber-300 to-amber-500">
              <RotateCw className="w-7 h-7 text-amber-950 stroke-[3]" />
            </div>
          </button>

          {/* Right: Turbo Spin & Autoplay Controls */}
          <div className="flex items-center gap-1.5">
            {/* Turbo Mode */}
            <button
              onClick={() => setIsTurbo(!isTurbo)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                isTurbo
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md'
                  : 'bg-[#240E04] border-[#4A1E0B] text-slate-400 hover:text-white'
              }`}
              title="Turbo Spin"
            >
              <Zap className="w-4 h-4 fill-current" />
            </button>

            {/* Autoplay Toggle */}
            <button
              onClick={() => {
                if (isAutoplayActive) {
                  setIsAutoplayActive(false);
                  setAutoplayCount(0);
                } else {
                  setShowAutoplayModal(true);
                }
              }}
              className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isAutoplayActive
                  ? 'bg-rose-600 border-rose-400 text-white shadow-md animate-pulse'
                  : 'bg-[#240E04] border-[#4A1E0B] text-slate-300 hover:bg-[#361506]'
              }`}
            >
              {isAutoplayActive ? `Auto (${autoplayCount})` : 'Auto'}
            </button>
          </div>
        </div>

        {/* Row C: Balance & Transaction info matching video */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1 font-mono">
          <div className="flex items-baseline gap-1">
            <span className="text-slate-400">Balance</span>
            <span className="text-white font-extrabold text-sm">{user.balance.toFixed(3)}</span>
          </div>

          <div className="truncate max-w-[180px] text-slate-500 text-[10px]">
            Transaction {transactionId}
          </div>
        </div>
      </div>

      {/* 4. CONGRATS! 10 FREE SPINS CELEBRATION MODAL (Matching 01:08 of Video) */}
      {showCongratsModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="relative max-w-sm w-full rounded-3xl bg-[radial-gradient(circle_at_center,#1B6B44_0%,#092617_100%)] border-4 border-amber-400 p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.8)] flex flex-col items-center space-y-4">
            {/* Flying gold coins aura */}
            <div className="text-4xl animate-bounce">🪙 💰 🪙</div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-widest text-amber-200 font-serif drop-shadow-md">
                CONGRATS!
              </h2>
              <h3 className="text-2xl font-black tracking-wider text-amber-400">
                FREE GAME
              </h3>
            </div>

            {/* 10 SPINS in glowing golden letters matching video */}
            <div className="py-2">
              <div className="text-5xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#FFF275] via-[#FFD000] to-[#FF8800] drop-shadow-[0_4px_16px_rgba(255,215,0,1)]">
                10 SPINS
              </div>
            </div>

            {/* ELIMINATION MULTIPLIER 2x 4x 6x 10x matching video */}
            <div className="bg-black/40 border border-amber-400/40 rounded-2xl px-4 py-2.5 w-full">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest block">
                ELIMINATION MULTIPLIER
              </span>
              <div className="flex items-center justify-around text-lg font-black font-mono text-rose-400 mt-1">
                <span>x2</span>
                <span>x4</span>
                <span>x6</span>
                <span>x10</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startFreeGames}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xl tracking-wider shadow-xl shadow-amber-900/50 active:scale-95 transition-transform"
            >
              START FREE SPINS
            </button>
          </div>
        </div>
      )}

      {/* 5. FREE SPINS END / TOTAL WIN CELEBRATION MODAL */}
      {showFreeSpinEndModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="relative max-w-sm w-full rounded-3xl bg-[radial-gradient(circle_at_center,#4A1504_0%,#1A0701_100%)] border-4 border-amber-400 p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.8)] flex flex-col items-center space-y-4">
            <div className="text-5xl animate-bounce">🏆</div>
            <h2 className="text-3xl font-black text-amber-300 font-serif">FREE GAME COMPLETED</h2>
            <div className="py-2">
              <span className="text-xs text-slate-300 block uppercase font-bold">Total Winnings</span>
              <div className="text-4xl font-black font-mono text-emerald-400 mt-1">
                ৳ {winAmount.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => {
                setShowFreeSpinEndModal(false);
                setIsFreeSpinMode(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-slate-950 font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              COLLECT WINNINGS
            </button>
          </div>
        </div>
      )}

      {/* 6. BUY BONUS CONFIRMATION MODAL */}
      {showBuyBonusModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#180A04] border-2 border-amber-500 rounded-2xl p-5 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-amber-400">Buy 10 Free Spins</h3>
            <p className="text-xs text-slate-300">
              Instantly trigger the 10 Free Spins Bonus Game with double elimination multipliers!
            </p>
            <div className="bg-[#2A1005] rounded-xl p-3 border border-[#4E1E09]">
              <span className="text-xs text-slate-400 block">Cost (100x Bet)</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                ৳ {(bet * 100).toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBuyBonusModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2A1005] hover:bg-[#3E1808] text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBuyBonus}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. AUTOPLAY SELECTION MODAL */}
      {showAutoplayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#180A04] border border-[#3E1D0C] rounded-2xl p-5 max-w-xs w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-amber-400">Select Autoplay Spins</h3>
              <button onClick={() => setShowAutoplayModal(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setAutoplayCount(num);
                    setIsAutoplayActive(true);
                    setShowAutoplayModal(false);
                  }}
                  className="py-2.5 rounded-xl bg-[#2A1005] hover:bg-amber-400 hover:text-slate-950 font-mono font-bold text-sm text-slate-200 transition-colors"
                >
                  {num} Spins
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
