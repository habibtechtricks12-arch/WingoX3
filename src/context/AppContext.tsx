import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  PageRoute,
  UserProfile,
  StoredUserAccount,
  BankAccount,
  WinGoMode,
  GameHistoryItem,
  UserBet,
  InviteStats,
  AchievementReward,
  MessageItem,
  MissionItem,
} from '../types';

interface ToastState {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentRoute: PageRoute;
  routeHistory: PageRoute[];
  navigate: (route: PageRoute) => void;
  goBack: () => void;
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => { success: boolean; message: string };
  register: (phone: string, password: string, inviteCode?: string) => { success: boolean; message: string };
  logout: () => void;
  bankAccount: BankAccount;
  updateBankAccount: (account: BankAccount) => void;
  // WinGo Lottery State
  activeWinGoMode: WinGoMode;
  setActiveWinGoMode: (mode: WinGoMode) => void;
  winGoSecondsLeft: number;
  currentPeriod: string;
  gameHistory: GameHistoryItem[];
  userBets: UserBet[];
  placeBet: (selection: string, baseAmount: number, multiplier: number) => boolean;
  // Invite State
  inviteStats: InviteStats;
  achievements: AchievementReward[];
  claimAchievement: (id: number) => void;
  // Daily Sign-In State
  signInStreak: number;
  hasClaimedToday: boolean;
  claimDailySignIn: () => void;
  // Missions
  missions: MissionItem[];
  claimMission: (id: string) => void;
  // Messages
  messages: MessageItem[];
  markMessageRead: (id: string) => void;
  unreadMessageCount: number;
  // Finance Actions
  depositDemo: (amount: number, channel: string) => void;
  withdrawDemo: (amount: number, bank: string) => boolean;
  refreshBalance: () => void;
  isRefreshingBalance: boolean;
  // Toast
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
  // Desktop Phone Frame Toggle
  isPhoneFrame: boolean;
  togglePhoneFrame: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Initial Mock Game History
const initialHistory: GameHistoryItem[] = [
  { period: 'DEMO-00051393', number: 3, bigSmall: 'Small', color: 'green', timestamp: '19:08:30' },
  { period: 'DEMO-00051392', number: 4, bigSmall: 'Small', color: 'red', timestamp: '19:08:00' },
  { period: 'DEMO-00051391', number: 8, bigSmall: 'Big', color: 'red', timestamp: '19:07:30' },
  { period: 'DEMO-00051390', number: 0, bigSmall: 'Small', color: 'violet-red', timestamp: '19:07:00' },
  { period: 'DEMO-00051389', number: 7, bigSmall: 'Big', color: 'green', timestamp: '19:06:30' },
  { period: 'DEMO-00051388', number: 5, bigSmall: 'Big', color: 'violet-green', timestamp: '19:06:00' },
  { period: 'DEMO-00051387', number: 1, bigSmall: 'Small', color: 'green', timestamp: '19:05:30' },
  { period: 'DEMO-00051386', number: 9, bigSmall: 'Big', color: 'green', timestamp: '19:05:00' },
  { period: 'DEMO-00051385', number: 2, bigSmall: 'Small', color: 'red', timestamp: '19:04:30' },
  { period: 'DEMO-00051384', number: 6, bigSmall: 'Big', color: 'red', timestamp: '19:04:00' },
];

const initialAchievements: AchievementReward[] = [
  { id: 1, targetReferrals: 3, rewardAmount: 30.0, claimed: false },
  { id: 2, targetReferrals: 7, rewardAmount: 40.0, claimed: false },
  { id: 3, targetReferrals: 12, rewardAmount: 50.0, claimed: false },
  { id: 4, targetReferrals: 20, rewardAmount: 100.0, claimed: false },
  { id: 5, targetReferrals: 50, rewardAmount: 300.0, claimed: false },
  { id: 6, targetReferrals: 100, rewardAmount: 500.0, claimed: false },
];

const initialMessages: MessageItem[] = [
  {
    id: 'MSG-001',
    title: 'Platform System Upgrade Completed',
    date: '2026-09-28 18:00',
    preview: 'Security protocol v2.8 deployed with sub-second response times...',
    content: 'Dear Member, our platform server upgrade is now live. Enjoy smoother graphics, faster lottery draws, and enhanced security protections. Thank you for your continued support!',
    read: false,
    category: 'System',
  },
  {
    id: 'MSG-002',
    title: 'VIP0 Newcomer Welcome Gift Available',
    date: '2026-09-28 14:20',
    preview: 'Collect your introductory promotion rebate and daily reward vouchers...',
    content: 'Welcome to TCG SEA! Check out the Reward Center to claim your daily check-in bonus and rescue fund insurance. Upgrade your VIP tier by participating in games.',
    read: false,
    category: 'Bonus',
  },
  {
    id: 'MSG-003',
    title: 'Safe Gaming & Account Security Notice',
    date: '2026-09-27 10:15',
    preview: 'Please never share your login credentials or OTP with third parties...',
    content: 'Official reminders: TCG SEA staff will never ask for your account password or withdrawal PIN. Always ensure you are on our verified platform.',
    read: false,
    category: 'Security',
  },
  {
    id: 'MSG-004',
    title: 'Invite Friends High Commission Event',
    date: '2026-09-26 11:00',
    preview: 'Earn up to 100TK per valid friend + 2.2% deposit rebates...',
    content: 'Share your exclusive referral QR and link! Earn automatic L1 commission tiers with instant daily settlements in your wallet.',
    read: false,
    category: 'Bonus',
  },
  {
    id: 'MSG-005',
    title: 'Weekly Cashback Credited to Balance',
    date: '2026-09-25 09:30',
    preview: 'Your 0.8% weekly VIP loss rebate has been computed...',
    content: 'Your VIP weekly rebate has been finalized and added to your balance. View detailed audit trails under Account Records.',
    read: false,
    category: 'Bonus',
  },
  {
    id: 'MSG-006',
    title: 'WinGo 30s Rapid Lottery Live Now',
    date: '2026-09-24 16:45',
    preview: 'Experience ultra-fast 30-second rounds with transparent trend charts...',
    content: 'Try out WinGo 30s! Rapid rounds, multiple multipliers, and live color/number selections. Check the Lottery tab to start testing.',
    read: false,
    category: 'System',
  },
];

const initialMissions: MissionItem[] = [
  {
    id: 'M-1',
    title: 'Daily Platform Check-In',
    desc: 'Log in and visit the Reward Center today',
    reward: 10.0,
    progress: 1,
    total: 1,
    claimed: false,
  },
  {
    id: 'M-2',
    title: 'Play 3 WinGo Rounds',
    desc: 'Place 3 demo bets in any WinGo lottery',
    reward: 25.0,
    progress: 1,
    total: 3,
    claimed: false,
  },
  {
    id: 'M-3',
    title: 'Invite 1 Friend to Register',
    desc: 'Share your referral link with a friend',
    reward: 50.0,
    progress: 1,
    total: 1,
    claimed: false,
  },
  {
    id: 'M-4',
    title: 'Bind Demo Bank Account',
    desc: 'Configure your bank details under My Account',
    reward: 20.0,
    progress: 1,
    total: 1,
    claimed: false,
  },
];

const STORAGE_KEY_USERS = 'wingo_registered_users';
const STORAGE_KEY_SESSION = 'wingo_active_session';

const emptyGuestUser: UserProfile = {
  id: '',
  nickname: 'Guest',
  vipLevel: 0,
  balance: 0.0,
  joinedDate: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  phone: '',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check active session on initial load
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEY_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.phone) return parsed;
      }
    } catch {}
    return emptyGuestUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEY_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        return !!(parsed && parsed.phone);
      }
    } catch {}
    return false;
  });

  // If no account, start directly on register page!
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEY_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.phone) return 'home';
      }
    } catch {}
    return 'register';
  });

  const [routeHistory, setRouteHistory] = useState<PageRoute[]>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEY_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.phone) return ['home'];
      }
    } catch {}
    return ['register'];
  });

  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const [bankAccount, setBankAccount] = useState<BankAccount>({
    accountHolder: 'My Account',
    bankName: 'bKash Mobile Banking',
    accountNumber: '',
    mobileNumber: '',
  });

  // WinGo Timer & History
  const [activeWinGoMode, setActiveWinGoMode] = useState<WinGoMode>('30s');
  const [winGoSecondsLeft, setWinGoSecondsLeft] = useState<number>(30);
  const [periodCounter, setPeriodCounter] = useState<number>(51394);
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>(initialHistory);
  const [userBets, setUserBets] = useState<UserBet[]>([]);

  // Daily Sign-In & Achievements
  const [signInStreak, setSignInStreak] = useState<number>(1);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<AchievementReward[]>(initialAchievements);
  const [missions, setMissions] = useState<MissionItem[]>(initialMissions);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);

  // Invite Stats
  const [inviteStats, setInviteStats] = useState<InviteStats>({
    todayIncome: 0.0,
    yesterdayIncome: 0.0,
    registers: 1,
    validReferral: 0,
    depositors: 0,
    totalIncome: 0.0,
    invitationRewards: 0.0,
    achievementRewards: 0.0,
    depositRebate: 0.0,
    bettingRebate: 0.0,
  });

  // Balance Refresh animation
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Navigation handlers
  const navigate = useCallback((route: PageRoute) => {
    setRouteHistory((prev) => [...prev, route]);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setRouteHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentRoute('home');
        return ['home'];
      }
      const nextHistory = prev.slice(0, -1);
      const prevRoute = nextHistory[nextHistory.length - 1];
      setCurrentRoute(prevRoute);
      return nextHistory;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateUser = useCallback((fields: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));
        const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
        if (storedUsersRaw) {
          const storedUsers: StoredUserAccount[] = JSON.parse(storedUsersRaw);
          const idx = storedUsers.findIndex((u) => u.phone === updated.phone);
          if (idx !== -1) {
            storedUsers[idx] = { ...storedUsers[idx], ...fields };
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(storedUsers));
          }
        }
      } catch {}
      return updated;
    });
  }, []);

  const register = useCallback((phone: string, password: string, inviteCode?: string) => {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid phone number (at least 10 digits).' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    try {
      const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
      const storedUsers: StoredUserAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const exists = storedUsers.some((u) => u.phone === cleanPhone);
      if (exists) {
        return { success: false, message: 'This phone number is already registered! Please log in.' };
      }

      const newUser: StoredUserAccount = {
        id: `UID${Math.floor(100000 + Math.random() * 900000)}`,
        nickname: `User_${cleanPhone.slice(-4)}`,
        vipLevel: 0,
        balance: 0.0, // REAL 0.00 BDT BALANCE, NO FAKE DEMO 50000!
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        phone: cleanPhone,
        password: password,
        inviteCode: inviteCode || '37276100176',
      };

      storedUsers.push(newUser);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(storedUsers));
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      setCurrentRoute('home');
      setRouteHistory(['home']);

      return { success: true, message: 'Registration successful! Welcome to your account.' };
    } catch {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }, []);

  const login = useCallback((phone: string, password: string) => {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      return { success: false, message: 'Please enter your phone number.' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    try {
      const storedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
      const storedUsers: StoredUserAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const found = storedUsers.find((u) => u.phone === cleanPhone && u.password === password);
      if (!found) {
        return { success: false, message: 'Invalid phone number or password!' };
      }

      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(found));
      setUser(found);
      setIsAuthenticated(true);
      setCurrentRoute('home');
      setRouteHistory(['home']);

      return { success: true, message: 'Logged in successfully!' };
    } catch {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {}
    setUser(emptyGuestUser);
    setIsAuthenticated(false);
    setCurrentRoute('login');
    setRouteHistory(['login']);
  }, []);

  const updateBankAccount = useCallback((account: BankAccount) => {
    setBankAccount(account);
    showToast('Bank details updated successfully!', 'success');
  }, [showToast]);

  const togglePhoneFrame = useCallback(() => {
    setIsPhoneFrame((prev) => !prev);
  }, []);

  // Mode durations in seconds
  const getModeDuration = (mode: WinGoMode) => {
    switch (mode) {
      case '30s': return 30;
      case '1m': return 60;
      case '3m': return 180;
      case '5m': return 300;
    }
  };

  // Reset timer when changing mode
  useEffect(() => {
    setWinGoSecondsLeft(getModeDuration(activeWinGoMode));
  }, [activeWinGoMode]);

  // Current period code
  const currentPeriod = `DEMO-000${periodCounter}`;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setWinGoSecondsLeft((prev) => {
        if (prev <= 1) {
          // Round completed! Generate result
          const newNumber = Math.floor(Math.random() * 10);
          const bigSmall = newNumber >= 5 ? 'Big' : 'Small';
          let color: GameHistoryItem['color'] = 'green';

          if (newNumber === 0) {
            color = 'violet-red';
          } else if (newNumber === 5) {
            color = 'violet-green';
          } else if (newNumber % 2 === 0) {
            color = 'red';
          } else {
            color = 'green';
          }

          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

          const newResult: GameHistoryItem = {
            period: `DEMO-000${periodCounter}`,
            number: newNumber,
            bigSmall,
            color,
            timestamp: timeStr,
          };

          setGameHistory((h) => [newResult, ...h.slice(0, 49)]);

          // Evaluate user bets for this period
          setUserBets((prevBets) => {
            let totalWinAmount = 0;
            const updated = prevBets.map((bet) => {
              if (bet.period === newResult.period && bet.status === 'Pending') {
                let isWon = false;
                let multiplier = 2;

                if (bet.selection === 'Big' && bigSmall === 'Big') {
                  isWon = true;
                  multiplier = 2;
                } else if (bet.selection === 'Small' && bigSmall === 'Small') {
                  isWon = true;
                  multiplier = 2;
                } else if (bet.selection === 'Green' && (color === 'green' || color === 'violet-green')) {
                  isWon = true;
                  multiplier = color === 'violet-green' ? 1.5 : 2;
                } else if (bet.selection === 'Red' && (color === 'red' || color === 'violet-red')) {
                  isWon = true;
                  multiplier = color === 'violet-red' ? 1.5 : 2;
                } else if (bet.selection === 'Violet' && (newNumber === 0 || newNumber === 5)) {
                  isWon = true;
                  multiplier = 4.5;
                } else if (bet.selection === String(newNumber)) {
                  isWon = true;
                  multiplier = 9;
                }

                const payout = isWon ? bet.totalBet * multiplier : 0;
                if (isWon) {
                  totalWinAmount += payout;
                }

                return {
                  ...bet,
                  status: (isWon ? 'Won' : 'Lost') as 'Won' | 'Lost',
                  payout,
                };
              }
              return bet;
            });

            if (totalWinAmount > 0) {
              setUser((u) => ({ ...u, balance: Number((u.balance + totalWinAmount).toFixed(2)) }));
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
              });
              showToast(`🎉 Round result: ${newNumber} (${bigSmall})! You won ৳ ${totalWinAmount.toFixed(2)}!`, 'success');
            }

            return updated;
          });

          // Advance period counter
          setPeriodCounter((c) => c + 1);
          return getModeDuration(activeWinGoMode);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWinGoMode, periodCounter, showToast]);

  // Place bet handler
  const placeBet = useCallback(
    (selection: string, baseAmount: number, multiplier: number) => {
      if (!isAuthenticated) {
        showToast('Please log in or register before placing a bet!', 'error');
        setCurrentRoute('login');
        return false;
      }

      const totalCost = baseAmount * multiplier;
      if (user.balance < totalCost) {
        showToast('Insufficient wallet balance. Please make a deposit first!', 'error');
        setCurrentRoute('deposit');
        return false;
      }

      updateUser({ balance: Number((user.balance - totalCost).toFixed(2)) });

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newBet: UserBet = {
        id: `BET-${Date.now().toString().slice(-6)}`,
        period: currentPeriod,
        gameMode: activeWinGoMode,
        selection,
        amount: baseAmount,
        multiplier,
        totalBet: totalCost,
        status: 'Pending',
        payout: 0,
        time: timeStr,
      };

      setUserBets((prev) => [newBet, ...prev]);

      // Progress mission
      setMissions((prev) =>
        prev.map((m) =>
          m.id === 'M-2' ? { ...m, progress: Math.min(m.total, m.progress + 1) } : m
        )
      );

      showToast(`Bet of ৳ ${totalCost.toFixed(2)} on [${selection}] placed!`, 'success');
      return true;
    },
    [activeWinGoMode, currentPeriod, isAuthenticated, showToast, updateUser, user.balance]
  );

  // Claim invite achievement
  const claimAchievement = useCallback(
    (id: number) => {
      setAchievements((prev) =>
        prev.map((item) => {
          if (item.id === id && !item.claimed) {
            updateUser({ balance: Number((user.balance + item.rewardAmount).toFixed(2)) });
            confetti({ particleCount: 50, spread: 60 });
            showToast(`Claimed ৳ ${item.rewardAmount.toFixed(2)} achievement reward!`, 'success');
            return { ...item, claimed: true };
          }
          return item;
        })
      );
    },
    [showToast, updateUser, user.balance]
  );

  // Claim daily sign in
  const claimDailySignIn = useCallback(() => {
    if (hasClaimedToday) {
      showToast('You already claimed today\'s sign-in reward!', 'info');
      return;
    }
    const reward = 5.0 + signInStreak * 2.5;
    updateUser({ balance: Number((user.balance + reward).toFixed(2)) });
    setHasClaimedToday(true);
    setSignInStreak((s) => s + 1);
    confetti({ particleCount: 70, spread: 80 });
    showToast(`Daily Sign-in bonus ৳ ${reward.toFixed(2)} collected! Streak: ${signInStreak + 1} days`, 'success');
  }, [hasClaimedToday, showToast, signInStreak, updateUser, user.balance]);

  // Claim Mission
  const claimMission = useCallback(
    (id: string) => {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === id && !m.claimed && m.progress >= m.total) {
            updateUser({ balance: Number((user.balance + m.reward).toFixed(2)) });
            confetti({ particleCount: 40 });
            showToast(`Mission completed! +৳ ${m.reward.toFixed(2)} added!`, 'success');
            return { ...m, claimed: true };
          }
          return m;
        })
      );
    },
    [showToast, updateUser, user.balance]
  );

  // Mark message read
  const markMessageRead = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }, []);

  const unreadMessageCount = messages.filter((m) => !m.read).length;

  // Deposit
  const depositDemo = useCallback(
    (amount: number, channel: string) => {
      updateUser({ balance: Number((user.balance + amount).toFixed(2)) });
      showToast(`Deposit of ৳ ${amount.toFixed(2)} via ${channel} received!`, 'success');
    },
    [showToast, updateUser, user.balance]
  );

  // Withdraw
  const withdrawDemo = useCallback(
    (amount: number, bank: string) => {
      if (user.balance < amount) {
        showToast('Withdrawal amount exceeds available balance!', 'error');
        return false;
      }
      updateUser({ balance: Number((user.balance - amount).toFixed(2)) });
      showToast(`Withdrawal request for ৳ ${amount.toFixed(2)} to ${bank} submitted!`, 'success');
      return true;
    },
    [showToast, updateUser, user.balance]
  );

  // Refresh balance simulation
  const refreshBalance = useCallback(() => {
    setIsRefreshingBalance(true);
    setTimeout(() => {
      setIsRefreshingBalance(false);
      showToast('Wallet balance synchronized', 'info');
    }, 600);
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeHistory,
        navigate,
        goBack,
        user,
        updateUser,
        isAuthenticated,
        login,
        register,
        logout,
        bankAccount,
        updateBankAccount,
        activeWinGoMode,
        setActiveWinGoMode,
        winGoSecondsLeft,
        currentPeriod,
        gameHistory,
        userBets,
        placeBet,
        inviteStats,
        achievements,
        claimAchievement,
        signInStreak,
        hasClaimedToday,
        claimDailySignIn,
        missions,
        claimMission,
        messages,
        markMessageRead,
        unreadMessageCount,
        depositDemo,
        withdrawDemo,
        refreshBalance,
        isRefreshingBalance,
        toasts,
        showToast,
        removeToast,
        isPhoneFrame,
        togglePhoneFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
