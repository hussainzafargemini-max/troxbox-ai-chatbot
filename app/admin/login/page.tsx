'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-redirect if already signed in on mount
  useEffect(() => {
    async function checkActiveSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push(redirectPath);
      }
    }
    checkActiveSession();
  }, [router, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        const { session } = data;
        
        // Save the access token securely in standard Lax/Secure cookie so Next.js middleware can read it
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;

        // Redirect admin to target dashboard page
        router.push(redirectPath);
        router.refresh();
      } else {
        throw new Error('Authentication returned an empty session. Please try again.');
      }
    } catch (err: any) {
      console.error('Login authentication failed:', err);
      setErrorMsg(err?.message || 'Invalid email or password. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6 bg-gradient-to-br from-zinc-50 to-zinc-100/50">
      
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 space-y-6 relative overflow-hidden">
        
        {/* Subtle decorative color dot */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block focus:outline-none">
            <span className="text-2xl font-black tracking-tighter text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">TB</span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 mt-4">Console Login</h1>
          <p className="text-xs text-gray-400 font-medium">
            Sign in to access your e-commerce AI support control center.
          </p>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-2.5 text-xs text-red-600 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@troxbox.com"
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none disabled:opacity-50 text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none disabled:opacity-50 text-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 transition-all flex items-center justify-center space-x-2 focus:outline-none mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>

        </form>

        {/* Return to shop link */}
        <div className="text-center pt-2">
          <Link 
            href="/" 
            className="text-xs text-indigo-500 hover:text-indigo-600 hover:underline font-bold"
          >
            ← Return to public storefront
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-20 px-6 bg-gradient-to-br from-zinc-50 to-zinc-100/50">
        <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 space-y-6 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-gray-400 font-bold">Loading authorization portal...</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}

