import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useDeposit } from '../context/DepositContext';
import { Header } from '../components/Header';
import { Receipt, FileText, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Props {
  initialType?: 'all' | 'deposit' | 'withdrawal';
  pageTitle: string;
}

export const TransactionRecords: React.FC<Props> = ({ initialType = 'all', pageTitle }) => {
  const { user } = useApp();
  const { orders, withdrawalRequests } = useDeposit();
  const [activeType, setActiveType] = useState<'all' | 'deposit' | 'withdrawal'>(initialType);

  // Dynamic deposit records from DepositContext
  const dynamicDepositRecords = orders.map((o) => ({
    id: o.trxId || o.id,
    type: 'deposit' as const,
    title: `Deposit (${o.methodName})`,
    amount: o.totalCredit || o.amount,
    status: o.status,
    date: o.timestamp,
    isCredit: true,
  }));

  // Dynamic withdrawal records from DepositContext
  const dynamicWithdrawalRecords = withdrawalRequests.map((w) => ({
    id: w.id,
    type: 'withdrawal' as const,
    title: `Withdrawal to ${w.walletType.toUpperCase()} (${w.accountNumber})`,
    amount: w.amount,
    status: w.status,
    date: w.timestamp,
    isCredit: false,
  }));


  // Static baseline withdrawal/demo records
  const baseRecords = [
    {
      id: 'TXN-90811',
      type: 'withdrawal' as const,
      title: 'Demo Withdrawal to Nagad',
      amount: 150.0,
      status: 'Completed',
      date: '2026-09-27 12:20',
      isCredit: false,
    },
    {
      id: 'TXN-90809',
      type: 'deposit' as const,
      title: 'Welcome VIP0 Bonus Grant',
      amount: 50.0,
      status: 'Success',
      date: '2026-09-25 09:00',
      isCredit: true,
    },
  ];

  const allRecords = [...dynamicDepositRecords, ...dynamicWithdrawalRecords, ...baseRecords];


  const filtered = allRecords.filter((rec) => {
    if (activeType === 'deposit') return rec.type === 'deposit';
    if (activeType === 'withdrawal') return rec.type === 'withdrawal';
    return true;
  });


  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title={pageTitle} />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-3.5">
        {/* Type Filter Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200 rounded-xl">
          <button
            onClick={() => setActiveType('all')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeType === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => setActiveType('deposit')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeType === 'deposit'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveType('withdrawal')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeType === 'withdrawal'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Withdrawals
          </button>
        </div>

        {/* Records List */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-sm text-center">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">No Records</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No ledger activity for the selected category.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      item.isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {item.isCredit ? (
                      <ArrowDownToLine className="w-5 h-5" />
                    ) : (
                      <ArrowUpFromLine className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      {item.id} · {item.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm block ${
                      item.isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {item.isCredit ? `+৳ ${item.amount.toFixed(2)}` : `-৳ ${item.amount.toFixed(2)}`}
                  </span>
                  <span className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                    item.status === 'Approved' || item.status === 'Success' || item.status === 'Completed'
                      ? 'text-emerald-600'
                      : item.status === 'Pending'
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {item.status === 'Approved' || item.status === 'Success' || item.status === 'Completed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : item.status === 'Pending' ? (
                      <Clock className="w-3 h-3 animate-spin-slow" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {item.status}
                  </span>

                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
