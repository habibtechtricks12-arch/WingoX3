import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDeposit } from '../../context/DepositContext';
import { DepositMethodConfig, GatewayApiConfig, DepositPromotion } from '../../types/deposit';
import { NagadLogo, BkashLogo } from './DepositIcons';
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
  Copy,
  AlertCircle,
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

export const AutomatedApiCheckoutModal: React.FC<Props> = ({
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

  const [step, setStep] = useState<'input_phone' | 'otp' | 'pin' | 'processing' | 'success'>('input_phone');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '01723294209');
  const [otp, setOtp] = useState('7492');
  const [pin, setPin] = useState('••••');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<{ id: string; trxId: string } | null>(null);

  if (!isOpen) return null;

  const bonusAmount = promotion ? (amount * promotion.bonusPercent) / 100 : 0;
  const totalCredit = amount + bonusAmount;

  const handleProceedToOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please enter a valid 11-digit mobile number', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      showToast('Verification code (OTP) sent to ' + phoneNumber, 'info');
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      showToast('Please enter the 4-digit OTP', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('pin');
    }, 500);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setStep('processing');

    const randomTrx = `${method.brand === 'bkash' ? 'BK' : 'NG'}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Simulate API call to the configured API Endpoint
    setTimeout(async () => {
      const order = await createOrder({
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
        trxId: randomTrx,
        mode: 'automated_api',
        gatewayProvider: gateway.name,
      });

      setCreatedOrderData({ id: order.id, trxId: randomTrx });
      setLoading(false);
      setStep('success');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast(`🎉 ৳ ${totalCredit.toFixed(2)} deposited successfully via ${gateway.name}!`, 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Gateway Header Banner */}
        <div className="bg-gradient-to-r from-[#0C4544] via-[#0E5251] to-[#0A3C3B] p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md">
              {method.brand === 'bkash' ? <BkashLogo /> : <NagadLogo />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {gateway.name}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded text-[9px] font-bold">
                  AUTO API
                </span>
              </div>
              <h3 className="text-base font-black text-white">{method.name}</h3>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="mt-3 bg-black/30 rounded-xl p-2.5 flex items-center justify-between border border-white/10">
            <div>
              <span className="text-[10px] text-slate-300 block font-medium">Deposit Amount</span>
              <span className="text-lg font-black font-mono text-amber-300">
                ৳ {amount.toFixed(2)}
              </span>
            </div>
            {bonusAmount > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-emerald-300 block font-medium">
                  +10% Bonus
                </span>
                <span className="text-xs font-bold font-mono text-emerald-300">
                  +৳ {bonusAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {step === 'input_phone' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
                <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Automated Instant Gateway:</strong> Your deposit will be credited instantly to your account without manual confirmation.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Your {method.brand === 'bkash' ? 'bKash' : 'Nagad'} Account Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="agree" className="text-[11px] text-slate-600 cursor-pointer">
                  I agree to the payment gateway terms and conditions.
                </label>
              </div>

              {/* API Info Badge */}
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono truncate">
                API Endpoint: {gateway.apiUrl}
              </div>

              <button
                onClick={handleProceedToOtp}
                disabled={loading || !agreeTerms}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Proceed to Verification <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-3">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-700">Enter Verification Code (OTP)</span>
                <p className="text-[11px] text-slate-500">
                  A 4-digit code was sent to <strong className="font-mono text-slate-800">{phoneNumber}</strong>
                </p>
              </div>

              <div className="flex justify-center py-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-36 text-center py-2.5 rounded-xl border-2 border-amber-400 text-xl font-mono font-black tracking-widest text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <p className="text-[10px] text-center text-slate-400">
                (Demo simulated code: <span className="font-bold text-slate-600 font-mono">7492</span>)
              </p>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm OTP'}
              </button>
            </div>
          )}

          {step === 'pin' && (
            <div className="space-y-3">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-700">Enter Account PIN</span>
                <p className="text-[11px] text-slate-500">
                  Enter your {method.brand === 'bkash' ? 'bKash' : 'Nagad'} PIN to authorize ৳ {amount.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-center py-2">
                <input
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-36 text-center py-2.5 rounded-xl border-2 border-amber-400 text-xl font-mono font-black tracking-widest text-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>256-bit encrypted gateway tunnel</span>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  `Pay ৳ ${amount.toFixed(2)}`
                )}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Processing Payment...</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Calling {gateway.name} REST API Webhook
                </p>
              </div>
            </div>
          )}

          {step === 'success' && createdOrderData && (
            <div className="py-2 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ৳ {totalCredit.toFixed(2)} added to your available balance
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-left space-y-1.5 text-xs border border-slate-200 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">TrxID:</span>
                  <span className="font-bold text-slate-800">{createdOrderData.trxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway:</span>
                  <span className="font-bold text-slate-800">{gateway.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">Auto Approved</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md active:scale-98 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
