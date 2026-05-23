'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Send, 
  Loader2, 
  RefreshCw, 
  Info,
  Sparkles,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function TestChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Active configurations loaded from DB
  const [botName, setBotName] = useState('TroxBot');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! How can I help you today?');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [allowedTopics, setAllowedTopics] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize session and load configurations
  const initSandbox = () => {
    const newSess = 'test_sess_' + Math.random().toString(36).substring(2, 10);
    setSessionId(newSess);
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: welcomeMessage
      }
    ]);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const settings = await res.json();
        setBotName(settings.bot_name || 'TroxBot');
        setWelcomeMessage(settings.welcome_message || 'Hi! How can I help you today?');
        setPrimaryColor(settings.primary_color || '#6366F1');
        setFallbackMessage(settings.fallback_message || '');
        setAllowedTopics(settings.allowed_topics || []);
        
        // Seed initial message
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: settings.welcome_message || 'Hi! How can I help you today?'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    loadSettings();
    const newSess = 'test_sess_' + Math.random().toString(36).substring(2, 10);
    setSessionId(newSess);
  }, []);

  // 2. Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // 3. Send message handler (streaming SSE decoder)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Add user message
    const userMsgId = 'user_' + Date.now();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: userText }
    ]);
    setIsTyping(true);

    const botMsgId = 'bot_' + Date.now();
    let currentBotReply = '';

    try {
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
        throw new Error(errorData.error || 'Server error occurred.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('Body reader not available.');

      setIsTyping(false);
      
      // Append blank bot message
      setMessages(prev => [
        ...prev,
        { id: botMsgId, sender: 'bot', text: '' }
      ]);

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

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === botMsgId ? { ...msg, text: currentBotReply } : msg
                )
              );
            } catch (err) {
              // ignore partial frame JSON parse errors
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Sandbox chat error:', err);
      setIsTyping(false);
      
      const errMsg = err?.message || 'Failed to generate response.';
      setMessages(prev => {
        const exists = prev.some(m => m.id === botMsgId);
        if (exists) {
          return prev.map(m => m.id === botMsgId ? { ...m, text: errMsg } : m);
        } else {
          return [...prev, { id: 'err_' + Date.now(), sender: 'bot', text: errMsg }];
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#f5f0eb] tracking-tight flex items-center space-x-2">
            <Play className="w-6 h-6 text-[#c9a87c] animate-pulse" />
            <span>Test Chatbot Playground</span>
          </h1>
          <p className="text-xs text-[#5a5550] font-semibold mt-1">
            Sandbox testing screen. Interact with your AI chatbot inside this frame to immediately test RAG search responses and order tracking lookups.
          </p>
        </div>
        
        <button
          onClick={initSandbox}
          className="bg-[#141414] hover:bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 focus:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sandbox</span>
        </button>
      </div>

      {/* Main Sandbox Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Chat Simulator (2 Columns) */}
        <div className="lg:col-span-2 bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl overflow-hidden flex flex-col h-[520px]">
          
          {/* Mock Widget Header */}
          <div 
            style={{ backgroundColor: primaryColor }}
            className="px-6 py-4 text-white flex items-center justify-between shadow-sm shrink-0"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm tracking-wider">
                {botName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">{botName}</h4>
                <span className="text-[10px] text-white/80 block mt-0.5">Sandbox Simulator Console</span>
              </div>
            </div>
            
            <span className="bg-white/10 text-white border border-white/25 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
              Simulation Session: {sessionId}
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white/[0.02]">
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
                    color: msg.sender === 'user' ? '#FFFFFF' : '#1F2937'
                  }}
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'rounded-tr-none'
                      : 'bg-[#141414] border border-white/[0.04] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Bouncing Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#141414] border border-white/[0.04] rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm flex items-center space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-[#141414] border-t border-white/[0.04] flex items-center space-x-3 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type customer questions to test (e.g. Where is order TRX-1001?)..."
              disabled={isTyping}
              className="flex-1 bg-white/[0.03] border-none rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 disabled:opacity-50 text-[#f5f0eb] placeholder-gray-400"
            />
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              style={{ backgroundColor: inputValue.trim() && !isTyping ? primaryColor : '#E5E7EB' }}
              className="p-3 rounded-2xl text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 focus:outline-none shrink-0"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#5a5550]" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

        </div>

        {/* Right Column: Chat Parameters Monitor (1 Column) */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-6 h-fit space-y-6">
          
          <div className="flex items-center space-x-2 text-[#c9a87c] border-b border-white/[0.04] pb-3">
            <Info className="w-5 h-5" />
            <h3 className="font-extrabold text-[#f5f0eb] text-sm">Active Bot Parameters</h3>
          </div>

          {/* Info blocks */}
          <div className="space-y-4 text-xs">
            
            <div className="space-y-1 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]/50">
              <span className="text-[9px] font-black text-[#5a5550] uppercase tracking-widest block">Welcome Seeding Message</span>
              <p className="text-[#8a8580] font-semibold italic mt-0.5">{welcomeMessage || 'None'}</p>
            </div>

            <div className="space-y-1 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]/50">
              <span className="text-[9px] font-black text-[#5a5550] uppercase tracking-widest block">Fallback Refusal Prompt</span>
              <p className="text-[#8a8580] font-semibold italic mt-0.5">{fallbackMessage || 'None'}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-black text-[#5a5550] uppercase tracking-widest block">Allowed discussion topics</span>
              <div className="flex flex-wrap gap-1.5">
                {allowedTopics.length === 0 ? (
                  <span className="text-[10px] text-[#5a5550]">None restricted</span>
                ) : (
                  allowedTopics.map((topic, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-[#c9a87c]/10 text-[#c9a87c] rounded-lg text-[9px] font-black uppercase tracking-wide border border-[#c9a87c]/10"
                    >
                      {topic}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] text-white rounded-2xl space-y-2 border border-white/[0.04] shadow-md">
              <h4 className="font-black text-[9px] uppercase tracking-wider text-[#c9a87c] flex items-center space-x-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>RAG Pipeline Active</span>
              </h4>
              <p className="text-[9px] text-[#5a5550] leading-normal font-medium">
                This testing panel runs against the live `/api/chat` route, querying real vectorized Knowledge Base documents and active FAQ records in Supabase. Conversations logged here are flagged and visible in your historical logs audit panel.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
