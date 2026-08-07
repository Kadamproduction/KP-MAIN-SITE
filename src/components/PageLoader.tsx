'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  onComplete: () => void;
  isReady: boolean;
}

const LOADING_LABELS = ['Loading', 'Preparing stage', 'Almost ready'];

export default function PageLoader({ onComplete, isReady }: PageLoaderProps) {
  const [isActive, setIsActive] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [progress, setProgress] = useState(0);
  const [labelIdx, setLabelIdx] = useState(0);
  const [exitCurtain, setExitCurtain] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const finishingRef = useRef(false);

  // Smooth RAF progress — scaleX driven, no width layout thrash
  useEffect(() => {
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;

      const current = progressRef.current;
      let next = current;

      if (isReady) {
        next = current + (100 - current) * Math.min(1, dt / 220);
        if (next > 99.5) next = 100;
      } else {
        const target = 90;
        const speed = current < 40 ? 0.045 : current < 70 ? 0.022 : 0.008;
        next = Math.min(target, current + dt * speed);
      }

      progressRef.current = next;
      setProgress(next);

      if (next >= 100 && isReady && !finishingRef.current) {
        finishingRef.current = true;
        setShowContent(false);
        // Curtain slides up after a brief beat at 100%
        window.setTimeout(() => setExitCurtain(true), 220);
        window.setTimeout(() => {
          setIsActive(false);
          onComplete();
        }, 950);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, onComplete]);

  useEffect(() => {
    if (!showContent || isReady) return;
    const id = window.setInterval(() => {
      setLabelIdx((i) => (i + 1) % LOADING_LABELS.length);
    }, 1400);
    return () => clearInterval(id);
  }, [showContent, isReady]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex pointer-events-auto">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: exitCurtain ? '-100%' : 0 }}
        transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center"
      >
        <AnimatePresence>
          {showContent && (
            <motion.div
              key="loader-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="relative z-10 flex flex-col items-center justify-center gap-7 px-6"
            >
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[0.08em] sm:tracking-[0.12em] text-white uppercase text-center"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                KADAM PRODUCTION
              </h1>

              <div className="flex flex-col items-center gap-3 w-52 sm:w-64">
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] will-change-transform"
                    style={{ transform: `scaleX(${Math.max(0.02, progress / 100)})` }}
                  />
                </div>

                <div className="flex items-center justify-between w-full px-0.5">
                  <motion.span
                    key={isReady ? 'ready' : LOADING_LABELS[labelIdx]}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 0.75, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-zinc-400"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {isReady ? 'Ready' : LOADING_LABELS[labelIdx]}
                  </motion.span>
                  <span
                    className="text-[10px] sm:text-xs tabular-nums tracking-widest text-zinc-500"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
