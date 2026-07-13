'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, KeyRound, AlertTriangle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parse authorization token from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
      } else {
        setErrorMsg('Authorization token could not be parsed from URL link.');
      }
    } else {
      setErrorMsg('No verification details found in the URL. Access denied.');
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setErrorMsg('Access token missing or expired. Please trigger a new request from your settings page.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('https://vrwhhajqjsrkripwalfp.supabase.co/auth/v1/user', {
        method: 'PUT',
        headers: {
          'apikey': 'sb_publishable_Hm8_WV0IqLb1BBVjE-jYpQ_Ij8vnBDI',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: newPassword,
          data: {
            username: newUsername
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || errorData.error_description || 'Update failed');
      }

      setSuccessMsg('Username and Password successfully updated!');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while updating credentials.');
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
      <div className="relative w-full max-w-[450px] rounded-3xl border border-white/10 bg-zinc-950/60 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10">
        
        {/* Logo and title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] p-0.5 shadow-lg shadow-[#8B5CF6]/20 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#8B5CF6]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            RESET CREDENTIALS
          </h1>
          <p className="text-xs text-zinc-450 tracking-widest mt-1 uppercase">
            Update Admin Username & Password
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleReset} className="space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              New Admin Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
              <input 
                type="text"
                required
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-650 focus:border-[#8B5CF6] focus:outline-none transition duration-200"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !accessToken}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-sm font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition duration-255 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Credentials...
              </>
            ) : (
              <>
                Save Credentials
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
