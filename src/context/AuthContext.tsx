'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, SupabaseUser } from '@/utils/supabase';

interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: SupabaseUser) => void;
  logout: () => void;
  siteSettings: SiteSettings;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    email: 'kadamproduction123@gmail.com',
    phone_1: '9537330003',
    phone_2: '8866655651'
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await supabase.from('site_settings').select('id', 'asc');
        if (data && data.length > 0) {
          setSiteSettings({
            email: data[0].email,
            phone_1: data[0].phone_1,
            phone_2: data[0].phone_2
          });
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }

      try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('admin_token='));
        if (tokenCookie) {
          const val = tokenCookie.split('=')[1];
          if (val) {
            const verifiedUser = await supabase.auth.getUser(val);
            if (verifiedUser) {
              setToken(val);
              setUser(verifiedUser);
            } else {
              // Delete expired cookie
              document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
          }
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = (newToken: string, newUser: SupabaseUser) => {
    setToken(newToken);
    setUser(newUser);
    document.cookie = `admin_token=${newToken}; path=/; SameSite=Strict; Secure`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, siteSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
