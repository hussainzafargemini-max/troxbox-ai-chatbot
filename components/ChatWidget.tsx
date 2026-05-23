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
  const [primaryColor, setPrimaryColor] = useState('#6366F1');

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
          setPrimaryColor(settings.primary_color || '#6366F1');

          setMessages([
            {
              id: 'welcome',
              sender: 'bot',
              text:
                settings.welcome_message ||
                'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?',
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chatbot settings:', err);
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: 'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?',
          },
        ]);
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
          body: JSON.stringify({
            session_id: sessionId,
            message: trimmed,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const serverError = errorData.error || '';
          throw new Error(
            serverError.includes('quota') ||
              serverError.includes('429') ||
              serverError.includes('rate')
              ? SAFE_ERROR_MESSAGE
              : serverError || SAFE_ERROR_MESSAGE
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body reader is unavailable.');
        }

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
                    raw.includes('quota') ||
                    raw.includes('429') ||
                    raw.includes('rate') ||
                    raw.includes('gemini') ||
                    raw.includes('googlegenerativeai')
                      ? SAFE_ERROR_MESSAGE
                      : SAFE_ERROR_MESSAGE;
                } else if (parsed.text) {
                  currentBotReply += parsed.text;
                }

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg
                  )
                );
              } catch {
                // ignore partial frames
              }
            }
          }
        }

        const lowerReply = currentBotReply.toLowerCase();
        if (
          lowerReply.includes('quota') ||
          lowerReply.includes('429') ||
          lowerReply.includes('ratelimit') ||
          lowerReply.includes('googlegenerativeai') ||
          lowerReply.includes('retrydelay')
        ) {
          currentBotReply = SAFE_ERROR_MESSAGE;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg
            )
          );
        }
      } catch (error) {
        console.error('Chat error:', error);
        setIsTyping(false);

        setMessages((prev) => {
          const exists = prev.some((m) => m.id === botMsgId);
          if (exists) {
            return prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: SAFE_ERROR_MESSAGE } : msg
            );
          }
          return [
            ...prev,
            { id: 'err_' + Date.now(), sender: 'bot', text: SAFE_ERROR_MESSAGE },
          ];
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

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: primaryColor }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
            title="Open Customer Support Chat"
          >
            <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
          </button>
        )}

        {isOpen && (
          <div className="w-[min(100vw,380px)] h-[min(85vh,560px)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div
              style={{ backgroundColor: primaryColor }}
              className="px-4 py-3.5 text-white flex items-center justify-between shadow-md shrink-0"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm tracking-wider">
                  {botName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold leading-tight text-sm">{botName}</h4>
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                    <span className="text-[10px] text-white/80">Online · Trox Box Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none"
                title="Minimize chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50/80 to-white min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    style={{
                      backgroundColor: msg.sender === 'user' ? primaryColor : undefined,
                      color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937',
                    }}
                    className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'rounded-tr-sm'
                        : 'bg-white border border-gray-100 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-1">
                    <span className="h-2 w-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 bg-indigo-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleQuickAction(action.query)}
                    className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 disabled:opacity-50 transition-colors whitespace-nowrap focus:outline-none"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about orders, shipping, returns..."
                disabled={isTyping}
                className="flex-1 min-w-0 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50 text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                style={{
                  backgroundColor: inputValue.trim() && !isTyping ? primaryColor : '#E5E7EB',
                }}
                className="shrink-0 p-2.5 rounded-xl text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 focus:outline-none"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="bg-gray-50 border-t border-gray-100 py-1.5 text-center shrink-0">
              <span className="text-[10px] text-gray-400 tracking-wider font-semibold select-none">
                Powered by <span className="font-bold text-gray-500">Trox Box</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
