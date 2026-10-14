import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { classifieds } from "@/db/schema";
import { canMutateClassified } from "@/lib/classifieds/access";
import { classifiedInputSchema } from "@/lib/classifieds/schema";
import { mapClassifiedToCard, type ClassifiedCard } from "@/lib/classifieds/map-card";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { CATALOG_PROPERTIES, getPropertyById } from "@/lib/catalog-data";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    let row: typeof classifieds.$inferSelect | undefined;
    try {
      const rows = await db
        .select()
        .from(classifieds)
        .where(or(eq(classifieds.id, id), eq(classifieds.slug, id)))
        .limit(1);
      row = rows[0];
    } catch {
      // In case db query fails or table empty
    }

    if (row) {
      const actor = await getClassifiedsActor();
      if (row.status !== "active" && actor?.id !== row.userId) {
        return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, classified: mapClassifiedToCard(row), raw: row });
    }

    // Check catalog properties fallback
    const demoProp =
      getPropertyById(id) ||
      CATALOG_PROPERTIES.find(
        (p) =>
          p.id === id ||
          p.slug === id ||
          `classified-${p.id}` === id ||
          id.toLowerCase().includes(p.id.toLowerCase())
      );
    if (demoProp) {
      const card: ClassifiedCard = {
        ...demoProp,
        slug: demoProp.slug || `classified-${demoProp.id}`,
        status: "active",
        viewsCount: 48,
        userId: "demo",
      };
      return NextResponse.json({ success: true, classified: card, raw: null });
    }

    return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
  } catch (error) {
    console.error("Classified GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await getClassifiedsActor();
    if (!actor) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const rows = await db.select().from(classifieds).where(eq(classifieds.id, id)).limit(1);
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
    }
    if (!canMutateClassified({ actorId: actor.id, actorRole: actor.role, ownerId: row.userId })) {
      return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
    }

    const json: unknown = await req.json();
    const parsed = classifiedInputSchema.partial().safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "invalid_input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    await db
      .update(classifieds)
      .set({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.dealType !== undefined && { dealType: input.dealType }),
        ...(input.propertyType !== undefined && { propertyType: input.propertyType }),
        ...(input.city !== undefined && { city: input.city }),
        ...(input.district !== undefined && { district: input.district || null }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.landmark !== undefined && { landmark: input.landmark || null }),
        ...(input.roomsCount !== undefined && { roomsCount: input.roomsCount ?? null }),
        ...(input.totalArea !== undefined && { totalArea: input.totalArea.toFixed(2) }),
        ...(input.priceTjs !== undefined && { priceTjs: input.priceTjs.toFixed(2) }),
        ...(input.priceUsd !== undefined && { priceUsd: input.priceUsd.toFixed(2) }),
        ...(input.originalCurrency !== undefined && { originalCurrency: input.originalCurrency }),
        ...(input.isNegotiable !== undefined && { isNegotiable: input.isNegotiable }),
        ...(input.contactName !== undefined && { contactName: input.contactName }),
        ...(input.contactPhone !== undefined && { contactPhone: input.contactPhone }),
        ...(input.contactWhatsapp !== undefined && { contactWhatsapp: input.contactWhatsapp ?? null }),
        ...(input.photos !== undefined && { photos: input.photos }),
        updatedAt: new Date(),
      })
      .where(eq(classifieds.id, id));

    const updated = await db.select().from(classifieds).where(eq(classifieds.id, id)).limit(1);
    return NextResponse.json({
      success: true,
      classified: updated[0] ? mapClassifiedToCard(updated[0]) : null,
    });
  } catch (error) {
    console.error("Classified PATCH error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
