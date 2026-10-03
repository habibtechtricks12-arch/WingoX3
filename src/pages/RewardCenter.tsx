import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ASSETS } from '../assets/assetPaths';
import {
  Gift,
  CalendarCheck,
  Coins,
  Users,
  Tag,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const RewardCenter: React.FC = () => {
  const {
    user,
    signInStreak,
    hasClaimedToday,
    claimDailySignIn,
    navigate,
    showToast,
  } = useApp();

  // Modals state
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleRedeemPromo = () => {
    if (!promoCodeInput.trim()) {
      showToast('Please enter a demo promo code', 'error');
      return;
    }
    showToast(`Promo Code [${promoCodeInput.toUpperCase()}] redeemed! Demo bonus applied!`, 'success');
    setShowPromoModal(false);
    setPromoCodeInput('');
  };

  const handleRescueClaim = () => {
    showToast('Rescue Fund subsidy of ৳ 25.00 added to your demo balance!', 'success');
    setShowRescueModal(false);
  };

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      <Header title="Reward Center" />

      <main className="max-w-lg mx-auto px-3.5 py-3.5 space-y-4">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white p-4 shadow-lg border border-teal-800/40">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={ASSETS.vipCrownBadge}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-sm bg-slate-800"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px]">
                  VIP{user.vipLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">{user.nickname}</h3>
                  <span className="text-[10px] font-mono text-slate-400">({user.id})</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[10px] text-slate-400">Balance:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    ৳ {user.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right Sign In Action */}
            <button
              onClick={() => setShowSignInModal(true)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition-all ${
                hasClaimedToday
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              {hasClaimedToday ? 'Signed In' : 'Sign In'}
            </button>
          </div>

          {/* VIP Benefits & Progress Bar */}
          <div className="mt-3.5 pt-3 border-t border-teal-800/50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-teal-200 font-semibold">VIP0 Benefits</span>
              <span className="font-mono text-slate-300">Exp: 240 / 1000</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-teal-950 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[24%]" />
            </div>
            <span className="text-[10px] text-teal-300/80 block">
              Bet 760TK more to unlock VIP1 privileges and upgraded rebates.
            </span>
          </div>
        </div>

        {/* 2-Column Card Grid (5 Cards from specification) */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Card 1: Bonus - Green Gradient */}
          <div
            onClick={() => setShowBonusModal(true)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-4 shadow-md cursor-pointer hover:shadow-lg active:scale-98 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Bonus
              </h4>
              <p className="text-[11px] text-emerald-100/90 mt-0.5">Collect welcome gift</p>
            </div>
          </div>

          {/* Card 2: Sign In - Blue Gradient */}
          <div
            onClick={() => setShowSignInModal(true)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-4 shadow-md cursor-pointer hover:shadow-lg active:scale-98 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Sign In
              </h4>
              <p className="text-[11px] text-blue-100/90 mt-0.5">Daily check-in reward</p>
            </div>
          </div>

          {/* Card 3: Rescue Fund - Orange/Yellow Gradient */}
          <div
            onClick={() => setShowRescueModal(true)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-4 shadow-md cursor-pointer hover:shadow-lg active:scale-98 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Rescue Fund
              </h4>
              <p className="text-[11px] text-amber-100/90 mt-0.5">Daily loss subsidy</p>
            </div>
          </div>

          {/* Card 4: Invite Friends - Pink/Red Gradient */}
          <div
            onClick={() => navigate('invite')}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 text-white p-4 shadow-md cursor-pointer hover:shadow-lg active:scale-98 transition-all min-h-[120px] flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Invite Friends
              </h4>
              <p className="text-[11px] text-rose-100/90 mt-0.5">High commission rebate</p>
            </div>
          </div>

          {/* Card 5: Promo Code - Cyan/Blue Gradient with Notification Badge "1" */}
          <div
            onClick={() => setShowPromoModal(true)}
            className="col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 text-white p-4 shadow-md cursor-pointer hover:shadow-lg active:scale-98 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-white">Promo Code</h4>
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black shadow-xs">
                    1 Available
                  </span>
                </div>
                <p className="text-xs text-cyan-100/90">Enter promotional redemption code</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-cyan-200" />
          </div>
        </div>
      </main>

      {/* ================= MODALS ================= */}

      {/* Daily Sign-In Modal */}
      <Modal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        title="Daily Sign-In Streak"
      >
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs text-slate-500 block">Current Check-In Streak</span>
            <span className="text-2xl font-black text-amber-600 font-mono">
              {signInStreak} Days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day < signInStreak || (day === signInStreak && hasClaimedToday);
              const isCurrent = day === signInStreak && !hasClaimedToday;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                    isPast
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : isCurrent
                      ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] block">D{day}</span>
                  <span className="font-mono text-[11px] block mt-0.5">
                    ৳{5 + day * 2}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              claimDailySignIn();
              setShowSignInModal(false);
            }}
            disabled={hasClaimedToday}
            className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
              hasClaimedToday
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-98'
            }`}
          >
            {hasClaimedToday ? 'Claimed for Today' : 'Collect Today\'s Bonus'}
          </button>
        </div>
      </Modal>

      {/* Bonus Modal */}
      <Modal
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
        title="Member Welcome Bonus"
      >
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">VIP0 Newbie Package</h4>
            <p className="text-xs text-slate-500 mt-1">
              Claim daily lottery ticket subsidies and exclusive tournament benefits.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono font-bold text-emerald-700">
            Bonus Reward: ৳ 50.00 Demo Voucher
          </div>
          <button
            onClick={() => {
              showToast('Member bonus claimed successfully!', 'success');
              setShowBonusModal(false);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
          >
            Claim Bonus
          </button>
        </div>
      </Modal>

      {/* Rescue Fund Modal */}
      <Modal
        isOpen={showRescueModal}
        onClose={() => setShowRescueModal(false)}
        title="Rescue Fund Protection"
      >
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Daily Loss Protection</h4>
            <p className="text-xs text-slate-500 mt-1">
              Eligible players receive up to 5% loss relief everyday to keep playing worry-free.
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-xs font-mono text-amber-800">
            Available Relief: ৳ 25.00
          </div>
          <button
            onClick={handleRescueClaim}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors"
          >
            Claim Relief
          </button>
        </div>
      </Modal>

      {/* Promo Code Modal */}
      <Modal
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        title="Redeem Promo Code"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Enter your secret promotion code below to receive instant demo balance credit.
          </p>
          <input
            type="text"
            placeholder="e.g. TCGWIN2026"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleRedeemPromo}
            className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 shadow-md transition-colors"
          >
            Redeem Code
          </button>
        </div>
      </Modal>
    </div>
  );
};
