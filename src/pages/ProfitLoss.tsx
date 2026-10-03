import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { PieChart, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

export const ProfitLoss: React.FC = () => {
  const { userBets } = useApp();
  const [periodFilter, setPeriodFilter] = useState('Today');

  // Compute metrics from user bets
  const totalBetAmount = userBets.reduce((acc, bet) => acc + bet.totalBet, 0);
  const totalPayout = userBets.reduce((acc, bet) => acc + (bet.status === 'Won' ? bet.payout : 0), 0);
  const netProfit = totalPayout - totalBetAmount;

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Profit And Loss" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* Date Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-xl">
          {['Today', 'Yesterday', 'This Week', 'This Month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                periodFilter === p
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Big Net Result Card */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Net Settlement Profit ({periodFilter})</span>
            {netProfit >= 0 ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <TrendingUp className="w-4 h-4" /> Surplus
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <TrendingDown className="w-4 h-4" /> Deficit
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 text-3xl font-extrabold font-mono">
            <span className={netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>৳</span>
            <span className={netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {netProfit >= 0 ? `+${netProfit.toFixed(2)}` : netProfit.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Bets Volume</span>
              <span className="font-mono font-bold text-white">৳ {totalBetAmount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Total Returned Winnings</span>
              <span className="font-mono font-bold text-amber-400">৳ {totalPayout.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-md space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Performance Breakdown</h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600">Total Rounds Played</span>
              <span className="font-mono font-bold text-slate-800">{userBets.length}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600">Winning Rounds</span>
              <span className="font-mono font-bold text-emerald-600">
                {userBets.filter((b) => b.status === 'Won').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600">Lost Rounds</span>
              <span className="font-mono font-bold text-rose-500">
                {userBets.filter((b) => b.status === 'Lost').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-600">VIP Rebate Collected</span>
              <span className="font-mono font-bold text-amber-600">৳ 0.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
