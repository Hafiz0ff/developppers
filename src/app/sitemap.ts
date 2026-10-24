import type { MetadataRoute } from "next";
import { getIndexableCategoryUrls, getIndexableListingUrls } from "@/lib/seo/sitemap-generator";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import type { ResolvableListing } from "@/lib/seo/url-resolver";

/**
 * Next.js Sitemap Metadata Route
 * Automatically generates canonical indexable 200 URLs
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Section 9)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const listings: ResolvableListing[] = CATALOG_PROPERTIES.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleTg: p.titleTg,
    dealType: p.dealType,
    propertyType: p.propertyType,
    city: p.city,
    cityTg: p.cityTg,
    district: p.district,
    priceTjs: p.priceTjs,
    priceUsd: p.priceUsd,
    area: p.area,
    rooms: p.rooms,
    status: "active",
  }));

  const catUrlsRu = getIndexableCategoryUrls("ru");
  const listingUrlsRu = getIndexableListingUrls(listings, "ru");

  const allEntries = [...catUrlsRu, ...listingUrlsRu];

  return allEntries.map((e) => ({
    url: e.url,
    lastModified: new Date(e.lastmod),
    changeFrequency: e.changefreq || "weekly",
    priority: e.priority || 0.7,
  }));
}
