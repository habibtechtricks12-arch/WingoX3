export interface BoundEWallet {
  id: string;
  type: 'bkash' | 'nagad' | 'rocket' | 'upay';
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userNickname: string;
  walletType: 'bkash' | 'nagad' | 'rocket' | 'upay';
  accountName: string;
  accountNumber: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}
