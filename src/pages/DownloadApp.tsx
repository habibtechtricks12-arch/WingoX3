import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import {
  Download,
  Smartphone,
  Apple,
  ShieldCheck,
  Zap,
  Bell,
  CheckCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowDown,
  X,
  FileCheck,
  PackageCheck,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type DownloadState = 'idle' | 'downloading' | 'verifying' | 'completed';

export const DownloadApp: React.FC = () => {
  const { showToast } = useApp();

  const [status, setStatus] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [downloadedMb, setDownloadedMb] = useState<number>(0);
  const [speed, setSpeed] = useState<string>('0 MB/s');
  const [eta, setEta] = useState<string>('Calculating...');
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  const totalSizeMb = 24.5;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const triggerActualFileDownload = () => {
    try {
      const dummyApkContent = `Wingo X 3 Mobile Application Android Package
Version: 2.8.0
Build: 2026-10-02
Integrity: SHA-256 Verified
Official Portal: https://wingox3.com
Enjoy exclusive VIP promotions and instant gameplay!`;

      const blob = new Blob([dummyApkContent], {
        type: 'application/vnd.android.package-archive',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Wingo-X-3-v2.8.0.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback
    }
  };

  const startDownload = () => {
    if (status === 'downloading') return;

    setStatus('downloading');
    setProgress(0);
    setDownloadedMb(0);
    setSpeed('4.5 MB/s');
    setEta('4s');
    showToast('ডাউনলোড শুরু হয়েছে: Wingo-X-3-v2.8.0.apk', 'info');

    let currentProgress = 0;
    const speeds = ['4.8 MB/s', '6.2 MB/s', '7.5 MB/s', '8.9 MB/s', '6.8 MB/s', '9.4 MB/s'];

    timerRef.current = setInterval(() => {
      // Realistic variable progress steps
      const increment = Math.random() * 8 + 5; // 5% to 13% each tick
      currentProgress = Math.min(currentProgress + increment, 100);

      const currentMb = Number(((currentProgress / 100) * totalSizeMb).toFixed(1));
      const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
      const remainingMb = totalSizeMb - currentMb;
      const approxSeconds = Math.max(1, Math.round(remainingMb / 6));

      setProgress(Math.round(currentProgress));
      setDownloadedMb(currentMb);
      setSpeed(randomSpeed);
      setEta(`${approxSeconds}s left`);

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        setDownloadedMb(totalSizeMb);
        setSpeed('0 MB/s');
        setEta('0s');

        // Transition to verifying state
        setStatus('verifying');

        setTimeout(() => {
          setStatus('completed');
          setShowInstallModal(true);

          // Confetti celebration
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FBBF24', '#34D399', '#60A5FA', '#F472B6'],
          });

          // Trigger browser blob download
          triggerActualFileDownload();

          showToast('✅ ডাউনলোড সম্পন্ন! Wingo-X-3-v2.8.0.apk সংরক্ষিত হয়েছে', 'success');
        }, 700);
      }
    }, 220);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setProgress(0);
    setDownloadedMb(0);
    showToast('ডাউনলোড বাতিল করা হয়েছে', 'info');
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStatus('idle');
    setProgress(0);
    setDownloadedMb(0);
    setTimeout(() => {
      startDownload();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-24 select-none">
      <Header title="Download APP" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* ================= MAIN APP BANNER ================= */}
        <div className="rounded-3xl bg-gradient-to-b from-[#082C38] via-[#07242E] to-[#04161C] text-white p-5 shadow-2xl border border-[#11495A] text-center space-y-4 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* App Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-300 p-1 shadow-[0_8px_25px_rgba(251,191,36,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-[#051C23] rounded-[14px] flex flex-col items-center justify-center border border-amber-300/40">
              <span className="text-sm font-black text-amber-400 tracking-tighter">Wingo</span>
              <span className="text-[11px] font-extrabold text-cyan-300 tracking-widest uppercase -mt-0.5">
                X 3
              </span>
            </div>
            {/* VIP badge on corner */}
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] shadow-md border border-white/20">
              VIP
            </span>
          </div>

          {/* Title & Specs */}
          <div>
            <h3 className="text-xl font-black text-white tracking-wide flex items-center justify-center gap-1.5">
              <span>Wingo X 3 Official App</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1 text-xs text-slate-300 font-mono">
              <span className="px-2 py-0.5 rounded-full bg-[#0E3A48] border border-[#155366] text-amber-300 font-bold">
                v2.8.0
              </span>
              <span>•</span>
              <span className="text-slate-300 font-semibold">24.5 MB</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Android 6.0+</span>
            </div>
          </div>

          {/* ================= ENHANCED PROGRESS DOWNLOAD BUTTON ================= */}
          <div className="pt-1 space-y-2">
            {status === 'idle' && (
              <button
                onClick={startDownload}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base shadow-[0_8px_25px_rgba(245,158,11,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer relative group overflow-hidden"
              >
                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <Download className="w-5 h-5 stroke-[2.5] animate-bounce" />
                <span>Download Android APK (24.5 MB)</span>
              </button>
            )}

            {/* DOWNLOADING STATE: Progress Bar Animation */}
            {status === 'downloading' && (
              <div className="space-y-2">
                <div className="w-full rounded-2xl bg-[#031317] border-2 border-amber-400/50 p-2 shadow-[0_4px_20px_rgba(245,158,11,0.25)] relative overflow-hidden">
                  {/* Outer container */}
                  <div className="relative w-full h-12 rounded-xl bg-[#062029] overflow-hidden flex items-center justify-between px-4">
                    {/* The Animated Progress Bar Fill */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Animated diagonal stripes overlay */}
                      <div
                        className="w-full h-full opacity-25"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.4) 10px, rgba(255,255,255,0.4) 20px)',
                          backgroundSize: '200% 100%',
                        }}
                      />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-10 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-950/70 flex items-center justify-center text-amber-300">
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[2.8]" />
                      </div>
                      <span className="text-xs font-black tracking-wide text-slate-950 font-mono drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                        Downloading... {downloadedMb.toFixed(1)} MB / {totalSizeMb} MB
                      </span>
                    </div>

                    {/* Percentage & Cancel button */}
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-sm font-black text-slate-950 font-mono drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                        {progress}%
                      </span>
                      <button
                        onClick={handleCancel}
                        className="w-6 h-6 rounded-full bg-slate-900/80 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        title="Cancel Download"
                        aria-label="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-status stats */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span className="text-amber-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                    Speed: {speed}
                  </span>
                  <span>Est. Time: {eta}</span>
                </div>
              </div>
            )}

            {/* VERIFYING STATE */}
            {status === 'verifying' && (
              <div className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 animate-pulse">
                <ShieldCheck className="w-5 h-5 animate-spin text-slate-950 stroke-[2.5]" />
                <span>Verifying Package & Security Scan (SHA-256)...</span>
              </div>
            )}

            {/* COMPLETED STATE */}
            {status === 'completed' && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-base shadow-[0_8px_25px_rgba(52,211,153,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  <span>Download Complete! Install APK</span>
                </button>

                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Wingo-X-3-v2.8.0.apk (24.5 MB)
                  </span>
                  <button
                    onClick={handleRestart}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Download Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick info note */}
          <p className="text-[11px] text-slate-400">
            🔒 100% Virus-Free & Digitally Signed • No Root Required
          </p>
        </div>

        {/* ================= APP EXCLUSIVE BENEFITS ================= */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-md space-y-3">
          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>App Exclusive Benefits (অ্যাপের বিশেষ সুবিধা)</span>
          </h4>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#051C23] border border-[#0F3A48]">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Fast & Smooth Performance</strong>
                <span className="text-slate-400 text-[11px]">
                  Zero lag lottery, live casino streaming, and sub-second aviator cashout.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#051C23] border border-[#0F3A48]">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Instant Win & Bonus Alerts</strong>
                <span className="text-slate-400 text-[11px]">
                  Real-time push notifications for game jackpots, deposit approvals, and commissions.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#051C23] border border-[#0F3A48]">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Bank-Grade 256-Bit Security</strong>
                <span className="text-slate-400 text-[11px]">
                  Biometric FaceID / Fingerprint login with anti-fraud encryption.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= iOS / PWA INSTRUCTIONS ================= */}
        <div className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-md space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-black text-white text-sm">
            <Apple className="w-4 h-4 text-slate-200" />
            <span>Apple iOS Users (iPhone & iPad)</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Safari ব্রাউজারে ওপেন করুন, নিচের{' '}
            <strong className="text-amber-300">Share (শেয়ার)</strong> বাটনে ট্যাপ করে{' '}
            <strong className="text-amber-300">"Add to Home Screen"</strong> নির্বাচন করুন। কোনো
            ডাউনলোড ছাড়াই ফুলস্ক্রিন অ্যাপ মোডে খেলুন!
          </p>
        </div>
      </main>

      {/* ================= ANDROID APK INSTALLATION GUIDANCE MODAL ================= */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#082833] rounded-3xl p-5 border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">APK Download Complete</h4>
                  <span className="text-[11px] font-mono text-emerald-400">Wingo-X-3-v2.8.0.apk</span>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Install Steps */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#051C23] border border-[#0F3A48] space-y-2">
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  Installation Steps (ইন্সটল করার নিয়ম):
                </span>
                <ol className="space-y-1.5 text-slate-300 text-[11px] list-decimal list-inside">
                  <li>
                    ব্রাউজারের নোটিফিকেশন বা <strong>Downloads</strong> ফোল্ডার থেকে ফাইলটি খুলুন।
                  </li>
                  <li>
                    যদি <em>"Install unknown apps"</em> প্রম্পট আসে, তবে <strong>"Allow"</strong>{' '}
                    করুন।
                  </li>
                  <li>
                    <strong>"Install"</strong> বাটনে চাপ দিন এবং সাথে সাথে অ্যাপ চালু করুন!
                  </li>
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  showToast('🎉 অ্যাপ ইন্সটলেশন প্রসেস শুরু হচ্ছে...', 'success');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Open / Install Now</span>
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2 rounded-xl bg-[#0E3A48] hover:bg-[#13495B] text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
