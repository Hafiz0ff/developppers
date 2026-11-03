import { NextResponse } from "next/server";
import {
  getShowcaseMiniCards,
  getShowcaseSections,
  updateMiniCard,
  updateShowcaseSection,
  resetShowcaseToDefaults,
  type ShowcaseMiniCardConfig,
  type ShowcaseSectionConfig,
} from "@/lib/showcase/showcase-store";
import { getTaxonomyCategories } from "@/lib/seo/taxonomy-store";

const VALID_CATALOGS = [
  "cat_sale_new_builds",
  "cat_sale_resale",
  "cat_sale_houses",
  "cat_sale_commercial",
  "cat_rent_apartments",
  "cat_deal_sale",
  "cat_deal_rent",
  "catalog_commercial_hub",
  "catalog_services",
  "catalog_realtors",
  "catalog_developers",
  "catalog_agencies",
  "blog",
];

export async function GET() {
  const miniCards = getShowcaseMiniCards();
  const sections = getShowcaseSections();

  return NextResponse.json({
    success: true,
    miniCards,
    sections,
    allowedTargets: {
      categories: getTaxonomyCategories().map((c) => ({
        id: c.id,
        name: c.name.ru,
        slug: c.slug.ru,
      })),
      catalogs: [
        { id: "catalog_commercial_hub", name: "Коммерческая недвижимость (хаб)" },
        { id: "catalog_services", name: "Каталог услуг" },
        { id: "catalog_realtors", name: "Каталог риелторов" },
        { id: "catalog_developers", name: "Каталог застройщиков" },
        { id: "catalog_agencies", name: "Каталог агентств недвижимости" },
        { id: "blog", name: "Блог и статьи (/blog)" },
      ],
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_mini_card") {
      const { id, updates } = body;
      // Prohibit manual count tampering (AC-40)
      if ("badge" in updates || "badgeCount" in updates || "count" in updates) {
        return NextResponse.json(
          { success: false, error: "Счётчик рассчитывается автоматически и не подлежит ручному вводу." },
          { status: 400 }
        );
      }

      // Prohibit arbitrary URL input (AC-35)
      if (updates.targetId && !VALID_CATALOGS.includes(updates.targetId)) {
        return NextResponse.json(
          { success: false, error: `Недопустимый targetId: ${updates.targetId}. Выберите из реестра.` },
          { status: 400 }
        );
      }

      const updated = updateMiniCard(id, updates);
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "update_section") {
      const { id, updates } = body;
      const updated = updateShowcaseSection(id, updates);
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "reset_defaults") {
      resetShowcaseToDefaults();
      return NextResponse.json({
        success: true,
        miniCards: getShowcaseMiniCards(),
        sections: getShowcaseSections(),
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
