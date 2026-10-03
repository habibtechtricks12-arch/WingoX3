import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronUp, X, MessageCircle, Gift, Headphones, Send } from 'lucide-react';

export const FloatingSocialBar: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-2.5 bottom-20 z-40 flex flex-col items-center gap-2 pointer-events-none">
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        {/* WhatsApp */}
        <button
          onClick={() => showToast('Opening official WhatsApp Support', 'info')}
          className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
        </button>

        {/* Facebook */}
        <button
          onClick={() => showToast('Opening official Facebook Group', 'info')}
          className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform font-black text-lg"
          aria-label="Facebook"
        >
          f
        </button>

        {/* Telegram */}
        <button
          onClick={() => showToast('Opening official Telegram Channel', 'info')}
          className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label="Telegram"
        >
          <Send className="w-4 h-4 ml-0.5 fill-current" />
        </button>

        {/* Daily Bonus Calendar Gift */}
        <button
          onClick={() => navigate('reward')}
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-yellow-400 p-0.5 shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
          aria-label="Bonus"
        >
          <div className="w-full h-full bg-[#082833] rounded-[14px] flex items-center justify-center">
            <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
        </button>

        {/* Customer Service Live Chat */}
        <button
          onClick={() => navigate('member/customer-service')}
          className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label="Customer Service"
        >
          <Headphones className="w-5 h-5" />
        </button>

        {/* Scroll To Top button with close x */}
        {showScrollTop && (
          <div className="relative mt-1">
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-[#EA580C] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 stroke-[3]" />
            </button>
            <button
              onClick={() => setShowScrollTop(false)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px]"
              aria-label="Dismiss scroll button"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
