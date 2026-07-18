'use client';

import { useState, useRef, useEffect } from 'react';
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
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';
import LazyVideo from '@/components/LazyVideo';

const R2_BASE = 'https://assets.kadamproduction.in';

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
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.66.986 3.292 1.48 4.961 1.482 5.378 0 9.752-4.343 9.756-9.684.002-2.587-1.002-5.02-2.827-6.848-1.825-1.829-4.254-2.836-6.845-2.837-5.38 0-9.755 4.342-9.759 9.685-.001 1.951.493 3.498 1.47 5.147L2.146 20.35l4.501-1.196zm10.741-6.1c-.29-.145-1.716-.848-1.982-.945-.266-.096-.459-.145-.653.145-.193.29-.749.945-.918 1.139-.169.194-.339.219-.629.073-.29-.145-1.226-.452-2.336-1.442-.864-.771-1.447-1.724-1.616-2.014-.169-.29-.018-.447.127-.591.131-.13.29-.339.436-.509.145-.17.193-.29.29-.484.097-.194.048-.363-.024-.509-.073-.145-.653-1.573-.895-2.153-.235-.568-.475-.489-.653-.498-.169-.008-.363-.01-.557-.01-.194 0-.508.073-.774.363-.266.29-1.016.992-1.016 2.42 0 1.428 1.039 2.808 1.184 3.002.145.194 2.043 3.12 4.95 4.378.692.299 1.232.478 1.652.612.695.221 1.329.19 1.829.115.557-.083 1.716-.702 1.958-1.38.242-.678.242-1.258.17-1.38-.072-.122-.266-.194-.557-.339z"/>
  </svg>
);

// 3 portrait Cloudinary videos (Task 1 vertical 9:16 layout) repeated to fill 9 grid cells
const defaultVideoSources = [
  `${R2_BASE}/videos/Trim-6.mp4`,
  `${R2_BASE}/videos/Trim-3-1.mp4`,
  `${R2_BASE}/videos/Trim-1.mp4`,
  `${R2_BASE}/videos/Untitled_design_2_pbfqf3.mp4`,
  `${R2_BASE}/videos/download_2_sispkn.mp4`,
  `${R2_BASE}/videos/Untitled_design_3_lw9eld.mp4`,
  `${R2_BASE}/videos/Trim-6.mp4`,
  `${R2_BASE}/videos/Trim-3-1.mp4`,
  `${R2_BASE}/videos/Trim-1.mp4`
];

const marqueeUpperText = [
  'WEDDINGS',
  'FESTIVALS',
  'CONCERTS',
  'CORPORATE',
  'ROAD SHOWS'
];

const marqueeLowerText = [
  'PRIVATE PARTIES',
  'STAGE SETUPS',
  'LIGHT SHOWS',
  'SOUND PRODUCTION',
  'EVENT MANAGEMENT'
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSources, setVideoSources] = useState<string[]>(defaultVideoSources);
  const { siteSettings } = useAuth();
  const whatsappUrl = `https://wa.me/91${siteSettings.phone_1}`;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [sectionVideoIdx, setSectionVideoIdx] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const isReady = videoLoaded && minTimeElapsed;

  // Intercept recovery tokens on client mount and redirect
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('type=recovery')) {
      router.push(`/admin/reset-password${window.location.hash}`);
    }
  }, [router]);

  const stagesSliderRef = useRef<HTMLDivElement>(null);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const scrollToStageSlide = (idx: number) => {
    setActiveStageIdx(idx);
    if (stagesSliderRef.current) {
      const slider = stagesSliderRef.current;
      const slideWidth = slider.scrollWidth / cylinderStats.length;
      slider.scrollTo({
        left: slideWidth * idx,
        behavior: 'smooth'
      });
    }
  };

  const handleStagesScroll = () => {
    if (!stagesSliderRef.current) return;
    const container = stagesSliderRef.current;
    const children = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    if (closestIndex !== activeStageIdx && closestIndex >= 0 && closestIndex < cylinderStats.length) {
      setActiveStageIdx(closestIndex);
    }
  };

  const handleStageVideoEnded = (idx: number) => {
    if (idx === activeStageIdx) {
      const nextIdx = (idx + 1) % cylinderStats.length;
      scrollToStageSlide(nextIdx);
    }
  };

  const [vibrantsItems, setVibrantsItems] = useState([
    { title: 'FESTIVALS', image: '/images/Untitled-design-20_sm7myc.png' },
    { title: 'CONCERT', image: '/images/Untitled-design-14_ogyqmd.png' },
    { title: 'WEDDING', image: '/images/Untitled-design-13.png' },
    { title: 'ROAD SHOWS', image: '/images/Untitled-design-32_atcfrs.png' },
    { title: 'UNIQUE EVENTS', image: '/images/Untitled-design-25_f2t475.png' }
  ]);

  const scrollVibrantsLeft = () => {
    setVibrantsItems((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
  };

  const scrollVibrantsRight = () => {
    setVibrantsItems((prev) => [...prev.slice(1), prev[0]]);
  };

  const vibrantsSliderRef = useRef<HTMLDivElement>(null);
  const [activeVibrantIdx, setActiveVibrantIdx] = useState(0);

  const scrollVibrantsMobile = (direction: 'left' | 'right') => {
    if (vibrantsSliderRef.current) {
      const slider = vibrantsSliderRef.current;
      const slideWidth = slider.clientWidth + 16; // width + gap
      const newIdx = direction === 'left' 
        ? Math.max(0, activeVibrantIdx - 1)
        : Math.min(vibrantsItems.length - 1, activeVibrantIdx + 1);
      
      setActiveVibrantIdx(newIdx);
      slider.scrollTo({
        left: slideWidth * newIdx,
        behavior: 'smooth'
      });
    }
  };

  const handleVibrantsScroll = () => {
    if (vibrantsSliderRef.current) {
      const slider = vibrantsSliderRef.current;
      const slideWidth = slider.clientWidth + 16;
      const scrollLeft = slider.scrollLeft;
      const newIdx = Math.round(scrollLeft / slideWidth);
      if (newIdx !== activeVibrantIdx && newIdx >= 0 && newIdx < vibrantsItems.length) {
        setActiveVibrantIdx(newIdx);
      }
    }
  };



  // Autoplay slider interval for Stages Section
  useEffect(() => {
    if (!isReady) return;
    const timer = setInterval(() => {
      const nextIdx = (activeStageIdx + 1) % cylinderStats.length;
      scrollToStageSlide(nextIdx);
    }, 6000); // 6 seconds auto scroll
    return () => clearInterval(timer);
  }, [activeStageIdx, isReady]);

  // Autoplay slider for Choose Our Vibrants Section (both mobile & desktop, every 3s)
  useEffect(() => {
    if (!isReady) return;
    const timer = setInterval(() => {
      if (window.innerWidth < 768) {
        if (vibrantsSliderRef.current) {
          const slider = vibrantsSliderRef.current;
          const slideWidth = slider.clientWidth + 16;
          const nextIdx = (activeVibrantIdx + 1) % vibrantsItems.length;
          setActiveVibrantIdx(nextIdx);
          slider.scrollTo({
            left: slideWidth * nextIdx,
            behavior: 'smooth'
          });
        }
      } else {
        scrollVibrantsRight();
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isReady, activeVibrantIdx, vibrantsItems.length]);

  // Fetch stage videos and vibrants from Vercel KV public endpoint on mount
  useEffect(() => {
    async function loadKVVideos() {
      try {
        const res = await fetch('/api/public/data');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const urls = data.videos.map((item: any) => {
            const url = item.video_url;
            return url.startsWith('/videos/') ? `${R2_BASE}${url}` : url;
          });
          while (urls.length < 3) {
            urls.push(defaultVideoSources[urls.length % defaultVideoSources.length]);
          }
          setVideoSources(urls);
        }
        if (data.vibrants && data.vibrants.length > 0) {
          const mapped = data.vibrants.map((item: any) => ({
            title: item.title,
            image: item.image_url
          }));
          setVibrantsItems(mapped);
        }
      } catch (err) {
        console.error('Failed to load stage videos/vibrants from R2:', err);
      }
    }
    loadKVVideos();
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Minimum display time for page loader logo (5 seconds)
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 5000);

    // Fallback maximum timeout (10 seconds) to prevent infinite loaders
    const fallbackTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 10000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);


  
  return (
    <>
      {/* 0-100% Page Loader */}
      {!loadingComplete && (
        <PageLoader onComplete={() => setLoadingComplete(true)} isReady={isReady} />
      )}

      {/* Top Navbar */}
      <SpotlightNavbar />

      {/* Main Home Page wrapper */}
      <div className="relative min-h-screen bg-black text-white select-none">
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen md:h-screen flex flex-col justify-center items-center overflow-hidden pt-16 pb-12 md:pt-0 md:pb-0">
          
          {/* Layer 1: Optimized Full Screen Background Video (Cloudinary vertical source) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
            <video 
              src={`${R2_BASE}/videos/upscaled-video_v3jizt.mp4`}
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
          </div>

          {/* Task 4: Social Icons stacked vertically on absolute LEFT side of hero section */}
          <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-30">
            {[
              { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/kadamproduction?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'WhatsApp', icon: WhatsAppIcon, href: whatsappUrl },
              { name: 'Email', icon: Mail, href: `mailto:${siteSettings.email}?body=Hi%20kadam%20Production%20` }
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Layer 3: Split Hero Content (Text Left, Lottie Right) */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-12 items-center pt-2 md:pt-0">
            
            {/* Right Side: Circular metallic logo Lottie player (First on mobile via order class) */}
            <div className="md:col-span-5 order-first md:order-last flex items-center justify-center relative w-full aspect-square max-w-[360px] xs:max-w-[400px] sm:max-w-[440px] lg:max-w-[560px] mx-auto">
              <div 
                dangerouslySetInnerHTML={{
                  __html: `<lottie-player src="/Logo.json" background="transparent" speed="1" style="width: 100%; height: 100%; will-change: transform; transform: translate3d(0,0,0); backface-visibility: hidden; -webkit-backface-visibility: hidden;" loop autoplay></lottie-player>`
                }}
                className="w-full h-full flex items-center justify-center"
              />
            </div>

            {/* Left Side: Headlines (Last on mobile, centered text) */}
            <div className="md:col-span-7 order-last md:order-first flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6 pt-0 -mt-3 md:pt-0 md:mt-0">
              {/* Extra spacing in between Gloock font headings */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider text-white uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  CREATING
                </h2>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider text-white uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  ATMOSPHERE
                </h2>
                <h2 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-normal tracking-wider text-white uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  NOT JUST EVENT
                </h2>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-semibold tracking-wide max-w-lg leading-relaxed select-text italic" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                &ldquo;We deliver high-energy DJ performances with premium sound and light, creating unforgettable experiences&rdquo;
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center md:justify-start items-center">
                <button 
                  onClick={() => router.push('/services')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#9E1C9E] hover:bg-[#831683] text-white rounded-full text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/15 transition-all duration-300"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  EXPLORE SERVICES
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => router.push('/gallery')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/40 rounded-full text-xs font-bold tracking-wider cursor-pointer transition-all"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  VIEW GALLERY
                </button>
              </div>
            </div>

          </div>

          {/* Scroll down indicator (hidden on mobile/tablet view) */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="hidden md:flex absolute bottom-8 flex flex-col items-center gap-1.5 text-zinc-550 text-[10px] tracking-[0.2em] font-extrabold uppercase pointer-events-none select-none"
          >
            <span>Scroll Down</span>
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          </motion.div>
        </section>

        {/* 1.3 SERVICES MARQUEE SECTION */}
        <section className="relative py-6 md:py-8 bg-[#030303] border-y border-white/5 overflow-hidden">
          {/* Row 1: Left to Right */}
          <div className="flex gap-5 animate-marquee whitespace-nowrap py-2">
            {marqueeUpperText.map((text, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center justify-center px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all duration-300"
              >
                <span 
                  className="text-xs md:text-sm font-bold tracking-wider text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {text}
                </span>
              </div>
            ))}
            {/* Duplicated row for loop */}
            {marqueeUpperText.map((text, idx) => (
              <div 
                key={`dup-${idx}`}
                className="inline-flex items-center justify-center px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5 transition-all duration-300"
              >
                <span 
                  className="text-xs md:text-sm font-bold tracking-wider text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Right to Left (Reverse direction) */}
          <div className="flex gap-5 animate-marquee-reverse whitespace-nowrap py-2 mt-4 opacity-70">
            {marqueeLowerText.map((text, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center justify-center px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5 transition-all duration-300"
              >
                <span 
                  className="text-xs md:text-sm font-bold tracking-wider text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {text}
                </span>
              </div>
            ))}
            {/* Duplicated row */}
            {marqueeLowerText.map((text, idx) => (
              <div 
                key={`dup-rev-${idx}`}
                className="inline-flex items-center justify-center px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm hover:border-[#EC4899]/30 hover:bg-[#EC4899]/5 transition-all duration-300"
              >
                <span 
                  className="text-xs md:text-sm font-bold tracking-wider text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 1.4 INTERACTIVE VIDEO GRID & CAROUSEL SECTION */}
        <section className="relative pt-10 pb-10 md:py-28 px-6 md:px-12 bg-black overflow-hidden flex flex-col items-center border-t border-white/5">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-550/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="text-center max-w-4xl space-y-3 mb-16">
            <h2 
              className="text-2xl sm:text-4xl md:text-5xl font-normal uppercase tracking-widest leading-normal"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <span className="text-white mr-3">OUR STAGES IN</span>
              <span className="text-white hero-heading pb-1">
                ACTION
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">A glance at our production footage</p>
          </div>

          {/* Universal Grid (Desktop View: 3-columns) */}
          <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto w-full relative z-20">
            {cylinderStats.map((stat, idx) => (
              <div 
                key={idx}
                className="relative w-full max-w-[340px] md:max-w-none mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 bg-black p-4 flex flex-col hover:border-purple-550/30 hover:shadow-[0_0_35px_rgba(139,92,246,0.15)] transition-all duration-500 shadow-2xl"
              >
                {/* Tall Video component with static mounting configuration to avoid autoplay block */}
                {videoSources[idx] ? (
                  <video 
                    src={videoSources[idx]}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    preload="metadata"
                    className="w-full aspect-[9/16] object-cover rounded-[1.8rem] md:rounded-[2.2rem]"
                  />
                ) : (
                  <div className="w-full aspect-[9/16] bg-zinc-950/40 rounded-[1.8rem] md:rounded-[2.2rem] animate-pulse flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-ping" />
                  </div>
                )}
                
                {/* Padded Content below the video */}
                <div className="flex-1 flex flex-col justify-between items-center text-center p-4 pt-6">
                  {/* Courier Prime Font description text */}
                  <p 
                    className="text-white font-bold uppercase tracking-wider text-xs sm:text-sm min-h-[48px] flex items-center justify-center"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {stat.description}
                  </p>
                  
                  {/* Dotted/Dashed Line Divider */}
                  <div className="w-full border-t border-dashed border-zinc-700/60 my-5" />

                  {/* Lora Font Stat label text */}
                  <span 
                    className="text-md sm:text-lg md:text-xl font-bold text-white tracking-wide uppercase"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {stat.number} {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet View (Horizontal auto-scrolling swipeable carousel) */}
          <div className="block md:hidden w-full relative z-20">
            <div 
              ref={stagesSliderRef}
              onScroll={handleStagesScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* Left padding spacer */}
              <div className="min-w-[4vw] flex-shrink-0" />

              {cylinderStats.map((stat, idx) => {
                const isActive = idx === activeStageIdx;
                return (
                  <div 
                    key={idx}
                    className="min-w-[88vw] snap-center relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black p-4 flex flex-col shadow-2xl"
                  >
                    {/* Tall Video component with static mounting configuration to avoid autoplay block */}
                    {videoSources[idx] && isActive ? (
                      <video 
                        id={`stage-video-${idx}`}
                        src={videoSources[idx]}
                        autoPlay
                        muted 
                        playsInline 
                        loop
                        preload="metadata"
                        className="w-full aspect-[9/16] object-cover rounded-[1.8rem]"
                      />
                    ) : (
                      <div className="w-full aspect-[9/16] bg-zinc-950/40 rounded-[1.8rem] animate-pulse flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-ping" />
                      </div>
                    )}
                    
                    {/* Padded Content below the video */}
                    <div className="flex-1 flex flex-col justify-between items-center text-center p-4 pt-6">
                      {/* Courier Prime Font description text */}
                      <p 
                        className="text-white font-bold uppercase tracking-wider text-xs min-h-[48px] flex items-center justify-center"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {stat.description}
                      </p>
                      
                      {/* Dotted/Dashed Line Divider */}
                      <div className="w-full border-t border-dashed border-zinc-700/60 my-5" />

                      {/* Lora Font Stat label text */}
                      <span 
                        className="text-md font-bold text-white tracking-wide uppercase"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {stat.number} {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Right padding spacer */}
              <div className="min-w-[4vw] flex-shrink-0" />
            </div>

            {/* Bullet indicators for slider progress */}
            <div className="flex justify-center gap-2 mt-4">
              {cylinderStats.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToStageSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeStageIdx ? 'bg-white w-6' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 1.5 OUR VIBRANTS SECTION (Task 3 Carousel Slider) */}
        <section className="relative pt-12 pb-20 md:py-28 px-6 md:px-12 bg-[#030303] overflow-hidden border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headings & Slide Controls */}
            <div className="lg:col-span-5 flex flex-col justify-between lg:h-full lg:py-6 space-y-4 lg:space-y-8 pb-4 lg:pb-0">
              <div className="space-y-4">
                <h2 
                  className="text-4xl md:text-6xl font-normal uppercase tracking-wider leading-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <span className="text-white block mb-2">CHOOSE</span>
                  <span className="text-white hero-heading block">
                    OUR VIBRANTS
                  </span>
                </h2>
                {/* White subtitle under heading */}
                <p className="text-sm md:text-base text-zinc-300 tracking-wide font-normal max-w-sm pt-2 leading-relaxed">
                  Discover our curated event categories tailored to deliver premium audio, stage setups, and visual experiences.
                </p>
              </div>

              {/* Slider Navigation circular arrow buttons (Desktop only) */}
              <div className="hidden md:flex gap-4">
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
              
              {/* Mobile Card Carousel (Swipeable, snapping) */}
              <div className="md:hidden w-full relative">
                <div 
                  ref={vibrantsSliderRef}
                  onScroll={handleVibrantsScroll}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full max-w-[280px] sm:max-w-[320px] mx-auto"
                >
                  {vibrantsItems.map((item) => (
                    <div 
                      key={item.title}
                      className="min-w-full snap-center rounded-3xl overflow-hidden relative border border-white/5 bg-zinc-950/40 shadow-lg group"
                    >
                      <div className="relative w-full aspect-[3/4]">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          sizes="(max-width: 640px) 100vw, 320px"
                          className="object-cover filter brightness-[0.7]"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <span 
                        className="absolute bottom-6 left-6 text-white font-normal tracking-widest text-sm uppercase" 
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Slider Controls (Shifted under the card, using mobile scroll helper) */}
              <div className="flex md:hidden justify-center gap-6 mt-4">
                <button 
                  onClick={() => scrollVibrantsMobile('left')}
                  className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollVibrantsMobile('right')}
                  className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Slider Container (Shows multiple cards side-by-side) */}
              <div className="hidden md:flex gap-6 overflow-hidden pb-6">
                {vibrantsItems.slice(0, 2).map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    layout
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="w-[calc(50%-12px)] aspect-[3/4] flex-shrink-0 rounded-3xl overflow-hidden relative border border-white/5 bg-zinc-950/40 shadow-lg group transition-all duration-500 hover:border-purple-500/20"
                  >
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      sizes="(max-width: 768px) 50vw, 320px"
                      className="object-cover filter brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span 
                      className="absolute bottom-6 left-6 text-white font-normal tracking-widest text-sm uppercase" 
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {item.title}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Description block aligned under the starting edge of the carousel */}
              <div className="flex justify-start pl-1">
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
        <section className="z-30 relative -mt-24 pt-4 pb-20 md:py-12 px-6 md:px-12 bg-[#0C0C0C] md:-mt-16 overflow-hidden flex flex-col items-center justify-center text-center">
          {/* Ambient colorful backdrop glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none hidden md:block" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none hidden md:block" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="block w-fit mx-auto"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 md:px-10 md:py-5 bg-[#9E1C9E] hover:bg-[#831683] text-white rounded-full text-xs md:text-sm font-bold tracking-widest uppercase cursor-pointer transition-all flex items-center gap-3 shadow-2xl shadow-purple-500/25 border border-white/10 duration-300"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                BOOK YOUR EVENT NOW
              </a>
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
