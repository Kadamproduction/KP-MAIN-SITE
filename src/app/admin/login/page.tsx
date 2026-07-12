'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, KeyRound, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Auth loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tab state for toggle (login vs forgot password)
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const data = await supabase.auth.signInWithPassword(email, password);
      login(data.access_token, data.user);
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Direct REST API POST call to Supabase password reset endpoint
      const response = await fetch(`https://vrwhhajqjsrkripwalfp.supabase.co/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_Hm8_WV0IqLb1BBVjE-jYpQ_Ij8vnBDI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || errorData.error_description || 'Reset failed');
      }

      setSuccessMsg('Password reset link sent! Check your email inbox.');
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset link. Ensure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-space-grotesk flex items-center justify-center p-4 selection:bg-[#8B5CF6]/30 overflow-hidden">
      
      {/* Background visual neon nodes */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic card wrapper */}
      <div className="relative w-full max-w-[450px] rounded-3xl border border-white/10 bg-zinc-950/60 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10 transition-all duration-300">
        
        {/* Logo and brand name */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] p-0.5 shadow-lg shadow-[#8B5CF6]/20 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-[#8B5CF6]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            KADAM PRODUCTION
          </h1>
          <p className="text-xs text-zinc-450 tracking-widest mt-1 uppercase">
            Admin Console Portal
          </p>
        </div>

        {/* Display Alert banners */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form tab */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="admin@kadamproduction.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-[#8B5CF6] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] font-bold text-white text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Forgot Password reset tab */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <p className="text-sm text-zinc-400 mb-2 leading-relaxed">
              Enter your admin email address below. We will send a secure link to reset your account password.
            </p>

            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                Registered Email
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="admin@kadamproduction.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition-colors duration-200"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Send Recovery Email
                    <KeyRound className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-sm text-zinc-500 hover:text-white transition-colors py-2 text-center"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
