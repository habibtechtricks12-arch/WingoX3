import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { ShieldCheck, Lock, Smartphone, KeyRound, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export const SecurityCenter: React.FC = () => {
  const { user, showToast } = useApp();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [loginProtection, setLoginProtection] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('Passwords do not match or are empty', 'error');
      return;
    }
    showToast('Login password updated successfully!', 'success');
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Security Center" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        {/* Security Score Card */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 shadow-lg border border-teal-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Security Rating: Good</h3>
                <p className="text-xs text-teal-200/80">Account Protection 85%</p>
              </div>
            </div>
            <span className="font-mono text-xl font-extrabold text-amber-400">85/100</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[85%] rounded-full" />
          </div>
        </div>

        {/* Security Options List */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-md divide-y divide-slate-100">
          {/* Change Login Password */}
          <div
            onClick={() => setShowPasswordModal(true)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Login Password</h4>
                <p className="text-[11px] text-slate-400">Manage account access password</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
              <span>Modify</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Payment PIN */}
          <div
            onClick={() => setShowPinModal(true)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Payment Security PIN</h4>
                <p className="text-[11px] text-slate-400">6-digit withdrawal confirmation PIN</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
              <span>Set PIN</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Bind Phone */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Bind Mobile Phone</h4>
                <p className="text-[11px] font-mono text-slate-400">{user.phone}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Bound
            </span>
          </div>

          {/* Login Protection Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Device Login Protection</h4>
              <p className="text-[11px] text-slate-400">Alert on new device sign in</p>
            </div>
            <button
              onClick={() => {
                setLoginProtection(!loginProtection);
                showToast(`Login protection ${!loginProtection ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                loginProtection ? 'bg-amber-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                  loginProtection ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* 2FA Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication</h4>
              <p className="text-[11px] text-slate-400">Extra layer of security for withdrawals</p>
            </div>
            <button
              onClick={() => {
                setTwoFactorAuth(!twoFactorAuth);
                showToast(`2FA ${!twoFactorAuth ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                twoFactorAuth ? 'bg-amber-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${
                  twoFactorAuth ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </main>

      {/* Modify Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Login Password"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors mt-2"
          >
            Update Password
          </button>
        </div>
      </Modal>

      {/* Set PIN Modal */}
      <Modal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        title="Set Security PIN"
      >
        <div className="space-y-3 text-center">
          <p className="text-xs text-slate-600">
            Set a 6-digit transaction PIN for withdrawals.
          </p>
          <input
            type="password"
            maxLength={6}
            placeholder="123456"
            className="w-48 mx-auto p-2.5 rounded-xl border border-slate-200 text-center font-mono text-base tracking-widest focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            onClick={() => {
              showToast('Security PIN set successfully!', 'success');
              setShowPinModal(false);
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors mt-2"
          >
            Confirm PIN
          </button>
        </div>
      </Modal>
    </div>
  );
};
