import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Gift, UserCheck, Award, Gem, Users } from 'lucide-react';
import { PageRoute } from '../types';

export const BottomNavigation: React.FC = () => {
  const { currentRoute, navigate } = useApp();

  const isHomeActive = currentRoute === 'home';
  const isPromoActive = currentRoute === 'reward';
  const isInviteActive = currentRoute.startsWith('invite');
  const isRewardActive = currentRoute === 'member/mission' || currentRoute === 'member/rebate';
  const isMemberActive =
    currentRoute.startsWith('member') ||
    currentRoute === 'deposit' ||
    currentRoute === 'withdrawal' ||
    currentRoute === 'bank-account';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#06212B] border-t border-[#0F3543] shadow-[0_-5px_20px_rgba(0,0,0,0.4)] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-between h-16 px-3 relative">
        {/* 1. Home */}
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            isHomeActive ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.6] text-amber-400' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${isHomeActive ? 'font-black text-amber-400' : 'font-medium'}`}>
            Home
          </span>
          {isHomeActive && (
            <div className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 2. Promotion */}
        <button
          onClick={() => navigate('reward')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            isPromoActive ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gift className={`w-5 h-5 ${isPromoActive ? 'stroke-[2.6] text-amber-400' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${isPromoActive ? 'font-black text-amber-400' : 'font-medium'}`}>
            Promotion
          </span>
          {isPromoActive && (
            <div className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 3. Center Elevated Floating Invite Button matching Screenshot 1 & 2 */}
        <div className="relative flex flex-col items-center justify-center flex-1 -top-3">
          <button
            onClick={() => navigate('invite')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
              isInviteActive
                ? 'bg-gradient-to-tr from-teal-400 to-cyan-300 text-slate-950 border-white ring-2 ring-cyan-400 scale-105'
                : 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 border-[#06212B]'
            }`}
            aria-label="Invite"
          >
            <Users className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className={`text-[10px] mt-0.5 tracking-tight ${isInviteActive ? 'font-black text-cyan-300' : 'font-semibold text-slate-300'}`}>
            Invite
          </span>
        </div>

        {/* 4. Reward */}
        <button
          onClick={() => navigate('member/mission')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            isRewardActive ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className={`w-5 h-5 ${isRewardActive ? 'stroke-[2.6] text-amber-400' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${isRewardActive ? 'font-black text-amber-400' : 'font-medium'}`}>
            Reward
          </span>
          {isRewardActive && (
            <div className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* 5. Member */}
        <button
          onClick={() => navigate('member')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            isMemberActive ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gem className={`w-5 h-5 ${isMemberActive ? 'stroke-[2.6] text-amber-400' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${isMemberActive ? 'font-black text-amber-400' : 'font-medium'}`}>
            Member
          </span>
          {isMemberActive && (
            <div className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
