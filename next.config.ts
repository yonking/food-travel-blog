import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Allow local images from /images path
    unoptimized: false,
  },
};

export default nextConfig;
