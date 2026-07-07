'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Zap, Home, Image, Users, Mail } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/', icon: Home },
  { label: 'SERVICES', href: '/services', icon: Zap },
  { label: 'GALLERY', href: '/gallery', icon: Image },
  { label: 'ABOUT', href: '/about', icon: Users },
  { label: 'CONTACT', href: '/contact', icon: Mail },
];

export default function SpotlightNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navbarRef = useRef<HTMLDivElement>(null);
  
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div 
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/8 z-50 px-6 md:px-12 flex items-center justify-between transition-all duration-300"
      >

        {/* Brand Left Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-50 group cursor-pointer">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-lg shadow-purple-500/25 border border-purple-500/25 group-hover:scale-105 transition-all select-none"
          >
            <span className="text-xl md:text-2xl font-black text-white font-mono">K</span>
          </motion.div>
          <div>
            <h1 className="text-sm md:text-md font-black tracking-tight text-white select-none">
              KADAM PRODUCTION
            </h1>
            <span className="text-[8px] md:text-[9px] text-[#A1A1AA] font-bold tracking-[0.2em] uppercase select-none">
              Atmosphere & Lights
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 relative z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label}
                href={item.href}
                className="relative px-3 py-2 text-xs font-medium tracking-[0.1em] uppercase text-zinc-400 hover:text-white transition-all cursor-pointer group"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Glow underline animation */}
                {isActive ? (
                  <motion.div 
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                ) : (
                  <div className="absolute bottom-0 left-1/2 right-1/2 h-[2px] bg-purple-500/50 group-hover:left-0 group-hover:right-0 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button (Desktop) */}
        <div className="hidden md:flex items-center relative z-50">
          <button
            onClick={() => router.push('/contact')}
            className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9462ff] hover:to-[#ff58ad] text-white rounded-full text-xs font-bold tracking-wider active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            BOOK NOW
          </button>
        </div>

        {/* Mobile Hamburger menu */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl bg-white/3 border border-white/5 text-zinc-400 hover:text-white cursor-pointer relative z-50"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 bg-[#000000]/98 backdrop-blur-3xl z-40 md:hidden flex flex-col justify-center px-8"
          >
            <div className="space-y-8 flex flex-col">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 text-2xl font-black tracking-widest uppercase cursor-pointer ${
                        isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                      }`}
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-purple-500' : 'text-zinc-600'}`} />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.08 }}
                className="pt-6 border-t border-white/5"
              >
                <button
                  onClick={() => { setMobileOpen(false); router.push('/contact'); }}
                  className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-2xl text-md font-bold tracking-widest uppercase cursor-pointer active:scale-98 transition-all"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  BOOK NOW
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
