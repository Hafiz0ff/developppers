import { NextRequest, NextResponse } from "next/server";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { runBatchSeoProcessor } from "@/lib/seo/batch-seo-processor";
import type { ResolvableListing } from "@/lib/seo/url-resolver";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun !== false; // Default true

    // Extract actual project listings from catalog
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
      districtTg: p.districtTg,
      priceTjs: p.priceTjs,
      priceUsd: p.priceUsd,
      area: p.area,
      rooms: p.rooms,
      status: "active",
      updatedAt: new Date().toISOString(),
    }));

    const report = runBatchSeoProcessor(listings, {
      dryRun,
      reason: body.reason || "Super Admin SEO Audit & URL Synchronization",
      sourceCategoryOverride: body.categoryOverrides,
    });

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    console.error("Super Admin SEO DRY RUN error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 500 }
    );
  }
}
