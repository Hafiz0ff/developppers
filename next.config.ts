import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdntj.somon.tj",
      },
      {
        protocol: "https",
        hostname: "somon.tj",
      },
    ],
  },
};

export default nextConfig;
