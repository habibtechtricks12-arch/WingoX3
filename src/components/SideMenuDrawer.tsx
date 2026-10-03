import React from 'react';
import { useApp } from '../context/AppContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  Flame,
  UserPlus,
  Heart,
  Gift,
  Dices,
  Award,
  CircleDollarSign,
  Percent,
  Coins,
  Gem,
  Fish,
  Target,
  Trophy,
  Globe,
  Gamepad2,
  Download,
  Ticket,
  Headphones,
  Shield,
  X,
} from 'lucide-react';
import { PageRoute } from '../types';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({ isOpen, onClose }) => {
  const { navigate, showToast } = useApp();
  const { branding } = useSiteSettings();

  if (!isOpen) return null;

  const menuItems = [
    // Row 1
    {
      label: 'Hot Games',
      icon: Flame,
      color: 'text-amber-500',
      action: () => {
        navigate('home');
        onClose();
      },
    },
    {
      label: 'Invite friends',
      icon: UserPlus,
      color: 'text-cyan-400',
      action: () => {
        navigate('invite');
        onClose();
      },
    },
    // Row 2
    {
      label: 'Favorites',
      icon: Heart,
      color: 'text-rose-400',
      action: () => {
        navigate('slots');
        onClose();
      },
    },
    {
      label: 'Promotion',
      icon: Gift,
      color: 'text-amber-400',
      action: () => {
        navigate('reward');
        onClose();
      },
    },
    // Row 3
    {
      label: 'Slots',
      icon: Dices,
      color: 'text-amber-500',
      action: () => {
        navigate('slots');
        onClose();
      },
    },
    {
      label: 'Reward Center',
      icon: Award,
      color: 'text-yellow-400',
      action: () => {
        navigate('reward');
        onClose();
      },
    },
    // Row 4
    {
      label: 'Live Casino',
      icon: CircleDollarSign,
      color: 'text-orange-400',
      action: () => {
        showToast('Live Casino lobby available in demo mode', 'info');
        navigate('home');
        onClose();
      },
    },
    {
      label: 'Manual rebate',
      icon: Percent,
      color: 'text-amber-400',
      action: () => {
        navigate('member/rebate');
        onClose();
      },
    },
    // Row 5
    {
      label: 'Poker',
      icon: Coins,
      color: 'text-red-400',
      action: () => {
        showToast('Poker tables available in demo mode', 'info');
        navigate('home');
        onClose();
      },
    },
    {
      label: 'VIP',
      icon: Gem,
      color: 'text-yellow-400',
      action: () => {
        navigate('reward');
        onClose();
      },
    },
    // Row 6
    {
      label: 'Fish',
      icon: Fish,
      color: 'text-rose-400',
      action: () => {
        showToast('Fish shooting arcade available in demo mode', 'info');
        navigate('home');
        onClose();
      },
    },
    {
      label: 'Mission',
      icon: Target,
      color: 'text-amber-400',
      action: () => {
        navigate('member/mission');
        onClose();
      },
    },
    // Row 7
    {
      label: 'Sports',
      icon: Trophy,
      color: 'text-orange-400',
      action: () => {
        showToast('Cricket & Sports sportsbook in demo mode', 'info');
        navigate('home');
        onClose();
      },
    },
    {
      label: 'Language',
      icon: Globe,
      color: 'text-sky-400',
      action: () => {
        showToast('Language: English / Bengali (বাংলা)', 'info');
        onClose();
      },
    },
    // Row 8
    {
      label: 'E-sports',
      icon: Gamepad2,
      color: 'text-red-400',
      action: () => {
        showToast('E-sports arena simulation active', 'info');
        navigate('home');
        onClose();
      },
    },
    {
      label: 'APP Download',
      icon: Download,
      color: 'text-emerald-400',
      action: () => {
        navigate('member/download');
        onClose();
      },
    },
    // Row 9
    {
      label: 'Lottery',
      icon: Ticket,
      color: 'text-amber-500',
      action: () => {
        navigate('lottery');
        onClose();
      },
    },
    {
      label: 'Customer Service',
      icon: Headphones,
      color: 'text-emerald-400',
      action: () => {
        navigate('member/customer-service');
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Body - 70% width on mobile */}
      <div className="relative z-10 w-[72%] max-w-xs h-full bg-[#06212B] border-r border-[#104354] shadow-2xl flex flex-col overflow-y-auto no-scrollbar animate-in slide-in-from-left duration-250">
        {/* Top Drawer Header with close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0F3644] bg-[#07242E]">
          <div className="flex items-center gap-1.5">
            <span
              className="text-lg font-black tracking-tight"
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
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0C3542] text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Menu Grid matching Screenshot 3 */}
        <div className="p-2.5 grid grid-cols-2 gap-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center h-20 rounded-xl bg-[#092D39] hover:bg-[#0D3B4B] border border-[#13495B]/70 p-2 text-center transition-all active:scale-95 group"
              >
                <div className={`p-1.5 rounded-full mb-1 transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-100 leading-tight line-clamp-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
