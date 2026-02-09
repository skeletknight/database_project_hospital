import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Suppress strictly specific react hydration warnings if needed for degen vibes
  reactStrictMode: true,
};

export default nextConfig;
