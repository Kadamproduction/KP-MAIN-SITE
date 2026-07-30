import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_URL || 'https://assets.kadamproduction.in';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.kadamproduction.in',
      },
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
        destination: `${r2PublicUrl}/images/:path*`,
      },
      {
        source: '/videos/:path*',
        destination: `${r2PublicUrl}/videos/:path*`,
      },
    ];
  },
};

export default nextConfig;
