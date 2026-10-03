import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { ChevronLeft, RefreshCw, SlidersHorizontal, Menu, Shield } from 'lucide-react';
import { SideMenuDrawer } from './SideMenuDrawer';

interface HeaderProps {
  title?: string;
  isHome?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, isHome = false, rightAction }) => {
  const { user, isAuthenticated, refreshBalance, isRefreshingBalance, goBack, navigate } = useApp();
  const { branding } = useSiteSettings();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isHome) {
    return (
      <>
        <header className="sticky top-0 z-30 w-full bg-[#06212B] border-b border-[#0F3543] px-3.5 py-2.5 shadow-md">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {/* Left: Hamburger Menu Button matching Screenshot 1 */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-9 h-9 rounded-lg bg-[#0A2E3B] text-slate-200 hover:text-white flex items-center justify-center border border-[#124456] active:scale-95 transition-all"
                aria-label="Open Menu Drawer"
              >
                {/* 3 lines with slider dots */}
                <div className="flex flex-col gap-1 w-4">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1 bg-amber-400 rounded-full" />
                    <span className="w-full h-0.5 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-full h-0.5 bg-slate-200 rounded-full" />
                    <span className="w-1.5 h-1 bg-amber-400 rounded-full" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1 bg-amber-400 rounded-full" />
                    <span className="w-full h-0.5 bg-slate-200 rounded-full" />
                  </div>
                </div>
              </button>

              {/* Dynamic Logo: Text / Image / Both */}
              <div
                onClick={() => navigate('home')}
                className="flex items-center gap-1.5 cursor-pointer select-none"
              >
                {(branding.logoType === 'image' || branding.logoType === 'both') && branding.logoImageUrl && (
                  <img
                    src={branding.logoImageUrl}
                    alt={branding.siteName}
                    style={{ height: `${branding.logoHeight || 30}px` }}
                    className="object-contain max-w-[130px] rounded-sm"
                  />
                )}
                {(branding.logoType === 'text' || branding.logoType === 'both' || !branding.logoImageUrl) && (
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="text-xl font-black tracking-tighter"
                      style={{ color: branding.logoPrefixColor || '#F97316' }}
                    >
                      {branding.siteName || 'Wingo'}
                    </span>
                    <span
                      className="text-base font-extrabold"
                      style={{ color: branding.logoMiddleColor || '#FFFFFF' }}
                    >
                      {branding.siteNameMiddle ?? 'X'}
                    </span>
                    <span
                      className="text-base font-extrabold"
                      style={{ color: branding.logoSuffixColor || '#22C55E' }}
                    >
                      {branding.siteNameSuffix ?? '3'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Authenticated User or Login/Register buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* User Avatar with golden border */}
                <div
                  onClick={() => navigate('member')}
                  className="relative cursor-pointer"
                  title="Profile"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#FBBF24] shadow-sm bg-slate-800"
                  />
                </div>

                {/* Balance Pill with refresh button */}
                <div
                  onClick={() => navigate('deposit')}
                  className="flex items-center gap-1.5 bg-[#052631] border border-[#0F4758] px-2.5 py-1 rounded-full cursor-pointer hover:border-amber-400/50 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-[#2DD4BF]">৳</span>
                  <span className="text-xs font-mono font-black text-[#2DD4BF]">
                    {user.balance.toFixed(2)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      refreshBalance();
                    }}
                    disabled={isRefreshingBalance}
                    className="p-0.5 text-teal-400 hover:text-amber-300 transition-colors ml-0.5"
                    aria-label="Refresh balance"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isRefreshingBalance ? 'animate-spin text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate('login')}
                  className="px-2.5 py-1 rounded-xl bg-transparent border border-amber-400 text-amber-300 text-xs font-bold hover:bg-amber-400/10 active:scale-95 transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Side Menu Drawer matching Screenshot 3 */}
        <SideMenuDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </>
    );
  }

  // Inner-Page Header matching Screenshot 4 (e.g. Slots, Lottery, Reward, etc.)
  return (
    <header className="sticky top-0 z-30 w-full bg-[#06212B] border-b border-[#0F3644] px-4 py-3 shadow-md">
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        {/* Gold Back Arrow */}
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-[#0A2E3B] hover:bg-[#0F3C4D] text-[#FBBF24] flex items-center justify-center transition-colors active:scale-95"
          aria-label="Go Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Bold Golden Centered Title matching Screenshot 4 */}
        <h1 className="text-lg font-black text-[#FBBF24] tracking-wide absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>

        {/* Contextual Right Action or Balance */}
        <div className="flex items-center gap-1.5">
          {rightAction ? (
            rightAction
          ) : (
            <div
              onClick={() => navigate('deposit')}
              className="flex items-center gap-1 bg-[#052631] border border-[#0F4758] px-2 py-1 rounded-full text-xs font-mono font-bold text-[#2DD4BF]"
            >
              <span>৳</span>
              <span>{user.balance.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
