'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

const QUICK_ACTIONS = [
  { label: 'Track Order', query: 'Where is my order?' },
  { label: 'Shipping', query: 'How long does shipping take?' },
  { label: 'Returns', query: 'What is your return policy?' },
  { label: 'Payment', query: 'What payment methods do you accept?' },
  { label: 'Contact', query: 'How do I contact customer support?' },
];

const SAFE_ERROR_MESSAGE =
  'TroxBot is receiving too many requests right now. Please try again in a moment or contact support@troxbox.com.';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [botName, setBotName] = useState('TroxBot');
  const [primaryColor, setPrimaryColor] = useState('#c9a87c');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let storedSession = localStorage.getItem('trox_chat_session');
    if (!storedSession) {
      storedSession = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('trox_chat_session', storedSession);
    }
    setSessionId(storedSession);

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          setBotName(settings.bot_name || 'TroxBot');
          setPrimaryColor(settings.primary_color || '#c9a87c');
          setMessages([{
            id: 'welcome',
            sender: 'bot',
            text: settings.welcome_message || 'Welcome to Trox Box. How can I assist you today?',
          }]);
        }
      } catch (err) {
        console.error('Failed to load chatbot settings:', err);
        setMessages([{ id: 'welcome', sender: 'bot', text: 'Welcome to Trox Box. How can I assist you today?' }]);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isTyping || !sessionId) return;

      const trimmed = userText.trim();
      const userMsgId = 'user_' + Date.now();
      setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: trimmed }]);
      setIsTyping(true);

      const botMsgId = 'bot_' + Date.now();
      let currentBotReply = '';

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, message: trimmed }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const serverError = errorData.error || '';
          throw new Error(
            serverError.includes('quota') || serverError.includes('429') || serverError.includes('rate')
              ? SAFE_ERROR_MESSAGE
              : serverError || SAFE_ERROR_MESSAGE
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error('Response body reader is unavailable.');

        setIsTyping(false);
        setMessages((prev) => [...prev, { id: botMsgId, sender: 'bot', text: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.error) {
                  const raw = String(parsed.error).toLowerCase();
                  currentBotReply =
                    raw.includes('quota') || raw.includes('429') || raw.includes('rate') || raw.includes('gemini') || raw.includes('googlegenerativeai')
                      ? SAFE_ERROR_MESSAGE : SAFE_ERROR_MESSAGE;
                } else if (parsed.text) {
                  currentBotReply += parsed.text;
                }
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg))
                );
              } catch { /* partial frames */ }
            }
          }
        }

        const lowerReply = currentBotReply.toLowerCase();
        if (lowerReply.includes('quota') || lowerReply.includes('429') || lowerReply.includes('ratelimit') || lowerReply.includes('googlegenerativeai') || lowerReply.includes('retrydelay')) {
          currentBotReply = SAFE_ERROR_MESSAGE;
          setMessages((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg)));
        }
      } catch (error) {
        console.error('Chat error:', error);
        setIsTyping(false);
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === botMsgId);
          if (exists) return prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: SAFE_ERROR_MESSAGE } : msg));
          return [...prev, { id: 'err_' + Date.now(), sender: 'bot', text: SAFE_ERROR_MESSAGE }];
        });
      }
    },
    [isTyping, sessionId]
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {/* TRIGGER BUTTON */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c9a87c] text-[#0a0a0a] shadow-[0_8px_32px_rgba(201,168,124,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 group focus:outline-none"
            title="Open Customer Support Chat"
          >
            <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-[#0a0a0a] bg-[#4ade80] animate-pulse" />
          </button>
        )}

        {/* CHAT WINDOW */}
        {isOpen && (
          <div className="w-[min(100vw-24px,400px)] h-[min(85vh,580px)] rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.04] shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c9a87c]/10 flex items-center justify-center text-[#c9a87c] text-[11px] font-bold tracking-wider">
                  {botName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-[13px] text-[#f5f0eb] leading-tight">{botName}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                    <span className="text-[10px] text-[#5a5550]">Online · Trox Box Support</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-[#5a5550] hover:text-[#f5f0eb] hover:bg-white/[0.04] transition-all focus:outline-none"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#c9a87c] text-[#0a0a0a] rounded-tr-md'
                        : 'bg-white/[0.04] border border-white/[0.06] text-[#f5f0eb] rounded-tl-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-[#c9a87c] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 bg-[#c9a87c] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 bg-[#c9a87c] rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 pt-2 pb-1 border-t border-white/[0.04] shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    disabled={isTyping}
                    onClick={() => sendMessage(action.query)}
                    className="shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#8a8580] hover:text-[#f5f0eb] hover:bg-white/[0.06] disabled:opacity-40 transition-all whitespace-nowrap focus:outline-none"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.04] flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about orders, shipping, returns..."
                disabled={isTyping}
                className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[13px] text-[#f5f0eb] placeholder-[#5a5550] focus:outline-none focus:border-[#c9a87c]/40 disabled:opacity-40 transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 p-2.5 rounded-xl bg-[#c9a87c] text-[#0a0a0a] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 focus:outline-none"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin text-[#5a5550]" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-white/[0.04] py-1.5 text-center shrink-0">
              <span className="text-[9px] text-[#5a5550] tracking-[0.15em] uppercase font-medium select-none">
                Powered by <span className="text-[#8a8580] font-semibold">Trox Box</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
