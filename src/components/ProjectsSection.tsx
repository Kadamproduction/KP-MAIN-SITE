'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';
import FadeIn from './FadeIn';

interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  images: {
    col1_img1: string;
    col1_img2: string;
    col2_img: string;
  };
  link: string;
}

const projectsData: ProjectItem[] = [
  {
    id: 'wedding-productions',
    number: '01',
    name: 'Royal Weddings',
    category: 'Wedding Production',
    images: {
      col1_img1: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783012636/Untitled-design-13.png',
      col1_img2: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417406/Untitled-design-18_tdjp2b.png',
      col2_img: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417444/Untitled-design-21_atubxz.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'festival-productions',
    number: '02',
    name: 'Cultural Festivals',
    category: 'Arena Production',
    images: {
      col1_img1: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417440/Untitled-design-20_sm7myc.png',
      col1_img2: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417424/Untitled-design-17_ubz6ho.png',
      col2_img: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417394/Untitled-design-15_bdfxt9.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'concert-productions',
    number: '03',
    name: 'Live Concerts',
    category: 'Stadium Production',
    images: {
      col1_img1: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417386/Untitled-design-14_ogyqmd.png',
      col1_img2: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417856/Untitled-design-32_atcfrs.png',
      col2_img: 'https://res.cloudinary.com/zr9jqpwb/image/upload/v1783417448/Untitled-design-25_f2t475.png'
    },
    link: 'https://github.com'
  }
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-25 py-28 px-6 md:px-12 flex flex-col items-center"
    >
      <div className="text-center max-w-2xl space-y-4 mb-24 relative z-20">
        <h2 
          className="text-4xl md:text-6xl font-normal uppercase tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent hero-heading"
          style={{ fontFamily: 'var(--font-gloock), Gloock, serif' }}
        >
          SIGNATURE PRODUCTIONS
        </h2>
        <p className="text-xs text-zinc-550 font-bold uppercase tracking-widest">Creating unforgettable atmospheres across different event genres</p>
      </div>

      {/* Sticky Stacking Cards Container */}
      <div className="w-full max-w-6xl space-y-24 md:space-y-32 relative">
        {projectsData.map((project, idx) => {
          return (
            <CardWrapper 
              key={project.id} 
              project={project} 
              index={idx} 
              totalCards={projectsData.length}
              globalProgress={scrollYProgress} 
            />
          );
        })}
      </div>
    </section>
  );
}

interface CardWrapperProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
  globalProgress: any;
}

function CardWrapper({ project, index, totalCards, globalProgress }: CardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Monitor this card's viewport position relative to scroll to apply downscale
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start']
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div 
      ref={cardRef} 
      className="sticky h-[85vh] w-full flex items-start justify-center"
      style={{ 
        top: `${96 + index * 28}px`,
        perspective: 1000
      }}
    >
      <motion.div 
        style={{ scale }}
        className="w-full bg-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl relative"
      >
        {/* Top Row Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D7E2EA]/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-6xl font-black text-[#D7E2EA]/20 leading-none">
              {project.number}
            </span>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/60 block mb-1">
                {project.category}
              </span>
              <h3 
                className="text-xl sm:text-2xl font-black text-[#D7E2EA]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          
          <LiveProjectButton href={project.link} />
        </div>

        {/* Bottom Row Layout: 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mt-6 flex-1 items-stretch">
          {/* Left Column (40% width): 2 stacked images */}
          <div className="md:col-span-4 flex flex-col gap-4 justify-between">
            <div 
              className="relative w-full rounded-[30px] sm:rounded-[40px] overflow-hidden border border-white/5 shadow-md flex-1"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            >
              <img 
                src={project.images.col1_img1} 
                alt={`${project.name} preview 1`}
                className="w-full h-full object-cover filter brightness-[0.8] hover:scale-103 transition-transform duration-500"
              />
            </div>
            
            <div 
              className="relative w-full rounded-[30px] sm:rounded-[40px] overflow-hidden border border-white/5 shadow-md flex-1"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            >
              <img 
                src={project.images.col1_img2} 
                alt={`${project.name} preview 2`}
                className="w-full h-full object-cover filter brightness-[0.8] hover:scale-103 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column (60% width): 1 tall image */}
          <div className="md:col-span-6 relative rounded-[30px] sm:rounded-[40px] overflow-hidden border border-white/5 shadow-md min-h-[260px] md:min-h-0">
            <img 
              src={project.images.col2_img} 
              alt={`${project.name} main cover`}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] hover:scale-103 transition-transform duration-700"
            />
          </div>
        </div>

      </motion.div>
    </div>
  );
}
