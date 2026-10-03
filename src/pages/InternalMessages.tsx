import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { Mail, CheckCircle, ChevronRight, Clock, Tag } from 'lucide-react';
import { MessageItem } from '../types';
import { Modal } from '../components/Modal';

export const InternalMessages: React.FC = () => {
  const { messages, markMessageRead } = useApp();
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const handleOpenMessage = (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <Header title="Internal Message" />

      <main className="max-w-lg mx-auto px-4 py-3.5 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => handleOpenMessage(msg)}
            className={`p-4 rounded-2xl bg-white border cursor-pointer hover:shadow-md transition-all space-y-2 ${
              msg.read ? 'border-slate-100 opacity-80' : 'border-amber-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {!msg.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{msg.title}</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                {msg.category}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {msg.preview}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {msg.date}
              </span>
              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                Read More <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMessage(null)}
          title={selectedMessage.title}
        >
          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-400 font-mono">
              <span>{selectedMessage.date}</span>
              <span className="font-bold text-amber-600">[{selectedMessage.category}]</span>
            </div>
            <p className="text-sm leading-relaxed">{selectedMessage.content}</p>
            <button
              onClick={() => setSelectedMessage(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-600 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
