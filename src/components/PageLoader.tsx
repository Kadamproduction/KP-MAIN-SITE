'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(1); // 1: 0-80%, 2: 80-90%, 3: 90-100%, 4: Complete/Exit

  useEffect(() => {
    // Progress counter timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Dynamic speed based on progress stages
        let step = 1;
        if (prev < 20) step = 2; // Fast start
        else if (prev < 80) step = Math.random() > 0.7 ? 1 : 2; // Steady build
        else if (prev < 90) step = 0.5; // Decelerating for dramatic effect
        else step = 1.5; // Final sprint
        
        const next = prev + step;
        return next > 100 ? 100 : next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Update stages based on progress counter
  useEffect(() => {
    if (progress >= 100) {
      setStage(4);
      const timer = setTimeout(() => {
        onComplete();
      }, 900); // Wait for curtain exit transition to finish
      return () => clearTimeout(timer);
    } else if (progress >= 90) {
      setStage(3);
    } else if (progress >= 80) {
      setStage(2);
    }
  }, [progress, onComplete]);

  // SVG parameters for progress ring
  const radius = 60;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {stage < 4 && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          {/* CURTAIN SPLIT TOP */}
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black pointer-events-auto"
          />

          {/* CURTAIN SPLIT BOTTOM */}
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black pointer-events-auto"
          />

          {/* CONTENT SHELL OVERLAY */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-10">
            {/* Center Loading Ring & Glitch K Logo */}
            <div className="relative w-48 h-48 flex items-center justify-center select-none">
              {/* Progress Ring */}
              <svg className="absolute w-40 h-40 rotate-[-90deg]">
                {/* Background Ring */}
                <circle 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth={strokeWidth} 
                  fill="transparent" 
                />
                {/* Glowing Colored Ring */}
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                  stroke="url(#loaderGrad)" 
                  strokeWidth={strokeWidth} 
                  fill="transparent" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
                <defs>
                  <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/*Glitching K Logo in the Center */}
              <div className="relative text-7xl font-black text-white tracking-tighter select-none font-mono">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block relative"
                >
                  K
                  {/* Glitch effects layers */}
                  <span className="absolute top-0 left-0 text-red-500/50 -translate-x-[2px] translate-y-[1px] select-none pointer-events-none animate-pulse">K</span>
                  <span className="absolute top-0 left-0 text-cyan-500/50 translate-x-[2px] -translate-y-[1px] select-none pointer-events-none animate-pulse">K</span>
                </motion.span>
              </div>

            </div>

            {/* Subtitle / Stages Info */}
            <div className="mt-8 h-12 flex flex-col items-center justify-center text-center">
              {stage < 3 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs uppercase font-extrabold tracking-[0.25em] text-zinc-500"
                >
                  Creating Atmosphere
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="text-sm uppercase font-extrabold tracking-[0.3em] text-white gradient-text-accent"
                >
                  LET&apos;S BEGIN
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
