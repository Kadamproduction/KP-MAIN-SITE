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
      // Hide the logo immediately when ready
      setShowLogo(false);
      
      // Start curtain split exit animation
      const exitTimer = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, 900); // Give the exit animation enough time to slide away (800ms)
      
      return () => {
        clearTimeout(exitTimer);
      };
    }
  }, [isReady, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          {/* CURTAIN SPLIT TOP (Slides Up on logo fade) */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: showLogo ? 0 : '-100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-black pointer-events-auto"
          />

          {/* CURTAIN SPLIT BOTTOM (Slides Down on logo fade) */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: showLogo ? 0 : '100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-black pointer-events-auto"
          />

          {/* Centered Lottie Logo (Fades out when showLogo is false) */}
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center pointer-events-auto"
                  dangerouslySetInnerHTML={{
                    __html: `<lottie-player src="/assets/Scene-1-2_kyav4b.json" background="transparent" speed="1" style="width: 100%; height: 100%;" loop autoplay></lottie-player>`
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
