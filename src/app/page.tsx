'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Calendar, Sparkles, Volume2, 
  Music, Lightbulb, PartyPopper, Play, Clock, 
  Sliders, CalendarDays, Zap, Phone, Mail, MapPin, 
  ChevronDown, Film, Building2, Radio, ChevronLeft, ChevronRight
} from 'lucide-react';
import FlipText from '@/components/FlipText';
import CylinderCarousel from '@/components/CylinderCarousel';
import PageLoader from '@/components/PageLoader';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';

// Local social media SVG icons for task 4
const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const WhatsAppIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// 3 portrait Cloudinary videos (Task 1 vertical 9:16 layout) repeated to fill 9 grid cells
const videoSources = [
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012632/Trim-6.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012629/Trim-3-1.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012627/Trim-1.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012632/Trim-6.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012629/Trim-3-1.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012627/Trim-1.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012632/Trim-6.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012629/Trim-3-1.mp4',
  'https://res.cloudinary.com/zr9jqpwb/video/upload/v1783012627/Trim-1.mp4'
];

const marqueeServices = [
  { icon: Music, label: 'WEDDINGS', color: '#EC4899' },
  { icon: Sparkles, label: 'FESTIVALS', color: '#8B5CF6' },
  { icon: Volume2, label: 'CONCERTS', color: '#06B6D4' },
  { icon: Building2, label: 'CORPORATE', color: '#F97316' },
  { icon: PartyPopper, label: 'PRIVATE EVENTS', color: '#8B5CF6' },
  { icon: Radio, label: 'ROAD SHOWS', color: '#EC4899' }
];

const cylinderStats = [
  {
    number: '1000+',
    label: 'EVENTS COMPLETED',
    description: 'Turning moments into unforgettable celebrations',
    icon: Calendar,
    color: '#8B5CF6'
  },
  {
    number: '10+',
    label: 'YEARS OF EXPERIENCE',
    description: 'Music that connects hearts and moves feet',
    icon: Clock,
    color: '#EC4899'
  },
  {
    number: '500+',
    label: 'BARRAT ON WHEELS',
    description: 'Lights up, volume high, energy matched',
    icon: Volume2,
    color: '#06B6D4'
  },
  {
    number: '250+',
    label: 'ROAD SHOWS',
    description: 'High-energy music that moves every crowd',
    icon: MapPin,
    color: '#F97316'
  },
  {
    number: '100+',
    label: 'VENUES COVERED',
    description: "More than music, it's an experience",
    icon: Building2,
    color: '#8B5CF6'
  },
  {
    number: '50+',
    label: 'UNIQUE SETUPS',
    description: 'Turning sound into unforgettable moments',
    icon: Sliders,
    color: '#EC4899'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [sectionVideoIdx, setSectionVideoIdx] = useState(0);

  const vibrantsRef = useRef<HTMLDivElement>(null);

  const scrollVibrantsLeft = () => {
    if (vibrantsRef.current) {
      vibrantsRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollVibrantsRight = () => {
    if (vibrantsRef.current) {
      vibrantsRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };


  
  return (
    <>
      {/* 0-100% Page Loader */}
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Smooth Trailing Custom Cursor */}
      <CursorFollower />

      {/* Top Navbar */}
      <SpotlightNavbar />

      {/* Main Home Page wrapper */}
      <div className="relative min-h-screen bg-black text-white select-none">
        
        {/* HERO SECTION */}
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
          
          {/* Layer 1: Desktop/Tablet 3x3 Grid (9 videos, portrait aspect-ratio 9:16) */}
          <div className="hidden md:grid absolute inset-0 grid-cols-3 grid-rows-3 gap-[2px] opacity-40 select-none pointer-events-none">
            {videoSources.map((src, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.8 }}
                className="relative w-full h-full overflow-hidden aspect-[9/16]"
              >
                <video 
                  src={src} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover filter blur-[2px] brightness-[0.5]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10" />
              </motion.div>
            ))}
          </div>

          {/* Layer 1: Mobile Carousel (1 video at a time, aspect ratio 16:9, swipeable) */}
          <div className="md:hidden absolute inset-0 w-full h-full flex flex-col justify-center items-center opacity-40 select-none pointer-events-none">
            <div className="relative w-full aspect-video overflow-hidden">
              <video 
                key={currentVideoIdx}
                src={videoSources[currentVideoIdx]}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover filter blur-[2px] brightness-[0.5]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10" />
            </div>
            
            {/* Carousel navigation indicators */}
            <div className="absolute bottom-6 flex gap-2 pointer-events-auto z-30">
              {videoSources.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentVideoIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentVideoIdx === idx ? 'bg-purple-500 w-4' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Layer 2: Gradient Radial Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

          {/* Task 4: Social Icons stacked vertically on absolute right side of hero section */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
            {[
              { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
              { name: 'WhatsApp', icon: WhatsAppIcon, href: 'https://wa.me/919537330003' },
              { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
              { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' }
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center text-white hover:text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] border-purple-500/0 hover:border-purple-500/20 transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Layer 3: Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 pt-16">
            <FlipText 
              text="CREATING ATMOSPHERE NOT JUST EVENT" 
              className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none"
              delay={0.6}
            />

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="text-xs sm:text-sm md:text-base text-zinc-400 font-semibold tracking-wide max-w-2xl mx-auto leading-relaxed"
            >
              We deliver high-energy DJ performances with premium sound and light, creating unforgettable experiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <button 
                onClick={() => router.push('/services')}
                className="px-6 py-3.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9462ff] hover:to-[#ff58ad] text-white rounded-full text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/15"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                EXPLORE SERVICES
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => router.push('/gallery')}
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 rounded-full text-xs font-bold tracking-wider cursor-pointer transition-all"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                VIEW GALLERY
              </button>
            </motion.div>
          </div>

          {/* Scroll down indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-8 flex flex-col items-center gap-1.5 text-zinc-550 text-[10px] tracking-[0.2em] font-extrabold uppercase pointer-events-none select-none"
          >
            <span>Scroll Down</span>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </motion.div>
        </section>

        {/* 1.3 SERVICES MARQUEE SECTION */}
        <section className="relative py-8 bg-[#030303] border-y border-white/5 overflow-hidden">
          {/* Row 1: Left to Right */}
          <div className="flex gap-5 animate-marquee whitespace-nowrap py-2">
            {marqueeServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-2.5 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" style={{ color: service.color }} />
                  <span 
                    className="text-xs md:text-sm font-bold tracking-wider text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {service.label}
                  </span>
                </div>
              );
            })}
            {/* Duplicated row for loop */}
            {marqueeServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={`dup-${idx}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" style={{ color: service.color }} />
                  <span 
                    className="text-xs md:text-sm font-bold tracking-wider text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {service.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Row 2: Right to Left (Reverse direction) */}
          <div className="flex gap-5 animate-marquee-reverse whitespace-nowrap py-2 mt-4 opacity-70">
            {marqueeServices.slice().reverse().map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-2.5 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" style={{ color: service.color }} />
                  <span 
                    className="text-xs md:text-sm font-bold tracking-wider text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {service.label}
                  </span>
                </div>
              );
            })}
            {/* Duplicated row */}
            {marqueeServices.slice().reverse().map((service, idx) => {
              const Icon = service.icon;
              return (
                <div 
                  key={`dup-rev-${idx}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" style={{ color: service.color }} />
                  <span 
                    className="text-xs md:text-sm font-bold tracking-wider text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {service.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 1.4 INTERACTIVE VIDEO GRID & CAROUSEL SECTION */}
        <section className="relative py-28 px-6 md:px-12 bg-black overflow-hidden flex flex-col items-center border-t border-white/5">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-550/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="text-center max-w-xl space-y-3 mb-16">
            <FlipText 
              text="OUR STAGES IN ACTION" 
              className="text-3xl md:text-5xl font-black uppercase tracking-tight"
            />
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">A glance at our production footage</p>
          </div>

          {/* Desktop/Tablet 3x2 Grid (6 portrait video cards) */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative z-20">
            {cylinderStats.map((stat, idx) => (
              <div 
                key={idx}
                className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950/40 hover:border-purple-500/30 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500 flex flex-col h-[520px]"
              >
                {/* Top Video (takes up h-2/3) */}
                <div className="relative w-full h-[60%] overflow-hidden">
                  <video 
                    src={videoSources[idx]} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" />
                </div>

                {/* Bottom Panel (takes up h-1/3) */}
                <div className="p-6 flex-1 flex flex-col justify-between items-center text-center">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider min-h-[32px] flex items-center justify-center">
                    {stat.description}
                  </p>
                  
                  <div className="w-full border-t border-dashed border-zinc-800 my-4" />

                  <span className="text-3xl font-black text-white font-sans tracking-tight">
                    {stat.number}
                  </span>
                  
                  <span className="text-[10px] text-zinc-550 font-black uppercase tracking-widest mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swipeable Card Carousel (1 card at a time, 16:9 aspect-ratio video) */}
          <div className="md:hidden w-full flex flex-col items-center gap-6 relative z-20">
            <div 
              className="w-full max-w-[320px] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950/40 flex flex-col h-[500px]"
            >
              {/* Top Video (takes up h-2/3) */}
              <div className="relative w-full h-[60%] overflow-hidden">
                <video 
                  key={sectionVideoIdx}
                  src={videoSources[sectionVideoIdx]} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent pointer-events-none" />
              </div>

              {/* Bottom Panel */}
              <div className="p-6 flex-1 flex flex-col justify-between items-center text-center">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider min-h-[32px] flex items-center justify-center">
                  {cylinderStats[sectionVideoIdx].description}
                </p>
                
                <div className="w-full border-t border-dashed border-zinc-800 my-4" />
                
                <span className="text-3xl font-black text-white font-sans tracking-tight">
                  {cylinderStats[sectionVideoIdx].number}
                </span>
                
                <span className="text-[10px] text-zinc-550 font-black uppercase tracking-widest mt-1">
                  {cylinderStats[sectionVideoIdx].label}
                </span>
              </div>
            </div>
            
            {/* Dots */}
            <div className="flex gap-2">
              {cylinderStats.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSectionVideoIdx(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    sectionVideoIdx === idx ? 'bg-purple-500 w-4' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 1.5 OUR VIBRANTS SECTION (Task 3 Carousel Slider) */}
        <section className="relative py-28 px-6 md:px-12 bg-[#030303] overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headings & Slide Controls */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full py-6 space-y-8">
              <div className="space-y-2">
                <span className="text-3xl md:text-5xl font-extrabold tracking-widest text-zinc-650 uppercase block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  CHOOSE
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  OUR <br />
                  VIBRANTS
                </h2>
              </div>

              {/* Slider Navigation circular arrow buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={scrollVibrantsLeft}
                  className="w-12 h-12 rounded-full bg-black border border-white/10 hover:border-purple-550/40 flex items-center justify-center text-white hover:bg-purple-500/10 transition-all cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={scrollVibrantsRight}
                  className="w-12 h-12 rounded-full bg-black border border-white/10 hover:border-pink-555/40 flex items-center justify-center text-white hover:bg-pink-500/10 transition-all cursor-pointer shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Sliding image cards & Description block */}
            <div className="lg:col-span-7 space-y-8">
              <div 
                ref={vibrantsRef}
                className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
              >
                {[
                  { title: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80' },
                  { title: 'CONCERT', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80' },
                  { title: 'WEDDING', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80' },
                  { title: 'EVENTS', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80' },
                  { title: 'ROAD SHOWS', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="w-[260px] sm:w-[300px] aspect-[3/4] flex-shrink-0 snap-center rounded-3xl overflow-hidden relative border border-white/5 bg-zinc-950/40 shadow-lg group"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="absolute bottom-6 left-6 text-white font-black tracking-widest text-sm uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description block at the bottom right */}
              <div className="flex justify-end pr-4">
                <p className="text-xs md:text-sm text-zinc-400 font-semibold leading-relaxed max-w-md text-left">
                  Music isn&apos;t just played—it&apos;s experienced. We organize events that blend powerful sound, smooth transitions, and crowd-reading skills to create an electric atmosphere from start to finish.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Task 2: Sticky stacking Projects section */}
        <ProjectsSection />

        {/* 1.7 CALL TO ACTION (CTA) SECTION */}
        <section className="relative py-32 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Ambient colorful backdrop glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <h2 
              className="text-4xl md:text-7xl font-black uppercase tracking-tight leading-none text-white"
            >
              READY TO CREATE <br />
              <span className="gradient-text-accent">MAGIC?</span>
            </h2>
            
            <p className="text-sm md:text-base text-zinc-450 leading-relaxed max-w-xl mx-auto">
              Let&apos;s turn your event into an unforgettable experience with world-class sound, lighting design, lasers, and entertainment.
            </p>

            <motion.div
              initial={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="pt-4 block w-fit mx-auto"
            >
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9462ff] hover:to-[#ff58ad] text-white rounded-full text-sm font-bold tracking-widest uppercase cursor-pointer active:scale-98 transition-all flex items-center gap-2.5 shadow-xl shadow-purple-500/15"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <CalendarDays className="w-4.5 h-4.5" />
                BOOK YOUR EVENT NOW
              </button>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>

      {/* Tailwind marquee animation styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 45s linear infinite;
        }
      `}</style>
    </>
  );
}
