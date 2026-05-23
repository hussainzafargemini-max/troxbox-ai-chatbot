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

  useEffect(() => {
    async function checkActiveSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) router.push(redirectPath);
    }
    checkActiveSession();
  }, [router, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
      if (error) throw error;
      if (data?.session) {
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
        router.push(redirectPath);
        router.refresh();
      } else throw new Error('Authentication returned an empty session.');
    } catch (err: any) {
      console.error('Login failed:', err);
      setErrorMsg(err?.message || 'Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(201,168,124,0.04),transparent)]" />
      <div className="w-full max-w-md rounded-2xl border border-white/[0.04] bg-[#141414]/[0.02] backdrop-blur-sm p-8 space-y-6 relative">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none">
            <span className="text-2xl font-bold tracking-[-0.06em] text-[#c9a87c] bg-[#c9a87c]/10 px-3 py-1 rounded-xl">TB</span>
          </Link>
          <h1 className="text-xl font-bold tracking-[-0.02em] text-[#f5f0eb] mt-4">Console Login</h1>
          <p className="text-[11px] text-[#5a5550]">Sign in to access the AI support control center.</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl border border-red-500/10 bg-red-500/100/5 flex items-start gap-2 text-[11px] text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#5a5550] block ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5550]" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@troxbox.com" disabled={loading}
                className="w-full bg-[#141414]/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f5f0eb] placeholder-[#5a5550] focus:outline-none focus:border-[#c9a87c]/40 disabled:opacity-50 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#5a5550] block ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5550]" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" disabled={loading}
                className="w-full bg-[#141414]/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f5f0eb] placeholder-[#5a5550] focus:outline-none focus:border-[#c9a87c]/40 disabled:opacity-50 transition-all" />
            </div>
          </div>
          <button type="submit" disabled={loading || !email.trim() || !password.trim()}
            className="btn-luxury w-full bg-[#c9a87c] text-[#0a0a0a] font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 disabled:hover:transform-none flex items-center justify-center gap-2 mt-2 focus:outline-none">
            {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Authenticating...</span></>) : <span>Sign In</span>}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-[10px] text-[#c9a87c] hover:text-[#e0c9a6] font-semibold tracking-[0.05em]">
            ← Return to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/[0.04] bg-[#141414]/[0.02] p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#c9a87c] animate-spin" />
          <p className="text-[10px] text-[#5a5550]">Loading...</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
