'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from './LiveProjectButton';
import Image from 'next/image';

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
      col1_img1: '/images/Untitled-design-13.png',
      col1_img2: '/images/Untitled-design-18_tdjp2b.png',
      col2_img: '/images/Untitled-design-21_atubxz.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'festival-productions',
    number: '02',
    name: 'Cultural Festivals',
    category: 'Arena Production',
    images: {
      col1_img1: '/images/Untitled-design-20_sm7myc.png',
      col1_img2: '/images/Untitled-design-17_ubz6ho.png',
      col2_img: '/images/Untitled-design-15_bdfxt9.png'
    },
    link: 'https://github.com'
  },
  {
    id: 'concert-productions',
    number: '03',
    name: 'Live Concerts',
    category: 'Stadium Production',
    images: {
      col1_img1: '/images/Untitled-design-14_ogyqmd.png',
      col1_img2: '/images/Untitled-design-32_atcfrs.png',
      col2_img: '/images/Untitled-design-25_f2t475.png'
    },
    link: 'https://github.com'
  }
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectItem[]>(projectsData);

  useEffect(() => {
    async function loadSignatures() {
      try {
        const res = await fetch(`/api/public/data?t=${Date.now()}`);
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        if (data.signatures && data.signatures.length > 0) {
          const mapped: ProjectItem[] = data.signatures.map((s: {
            id: string;
            number: string;
            name: string;
            category: string;
            col1_img1: string;
            col1_img2: string;
            col2_img: string;
            link?: string;
          }) => ({
            id: s.id,
            number: s.number,
            name: s.name,
            category: s.category,
            images: {
              col1_img1: s.col1_img1,
              col1_img2: s.col1_img2,
              col2_img: s.col2_img
            },
            link: s.link || 'https://github.com'
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error('Failed to load dynamic signatures:', err);
      }
    }
    loadSignatures();
  }, []);

  return (
    <section 
      className="relative bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-25 pt-12 pb-[20vh] md:pb-[18vh] px-6 md:px-12 flex flex-col items-center"
    >
      <div className="text-center max-w-2xl space-y-4 mb-8 md:mb-24 relative z-20">
        <h2 
          className="text-4xl md:text-6xl font-normal uppercase tracking-wider text-white hero-heading"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          SIGNATURE PRODUCTIONS
        </h2>
        <p className="text-xs text-zinc-550 font-bold uppercase tracking-widest">Creating unforgettable atmospheres across different event genres</p>
      </div>

      {/* Sticky stacking cards — mobile, tablet, and desktop */}
      <div className="w-full max-w-6xl space-y-8 md:space-y-32 relative">
        {projects.map((project, idx) => (
          <CardWrapper 
            key={project.id} 
            project={project} 
            index={idx} 
            totalCards={projects.length}
          />
        ))}
      </div>
    </section>
  );
}

interface CardWrapperProps {
  project: ProjectItem;
  index: number;
  totalCards: number;
}

function CardWrapper({ project, index, totalCards }: CardWrapperProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(64);

  useEffect(() => {
    const sync = () => {
      // Match navbar height across breakpoints
      if (window.innerWidth >= 1024) setStickyTop(80);
      else if (window.innerWidth >= 768) setStickyTop(72);
      else setStickyTop(64);
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start']
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div 
      ref={cardRef} 
      className="sticky h-[70vh] sm:h-[75vh] md:h-[90vh] w-full flex items-center justify-center"
      style={{ 
        top: stickyTop,
        perspective: 1000,
        zIndex: index + 10
      }}
    >
      <motion.div 
        style={{ scale, willChange: 'transform' }}
        className="w-full bg-[#0C0C0C] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] border border-[#D7E2EA]/40 p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden max-h-[calc(70vh-24px)] sm:max-h-[calc(75vh-24px)] md:max-h-none"
      >
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-[#D7E2EA]/10 pb-4 md:pb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#D7E2EA]/20 leading-none">
              {project.number}
            </span>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D7E2EA]/60 block mb-1">
                {project.category}
              </span>
              <h3 
                className="text-lg sm:text-xl md:text-2xl font-black text-[#D7E2EA]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          
          <LiveProjectButton />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-3 sm:gap-4 mt-4 flex-1 items-stretch min-h-0">
          <div className="hidden md:flex md:col-span-4 flex-col gap-4 justify-between">
            <div className="relative w-full rounded-[20px] sm:rounded-[30px] overflow-hidden border border-white/5 shadow-md h-[140px] lg:h-[190px]">
              <Image 
                src={project.images.col1_img1} 
                alt={`${project.name} preview 1`}
                fill
                sizes="400px"
                className="object-cover filter brightness-[0.8]"
              />
            </div>
            
            <div className="relative w-full rounded-[20px] sm:rounded-[30px] overflow-hidden border border-white/5 shadow-md h-[180px] lg:h-[250px]">
              <Image 
                src={project.images.col1_img2} 
                alt={`${project.name} preview 2`}
                fill
                sizes="400px"
                className="object-cover filter brightness-[0.8]"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-6 relative rounded-[20px] sm:rounded-[30px] overflow-hidden border border-white/5 shadow-md min-h-[180px] sm:min-h-[220px] md:min-h-0 aspect-[16/10] md:aspect-auto">
            <Image 
              src={project.images.col2_img} 
              alt={`${project.name} main cover`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover filter brightness-[0.8]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
