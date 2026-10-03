import React, { useState } from 'react';
import { Volume2, ChevronRight, X, AlertCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const announcementText =
    '🔥 Welcome to TCG SEA! WinGo 30s Rapid Lottery is live now. Invite friends to earn up to 100TK bonus and 2.2% commission on tier deposits!';

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-amber-50/90 border border-amber-200/80 rounded-xl text-amber-900 shadow-xs">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Volume2 className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
          <div className="overflow-hidden whitespace-nowrap text-xs font-medium">
            <div className="inline-block animate-[marquee_25s_linear_infinite]">
              {announcementText}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-400/80 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-colors"
        >
          Detail
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Platform Announcement</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <p className="font-semibold text-slate-900">
                Welcome to TCG SEA Gaming & Rewards Demo Platform!
              </p>
              <p>
                1. <strong>WinGo 30s Rapid Lottery:</strong> High frequency simulations with live 30-second cycles, transparent chart analytics, and multiple multiplier bets.
              </p>
              <p>
                2. <strong>Referral Program:</strong> Invite friends with your exclusive link and QR code to unlock VIP progressive rewards from 30TK to 500TK.
              </p>
              <p>
                3. <strong>Safe Demo Environment:</strong> This web application is a frontend demonstration prototype. No real money gambling or payment transactions are processed.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};
