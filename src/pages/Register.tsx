import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import {
  ChevronLeft,
  ChevronDown,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Globe,
  AlertCircle,
} from 'lucide-react';

export const Register: React.FC = () => {
  const { register, navigate, showToast } = useApp();
  const { branding } = useSiteSettings();

  const [countryCode, setCountryCode] = useState('+880');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('37276100176');
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১০ বা ১১ সংখ্যার ফোন নম্বর প্রদান করুন (Please enter valid phone number)');
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)');
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('উভয় পাসওয়ার্ড মেলেনি! অনুগ্রহ করে যাচাই করুন (Passwords do not match)');
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (!agreePrivacy) {
      setErrorMessage('অনুগ্রহ করে প্রাইভেসী এগ্রিমেন্টে সম্মতি দিন (Please agree to privacy agreement)');
      showToast('Please agree to Privacy Agreement', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = register(`${countryCode}${cleanPhone}`, password, inviteCode);
    setIsSubmitting(false);

    if (result.success) {
      showToast('🎉 রেজিস্ট্রেশন সফল হয়েছে! একাউন্টে স্বাগতম।', 'success');
      navigate('home');
    } else {
      setErrorMessage(result.message);
      showToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800 flex flex-col font-sans select-none">
      {/* ================= 1. GOLDEN YELLOW TOP HEADER BAR ================= */}
      <header className="w-full bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#F59E0B] text-slate-950 px-3.5 py-3 flex items-center justify-between shadow-md sticky top-0 z-30">
        {/* Left: Back Arrow */}
        <button
          onClick={() => navigate('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-950 hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.8]" />
        </button>

        {/* Center: Brand Logo Lock-up */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('home')}>
          {branding.logoType === 'image' && branding.logoImageUrl ? (
            <img
              src={branding.logoImageUrl}
              alt="Logo"
              className="h-8 max-w-[140px] object-contain drop-shadow-md"
            />
          ) : (
            <div className="flex items-center">
              <span className="text-xl font-black italic tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {branding.siteName || 'Wingo'}
              </span>
              <span className="text-xl font-black italic tracking-tighter text-slate-950 ml-1">
                {branding.siteNameMiddle || 'X'}
              </span>
              <span className="text-xl font-black italic tracking-tighter text-emerald-950 ml-1 bg-white/20 px-1.5 py-0.2 rounded-md">
                {branding.siteNameSuffix || '3'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Language Selector Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/10 border border-black/15 text-slate-900 text-xs font-bold cursor-pointer hover:bg-black/15 transition-colors">
          <span className="text-sm">🇺🇸</span>
          <span>EN</span>
        </div>
      </header>

      {/* ================= 2. REGISTER TAB SUB-HEADER ================= */}
      <div className="max-w-md w-full mx-auto px-4 pt-5 pb-8 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Subheader Title */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h2 className="text-base font-extrabold text-amber-500 tracking-wide mt-1">
              Register your phone
            </h2>
            <div className="w-14 h-1 bg-amber-400 rounded-full mt-0.5" />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Field 1: Phone number */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-600 flex items-center justify-center text-xs">
                  📱
                </span>
                <span>Phone number</span>
              </label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-11 px-3 pr-7 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-amber-400 appearance-none shadow-xs cursor-pointer"
                  >
                    <option value="+880">+880 (BD)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+92">+92 (PK)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+1">+1 (US)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Phone Input */}
                <input
                  type="tel"
                  required
                  placeholder="Please enter the phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400 shadow-xs"
                />
              </div>
            </div>

            {/* Field 2: Set password */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-600 flex items-center justify-center text-xs">
                  🔒
                </span>
                <span>Set password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Set password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 3: Confirm password */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-600 flex items-center justify-center text-xs">
                  🔒
                </span>
                <span>Confirm password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-amber-400 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Field 4: Invite code */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-600 flex items-center justify-center text-xs">
                  👤
                </span>
                <span>Invite code</span>
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-amber-400 shadow-xs tracking-wider"
              />
            </div>

            {/* Checkbox: Privacy Agreement */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="agree-privacy"
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="agree-privacy" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                I have read and agree{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-red-500 font-bold hover:underline"
                >
                  【Privacy Agreement】
                </button>
              </label>
            </div>

            {/* Big Yellow Register Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#F59E0B] hover:brightness-105 active:scale-[0.99] text-slate-950 font-black text-sm tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>

            {/* Outlined Login Button Link */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full h-12 rounded-full bg-white border-2 border-amber-400 hover:bg-amber-50/50 active:scale-[0.99] text-slate-700 font-bold text-xs tracking-wide shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>I have an account</span>
                <span className="text-amber-500 font-black">Login</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          Official Secure Verified Platform • 24/7 Support
        </div>
      </div>

      {/* Privacy Agreement Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3.5 text-slate-800 border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-2 flex items-center gap-2">
              <span>📜 Privacy Agreement</span>
            </h3>
            <div className="text-xs text-slate-600 max-h-60 overflow-y-auto space-y-2 leading-relaxed">
              <p>
                Welcome to our platform! We are committed to safeguarding your privacy and ensuring transparency in how your information is handled.
              </p>
              <p>
                1. <strong>Account Security:</strong> Your phone number and encrypted credentials are used strictly for authentication and wallet protection.
              </p>
              <p>
                2. <strong>Financial Integrity:</strong> Real wallet transactions, deposits, and withdrawal requests are audited with strict SSL encryption.
              </p>
              <p>
                3. <strong>Anti-Cheat & Fair Play:</strong> All gameplay simulations are strictly verified for fairness.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition-all"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
