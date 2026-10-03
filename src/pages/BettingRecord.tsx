import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { FileSpreadsheet, ChevronDown, Calendar, Search } from 'lucide-react';

export const BettingRecord: React.FC = () => {
  const { userBets } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filtered bets
  const filteredBets = userBets.filter((bet) => {
    if (filterStatus === 'Won' && bet.status !== 'Won') return false;
    if (filterStatus === 'Lost' && bet.status !== 'Lost') return false;
    if (filterStatus === 'Pending' && bet.status !== 'Pending') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Betting Record" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-3.5">
        {/* Filter Bar */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Games (WinGo)</option>
            <option value="30s">WinGo 30s</option>
            <option value="1m">WinGo 1M</option>
            <option value="3m">WinGo 3M</option>
            <option value="5m">WinGo 5M</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Bets List */}
        <div className="space-y-2.5">
          {filteredBets.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 border border-slate-100 shadow-sm text-center">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">No Betting Records</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Play any round in WinGo Lottery to view your bet settlement history.
              </p>
            </div>
          ) : (
            filteredBets.map((bet) => (
              <div
                key={bet.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">WinGo {bet.gameMode}</span>
                    <span className="font-mono text-xs text-slate-500">[{bet.period}]</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      bet.status === 'Won'
                        ? 'bg-emerald-50 text-emerald-600'
                        : bet.status === 'Lost'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {bet.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Selection</span>
                    <span className="font-bold text-slate-800">{bet.selection}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Bet</span>
                    <span className="font-mono font-bold text-slate-800">৳ {bet.totalBet.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Settlement</span>
                    <span
                      className={`font-mono font-bold ${
                        bet.status === 'Won'
                          ? 'text-emerald-600'
                          : bet.status === 'Lost'
                          ? 'text-rose-500'
                          : 'text-amber-600'
                      }`}
                    >
                      {bet.status === 'Won' ? `+৳ ${bet.payout.toFixed(2)}` : bet.status === 'Lost' ? '-৳ ' + bet.totalBet.toFixed(2) : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono text-right pt-1 border-t border-slate-50">
                  {bet.time}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
