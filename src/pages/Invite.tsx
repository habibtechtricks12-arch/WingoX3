import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ASSETS } from '../assets/assetPaths';
import {
  Copy,
  Share2,
  Users,
  Award,
  DollarSign,
  FileText,
  ListOrdered,
  QrCode,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Gift,
  HelpCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

type InviteTab = 'overview' | 'rewards' | 'earnings' | 'records' | 'list';

export const Invite: React.FC = () => {
  const { inviteStats, achievements, claimAchievement, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<InviteTab>('overview');

  // Filter state for records
  const [recordType, setRecordType] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const referralLink = 'https://example.com/register?ref=DEMO';

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast('Copied referral link to clipboard!', 'success');
  };

  const shareSocial = (platform: string) => {
    showToast(`Opening share intent for ${platform}`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      <Header title="Invite Friends" />

      {/* Top 5 Segmented Tabs */}
      <div className="bg-[#082833] border-b border-[#114454] sticky top-14 z-20 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between overflow-x-auto no-scrollbar px-2 py-1">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'rewards', label: 'Rewards', icon: Award },
            { id: 'earnings', label: 'Earnings', icon: DollarSign },
            { id: 'records', label: 'Records', icon: FileText },
            { id: 'list', label: 'Invited List', icon: ListOrdered },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as InviteTab)}
                className={`flex items-center gap-1 px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all shrink-0 ${
                  active
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-lg mx-auto px-3.5 py-3.5 space-y-4">
        {/* =========================================
            TAB 1: OVERVIEW
        ========================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Statistics Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#082833] p-3.5 border border-[#114454] shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Today's Income
                </span>
                <div className="text-xl font-extrabold font-mono text-amber-400">
                  ৳ {inviteStats.todayIncome.toFixed(2)}
                </div>
              </div>

              <div className="rounded-2xl bg-[#082833] p-3.5 border border-[#114454] shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Yesterday's Income
                </span>
                <div className="text-xl font-extrabold font-mono text-slate-200">
                  ৳ {inviteStats.yesterdayIncome.toFixed(2)}
                </div>
              </div>

              <div className="rounded-2xl bg-[#082833] p-3.5 border border-[#114454] shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Registers
                </span>
                <div className="text-xl font-extrabold font-mono text-slate-200">
                  {inviteStats.registers}
                </div>
              </div>

              <div className="rounded-2xl bg-[#082833] p-3.5 border border-[#114454] shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Valid Referral
                </span>
                <div className="text-xl font-extrabold font-mono text-[#2DD4BF]">
                  {inviteStats.validReferral}
                </div>
              </div>
            </div>

            {/* Referral / Share Area */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-md space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Share2 className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Share with your friends
                </h3>
              </div>

              {/* QR Code Placeholder with high-fidelity visual layout */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
                <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-xs border border-amber-200 flex flex-col items-center justify-center relative shrink-0">
                  {/* Clean SVG QR pattern */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="4" />
                    <rect x="6" y="6" width="18" height="18" fill="white" rx="2" />
                    <rect x="10" y="10" width="10" height="10" rx="1" />

                    <rect x="70" y="0" width="30" height="30" rx="4" />
                    <rect x="76" y="6" width="18" height="18" fill="white" rx="2" />
                    <rect x="80" y="10" width="10" height="10" rx="1" />

                    <rect x="0" y="70" width="30" height="30" rx="4" />
                    <rect x="6" y="76" width="18" height="18" fill="white" rx="2" />
                    <rect x="10" y="80" width="10" height="10" rx="1" />

                    <rect x="40" y="10" width="8" height="8" />
                    <rect x="52" y="10" width="8" height="8" />
                    <rect x="40" y="25" width="8" height="8" />
                    <rect x="50" y="40" width="14" height="14" rx="2" />
                    <rect x="70" y="45" width="10" height="10" />
                    <rect x="85" y="60" width="12" height="12" />
                    <rect x="40" y="70" width="8" height="8" />
                    <rect x="60" y="80" width="10" height="10" />
                  </svg>
                  <span className="text-[8px] font-bold text-amber-700 mt-1">SCAN DEMO</span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <span className="text-xs text-slate-600 font-medium block">
                    Your Exclusive Invitation Link:
                  </span>
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <span className="font-mono text-slate-700 truncate select-all flex-1 px-1">
                      {referralLink}
                    </span>
                    <button
                      onClick={() => copyToClipboard(referralLink)}
                      className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Quick Social Sharing:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => shareSocial('WhatsApp')}
                    className="py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareSocial('Telegram')}
                    className="py-2 px-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200 transition-colors"
                  >
                    Telegram
                  </button>
                  <button
                    onClick={() => shareSocial('Facebook')}
                    className="py-2 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200 transition-colors"
                  >
                    Direct Link
                  </button>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-4 text-slate-950 shadow-md space-y-2">
              <h4 className="text-xs font-black tracking-wider uppercase">
                Demo Referral Rules & Benefits
              </h4>
              <ul className="space-y-1.5 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Invite 1 person and earn up to 100TK</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Earn 2.2% on lower level deposits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Lower level earns 1% on every bet</span>
                </li>
              </ul>
            </div>

            {/* Section 7: Invite Reward Table */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  VIP Referral Bonus Table
                </h3>
                <span className="text-[11px] text-amber-600 font-semibold">
                  Tier Structure
                </span>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left text-xs min-w-[360px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Inviter VIP</th>
                      <th className="py-2.5 px-3">Referral Bonus</th>
                      <th className="py-2.5 px-3">Friend Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900">VIP0</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">100TK</td>
                      <td className="py-2.5 px-3 text-[11px]">Deposit 100TK & Bet 2000TK</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900">VIP1-2</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">150TK</td>
                      <td className="py-2.5 px-3 text-[11px]">Deposit 100TK & Bet 2000TK</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900">VIP3-5</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">200TK</td>
                      <td className="py-2.5 px-3 text-[11px]">Deposit 100TK & Bet 2000TK</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900">VIP6-8</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                        300TK & Golden EGG
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">Deposit 200TK & Bet 4000TK</td>
                    </tr>
                    <tr className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-900">VIP9-18</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                        400TK & Golden EGG
                      </td>
                      <td className="py-2.5 px-3 text-[11px]">Deposit 300TK & Bet 6000TK</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: REWARDS (Achievement Cards)
        ========================================= */}
        {activeTab === 'rewards' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium">
              Invite valid friends to unlock tier reward bonuses. Progress updates automatically.
            </div>

            <div className="space-y-3">
              {achievements.map((item) => {
                const currentValid = inviteStats.validReferral;
                const isCompleted = currentValid >= item.targetReferrals;
                const progressPercent = Math.min(100, (currentValid / item.targetReferrals) * 100);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">
                          Over {item.targetReferrals} valid referral in total
                        </h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[11px] text-slate-400">Reward:</span>
                          <span className="font-mono font-extrabold text-amber-600 text-sm">
                            ৳ {item.rewardAmount.toFixed(2)}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-36 sm:w-44 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Progress: {currentValid} / {item.targetReferrals}
                        </span>
                      </div>
                    </div>

                    <button
                      disabled={!isCompleted || item.claimed}
                      onClick={() => claimAchievement(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        item.claimed
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm active:scale-95'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {item.claimed ? 'Claimed' : 'Available'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================
            TAB 3: EARNINGS
        ========================================= */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            {/* Card 1: Today's Income */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Today's Income</span>
                <span className="text-base font-extrabold font-mono text-amber-600">
                  ৳ {inviteStats.todayIncome.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Invitation Rewards</span>
                  <span className="font-mono font-bold text-slate-800">
                    ৳ {inviteStats.invitationRewards.toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Achievement Rewards</span>
                  <span className="font-mono font-bold text-slate-800">
                    ৳ {inviteStats.achievementRewards.toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Deposit Rebate</span>
                  <span className="font-mono font-bold text-slate-800">
                    ৳ {inviteStats.depositRebate.toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Betting Rebate</span>
                  <span className="font-mono font-bold text-slate-800">
                    ৳ {inviteStats.bettingRebate.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>Registers: <strong className="text-slate-800">{inviteStats.registers}</strong></span>
                <span>Valid: <strong className="text-teal-600">{inviteStats.validReferral}</strong></span>
                <span>Depositors: <strong className="text-slate-800">{inviteStats.depositors}</strong></span>
              </div>
            </div>

            {/* Card 2: Total Income */}
            <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Total Income</span>
                <span className="text-base font-extrabold font-mono text-amber-600">
                  ৳ {inviteStats.totalIncome.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Invitation Rewards</span>
                  <span className="font-mono font-bold text-slate-800">৳ 0.00</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Achievement Rewards</span>
                  <span className="font-mono font-bold text-slate-800">৳ 0.00</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Deposit Rebate</span>
                  <span className="font-mono font-bold text-slate-800">৳ 0.00</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-[11px] text-slate-400 block">Betting Rebate</span>
                  <span className="font-mono font-bold text-slate-800">৳ 0.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 4: RECORDS
        ========================================= */}
        {activeTab === 'records' && (
          <div className="space-y-3.5">
            {/* Filter Controls */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">All Reward Types</option>
                <option value="Invitation">Invitation Bonus</option>
                <option value="Achievement">Achievement Bonus</option>
                <option value="Rebate">Bet Rebate</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Month">This Month</option>
              </select>
            </div>

            {/* Empty State Table */}
            <div className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700">No data</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  No invite records found for the selected filter period.
                </p>
              </div>
            </div>

            {/* Bottom Total */}
            <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Total:</span>
              <span className="font-mono text-amber-600">৳ 0.00</span>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 5: INVITED LIST
        ========================================= */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Top Level L1 Card */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  L1
                </span>
                <span className="text-xs text-teal-200">Direct Referrals</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-slate-300 block">Registers</span>
                  <span className="text-xl font-bold font-mono text-white">1</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-300 block">Valid Referral</span>
                  <span className="text-xl font-bold font-mono text-amber-400">0</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300 font-mono">
                <span>Today: +0</span>
                <span>Yesterday: +0</span>
                <span>Current Month: +0</span>
              </div>
            </div>

            {/* Sub-Filters */}
            <div className="flex items-center gap-2">
              {['All', 'Today', 'Date Range'].map((f) => (
                <button
                  key={f}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Demo List item */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-800">User_08849</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Reg: 2026-09-28 14:10</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold text-[10px]">
                  Registered (Pending Deposit)
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
