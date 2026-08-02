'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete: () => void;
  isReady: boolean;
}

export default function PageLoader({ onComplete, isReady }: PageLoaderProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isReady) {
      // Hide the logo first
      setShowLogo(false);
      
      // Start curtain upward exit animation after logo fades out
      const exitTimer = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, 700);
      
      return () => {
        clearTimeout(exitTimer);
      };
    }
  }, [isReady, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <div className="fixed inset-0 z-[9999] overflow-hidden flex pointer-events-none">
          {/* Single Curtain Slide Up */}
          <motion.div
            initial={{ y: 0 }}
            animate={isReady ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 bg-zinc-950 pointer-events-auto flex flex-col items-center justify-center"
          >
            {/* Centered Creative Brand Reveal */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6">
              <AnimatePresence>
                {showLogo && (
                  <div className="flex flex-col items-center gap-6 pointer-events-auto">
                    {/* Glowing staggered letter reveal */}
                    <motion.div
                      className="flex flex-row justify-center whitespace-nowrap overflow-visible"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.04
                          }
                        }
                      }}
                    >
                      {"KADAM PRODUCTION".split("").map((char, cIdx) => (
                        <motion.span
                          key={cIdx}
                          variants={{
                            hidden: { opacity: 0, y: 15, filter: 'blur(5px)' },
                            visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                          }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[0.06em] sm:tracking-[0.12em] text-white uppercase"
                          style={{ 
                            fontFamily: 'Space Grotesk, sans-serif',
                            textShadow: '0 0 15px rgba(255,255,255,0.4)'
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </motion.span>
                      ))}
                    </motion.div>
                    
                    {/* Single progress loading line (Animates once and stops) */}
                    <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={isReady ? { width: '100%' } : { width: '85%' }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_#a855f7]"
                      />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
