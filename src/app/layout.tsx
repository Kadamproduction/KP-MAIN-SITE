import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kadam Production | Premium DJ & Event Services',
  description: 'Creating unforgettable atmospheres with premium DJ performances, sound systems, and lighting for weddings, festivals, and corporate events.',
  keywords: ['DJ services', 'event management', 'wedding DJ', 'sound system', 'lighting design', 'Gujarat events'],
  openGraph: {
    title: 'Kadam Production | Premium Event Services',
    description: '1000+ events completed. Professional DJ, sound, and lighting services.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kadam Production | Premium Event Services',
    description: '1000+ events completed. Professional DJ, sound, and lighting services.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-black text-white flex flex-col font-sans select-none overflow-x-hidden">
        {children}
        {/* Load Lottie player for premium vector animations */}
        <Script 
          src="https://unpkg.com/@lottiefiles/lottie-player@2.0.4/dist/lottie-player.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
