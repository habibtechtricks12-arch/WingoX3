import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { CreditCard, ShieldCheck, User, Phone, Building } from 'lucide-react';
import { BankAccount as BankAccountType } from '../types';

export const BankAccount: React.FC = () => {
  const { bankAccount, updateBankAccount, goBack, showToast } = useApp();

  const [form, setForm] = useState<BankAccountType>({
    accountHolder: bankAccount.accountHolder || '',
    bankName: bankAccount.bankName || 'bKash Mobile Banking',
    accountNumber: bankAccount.accountNumber || '',
    mobileNumber: bankAccount.mobileNumber || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.accountHolder.trim()) errs.accountHolder = 'Account holder name is required';
    if (!form.bankName.trim()) errs.bankName = 'Bank name is required';
    if (!form.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (!form.mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    updateBankAccount(form);
    goBack();
  };

  return (
    <div className="min-h-screen bg-[#061E26] text-slate-100 pb-28">
      <Header title="Bank Account" />

      <main className="max-w-lg mx-auto px-3.5 py-3.5 space-y-4">
        {/* Top Card */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-slate-950 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#061E26] text-amber-400 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-950">
                Payment & Bank Account Binding
              </h3>
              <p className="text-xs text-amber-950/80 mt-0.5">
                Ensure accuracy for fast demo withdrawal processing.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl bg-[#082833] p-4 border border-[#114555] shadow-md space-y-3.5">
          {/* Account Holder */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Account Holder Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={form.accountHolder}
                onChange={(e) => setForm({ ...form, accountHolder: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#051C23] border border-[#124252] text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            {errors.accountHolder && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.accountHolder}</span>
            )}
          </div>

          {/* Bank / Method */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Bank / Payment Method
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Building className="w-4 h-4" />
              </span>
              <select
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#051C23] border border-[#124252] text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="bKash Mobile Banking">bKash Mobile Banking</option>
                <option value="Nagad Wallet">Nagad Wallet</option>
                <option value="Rocket Pay">Rocket Pay</option>
                <option value="Islami Bank Bangladesh">Islami Bank Bangladesh</option>
                <option value="Dutch-Bangla Bank">Dutch-Bangla Bank</option>
                <option value="USDT TRC20 Wallet">USDT TRC20 Wallet</option>
              </select>
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Account Number / Wallet ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <CreditCard className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                placeholder="e.g. 01712345678"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#051C23] border border-[#124252] text-xs font-mono font-medium text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            {errors.accountNumber && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.accountNumber}</span>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Registered Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                placeholder="e.g. 01712345678"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#051C23] border border-[#124252] text-xs font-mono font-medium text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            {errors.mobileNumber && (
              <span className="text-[10px] text-rose-500 mt-1 block">{errors.mobileNumber}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={goBack}
            className="py-3 rounded-xl bg-[#0E3A48] hover:bg-[#13495B] border border-[#144758] text-slate-200 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors"
          >
            Save Account
          </button>
        </div>
      </main>
    </div>
  );
};
