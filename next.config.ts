import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
