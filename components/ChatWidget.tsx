'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Chat configurations loaded dynamically from Supabase
  const [botName, setBotName] = useState('TroxBot');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
  const [primaryColor, setPrimaryColor] = useState('#6366F1'); // Indigo default

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize session and load bot settings on mount
  useEffect(() => {
    // Generate or fetch session ID from localStorage to maintain continuity
    let storedSession = localStorage.getItem('trox_chat_session');
    if (!storedSession) {
      storedSession = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('trox_chat_session', storedSession);
    }
    setSessionId(storedSession);

    // Fetch dynamic branding configurations from database
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          setBotName(settings.bot_name || 'TroxBot');
          setWelcomeMessage(settings.welcome_message || 'Hi! How can I help you today?');
          setPrimaryColor(settings.primary_color || '#6366F1');
          
          // Seed the initial welcome message from the config
          setMessages([
            {
              id: 'welcome',
              sender: 'bot',
              text: settings.welcome_message || 'Hi! How can I help you today?'
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load chatbot settings:', err);
        // Fallback welcome message
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: 'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?'
          }
        ]);
      }
    }

    loadSettings();
  }, []);

  // 2. Automatically scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // 3. Send message handler (supports SSE streaming)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Append user message to thread
    const userMsgId = 'user_' + Date.now();
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, sender: 'user', text: userText }
    ];
    setMessages(newMessages);
    setIsTyping(true);

    // Placeholder bot message for streaming text
    const botMsgId = 'bot_' + Date.now();
    let currentBotReply = '';

    try {
      // Send chat payload
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server returned an error');
      }

      // Check if we received a stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body reader is unavailable.');
      }

      // Hide typing indicator once streaming starts
      setIsTyping(false);

      // Append blank bot message that will be populated during stream reading
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: 'bot', text: '' }
      ]);

      // Read SSE stream
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
                currentBotReply = parsed.error;
              } else if (parsed.text) {
                currentBotReply += parsed.text;
              }

              // Update the target bot message text progressively
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg
                )
              );
            } catch (err) {
              // ignore json parse errors on partial frames
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage = error?.message || "Hmm, that took longer than expected. Please try again.";
      
      // Check if bot message was already created
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === botMsgId);
        if (exists) {
          return prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, text: errorMessage } : msg
          );
        } else {
          return [
            ...prev,
            { id: 'err_' + Date.now(), sender: 'bot', text: errorMessage }
          ];
        }
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* 1. Collapsed Circular Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
          title="Open Customer Support Chat"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          {/* Subtle online indicator dot */}
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
        </button>
      )}

      {/* 2. Expanded Chat Box Window Panel */}
      {isOpen && (
        <div className="w-[360px] h-[520px] max-h-[85vh] sm:w-[350px] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:rounded-2xl z-50">
          
          {/* Header */}
          <div
            style={{ backgroundColor: primaryColor }}
            className="px-4 py-4 text-white flex items-center justify-between shadow-md"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm tracking-wider">
                {botName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold leading-tight text-sm">{botName}</h4>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-[10px] text-white/80">AI Support Agent</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none"
              title="Minimize chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === 'user' ? primaryColor : undefined,
                    color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937'
                  }}
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'rounded-tr-none'
                      : 'bg-white border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Bouncing Typing Indicator Bubbble */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your order, shipping, returns..."
              disabled={isTyping}
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 disabled:opacity-50 text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              style={{ backgroundColor: inputValue.trim() && !isTyping ? primaryColor : '#E5E7EB' }}
              className="p-2.5 rounded-xl text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 focus:outline-none"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Footer Branding */}
          <div className="bg-gray-50 border-t border-gray-100 py-1.5 text-center">
            <span className="text-[10px] text-gray-400 tracking-wider font-semibold select-none">
              Powered by <span className="font-bold text-gray-500">Trox Box</span>
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
