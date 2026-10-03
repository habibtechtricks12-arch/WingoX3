import React, { createContext, useContext, useState, useEffect } from 'react';
import { BannerItem, BrandingSettings } from '../types/siteSettings';

const STORAGE_KEY_BANNERS = 'wingo_site_banners_v2';
const STORAGE_KEY_BRANDING = 'wingo_site_branding_v2';

const defaultBanners: BannerItem[] = [
  {
    id: 'banner-referral-bonus',
    title: '১ জন বন্ধুকে রেফার করলেই',
    highlightText: '১০০০ টাকা বোনাস',
    tagline: 'যত বেশি রেফার তত বেশি বোনাস',
    badge: 'WINGO X 3 BONUS',
    badgeBg: 'bg-amber-400 text-slate-950',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkRoute: 'invite',
    bgGradient: 'from-[#200B1A] via-[#100720] to-[#08182B]',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'banner-first-deposit',
    title: 'প্রথম ডিপোজিটে পান',
    highlightText: '১০০% ইনস্ট্যান্ট বোনাস',
    tagline: 'বিকাশ ও নগদ VIP পেমেন্টে দ্রুত ডিপোজিট করুন',
    badge: '100% BONUS',
    badgeBg: 'bg-emerald-500 text-white',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    linkRoute: 'deposit',
    bgGradient: 'from-[#06242E] via-[#093543] to-[#021319]',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'banner-aviator-crash',
    title: 'Aviator স্পেশাল ক্র্যাশ গেম',
    highlightText: '১০০X পর্যন্ত বিগ উইন',
    tagline: 'প্লেন ওড়ার আগেই ক্যাশ আউট করে জিতে নিন টাকা',
    badge: 'SPRIBE AVIATOR',
    badgeBg: 'bg-red-500 text-white',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    linkRoute: 'aviator',
    bgGradient: 'from-[#2B0E14] via-[#1A0509] to-[#3B111A]',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'banner-super-ace',
    title: 'Super Ace মেগা স্লট টুর্নামেন্ট',
    highlightText: 'লাখো টাকার গোল্ডেন জ্যাকপট',
    tagline: 'সেরা JILI স্লট গেম খেলে আজই জিতুন',
    badge: 'MEGA JACKPOT',
    badgeBg: 'bg-yellow-400 text-slate-900',
    imageUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
    linkRoute: 'super-ace',
    bgGradient: 'from-[#261A05] via-[#1A1203] to-[#362506]',
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
];

const defaultBranding: BrandingSettings = {
  siteName: 'Wingo',
  siteNameMiddle: 'X',
  siteNameSuffix: '3',
  logoType: 'text',
  logoImageUrl: '',
  logoHeight: 32,
  logoPrefixColor: '#F97316',
  logoMiddleColor: '#FFFFFF',
  logoSuffixColor: '#22C55E',
  announcementText: 'নতুন বছরের স্বপ্নের পরিকল্পনা আনুষ্ঠানিকভাবে চালু হয়েছে! 🥳🎉 1 জন বন্ধুকে রেফার করলেই ১০০০ টাকা বোনাস! যত বেশি রেফার তত বেশি বোনাস!',
  announcementSpeedSec: 20,
  announcementActive: true,
  bannerIntervalSeconds: 5, // প্রতি ৫ সেকেন্ড চেঞ্জ হবে per user prompt!
  bannerAutoPlay: true,
  hotGamesTitle: 'HOT GAMES',
  jackpotAmount: 100195476.44,
};

interface SiteSettingsContextType {
  banners: BannerItem[];
  activeBanners: BannerItem[];
  branding: BrandingSettings;
  addBanner: (banner: Omit<BannerItem, 'id' | 'createdAt'>) => BannerItem;
  updateBanner: (id: string, fields: Partial<BannerItem>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  reorderBanners: (sourceIndex: number, destIndex: number) => void;
  moveBanner: (id: string, direction: 'up' | 'down') => void;
  updateBranding: (fields: Partial<BrandingSettings>) => void;
  resetBannersToDefaults: () => void;
  resetBrandingToDefaults: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BANNERS) || localStorage.getItem('tcg_site_banners_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: BannerItem) => ({
            ...b,
            badge: b.badge ? b.badge.replace(/CK44/g, 'WINGO X 3') : b.badge,
            title: b.title ? b.title.replace(/CK44/g, 'WINGO X 3') : b.title,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return defaultBanners;
  });

  const [branding, setBranding] = useState<BrandingSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BRANDING) || localStorage.getItem('tcg_site_branding_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.siteName === 'CK44') {
          parsed.siteName = 'Wingo';
          parsed.siteNameMiddle = 'X';
          parsed.siteNameSuffix = '3';
        }
        return { ...defaultBranding, ...parsed };
      }
    } catch {
      // Fallback
    }
    return defaultBranding;
  });

  // Sync banners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners));
    } catch (e) {
      console.error('Failed to save banners to localStorage:', e);
    }
  }, [banners]);

  // Sync branding to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));
    } catch (e) {
      console.error('Failed to save branding to localStorage:', e);
    }
  }, [branding]);

  // Sorted active banners for public display
  const activeBanners = [...banners]
    .filter((b) => b.isActive)
    .sort((a, b) => a.order - b.order);

  const addBanner = (newBannerData: Omit<BannerItem, 'id' | 'createdAt'>): BannerItem => {
    const newId = `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newBanner: BannerItem = {
      ...newBannerData,
      id: newId,
      order: banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };
    setBanners((prev) => [...prev, newBanner]);
    return newBanner;
  };

  const updateBanner = (id: string, fields: Partial<BannerItem>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...fields } : b))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBannerActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const moveBanner = (id: string, direction: 'up' | 'down') => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const index = sorted.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === sorted.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const currentItem = sorted[index];
      const targetItem = sorted[targetIndex];

      // Swap orders
      const tempOrder = currentItem.order;
      currentItem.order = targetItem.order;
      targetItem.order = tempOrder;

      return [...sorted];
    });
  };

  const reorderBanners = (sourceIndex: number, destIndex: number) => {
    setBanners((prev) => {
      const copy = [...prev].sort((a, b) => a.order - b.order);
      const [removed] = copy.splice(sourceIndex, 1);
      copy.splice(destIndex, 0, removed);
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const updateBranding = (fields: Partial<BrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...fields }));
  };

  const resetBannersToDefaults = () => {
    setBanners(defaultBanners);
  };

  const resetBrandingToDefaults = () => {
    setBranding(defaultBranding);
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        banners,
        activeBanners,
        branding,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        reorderBanners,
        moveBanner,
        updateBranding,
        resetBannersToDefaults,
        resetBrandingToDefaults,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
