'use client';

import { motion } from 'framer-motion';
import { 
  Award, ShieldCheck, Heart, Sparkles, Flame 
} from 'lucide-react';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

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

const milestones = [
  { year: '2014', event: 'Company Founded', description: 'Started with a vision and 2 sound setups in Gujarat.' },
  { year: '2016', event: '100 Events Completed', description: 'First major milestone delivering wedding sound setups.' },
  { year: '2018', event: 'Team Expansion', description: 'Grew to 20+ professionals and introduced laser programming.' },
  { year: '2020', event: '500+ Events', description: 'Became an industry leader for concert light structures.' },
  { year: '2024', event: '1000+ Events', description: 'Continuing excellence with massive silent generators and full setups.' }
];

const teamMembers = [
  { name: 'Vijay Kadam', role: 'Founder & Main DJ', bio: 'Pioneered custom sound rigging and DJ performance styles.', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Amit Kadam', role: 'Head of Lighting Design', bio: 'Specialist in custom laser mappings and moving head structures.', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rajesh Sharma', role: 'Senior Sound Engineer', bio: 'Maintains optimal decibel balance and line array rigging safety.', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

export default function AboutPage() {
  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-black text-white pt-24 select-none pb-20">
        
        {/* SPLIT HERO SECTION */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-purple-950/10 via-black to-black py-12">
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Col: Titles & Heading */}
            <div className="space-y-6 text-center lg:text-left">
              <FlipText 
                text="ABOUT KADAM PRODUCTION" 
                className="text-4xl md:text-6xl font-black uppercase tracking-tight justify-center lg:justify-start"
              />
              <p className="text-sm md:text-md text-zinc-400 font-semibold tracking-wider max-w-xl leading-relaxed">
                10+ years of creating unforgettable experiences. Gujarat&apos;s leading production agency supplying high-end audio setups, truss structures, and silent generator fleets.
              </p>
            </div>

            {/* Right Col: Graphic/Gradient Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video lg:aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-8 bg-[#080808]"
            >
              {/* Spinning background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-pulse" />
              
              {/* Graphic core */}
              <div className="text-center relative z-10 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                  <Flame className="w-10 h-10 text-white animate-bounce" />
                </div>
                <h3 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>SINCE 2014</h3>
                <p className="text-xs text-zinc-500 max-w-xs font-semibold leading-relaxed">Rigging professional line arrays, laser structures, and silent generators for film sets, Dandiyas, and high-profile stages.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STORY & TIMELINE SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Counters & Vision */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              OUR VISION & VALUES
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Kadam Production was built on a simple philosophy: events are temporary, but atmospheric memories last forever. We combine safety engineering with premium visuals and sound dynamics to ensure every Dandiya, concert, and wedding reception is flawless.
            </p>

            {/* Values stats row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
              <div className="text-center p-4 bg-[#080808] border border-white/5 rounded-2xl">
                <Award className="w-6 h-6 text-purple-450 mx-auto mb-2" />
                <div className="text-sm font-bold text-white uppercase">Quality</div>
              </div>
              <div className="text-center p-4 bg-[#080808] border border-white/5 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-pink-450 mx-auto mb-2" />
                <div className="text-sm font-bold text-white uppercase">Safety</div>
              </div>
              <div className="text-center p-4 bg-[#080808] border border-white/5 rounded-2xl">
                <Heart className="w-6 h-6 text-[#06B6D4] mx-auto mb-2" />
                <div className="text-sm font-bold text-white uppercase">Passion</div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              OUR JOURNEY
            </h3>

            <div className="relative border-l border-white/10 pl-6 space-y-8">
              {milestones.map((mil, idx) => (
                <motion.div 
                  key={mil.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Glowing Node dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#050505] border-2 border-purple-500 group-hover:bg-purple-500 transition-colors" />
                  
                  <div className="space-y-1">
                    <span 
                      className="text-lg font-black text-purple-400 font-sans"
                      style={{ textShadow: '0 0 15px rgba(139,92,246,0.3)' }}
                    >
                      {mil.year}
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {mil.event}
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold max-w-md">
                      {mil.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM CAROUSEL SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <FlipText 
              text="THE CREW" 
              className="text-3xl md:text-5xl font-black uppercase"
            />
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">Meet the production masterminds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-zinc-900/40 border border-white/5"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={member.src} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Social tray */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <a href="https://instagram.com" className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a href="https://youtube.com" className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h4 className="text-lg font-bold text-white uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                    {member.role}
                  </span>
                  <p className="text-xs text-zinc-550 leading-relaxed font-semibold pt-2 border-t border-white/5">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
