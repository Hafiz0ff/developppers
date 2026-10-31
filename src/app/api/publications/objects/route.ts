import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { getOwnedPublishableObjects } from "@/lib/publications/ownership";

export interface PublishableObjectSummary {
  id: string;
  type: "classified" | "project";
  title: string;
  titleTg?: string;
  dealType: string;
  propertyType: string;
  priceTjs: number;
  priceUsd?: number;
  location: string;
  locationTg?: string;
  image: string;
  photosCount: number;
  status: string;
}

export async function GET(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const { searchParams } = new URL(req.url);

    // Support demoRole or x-demo-role header if not logged in via session
    const demoRole = searchParams.get("demoRole") || req.headers.get("x-demo-role");
    const role = actor?.role || demoRole || null;
    const actorId = actor?.id || (role === "developer" ? "usr_dev_rep_01" : "usr_realtor_01");

    // Rule TZ Section 3.1, 3.2, 5 & 11: Only Realtor, Agency, Developer, and Super Admin are allowed
    const isRealtor = role === "realtor" || role === "agency_agent" || role === "agency";
    const isDeveloper = role === "developer";
    const isSuperAdmin = role === "super_admin" || role === "admin";

    if (!role || (!isRealtor && !isDeveloper && !isSuperAdmin)) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ к модулю публикации разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    // Strict ownership filtering (Section 3 & 4)
    const items = getOwnedPublishableObjects(role, actorId);

    return NextResponse.json({
      success: true,
      role,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Publications Objects GET error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при получении списка объектов" },
      { status: 500 }
    );
  }
}
