import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, ArrowDownToLine, ArrowUpFromLine, Wallet, ShieldCheck } from 'lucide-react';

export const WalletCard: React.FC = () => {
  const { user, refreshBalance, isRefreshingBalance, navigate } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-md p-4 transition-all">
      {/* Subtle background decoration */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-50 rounded-full blur-xl pointer-events-none" />

      {/* Top row: Label & Refresh */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Wallet Balance
          </span>
        </div>

        <button
          onClick={refreshBalance}
          disabled={isRefreshingBalance}
          className="p-1.5 rounded-full text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshingBalance ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>

      {/* Main Balance Display */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-xl font-bold text-amber-500">৳</span>
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
          {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Demo Safe
        </span>
      </div>

      {/* Action Buttons: Deposit and Withdraw */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => navigate('deposit')}
          className="flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-sm active:scale-98 transition-transform"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Deposit
        </button>

        <button
          onClick={() => navigate('withdrawal')}
          className="flex items-center justify-center gap-2 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm active:scale-98 transition-transform"
        >
          <ArrowUpFromLine className="w-4 h-4 text-amber-400" />
          Withdraw
        </button>
      </div>
    </div>
  );
};
