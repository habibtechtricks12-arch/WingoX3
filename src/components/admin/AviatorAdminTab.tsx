import React, { useState } from 'react';
import { useAviatorControl, UpcomingRound } from '../../context/AviatorControlContext';
import {
  Plane,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  ShieldAlert,
  Edit2,
  Save,
  RotateCcw,
  Sliders,
  TrendingUp,
  Activity,
  Radio,
} from 'lucide-react';

export const AviatorAdminTab: React.FC = () => {
  const {
    gameState,
    currentMultiplier,
    currentCrashTarget,
    flightElapsedSeconds,
    estimatedRemainingSeconds,
    waitingCountdown,
    upcomingQueue,
    setNextCrashMultiplier,
    setSpecificUpcomingCrash,
    forceCrashNow,
    setGameStrategyMode,
    gameStrategyMode,
    history,
  } = useAviatorControl();

  const [customNextInput, setCustomNextInput] = useState<string>('');
  const [editingRoundIndex, setEditingRoundIndex] = useState<number | null>(null);
  const [editRoundValue, setEditRoundValue] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string>('');

  const triggerSuccessAlert = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => {
      setActionSuccessMessage('');
    }, 3000);
  };

  const handleApplyNextCrash = (val: number) => {
    setNextCrashMultiplier(val);
    setCustomNextInput('');
    triggerSuccessAlert(`✅ পরবর্তী রাউন্ড ঠিক ${val.toFixed(2)}x এ ফাটবে বলে সেট করা হয়েছে!`);
  };

  const handleSaveEditRound = (index: number) => {
    const parsed = parseFloat(editRoundValue);
    if (!isNaN(parsed) && parsed >= 1.01) {
      setSpecificUpcomingCrash(index, parsed);
      setEditingRoundIndex(null);
      setEditRoundValue('');
      triggerSuccessAlert(`✅ রাউন্ড #${index + 1} সফলভাবে ${parsed.toFixed(2)}x সেট করা হয়েছে!`);
    }
  };

  const getPillColor = (mult: number) => {
    if (mult >= 10.0) return 'bg-[#C026D3]/20 text-[#F472B6] border-[#C026D3]/50';
    if (mult >= 3.0) return 'bg-[#9333EA]/20 text-[#C084FC] border-[#9333EA]/50';
    if (mult >= 2.0) return 'bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/50';
    return 'bg-[#DC2626]/20 text-[#F87171] border-[#DC2626]/50';
  };

  // Progress percentage of current flight toward crash target
  const flightProgressPercent = Math.min(
    100,
    Math.max(0, ((currentMultiplier - 1.0) / Math.max(0.1, currentCrashTarget - 1.0)) * 100)
  );

  return (
    <div className="space-y-6 text-white select-none">
      {/* ================= TOP HERO: LIVE FLIGHT RADAR ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1519] via-[#0E2027] to-[#061418] border-2 border-[#16566A] p-5 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-[#144758] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-600 to-amber-500 flex items-center justify-center shadow-lg">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  Aviator লাইভ ক্র্যাশ মনিটর ও কন্ট্রোল
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold animate-pulse">
                  <Radio className="w-3 h-3" /> LIVE RADAR
                </span>
              </div>
              <p className="text-xs text-slate-300">
                প্লেন কখন ও কত মাল্টিপ্লায়ারে ফাটবে তা আগে থেকেই দেখুন ও নিয়ন্ত্রণ করুন
              </p>
            </div>
          </div>

          {/* Strategy Selector */}
          <div className="flex items-center gap-1.5 bg-[#061A22] p-1 rounded-xl border border-[#144758]">
            <span className="text-[11px] font-bold text-slate-300 px-2">অ্যালগরিদম:</span>
            <button
              onClick={() => setGameStrategyMode('fair')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                gameStrategyMode === 'fair'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              স্বাভাবিক (Fair)
            </button>
            <button
              onClick={() => setGameStrategyMode('house_protect')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                gameStrategyMode === 'house_protect'
                  ? 'bg-red-500 text-white font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              হাউজ সেফ (Low)
            </button>
            <button
              onClick={() => setGameStrategyMode('high_win')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                gameStrategyMode === 'high_win'
                  ? 'bg-purple-500 text-white font-black shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              হাই উইন (Boost)
            </button>
          </div>
        </div>

        {/* Live Flight Telemetry Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Card 1: Current Multiplier & Flight State */}
          <div className="p-4 rounded-2xl bg-[#061E26] border border-[#144758] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                ফ্লাইট স্ট্যাটাস:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  gameState === 'flying'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : gameState === 'crashed'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {gameState === 'flying'
                  ? '✈️ উড়ছে (Flying)'
                  : gameState === 'crashed'
                  ? '💥 ক্র্যাশড (Crashed)'
                  : `⏳ অপেক্ষমাণ (${waitingCountdown}s)`}
              </span>
            </div>

            <div className="my-3 text-center">
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {gameState === 'flying'
                  ? `${currentMultiplier.toFixed(2)}x`
                  : gameState === 'crashed'
                  ? `${currentCrashTarget.toFixed(2)}x (CRASH)`
                  : '1.00x (WAIT)'}
              </div>
              <span className="text-[11px] text-slate-400">
                {gameState === 'flying'
                  ? `উড়ানের সময়: ${flightElapsedSeconds.toFixed(1)}s`
                  : gameState === 'waiting'
                  ? `পরবর্তী রাউন্ড শুরু হবে ${waitingCountdown} সেকেন্ডে`
                  : 'পরবর্তী রাউন্ডের জন্য প্রস্তুত হচ্ছে'}
              </span>
            </div>

            {/* Flight Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.00x</span>
                <span>ক্র্যাশ পয়েন্ট: {currentCrashTarget.toFixed(2)}x</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500 transition-all duration-100 rounded-full"
                  style={{ width: `${flightProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: THE SECRET PREDICTION (আগে থেকেই জানার মূল কার্ড) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E0B0B] via-[#2A1010] to-[#160606] border-2 border-red-500/50 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-red-200">
              <span className="font-black flex items-center gap-1.5 text-red-400">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                এডমিন গোপন প্রেডিকশন
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 text-[10px] font-black border border-red-500/40">
                CONFIDENTIAL
              </span>
            </div>

            <div className="my-2 text-center space-y-1">
              <span className="text-xs text-slate-300 block">
                {gameState === 'flying'
                  ? 'এই রাউন্ডের বিমানটি ফাটবে ঠিক:'
                  : 'পরবর্তী রাউন্ডের বিমানটি ফাটবে ঠিক:'}
              </span>
              <div className="text-4xl font-black font-mono tracking-tighter text-amber-300 drop-shadow-[0_2px_12px_rgba(251,191,36,0.6)]">
                {currentCrashTarget.toFixed(2)}x
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-lg bg-black/40 border border-red-500/30 text-[11px] font-mono text-red-300">
                {gameState === 'flying'
                  ? `ফাটতে বাকি আনুমানিক: ${estimatedRemainingSeconds}s`
                  : 'ফ্লাইট শুরু হওয়ার অপেক্ষায়'}
              </div>
            </div>

            {/* Emergency Kill Switch */}
            <button
              onClick={() => {
                forceCrashNow();
                triggerSuccessAlert('💥 তাৎক্ষণিক কমান্ড পাঠানো হয়েছে! প্লেন ক্র্যাশ সম্পন্ন।');
              }}
              disabled={gameState !== 'flying'}
              className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                gameState === 'flying'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_15px_rgba(220,38,38,0.5)] active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>💥 এখনই ক্র্যাশ করান (Force Crash Now)</span>
            </button>
          </div>

          {/* Card 3: Quick Crash Target Override */}
          <div className="p-4 rounded-2xl bg-[#061E26] border border-[#144758] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <Sliders className="w-4 h-4" />
                পরবর্তী ক্র্যাশ সেট করুন:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Next Target</span>
            </div>

            {/* Quick 1-Click Multiplier Pills */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '1.05x', val: 1.05, tip: 'তাত্ক্ষণিক লস' },
                { label: '1.20x', val: 1.2, tip: 'দ্রুত ক্র্যাশ' },
                { label: '2.00x', val: 2.0, tip: '২ গুণ' },
                { label: '5.00x', val: 5.0, tip: '৫ গুণ' },
                { label: '10.0x', val: 10.0, tip: 'জ্যাকপট' },
                { label: '50.0x', val: 50.0, tip: 'মেগা উইন' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleApplyNextCrash(btn.val)}
                  className="py-1.5 px-2 rounded-xl bg-[#082935] hover:bg-[#0E3D4F] border border-[#16566A] hover:border-amber-400 text-xs font-black font-mono text-amber-300 active:scale-95 transition-all cursor-pointer flex flex-col items-center"
                >
                  <span>{btn.label}</span>
                  <span className="text-[8px] text-slate-400 font-sans font-normal">{btn.tip}</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1 border-t border-[#124556]">
              <input
                type="number"
                step="0.01"
                min="1.01"
                placeholder="যেমন: 7.77 বা 25.00"
                value={customNextInput}
                onChange={(e) => setCustomNextInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#051C23] border border-[#144758] text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
              />
              <button
                onClick={() => {
                  const parsed = parseFloat(customNextInput);
                  if (!isNaN(parsed) && parsed >= 1.01) {
                    handleApplyNextCrash(parsed);
                  }
                }}
                disabled={!customNextInput}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs transition-all cursor-pointer"
              >
                প্রয়োগ
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* ================= UPCOMING 10 ROUNDS QUEUE TABLE ================= */}
      <div className="rounded-3xl bg-[#07242E] border border-[#114555] p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F3A48] pb-3">
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>ভবিষ্যতের ১০টি রাউন্ডের শিডিউল (Upcoming Rounds Prediction)</span>
            </h4>
            <p className="text-xs text-slate-300">
              পরবর্তী কোন রাউন্ড কত মাল্টিপ্লায়ার এ ফাটবে তা আগে থেকেই সম্পূর্ণ নির্ধারিত
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-[#061E26] px-3 py-1 rounded-full border border-[#144758]">
            ১০টি রাউন্ড কিউতে রয়েছে
          </span>
        </div>

        {/* Table of upcoming rounds */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#124556] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">সিরিয়াল / রাউন্ড</th>
                <th className="py-2.5 px-3">ক্র্যাশ মাল্টিপ্লায়ার</th>
                <th className="py-2.5 px-3">আনুমানিক সময়</th>
                <th className="py-2.5 px-3">টাইপ / প্রভাব</th>
                <th className="py-2.5 px-3">এডমিন ওভাররাইড</th>
                <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F3A48]/60 font-mono">
              {upcomingQueue.map((round: UpcomingRound, idx: number) => {
                const isNext = idx === 0;
                const isEditing = editingRoundIndex === idx;

                let impactLabel = 'মাঝারি লাভ (Medium)';
                let impactColor = 'text-blue-400';
                if (round.crashMultiplier < 1.5) {
                  impactLabel = 'দ্রুত ক্র্যাশ (House Profit)';
                  impactColor = 'text-red-400';
                } else if (round.crashMultiplier >= 10.0) {
                  impactLabel = 'মেগা জ্যাকপট (Big Payout)';
                  impactColor = 'text-pink-400 font-black';
                } else if (round.crashMultiplier >= 3.0) {
                  impactLabel = 'উচ্চ মাল্টিপ্লায়ার (High Win)';
                  impactColor = 'text-purple-400 font-bold';
                }

                return (
                  <tr
                    key={round.roundId}
                    className={`transition-colors hover:bg-[#0A303D] ${
                      isNext ? 'bg-amber-400/10 border-l-4 border-amber-400' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            isNext ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        {isNext && (
                          <span className="text-[10px] font-sans font-black text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-400/30">
                            NEXT
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Multiplier */}
                    <td className="py-3 px-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          min="1.01"
                          autoFocus
                          value={editRoundValue}
                          onChange={(e) => setEditRoundValue(e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-[#051C23] border border-amber-400 text-amber-300 font-bold text-xs focus:outline-none"
                        />
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-xl font-black text-xs border ${getPillColor(
                            round.crashMultiplier
                          )}`}
                        >
                          {round.crashMultiplier.toFixed(2)}x
                        </span>
                      )}
                    </td>

                    {/* Estimated Duration */}
                    <td className="py-3 px-3 text-slate-300">
                      ~{round.estimatedFlightSeconds}s
                    </td>

                    {/* Impact / Effect */}
                    <td className="py-3 px-3 font-sans">
                      <span className={`text-[11px] ${impactColor}`}>{impactLabel}</span>
                    </td>

                    {/* Admin Override Badge */}
                    <td className="py-3 px-3 font-sans">
                      {round.isOverridden ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                          এডমিন সেট করেছে
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">অটো অ্যালগরিদম</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5 font-sans">
                          <button
                            onClick={() => handleSaveEditRound(idx)}
                            className="p-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                            title="সেভ করুন"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRoundIndex(null);
                              setEditRoundValue('');
                            }}
                            className="p-1 rounded bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="বাতিল"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRoundIndex(idx);
                            setEditRoundValue(round.crashMultiplier.toString());
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#0E3D4F] hover:bg-amber-400 hover:text-slate-950 text-slate-300 font-sans text-[11px] font-bold border border-[#16566A] transition-all flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>পরিবর্তন</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RECENT CRASH HISTORY LOG ================= */}
      <div className="rounded-3xl bg-[#07242E] border border-[#114555] p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#0F3A48] pb-3">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>বিগত রাউন্ডগুলোর ক্র্যাশ হিস্ট্রি (Recent Flights History)</span>
          </h4>
          <span className="text-xs text-slate-400 font-mono">সর্বশেষ {history.length} টি রাউন্ড</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 font-mono">
          {history.map((h, i) => (
            <div
              key={h.id || i}
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-sm ${getPillColor(
                h.val
              )}`}
            >
              <span>{h.val.toFixed(2)}x</span>
              <span className="text-[9px] opacity-60 font-normal">{h.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
