'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // 1. Hide the logo after exactly 2 seconds
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      
      // 2. Start curtain split exit animation immediately after logo fades
      const exitTimer = setTimeout(() => {
        setIsActive(false);
        onComplete();
      }, 900); // Give the exit animation enough time to slide away (800ms)
      
      return () => {
        clearTimeout(exitTimer);
      };
    }, 2000);

    return () => {
      clearTimeout(logoTimer);
    };
  }, [onComplete]);

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
                  className="w-48 h-48 flex items-center justify-center pointer-events-auto"
                  dangerouslySetInnerHTML={{
                    __html: `<lottie-player src="https://res.cloudinary.com/zr9jqpwb/raw/upload/v1783414012/Scene-1-2_kyav4b.json" background="transparent" speed="1" style="width: 100%; height: 100%;" loop autoplay></lottie-player>`
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
