/**
 * Scalable Batch SEO & URL Migration Processor
 * Supports Safe DRY RUN, Detailed Audit Reports, Idempotency, and 10,000+ Scale Processing
 * Conforms to MASKANI.TJ SEO Specification v1.7 (Sections 2.3.2, 16, 17)
 */

import { type ResolvableListing, resolveListingUrl } from "./url-resolver";
import { recordUrlAlias, normalizePath } from "./url-alias-store";
import { findCategoryForListing, getTaxonomyCategories } from "./taxonomy-store";

export interface BatchProcessingOptions {
  dryRun?: boolean;
  batchSize?: number;
  reason?: string;
  sourceCategoryOverride?: Record<string, string>; // listingId -> newCategoryId
}

export interface UrlDiffEntry {
  listingId: string;
  title: string;
  oldUrl: string;
  newUrl: string;
  hasChanged: boolean;
  categoryCode: string;
}

export interface BatchSeoAuditReport {
  executionTimestamp: string;
  isDryRun: boolean;
  totalListingsEvaluated: number;
  totalUrlsChanged: number;
  totalUrlsUnchanged: number;
  categoryDistribution: Record<string, number>;
  localeDistribution: { ru: number; tg: number; en: number };
  redirectMap: Array<{ from: string; to: string; listingId: string }>;
  collisionsDetected: Array<{ url: string; listingIds: string[] }>;
  exceptionsLogged: Array<{ listingId: string; error: string; field?: string }>;
  durationMs: number;
  sampleDiffs: UrlDiffEntry[];
  status: "success" | "warning" | "error";
}

/**
 * Runs a batch SEO and URL migration process over a collection of listings.
 * Enforces AC-25, AC-26, AC-27, AC-28, AC-30.
 */
export function runBatchSeoProcessor(
  listings: ResolvableListing[],
  options: BatchProcessingOptions = {}
): BatchSeoAuditReport {
  const startTime = Date.now();
  const isDryRun = options.dryRun !== false; // Default to safe DRY RUN
  const reason = options.reason || "Batch SEO category & URL synchronization";

  const report: BatchSeoAuditReport = {
    executionTimestamp: new Date().toISOString(),
    isDryRun,
    totalListingsEvaluated: listings.length,
    totalUrlsChanged: 0,
    totalUrlsUnchanged: 0,
    categoryDistribution: {},
    localeDistribution: { ru: 0, tg: 0, en: 0 },
    redirectMap: [],
    collisionsDetected: [],
    exceptionsLogged: [],
    durationMs: 0,
    sampleDiffs: [],
    status: "success",
  };

  const urlRegistry = new Map<string, string[]>(); // url -> listingId[]

  for (const item of listings) {
    try {
      // 1. Validation of critical fields (AC-30: no hallucinated data)
      if (!item.id) {
        report.exceptionsLogged.push({
          listingId: "unknown",
          error: "Missing required listing ID",
          field: "id",
        });
        continue;
      }
      if (!item.title || item.title.trim().length === 0) {
        report.exceptionsLogged.push({
          listingId: item.id,
          error: "Missing or empty title",
          field: "title",
        });
        continue;
      }
      if (item.priceTjs == null && item.priceUsd == null) {
        report.exceptionsLogged.push({
          listingId: item.id,
          error: "Missing price (both TJS and USD empty)",
          field: "price",
        });
      }

      // 2. Resolve category & apply override if any
      const categoryId = options.sourceCategoryOverride?.[item.id] || item.categoryId;
      const category =
        findCategoryForListing({
          dealType: item.dealType,
          propertyType: item.propertyType,
          marketSegment: item.marketSegment,
        });

      const catCode = category?.code || "uncategorized";
      report.categoryDistribution[catCode] = (report.categoryDistribution[catCode] || 0) + 1;

      // 3. Compute URLs across locales
      const oldUrl = item.slug ? normalizePath(`/classifieds/${item.slug}`) : "";
      const currentListing: ResolvableListing = { ...item, categoryId: category?.id };
      const newUrlRu = resolveListingUrl(currentListing, "ru");
      const newUrlTg = resolveListingUrl(currentListing, "tg");
      const newUrlEn = resolveListingUrl(currentListing, "en");

      report.localeDistribution.ru++;
      report.localeDistribution.tg++;
      report.localeDistribution.en++;

      // Check collision
      const existing = urlRegistry.get(newUrlRu) || [];
      existing.push(item.id);
      urlRegistry.set(newUrlRu, existing);

      const hasChanged = Boolean(oldUrl && oldUrl !== newUrlRu);
      if (hasChanged) {
        report.totalUrlsChanged++;
        report.redirectMap.push({
          from: oldUrl,
          to: newUrlRu,
          listingId: item.id,
        });

        // 4. If NOT dry run, record alias idempotently (AC-27, AC-28)
        if (!isDryRun) {
          recordUrlAlias({
            oldPath: oldUrl,
            targetPath: newUrlRu,
            entityId: item.id,
            entityType: "listing",
            reason,
          });
        }
      } else {
        report.totalUrlsUnchanged++;
      }

      // Collect sample diffs (up to 20 samples)
      if (report.sampleDiffs.length < 20) {
        report.sampleDiffs.push({
          listingId: item.id,
          title: item.title,
          oldUrl: oldUrl || newUrlRu,
          newUrl: newUrlRu,
          hasChanged,
          categoryCode: catCode,
        });
      }
    } catch (err: unknown) {
      report.exceptionsLogged.push({
        listingId: item.id,
        error: err instanceof Error ? err.message : "Unknown error during processing",
      });
    }
  }

  // Detect collisions
  for (const [url, ids] of urlRegistry.entries()) {
    if (ids.length > 1) {
      report.collisionsDetected.push({ url, listingIds: ids });
      report.status = "warning";
    }
  }

  if (report.exceptionsLogged.length > 0 && report.status !== "warning") {
    report.status = "warning";
  }

  report.durationMs = Date.now() - startTime;
  return report;
}

/**
 * Benchmark runner for 10,000+ synthetic listings in-memory.
 * Used for testing AC-25 & AC-32 to verify throughput and memory safety
 * WITHOUT writing any fake rows to the real database!
 */
export function runSyntheticScaleBenchmark(targetCount: number = 10000): BatchSeoAuditReport {
  const cities = ["khujand", "dushanbe", "gafurov", "guliston", "buston", "istaravshan"];
  const dealTypes = ["sale", "rent_long", "rent_daily"];
  const propertyTypes = ["apartment", "house", "commercial", "land"];
  const syntheticListings: ResolvableListing[] = [];

  for (let i = 1; i <= targetCount; i++) {
    const city = cities[i % cities.length];
    const dealType = dealTypes[i % dealTypes.length];
    const propertyType = propertyTypes[i % propertyTypes.length];
    syntheticListings.push({
      id: `synthetic_${i}`,
      slug: `old-legacy-classified-slug-${i}`,
      title: `${(i % 4) + 1}-комнатная квартира с ремонтом №${i}`,
      dealType,
      propertyType,
      city,
      district: i % 2 === 0 ? "19 мкр" : null,
      priceTjs: 350000 + (i % 100) * 1000,
      priceUsd: 32000 + (i % 100) * 100,
      area: 50 + (i % 80),
      rooms: (i % 4) + 1,
    });
  }

  return runBatchSeoProcessor(syntheticListings, { dryRun: true });
}
