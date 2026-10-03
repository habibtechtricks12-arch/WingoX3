import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useDeposit } from '../../context/DepositContext';
import { DepositMethodConfig, GatewayApiConfig, DepositPromotion } from '../../types/deposit';
import { NagadLogo, BkashLogo, RocketLogo } from './DepositIcons';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  X,
  ExternalLink,
  Smartphone,
  ChevronLeft,
  Clock,
  AlertCircle,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  method: DepositMethodConfig;
  gateway: GatewayApiConfig;
  amount: number;
  promotion: DepositPromotion | null;
  onSuccess: () => void;
}

export const DirectGatewayScreen: React.FC<Props> = ({
  isOpen,
  onClose,
  method,
  gateway,
  amount,
  promotion,
  onSuccess,
}) => {
  const { user, showToast } = useApp();
  const { createOrder } = useDeposit();

  const [step, setStep] = useState<'gateway_landing' | 'otp_verify' | 'pin_auth' | 'processing' | 'success'>('gateway_landing');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '01723294209');
  const [otp, setOtp] = useState('8291');
  const [pin, setPin] = useState('••••');
  const [loading, setLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 15 mins timer
  const [orderTrxId, setOrderTrxId] = useState('');

  // 15-minute countdown timer like authentic gateways
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const bonusAmount = promotion ? (amount * promotion.bonusPercent) / 100 : 0;
  const totalCredit = amount + bonusAmount;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const randomInvoice = `GBK-INV-${Date.now().toString().slice(-6)}`;

  const handleStartGatewayPayment = () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      showToast('দয়া করে সঠিক ১১ ডিজিটের অ্যাকাউন্ট নম্বর দিন', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp_verify');
      showToast('গেটওয়ে ভেরিফিকেশন কোড (OTP) পাঠানো হয়েছে: ' + phoneNumber, 'info');
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      showToast('দয়া করে ৪ ডিজিটের ওটিপি দিন', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('pin_auth');
    }, 500);
  };

  const handleAuthorizePin = async () => {
    setLoading(true);
    setStep('processing');

    const generatedTrx = `${method.brand === 'bkash' ? 'BK' : 'NG'}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    setTimeout(async () => {
      await createOrder({
        userId: user.id,
        userNickname: user.nickname,
        methodId: method.id,
        methodName: `${method.name} ${method.subtitle}`,
        channelLabel: method.channelLabel,
        amount,
        bonusPercent: promotion ? promotion.bonusPercent : 0,
        bonusAmount,
        totalCredit,
        senderNumber: phoneNumber,
        trxId: generatedTrx,
        mode: 'automated_api',
        gatewayProvider: gateway.name,
      });

      setOrderTrxId(generatedTrx);
      setLoading(false);
      setStep('success');

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
      showToast(`🎉 ৳ ${totalCredit.toFixed(2)} টাকা সফলভাবে জমা হয়েছে!`, 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F1F5F9] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Official Payment Gateway Top Bar */}
      <header className="w-full bg-[#0C4544] text-white p-3.5 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <ChevronLeft className="w-4 h-4" /> ফিরে যান
          </button>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                gateway.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-black tracking-wider uppercase text-white font-mono">
              {gateway.name}
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                gateway.isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
              }`}
            >
              {gateway.isActive ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>


          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-black/30 px-2 py-0.5 rounded-full border border-white/10">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{timerStr}</span>
          </div>
        </div>
      </header>

      {/* Gateway Body */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 space-y-3.5">
        {/* Merchant Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
              মার্চেন্ট / প্ল্যাটফর্ম
            </span>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <span>Wingo X 3</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> VERIFIED
              </span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
              Invoice: {randomInvoice}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">
              পরিশোধের পরিমাণ
            </span>
            <span className="text-xl font-black font-mono text-[#E11D48]">
              ৳ {amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Selected Gateway Channel Details */}
        <div className="bg-gradient-to-r from-[#0C4544] via-[#0E5251] to-[#0A3C3B] rounded-2xl p-3.5 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
              {method.brand === 'bkash' ? <BkashLogo /> : method.brand === 'rocket' ? <RocketLogo /> : <NagadLogo />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide block">
                {method.channelLabel}
              </span>
              <h3 className="text-sm font-black text-white">{method.name}</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-black uppercase">
              Instant Gateway
            </span>
          </div>
        </div>

        {/* Step 1: Input Account Number */}
        {step === 'gateway_landing' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3.5">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                এটি সরাসরি অটোমেটেড পেমেন্ট গেটওয়ে। আপনার {method.brand === 'bkash' ? 'বিকাশ' : 'নগদ'} অ্যাকাউন্ট নম্বর দিন এবং নিচের বাটনে ক্লিক করুন।
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                আপনার {method.brand === 'bkash' ? 'bKash' : 'Nagad'} নম্বর দিন:
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-[#E11D48]"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 ও 256-বিট এন্ড-টু-এন্ড এনক্রিপ্টেড সিকিউরিটি</span>
            </div>

            <button
              onClick={handleStartGatewayPayment}
              disabled={loading || phoneNumber.length < 11}
              className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>পরবর্তী ধাপে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp_verify' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3.5 text-center">
            <div>
              <h3 className="text-sm font-black text-slate-900">ওটিপি কোড (OTP) প্রবেশ করুন</h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong className="font-mono text-slate-800">{phoneNumber}</strong> নম্বরে একটি ৪ ডিজিটের কোড পাঠানো হয়েছে
              </p>
            </div>

            <div className="py-2 flex justify-center">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-40 text-center py-2.5 rounded-xl border-2 border-[#E11D48] text-2xl font-mono font-black tracking-widest text-slate-900 focus:outline-none shadow-sm"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              (ডেমো গেটওয়ে ওটিপি: <span className="font-mono font-bold text-slate-700">8291</span>)
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 4}
              className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : 'যাচাই করুন'}
            </button>
          </div>
        )}

        {/* Step 3: PIN Authorization */}
        {step === 'pin_auth' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3.5 text-center">
            <div>
              <h3 className="text-sm font-black text-slate-900">PIN নিশ্চিত করুন</h3>
              <p className="text-xs text-slate-500 mt-1">
                ৳ {amount.toFixed(2)} পরিশোধ অনুমোদন করতে আপনার PIN দিন
              </p>
            </div>

            <div className="py-2 flex justify-center">
              <input
                type="password"
                maxLength={5}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-40 text-center py-2.5 rounded-xl border-2 border-[#E11D48] text-2xl font-mono font-black tracking-widest text-slate-900 focus:outline-none shadow-sm"
              />
            </div>

            <button
              onClick={handleAuthorizePin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                `পরিশোধ করুন ৳ ${amount.toFixed(2)}`
              )}
            </button>
          </div>
        )}

        {/* Step 4: Gateway Processing */}
        {step === 'processing' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-[#E11D48] animate-spin mx-auto" />
            <div>
              <h4 className="text-base font-black text-slate-900">পেমেন্ট গেটওয়েতে প্রসেসিং হচ্ছে...</h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Calling {gateway.name} Secure Endpoint
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Success Receipt */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-center space-y-3.5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">ডিপোজিট সফল হয়েছে!</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                আপনার ওয়ালেটে ৳ {totalCredit.toFixed(2)} টাকা যোগ করা হয়েছে।
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-left space-y-1 text-xs border border-slate-200 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">TrxID:</span>
                <span className="font-bold text-slate-900">{orderTrxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">অ্যামাউন্ট:</span>
                <span className="font-bold text-slate-900">৳ {amount.toFixed(2)}</span>
              </div>
              {bonusAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>বোনাস:</span>
                  <span>+৳ {bonusAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1">
                <span>স্ট্যাটাস:</span>
                <span>Auto Approved</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-md active:scale-98 transition-all cursor-pointer"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        )}
      </main>

      {/* Gateway Footer */}
      <footer className="max-w-md w-full mx-auto p-3 text-center text-[10px] text-slate-400">
        Powered by {gateway.name} · Secured with 256-Bit SSL Encryption
      </footer>
    </div>
  );
};
