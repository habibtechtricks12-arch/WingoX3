import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface UpcomingRound {
  roundId: number;
  crashMultiplier: number;
  isOverridden: boolean;
  estimatedFlightSeconds: number;
}

export interface AviatorHistoryItem {
  id: string;
  val: number;
  time: string;
  wasOverridden?: boolean;
}

interface AviatorControlContextType {
  // Current Live Flight State
  gameState: 'waiting' | 'flying' | 'crashed';
  currentMultiplier: number;
  currentCrashTarget: number;
  flightElapsedSeconds: number;
  estimatedRemainingSeconds: number;
  waitingCountdown: number;

  // Ahead of Time Predictions
  upcomingQueue: UpcomingRound[];

  // Admin Controls
  setNextCrashMultiplier: (multiplier: number) => void;
  setSpecificUpcomingCrash: (roundIndex: number, multiplier: number) => void;
  forceCrashNow: () => void;
  setGameStrategyMode: (mode: 'fair' | 'house_protect' | 'high_win') => void;
  gameStrategyMode: 'fair' | 'house_protect' | 'high_win';
  history: AviatorHistoryItem[];

  // Internal Engine Sync methods
  syncFlightTick: (
    state: 'waiting' | 'flying' | 'crashed',
    multiplier: number,
    target: number,
    elapsed: number,
    waitingSec: number
  ) => void;
  onRoundCrashed: (finalVal: number, wasOverridden: boolean) => void;
  popNextCrashTarget: () => number;
}

const STORAGE_KEY_STRATEGY = 'wingo_aviator_strategy';
const STORAGE_KEY_FORCED_NEXT = 'wingo_aviator_forced_next';

const generateRandomTarget = (strategy: 'fair' | 'house_protect' | 'high_win'): number => {
  const rand = Math.random();
  if (strategy === 'house_protect') {
    // 70% quick crash under 1.6x
    if (rand < 0.7) {
      return Number((1.05 + Math.random() * 0.55).toFixed(2));
    } else if (rand < 0.92) {
      return Number((1.6 + Math.random() * 1.8).toFixed(2));
    }
    return Number((3.5 + Math.random() * 4.0).toFixed(2));
  } else if (strategy === 'high_win') {
    // High multiplier boost
    if (rand < 0.15) {
      return Number((1.1 + Math.random() * 0.4).toFixed(2));
    } else if (rand < 0.55) {
      return Number((3.0 + Math.random() * 5.0).toFixed(2));
    }
    return Number((8.0 + Math.random() * 32.0).toFixed(2));
  } else {
    // Fair balanced RNG
    if (rand < 0.18) {
      return Number((1.05 + Math.random() * 0.35).toFixed(2)); // 1.05 - 1.40x
    } else if (rand < 0.62) {
      return Number((1.4 + Math.random() * 2.2).toFixed(2)); // 1.40 - 3.60x
    } else if (rand < 0.88) {
      return Number((3.6 + Math.random() * 6.4).toFixed(2)); // 3.60 - 10.00x
    } else {
      return Number((10.0 + Math.random() * 35.0).toFixed(2)); // 10.00 - 45.00x
    }
  }
};

const calculateFlightDuration = (multiplier: number): number => {
  // Inverse of currentMultiplier = 1.0 + (elapsed * 0.48)^1.85
  // (multiplier - 1.0)^(1/1.85) / 0.48
  if (multiplier <= 1.01) return 0.5;
  const power = Math.pow(Math.max(0.01, multiplier - 1.0), 1 / 1.85);
  return Number((power / 0.48).toFixed(1));
};

const generateInitialQueue = (strategy: 'fair' | 'house_protect' | 'high_win'): UpcomingRound[] => {
  const list: UpcomingRound[] = [];
  const baseRoundId = 1001;
  for (let i = 0; i < 10; i++) {
    const mult = generateRandomTarget(strategy);
    list.push({
      roundId: baseRoundId + i,
      crashMultiplier: mult,
      isOverridden: false,
      estimatedFlightSeconds: calculateFlightDuration(mult),
    });
  }
  return list;
};

const AviatorControlContext = createContext<AviatorControlContextType | null>(null);

export const AviatorControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameStrategyMode, setGameStrategyModeState] = useState<'fair' | 'house_protect' | 'high_win'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STRATEGY);
      if (stored === 'house_protect' || stored === 'high_win' || stored === 'fair') {
        return stored;
      }
    } catch {}
    return 'fair';
  });

  const [upcomingQueue, setUpcomingQueue] = useState<UpcomingRound[]>(() => {
    return generateInitialQueue(gameStrategyMode);
  });

  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [currentCrashTarget, setCurrentCrashTarget] = useState<number>(3.38);
  const [flightElapsedSeconds, setFlightElapsedSeconds] = useState<number>(0);
  const [waitingCountdown, setWaitingCountdown] = useState<number>(4);

  const [history, setHistory] = useState<AviatorHistoryItem[]>([
    { id: '1', val: 2.2, time: '12:05' },
    { id: '2', val: 1.07, time: '12:06' },
    { id: '3', val: 9.44, time: '12:07' },
    { id: '4', val: 1.3, time: '12:08' },
    { id: '5', val: 7.75, time: '12:09' },
    { id: '6', val: 1.76, time: '12:10' },
    { id: '7', val: 12.64, time: '12:11' },
    { id: '8', val: 3.07, time: '12:12' },
  ]);

  const forceCrashRequestedRef = useRef<boolean>(false);

  // Sync flight tick from AviatorGame engine
  const syncFlightTick = (
    state: 'waiting' | 'flying' | 'crashed',
    multiplier: number,
    target: number,
    elapsed: number,
    waitingSec: number
  ) => {
    setGameState(state);
    setCurrentMultiplier(multiplier);
    setCurrentCrashTarget(target);
    setFlightElapsedSeconds(elapsed);
    setWaitingCountdown(waitingSec);
  };

  // Called when a round crashes to record history and update upcoming queue
  const onRoundCrashed = (finalVal: number, wasOverridden: boolean) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setHistory((prev) => [
      { id: Date.now().toString(), val: finalVal, time: timeStr, wasOverridden },
      ...prev.slice(0, 19),
    ]);
  };

  // Pops the next crash target for a new flight round
  const popNextCrashTarget = (): number => {
    let nextTarget = 2.0;
    setUpcomingQueue((prev) => {
      if (prev.length === 0) return generateInitialQueue(gameStrategyMode);
      const [nextRound, ...rest] = prev;
      nextTarget = nextRound.crashMultiplier;

      // Generate a new round at the end of the queue so it always has 10 upcoming rounds!
      const lastRoundId = rest.length > 0 ? rest[rest.length - 1].roundId : nextRound.roundId;
      const newMult = generateRandomTarget(gameStrategyMode);
      const appended: UpcomingRound = {
        roundId: lastRoundId + 1,
        crashMultiplier: newMult,
        isOverridden: false,
        estimatedFlightSeconds: calculateFlightDuration(newMult),
      };
      return [...rest, appended];
    });

    setCurrentCrashTarget(nextTarget);
    return nextTarget;
  };

  // Admin sets the very next crash multiplier
  const setNextCrashMultiplier = (multiplier: number) => {
    const sanitized = Math.max(1.01, Number(multiplier.toFixed(2)));
    setUpcomingQueue((prev) => {
      if (prev.length === 0) {
        return [
          {
            roundId: 1001,
            crashMultiplier: sanitized,
            isOverridden: true,
            estimatedFlightSeconds: calculateFlightDuration(sanitized),
          },
        ];
      }
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        crashMultiplier: sanitized,
        isOverridden: true,
        estimatedFlightSeconds: calculateFlightDuration(sanitized),
      };
      return updated;
    });

    try {
      localStorage.setItem(STORAGE_KEY_FORCED_NEXT, sanitized.toString());
    } catch {}
  };

  // Admin edits any specific upcoming round in the 10-round queue
  const setSpecificUpcomingCrash = (roundIndex: number, multiplier: number) => {
    const sanitized = Math.max(1.01, Number(multiplier.toFixed(2)));
    setUpcomingQueue((prev) => {
      const updated = [...prev];
      if (updated[roundIndex]) {
        updated[roundIndex] = {
          ...updated[roundIndex],
          crashMultiplier: sanitized,
          isOverridden: true,
          estimatedFlightSeconds: calculateFlightDuration(sanitized),
        };
      }
      return updated;
    });
  };

  // Admin emergency button: instant crash current flight
  const forceCrashNow = () => {
    forceCrashRequestedRef.current = true;
    // Dispatch custom event for immediate reaction inside game loop
    window.dispatchEvent(new CustomEvent('aviator_admin_force_crash'));
  };

  const setGameStrategyMode = (mode: 'fair' | 'house_protect' | 'high_win') => {
    setGameStrategyModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_STRATEGY, mode);
    } catch {}
    // Regenerate upcoming non-overridden rounds
    setUpcomingQueue((prev) => {
      return prev.map((item, idx) => {
        if (item.isOverridden) return item;
        const newTarget = generateRandomTarget(mode);
        return {
          ...item,
          crashMultiplier: newTarget,
          estimatedFlightSeconds: calculateFlightDuration(newTarget),
        };
      });
    });
  };

  const estimatedTotalDuration = calculateFlightDuration(currentCrashTarget);
  const estimatedRemainingSeconds = Math.max(
    0,
    Number((estimatedTotalDuration - flightElapsedSeconds).toFixed(1))
  );

  return (
    <AviatorControlContext.Provider
      value={{
        gameState,
        currentMultiplier,
        currentCrashTarget,
        flightElapsedSeconds,
        estimatedRemainingSeconds,
        waitingCountdown,
        upcomingQueue,
        setNextCrashMultiplier,
        setSpecificUpcomingCrash,
        forceCrashNow,
        setGameStrategyMode,
        gameStrategyMode,
        history,
        syncFlightTick,
        onRoundCrashed,
        popNextCrashTarget,
      }}
    >
      {children}
    </AviatorControlContext.Provider>
  );
};

export const useAviatorControl = (): AviatorControlContextType => {
  const context = useContext(AviatorControlContext);
  if (!context) {
    throw new Error('useAviatorControl must be used within an AviatorControlProvider');
  }
  return context;
};
