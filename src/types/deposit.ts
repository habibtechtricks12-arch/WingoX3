export interface DepositMethodConfig {
  id: string;
  name: string;
  subtitle: string;
  channelLabel: string;
  brand: 'nagad' | 'bkash' | 'rocket' | 'upay' | 'other';
  type: 'cash_out' | 'send_money' | 'fast_payment' | 'auto_api';
  mode: 'automated_api' | 'manual_agent';
  gatewayId: string;
  agentNumber: string;
  minAmount: number;
  maxAmount: number;
  presets: number[];
  isActive: boolean;
  isVip: boolean;
  order: number;
}

export interface GatewayApiConfig {
  id: string;
  name: string;
  provider: 'gbkpay' | 'rupalipay' | 'uddoktapay' | 'surepay' | 'bkash_direct' | 'nagad_direct' | 'custom';
  mode: 'automated_api' | 'manual_agent';
  apiUrl: string;
  apiKey: string;
  secretKey: string;
  merchantId: string;
  webhookUrl: string;
  currency: string;
  isActive: boolean;
  autoApprove: boolean;
  lastPingStatus?: 'success' | 'error' | 'idle';
  lastPingMessage?: string;
  lastPingTime?: string;
}

export interface DepositPromotion {
  id: string;
  title: string;
  bonusPercent: number;
  minAmount: number;
  isActive: boolean;
}

export interface DepositOrder {
  id: string;
  userId: string;
  userNickname: string;
  methodId: string;
  methodName: string;
  channelLabel: string;
  amount: number;
  bonusPercent: number;
  bonusAmount: number;
  totalCredit: number;
  senderNumber: string;
  trxId: string;
  mode: 'automated_api' | 'manual_agent';
  gatewayProvider: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  reviewedAt?: string;
  notes?: string;
}
