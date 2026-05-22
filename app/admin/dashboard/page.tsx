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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Monitor your customer support chatbot performance, database volume, and recent chat transcripts.
        </p>
      </div>

      {/* 1. KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Conversations */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Inquiries</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{stats.conversationsCount}</h3>
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-green-500">Live</span>
            <span>inquiries logged</span>
          </span>
        </div>

        {/* Total FAQs */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active FAQs</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{stats.faqsCount}</h3>
            )}
          </div>
          <Link href="/admin/faqs" className="text-[10px] text-indigo-500 font-bold hover:underline">
            Manage FAQs →
          </Link>
        </div>

        {/* Knowledge Articles */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KB Coverage</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{stats.kbCount}</h3>
            )}
          </div>
          <Link href="/admin/knowledge-base" className="text-[10px] text-indigo-500 font-bold hover:underline">
            Manage Articles →
          </Link>
        </div>

        {/* Fallback Rate */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-32">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Fallback Rate</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 animate-pulse rounded mt-2" />
            ) : (
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{stats.fallbackRate}%</h3>
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">
            {stats.fallbackCount} redirects to email support
          </span>
        </div>

      </div>

      {/* 2. Recent Chat Activity & Shortcuts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Chats Feed Panel (Left 2 Columns) */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-500" />
              <h3 className="font-extrabold text-gray-800 text-sm">Recent Chat Activity Logs</h3>
            </div>
            <Link 
              href="/admin/conversations" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center space-x-1"
            >
              <span>View All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col space-y-2 py-3 border-b border-gray-100">
                  <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentChats.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs font-semibold">
              No conversations logged yet. Open the storefront chatbot to start chatting!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentChats.map((chat) => (
                <div key={chat.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400">
                      Session: {chat.session_id.substring(0, 12)}...
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      chat.is_fallback 
                        ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {chat.is_fallback ? 'Fallback' : 'Success'}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1 bg-gray-50 rounded-xl p-3 border border-gray-100/50">
                    <p className="font-bold text-gray-700">Q: <span className="font-medium text-gray-600">{chat.user_message}</span></p>
                    <p className="font-bold text-indigo-600">A: <span className="font-medium text-gray-600 truncate block">{chat.bot_response}</span></p>
                  </div>
                  
                  <span className="block text-[9px] text-gray-400 font-semibold text-right">
                    {new Date(chat.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Quick Shortcuts Panel (Right 1 Column) */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 h-fit space-y-5">
          <h3 className="font-extrabold text-gray-800 text-sm">System Shortcuts</h3>
          
          <div className="space-y-3.5">
            <Link 
              href="/admin/test" 
              className="block p-3 rounded-xl border border-gray-100 hover:border-indigo-100 bg-gray-50/50 hover:bg-indigo-50/10 transition-all font-semibold text-xs text-gray-700 flex items-center justify-between"
            >
              <span>Test Chatbot Playground</span>
              <span className="text-indigo-600 font-bold">Launch →</span>
            </Link>
            <Link 
              href="/admin/settings" 
              className="block p-3 rounded-xl border border-gray-100 hover:border-indigo-100 bg-gray-50/50 hover:bg-indigo-50/10 transition-all font-semibold text-xs text-gray-700 flex items-center justify-between"
            >
              <span>Configure Chatbot Settings</span>
              <span className="text-indigo-600 font-bold">Open →</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="block p-3 rounded-xl border border-gray-100 hover:border-indigo-100 bg-gray-50/50 hover:bg-indigo-50/10 transition-all font-semibold text-xs text-gray-700 flex items-center justify-between"
            >
              <span>Manage E-Commerce Orders</span>
              <span className="text-indigo-600 font-bold">Edit →</span>
            </Link>
          </div>

          <div className="p-4 bg-zinc-900 text-white rounded-2xl space-y-2">
            <h4 className="font-black text-[10px] uppercase tracking-wider text-indigo-400">Database Status</h4>
            <p className="text-[10px] text-zinc-400 leading-normal font-medium">
              Your PostgreSQL pgvector database and Supabase Auth schemas are running. Direct queries to the Gemini-1.5-Flash model are encrypted and protected server-side.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
