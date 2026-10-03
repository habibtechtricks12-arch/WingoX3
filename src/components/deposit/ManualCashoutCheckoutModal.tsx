import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDeposit } from '../../context/DepositContext';
import { DepositMethodConfig, DepositPromotion } from '../../types/deposit';
import { NagadLogo, BkashLogo } from './DepositIcons';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Hash,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  method: DepositMethodConfig;
  amount: number;
  promotion: DepositPromotion | null;
  onSuccess: () => void;
}

export const ManualCashoutCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  method,
  amount,
  promotion,
  onSuccess,
}) => {
  const { user, showToast } = useApp();
  const { createOrder } = useDeposit();

  const [senderNumber, setSenderNumber] = useState(user.phone || '01723294209');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ id: string } | null>(null);

  if (!isOpen) return null;

  const bonusAmount = promotion ? (amount * promotion.bonusPercent) / 100 : 0;
  const totalCredit = amount + bonusAmount;

  const copyAgentNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(method.agentNumber);
    }
    setCopied(true);
    showToast(`এজেন্ট নম্বর কপি হয়েছে: ${method.agentNumber}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderNumber || senderNumber.length < 10) {
      showToast('দয়া করে আপনার সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন', 'error');
      return;
    }

    if (!trxId || trxId.trim().length < 6) {
      showToast('দয়া করে সঠিক TrxID (ট্রানজেকশন আইডি) দিন', 'error');
      return;
    }

    setSubmitting(true);

    try {
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
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
        mode: 'manual_agent',
        gatewayProvider: 'Agent Manual Cash Out',
      });

      setSubmitting(false);
      setSubmittedOrder({ id: order.id });
      confetti({ particleCount: 50, spread: 60 });
      showToast('ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন খুব শীঘ্রই যাচাই করবেন।', 'success');
    } catch {
      setSubmitting(false);
      showToast('Error submitting deposit request', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0C4544] p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              {method.brand === 'bkash' ? <BkashLogo /> : <NagadLogo />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                {method.channelLabel}
              </span>
              <h3 className="text-base font-black text-white">{method.name}</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5">
          {!submittedOrder ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Payment Details Box */}
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">ডিপোজিট পরিমাণ:</span>
                  <div className="flex items-baseline gap-1 text-base font-black text-slate-900 font-mono">
                    <span className="text-amber-600">৳</span>
                    <span>{amount.toFixed(2)}</span>
                  </div>
                </div>

                {bonusAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold border-t border-amber-200/60 pt-1">
                    <span>প্রমোশন বোনাস (১০%):</span>
                    <span>+৳ {bonusAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Agent Wallet Number with Copy */}
                <div className="bg-white rounded-xl p-2.5 border border-amber-300 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      {method.subtitle} এজেন্ট নম্বর:
                    </span>
                    <span className="font-mono text-base font-black text-[#B91C1C] tracking-wide">
                      {method.agentNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyAgentNumber}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>কিভাবে পেমেন্ট করবেন:</span>
                </div>
                <p>১. আপনার অ্যাপ থেকে উপরের নম্বরে ঠিক <strong className="text-slate-900 font-mono">৳{amount}</strong> {method.subtitle} করুন।</p>
                <p>২. লেনদেন সফল হলে নিচের বক্সে TrxID ও আপনার নম্বর দিয়ে সাবমিট করুন।</p>
              </div>

              {/* Inputs */}
              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    আপনার {method.brand === 'bkash' ? 'bKash' : 'Nagad'} নম্বর:
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    TrxID / ট্রানজেকশন আইডি:
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="যেমন: 9K3L7B0X2A"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'জমা দেওয়া হচ্ছে...' : 'পেমেন্ট নিশ্চিত করুন'}
              </button>
            </form>
          ) : (
            <div className="py-3 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">রিকোয়েস্ট জমা হয়েছে!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  আপনার ডিপোজিট রিকোয়েস্ট আইডি: <strong className="font-mono text-slate-900">{submittedOrder.id}</strong>
                </p>
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                  এডমিন প্যানেল থেকে ভেরিফাই করার সাথে সাথে আপনার ব্যালেন্স যুক্ত হবে। আপনি চাইলে এডমিন প্যানেলে গিয়ে এখনই অ্যাপ্রুভ টেস্ট করতে পারেন!
                </p>
              </div>

              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md"
              >
                ঠিক আছে
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
