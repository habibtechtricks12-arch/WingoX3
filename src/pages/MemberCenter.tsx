import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ASSETS } from '../assets/assetPaths';
import {
  Copy,
  Edit2,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  Gift,
  FileSpreadsheet,
  PieChart,
  Receipt,
  FileCheck,
  Shield,
  ShieldCheck,
  UserPlus,
  Target,
  Percent,
  Mail,
  MessageSquare,
  Download,
  Headphones,
  LogOut,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const MemberCenter: React.FC = () => {
  const {
    user,
    isAuthenticated,
    logout,
    updateUser,
    refreshBalance,
    isRefreshingBalance,
    navigate,
    showToast,
    unreadMessageCount,
  } = useApp();

  const [showEditNickname, setShowEditNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(user.nickname);

  const copyUserId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.id);
    }
    showToast(`Copied User ID: ${user.id}`, 'success');
  };

  const handleSaveNickname = () => {
    if (!newNickname.trim()) return;
    updateUser({ nickname: newNickname.trim() });
    setShowEditNickname(false);
    showToast('Nickname updated successfully', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully.', 'info');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#061E26] text-slate-100 flex flex-col justify-between pb-20 font-sans select-none">
        <Header title="My Account" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-white">Please Log In / Register</h2>
            <p className="text-xs text-slate-400">
              You need to be logged into your account to access your wallet, deposit, withdraw, and transaction history.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-2">
            <button
              onClick={() => navigate('login')}
              className="flex-1 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate('register')}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 16 Member Center Items (4 Columns Grid)
  const memberItems = [
    {
      id: 'reward',
      label: 'Reward Center',
      icon: Gift,
      action: () => navigate('reward'),
    },
    {
      id: 'betting-record',
      label: 'Betting Record',
      icon: FileSpreadsheet,
      action: () => navigate('member/betting-record'),
    },
    {
      id: 'profit-loss',
      label: 'Profit And Loss',
      icon: PieChart,
      action: () => navigate('member/profit-loss'),
    },
    {
      id: 'deposit-record',
      label: 'Deposit Record',
      icon: Receipt,
      action: () => navigate('member/deposit-record'),
    },
    {
      id: 'withdrawal-record',
      label: 'Withdrawal Record',
      icon: Receipt,
      action: () => navigate('member/withdrawal-record'),
    },
    {
      id: 'account-record',
      label: 'Account Record',
      icon: FileCheck,
      action: () => navigate('member/account-record'),
    },
    {
      id: 'my-account',
      label: 'My Account',
      icon: User,
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Viewing My Account profile', 'info');
      },
    },
    {
      id: 'security',
      label: 'Security Center',
      icon: Shield,
      action: () => navigate('member/security'),
    },
    {
      id: 'invite',
      label: 'Invite Friends',
      icon: UserPlus,
      action: () => navigate('invite'),
    },
    {
      id: 'mission',
      label: 'Mission',
      icon: Target,
      badge: '1',
      action: () => navigate('member/mission'),
    },
    {
      id: 'rebate',
      label: 'Rebate',
      icon: Percent,
      action: () => navigate('member/rebate'),
    },
    {
      id: 'messages',
      label: 'Internal Message',
      icon: Mail,
      badge: unreadMessageCount > 0 ? String(unreadMessageCount) : undefined,
      action: () => navigate('member/messages'),
    },
    {
      id: 'suggestion',
      label: 'Suggestion',
      icon: MessageSquare,
      action: () => navigate('member/suggestion'),
    },
    {
      id: 'download',
      label: 'Download APP',
      icon: Download,
      action: () => navigate('member/download'),
    },
    {
      id: 'customer-service',
      label: 'Customer Service',
      icon: Headphones,
      action: () => navigate('member/customer-service'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      action: handleLogout,
      isDanger: true,
    },

  ];

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      <Header title="My Account" />

      <main className="max-w-lg mx-auto px-3.5 py-3.5 space-y-4">
        {/* Profile Panel: Light gray/blue/teal gradient */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] text-white p-4 shadow-lg space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={ASSETS.vipCrownBadge}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover shadow-sm bg-slate-800"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] shadow-sm">
                  VIP{user.vipLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white">{user.nickname}</span>
                  <button
                    onClick={() => setShowEditNickname(true)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Edit Nickname"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User ID with copy button */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5 font-mono">
                  <span>ID: {user.id}</span>
                  <button
                    onClick={copyUserId}
                    className="p-1 hover:text-amber-400 transition-colors"
                    title="Copy User ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                {/* Joined Date */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined: {user.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Balance Refresh */}
            <button
              onClick={refreshBalance}
              disabled={isRefreshingBalance}
              className="p-2 rounded-full text-slate-300 hover:text-amber-400 hover:bg-white/10 transition-colors"
              title="Refresh Balance"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingBalance ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Balance Area */}
          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Total Balance
              </span>
              <div className="flex items-baseline gap-1 text-2xl font-extrabold font-mono text-amber-400">
                <span>৳</span>
                <span>{user.balance.toFixed(2)}</span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              Standard Member
            </span>
          </div>

          {/* Quick Buttons: Deposit, Withdrawal, Bank Account */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => navigate('deposit')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm active:scale-98 transition-all"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              Deposit
            </button>

            <button
              onClick={() => navigate('withdrawal')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B3340] hover:bg-[#0E3D4C] border border-[#144859] text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
            >
              <ArrowUpFromLine className="w-3.5 h-3.5 text-amber-400" />
              Withdrawal
            </button>

            <button
              onClick={() => navigate('bank-account')}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs shadow-sm active:scale-98 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              Bank Account
            </button>
          </div>
        </div>

        {/* Section 14: Member Center 4-Column Grid */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#124252]">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Member Center
            </h3>
            <span className="text-[11px] text-slate-400">16 Services</span>
          </div>

          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {memberItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex flex-col items-center text-center group cursor-pointer relative"
                >
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs z-10 ring-2 ring-[#082833]">
                      {item.badge}
                    </span>
                  )}

                  {/* Circular pale-gold background with gold line icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 group-active:scale-95 shadow-xs ${
                      item.isDanger
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        : 'bg-[#0E3A48] text-amber-400 border border-[#144758] group-hover:bg-[#13495B]'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Label with responsive text wrapping */}
                  <span
                    className={`text-[11px] leading-tight font-medium max-w-[72px] line-clamp-2 ${
                      item.isDanger ? 'text-rose-400 font-bold' : 'text-slate-200'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Edit Nickname Modal */}
      <Modal
        isOpen={showEditNickname}
        onClose={() => setShowEditNickname(false)}
        title="Edit Nickname"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              New Nickname:
            </label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              maxLength={15}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setShowEditNickname(false)}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNickname}
              className="py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-600"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
