import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ASSETS } from '../assets/assetPaths';
import {
  Timer,
  Shuffle,
  History,
  TrendingUp,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Volume2,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { WinGoMode, GameColor } from '../types';

export const Lottery: React.FC = () => {
  const {
    activeWinGoMode,
    setActiveWinGoMode,
    winGoSecondsLeft,
    currentPeriod,
    gameHistory,
    userBets,
    placeBet,
    user,
    navigate,
  } = useApp();

  // Active History Tab
  const [historyTab, setHistoryTab] = useState<'history' | 'chart' | 'myBets'>('history');

  // Bet Dialog State
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [betBaseAmount, setBetBaseAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [showBetModal, setShowBetModal] = useState<boolean>(false);

  // Pagination for game history table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Format countdown mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOpenBet = (selection: string) => {
    setSelectedBet(selection);
    setShowBetModal(true);
  };

  const handleConfirmBet = () => {
    if (!selectedBet) return;
    const success = placeBet(selectedBet, betBaseAmount, multiplier);
    if (success) {
      setShowBetModal(false);
    }
  };

  const handleRandomBet = () => {
    const options = ['Green', 'Red', 'Violet', 'Big', 'Small', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const randomChoice = options[Math.floor(Math.random() * options.length)];
    setSelectedBet(randomChoice);
    setShowBetModal(true);
  };

  // Color badge helper
  const renderColorBadge = (color: string) => {
    if (color === 'violet-red') {
      return (
        <div className="flex items-center justify-center gap-0.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
        </div>
      );
    }
    if (color === 'violet-green') {
      return (
        <div className="flex items-center justify-center gap-0.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
        </div>
      );
    }
    if (color === 'green') {
      return <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />;
    }
    if (color === 'violet') {
      return <span className="w-3 h-3 rounded-full bg-violet-500 inline-block" />;
    }
    return <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />;
  };

  // Number badge helper
  const getNumberColorClass = (num: number) => {
    if (num === 0) return 'bg-gradient-to-r from-violet-600 to-red-500 text-white';
    if (num === 5) return 'bg-gradient-to-r from-violet-600 to-emerald-500 text-white';
    if (num % 2 === 0) return 'bg-red-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  // Pagination calculation
  const totalPages = Math.ceil(gameHistory.length / pageSize) || 1;
  const paginatedHistory = gameHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      {/* Header */}
      <Header
        title="Lottery"
        rightAction={
          <button
            onClick={() => navigate('member/betting-record')}
            className="p-1.5 rounded-full hover:bg-[#0F3C4D] text-[#FBBF24] transition-colors"
            title="Betting History"
          >
            <History className="w-5 h-5" />
          </button>
        }
      />

      <main className="max-w-lg mx-auto px-3.5 py-3 space-y-3.5">
        {/* Category Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-teal-950 p-4 text-white shadow-md border border-amber-500/30">
          <img
            src={ASSETS.lotteryBanner}
            alt="Wingo X 3 Lottery"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase block">
                Wingo X 3
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">LOTTERY</h2>
              <p className="text-xs text-amber-100/90 mt-0.5">WinGo Color & Number Prediction</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-200 block">Wallet Balance</span>
              <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-base">
                <span>৳</span>
                <span>{user.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WinGo Section Mode Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#082935] border border-[#114454] rounded-2xl">
          {(['30s', '1m', '3m', '5m'] as WinGoMode[]).map((mode) => {
            const active = activeWinGoMode === mode;
            const labels: Record<WinGoMode, string> = {
              '30s': 'WinGo 30s',
              '1m': 'WinGo 1M',
              '3m': 'WinGo 3M',
              '5m': 'WinGo 5M',
            };
            return (
              <button
                key={mode}
                onClick={() => setActiveWinGoMode(mode)}
                className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* Game Panel */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-md space-y-4 text-slate-100">
          {/* Header Row: Game Title, Period, and Timer */}
          <div className="flex items-center justify-between pb-3 border-b border-[#103D4C]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                WinGo {activeWinGoMode === '30s' ? '30sec' : activeWinGoMode}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400 font-medium">Period:</span>
                <span className="font-mono text-xs font-bold text-amber-300 tracking-tight">
                  {currentPeriod}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Time Remaining
              </span>
              <div className="flex items-center gap-1.5 bg-[#051C23] border border-[#124252] text-amber-400 px-3 py-1 rounded-xl shadow-inner font-mono text-base font-bold">
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{formatTime(winGoSecondsLeft)}</span>
              </div>
            </div>
          </div>

          {/* Color Choices: Green, Violet, Red */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Select Color:</span>
              <span className="text-[11px] text-amber-600">Green 2x · Violet 4.5x · Red 2x</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handleOpenBet('Green')}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md active:scale-98 transition-transform"
              >
                Green
              </button>
              <button
                onClick={() => handleOpenBet('Violet')}
                className="py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md active:scale-98 transition-transform"
              >
                Violet
              </button>
              <button
                onClick={() => handleOpenBet('Red')}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md active:scale-98 transition-transform"
              >
                Red
              </button>
            </div>
          </div>

          {/* Number Selection 0-9 */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Select Number:</span>
              <span className="text-[11px] text-amber-600">Payout: 9X</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleOpenBet(String(num))}
                  className={`h-11 rounded-xl font-mono text-base font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center ${getNumberColorClass(
                    num
                  )}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Other Controls: Random, Big, Small */}
          <div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleRandomBet}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs shadow-xs active:scale-98 transition-all"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                Random
              </button>
              <button
                onClick={() => handleOpenBet('Big')}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm active:scale-98 transition-all"
              >
                Big (5-9)
              </button>
              <button
                onClick={() => handleOpenBet('Small')}
                className="py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
              >
                Small (0-4)
              </button>
            </div>
          </div>

          {/* Multiplier Quick Buttons */}
          <div>
            <div className="text-xs text-slate-500 mb-1 font-medium">Multipliers:</div>
            <div className="grid grid-cols-6 gap-1">
              {[1, 5, 10, 20, 50, 100].map((m) => (
                <button
                  key={m}
                  onClick={() => setMultiplier(m)}
                  className={`py-1 rounded-lg text-xs font-bold transition-all ${
                    multiplier === m
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  X{m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Game History / Chart / My History */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-md space-y-3">
          {/* History Sub-tabs */}
          <div className="flex items-center border-b border-[#124252] pb-1">
            <button
              onClick={() => setHistoryTab('history')}
              className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all ${
                historyTab === 'history'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Game History
            </button>
            <button
              onClick={() => setHistoryTab('chart')}
              className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all ${
                historyTab === 'chart'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setHistoryTab('myBets')}
              className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition-all ${
                historyTab === 'myBets'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              My History ({userBets.length})
            </button>
          </div>

          {/* TAB 1: Game History Table */}
          {historyTab === 'history' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#114353] text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2 px-1">Period</th>
                      <th className="py-2 px-1 text-center">Number</th>
                      <th className="py-2 px-1 text-center">Big/Small</th>
                      <th className="py-2 px-1 text-center">Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#103E4E]">
                    {paginatedHistory.map((row) => (
                      <tr key={row.period} className="hover:bg-[#0C3442] transition-colors">
                        <td className="py-2.5 px-1 font-bold text-slate-200">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-1 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${getNumberColorClass(
                              row.number
                            )}`}
                          >
                            {row.number}
                          </span>
                        </td>
                        <td className="py-2.5 px-1 text-center font-bold">
                          <span
                            className={row.bigSmall === 'Big' ? 'text-amber-400' : 'text-teal-400'}
                          >
                            {row.bigSmall}
                          </span>
                        </td>
                        <td className="py-2.5 px-1 text-center">
                          {renderColorBadge(row.color)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2 border-t border-[#114353] text-xs text-slate-400">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144758] bg-[#0A303D] hover:bg-[#0F3B4B] disabled:opacity-40 transition-colors text-white"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <span className="font-mono text-amber-300">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#144758] bg-[#0A303D] hover:bg-[#0F3B4B] disabled:opacity-40 transition-colors text-white"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Trend Chart */}
          {historyTab === 'chart' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 font-medium">
                Winning Number Trend (Latest 10 Periods)
              </div>
              <div className="p-3 bg-slate-900 rounded-xl text-white">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                  <span>Period</span>
                  <span>Number Scale (0 - 9)</span>
                </div>
                <div className="space-y-2 mt-2 font-mono">
                  {gameHistory.slice(0, 10).map((row) => (
                    <div key={row.period} className="flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 w-24 truncate">{row.period}</span>
                      <div className="flex-1 flex items-center justify-between max-w-[200px] px-2 relative">
                        {/* Horizontal guide dots */}
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <div
                            key={n}
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10 ${
                              row.number === n
                                ? getNumberColorClass(n) + ' ring-2 ring-white scale-125'
                                : 'text-slate-600'
                            }`}
                          >
                            {row.number === n ? n : '·'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: My History */}
          {historyTab === 'myBets' && (
            <div className="space-y-2.5">
              {userBets.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <History className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                  <p>No demo bets placed yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pick a color or number to start.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {userBets.map((bet) => (
                    <div
                      key={bet.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span className="font-mono">{bet.period}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            {bet.selection}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Bet: ৳ {bet.totalBet.toFixed(2)} (X{bet.multiplier}) · {bet.time}
                        </div>
                      </div>

                      <div className="text-right">
                        {bet.status === 'Pending' && (
                          <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                        {bet.status === 'Won' && (
                          <div className="text-right">
                            <span className="text-emerald-600 font-bold text-xs block">
                              +৳ {bet.payout.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-emerald-500 font-semibold">Won</span>
                          </div>
                        )}
                        {bet.status === 'Lost' && (
                          <span className="text-rose-500 font-semibold text-xs bg-rose-50 px-2 py-0.5 rounded-full">
                            Lost
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Place Bet Bottom Sheet Modal */}
      {showBetModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  WinGo {activeWinGoMode} Bet
                </h3>
                <p className="text-xs text-slate-500">
                  Selected Choice: <strong className="text-amber-600 font-bold">[{selectedBet}]</strong>
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Balance</span>
                <span className="text-xs font-bold text-slate-700">৳ {user.balance.toFixed(2)}</span>
              </div>
            </div>

            {/* Base Amount Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                Base Amount (৳):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 10, 100, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetBaseAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      betBaseAmount === amt
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    ৳ {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiplier Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-1.5">Multiplier:</span>
              <div className="grid grid-cols-6 gap-1">
                {[1, 5, 10, 20, 50, 100].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMultiplier(m)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      multiplier === m
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    X{m}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Simulation Bet:</span>
              <span className="text-base font-extrabold font-mono text-amber-700">
                ৳ {(betBaseAmount * multiplier).toFixed(2)}
              </span>
            </div>

            {/* Notice */}
            <p className="text-[10px] text-slate-400 text-center">
              Simulation only. No real money betting or financial transactions occur.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setShowBetModal(false)}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBet}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                Confirm Bet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
