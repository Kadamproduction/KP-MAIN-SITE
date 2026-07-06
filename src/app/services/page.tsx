'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Music, Volume2, Lightbulb, Sliders, 
  Sparkles, Calendar, Check, ArrowRight 
} from 'lucide-react';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

const servicesData = [
  {
    id: 1,
    title: 'DJ SERVICES',
    subtitle: 'Premium DJ Performances',
    description: 'High-energy DJ sets tailored to your event, featuring the latest hits and timeless classics.',
    icon: Music,
    color: '#8B5CF6',
    features: [
      'Professional DJ Equipment',
      'Custom Music Playlists',
      'Live Mixing & Remixing',
      'MC Services Available',
      'All Music Genres'
    ],
    image: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'SOUND SYSTEM',
    subtitle: 'World-Class Audio',
    description: 'Crystal-clear sound systems designed for venues of any size, from intimate gatherings to massive festivals.',
    icon: Volume2,
    color: '#EC4899',
    features: [
      'Line Array Speakers',
      'Subwoofer Systems',
      'Wireless Microphones',
      'Sound Engineering',
      'Backup Equipment'
    ],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'LIGHTING DESIGN',
    subtitle: 'Immersive Visual Experience',
    description: 'State-of-the-art lighting setups that transform any venue into a visual spectacle.',
    icon: Lightbulb,
    color: '#06B6D4',
    features: [
      'Intelligent Moving Heads',
      'LED Par Lights',
      'Laser Shows',
      'Fog & Haze Machines',
      'Custom Lighting Programs'
    ],
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'STAGE SETUP',
    subtitle: 'Professional Stage Design',
    description: 'Complete stage construction and design for concerts, weddings, and corporate events.',
    icon: Sliders,
    color: '#F97316',
    features: [
      'Modular Stage Platforms',
      'Truss Systems',
      'LED Video Walls',
      'Backdrop Design',
      'Safety Compliance'
    ],
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'SFX & PYROTECHNICS',
    subtitle: 'Special Effects',
    description: 'Add wow factor with professional special effects including CO2 jets, confetti, and pyrotechnics.',
    icon: Sparkles,
    color: '#8B5CF6',
    features: [
      'CO2 Jet Machines',
      'Confetti Cannons',
      'Cold Spark Machines',
      'Fog Effects',
      'Licensed Pyrotechnics'
    ],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'EVENT MANAGEMENT',
    subtitle: 'End-to-End Planning',
    description: 'Complete event planning and coordination services to ensure seamless execution.',
    icon: Calendar,
    color: '#EC4899',
    features: [
      'Event Planning',
      'Vendor Coordination',
      'Timeline Management',
      'On-site Supervision',
      'Contingency Planning'
    ],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
  }
];

export default function ServicesPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render organic sound wave flowing animation on canvas for premium visual effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 360;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      
      // Draw 3 overlapping waves with different colors, phase shifts, and amplitudes
      const waves = [
        { color: 'rgba(139, 92, 246, 0.15)', amp: 55, freq: 0.003, speed: 0.04 },
        { color: 'rgba(236, 72, 153, 0.12)', amp: 45, freq: 0.005, speed: 0.03 },
        { color: 'rgba(6, 182, 212, 0.10)', amp: 35, freq: 0.004, speed: 0.05 }
      ];

      waves.forEach((w) => {
        ctx.strokeStyle = w.color;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * w.freq + phase) * w.amp * Math.sin(x / 400);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });

      phase += 0.02;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-black text-white pt-24 select-none">
        
        {/* HERO BANNER SECTION */}
        <section className="relative h-[360px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-purple-950/10 via-black to-black">
          {/* Wave visualizer */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Titles */}
          <div className="relative z-10 text-center space-y-3 px-6">
            <FlipText 
              text="OUR SERVICES" 
              className="text-4xl md:text-6xl font-black uppercase tracking-tight"
            />
            <p className="text-xs sm:text-sm text-zinc-500 font-semibold tracking-[0.2em] uppercase">
              Everything you need for an unforgettable event
            </p>
          </div>
        </section>

        {/* SERVICES INTERACTIVE CARDS GRID */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                  className="group relative rounded-3xl overflow-hidden bg-zinc-900/40 border border-white/5 flex flex-col justify-between"
                  style={{
                    boxShadow: `0 0 30px ${service.color}05, inset 0 0 30px ${service.color}03`
                  }}
                >
                  {/* Thumbnail area */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Floating Icon badge */}
                    <div 
                      className="absolute top-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center border"
                      style={{
                        background: `${service.color}15`,
                        borderColor: `${service.color}35`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Icon className="w-6 h-6 animate-pulse" style={{ color: service.color }} />
                    </div>
                  </div>

                  {/* Text Contents */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {service.title}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: service.color }}>
                        {service.subtitle}
                      </p>
                      
                      <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-semibold">
                        {service.description}
                      </p>

                      {/* Checklist */}
                      <ul className="mt-6 space-y-2.5">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-3 text-xs text-zinc-300">
                            <div 
                              className="w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0"
                              style={{ borderColor: `${service.color}30`, background: `${service.color}08` }}
                            >
                              <Check className="w-3 h-3" style={{ color: service.color }} />
                            </div>
                            <span className="font-semibold">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learn More Button */}
                    <div className="pt-8">
                      <button 
                        onClick={() => router.push('/contact')}
                        className="w-full py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all border"
                        style={{
                          background: `${service.color}15`,
                          borderColor: `${service.color}30`,
                          color: '#FFFFFF'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${service.color}30`;
                          e.currentTarget.style.borderColor = `${service.color}50`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${service.color}15`;
                          e.currentTarget.style.borderColor = `${service.color}30`;
                        }}
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Background overlay glow on card hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{
                      boxShadow: `0 0 50px ${service.color}20, inset 0 0 50px ${service.color}10`
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
