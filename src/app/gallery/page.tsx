'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

// 24+ high-quality stock event production images
const galleryImages = [
  { id: 1, category: 'Weddings', title: 'Luxury Reception Setup', event: 'Soni Wedding 2026', src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { id: 2, category: 'Festivals', title: 'Neon Laser Show', event: 'Sunburn Arena', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
  { id: 3, category: 'Concerts', title: 'Mainstage Production', event: 'Arijit Singh Live', src: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80' },
  { id: 4, category: 'Corporate', title: 'Keynote Stage Lighting', event: 'Tech Summit 2025', src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80' },
  { id: 5, category: 'Road Shows', title: 'Truck Mounted LED Truss', event: 'Gujarat Election Rally', src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
  { id: 6, category: 'Weddings', title: 'Glow Sangeet Night', event: 'Patel Sangeet 2025', src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80' },
  { id: 7, category: 'Festivals', title: 'Pyrotechnics & Sparks', event: 'EDM Night Ahmedabad', src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80' },
  { id: 8, category: 'Concerts', title: 'Outdoor Concert Sound', event: 'Rock Festival Baroda', src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80' },
  { id: 9, category: 'Corporate', title: 'Gala Awards Dinner', event: 'Reliance Corporate Meet', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
  { id: 10, category: 'Road Shows', title: 'Mobile DJ Console', event: 'Ganpati Visarjan Rally', src: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=800&q=80' },
  { id: 11, category: 'Weddings', title: 'Open Air Varmala Stage', event: 'Shah Royal Wedding', src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80' },
  { id: 12, category: 'Festivals', title: 'Laser Wave Ceiling', event: 'Elysian Festival', src: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&w=800&q=80' },
  { id: 13, category: 'Concerts', title: 'LED Wall Setup', event: 'Diljit Dosanjh Live', src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80' },
  { id: 14, category: 'Corporate', title: 'VIP Launch Event', event: 'BMW Car Unveiling', src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80' },
  { id: 15, category: 'Road Shows', title: 'Silent Generator Setup', event: 'Film City Shoot', src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80' },
  { id: 16, category: 'Weddings', title: 'White Floral Mandap', event: 'Mehta Mandap Night', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80' },
  { id: 17, category: 'Festivals', title: 'Arena Sound System', event: 'Dandiya Garba Night', src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80' },
  { id: 18, category: 'Concerts', title: 'Guitarist Silhouette', event: 'Youth Rock Fest', src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80' },
  { id: 19, category: 'Corporate', title: 'Panel Discussion Setup', event: 'Forbes Gujarat Meet', src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80' },
  { id: 20, category: 'Road Shows', title: 'Mobile LED Display truck', event: 'Promotional Brand Tour', src: 'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?auto=format&fit=crop&w=800&q=80' },
  { id: 21, category: 'Weddings', title: 'Truss Gate Entry Lights', event: 'Joshi Reception 2026', src: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80' },
  { id: 22, category: 'Festivals', title: 'Massive Crowd Confetti', event: 'Holi EDM bash', src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
  { id: 23, category: 'Concerts', title: 'Pyrotechnics Stage Spark', event: 'Metal Night Surat', src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80' },
  { id: 24, category: 'Corporate', title: 'LED Interactive Backdrop', event: 'Product Launch meet', src: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800&q=80' }
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
                className="relative group rounded-2xl overflow-hidden border border-white/5 hover:border-[#8B5CF6]/30 break-inside-avoid shadow-lg bg-zinc-900/30"
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-103"
                />
                
                {/* Visual Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-6 space-y-2">
                    <span 
                      className="text-[9px] font-bold px-2 py-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-full uppercase tracking-widest"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {image.category}
                    </span>
                    <h3 className="text-xl font-bold text-white uppercase">{image.title}</h3>
                    <p className="text-xs text-zinc-400 font-semibold">{image.event}</p>
                  </div>
                </div>

                {/* Lightbox trigger top-right */}
                <button
                  onClick={() => setLightboxIndex(idx)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-white border border-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
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
              <div className="max-w-4xl max-h-[75vh] flex flex-col items-center">
                <motion.img 
                  key={filteredImages[lightboxIndex].id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={filteredImages[lightboxIndex].src} 
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-full max-h-[65vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
                
                {/* Info panel */}
                <div className="text-center mt-6 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {filteredImages[lightboxIndex].category}
                  </span>
                  <h4 className="text-lg md:text-xl font-bold text-white uppercase">
                    {filteredImages[lightboxIndex].title}
                  </h4>
                  <p className="text-xs text-zinc-550">{filteredImages[lightboxIndex].event}</p>
                </div>
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
