import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Headphones, Send, User, Bot, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const CustomerService: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello ${user.nickname}! Welcome to TCG SEA 24/7 Live Support. How may I assist you with your demo platform experience today?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    'How do I test WinGo lottery?',
    'How does the invite referral bonus work?',
    'Are these real money deposits?',
    'How do I claim my daily sign-in reward?',
  ];

  const answerForQuestion = (q: string): string => {
    if (q.includes('WinGo')) {
      return 'WinGo offers 30-second, 1-minute, 3-minute, and 5-minute prediction rounds. You can predict colors (Green, Violet, Red), numbers 0-9, or Big/Small (5-9 / 0-4). When the timer reaches 0, results are evaluated and winning payouts are added to your balance!';
    }
    if (q.includes('invite')) {
      return 'You can share your exclusive invite link from the "Invite Friends" tab. When friends register, you earn commission rebates and progress towards achievement bonuses up to 500TK!';
    }
    if (q.includes('real money')) {
      return 'No, this application is a safe frontend UI demonstration prototype. No real money gambling, deposits, or withdrawals are processed.';
    }
    if (q.includes('sign-in')) {
      return 'Visit the "Reward Center" tab and tap "Sign In" at the top right to collect your daily check-in rewards and increase your check-in streak!';
    }
    return `Thank you for asking about "${q}". Our representative has noted your request in the demo support logs. Feel free to explore our features!`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated Bot Reply after 400ms
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: answerForQuestion(text),
        time: timeStr,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-20">
      <Header title="Customer Service" />

      {/* Quick Status Bar */}
      <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Live Support Agent Online</span>
          </div>
          <span className="text-[11px] font-mono">Response: &lt; 1 min</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-3 space-y-3 overflow-y-auto">
        {/* Quick FAQ Questions Chips */}
        <div className="space-y-1.5 pb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-800 text-[11px] font-medium hover:bg-amber-50 active:scale-95 transition-all text-left shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Bubbles */}
        <div className="space-y-3 pt-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] font-mono block mt-1 text-right ${
                    m.sender === 'user' ? 'text-amber-950/70' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Input Box Fixed At Bottom (above nav) */}
      <div className="sticky bottom-16 left-0 right-0 bg-white border-t border-slate-200 p-2.5 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="max-w-lg mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md active:scale-95 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
