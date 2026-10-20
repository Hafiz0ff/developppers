import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { classifieds } from "@/db/schema";
import type { NewClassified } from "@/db/schema";
import {
  CLASSIFIEDS_AUTO_APPROVE,
  CLASSIFIEDS_REQUIRE_PHONE,
  canPostClassified,
  initialClassifiedStatus,
} from "@/lib/classifieds/access";
import { classifiedInputSchema } from "@/lib/classifieds/schema";
import { filterPublicClassifieds, parseClassifiedListQuery } from "@/lib/classifieds/filters";
import { mapClassifiedToCard, toFilterable, type ClassifiedCard } from "@/lib/classifieds/map-card";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { makeClassifiedSlug } from "@/lib/classifieds/slug";
import { canCreateAnotherAd } from "@/lib/classifieds/rate-limit";
import { CATALOG_PROPERTIES } from "@/lib/catalog-data";
import { sortClassifiedsWithVas } from "@/lib/classifieds/vas-engine";

function numeric(value: number | null | undefined): string | null {
  if (value == null) return null;
  return value.toFixed(2);
}

export async function GET(req: NextRequest) {
  try {
    const mine = req.nextUrl.searchParams.get("mine") === "1";
    const actor = await getClassifiedsActor();

    if (mine) {
      if (!actor) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
      }
      const rows = await db
        .select()
        .from(classifieds)
        .where(eq(classifieds.userId, actor.id))
        .orderBy(desc(classifieds.createdAt));
      return NextResponse.json({
        success: true,
        classifieds: rows.map(mapClassifiedToCard),
      });
    }

    let rows: (typeof classifieds.$inferSelect)[] = [];
    try {
      rows = await db.select().from(classifieds).orderBy(desc(classifieds.createdAt));
    } catch {
      // In case db is unavailable or not seeded
    }

    const query = parseClassifiedListQuery({
      city: req.nextUrl.searchParams.get("city") ?? undefined,
      propertyType: req.nextUrl.searchParams.get("propertyType") ?? undefined,
      dealType: req.nextUrl.searchParams.get("dealType") ?? undefined,
      rooms: req.nextUrl.searchParams.get("rooms") ?? undefined,
      priceMin: req.nextUrl.searchParams.get("priceMin") ?? undefined,
      priceMax: req.nextUrl.searchParams.get("priceMax") ?? undefined,
      q: req.nextUrl.searchParams.get("q") ?? undefined,
    });

    if (rows.length === 0) {
      // Graceful fallback to CATALOG_PROPERTIES with query filtering
      const demoCards: ClassifiedCard[] = CATALOG_PROPERTIES.map((prop) => ({
        ...prop,
        slug: prop.slug || `classified-${prop.id}`,
        status: "active",
        viewsCount: 24,
        userId: "demo",
      }));

      const filteredDemo = demoCards.filter((card) => {
        if (query.city && query.city !== "all") {
          const c = query.city.toLowerCase();
          const cardCity = card.city.toLowerCase();
          if (c === "khujand" && !cardCity.includes("хуҷанд") && !cardCity.includes("худжанд")) return false;
          if (c === "gafurov" && !cardCity.includes("ғафуров") && !cardCity.includes("гафуров")) return false;
          if (c === "guliston" && !cardCity.includes("гулистон") && !cardCity.includes("кайрак")) return false;
        }
        if (query.propertyType && query.propertyType !== "all") {
          const pt = query.propertyType;
          if (pt === "apartment" && card.propertyType !== "Квартира" && card.propertyType !== "Новостройка") return false;
          if (pt === "house" && !card.propertyType.includes("Ҳавлӣ") && !card.propertyType.includes("Дом")) return false;
          if (pt === "commercial" && card.propertyType !== "Коммерция") return false;
        }
        if (query.dealType && query.dealType !== "all") {
          if (query.dealType === "sale" && card.dealType !== "Продажа") return false;
          if (query.dealType.includes("rent") && card.dealType !== "Аренда") return false;
        }
        if (query.rooms && query.rooms !== "all") {
          if (query.rooms === "4+") {
            if (card.rooms < 4) return false;
          } else {
            if (card.rooms !== Number(query.rooms)) return false;
          }
        }
        if (query.q) {
          const q = query.q.toLowerCase();
          const match = card.title.toLowerCase().includes(q) || card.district.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });

      return NextResponse.json({ success: true, classifieds: sortClassifiedsWithVas(filteredDemo) });
    }

    const listed = filterPublicClassifieds(rows.map(toFilterable), query);
    const byId = new Map(rows.map((row) => [row.id, row]));
    const classifiedsOut = listed
      .map((item) => byId.get(item.id))
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .map(mapClassifiedToCard);

    return NextResponse.json({ success: true, classifieds: sortClassifiedsWithVas(classifiedsOut) });
  } catch (error) {
    console.error("Classifieds GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    if (!actor) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    if (!canPostClassified(actor.role)) {
      return NextResponse.json({ success: false, error: "citizens_only" }, { status: 403 });
    }
    if (CLASSIFIEDS_REQUIRE_PHONE && !actor.phoneVerified) {
      return NextResponse.json({ success: false, error: "phone_unverified" }, { status: 403 });
    }

    const json: unknown = await req.json();
    const parsed = classifiedInputSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "invalid_input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.website && parsed.data.website.trim() !== "") {
      return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
    }

    const existing = await db
      .select({ createdAt: classifieds.createdAt })
      .from(classifieds)
      .where(eq(classifieds.userId, actor.id));
    if (!canCreateAnotherAd(existing.map((row) => row.createdAt))) {
      return NextResponse.json({ success: false, error: "rate_limited" }, { status: 429 });
    }

    const id = `cls_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const slug = makeClassifiedSlug(parsed.data.title, id);
    const status = initialClassifiedStatus({ autoApprove: CLASSIFIEDS_AUTO_APPROVE });
    const input = parsed.data;

    const values: NewClassified = {
      id,
      userId: actor.id,
      title: input.title,
      slug,
      description: input.description,
      dealType: input.dealType,
      propertyType: input.propertyType,
      status,
      city: input.city,
      district: input.district || null,
      address: input.address,
      landmark: input.landmark || null,
      roomsCount: input.roomsCount ?? null,
      totalArea: input.totalArea.toFixed(2),
      livingArea: numeric(input.livingArea ?? null),
      kitchenArea: numeric(input.kitchenArea ?? null),
      landAreaSotka: numeric(input.landAreaSotka ?? null),
      floor: input.floor ?? null,
      floorsCount: input.floorsCount ?? null,
      buildingType: input.buildingType ?? null,
      renovation: input.renovation ?? null,
      hasCityWater: input.hasCityWater,
      hasWaterHauz: input.hasWaterHauz,
      hasElectricity: input.hasElectricity,
      hasHeating: input.hasHeating,
      hasSewerage: input.hasSewerage,
      isFurnished: input.isFurnished,
      originalCurrency: input.originalCurrency,
      priceTjs: input.priceTjs.toFixed(2),
      priceUsd: input.priceUsd.toFixed(2),
      isNegotiable: input.isNegotiable,
      exchangePossible: input.exchangePossible,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      contactPhoneSecondary: input.contactPhoneSecondary ?? null,
      contactWhatsapp: input.contactWhatsapp ?? null,
      contactTelegram: input.contactTelegram ?? null,
      photos: input.photos,
      viewsCount: 0,
    };

    await db.insert(classifieds).values(values);
    const created = await db.select().from(classifieds).where(eq(classifieds.id, id)).limit(1);
    const row = created[0];
    if (!row) {
      return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      classified: mapClassifiedToCard(row),
    });
  } catch (error) {
    console.error("Classifieds POST error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
