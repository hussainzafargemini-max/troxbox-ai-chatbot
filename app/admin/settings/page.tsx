'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Loader2, 
  Check, 
  Plus, 
  X, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ChatbotSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [id, setId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('Trox Box');
  const [botName, setBotName] = useState('TroxBot');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  
  // Allowed Topics Tag Manager States
  const [allowedTopics, setAllowedTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');

  // 1. Fetch current singleton configurations on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setErrorMsg('');
        const res = await fetch('/api/settings');
        if (res.ok) {
          const settings = await res.json();
          setId(settings.id || null);
          setBusinessName(settings.business_name || 'Trox Box');
          setBotName(settings.bot_name || 'TroxBot');
          setWelcomeMessage(settings.welcome_message || '');
          setFallbackMessage(settings.fallback_message || '');
          setPrimaryColor(settings.primary_color || '#6366F1');
          setAllowedTopics(settings.allowed_topics || []);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setErrorMsg('Failed to load chatbot settings.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // 2. Add new allowed topic to list tag
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = newTopicInput.trim();
    if (!cleanTopic) return;
    
    // Check for duplicates
    if (allowedTopics.some(t => t.toLowerCase() === cleanTopic.toLowerCase())) {
      setNewTopicInput('');
      return;
    }

    setAllowedTopics([...allowedTopics, cleanTopic]);
    setNewTopicInput('');
  };

  // 3. Remove allowed topic from list tag
  const handleRemoveTopic = (indexToRemove: number) => {
    setAllowedTopics(allowedTopics.filter((_, idx) => idx !== indexToRemove));
  };

  // 4. Save Chatbot Configurations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveLoading) return;

    setSaveLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      id,
      business_name: businessName.trim(),
      bot_name: botName.trim(),
      welcome_message: welcomeMessage.trim(),
      fallback_message: fallbackMessage.trim(),
      primary_color: primaryColor,
      allowed_topics: allowedTopics
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Server returned an error while saving configurations.');
      }

      const updated = await res.json();
      if (updated.id) {
        setId(updated.id);
      }

      setSuccessMsg('Chatbot settings updated successfully!');
      
      // Clear success message after 4 seconds
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg(err?.message || 'Failed to update chatbot settings. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#c9a87c]" />
        <span className="text-xs font-bold text-[#5a5550]">Loading settings panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#f5f0eb] tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-[#c9a87c]" />
          <span>Chatbot Settings</span>
        </h1>
        <p className="text-xs text-[#5a5550] font-semibold mt-1">
          Customize your customer-facing AI agent. Edit branding names, custom welcome/fallback text blocks, primary widget color themes, and allowed topic tags.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-400">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{successMsg}</p>
        </div>
      )}

      {/* Main Configurations Form */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Branding & Prompts (2 Columns) */}
        <div className="md:col-span-2 bg-[#141414] border border-white/[0.04] rounded-2xl p-6 shadow-sm space-y-5">
          
          <h3 className="text-sm font-bold text-[#f5f0eb] border-b border-white/[0.04] pb-3 flex items-center space-x-1.5">
            <span>Agent Styling & Conversational Texts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                Business Brand Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Trox Box"
                className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
                Chatbot Agent Name
              </label>
              <input
                type="text"
                required
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. TroxBot"
                className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
              Floating Welcome Message Greeting
            </label>
            <textarea
              required
              rows={3}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Hi! 👋 Welcome to Trox Box. How can I help you today?"
              className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest block ml-1">
              Strict Fallback Refusal Message
            </label>
            <textarea
              required
              rows={3}
              value={fallbackMessage}
              onChange={(e) => setFallbackMessage(e.target.value)}
              placeholder="I don’t have enough information. Please contact support."
              className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-[#f5f0eb] resize-none"
            />
          </div>

        </div>

        {/* Right Side: Colors & Allowed Topics (1 Column) */}
        <div className="space-y-6">
          
          {/* Brand Color Picker */}
          <div className="bg-[#141414] border border-white/[0.04] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#f5f0eb] border-b border-white/[0.04] pb-3 flex items-center space-x-1.5">
              <span>Theme Color Branding</span>
            </h3>
            
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-2xl border border-white/[0.06] flex items-center justify-center shadow-inner shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex-grow space-y-1">
                <label className="text-[9px] font-black text-[#5a5550] uppercase tracking-widest block">
                  Primary Brand HEX Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-white/[0.06] p-0.5"
                  />
                  <input
                    type="text"
                    required
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none text-[#f5f0eb]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Allowed Topics Tag Manager */}
          <div className="bg-[#141414] border border-white/[0.04] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#f5f0eb] border-b border-white/[0.04] pb-3 flex items-center space-x-1.5">
              <span>Allowed Chat Topics</span>
            </h3>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pb-1">
              {allowedTopics.length === 0 ? (
                <span className="text-[10px] text-[#5a5550] font-bold">No topic restrictions. Bot can discuss anything.</span>
              ) : (
                allowedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#c9a87c]/10 text-[#c9a87c] rounded-xl text-[10px] font-bold"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="text-[#c9a87c] hover:text-[#c9a87c] focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Tag Input */}
            <div className="flex items-center space-x-2 pt-2 border-t border-white/[0.04]">
              <input
                type="text"
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                placeholder="Add allowed topic..."
                className="flex-1 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] focus:border-[#c9a87c] focus:ring-1 focus:ring-[#c9a87c] rounded-xl px-3 py-1.5 text-xs focus:outline-none text-[#f5f0eb]"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="p-1.5 bg-[#c9a87c]/10 hover:bg-[#c9a87c]/10 text-[#c9a87c] rounded-xl transition-all focus:outline-none"
                title="Add Topic Tag"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Global Save Button (across bottom) */}
        <div className="md:col-span-3 flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.06]/60">
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-[#c9a87c] hover:bg-[#b09878] active:bg-[#9a7d5a] text-white font-bold px-8 py-3 rounded-2xl text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 focus:outline-none"
          >
            {saveLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Configurations</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
