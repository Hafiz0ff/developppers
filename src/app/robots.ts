import type { MetadataRoute } from "next";
import { getBaseSiteUrl } from "@/lib/seo/url-resolver";

/**
 * Next.js Robots.txt Metadata Route
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Section 8)
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/super-admin/",
          "/developer-admin/",
          "/cabinet/",
          "/profile/",
          "/search-internal/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap-index.xml`,
  };
}
