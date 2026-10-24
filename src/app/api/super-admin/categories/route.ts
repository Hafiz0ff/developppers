import { NextRequest, NextResponse } from "next/server";
import {
  getTaxonomyCategories,
  getTaxonomyCategoryById,
  createTaxonomyCategory,
  updateTaxonomyCategory,
  type TaxonomyCategory,
  type LocalizedString,
  transliterateToSlug,
} from "@/lib/seo/taxonomy-store";
import { recordUrlAlias } from "@/lib/seo/url-alias-store";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { resolveListingUrl, type ResolvableListing } from "@/lib/seo/url-resolver";

export async function GET() {
  try {
    const categories = getTaxonomyCategories();

    // Calculate listing distribution across actual catalog
    const categoryCounts: Record<string, number> = {};
    for (const prop of CATALOG_PROPERTIES) {
      const dealNorm = prop.dealType === "Аренда" ? "rent" : "sale";
      const propNorm = prop.propertyType.toLowerCase();
      let code = "sale_resale";
      if (dealNorm === "rent") {
        code = "rent_apartments";
      } else if (propNorm.includes("дом") || propNorm.includes("ҳавлӣ")) {
        code = "sale_houses";
      } else if (propNorm.includes("новострой")) {
        code = "sale_new_builds";
      } else if (propNorm.includes("коммерц")) {
        code = "sale_commercial";
      }
      categoryCounts[code] = (categoryCounts[code] || 0) + 1;
    }

    const enriched = categories.map((cat) => ({
      ...cat,
      listingsCount: categoryCounts[cat.code] || 0,
    }));

    return NextResponse.json({
      success: true,
      categories: enriched,
      totalCount: categories.length,
      indexableCount: categories.filter((c) => c.indexable).length,
    });
  } catch (error) {
    console.error("Super Admin Categories GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.name?.ru) {
      return NextResponse.json(
        { success: false, error: "code and name.ru are required" },
        { status: 400 }
      );
    }

    const created = createTaxonomyCategory({
      code: body.code,
      name: {
        ru: body.name.ru,
        tg: body.name.tg || body.name.ru,
        en: body.name.en || body.name.ru,
      },
      slug: {
        ru: body.slug?.ru || transliterateToSlug(body.name.ru),
        tg: body.slug?.tg || transliterateToSlug(body.name.tg || body.name.ru),
        en: body.slug?.en || transliterateToSlug(body.name.en || body.name.ru),
      },
      slugMode: body.slugMode || "MANUAL",
      parentId: body.parentId || null,
      routeKind: body.routeKind || "combined",
      dealType: body.dealType,
      propertyType: body.propertyType,
      marketSegment: body.marketSegment,
      active: body.active !== false,
      indexable: Boolean(body.indexable), // Rule AC-23: false by default
      displayOrder: body.displayOrder || 99,
      seoTemplates: body.seoTemplates || {
        h1: { ru: "{title}", tg: "{title}", en: "{title}" },
        title: { ru: "{title} | Maskani", tg: "{title} | Maskani", en: "{title} | Maskani" },
        description: { ru: "{description}", tg: "{description}", en: "{description}" },
      },
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: unknown) {
    console.error("Super Admin Category POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isPreview, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID required" }, { status: 400 });
    }

    const current = getTaxonomyCategoryById(id);
    if (!current) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    // If PREVIEW requested (Rule AC-04 / AC-22):
    // Calculate affected URLs and return diff before changing
    if (isPreview) {
      const proposedSlug: LocalizedString = {
        ru: updates.slug?.ru || (updates.slugMode === "AUTO" && updates.name?.ru ? transliterateToSlug(updates.name.ru) : current.slug.ru),
        tg: updates.slug?.tg || (updates.slugMode === "AUTO" && updates.name?.tg ? transliterateToSlug(updates.name.tg) : current.slug.tg),
        en: updates.slug?.en || (updates.slugMode === "AUTO" && updates.name?.en ? transliterateToSlug(updates.name.en) : current.slug.en),
      };

      const sampleOldUrls: string[] = [];
      const sampleNewUrls: string[] = [];
      const redirectPlan: Array<{ from: string; to: string }> = [];

      // Calculate for matching actual listings
      let affectedCount = 0;
      for (const p of CATALOG_PROPERTIES) {
        const item: ResolvableListing = {
          id: p.id,
          title: p.title,
          dealType: p.dealType,
          propertyType: p.propertyType,
          city: p.city,
          district: p.district,
          priceTjs: p.priceTjs,
          priceUsd: p.priceUsd,
          categoryId: current.id,
        };

        const oldUrl = resolveListingUrl(item, "ru");
        // Clone category with proposed slug for preview
        const tempCategory: TaxonomyCategory = { ...current, slug: proposedSlug };
        const newUrl = oldUrl.replace(`/${current.slug.ru}/`, `/${proposedSlug.ru}/`);

        if (oldUrl !== newUrl) {
          affectedCount++;
          if (sampleOldUrls.length < 5) {
            sampleOldUrls.push(oldUrl);
            sampleNewUrls.push(newUrl);
            redirectPlan.push({ from: oldUrl, to: newUrl });
          }
        }
      }

      return NextResponse.json({
        success: true,
        preview: {
          categoryId: id,
          currentSlug: current.slug,
          proposedSlug,
          affectedListingsCount: affectedCount,
          sampleOldUrls,
          sampleNewUrls,
          redirectPlan,
          requiresConfirmation: affectedCount > 0,
        },
      });
    }

    // Actual Update
    const updated = updateTaxonomyCategory(id, updates);

    // If slug changed, record URL aliases for affected catalog items
    if (updates.slug?.ru && updates.slug.ru !== current.slug.ru) {
      for (const p of CATALOG_PROPERTIES) {
        const item: ResolvableListing = {
          id: p.id,
          title: p.title,
          dealType: p.dealType,
          propertyType: p.propertyType,
          city: p.city,
          district: p.district,
          priceTjs: p.priceTjs,
          priceUsd: p.priceUsd,
          categoryId: current.id,
        };

        const oldPath = resolveListingUrl(item, "ru");
        const newPath = oldPath.replace(`/${current.slug.ru}/`, `/${updates.slug.ru}/`);

        if (oldPath !== newPath) {
          recordUrlAlias({
            oldPath,
            targetPath: newPath,
            entityId: p.id,
            entityType: "listing",
            reason: `Category ${current.code} slug changed from ${current.slug.ru} to ${updates.slug.ru}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: unknown) {
    console.error("Super Admin Category PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 400 }
    );
  }
}
