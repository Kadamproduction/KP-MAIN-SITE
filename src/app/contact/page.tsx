'use client';

import { useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, Clock, 
  Sparkles, Globe 
} from 'lucide-react';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
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

      <div className="relative min-h-screen bg-black text-white pt-24 select-none pb-20">
        
        {/* HERO BANNER SECTION */}
        <section className="relative h-[360px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-purple-900/30 via-black to-black">
          {/* Wave visualizer */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

          {/* Titles */}
          <div className="relative z-10 text-center space-y-4 px-6">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal uppercase tracking-wider leading-none"
              style={{ fontFamily: 'var(--font-gloock), Gloock, serif' }}
            >
              <span className="text-white mr-3">CONTACT</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent hero-heading pb-1">
                US
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-355 font-semibold tracking-[0.2em] uppercase">
              Ready to make your event stage unforgettable?
            </p>
          </div>
        </section>

        {/* MAP & INFORMATION CARDS CONTAINER */}
        <section className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          
          {/* TASK 5: FULL-WIDTH EMBEDDED GOOGLE MAP */}
          <div className="w-full relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.218559092472!2d72.7733!3d21.19447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4c2813137d%3A0x1e01d78bc6b5c0dc!2sKadam%20Production!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%" 
              height="600" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[400px] md:h-[600px] filter invert-[90%] hue-rotate-[180deg] contrast-[105%]"
            />
          </div>

          {/* BELOW MAP: CONTACT INFO CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* CARD 1: PHONE */}
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-pink-500/20 hover:bg-pink-500/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-1">Call Us</h4>
                  <a href="tel:+919537330003" className="text-lg font-bold text-white hover:text-pink-400 block transition-colors">
                    +91 9537330003
                  </a>
                  <a href="tel:+918866655651" className="text-sm font-semibold text-zinc-500 hover:text-white block mt-1 transition-colors">
                    +91 8866655651
                  </a>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6 text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                Click number to ring office
              </div>
            </div>

            {/* CARD 2: EMAIL */}
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-purple-500/20 hover:bg-purple-500/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-1">Email Enquiries</h4>
                  <a href="mailto:kadamproduction123@gmail.com" className="text-[13px] sm:text-sm font-bold text-white hover:text-purple-400 block break-all transition-colors">
                    kadamproduction123@gmail.com
                  </a>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6 text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                Responds within 24 Hours
              </div>
            </div>

            {/* CARD 3: LOCATION */}
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-cyan-500/20 hover:bg-cyan-500/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-1">Corporate HQ</h4>
                  <p className="text-lg font-bold text-white uppercase">Surat, Gujarat</p>
                  <p className="text-zinc-500 text-xs font-semibold mt-1">Service Area: All India</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6 text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                Kadam Production Office
              </div>
            </div>

            {/* CARD 4: OPERATING HOURS */}
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-3xl shadow-lg flex flex-col justify-between hover:border-orange-500/20 hover:bg-orange-500/3 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-550 uppercase tracking-widest mb-1">Operating Hours</h4>
                  <p className="text-lg font-bold text-white uppercase">24/7 Availability</p>
                  <p className="text-zinc-500 text-xs font-semibold mt-1">Office: Mon-Sat, 10AM-7PM</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6 text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                Support available for live events
              </div>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
