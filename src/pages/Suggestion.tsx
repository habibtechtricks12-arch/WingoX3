import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const Suggestion: React.FC = () => {
  const { goBack, showToast } = useApp();
  const [category, setCategory] = useState('Game Experience');
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      showToast('Please type your suggestion before submitting', 'error');
      return;
    }
    showToast('Thank you! Your feedback has been received.', 'success');
    goBack();
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Suggestion" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-slate-950 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-950">We Value Your Voice</h3>
              <p className="text-xs text-amber-950/80 mt-0.5">
                Tell us how we can make your TCG SEA experience even better.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-4 border border-slate-100 shadow-md space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Feedback Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="Game Experience">Game Experience & WinGo</option>
              <option value="Deposit & Withdrawal">Deposit & Withdrawal</option>
              <option value="Rewards & Bonuses">Rewards & Bonuses</option>
              <option value="Technical Issue">Technical / Bug Report</option>
              <option value="Other">Other Suggestion</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Your Feedback
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe your suggestion or issue in detail..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Contact Information (Optional)
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or Telegram username"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Suggestion
          </button>
        </form>
      </main>
    </div>
  );
};
