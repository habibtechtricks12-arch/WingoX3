export interface BannerItem {
  id: string;
  title: string;          // e.g. "১ জন বন্ধুকে রেফার করলেই"
  highlightText: string;  // e.g. "১০০০ টাকা বোনাস"
  tagline: string;        // e.g. "যত বেশি রেফার তত বেশি বোনাস"
  badge: string;          // e.g. "WINGO X 3 BONUS", "NEW PROMO", "VIP CLUB"
  badgeBg?: string;       // Tailwind class or hex color
  imageUrl: string;       // Custom URL or base64 uploaded image
  linkRoute: string;      // e.g. 'invite', 'deposit', 'slots', 'aviator', 'super-ace', 'lottery', 'reward'
  bgGradient: string;     // Gradient classes
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface BrandingSettings {
  siteName: string;            // Prefix, e.g. "Wingo"
  siteNameMiddle: string;      // e.g. "X"
  siteNameSuffix: string;      // e.g. "3"
  logoType: 'text' | 'image' | 'both';
  logoImageUrl: string;        // Custom image URL or base64
  logoHeight: number;          // Height in px
  logoPrefixColor: string;     // e.g. "#F97316"
  logoMiddleColor: string;     // e.g. "#FFFFFF"
  logoSuffixColor: string;     // e.g. "#22C55E"
  announcementText: string;    // Bengali marquee notice
  announcementSpeedSec: number;
  announcementActive: boolean;
  bannerIntervalSeconds: number; // Default 5 seconds (প্রতি ৫ সেকেন্ড চেঞ্জ হবে)
  bannerAutoPlay: boolean;     // Toggle auto slider
  hotGamesTitle: string;       // e.g. "HOT GAMES"
  jackpotAmount: number;
}
