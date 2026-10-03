import React from 'react';

// Thumbs up orange ribbon at top-left of deposit cards
export const ThumbsUpRibbon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1.5 py-0.5 rounded-br-lg shadow-xs flex items-center justify-center z-10 ${className}`}
    style={{ borderTopLeftRadius: '0.75rem' }}
  >
    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
      <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.22 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.34-.37 1.68-.97l2.7-5.15z" />
    </svg>
  </div>
);

// Red checkmark badge at bottom-right of active card
export const RedCheckBadge: React.FC = () => (
  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-tl-md rounded-br-xl flex items-center justify-center shadow-xs">
    <svg className="w-2.5 h-2.5 text-white stroke-[3.5] stroke-current fill-none" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Authentic Nagad Logo (swirl with 'নগদ')
export const NagadLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow-xs">
      <defs>
        <linearGradient id="nagadSwirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="2" />
      {/* Dynamic ribbon swirl */}
      <path
        d="M 50 16 C 68 16 82 30 82 48 C 82 66 68 80 50 80 C 34 80 22 68 22 52 C 22 38 32 28 44 28 C 54 28 62 36 62 46 C 62 54 56 60 48 60 C 42 60 38 56 38 50 C 38 46 42 42 46 42"
        fill="none"
        stroke="url(#nagadSwirlGrad)"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-[11px] font-black text-[#E11D48] tracking-tight leading-none mt-0.5 font-sans">
      নগদ
    </span>
  </div>
);

// Authentic bKash Pink Logo (with white flying bird)
export const BkashLogo: React.FC<{ className?: string; subText?: string }> = ({
  className = 'w-10 h-10',
  subText = 'Send Money bKash',
}) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#E2136E] flex items-center justify-center shadow-xs p-1">
      {/* bKash iconic origami bird SVG */}
      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
        <polygon points="15,45 85,20 60,80 48,52" />
        <polygon points="48,52 60,80 32,85" />
        <polygon points="15,45 48,52 32,85" />
      </svg>
    </div>
    <span className="text-[8px] font-bold text-[#E2136E] text-center leading-none mt-1 max-w-[64px] truncate">
      {subText}
    </span>
  </div>
);

// Nagad Send Money Blue Variant Logo
export const NagadBlueLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center shadow-xs p-1">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
        <circle cx="12" cy="12" r="9" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M16 12l-4-4v3H8v2h4v3l4-4z" fill="#FFFFFF" />
      </svg>
    </div>
    <span className="text-[7.5px] font-bold text-[#0284C7] text-center leading-none mt-1">
      Send Money Nagad
    </span>
  </div>
);

// Authentic Rocket DBBL Purple Logo
export const RocketLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex flex-col items-center justify-center ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-[#8B207E] flex items-center justify-center shadow-xs p-1">
      <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
        {/* DBBL Rocket Stylized Silhouette */}
        <path d="M50 10 C60 25, 75 40, 80 65 L68 62 L75 88 L58 75 L50 90 L42 75 L25 88 L32 62 L20 65 C25 40, 40 25, 50 10 Z" />
      </svg>
    </div>
    <span className="text-[8px] font-bold text-[#8B207E] text-center leading-none mt-1">
      Rocket
    </span>
  </div>
);

// Blank E-Wallet Card Mockup illustration matching Screenshot 1 & 2
export const BlankWalletCardIllustration: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-6 px-4">
    {/* Card graphic with Mastercard circles and chip */}
    <div className="w-56 h-34 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-200 border border-slate-300 shadow-inner p-3.5 relative flex flex-col justify-between overflow-hidden">
      {/* Decorative cloud-like overlay */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/40 rounded-full blur-xs" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/30 rounded-full blur-xs" />

      {/* Top row: Chip and Mastercard circle mock */}
      <div className="flex items-center justify-between z-10">
        {/* Magnetic Chip */}
        <div className="w-8 h-6 rounded-md bg-slate-300/80 border border-slate-400 flex flex-col justify-around p-0.5">
          <div className="w-full h-0.5 bg-slate-400/50" />
          <div className="w-full h-0.5 bg-slate-400/50" />
        </div>

        {/* Dual circles watermark */}
        <div className="flex items-center -space-x-2 opacity-30">
          <div className="w-6 h-6 rounded-full bg-slate-500" />
          <div className="w-6 h-6 rounded-full bg-slate-400" />
        </div>
      </div>

      {/* Middle lines */}
      <div className="space-y-1.5 z-10">
        <div className="w-24 h-2 bg-slate-300/70 rounded-full" />
        <div className="w-16 h-1.5 bg-slate-300/50 rounded-full" />
      </div>

      {/* Bottom dots */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
        <span>••••  ••••  ••••</span>
        <span>••/••</span>
      </div>
    </div>

    {/* Text */}
    <p className="text-xs font-semibold text-slate-400 mt-3">
      No E-Wallet linked yet
    </p>
  </div>
);

// Cash out visual process mockup phone

export const PhoneStepMockup: React.FC<{
  stepNumber: number;
  stepText: string;
  stepIconType: 'login' | 'cashout' | 'number' | 'amount' | 'pin' | 'hold';
}> = ({ stepNumber, stepText, stepIconType }) => {
  return (
    <div className="flex flex-col items-center min-w-[76px] flex-1">
      {/* Phone container */}
      <div className="w-full aspect-[9/17] bg-white rounded-lg border-2 border-slate-700 shadow-sm p-1 flex flex-col justify-between relative overflow-hidden">
        {/* Step badge */}
        <div className="w-3.5 h-3.5 bg-purple-700 text-white text-[8px] font-black rounded-full flex items-center justify-center mx-auto">
          {stepNumber}
        </div>

        {/* Step header / mini app bar */}
        <div className="w-full h-1.5 bg-orange-500 rounded-xs mt-0.5" />

        {/* Mockup screen content */}
        <div className="flex-1 flex flex-col items-center justify-center py-0.5">
          {stepIconType === 'login' && (
            <div className="w-full flex flex-col items-center gap-0.5">
              <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-400 flex items-center justify-center">
                <span className="text-[6px] font-bold text-orange-600">PIN</span>
              </div>
              <div className="w-8 h-1.5 bg-slate-200 rounded-xs border border-orange-300" />
            </div>
          )}

          {stepIconType === 'cashout' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-6 h-5 rounded-xs border-2 border-red-500 bg-red-50 flex items-center justify-center animate-pulse">
                <span className="text-[6px] font-extrabold text-red-600 leading-none">CASH</span>
              </div>
            </div>
          )}

          {stepIconType === 'number' && (
            <div className="w-full flex flex-col gap-0.5 px-0.5">
              <div className="w-full h-2 bg-slate-100 border border-slate-300 rounded-xs flex items-center px-0.5">
                <span className="text-[5px] text-slate-500">018...</span>
              </div>
              {/* Virtual keypad mock */}
              <div className="grid grid-cols-3 gap-0.5 w-full mt-0.5">
                <div className="h-1 bg-slate-300 rounded-xs" />
                <div className="h-1 bg-slate-300 rounded-xs" />
                <div className="h-1 bg-slate-300 rounded-xs" />
              </div>
            </div>
          )}

          {stepIconType === 'amount' && (
            <div className="w-full flex flex-col items-center px-0.5">
              <div className="w-full h-2.5 bg-orange-50 border border-orange-400 rounded-xs flex items-center justify-center">
                <span className="text-[6px] font-black text-orange-700">৳ 1,000</span>
              </div>
            </div>
          )}

          {stepIconType === 'pin' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-2 border border-slate-400 rounded-xs flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          )}

          {stepIconType === 'hold' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-xs">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-white animate-ping" />
              </div>
            </div>
          )}
        </div>

        {/* Phone bottom home indicator */}
        <div className="w-3 h-0.5 bg-slate-400 rounded-full mx-auto" />
      </div>

      {/* Step description */}
      <span className="text-[8px] font-semibold text-slate-700 text-center leading-tight mt-1 line-clamp-2 px-0.5">
        {stepText}
      </span>
    </div>
  );
};

// Full Bengali Infographic Banner
export const DepositInfographic: React.FC<{
  title?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({
  title = 'নগদ (Nagad) ক্যাশ আউট (Cash out) প্রসেস',
  isOpen,
  onToggle,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm relative space-y-2 overflow-hidden">
      {/* Top title */}
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-black text-[#5C5C00] tracking-tight flex items-center gap-1.5">
          <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
          {title}
        </h4>

        {/* Small action toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]"
            title="Collapse"
          >
            ▲
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 6 Steps Grid / Flow */}
      <div className="flex items-start gap-1 overflow-x-auto no-scrollbar py-1">
        <PhoneStepMockup
          stepNumber={1}
          stepText="Nagad অ্যাপ খুলুন ও PIN দিন"
          stepIconType="login"
        />
        <div className="text-slate-300 font-bold self-center text-xs">→</div>
        <PhoneStepMockup
          stepNumber={2}
          stepText='"Cash out" নির্বাচন করুন'
          stepIconType="cashout"
        />
        <div className="text-slate-300 font-bold self-center text-xs">→</div>
        <PhoneStepMockup
          stepNumber={3}
          stepText="প্রাপকের Nagad নম্বর দিন"
          stepIconType="number"
        />
        <div className="text-slate-300 font-bold self-center text-xs">→</div>
        <PhoneStepMockup
          stepNumber={4}
          stepText="টাকার পরিমাণ লিখুন"
          stepIconType="amount"
        />
        <div className="text-slate-300 font-bold self-center text-xs">→</div>
        <PhoneStepMockup
          stepNumber={5}
          stepText="তথ্য যাচাই ও PIN দিন"
          stepIconType="pin"
        />
        <div className="text-slate-300 font-bold self-center text-xs">→</div>
        <PhoneStepMockup
          stepNumber={6}
          stepText="পাঠাতে বাটনটি ট্যাপ ও হোল্ড করুন"
          stepIconType="hold"
        />
      </div>

      {/* Purple bottom safety bar */}
      <div className="bg-[#4C1D95] text-white rounded-lg px-2 py-1 flex items-center justify-between text-[8px] font-semibold flex-wrap gap-1">
        <span className="bg-[#6D28D9] px-1.5 py-0.5 rounded text-[7.5px] font-black tracking-wide uppercase">
          গুরুত্বপূর্ণ বিষয়
        </span>
        <span>• সঠিক নম্বর দিন</span>
        <span>• PIN কাউকে বলবেন না</span>
        <span>• লেনদেনের আগে তথ্য যাচাই করুন</span>
        <span>• ইন্টারনেট নিশ্চিত করুন</span>
      </div>
    </div>
  );
};
