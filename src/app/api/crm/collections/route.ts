import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crmCollections } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  addInMemoryCollection,
  listInMemoryCollections,
} from "@/lib/crm-collections-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agent_id") || "agent-default";

    try {
      const records = await db
        .select()
        .from(crmCollections)
        .where(eq(crmCollections.agentId, agentId))
        .orderBy(desc(crmCollections.createdAt));

      if (records && records.length > 0) {
        return NextResponse.json({ success: true, collections: records });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      collections: listInMemoryCollections(agentId),
      isDemo: true,
    });
  } catch (error) {
    console.error("CRM Collections GET error:", error);
    return NextResponse.json(
      { success: false, collections: listInMemoryCollections() },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = "Персональная подборка недвижимости",
      notes = "Подборка проверенных вариантов от вашего специалиста",
      propertyIds = [],
      agentName = "Рустам Ахмедов (Маклер)",
      agentPhone = "+992 92 777 00 22",
      agentAgency = "Maskani Партнер",
      agentAvatar,
      agentId = "agent-default",
    } = body;

    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Выберите хотя бы один объект для подборки" },
        { status: 400 }
      );
    }

    // Генерируем компактный читаемый код ссылки
    const shareCode = `pick-${Math.random().toString(36).substring(2, 7)}`;

    const newCollection = {
      id: `col-${Date.now()}`,
      shareCode,
      agentId,
      agentName,
      agentPhone,
      agentAvatar:
        agentAvatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
      agentAgency,
      title,
      notes,
      propertyIds: JSON.stringify(propertyIds),
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.insert(crmCollections).values(newCollection as any);
    } catch {
      // Store in memory
    }

    addInMemoryCollection(newCollection);

    const shareUrl = `/p/${shareCode}`;

    return NextResponse.json({
      success: true,
      collection: newCollection,
      shareUrl,
    });
  } catch (error) {
    console.error("CRM Collections POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
