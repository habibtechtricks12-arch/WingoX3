export type PageRoute =
  | 'home'
  | 'slots'
  | 'aviator'
  | 'super-ace'
  | 'lottery'
  | 'invite'
  | 'invite/overview'
  | 'invite/rewards'
  | 'invite/earnings'
  | 'invite/records'
  | 'invite/list'
  | 'reward'
  | 'member'
  | 'member/betting-record'
  | 'member/profit-loss'
  | 'member/deposit-record'
  | 'member/withdrawal-record'
  | 'member/account-record'
  | 'member/security'
  | 'member/mission'
  | 'member/rebate'
  | 'member/messages'
  | 'member/suggestion'
  | 'member/download'
  | 'member/customer-service'
  | 'deposit'
  | 'withdrawal'
  | 'bank-account'
  | 'admin'
  | 'login'
  | 'register';

export * from './deposit';
export * from './withdrawal';




export interface UserProfile {
  id: string;
  nickname: string;
  vipLevel: number;
  balance: number;
  joinedDate: string;
  avatar: string;
  phone: string;
  inviteCode?: string;
}

export interface StoredUserAccount extends UserProfile {
  password: string;
}

export interface BankAccount {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  mobileNumber: string;
}

export type WinGoMode = '30s' | '1m' | '3m' | '5m';

export type GameColor = 'green' | 'violet' | 'red';

export interface GameHistoryItem {
  period: string;
  number: number;
  bigSmall: 'Big' | 'Small';
  color: GameColor | 'violet-red' | 'violet-green';
  timestamp: string;
}

export interface UserBet {
  id: string;
  period: string;
  gameMode: WinGoMode;
  selection: string; // 'Green', 'Violet', 'Red', 'Big', 'Small', '0'-'9'
  amount: number;
  multiplier: number;
  totalBet: number;
  status: 'Pending' | 'Won' | 'Lost';
  payout: number;
  time: string;
}

export interface InviteStats {
  todayIncome: number;
  yesterdayIncome: number;
  registers: number;
  validReferral: number;
  depositors: number;
  totalIncome: number;
  invitationRewards: number;
  achievementRewards: number;
  depositRebate: number;
  bettingRebate: number;
}

export interface AchievementReward {
  id: number;
  targetReferrals: number;
  rewardAmount: number;
  claimed: boolean;
}

export interface MessageItem {
  id: string;
  title: string;
  date: string;
  preview: string;
  content: string;
  read: boolean;
  category: 'System' | 'Bonus' | 'Security';
}

export interface MissionItem {
  id: string;
  title: string;
  desc: string;
  reward: number;
  progress: number;
  total: number;
  claimed: boolean;
}
