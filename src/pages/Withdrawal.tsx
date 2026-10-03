import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useDeposit } from '../context/DepositContext';
import { BoundEWallet } from '../types/withdrawal';
import { BkashLogo, NagadLogo, RocketLogo, BlankWalletCardIllustration } from '../components/deposit/DepositIcons';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronsRight,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  CreditCard,
  Trash2,
  Lock,
  Smartphone,
  UserCheck,
  Settings,
} from 'lucide-react';

const STORAGE_KEYS = {
  boundWallets: 'tcg_bound_wallets_v2',
};

const initialDefaultWallets: BoundEWallet[] = [];

export const Withdrawal: React.FC = () => {
  const { user, isAuthenticated, goBack, navigate, showToast, refreshBalance, isRefreshingBalance } = useApp();
  const { createWithdrawalRequest } = useDeposit();


  // Active wallet tab: bkash, nagad, rocket
  const [activeTab, setActiveTab] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');

  // Bound wallets list
  const [boundWallets, setBoundWallets] = useState<BoundEWallet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.boundWallets);
      return saved ? JSON.parse(saved) : initialDefaultWallets;
    } catch {
      return initialDefaultWallets;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.boundWallets, JSON.stringify(boundWallets));
    } catch (e) {
      console.error(e);
    }
  }, [boundWallets]);

  // Form inputs
  const [amountStr, setAmountStr] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Bind Wallet Modal
  const [showBindModal, setShowBindModal] = useState<boolean>(false);
  const [bindProvider, setBindProvider] = useState<'bkash' | 'nagad' | 'rocket'>(activeTab);
  const [bindHolderName, setBindHolderName] = useState<string>(user.nickname || 'Demo User');
  const [bindAccountNumber, setBindAccountNumber] = useState<string>(user.phone || '');

  // Synchronize modal provider when active tab changes
  useEffect(() => {
    setBindProvider(activeTab);
  }, [activeTab]);

  // Filter wallets for current tab
  const currentTabWallets = boundWallets.filter((w) => w.type === activeTab);
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    currentTabWallets[0]?.id || ''
  );

  // Keep selected wallet updated
  useEffect(() => {
    if (currentTabWallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(currentTabWallets[0].id);
    } else if (currentTabWallets.length === 0) {
      setSelectedWalletId('');
    }
  }, [activeTab, currentTabWallets, selectedWalletId]);

  // Handle Bind Wallet Submit
  const handleSaveBindWallet = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bindHolderName.trim()) {
      showToast('দয়া করে অ্যাকাউন্টধারীর নাম লিখুন', 'error');
      return;
    }

    if (!bindAccountNumber || bindAccountNumber.trim().length < 11) {
      showToast('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)', 'error');
      return;
    }

    // Check maximum 5 bound wallets limit
    if (currentTabWallets.length >= 5) {
      showToast(`আপনি সর্বোচ্চ ৫টি ${activeTab.toUpperCase()} ওয়ালেট যুক্ত করতে পারবেন`, 'error');
      return;
    }

    const newWallet: BoundEWallet = {
      id: `wallet-${Date.now()}`,
      type: bindProvider,
      accountName: bindHolderName.trim(),
      accountNumber: bindAccountNumber.trim(),
      isDefault: currentTabWallets.length === 0,
      createdAt: new Date().toLocaleDateString(),
    };

    setBoundWallets((prev) => [...prev, newWallet]);
    setSelectedWalletId(newWallet.id);
    setShowBindModal(false);
    confetti({ particleCount: 40, spread: 60 });
    showToast(`${bindProvider.toUpperCase()} ওয়ালেট সফলভাবে যুক্ত হয়েছে!`, 'success');
  };

  // Delete bound wallet
  const handleDeleteWallet = (walletId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই ওয়ালেটটি মুছে ফেলতে চান?')) {
      setBoundWallets((prev) => prev.filter((w) => w.id !== walletId));
      showToast('ওয়ালেট মুছে ফেলা হয়েছে', 'info');
    }
  };

  // Handle Withdrawal Request Submit
  const handleSubmitWithdrawal = async () => {
    if (!isAuthenticated) {
      showToast('টাকা উত্তোলনের পূর্বে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন!', 'error');
      navigate('login');
      return;
    }

    const numAmount = Number(amountStr);

    if (currentTabWallets.length === 0) {
      showToast('উত্তোলনের আগে অনুগ্রহ করে লাল (+) বাটনে চাপ দিয়ে ওয়ালেট যুক্ত করুন!', 'error');
      setShowBindModal(true);
      return;
    }

    if (isNaN(numAmount) || numAmount < 100 || numAmount > 10000) {
      showToast('উত্তোলনের পরিমাণ ৳ ১০০ থেকে ৳ ১০,০০০ এর মধ্যে হতে হবে', 'error');
      return;
    }

    if (numAmount > user.balance) {
      showToast('উত্তোলনের পরিমাণ আপনার বর্তমান ব্যালেন্সের চেয়ে বেশি!', 'error');
      return;
    }

    if (!password || password.trim().length < 4) {
      showToast('দয়া করে সঠিক Transaction Password দিন', 'error');
      return;
    }

    setSubmitting(true);

    const activeWallet =
      currentTabWallets.find((w) => w.id === selectedWalletId) ||
      currentTabWallets[0];

    try {
      // Send withdrawal request directly to Admin Panel via DepositContext
      await createWithdrawalRequest({
        userId: user.id,
        userNickname: user.nickname,
        walletType: activeTab,
        accountName: activeWallet.accountName,
        accountNumber: activeWallet.accountNumber,
        amount: numAmount,
      });

      setSubmitting(false);
      setAmountStr('');
      setPassword('');

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(`উইথড্র রিকোয়েস্ট সফলভাবে এডমিন প্যানেলে চলে গেছে!`, 'success');
      navigate('member/withdrawal-record');
    } catch {
      setSubmitting(false);
      showToast('উইথড্র রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে', 'error');
    }
  };

  const isFormValid =
    Number(amountStr) >= 100 &&
    Number(amountStr) <= 10000 &&
    password.trim().length >= 4 &&
    currentTabWallets.length > 0;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex flex-col justify-between select-none">
      {/* 100% Pixel-Accurate Header matching Screenshot 1 & 2 */}

      <header className="sticky top-0 z-30 w-full bg-[#0C4544] border-b border-[#0A3C3B] px-4 py-3 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between relative">
          {/* Gold Back Arrow */}
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#FBBF24] hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Centered Yellow Bold Title: Withdrawal */}
          <h1 className="text-lg font-black text-[#FBBF24] tracking-wide absolute left-1/2 -translate-x-1/2">
            Withdrawal
          </h1>

          {/* Right Icons: Records */}
          <div className="flex items-center gap-1.5">
            {/* Right Icon: Notepad with downward arrow (Withdrawal Records) */}
            <button
              onClick={() => navigate('member/withdrawal-record')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#FBBF24] hover:bg-white/10 active:scale-95 transition-all"
              title="Withdrawal Records"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15l-4-4h3V9h2v5h3l-4 4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>


      {/* E-Wallets Horizontal Tab Bar matching Screenshot 1 */}
      <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-lg mx-auto flex items-center justify-between px-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center">
            {/* Tab 1: bKash */}
            <button
              onClick={() => setActiveTab('bkash')}
              className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer transition-all relative ${
                activeTab === 'bkash' ? 'text-slate-900 font-black' : 'text-slate-500 font-bold'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-[#E2136E] flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-white">
                  <polygon points="15,45 85,20 60,80 48,52" />
                  <polygon points="48,52 60,80 32,85" />
                  <polygon points="15,45 48,52 32,85" />
                </svg>
              </div>
              <span className="text-xs">bKash</span>

              {/* Red underline bar if active */}
              {activeTab === 'bkash' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </button>

            {/* Tab 2: Nagad */}
            <button
              onClick={() => setActiveTab('nagad')}
              className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer transition-all relative ${
                activeTab === 'nagad' ? 'text-slate-900 font-black' : 'text-slate-500 font-bold'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white border border-rose-200 flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <svg viewBox="0 0 100 100" className="w-4 h-4">
                  <circle cx="50" cy="50" r="45" fill="#EF4444" />
                  <circle cx="50" cy="50" r="25" fill="#FFFFFF" />
                  <circle cx="50" cy="50" r="12" fill="#EF4444" />
                </svg>
              </div>
              <span className="text-xs">Nagad</span>

              {activeTab === 'nagad' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </button>

            {/* Tab 3: Rocket */}
            <button
              onClick={() => setActiveTab('rocket')}
              className={`flex items-center gap-1.5 px-4 py-2.5 cursor-pointer transition-all relative ${
                activeTab === 'rocket' ? 'text-slate-900 font-black' : 'text-slate-500 font-bold'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-[#8B207E] flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-white">
                  <path d="M50 10 C60 25, 75 40, 80 65 L68 62 L75 88 L58 75 L50 90 L42 75 L25 88 L32 62 L20 65 C25 40, 40 25, 50 10 Z" />
                </svg>
              </div>
              <span className="text-xs">Rocket</span>

              {activeTab === 'rocket' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </button>
          </div>

          {/* Right Scroll Indicator Chevrons */}
          <div className="text-blue-500 pr-2 flex items-center">
            <ChevronsRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* Bound Count Label: Bound Bkash (0/5) */}
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Bound {activeTab === 'bkash' ? 'Bkash' : activeTab === 'nagad' ? 'Nagad' : 'Rocket'}{' '}
            ({currentTabWallets.length}/5)
          </h2>
        </div>

        {/* E-Wallet Card Mockup / Carousel Area */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs min-h-[170px] flex flex-col justify-center">
          {currentTabWallets.length === 0 ? (
            /* When NO Wallet is Linked: Show Screenshot 1 Illustration */
            <BlankWalletCardIllustration />
          ) : (
            /* When Wallet(s) are bound: Show cards */
            <div className="space-y-2.5">
              {currentTabWallets.map((wallet) => {
                const isSelected = selectedWalletId === wallet.id;
                const isBkash = wallet.type === 'bkash';
                const isNagad = wallet.type === 'nagad';

                return (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedWalletId(wallet.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all relative overflow-hidden ${
                      isSelected
                        ? isBkash
                          ? 'border-[#E2136E] bg-rose-50/50 shadow-xs ring-1 ring-[#E2136E]/30'
                          : isNagad
                          ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500/30'
                          : 'border-purple-600 bg-purple-50/50 shadow-xs ring-1 ring-purple-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                          isBkash
                            ? 'bg-[#E2136E] text-white'
                            : isNagad
                            ? 'bg-[#F97316] text-white'
                            : 'bg-[#8B207E] text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900 uppercase">
                            {wallet.type} · {wallet.accountName}
                          </h4>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                          {wallet.accountNumber.slice(0, 3)} •••• {wallet.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteWallet(wallet.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Unbind / Delete Wallet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Round Red (+) Plus Button at bottom-right matching Screenshot 1 */}
          <div className="absolute -bottom-4 right-4 z-10">
            <button
              onClick={() => {
                setBindProvider(activeTab);
                setShowBindModal(true);
              }}
              className="w-11 h-11 rounded-full bg-[#E11D48] hover:bg-[#BE123C] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer ring-4 ring-white"
              title="Bind New E-Wallet"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Informational Text & Balance Block */}
        <div className="pt-2 space-y-1 text-xs text-slate-500">
          <p>Withdrawal time : 24 hours</p>
          <p>Daily withdrawal 99 (Times), Remaining withdrawal 99 (Times)</p>
          <p className="font-medium text-slate-700">
            Main Wallet : <span className="font-mono font-bold text-slate-900">৳ {user.balance.toFixed(2)}</span>
          </p>
          <p className="font-medium text-slate-700">
            Available Amount : <span className="font-mono font-bold text-slate-900">৳ {user.balance.toFixed(2)}</span>
          </p>

          {/* Refresh Balance Light Blue Button */}
          <div className="pt-2">
            <button
              onClick={refreshBalance}
              disabled={isRefreshingBalance}
              className="px-4 py-2 rounded-full bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1D4ED8] font-bold text-xs flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
              <span>Refresh Balance</span>
            </button>
          </div>
        </div>

        {/* Withdrawal Amount Label */}
        <div className="pt-1">
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Withdrawal Amount:
          </label>

          {/* Input Box 1: Amount */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 w-28 shrink-0">
              Amount
            </span>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="100 ~ 10,000"
              className="w-full text-right font-mono font-bold text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Input Box 2: Transaction Password */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 w-36 shrink-0">
              Transaction Password
            </span>
            <div className="flex items-center gap-2 w-full justify-end">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Transaction Password"
                className="w-full text-right font-mono font-bold text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Submit Button matching Screenshot 2 */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-slate-200 p-3 w-full shadow-2xl mt-auto">
        <button
          onClick={handleSubmitWithdrawal}
          disabled={!isFormValid || submitting}
          className={`w-full py-3.5 rounded-xl font-black text-base tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-[#FF1F4B] hover:bg-[#E11D48] text-white cursor-pointer shadow-lg shadow-red-500/25 ring-2 ring-red-400/30'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>এডমিন প্যানেলে পাঠানো হচ্ছে...</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>



      {/* Modal: Bind E-Wallet */}
      {showBindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0C4544] p-4 text-white relative">
              <button
                onClick={() => setShowBindModal(false)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center text-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  ই-ওয়ালেট যুক্ত করুন (Bind E-Wallet)
                </h3>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBindWallet} className="p-4 space-y-3.5 text-xs">
              {/* Choose Provider */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ওয়ালেট সার্ভিস নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bkash', 'nagad', 'rocket'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => setBindProvider(prov)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        bindProvider === prov
                          ? 'border-[#E11D48] bg-rose-50 text-[#E11D48] font-black'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <span className="uppercase text-[11px]">{prov}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  অ্যাকাউন্টধারীর নাম (Account Name):
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={bindHolderName}
                    onChange={(e) => setBindHolderName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {bindProvider.toUpperCase()} মোবাইল নম্বর:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={bindAccountNumber}
                    onChange={(e) => setBindAccountNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
                উত্তোলনের টাকা আপনার যুক্ত করা নম্বরে সরাসরি পাঠানো হবে। নম্বরটি সঠিক কিনা যাচাই করুন।
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBindModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black shadow-md"
                >
                  ওয়ালেট যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
