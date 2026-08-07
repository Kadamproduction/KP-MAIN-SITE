'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';

const LOGO_URL = '/admin-login-logo.png';

function sanitizeInput(val: string, type?: 'email' | 'password'): string {
  if (!val) return '';
  let clean = val
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '')
    .replace(/[\r\n\t]/g, '')
    .trim();

  if (type === 'email') {
    clean = clean.replace(/^(username|email|user)\s*:\s*/i, '');
  } else if (type === 'password') {
    clean = clean.replace(/^(password|pass)\s*:\s*/i, '');
  }

  clean = clean.trim();

  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }

  return clean.replace(/^[\s\u00A0\u2000-\u200F\u2028\u2029\u202F\u205F\u3000\uFEFF]+|[\s\u00A0\u2000-\u200F\u2028\u2029\u202F\u205F\u3000\uFEFF]+$/g, '');
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(sanitizeInput(e.clipboardData.getData('text'), 'email'));
  };

  const handlePasswordPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(sanitizeInput(e.clipboardData.getData('text'), 'password'));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sanitizeInput(email, 'email'),
          password: sanitizeInput(password, 'password'),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid login credentials. Please try again.');
      }

      login(data.token, data.user);
      router.push('/admin');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sanitizeInput(newPassword, 'password') !== sanitizeInput(confirmPassword, 'password')) {
      setForgotError('Passwords do not match.');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(false);

    try {
      const res = await fetch('/api/auth/recovery-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recoveryKey: sanitizeInput(recoveryKey, 'email'),
          newPassword: sanitizeInput(newPassword, 'password'),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }
      setForgotSuccess(true);
    } catch (err: unknown) {
      setForgotError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 overflow-hidden">
      {/* Card colour matches page background */}
      <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-white/10 px-7 py-9 sm:px-10 sm:py-10 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="logo-pulse mb-1.5">
            <img
              src={LOGO_URL}
              alt="Kadam Production Logo"
              className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
              width={160}
              height={160}
            />
          </div>
          <h1 className="text-[22px] sm:text-2xl font-bold tracking-wide text-white uppercase leading-tight">
            KADAM PRODUCTION
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-left">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <input
              type="text"
              required
              autoComplete="username"
              onPaste={handleEmailPaste}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-white/10 bg-black/40 px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                onPaste={handlePasswordPaste}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-white/10 bg-black/40 px-3.5 pr-11 text-sm text-white placeholder:text-zinc-500 focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full h-11 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-sm font-bold uppercase tracking-wider text-white hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setForgotSuccess(false);
              setForgotError(null);
              setRecoveryKey('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            className="hover:text-white transition cursor-pointer"
          >
            Forgot password?
          </button>
          <span className="text-zinc-500">Admin console</span>
        </div>
      </div>

      <p className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-zinc-500">
        © {new Date().getFullYear()} Kadam Production / Powered by Trishulhub
      </p>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-zinc-300" />
            </button>

            <div className="space-y-1 pr-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Reset Password</h3>
              <p className="text-xs text-zinc-400">
                Enter your Master Recovery Key to set a new admin password.
              </p>
            </div>

            {forgotError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{forgotError}</p>
              </div>
            )}

            {forgotSuccess ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                <h4 className="font-bold text-sm text-white">Password Reset Successful</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your admin password has been updated. You can now log in with your new password.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 w-full h-10 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-xs font-bold text-white uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Master Recovery Key</label>
                  <input
                    type="text"
                    required
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-black/40 px-3.5 text-sm text-white focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-black/40 px-3.5 text-sm text-white focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border border-white/10 bg-black/40 px-3.5 text-sm text-white focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 cursor-pointer"
                >
                  {forgotLoading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
