'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

// 9 high-quality Cloudinary event production images
const galleryImages = [
  { id: 1, category: 'Weddings', title: 'Premium Varmala Stage', event: 'Wedding Ceremony', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783012636/Untitled-design-13.png' },
  { id: 2, category: 'Festivals', title: 'Cultural Garba Arena', event: 'Navratri Dandiya', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417406/Untitled-design-18_tdjp2b.png' },
  { id: 3, category: 'Concerts', title: 'Live Rock concert audio', event: 'Sunburn Arena', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417444/Untitled-design-21_atubxz.png' },
  { id: 4, category: 'Corporate', title: 'Interactive Truss rig', event: 'Launch Production', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417440/Untitled-design-20_sm7myc.png' },
  { id: 5, category: 'Road Shows', title: 'Mobile LED Truss', event: 'Gujarat Promotion', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417424/Untitled-design-17_ubz6ho.png' },
  { id: 6, category: 'Weddings', title: 'Royal Reception Stage', event: 'Elite reception setup', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417394/Untitled-design-15_bdfxt9.png' },
  { id: 7, category: 'Festivals', title: 'Neon Laser EDM show', event: 'Music Festival live', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417386/Untitled-design-14_ogyqmd.png' },
  { id: 8, category: 'Concerts', title: 'Mainstage LED wall', event: 'Ahmedabad Concert Live', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417856/Untitled-design-32_atcfrs.png' },
  { id: 9, category: 'Corporate', title: 'High-end lighting design', event: 'VIP Corporate Meet', src: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417448/Untitled-design-25_f2t475.png' }
];

const categories = ['All Events', 'Weddings', 'Festivals', 'Concerts', 'Corporate', 'Road Shows'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keyboard navigation support for Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const filteredImages = galleryImages.filter((img) => 
    selectedCategory === 'All Events' || img.category === selectedCategory
  );

  const handleNext = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredImages.length;
    });
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredImages.length) % filteredImages.length;
    });
  };

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-black text-white pt-24 select-none pb-20">
        
        {/* HERO HEADER */}
        <section className="py-20 text-center space-y-3 px-6 bg-gradient-to-b from-purple-950/10 via-black to-black border-b border-white/5">
          <FlipText 
            text="OUR WORK" 
            className="text-4xl md:text-6xl font-black uppercase tracking-tight"
          />
          <p className="text-xs sm:text-sm text-zinc-500 font-semibold tracking-[0.2em] uppercase">
            Moments we&apos;ve created, memories we&apos;ve made
          </p>
        </section>

        {/* FILTER BAR */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase cursor-pointer snap-start transition-all duration-300 border flex-shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] border-transparent text-white shadow-lg shadow-purple-500/10' 
                      : 'bg-transparent border-white/10 hover:border-white/30 text-zinc-400 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* MASONRY PORTFOLIO GRID */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div 
            layout 
            className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6"
          >
            {filteredImages.map((image, idx) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group rounded-2xl overflow-hidden border border-white/5 hover:border-[#8B5CF6]/30 break-inside-avoid shadow-lg bg-zinc-900/30 cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-auto object-cover"
                />
                
                {/* Subtle visual hover mask with a centralized max icon */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/98 flex flex-col justify-center items-center px-4"
            >
              {/* Close trigger */}
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev trigger */}
              <button 
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main lightbox photo container */}
              <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
                <motion.img 
                  key={filteredImages[lightboxIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[lightboxIndex].src} 
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
              </div>

              {/* Next trigger */}
              <button 
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
