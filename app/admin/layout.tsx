'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  HelpCircle, 
  BookOpen, 
  Settings, 
  History, 
  ShoppingBag, 
  Play, 
  LogOut,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Logout handler to clear session cookies and client tokens
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear cookie by setting past expiry date
      document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax; Secure';
      
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 1. Bare template for admin login screen
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50 flex flex-col">{children}</div>;
  }

  // 2. Full frame dashboard layout with Sidebar navigation
  return (
    <div className="min-h-screen flex bg-gray-50/50">
      
      {/* Permanent Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 text-white shrink-0">
        
        {/* Sidebar Header Brand */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-900 justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="text-sm font-black tracking-tighter text-white bg-indigo-600 px-2 py-0.5 rounded">TB</span>
            <span className="font-extrabold text-sm tracking-tight text-white uppercase">TROX BOX</span>
          </Link>
          <span className="text-[9px] font-black uppercase text-indigo-400 border border-indigo-400/25 px-1.5 py-0.5 rounded tracking-wide">
            Console
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group focus:outline-none ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Admin Footer profile */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/60 space-y-3">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="p-1.5 bg-indigo-900/40 text-indigo-400 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="block text-[10px] font-bold text-zinc-300 leading-none">Console Administrator</span>
              <span className="text-[9px] text-zinc-500 font-semibold truncate block mt-0.5">active_session@trox.com</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-zinc-900 hover:bg-red-950/20 hover:text-red-400 border border-zinc-900 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all focus:outline-none"
            title="Log out from console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header (Top Navigation Panel) */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="font-extrabold text-sm text-gray-800 tracking-tight flex items-center space-x-2 lg:hidden">
              <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">TB</span>
              <span>Console Administrator</span>
            </h2>
            <span className="hidden lg:block text-xs font-semibold text-gray-400">
              Welcome back. All background e-commerce systems are online.
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center space-x-1"
            >
              <span>View Storefront</span>
              <span>→</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="lg:hidden text-gray-500 hover:text-red-500 focus:outline-none"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Sub-page Render Box */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
