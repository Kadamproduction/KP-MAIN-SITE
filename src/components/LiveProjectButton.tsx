'use client';

interface LiveProjectButtonProps {
  href?: string;
}

export default function LiveProjectButton({ href = '#' }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-[0.2em] px-8 py-3 sm:px-10 sm:py-3.5 text-xs sm:text-sm hover:bg-[#D7E2EA]/10 transition-all duration-300 select-none text-center"
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      Live Project
    </a>
  );
}
