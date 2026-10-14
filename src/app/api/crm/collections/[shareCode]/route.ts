import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crmCollections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPropertiesByIds } from "@/lib/catalog-data";
import {
  findInMemoryCollection,
  incrementInMemoryViews,
} from "@/lib/crm-collections-store";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await context.params;

    let collection: any = null;

    try {
      const records = await db
        .select()
        .from(crmCollections)
        .where(eq(crmCollections.shareCode, shareCode))
        .limit(1);

      if (records.length > 0) {
        collection = records[0];
        await db
          .update(crmCollections)
          .set({ viewsCount: (collection.viewsCount || 0) + 1 })
          .where(eq(crmCollections.id, collection.id));
      }
    } catch {
      // DB offline fallback
    }

    if (!collection) {
      collection = findInMemoryCollection(shareCode);
      if (collection) {
        incrementInMemoryViews(collection.id);
      }
    }

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Подборка не найдена или срок действия ссылки истек" },
        { status: 404 }
      );
    }

    let parsedIds: string[] = [];
    try {
      parsedIds = JSON.parse(collection.propertyIds || "[]");
    } catch {
      parsedIds = [];
    }

    const properties = getPropertiesByIds(parsedIds);

    return NextResponse.json({
      success: true,
      collection: {
        ...collection,
        propertyIds: parsedIds,
      },
      properties,
    });
  } catch (error) {
    console.error("CRM Collection share code GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
