import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
