import React, { useState } from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useApp } from '../../context/AppContext';
import { BannerItem, BrandingSettings } from '../../types/siteSettings';
import { ASSETS } from '../../assets/assetPaths';
import {
  Image,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Clock,
  Play,
  Pause,
  Upload,
  ExternalLink,
  Eye,
  Type,
  Palette,
  Volume2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'Bonus Girl (Screenshot 2)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Golden Reward Chest',
    url: ASSETS.rewardChest,
  },
  {
    name: 'VIP Golden Crown',
    url: ASSETS.vipCrownBadge,
  },
  {
    name: 'Aviator Jet Plane',
    url: ASSETS.aviatorCustomPlane,
  },
  {
    name: 'Super Ace Crown',
    url: ASSETS.slotSuperAce,
  },
  {
    name: 'Cash & Coins Promo',
    url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Casino Neon Glow',
    url: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Lottery Lucky Balls',
    url: ASSETS.lotteryBanner,
  },
];

const PRESET_GRADIENTS = [
  {
    label: 'Cyber Purple (Original)',
    value: 'from-[#200B1A] via-[#100720] to-[#08182B]',
    preview: 'bg-gradient-to-r from-[#200B1A] via-[#100720] to-[#08182B]',
  },
  {
    label: 'Emerald Fortune',
    value: 'from-[#06242E] via-[#093543] to-[#021319]',
    preview: 'bg-gradient-to-r from-[#06242E] via-[#093543] to-[#021319]',
  },
  {
    label: 'Crimson Flame',
    value: 'from-[#2B0E14] via-[#1A0509] to-[#3B111A]',
    preview: 'bg-gradient-to-r from-[#2B0E14] via-[#1A0509] to-[#3B111A]',
  },
  {
    label: 'Golden Luxury',
    value: 'from-[#261A05] via-[#1A1203] to-[#362506]',
    preview: 'bg-gradient-to-r from-[#261A05] via-[#1A1203] to-[#362506]',
  },
  {
    label: 'Royal Indigo',
    value: 'from-[#0D1B2A] via-[#1B263B] to-[#415A77]',
    preview: 'bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#415A77]',
  },
  {
    label: 'Neon Ruby Dark',
    value: 'from-[#2D0A1E] via-[#180410] to-[#3A0D28]',
    preview: 'bg-gradient-to-r from-[#2D0A1E] via-[#180410] to-[#3A0D28]',
  },
];

const ROUTE_OPTIONS = [
  { label: 'Invite Friends (রেফার ও বোনাস)', value: 'invite' },
  { label: 'Deposit (ডিপোজিট রিচার্জ)', value: 'deposit' },
  { label: 'Withdrawal (উইথড্রয়াল)', value: 'withdrawal' },
  { label: 'Slots Lobby (স্লটস গেমস)', value: 'slots' },
  { label: 'Aviator (অ্যাভিয়েটর ক্র্যাশ)', value: 'aviator' },
  { label: 'Super Ace (সুপার এস স্লট)', value: 'super-ace' },
  { label: 'WinGo Lottery (উইনগো লটারি)', value: 'lottery' },
  { label: 'Reward Center (রিওয়ার্ড সেন্টার)', value: 'reward' },
];

export const AdminBrandingBanners: React.FC = () => {
  const {
    banners,
    activeBanners,
    branding,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    moveBanner,
    updateBranding,
    resetBannersToDefaults,
    resetBrandingToDefaults,
  } = useSiteSettings();

  const { showToast } = useApp();

  // Sub-tab selection: 'banners' | 'logo' | 'announcement'
  const [subTab, setSubTab] = useState<'banners' | 'logo' | 'announcement'>('banners');

  // Modal State for Add / Edit Banner
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  // Form State for Banner
  const [bannerForm, setBannerForm] = useState<Omit<BannerItem, 'id' | 'createdAt'>>({
    title: '',
    highlightText: '',
    tagline: '',
    badge: 'WINGO X 3 BONUS',
    badgeBg: 'bg-amber-400 text-slate-950',
    imageUrl: PRESET_IMAGES[0].url,
    linkRoute: 'invite',
    bgGradient: PRESET_GRADIENTS[0].value,
    isActive: true,
    order: 1,
  });

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState<BrandingSettings>({ ...branding });

  // Open modal for NEW banner
  const handleOpenAddModal = () => {
    setEditingBannerId(null);
    setBannerForm({
      title: '১ জন বন্ধুকে রেফার করলেই',
      highlightText: '১০০০ টাকা বোনাস',
      tagline: 'যত বেশি রেফার তত বেশি বোনাস',
      badge: 'WINGO X 3 BONUS',
      badgeBg: 'bg-amber-400 text-slate-950',
      imageUrl: PRESET_IMAGES[0].url,
      linkRoute: 'invite',
      bgGradient: PRESET_GRADIENTS[0].value,
      isActive: true,
      order: banners.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open modal for EDITING existing banner
  const handleOpenEditModal = (banner: BannerItem) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title,
      highlightText: banner.highlightText,
      tagline: banner.tagline,
      badge: banner.badge,
      badgeBg: banner.badgeBg || 'bg-amber-400 text-slate-950',
      imageUrl: banner.imageUrl,
      linkRoute: banner.linkRoute,
      bgGradient: banner.bgGradient,
      isActive: banner.isActive,
      order: banner.order,
    });
    setIsModalOpen(true);
  };

  // Save Banner (Add or Update)
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      showToast('ব্যানারের শিরোনাম দিন', 'error');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      showToast('✅ ব্যানার সফলভাবে আপডেট করা হয়েছে', 'success');
    } else {
      addBanner(bannerForm);
      showToast('✅ নতুন ব্যানার সফলভাবে যুক্ত হয়েছে', 'success');
    }

    setIsModalOpen(false);
  };

  // Handle Image File Upload (convert to base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 2MB হতে হবে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (isLogo) {
        setBrandingForm((prev) => ({ ...prev, logoImageUrl: dataUrl, logoType: 'image' }));
        updateBranding({ logoImageUrl: dataUrl, logoType: 'image' });
        showToast('লোগো ছবি আপলোড সফল হয়েছে', 'success');
      } else {
        setBannerForm((prev) => ({ ...prev, imageUrl: dataUrl }));
        showToast('ব্যানারের ছবি আপলোড সফল হয়েছে', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Branding changes
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(brandingForm);
    showToast('✅ লোগো ও ব্র্যান্ডিং সফলভাবে সেভ করা হয়েছে', 'success');
  };

  // Live preview slider index
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#144859] pb-3">
        <button
          onClick={() => setSubTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            subTab === 'banners'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-[#082833] text-slate-300 hover:text-white hover:bg-[#0C3544]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>ব্যানার ম্যানেজার (আনলিমিটেড ব্যানার)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-900/40 text-[10px]">
            {banners.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('logo')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            subTab === 'logo'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-[#082833] text-slate-300 hover:text-white hover:bg-[#0C3544]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>লোগো ও ব্র্যান্ডিং (Logo & Brand)</span>
        </button>

        <button
          onClick={() => setSubTab('announcement')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            subTab === 'announcement'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-[#082833] text-slate-300 hover:text-white hover:bg-[#0C3544]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>নোটিশ মারকুই (Announcement)</span>
        </button>
      </div>

      {/* ======================= TAB 1: BANNERS ======================= */}
      {subTab === 'banners' && (
        <div className="space-y-5">
          {/* Header Bar with 5s Timer & Controls */}
          <div className="p-4 rounded-2xl bg-[#082833] border border-[#114555] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white">আনলিমিটেড ব্যানার কন্ট্রোল</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  প্রতি {branding.bannerIntervalSeconds || 5} সেকেন্ড পর পর অটো চেঞ্জ হবে
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                এখানে যত ইচ্ছা ব্যানার যোগ করতে পারবেন। প্রতিটি ব্যানার হোম স্ক্রিনে ৫ সেকেন্ড পর পর অটোমেটিক ঘুরবে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ নতুন ব্যানার যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Banner Slider Interval Settings */}
          <div className="p-4 rounded-2xl bg-[#082833] border border-[#114555] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>ব্যানার অটো স্লাইড ব্যবধান (সেকেন্ডে):</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={branding.bannerIntervalSeconds || 5}
                  onChange={(e) => {
                    const sec = Number(e.target.value);
                    updateBranding({ bannerIntervalSeconds: sec });
                  }}
                  className="flex-1 accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="px-3 py-1 bg-[#0A3342] text-amber-300 font-mono font-black text-sm rounded-lg border border-[#144859]">
                  {branding.bannerIntervalSeconds || 5}s
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                ডিফল্ট: ৫ সেকেন্ড (পরবর্তী ব্যানারে যাওয়ার সময়)
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                <span>অটো স্লাইডার চালু রাখুন:</span>
                <input
                  type="checkbox"
                  checked={branding.bannerAutoPlay !== false}
                  onChange={(e) => updateBranding({ bannerAutoPlay: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
                />
              </label>

              <button
                onClick={() => {
                  if (window.confirm('ব্যানার তালিকা ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?')) {
                    resetBannersToDefaults();
                    showToast('ব্যানার ডিফল্ট অবস্থায় রিসেট হয়েছে', 'info');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট ব্যানার</span>
              </button>
            </div>
          </div>

          {/* Banner Live Preview Box */}
          {activeBanners.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#051C23] border border-[#0D3B4A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>হোম স্ক্রিন প্রিভিউ (লাইভ দেখুন ব্যানার কেমন দেখায়)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {previewIndex + 1} / {activeBanners.length} Banners
                </span>
              </div>

              {/* Preview Banner Container */}
              {(() => {
                const pBanner = activeBanners[previewIndex % activeBanners.length];
                if (!pBanner) return null;

                return (
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${
                      pBanner.bgGradient || 'from-[#200B1A] via-[#100720] to-[#08182B]'
                    } border border-[#2B1B38] p-4 text-white shadow-xl min-h-[140px] flex items-center justify-between gap-4`}
                  >
                    <div className="space-y-1 max-w-[65%]">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#22C55E]">
                          {branding.siteName ? `${branding.siteName} ${branding.siteNameMiddle} ${branding.siteNameSuffix}`.trim() : 'Wingo X 3'}
                        </span>
                        {pBanner.badge && (
                          <span
                            className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase ${
                              pBanner.badgeBg || 'bg-amber-400 text-slate-950'
                            }`}
                          >
                            {pBanner.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-amber-400">{pBanner.title}</h4>
                      <div className="text-lg font-black text-[#EF4444] leading-tight">
                        {pBanner.highlightText}
                      </div>
                      <p className="text-[11px] font-bold text-yellow-300">{pBanner.tagline}</p>
                      <span className="text-[10px] text-cyan-300 font-mono block pt-1">
                        👉 ক্লিক করলে যাবে: {pBanner.linkRoute}
                      </span>
                    </div>

                    {pBanner.imageUrl && (
                      <div className="w-20 h-24 shrink-0 rounded-xl overflow-hidden border border-purple-500/40 shadow-md">
                        <img
                          src={pBanner.imageUrl}
                          alt={pBanner.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Preview Navigation Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() =>
                    setPreviewIndex(
                      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#0A3342] hover:bg-[#0E4458] text-slate-200 text-xs font-bold"
                >
                  ◀ আগের ব্যানার
                </button>
                <div className="flex items-center gap-1">
                  {activeBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        previewIndex === idx ? 'bg-amber-400 w-4' : 'bg-slate-600 w-2'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setPreviewIndex((prev) => (prev + 1) % activeBanners.length)
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#0A3342] hover:bg-[#0E4458] text-slate-200 text-xs font-bold"
                >
                  পরের ব্যানার ▶
                </button>
              </div>
            </div>
          )}

          {/* List of All Banners */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>সব ব্যানার তালিকা ({banners.length} টি)</span>
              <span className="text-xs text-slate-400 font-normal">
                (উপরে/নিচে নিয়ে ক্রম পরিবর্তন বা এডিট করুন)
              </span>
            </h4>

            {banners.length === 0 ? (
              <div className="p-8 text-center bg-[#082833] rounded-2xl border border-[#114555] space-y-3">
                <p className="text-sm text-slate-300">কোনো ব্যানার নেই।</p>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs"
                >
                  + প্রথম ব্যানার যোগ করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {banners
                  .sort((a, b) => a.order - b.order)
                  .map((b, index) => (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-2xl bg-[#082833] border ${
                        b.isActive ? 'border-[#144859]' : 'border-slate-800 opacity-60'
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all`}
                    >
                      {/* Left info & thumb */}
                      <div className="flex items-center gap-3.5">
                        {/* Order Number */}
                        <span className="w-6 h-6 rounded-lg bg-[#051C23] text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          #{index + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt={b.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                              No Img
                            </div>
                          )}
                        </div>

                        {/* Text Details */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-white">{b.title}</span>
                            {b.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                                {b.badge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                b.isActive
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {b.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
                          </div>

                          <div className="text-xs font-black text-rose-400">{b.highlightText}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {b.tagline} • লিংক: <span className="text-cyan-300">{b.linkRoute}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {/* Move Up */}
                        <button
                          onClick={() => moveBanner(b.id, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-[#0A3342] hover:bg-[#0E4458] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={() => moveBanner(b.id, 'down')}
                          disabled={index === banners.length - 1}
                          className="p-1.5 rounded-lg bg-[#0A3342] hover:bg-[#0E4458] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Active */}
                        <button
                          onClick={() => toggleBannerActive(b.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            b.isActive
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {b.isActive ? 'Active' : 'Off'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(b)}
                          className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`"${b.title}" ব্যানারটি ডিলিট করতে চান?`)) {
                              deleteBanner(b.id);
                              showToast('ব্যানার ডিলিট করা হয়েছে', 'info');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: LOGO & BRANDING ======================= */}
      {subTab === 'logo' && (
        <form onSubmit={handleSaveBranding} className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#082833] border border-[#114555] space-y-4">
            <div>
              <h3 className="text-base font-black text-white">লোগো কাস্টমাইজেশন ও ব্র্যান্ডিং</h3>
              <p className="text-xs text-slate-400 mt-1">
                এখানে আপনি টেক্সট লোগো অথবা নিজস্ব ছবি/লোগো আপলোড করে সেট করতে পারবেন। পরিবর্তনগুলো সাথে সাথে ওয়েবসাইটের হেডার ও ব্যানারগুলোতে আপডেট হবে।
              </p>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-4 rounded-xl bg-[#06212B] border border-[#124556] flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">হেডারে লোগো যেমন দেখাবে:</span>

              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#082935] rounded-lg border border-[#0F4758]">
                {(brandingForm.logoType === 'image' || brandingForm.logoType === 'both') &&
                  brandingForm.logoImageUrl && (
                    <img
                      src={brandingForm.logoImageUrl}
                      alt="Logo Preview"
                      style={{ height: `${brandingForm.logoHeight || 30}px` }}
                      className="object-contain max-w-[120px]"
                    />
                  )}

                {(brandingForm.logoType === 'text' ||
                  brandingForm.logoType === 'both' ||
                  !brandingForm.logoImageUrl) && (
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="text-xl font-black tracking-tighter"
                      style={{ color: brandingForm.logoPrefixColor || '#F97316' }}
                    >
                      {brandingForm.siteName || 'Wingo'}
                    </span>
                    <span
                      className="text-base font-extrabold"
                      style={{ color: brandingForm.logoMiddleColor || '#FFFFFF' }}
                    >
                      {brandingForm.siteNameMiddle ?? 'X'}
                    </span>
                    <span
                      className="text-base font-extrabold"
                      style={{ color: brandingForm.logoSuffixColor || '#22C55E' }}
                    >
                      {brandingForm.siteNameSuffix ?? '3'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Display Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">লোগো ডিসপ্লে মোড:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'text', label: '🔤 টেক্সট লোগো (Wingo X 3)' },
                  { id: 'image', label: '🖼️ ছবি/ইমেজ লোগো' },
                  { id: 'both', label: '✨ ছবি ও টেক্সট দুটোই' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      setBrandingForm((prev) => ({
                        ...prev,
                        logoType: mode.id as any,
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      brandingForm.logoType === mode.id
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                        : 'bg-[#06212B] text-slate-300 border-[#124556] hover:bg-[#0A3342]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Logo Options */}
            <div className="space-y-3 pt-2 border-t border-[#124556]">
              <h4 className="text-xs font-black text-amber-400">টেক্সট লোগো কনফিগারেশন:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Prefix */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ব্র্যান্ড প্রিপিক্স (১ম অংশ):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={brandingForm.siteName}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({ ...prev, siteName: e.target.value }))
                      }
                      placeholder="Wingo"
                      className="flex-1 p-2 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="color"
                      value={brandingForm.logoPrefixColor || '#F97316'}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({
                          ...prev,
                          logoPrefixColor: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      title="রং পরিবর্তন"
                    />
                  </div>
                </div>

                {/* Middle */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ব্র্যান্ড মিডল (২য় অংশ):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={brandingForm.siteNameMiddle}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({
                          ...prev,
                          siteNameMiddle: e.target.value,
                        }))
                      }
                      placeholder="win"
                      className="flex-1 p-2 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="color"
                      value={brandingForm.logoMiddleColor || '#FFFFFF'}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({
                          ...prev,
                          logoMiddleColor: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      title="রং পরিবর্তন"
                    />
                  </div>
                </div>

                {/* Suffix */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ব্র্যান্ড সাফিক্স (৩য় অংশ):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={brandingForm.siteNameSuffix}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({
                          ...prev,
                          siteNameSuffix: e.target.value,
                        }))
                      }
                      placeholder="tk"
                      className="flex-1 p-2 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="color"
                      value={brandingForm.logoSuffixColor || '#22C55E'}
                      onChange={(e) =>
                        setBrandingForm((prev) => ({
                          ...prev,
                          logoSuffixColor: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      title="রং পরিবর্তন"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Image Logo Upload & URL */}
            <div className="space-y-3 pt-2 border-t border-[#124556]">
              <h4 className="text-xs font-black text-amber-400">ছবি/লোগো ফাইল আপলোড:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    লোগো ইমেজ লিঙ্ক (Image URL):
                  </label>
                  <input
                    type="url"
                    value={brandingForm.logoImageUrl}
                    onChange={(e) =>
                      setBrandingForm((prev) => ({ ...prev, logoImageUrl: e.target.value }))
                    }
                    placeholder="https://example.com/my-logo.png"
                    className="w-full p-2 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ডিভাইস থেকে লোগো আপলোড করুন:
                  </label>
                  <label className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#0A3342] hover:bg-[#0E4458] border border-[#144859] text-xs font-bold text-amber-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Logo File (PNG/JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Logo Height Adjustment */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  লোগো হাইট (Height): {brandingForm.logoHeight || 30}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={brandingForm.logoHeight || 30}
                  onChange={(e) =>
                    setBrandingForm((prev) => ({
                      ...prev,
                      logoHeight: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Hot games section title */}
            <div className="pt-2 border-t border-[#124556]">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                হট গেমস সেকশন টাইটেল (Screenshot 1 - HOT GAMES):
              </label>
              <input
                type="text"
                value={brandingForm.hotGamesTitle || 'HOT GAMES'}
                onChange={(e) =>
                  setBrandingForm((prev) => ({ ...prev, hotGamesTitle: e.target.value }))
                }
                placeholder="HOT GAMES"
                className="w-full sm:w-1/2 p-2 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  resetBrandingToDefaults();
                  setBrandingForm({ ...branding });
                  showToast('ব্র্যান্ডিং ডিফল্ট অবস্থায় রিসেট হয়েছে', 'info');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                রিসেট করুন
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>লোগো ও ব্র্যান্ডিং সেভ করুন</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ======================= TAB 3: ANNOUNCEMENT ======================= */}
      {subTab === 'announcement' && (
        <div className="p-4 rounded-2xl bg-[#082833] border border-[#114555] space-y-4">
          <div>
            <h3 className="text-base font-black text-white">নোটিশ মারকুই কন্ট্রোল (Screenshot 3)</h3>
            <p className="text-xs text-slate-400 mt-1">
              লোগোর ঠিক নিচে যে নোটিশটি স্ক্রল করে চলে, তা এখান থেকে পরিবর্তন করুন।
            </p>
          </div>

          {/* Marquee Live Preview */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400">লাইভ মারকুই প্রিভিউ:</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#082935] border border-[#0F4758] rounded-full text-xs text-amber-300 overflow-hidden shadow-xs">
              <Volume2 className="w-4 h-4 text-orange-400 shrink-0 animate-bounce" />
              <div className="overflow-hidden whitespace-nowrap flex-1">
                <div
                  className="inline-block animate-ck-marquee font-medium"
                  style={{ animationDuration: `${branding.announcementSpeedSec || 20}s` }}
                >
                  {branding.announcementText}
                </div>
              </div>
            </div>
          </div>

          {/* Text Editor */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              নোটিশ টেক্সট লিখুন (বাংলা বা ইংরেজি):
            </label>
            <textarea
              rows={3}
              value={branding.announcementText}
              onChange={(e) => updateBranding({ announcementText: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#06212B] border border-[#124556] text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400"
              placeholder="নতুন বছরের স্বপ্নের পরিকল্পনা আনুষ্ঠানিকভাবে চালু হয়েছে! 🥳🎉..."
            />
          </div>

          {/* Marquee Speed & Active Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                স্ক্রলিং স্পিড: {branding.announcementSpeedSec || 20} সেকেন্ড
              </label>
              <input
                type="range"
                min="10"
                max="40"
                step="2"
                value={branding.announcementSpeedSec || 20}
                onChange={(e) =>
                  updateBranding({ announcementSpeedSec: Number(e.target.value) })
                }
                className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">কম সময় = দ্রুত চলবে, বেশি সময় = ধীরে চলবে</span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2 cursor-pointer">
                <span>মারকুই বার দৃশ্যমান রাখুন:</span>
                <input
                  type="checkbox"
                  checked={branding.announcementActive !== false}
                  onChange={(e) => updateBranding({ announcementActive: e.target.checked })}
                  className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ======================= ADD / EDIT BANNER MODAL ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#06212B] border border-[#144859] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#082833] border-b border-[#114555] flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-400" />
                <span>
                  {editingBannerId ? 'ব্যানার এডিট করুন' : '+ নতুন ব্যানার তৈরি করুন'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveBanner} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Live Preview Inside Modal */}
              <div>
                <span className="text-[11px] font-bold text-amber-400 block mb-1">
                  লাইভ প্রিভিউ (ব্যানারটি যেমন দেখাবে):
                </span>
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${
                    bannerForm.bgGradient || 'from-[#200B1A] via-[#100720] to-[#08182B]'
                  } border border-[#2B1B38] p-3.5 text-white shadow-md flex items-center justify-between gap-3`}
                >
                  <div className="space-y-0.5 max-w-[65%]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-[#22C55E]">
                        {branding.siteName ? `${branding.siteName} ${branding.siteNameMiddle} ${branding.siteNameSuffix}`.trim() : 'Wingo X 3'}
                      </span>
                      {bannerForm.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            bannerForm.badgeBg || 'bg-amber-400 text-slate-950'
                          }`}
                        >
                          {bannerForm.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black text-amber-400">
                      {bannerForm.title || 'ব্যানার শিরোনাম'}
                    </div>
                    <div className="text-base font-black text-[#EF4444]">
                      {bannerForm.highlightText || '১০০০ টাকা বোনাস'}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-300">
                      {bannerForm.tagline || 'যত বেশি রেফার তত বেশি বোনাস'}
                    </div>
                  </div>

                  {bannerForm.imageUrl && (
                    <div className="w-16 h-20 shrink-0 rounded-xl overflow-hidden border border-purple-500/40">
                      <img
                        src={bannerForm.imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ব্যানার শিরোনাম (Title):
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) =>
                      setBannerForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="১ জন বন্ধুকে রেফার করলেই"
                    className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    হাইলাইট টেক্সট (Highlight Text):
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.highlightText}
                    onChange={(e) =>
                      setBannerForm((prev) => ({ ...prev, highlightText: e.target.value }))
                    }
                    placeholder="১০০০ টাকা বোনাস"
                    className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-red-400 text-xs font-black focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Tagline & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ছোট ট্যাগলাইন (Tagline):
                  </label>
                  <input
                    type="text"
                    value={bannerForm.tagline}
                    onChange={(e) =>
                      setBannerForm((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    placeholder="যত বেশি রেফার তত বেশি বোনাস"
                    className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-yellow-300 text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ব্যাজ লেখা (Badge):
                  </label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) =>
                      setBannerForm((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="WINGO X 3 BONUS"
                    className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Destination Page Route */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  ক্লিক করলে কোন পেজে যাবে (Destination Route):
                </label>
                <select
                  value={bannerForm.linkRoute}
                  onChange={(e) =>
                    setBannerForm((prev) => ({ ...prev, linkRoute: e.target.value }))
                  }
                  className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {ROUTE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#082935]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Background Luxury Gradient Theme */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block">
                  ব্যাকগ্রাউন্ড কালার থিম নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_GRADIENTS.map((grad) => (
                    <button
                      key={grad.value}
                      type="button"
                      onClick={() =>
                        setBannerForm((prev) => ({ ...prev, bgGradient: grad.value }))
                      }
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-left flex items-center gap-2 ${
                        bannerForm.bgGradient === grad.value
                          ? 'border-amber-400 ring-2 ring-amber-400/40'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${grad.preview} shrink-0`} />
                      <span className="truncate">{grad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Input Options (URL / Upload / Presets) */}
              <div className="space-y-2 pt-2 border-t border-[#114555]">
                <label className="text-[11px] font-bold text-slate-300 block">
                  ব্যানারের ছবি নির্বাচন বা আপলোড করুন:
                </label>

                {/* Direct Image URL input */}
                <input
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={(e) =>
                    setBannerForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-[#082935] border border-[#114555] text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />

                {/* File Upload Button */}
                <label className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#0A3342] hover:bg-[#0E4458] border border-[#144859] text-xs font-bold text-amber-300 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, false)}
                    className="hidden"
                  />
                </label>

                {/* 1-Click Quick Preset Selection */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">
                    অথবা রেডিমেড প্রিসেট ছবি বেছে নিন:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() =>
                          setBannerForm((prev) => ({ ...prev, imageUrl: img.url }))
                        }
                        className={`p-1 rounded-xl border text-center transition-all group ${
                          bannerForm.imageUrl === img.url
                            ? 'border-amber-400 ring-2 ring-amber-400/50 bg-[#0A3342]'
                            : 'border-slate-800 hover:border-slate-600 bg-[#051C23]'
                        }`}
                      >
                        <div className="w-full h-12 rounded-lg overflow-hidden bg-slate-900 mb-1">
                          <img
                            src={img.url}
                            alt={img.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[9px] text-slate-300 font-medium truncate block">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={bannerForm.isActive}
                  onChange={(e) =>
                    setBannerForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
                <label
                  htmlFor="bannerActive"
                  className="text-xs font-bold text-slate-200 cursor-pointer"
                >
                  এই ব্যানারটি হোমপেজে সক্রিয় রাখুন (Active)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#114555] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBannerId ? 'আপডেট সম্পন্ন করুন' : 'ব্যানার সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
