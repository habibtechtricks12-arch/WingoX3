import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';

export const JackpotBanner: React.FC = () => {
  const [jackpotAmount, setJackpotAmount] = useState(100195476.44);

  // Subtle real-time jackpot increment
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Number((Math.random() * 0.85).toFixed(2)));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const formattedStr = jackpotAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0B3544] via-[#082935] to-[#051B22] p-4 border border-[#144758] shadow-xl text-white">
      {/* Decorative Cloud SVG & Star Sparkles */}
      <div className="absolute top-2 left-6 w-12 h-6 bg-white/10 rounded-full blur-xs" />
      <div className="absolute top-6 right-12 w-16 h-7 bg-white/10 rounded-full blur-xs" />

      {/* Red Vintage Propeller Airplane Illustration */}
      <div className="flex items-center justify-between relative z-10 mb-1">
        <div className="relative w-28 h-16 flex items-center">
          {/* Animated red plane SVG */}
          <svg className="w-24 h-14 drop-shadow-lg transform -rotate-6" viewBox="0 0 100 60" fill="none">
            {/* Plane body */}
            <path
              d="M10 30 C 15 20, 60 20, 85 28 C 92 30, 92 34, 85 36 C 60 42, 15 42, 10 32 Z"
              fill="#DC2626"
            />
            {/* Wings */}
            <path d="M40 10 L 60 28 L 35 32 Z" fill="#B91C1C" />
            <path d="M45 32 L 65 52 L 40 32 Z" fill="#991B1B" />
            {/* Tail */}
            <path d="M10 30 L 5 15 L 18 28 Z" fill="#EF4444" />
            {/* Cockpit window */}
            <ellipse cx="65" cy="28" rx="8" ry="4" fill="#93C5FD" opacity="0.9" />
            {/* Front propeller nose */}
            <circle cx="86" cy="32" r="4" fill="#FACC15" />
            {/* Spinning propeller blades */}
            <ellipse cx="87" cy="32" rx="1.5" ry="14" fill="#FDE047" opacity="0.8" />
          </svg>
        </div>

        {/* 3D Golden "Jackpot" Title matching Screenshot 2 */}
        <div className="text-right">
          <h3 className="text-3xl font-black italic tracking-wide text-[#FACC15] drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] font-sans">
            Jackpot
          </h3>
        </div>
      </div>

      {/* Rolling Odometer Counter matching Screenshot 2: White square blocks with black digits */}
      <div className="relative z-10 flex items-center justify-center gap-1 overflow-x-auto py-1.5 no-scrollbar">
        {formattedStr.split('').map((char, index) => {
          if (char === ',' || char === '.') {
            return (
              <span key={index} className="text-base font-black text-amber-400 font-mono px-0.5">
                {char}
              </span>
            );
          }
          return (
            <div
              key={index}
              className="w-6 h-8 sm:w-7 sm:h-9 bg-white rounded-md shadow-inner flex items-center justify-center border-b-2 border-slate-300 shrink-0"
            >
              <span className="font-mono font-black text-base sm:text-lg text-slate-950">
                {char}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
