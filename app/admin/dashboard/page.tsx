'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  AlertTriangle,
  History,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Conversation {
  id: string;
  session_id: string;
  user_message: string;
  bot_response: string;
  is_fallback: boolean;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    conversationsCount: 0,
    faqsCount: 0,
    kbCount: 0,
    fallbackCount: 0,
    fallbackRate: 0,
  });
  
  const [recentChats, setRecentChats] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        
        // 1. Fetch exact row counts using Supabase client head queries
        const { count: conversationsCount, error: err1 } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true });

        const { count: faqsCount, error: err2 } = await supabase
          .from('faqs')
          .select('*', { count: 'exact', head: true });

        const { count: kbCount, error: err3 } = await supabase
          .from('knowledge_base')
          .select('*', { count: 'exact', head: true });

        const { count: fallbackCount, error: err4 } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('is_fallback', true);

        // 2. Query top 5 recent conversation threads
        const { data: recent, error: err5 } = await supabase
          .from('conversations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (err1 || err2 || err3 || err4 || err5) {
          throw new Error('Database queries failed during load');
        }

        const totalConvs = conversationsCount || 0;
        const totalFallbacks = fallbackCount || 0;
        const rate = totalConvs > 0 ? Math.round((totalFallbacks / totalConvs) * 100) : 0;

        setStats({
          conversationsCount: totalConvs,
          faqsCount: faqsCount || 0,
          kbCount: kbCount || 0,
          fallbackCount: totalFallbacks,
          fallbackRate: rate,
        });

        setRecentChats((recent || []) as Conversation[]);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black text-[#f5f0eb] tracking-tight">Overview Dashboard</h1>
        <p className="text-xs text-[#5a5550] font-semibold mt-1">
          Monitor your customer support chatbot performance, database volume, and recent chat transcripts.
        </p>
      </div>

      {/* 1. KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Conversations */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest">Total Inquiries</span>
              <div className="p-1.5 bg-[#c9a87c]/10 text-[#c9a87c] rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.04] animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-[#f5f0eb] mt-2">{stats.conversationsCount}</h3>
            )}
          </div>
          <span className="text-[10px] text-[#5a5550] font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400">Live</span>
            <span>inquiries logged</span>
          </span>
        </div>

        {/* Total FAQs */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest">Active FAQs</span>
              <div className="p-1.5 bg-[#c9a87c]/10 text-[#c9a87c] rounded-lg">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.04] animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-[#f5f0eb] mt-2">{stats.faqsCount}</h3>
            )}
          </div>
          <Link href="/admin/faqs" className="text-[10px] text-[#c9a87c] font-bold hover:underline">
            Manage FAQs →
          </Link>
        </div>

        {/* Knowledge Articles */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest">KB Coverage</span>
              <div className="p-1.5 bg-[#c9a87c]/10 text-[#c9a87c] rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.04] animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-[#f5f0eb] mt-2">{stats.kbCount}</h3>
            )}
          </div>
          <Link href="/admin/knowledge-base" className="text-[10px] text-[#c9a87c] font-bold hover:underline">
            Manage Articles →
          </Link>
        </div>

        {/* Fallback Rate */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#5a5550] uppercase tracking-widest">AI Fallback Rate</span>
              <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.04] animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-[#f5f0eb] mt-2">{stats.fallbackRate}%</h3>
            )}
          </div>
          <span className="text-[10px] text-[#5a5550] font-semibold">
            {stats.fallbackCount} redirects to email support
          </span>
        </div>

      </div>

      {/* 2. Recent Chat Activity & Shortcuts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Chats Feed Panel (Left 2 Columns) */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-[#5a5550]" />
              <h3 className="font-extrabold text-[#f5f0eb] text-sm">Recent Chat Activity Logs</h3>
            </div>
            <Link 
              href="/admin/conversations" 
              className="text-xs font-bold text-[#c9a87c] hover:text-[#c9a87c] hover:underline flex items-center space-x-1"
            >
              <span>View All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col space-y-2 py-3 border-b border-white/[0.04]">
                  <div className="h-4 w-1/3 bg-white/[0.03] rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-white/[0.03] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentChats.length === 0 ? (
            <div className="text-center py-10 text-[#5a5550] text-xs font-semibold">
              No conversations logged yet. Open the storefront chatbot to start chatting!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentChats.map((chat) => (
                <div key={chat.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5a5550]">
                      Session: {chat.session_id.substring(0, 12)}...
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      chat.is_fallback 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                    }`}>
                      {chat.is_fallback ? 'Fallback' : 'Success'}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]/50">
                    <p className="font-bold text-[#8a8580]">Q: <span className="font-medium text-[#8a8580]">{chat.user_message}</span></p>
                    <p className="font-bold text-[#c9a87c]">A: <span className="font-medium text-[#8a8580] truncate block">{chat.bot_response}</span></p>
                  </div>
                  
                  <span className="block text-[9px] text-[#5a5550] font-semibold text-right">
                    {new Date(chat.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Quick Shortcuts Panel (Right 1 Column) */}
        <div className="bg-[#141414] border border-white/[0.04] shadow-sm rounded-2xl p-6 h-fit space-y-5">
          <h3 className="font-extrabold text-[#f5f0eb] text-sm">System Shortcuts</h3>
          
          <div className="space-y-3.5">
            <Link 
              href="/admin/test" 
              className="block p-3 rounded-xl border border-white/[0.04] hover:border-[#c9a87c]/10 bg-white/[0.02] hover:bg-[#c9a87c]/5 transition-all font-semibold text-xs text-[#8a8580] flex items-center justify-between"
            >
              <span>Test Chatbot Playground</span>
              <span className="text-[#c9a87c] font-bold">Launch →</span>
            </Link>
            <Link 
              href="/admin/settings" 
              className="block p-3 rounded-xl border border-white/[0.04] hover:border-[#c9a87c]/10 bg-white/[0.02] hover:bg-[#c9a87c]/5 transition-all font-semibold text-xs text-[#8a8580] flex items-center justify-between"
            >
              <span>Configure Chatbot Settings</span>
              <span className="text-[#c9a87c] font-bold">Open →</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="block p-3 rounded-xl border border-white/[0.04] hover:border-[#c9a87c]/10 bg-white/[0.02] hover:bg-[#c9a87c]/5 transition-all font-semibold text-xs text-[#8a8580] flex items-center justify-between"
            >
              <span>Manage E-Commerce Orders</span>
              <span className="text-[#c9a87c] font-bold">Edit →</span>
            </Link>
          </div>

          <div className="p-4 bg-[#141414] text-white rounded-2xl space-y-2">
            <h4 className="font-black text-[10px] uppercase tracking-wider text-[#c9a87c]">Database Status</h4>
            <p className="text-[10px] text-[#5a5550] leading-normal font-medium">
              Your PostgreSQL pgvector database and Supabase Auth schemas are running. Direct queries to the Gemini-1.5-Flash model are encrypted and protected server-side.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
