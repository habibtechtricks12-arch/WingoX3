import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Download, Check, ArrowDown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TopDownloadBanner: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  // Download simulation state
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const triggerBlobDownload = () => {
    try {
      const dummyApk = `Wingo X 3 Mobile Application Android Package
Version: 2.8.0
Official APK Download`;
      const blob = new Blob([dummyApk], {
        type: 'application/vnd.android.package-archive',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Wingo-X-3-v2.8.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCompleted) {
      // If already downloaded, go to install page
      navigate('member/download');
      return;
    }

    if (isDownloading) return;

    setIsDownloading(true);
    setProgress(0);
    showToast('ডাউনলোড হচ্ছে: Wingo-X-3-v2.8.0.apk (24.5 MB)', 'info');

    let current = 0;
    timerRef.current = setInterval(() => {
      current += Math.random() * 12 + 8;
      if (current >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        setIsDownloading(false);
        setIsCompleted(true);

        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.2 },
          colors: ['#FBBF24', '#34D399', '#60A5FA'],
        });

        triggerBlobDownload();
        showToast('✅ ডাউনলোড সম্পন্ন! ট্যাপ করে ইন্সটল করুন।', 'success');
      } else {
        setProgress(Math.round(current));
      }
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#05181F] border-b border-[#0F3644] px-3 py-2 flex items-center justify-between text-white z-40 relative select-none">
      {/* Left Icon & Text (Clickable to visit download page) */}
      <div
        onClick={() => navigate('member/download')}
        className="flex items-center gap-2.5 overflow-hidden cursor-pointer group"
      >
        {/* App Icon in gold square with rounded corners */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="w-full h-full bg-[#07242E] rounded-[10px] flex items-center justify-center">
            <span className="text-[10px] font-black text-amber-400 tracking-tight">WX3</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-amber-400 tracking-tight">
              APP UP TO ৳999
            </span>
            <span className="text-[11px] text-amber-400 font-bold">&gt;&gt;&gt;</span>
          </div>
          {/* 5 Golden Stars */}
          <div className="flex items-center gap-0.5 mt-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Right Buttons: Download with Progress Bar + Close */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDownloadClick}
          className={`relative min-w-[92px] h-8 rounded-lg overflow-hidden font-black text-xs shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
            isCompleted
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-[#FACC15] hover:bg-yellow-300 text-slate-950'
          }`}
          title={isCompleted ? 'Click to open install instructions' : 'Download Android App'}
        >
          {/* Progress Bar Fill Overlay */}
          {isDownloading && (
            <div
              className="absolute left-0 top-0 bottom-0 bg-emerald-400 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}

          {/* Button Text & Icons */}
          <span className="relative z-10 flex items-center gap-1">
            {isDownloading ? (
              <>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[3]" />
                <span className="font-mono text-[11px]">{progress}%</span>
              </>
            ) : isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Install</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download</span>
              </>
            )}
          </span>
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="w-6 h-6 rounded-full bg-[#0D3644] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
