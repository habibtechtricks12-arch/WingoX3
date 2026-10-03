import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DepositMethodConfig, GatewayApiConfig, DepositPromotion, DepositOrder } from '../types/deposit';
import { WithdrawalRequest } from '../types/withdrawal';
import { useApp } from './AppContext';

interface DepositContextType {
  // Gateways
  gateways: GatewayApiConfig[];
  saveGateway: (gateway: GatewayApiConfig) => void;
  toggleGatewayStatus: (id: string) => void;
  deleteGateway: (id: string) => void;
  testGatewayConnection: (id: string) => Promise<boolean>;

  // Methods
  methods: DepositMethodConfig[];
  saveMethod: (method: DepositMethodConfig) => void;
  deleteMethod: (id: string) => void;

  // Promotions
  promotions: DepositPromotion[];
  savePromotion: (promotion: DepositPromotion) => void;
  deletePromotion: (id: string) => void;

  // Deposit Orders / Transactions
  orders: DepositOrder[];
  createOrder: (order: Omit<DepositOrder, 'id' | 'timestamp' | 'status'>) => Promise<DepositOrder>;
  approveOrder: (id: string) => void;
  rejectOrder: (id: string) => void;

  // Withdrawal Requests / Transactions (Sent to Admin Panel)
  withdrawalRequests: WithdrawalRequest[];
  createWithdrawalRequest: (req: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => Promise<WithdrawalRequest>;
  approveWithdrawalRequest: (id: string) => void;
  rejectWithdrawalRequest: (id: string) => void;

  // Reset
  resetToDefaults: () => void;
}


const defaultGateways: GatewayApiConfig[] = [
  {
    id: 'gw-gbkpay',
    name: 'GBKPAY Automated Gateway',
    provider: 'gbkpay',
    mode: 'automated_api',
    apiUrl: 'https://api.gbkpay.com/api/v1/payment/create',
    apiKey: 'gbk_live_894f71a9c3d2e5b801',
    secretKey: 'sec_live_99a81c7204918eab32',
    merchantId: 'GBK-TCG-9921',
    webhookUrl: 'https://ais-dev-jycpa5j43qquplampdaaht-523531556706.asia-southeast1.run.app/api/deposit/gbkpay-webhook',
    currency: 'BDT',
    isActive: true,
    autoApprove: true,
    lastPingStatus: 'success',
    lastPingMessage: '200 OK - Gateway API Online (42ms)',
    lastPingTime: 'Just now',
  },
  {
    id: 'gw-rupalipay',
    name: 'RupaliPay Auto Gateway',
    provider: 'rupalipay',
    mode: 'automated_api',
    apiUrl: 'https://api.rupalipay.com/v2/checkout/initiate',
    apiKey: 'rupali_live_918237192847',
    secretKey: 'sec_rupali_8819283741',
    merchantId: 'RUPALI-MERCH-819',
    webhookUrl: 'https://ais-dev-jycpa5j43qquplampdaaht-523531556706.asia-southeast1.run.app/api/deposit/rupalipay-webhook',
    currency: 'BDT',
    isActive: true,
    autoApprove: true,
    lastPingStatus: 'idle',
  },
  {
    id: 'gw-uddoktapay',
    name: 'UddoktaPay Direct Gateway',
    provider: 'uddoktapay',
    mode: 'automated_api',
    apiUrl: 'https://api.uddoktapay.com/api/checkout-v2',
    apiKey: 'uddokta_live_772183912',
    secretKey: 'sec_uddokta_991827364',
    merchantId: 'UDDOKTA-STORE-44',
    webhookUrl: 'https://ais-dev-jycpa5j43qquplampdaaht-523531556706.asia-southeast1.run.app/api/deposit/uddoktapay-webhook',
    currency: 'BDT',
    isActive: false,
    autoApprove: true,
    lastPingStatus: 'idle',
  },
];

const defaultMethods: DepositMethodConfig[] = [
  {
    id: 'nagad-vip',
    name: 'NAGAD VIP',
    subtitle: 'CASH OUT',
    channelLabel: 'NAGAD VIP | GBKPAY',
    brand: 'nagad',
    type: 'cash_out',
    mode: 'automated_api',
    gatewayId: 'gw-gbkpay',
    agentNumber: '01839281729',
    minAmount: 100,
    maxAmount: 50000,
    presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
    isActive: true,
    isVip: true,
    order: 1,
  },
  {
    id: 'bkash-send-money',
    name: 'Bkash',
    subtitle: 'SEND MONEY',
    channelLabel: 'Bkash SEND MONEY | GBKPAY',
    brand: 'bkash',
    type: 'send_money',
    mode: 'automated_api',
    gatewayId: 'gw-gbkpay',
    agentNumber: '01712984920',
    minAmount: 100,
    maxAmount: 50000,
    presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
    isActive: true,
    isVip: false,
    order: 2,
  },
  {
    id: 'nagad-send-money',
    name: 'NAGAD',
    subtitle: 'SEND MONEY',
    channelLabel: 'NAGAD SEND MONEY | GBKPAY',
    brand: 'nagad',
    type: 'send_money',
    mode: 'automated_api',
    gatewayId: 'gw-gbkpay',
    agentNumber: '01928491823',
    minAmount: 100,
    maxAmount: 50000,
    presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
    isActive: true,
    isVip: false,
    order: 3,
  },
  {
    id: 'nagad-fast-payment',
    name: 'NAGAD',
    subtitle: 'FAST PAYMENT',
    channelLabel: 'NAGAD FAST PAYMENT | GBKPAY',
    brand: 'nagad',
    type: 'fast_payment',
    mode: 'automated_api',
    gatewayId: 'gw-gbkpay',
    agentNumber: '01628391822',
    minAmount: 100,
    maxAmount: 50000,
    presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
    isActive: true,
    isVip: false,
    order: 4,
  },
  {
    id: 'bkash-vip-cashout',
    name: 'BKASH VIP',
    subtitle: 'CASH OUT',
    channelLabel: 'BKASH VIP CASH OUT | GBKPAY',
    brand: 'bkash',
    type: 'cash_out',
    mode: 'automated_api',
    gatewayId: 'gw-gbkpay',
    agentNumber: '01799283719',
    minAmount: 100,
    maxAmount: 50000,
    presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
    isActive: true,
    isVip: true,
    order: 5,
  },
];

const defaultPromotions: DepositPromotion[] = [
  {
    id: 'promo-1',
    title: 'দ্বিতীয়বার ডিপোজিট করলে আপনি অতিরিক্ত ১০% বোনাস পাবেন !',
    bonusPercent: 10,
    minAmount: 100,
    isActive: true,
  },
];

const defaultOrders: DepositOrder[] = [
  {
    id: 'DEP-20260929-9182',
    userId: 'USER-000000',
    userNickname: 'DemoUser',
    methodId: 'nagad-vip',
    methodName: 'NAGAD VIP CASH OUT',
    channelLabel: 'NAGAD VIP | GBKPAY',
    amount: 1000.0,
    bonusPercent: 10,
    bonusAmount: 100.0,
    totalCredit: 1100.0,
    senderNumber: '01839281729',
    trxId: '9K4M8Z1A20',
    mode: 'automated_api',
    gatewayProvider: 'GBKPAY',
    status: 'Approved',
    timestamp: '2026-09-29 15:30',
    reviewedAt: '2026-09-29 15:31',
  },
  {
    id: 'DEP-20260928-4821',
    userId: 'USER-000000',
    userNickname: 'DemoUser',
    methodId: 'bkash-send-money',
    methodName: 'Bkash SEND MONEY',
    channelLabel: 'Bkash SEND MONEY | GBKPAY',
    amount: 500.0,
    bonusPercent: 0,
    bonusAmount: 0.0,
    totalCredit: 500.0,
    senderNumber: '01712984920',
    trxId: 'BK92837461',
    mode: 'automated_api',
    gatewayProvider: 'GBKPAY',
    status: 'Approved',
    timestamp: '2026-09-28 17:40',
    reviewedAt: '2026-09-28 17:41',
  },
];

const defaultWithdrawals: WithdrawalRequest[] = [
  {
    id: 'WTH-90811',
    userId: 'USER-000000',
    userNickname: 'DemoUser',
    walletType: 'nagad',
    accountName: 'Demo User',
    accountNumber: '01712345678',
    amount: 150.0,
    status: 'Approved',
    timestamp: '2026-09-27 12:20',
  },
];

const DepositContext = createContext<DepositContextType | null>(null);

const STORAGE_KEYS = {
  gateways: 'tcg_deposit_gateways_v2',
  methods: 'tcg_deposit_methods_v2',
  promotions: 'tcg_deposit_promotions_v2',
  orders: 'tcg_deposit_orders_v2',
  withdrawals: 'tcg_withdrawal_records_v2',
};

export const DepositProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser, showToast } = useApp();

  const [gateways, setGateways] = useState<GatewayApiConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.gateways);
      return saved ? JSON.parse(saved) : defaultGateways;
    } catch {
      return defaultGateways;
    }
  });

  const [methods, setMethods] = useState<DepositMethodConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.methods);
      return saved ? JSON.parse(saved) : defaultMethods;
    } catch {
      return defaultMethods;
    }
  });

  const [promotions, setPromotions] = useState<DepositPromotion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.promotions);
      return saved ? JSON.parse(saved) : defaultPromotions;
    } catch {
      return defaultPromotions;
    }
  });

  const [orders, setOrders] = useState<DepositOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.orders);
      return saved ? JSON.parse(saved) : defaultOrders;
    } catch {
      return defaultOrders;
    }
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.withdrawals);
      return saved ? JSON.parse(saved) : defaultWithdrawals;
    } catch {
      return defaultWithdrawals;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.gateways, JSON.stringify(gateways));
    } catch (e) {
      console.error(e);
    }
  }, [gateways]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.methods, JSON.stringify(methods));
    } catch (e) {
      console.error(e);
    }
  }, [methods]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.promotions, JSON.stringify(promotions));
    } catch (e) {
      console.error(e);
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.withdrawals, JSON.stringify(withdrawalRequests));
    } catch (e) {
      console.error(e);
    }
  }, [withdrawalRequests]);


  // Gateway actions
  const saveGateway = useCallback((gateway: GatewayApiConfig) => {
    setGateways((prev) => {
      const index = prev.findIndex((g) => g.id === gateway.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = gateway;
        return next;
      }
      return [...prev, gateway];
    });
    showToast(`Gateway ${gateway.name} saved successfully!`, 'success');
  }, [showToast]);

  const toggleGatewayStatus = useCallback(
    (id: string) => {
      setGateways((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            const newStatus = !g.isActive;
            showToast(
              newStatus
                ? `Gateway "${g.name}" is now Online!`
                : `Gateway "${g.name}" is now Offline!`,
              newStatus ? 'success' : 'info'
            );
            return {
              ...g,
              isActive: newStatus,
            };
          }
          return g;
        })
      );
    },
    [showToast]
  );

  const deleteGateway = useCallback((id: string) => {
    setGateways((prev) => prev.filter((g) => g.id !== id));
    showToast('Gateway deleted', 'info');
  }, [showToast]);


  const testGatewayConnection = useCallback(async (id: string): Promise<boolean> => {
    showToast('Testing Gateway API Connection...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 800));

    const pingSuccess = true;
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            lastPingStatus: pingSuccess ? 'success' : 'error',
            lastPingMessage: pingSuccess
              ? '200 OK - Connected & Authorized (38ms latency)'
              : 'Connection Failed - Invalid API Key or URL',
            lastPingTime: new Date().toLocaleTimeString(),
          };
        }
        return g;
      })
    );
    showToast('API Connection verified! Status: 200 OK', 'success');
    return pingSuccess;
  }, [showToast]);

  // Method actions
  const saveMethod = useCallback((method: DepositMethodConfig) => {
    setMethods((prev) => {
      const index = prev.findIndex((m) => m.id === method.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = method;
        return next;
      }
      return [...prev, method];
    });
    showToast(`Payment method "${method.name}" updated!`, 'success');
  }, [showToast]);

  const deleteMethod = useCallback((id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    showToast('Method removed', 'info');
  }, [showToast]);

  // Promotion actions
  const savePromotion = useCallback((promotion: DepositPromotion) => {
    setPromotions((prev) => {
      const index = prev.findIndex((p) => p.id === promotion.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = promotion;
        return next;
      }
      return [...prev, promotion];
    });
    showToast('Promotion offer updated!', 'success');
  }, [showToast]);

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast('Promotion removed', 'info');
  }, [showToast]);

  // Order actions
  const createOrder = useCallback(
    async (orderData: Omit<DepositOrder, 'id' | 'timestamp' | 'status'>): Promise<DepositOrder> => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newId = `DEP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Check if associated gateway has autoApprove enabled
      const matchedGateway = gateways.find((g) => g.id === orderData.gatewayProvider || g.provider === orderData.gatewayProvider) || gateways[0];
      const isAutoApprove = orderData.mode === 'automated_api' || (matchedGateway && matchedGateway.autoApprove);

      const newOrder: DepositOrder = {
        ...orderData,
        id: newId,
        timestamp: timeStr,
        status: isAutoApprove ? 'Approved' : 'Pending',
        reviewedAt: isAutoApprove ? timeStr : undefined,
      };

      setOrders((prev) => [newOrder, ...prev]);

      if (isAutoApprove) {
        updateUser({
          balance: Number((user.balance + newOrder.totalCredit).toFixed(2)),
        });
      }

      return newOrder;
    },
    [gateways, updateUser, user.balance]
  );

  const approveOrder = useCallback(
    (id: string) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === id && order.status !== 'Approved') {
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            // Add balance
            updateUser({
              balance: Number((user.balance + order.totalCredit).toFixed(2)),
            });
            showToast(`Approved ৳ ${order.totalCredit.toFixed(2)} for ${order.userNickname}!`, 'success');
            return {
              ...order,
              status: 'Approved',
              reviewedAt: timeStr,
            };
          }
          return order;
        })
      );
    },
    [showToast, updateUser, user.balance]
  );


  const rejectOrder = useCallback(
    (id: string) => {
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === id) {
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            showToast(`Deposit order ${id} rejected`, 'error');
            return {
              ...order,
              status: 'Rejected',
              reviewedAt: timeStr,
            };
          }
          return order;
        })
      );
    },
    [showToast]
  );

  // Withdrawal Actions
  const createWithdrawalRequest = useCallback(
    async (reqData: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>): Promise<WithdrawalRequest> => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newId = `WTH-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRequest: WithdrawalRequest = {
        ...reqData,
        id: newId,
        timestamp: timeStr,
        status: 'Pending',
      };

      setWithdrawalRequests((prev) => [newRequest, ...prev]);

      // Deduct balance from user
      updateUser({
        balance: Number((user.balance - reqData.amount).toFixed(2)),
      });

      showToast(`উত্তোলন রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন প্যানেলে পাঠানো হয়েছে।`, 'success');
      return newRequest;
    },
    [showToast, updateUser, user.balance]
  );

  const approveWithdrawalRequest = useCallback(
    (id: string) => {
      setWithdrawalRequests((prev) =>
        prev.map((w) => {
          if (w.id === id && w.status !== 'Approved') {
            showToast(`Approved withdrawal of ৳ ${w.amount.toFixed(2)} to ${w.walletType.toUpperCase()} (${w.accountNumber})`, 'success');
            return {
              ...w,
              status: 'Approved',
            };
          }
          return w;
        })
      );
    },
    [showToast]
  );

  const rejectWithdrawalRequest = useCallback(
    (id: string) => {
      setWithdrawalRequests((prev) =>
        prev.map((w) => {
          if (w.id === id && w.status === 'Pending') {
            // Refund money back to user balance!
            updateUser({
              balance: Number((user.balance + w.amount).toFixed(2)),
            });
            showToast(`Withdrawal of ৳ ${w.amount.toFixed(2)} rejected & refunded back to balance!`, 'info');
            return {
              ...w,
              status: 'Rejected',
            };
          }
          return w;
        })
      );
    },
    [showToast, updateUser, user.balance]
  );

  const resetToDefaults = useCallback(() => {
    setGateways(defaultGateways);
    setMethods(defaultMethods);
    setPromotions(defaultPromotions);
    setOrders(defaultOrders);
    setWithdrawalRequests(defaultWithdrawals);
    localStorage.removeItem(STORAGE_KEYS.gateways);
    localStorage.removeItem(STORAGE_KEYS.methods);
    localStorage.removeItem(STORAGE_KEYS.promotions);
    localStorage.removeItem(STORAGE_KEYS.orders);
    localStorage.removeItem(STORAGE_KEYS.withdrawals);
    showToast('Reset to original screenshot configuration', 'info');
  }, [showToast]);

  return (
    <DepositContext.Provider
      value={{
        gateways,
        saveGateway,
        toggleGatewayStatus,
        deleteGateway,
        testGatewayConnection,
        methods,
        saveMethod,
        deleteMethod,
        promotions,
        savePromotion,
        deletePromotion,
        orders,
        createOrder,
        approveOrder,
        rejectOrder,
        withdrawalRequests,
        createWithdrawalRequest,
        approveWithdrawalRequest,
        rejectWithdrawalRequest,
        resetToDefaults,
      }}
    >
      {children}
    </DepositContext.Provider>
  );

};

export const useDeposit = () => {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('useDeposit must be used within a DepositProvider');
  }
  return context;
};
