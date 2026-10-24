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
  async redirects() {
    return [
      // Enforce Section 1.1 & Section 2: Prohibit /ru/ prefix (redirect to non-prefixed RU)
      {
        source: "/ru",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ru/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Root localized landing pages
      {
        source: "/tg",
        destination: "/?locale=tg",
      },
      {
        source: "/en",
        destination: "/?locale=en",
      },
      // Localized routes for projects, classifieds, developers, compare, etc.
      // Excludes API endpoints and Next.js internal static assets
      {
        source: "/tg/:path((?!api|_next|favicon\\.ico).*)",
        destination: "/:path?locale=tg",
      },
      {
        source: "/en/:path((?!api|_next|favicon\\.ico).*)",
        destination: "/:path?locale=en",
      },
    ];
  },
};

export default nextConfig;
