import { NextRequest, NextResponse } from "next/server";
import {
  getFacets,
  getFacetById,
  upsertFacet,
  deleteFacet,
  type FacetConfig,
} from "@/lib/seo/facet-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const facets = getFacets();
    const filtered = categoryId ? facets.filter((f) => f.categoryId === categoryId) : facets;

    return NextResponse.json({
      success: true,
      facets: filtered,
      totalCount: filtered.length,
      hasOwnPageCount: filtered.filter((f) => f.hasOwnPage).length,
      indexableCount: filtered.filter((f) => f.indexable).length,
    });
  } catch (error) {
    console.error("Super Admin Facets GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.categoryId || !body.facetKey || !body.valueKey) {
      return NextResponse.json(
        { success: false, error: "id, categoryId, facetKey, and valueKey are required" },
        { status: 400 }
      );
    }

    const facet: FacetConfig = {
      id: body.id,
      categoryId: body.categoryId,
      facetKey: body.facetKey,
      valueKey: body.valueKey,
      displayName: {
        ru: body.displayName?.ru || body.valueKey,
        tg: body.displayName?.tg || body.displayName?.ru || body.valueKey,
        en: body.displayName?.en || body.displayName?.ru || body.valueKey,
      },
      valueSlug: {
        ru: body.valueSlug?.ru || body.valueKey,
        tg: body.valueSlug?.tg || body.valueSlug?.ru || body.valueKey,
        en: body.valueSlug?.en || body.valueSlug?.ru || body.valueKey,
      },
      hasOwnPage: Boolean(body.hasOwnPage),
      indexable: Boolean(body.indexable),
      sortOrder: Number(body.sortOrder) || 1,
      active: body.active !== false,
      seoTemplates: body.seoTemplates || {
        h1: { ru: "{title}", tg: "{title}", en: "{title}" },
        title: { ru: "{title} | Maskani", tg: "{title} | Maskani", en: "{title} | Maskani" },
        description: { ru: "{description}", tg: "{description}", en: "{description}" },
      },
    };

    const saved = upsertFacet(facet);
    return NextResponse.json({ success: true, facet: saved }, { status: 201 });
  } catch (error: unknown) {
    console.error("Super Admin Facet POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id parameter required" }, { status: 400 });
    }

    const success = deleteFacet(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Super Admin Facet DELETE error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
