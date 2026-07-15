import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fae002ea80ad4682b9a9920a6ba1bcd3.r2.dev',
      },
    ],
    minimumCacheTTL: 31536000,
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${process.env.R2_PUBLIC_URL}/images/:path*`,
      },
      {
        source: '/videos/:path*',
        destination: `${process.env.R2_PUBLIC_URL}/videos/:path*`,
      },
      {
        source: '/Scene-1-2_kyav4b.json',
        destination: `${process.env.R2_PUBLIC_URL}/Scene-1-2_kyav4b.json`,
      },
      {
        source: '/logo.png',
        destination: `${process.env.R2_PUBLIC_URL}/logo.png`,
      },
    ];
  },
};

export default nextConfig;
