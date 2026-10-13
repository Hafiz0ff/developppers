import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crmCollections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CATALOG_PROPERTIES, getPropertiesByIds } from "@/lib/catalog-data";

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
        // Инкрементируем просмотры
        await db
          .update(crmCollections)
          .set({ viewsCount: (collection.viewsCount || 0) + 1 })
          .where(eq(crmCollections.id, collection.id));
      }
    } catch {
      // DB offline fallback
    }

    // Если нет в БД, проверяем дефолтные подборки
    if (!collection) {
      if (shareCode === "khujand-top3" || shareCode.startsWith("pick-")) {
        collection = {
          id: "col-demo-1",
          shareCode,
          agentId: "agent-default",
          agentName: "Рустам Ахмедов",
          agentPhone: "+992 92 777 00 22",
          agentAvatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
          agentAgency: "Агентство «Сугд-Инвест»",
          title: "Эксклюзивная подборка проверенных квартир в Худжанде",
          notes:
            "Здравствуйте! Отобрал для вас 3 самых надежных объекта со свежим ремонтом, готовыми документами (техпаспорт) и возможностью торга.",
          propertyIds: JSON.stringify(["c1", "c4", "c2"]),
          viewsCount: 15,
          createdAt: new Date(),
        };
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
      parsedIds = ["c1", "c2"];
    }

    // Достаем объекты из каталога
    let properties = getPropertiesByIds(parsedIds);
    if (properties.length === 0) {
      properties = CATALOG_PROPERTIES.slice(0, 3);
    }

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
