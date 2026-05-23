'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, HelpCircle, BookOpen, Settings, History,
  ShoppingBag, Play, LogOut, UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'FAQ Manager', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Knowledge Base', path: '/admin/knowledge-base', icon: BookOpen },
    { name: 'Chatbot Settings', path: '/admin/settings', icon: Settings },
    { name: 'Conversation Logs', path: '/admin/conversations', icon: History },
    { name: 'Sample Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Test Chatbot', path: '/admin/test', icon: Play },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0a0a0a] flex flex-col">{children}</div>;
  }

  return (
    <div className="admin-panel min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/[0.04] shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/[0.04] justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-[#c9a87c] bg-[#c9a87c]/10 px-2 py-0.5 rounded-md tracking-[-0.04em]">TB</span>
            <span className="font-bold text-[11px] tracking-[0.15em] uppercase text-[#f5f0eb]">Trox Box</span>
          </Link>
          <span className="text-[8px] font-bold uppercase text-[#c9a87c] border border-[#c9a87c]/20 px-1.5 py-0.5 rounded tracking-[0.1em]">
            Console
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all group focus:outline-none ${
                  isActive
                    ? 'bg-[#c9a87c]/10 text-[#c9a87c] border border-[#c9a87c]/10'
                    : 'text-[#5a5550] hover:text-[#8a8580] hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c9a87c]' : 'text-[#5a5550] group-hover:text-[#8a8580]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.04] space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="p-1.5 bg-[#c9a87c]/10 text-[#c9a87c] rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="block text-[10px] font-semibold text-[#8a8580] leading-none">Console Admin</span>
              <span className="text-[9px] text-[#5a5550] truncate block mt-0.5">active@trox.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-red-500/5 hover:text-red-400 border border-white/[0.04] rounded-xl text-[10px] font-bold tracking-[0.1em] uppercase text-[#5a5550] transition-all focus:outline-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="font-bold text-sm text-[#f5f0eb] tracking-tight flex items-center gap-2 lg:hidden">
              <span className="bg-[#c9a87c]/10 text-[#c9a87c] px-1.5 py-0.5 rounded text-[10px] font-bold">TB</span>
              <span>Console</span>
            </h2>
            <span className="hidden lg:block text-[11px] text-[#5a5550]">
              All systems operational. Background services running.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#c9a87c] hover:text-[#e0c9a6] flex items-center gap-1">
              <span>Storefront</span>
              <span>→</span>
            </Link>
            <button onClick={handleLogout} className="lg:hidden text-[#5a5550] hover:text-red-400 focus:outline-none">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
