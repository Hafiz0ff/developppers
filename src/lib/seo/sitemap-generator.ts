/**
 * Sitemap Generator & Index Builder
 * Generates XML Sitemaps Containing ONLY Indexable Canonical 200 URLs
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 1.1, 7, 9)
 */

import { getTaxonomyCategories, type Locale } from "./taxonomy-store";
import { getBaseSiteUrl, resolveCategoryUrl, resolveListingUrl, type ResolvableListing } from "./url-resolver";
import { CATALOG_PROPERTIES } from "../catalog-data";

export interface SitemapUrlEntry {
  url: string;
  lastmod: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
}

/**
 * Returns all indexable canonical category URLs across locales
 */
export function getIndexableCategoryUrls(locale: Locale = "ru"): SitemapUrlEntry[] {
  const categories = getTaxonomyCategories().filter((c) => c.active && c.indexable);
  const baseUrl = getBaseSiteUrl();
  const today = new Date().toISOString().split("T")[0];
  const cities = ["khujand", "dushanbe", "gafurov", "guliston", "buston", "istaravshan"];

  const entries: SitemapUrlEntry[] = [];

  for (const cat of categories) {
    for (const city of cities) {
      const path = resolveCategoryUrl({ category: cat, citySlug: city, locale });
      entries.push({
        url: `${baseUrl}${path}`,
        lastmod: today,
        changefreq: "daily",
        priority: cat.routeKind === "deal" ? 0.9 : 0.8,
      });
    }
  }

  return entries;
}

/**
 * Returns all active indexable listing URLs across locales
 */
export function getIndexableListingUrls(
  listings: ResolvableListing[],
  locale: Locale = "ru"
): SitemapUrlEntry[] {
  const baseUrl = getBaseSiteUrl();
  const today = new Date().toISOString().split("T")[0];
  const entries: SitemapUrlEntry[] = [];

  for (const item of listings) {
    // Only active listings are included in sitemap (AC-11, AC-14)
    if (item.status && item.status !== "active") {
      continue;
    }

    const path = resolveListingUrl(item, locale);
    entries.push({
      url: `${baseUrl}${path}`,
      lastmod: item.updatedAt ? item.updatedAt.split("T")[0] : today,
      changefreq: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}

/**
 * Generates XML string for a standard sitemap
 */
export function generateSitemapXml(entries: SitemapUrlEntry[]): string {
  const urlsXml = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ""}
    ${entry.priority != null ? `<priority>${entry.priority.toFixed(1)}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * Generates XML string for sitemap-index.xml
 */
export function generateSitemapIndexXml(): string {
  const baseUrl = getBaseSiteUrl();
  const today = new Date().toISOString().split("T")[0];

  const subSitemaps = [
    `${baseUrl}/sitemap-ru-categories.xml`,
    `${baseUrl}/sitemap-ru-listings.xml`,
    `${baseUrl}/sitemap-tg-categories.xml`,
    `${baseUrl}/sitemap-tg-listings.xml`,
    `${baseUrl}/sitemap-en-categories.xml`,
    `${baseUrl}/sitemap-en-listings.xml`,
  ];

  const sitemapsXml = subSitemaps
    .map(
      (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}
