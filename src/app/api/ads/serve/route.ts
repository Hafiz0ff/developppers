import { NextRequest, NextResponse } from "next/server";
import { serveAdBanner } from "@/lib/ads/ad-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "all";
    const category = searchParams.get("category") || "all";
    const slot = (searchParams.get("slot") as any) || "catalog_banner";
    const lang = (searchParams.get("lang") as "ru" | "tg") || "ru";

    const banner = serveAdBanner({
      city,
      category,
      slot,
      language: lang,
    });

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to serve ad banner" },
      { status: 500 }
    );
  }
}
