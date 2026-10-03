import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useDeposit } from '../context/DepositContext';
import { DepositMethodConfig, DepositPromotion } from '../types/deposit';
import {
  ThumbsUpRibbon,
  RedCheckBadge,
  NagadLogo,
  BkashLogo,
  NagadBlueLogo,
  DepositInfographic,
} from '../components/deposit/DepositIcons';
import { AutomatedApiCheckoutModal } from '../components/deposit/AutomatedApiCheckoutModal';
import { ManualCashoutCheckoutModal } from '../components/deposit/ManualCashoutCheckoutModal';
import { DirectGatewayScreen } from '../components/deposit/DirectGatewayScreen';

import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Gift,
  X,
  Sparkles,
} from 'lucide-react';

export const Deposit: React.FC = () => {
  const { user, isAuthenticated, goBack, navigate, showToast } = useApp();
  const { methods, gateways, promotions, orders } = useDeposit();

  // Active selected method
  const activeMethods = methods.filter((m) => m.isActive);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    activeMethods[0]?.id || 'nagad-vip'
  );

  const selectedMethod: DepositMethodConfig =
    activeMethods.find((m) => m.id === selectedMethodId) ||
    activeMethods[0] || {
      id: 'nagad-vip',
      name: 'NAGAD VIP',
      subtitle: 'CASH OUT',
      channelLabel: 'NAGAD VIP | GBKPAY',
      brand: 'nagad',
      type: 'cash_out',
      mode: 'automated_api',
      gatewayId: 'gw-gbkpay',
      agentNumber: '01839281729',
      minAmount: 100,
      maxAmount: 50000,
      presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
      isActive: true,
      isVip: true,
      order: 1,
    };

  // Associated gateway
  const associatedGateway =
    gateways.find((g) => g.id === selectedMethod.gatewayId) ||
    gateways[0] || {
      id: 'gw-gbkpay',
      name: 'GBKPAY Automated Gateway',
      provider: 'gbkpay',
      mode: 'automated_api',
      apiUrl: 'https://api.gbkpay.com/api/v1/payment/create',
      apiKey: 'gbk_live_demo',
      secretKey: 'sec_demo',
      merchantId: 'GBK-TCG-9921',
      webhookUrl: '',
      currency: 'BDT',
      isActive: true,
      autoApprove: true,
    };

  // Preset and custom amount (default 100 as in screenshot)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmountStr, setCustomAmountStr] = useState<string>('100');
  const [isAmountsCollapsed, setIsAmountsCollapsed] = useState(false);

  // Infographic guide state
  const [isInfographicOpen, setIsInfographicOpen] = useState(true);

  // Selected promotion
  const [selectedPromoId, setSelectedPromoId] = useState<string>('none');

  // Checkout modal states
  const [showDirectGateway, setShowDirectGateway] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Floating bonus banner dismissed state
  const [showFloatingBonus, setShowFloatingBonus] = useState(true);

  // Current effective amount
  const effectiveAmount = customAmountStr ? Number(customAmountStr) : selectedAmount || 0;

  // Selected promotion object
  const activePromo = promotions.find((p) => p.id === selectedPromoId) || null;

  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmountStr(String(amt));
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountStr(val);
    const num = Number(val);
    if (!isNaN(num)) {
      setSelectedAmount(num);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleNextClick = () => {
    if (!isAuthenticated) {
      showToast('ডিপোজিট করার পূর্বে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন!', 'error');
      navigate('login');
      return;
    }

    if (!effectiveAmount || effectiveAmount < selectedMethod.minAmount) {
      showToast(
        `সর্বনিম্ন ডিপোজিট ৳ ${selectedMethod.minAmount} নির্বাচন করুন`,
        'error'
      );
      return;
    }
    if (effectiveAmount > selectedMethod.maxAmount) {
      showToast(
        `সর্বোচ্চ ডিপোজিট ৳ ${selectedMethod.maxAmount} এর বেশি হতে পারবে না`,
        'error'
      );
      return;
    }

    // Check if the gateway is toggled Offline by admin
    if (associatedGateway && !associatedGateway.isActive) {
      showToast(
        `পেমেন্ট গেটওয়ে "${associatedGateway.name}" বর্তমানে অফলাইন (Offline)। অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে গেটওয়ে চালু করুন অথবা অন্য চ্যানেল ব্যবহার করুন।`,
        'error'
      );
      return;
    }

    // Directly open the automated payment gateway!
    setShowDirectGateway(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex flex-col justify-between select-none">
      {/* 100% Pixel-Accurate Header matching Screenshot 1 */}

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

          {/* Centered Yellow Bold Title: Deposit */}
          <h1 className="text-lg font-black text-[#FBBF24] tracking-wide absolute left-1/2 -translate-x-1/2">
            Deposit
          </h1>

          {/* Right Icon: Records History */}
          <div className="flex items-center gap-2">
            {/* Record / History Icon (Notepad with upward arrow) */}
            <button
              onClick={() => navigate('member/deposit-record')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#FBBF24] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Deposit History Records"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-3v3h-2v-3H8l4-4 4 4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="max-w-lg mx-auto px-3.5 py-3 space-y-3.5">
        {/* ================= SECTION 1: DEPOSIT METHOD ================= */}
        <section className="space-y-2">
          {/* Header with Orange Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
            <h2 className="text-xs font-black text-slate-800 tracking-tight">
              Deposit Method
            </h2>
          </div>

          {/* Grid of Methods matching Screenshot 1 */}
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {activeMethods.map((method) => {
              const isSelected = selectedMethodId === method.id;

              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`relative bg-white rounded-xl p-2 pt-3 flex flex-col items-center justify-between text-center cursor-pointer transition-all min-h-[92px] shadow-2xs select-none ${
                    isSelected
                      ? 'border-2 border-[#E11D48] ring-1 ring-[#E11D48]/20'
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbs-up orange ribbon at top-left */}
                  <ThumbsUpRibbon />

                  {/* Logo Center */}
                  <div className="my-auto py-1">
                    {method.brand === 'nagad' ? (
                      method.type === 'send_money' ? (
                        <NagadBlueLogo />
                      ) : (
                        <NagadLogo />
                      )
                    ) : (
                      <BkashLogo
                        subText={
                          method.subtitle === 'CASH OUT'
                            ? 'bKash Limits'
                            : 'Send Money bKash'
                        }
                      />
                    )}
                  </div>

                  {/* Text at bottom */}
                  <div className="w-full">
                    {method.id === 'nagad-vip' ? (
                      <div className="text-[9px] font-black text-[#E11D48] italic leading-tight uppercase font-sans">
                        <div>NAGAD VIP</div>
                        <div>CASH OUT</div>
                      </div>
                    ) : (
                      <div
                        className={`text-[8.5px] font-black leading-tight uppercase ${
                          isSelected ? 'text-[#E11D48]' : 'text-slate-800'
                        }`}
                      >
                        {method.name} {method.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Bottom-right red checkmark if selected */}
                  {isSelected && <RedCheckBadge />}
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Channel Title in bold red italic */}
        <div className="text-center pt-0.5">
          <span className="text-sm font-black italic tracking-wide text-[#E11D48] font-serif">
            {selectedMethod.channelLabel}
          </span>
        </div>

        {/* ================= SECTION 2: PAYMENT CHANNEL ================= */}
        <section className="space-y-1.5">
          {/* Header with Cyan/Teal Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] shrink-0" />
            <h2 className="text-xs font-black text-slate-800 tracking-tight">
              Payment Channel
            </h2>
          </div>

          {/* Payment Channel Card with red border & orange ribbon */}
          <div className="w-36 relative bg-white rounded-xl p-2.5 border-2 border-[#E11D48] shadow-2xs flex flex-col items-center justify-center text-center">
            <ThumbsUpRibbon />
            <span className="text-[10px] font-black text-[#E11D48] italic tracking-tight font-serif pt-1">
              {selectedMethod.channelLabel}
            </span>
          </div>
        </section>

        {/* ================= SECTION 3: VISUAL INFOGRAPHIC ================= */}
        <section className="relative">
          <DepositInfographic
            title={`${
              selectedMethod.brand === 'bkash' ? 'বিকাশ (bKash)' : 'নগদ (Nagad)'
            } ${
              selectedMethod.subtitle === 'SEND MONEY'
                ? 'সেন্ড মানি (Send Money)'
                : 'ক্যাশ আউট (Cash out)'
            } প্রসেস`}
            isOpen={isInfographicOpen}
            onToggle={() => setIsInfographicOpen(!isInfographicOpen)}
            onClose={() => setIsInfographicOpen(false)}
          />

          {/* Floating Promotional Badge on the right as in screenshot */}
          {showFloatingBonus && (
            <div className="absolute -bottom-3 right-1 z-20 flex items-center pointer-events-auto">
              <div
                onClick={() => {
                  setSelectedPromoId('promo-1');
                  showToast('10% বোনাস অফার সিলেক্ট করা হয়েছে!', 'info');
                }}
                className="relative cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Claim 10% Extra Deposit Bonus!"
              >
                {/* 3D Gold Coins & Gift Bag */}
                <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 rounded-2xl p-1 shadow-lg border-2 border-white flex flex-col items-center justify-center rotate-3 animate-pulse">
                  <span className="text-[9px] font-black text-white leading-none">
                    BONUS
                  </span>
                  <span className="text-sm font-black text-white leading-tight">
                    10%
                  </span>
                  <div className="flex gap-0.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFloatingBonus(false);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] shadow-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ================= SECTION 4: DEPOSIT AMOUNTS ================= */}
        <section className="space-y-2 pt-1">
          {/* Header with Red Dot and Round Blue Dropdown Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shrink-0" />
              <h2 className="text-xs font-black text-slate-800 tracking-tight">
                Deposit Amounts
              </h2>
            </div>

            <button
              onClick={() => setIsAmountsCollapsed(!isAmountsCollapsed)}
              className="w-5 h-5 rounded-full bg-[#93C5FD] text-[#1E3A8A] flex items-center justify-center transition-transform"
              title="Toggle amounts view"
            >
              {isAmountsCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
              )}
            </button>
          </div>

          {!isAmountsCollapsed && (
            <div className="space-y-2.5">
              {/* Preset Amount Grid (5 Columns × 2 Rows matching Screenshot 2) */}
              <div className="grid grid-cols-5 gap-1.5">
                {selectedMethod.presets.map((amt) => {
                  const isAmtSelected =
                    effectiveAmount === amt || selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`relative py-2 px-1 rounded-xl text-xs font-mono transition-all text-center select-none shadow-2xs ${
                        isAmtSelected
                          ? 'bg-white text-[#E11D48] border-2 border-[#E11D48] shadow-xs font-black'
                          : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 font-bold'
                      }`}
                    >
                      <span>{amt.toLocaleString()}</span>
                      {isAmtSelected && <RedCheckBadge />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input Field with ৳ symbol */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-900 select-none">
                  ৳
                </span>
                <input
                  type="number"
                  value={customAmountStr}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="100 - 50,000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48]"
                />
              </div>

              {/* Deposit Info in red text */}
              <div className="text-left">
                <span className="text-xs font-bold text-[#E11D48]">
                  Deposit Info: 24/24
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ================= PAYMENT DETAILS matching Screenshot_20260930-064022.png ================= */}
        <section className="space-y-1.5 pt-1">
          {/* Header with Blue/Indigo Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shrink-0" />
            <h2 className="text-xs font-black text-slate-800 tracking-tight">
              Payment Details
            </h2>
          </div>

          {/* Card with Deposit Amounts and Actual Payment Amount */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Deposit Amounts</span>
              <span className="font-mono font-bold text-slate-800">
                ৳ {effectiveAmount.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Actual Payment Amount</span>
              <span className="font-mono font-black text-[#E11D48] text-sm">
                ৳ {effectiveAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: PROMOTIONS ================= */}

        <section className="space-y-2 pt-1">
          {/* Header with Magenta/Pink Dot */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shrink-0" />
            <h2 className="text-xs font-black text-slate-800 tracking-tight">
              Promotions
            </h2>
          </div>

          <div className="space-y-2">
            {/* Promo Option 1: 10% Bonus */}
            {promotions.map((promo) => {
              const isSelected = selectedPromoId === promo.id;
              return (
                <div
                  key={promo.id}
                  onClick={() => setSelectedPromoId(promo.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all bg-white shadow-2xs ${
                    isSelected
                      ? 'border-[#93C5FD] ring-2 ring-[#93C5FD]/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Radio Button */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#E11D48] bg-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-700 leading-snug">
                      {promo.title}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400 shrink-0 ml-2">
                    ≥ ৳ {promo.minAmount.toFixed(2)}
                  </span>
                </div>
              );
            })}

            {/* Promo Option 2: Do not participate in any promotions (Matching Screenshot 2) */}
            <div
              onClick={() => setSelectedPromoId('none')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all bg-white shadow-2xs relative ${
                selectedPromoId === 'none'
                  ? 'border-[#93C5FD] ring-2 ring-[#93C5FD]/40'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Selected Red Radio Button */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPromoId === 'none'
                      ? 'border-[#E11D48] bg-white'
                      : 'border-slate-300'
                  }`}
                >
                  {selectedPromoId === 'none' && (
                    <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                  )}
                </div>

                <span className="text-[11px] font-bold text-slate-800">
                  Do not participate in any promotions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Reward Chest 3D Icon at bottom right matching Screenshot 2 */}
        <div className="flex justify-end pt-1 pr-1">
          <div
            onClick={() => {
              setSelectedPromoId('promo-1');
              showToast('10% বোনাস অফার সিলেক্ট হয়েছে!', 'info');
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-1 shadow-md border-2 border-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Claim Deposit Bonus Voucher"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Gift className="w-5 h-5 fill-white/80" />
            </div>
          </div>
        </div>
      </main>

      {/* ================= STICKY BOTTOM BAR matching Screenshot_20260930-064022.png ================= */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-slate-200 p-3 w-full shadow-2xl mt-auto">
        <button
          onClick={handleNextClick}
          disabled={effectiveAmount <= 0}
          className={`w-full py-3.5 rounded-xl font-black text-base tracking-wide transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
            effectiveAmount > 0
              ? 'bg-[#E11D48] hover:bg-[#BE123C] text-white cursor-pointer shadow-lg shadow-red-500/25 ring-2 ring-red-400/30'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
        </button>
      </div>


      {/* ================= DIRECT PAYMENT GATEWAY ================= */}
      <DirectGatewayScreen
        isOpen={showDirectGateway}
        onClose={() => setShowDirectGateway(false)}
        method={selectedMethod}
        gateway={associatedGateway}
        amount={effectiveAmount}
        promotion={activePromo}
        onSuccess={() => {
          setShowDirectGateway(false);
          navigate('member/deposit-record');
        }}
      />

      {/* 1. Automated API Gateway Checkout Modal */}
      <AutomatedApiCheckoutModal
        isOpen={showAutoModal}
        onClose={() => setShowAutoModal(false)}
        method={selectedMethod}
        gateway={associatedGateway}
        amount={effectiveAmount}
        promotion={activePromo}
        onSuccess={() => {
          setShowAutoModal(false);
          navigate('member/deposit-record');
        }}
      />

      {/* 2. Manual Agent Cash Out Modal */}
      <ManualCashoutCheckoutModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        method={selectedMethod}
        amount={effectiveAmount}
        promotion={activePromo}
        onSuccess={() => {
          setShowManualModal(false);
          navigate('member/deposit-record');
        }}
      />
    </div>
  );
};

