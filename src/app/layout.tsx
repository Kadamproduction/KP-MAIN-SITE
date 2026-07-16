import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Lora, Courier_Prime, Gloock } from 'next/font/google';
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

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-courier-prime',
  display: 'swap',
});

const gloock = Gloock({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-gloock',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${lora.variable} ${courierPrime.variable} ${gloock.variable} dark h-full antialiased`}>
      <head>
        <link rel="preload" href="/Scene-1-2_kyav4b.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className="min-h-full bg-black text-white flex flex-col font-space-grotesk select-none overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Load Lottie player for premium vector animations */}
        <Script 
          src="https://unpkg.com/@lottiefiles/lottie-player@2.0.4/dist/lottie-player.js" 
          strategy="beforeInteractive" 
        />
        {/* Prevent mobile pinch zoom and double-tap zoom */}
        <Script id="disable-zoom" strategy="afterInteractive">
          {`
            document.addEventListener('gesturestart', function (e) {
              e.preventDefault();
            });
            document.addEventListener('touchstart', function (e) {
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }, { passive: false });
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (e) {
              const now = (new Date()).getTime();
              if (now - lastTouchEnd <= 300) {
                e.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
          `}
        </Script>
      </body>
    </html>
  );
}
