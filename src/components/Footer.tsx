'use client';

import Link from 'next/link';
import { 
  Film, Phone, Mail, MapPin, Clock, ArrowUpRight 
} from 'lucide-react';

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
    { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const servicesLinks = [
    { label: 'Weddings', href: '/services' },
    { label: 'Festivals', href: '/services' },
    { label: 'Concerts', href: '/services' },
    { label: 'Corporate Events', href: '/services' },
    { label: 'Road Shows', href: '/services' },
  ];

  return (
    <footer className="relative z-20 bg-[#020202] border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Description */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center border border-purple-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-md font-black tracking-tight text-white">KADAM PRODUCTION</h4>
              <span className="text-[8px] text-[#A1A1AA] font-bold tracking-[0.2em] uppercase">Atmosphere & Lights</span>
            </div>
          </Link>
          
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            Creating unforgettable atmospheres, not just events. Premium sound, lighting design, lasers, and professional DJ production since 2014.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((soc) => {
              const Icon = soc.icon;
              return (
                <a 
                  key={soc.name}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Quick Navigation</h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  className="text-xs text-zinc-550 hover:text-white transition-colors flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Our Services</h4>
          <ul className="space-y-3">
            {servicesLinks.map((link) => (
              <li key={link.label}>
                <Link 
                  href={link.href}
                  className="text-xs text-zinc-550 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Contact Info</h4>
          <ul className="space-y-4 text-xs">
            <li className="flex gap-3 text-zinc-400">
              <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <div>
                <a href="tel:+919537330003" className="hover:text-white transition-all block font-semibold">+91 9537330003</a>
                <a href="tel:+918866655651" className="hover:text-white transition-all block text-zinc-500 mt-1">+91 8866655651</a>
              </div>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <a href="mailto:kadamproduction123@gmail.com" className="hover:text-white transition-all block">
                kadamproduction123@gmail.com
              </a>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <span>Gujarat, India</span>
            </li>
            <li className="flex gap-3 text-zinc-400">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span>Available 24/7 for Events</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <p className="text-[10px] text-zinc-650">
          © {currentYear} Kadam Production. All rights reserved.
        </p>
        <p className="text-[10px] text-zinc-650 flex items-center gap-1">
          Designed with ❤️ by <span className="text-zinc-400 font-bold uppercase">Kadam Production Agency</span>
        </p>
      </div>
    </footer>
  );
}
