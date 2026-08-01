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
                      className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center"
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
                      {"KADAM PRODUCTION".split(" ").map((word, wIdx) => (
                        <div key={wIdx} className="flex gap-[0.1em] whitespace-nowrap">
                          {word.split("").map((char, cIdx) => (
                            <motion.span
                              key={cIdx}
                              variants={{
                                hidden: { opacity: 0, y: 15, filter: 'blur(5px)' },
                                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                              }}
                              transition={{ duration: 0.45, ease: 'easeOut' }}
                              className="text-3xl sm:text-5xl font-light tracking-[0.15em] text-white uppercase"
                              style={{ 
                                fontFamily: 'Space Grotesk, sans-serif',
                                textShadow: '0 0 15px rgba(255,255,255,0.4)'
                              }}
                            >
                              {char}
                            </motion.span>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                    
                    {/* Mini loading progress bar */}
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: 160 }}
                      transition={{ duration: 1.0, ease: 'easeInOut' }}
                      className="h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_#a855f7]"
                    />
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
