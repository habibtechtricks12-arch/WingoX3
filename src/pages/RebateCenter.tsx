import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Percent, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export const RebateCenter: React.FC = () => {
  const { user, showToast } = useApp();

  const handleClaimRebate = () => {
    showToast('All pending game rebates have been computed and claimed!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Game Rebate" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 shadow-lg border border-teal-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-300 uppercase">
                AUTOMATIC CASHBACK
              </span>
              <h3 className="text-base font-extrabold text-white">Daily VIP Rebate</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-teal-800/60">
            <div>
              <span className="text-[11px] text-slate-400 block">Available To Claim</span>
              <span className="text-2xl font-mono font-extrabold text-amber-400">৳ 0.00</span>
            </div>
            <button
              onClick={handleClaimRebate}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              One-Click Claim
            </button>
          </div>
        </div>

        {/* VIP Rebate Rates Table */}
        <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-md space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Rebate Tier Rates</h4>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-slate-800">VIP0 - VIP2</span>
              <span className="font-mono font-bold text-amber-600">0.60%</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-slate-800">VIP3 - VIP5</span>
              <span className="font-mono font-bold text-amber-600">0.80%</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-slate-800">VIP6 - VIP8</span>
              <span className="font-mono font-bold text-amber-600">1.00%</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-slate-800">VIP9 - VIP18</span>
              <span className="font-mono font-bold text-amber-600">1.20%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Rebates are calculated every night at 00:00:00 based on total turnover in WinGo and lottery games.
          </p>
        </div>
      </main>
    </div>
  );
};
