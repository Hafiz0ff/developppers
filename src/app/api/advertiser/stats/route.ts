import { NextRequest, NextResponse } from "next/server";
import { getAdvertiserDetailedMetrics, getAdvertiserById } from "@/lib/ads/ad-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const advertiserId = searchParams.get("advertiserId");

    if (!advertiserId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: advertiserId" },
        { status: 400 }
      );
    }

    const adv = getAdvertiserById(advertiserId);
    if (!adv) {
      return NextResponse.json(
        { success: false, error: "Advertiser not found" },
        { status: 404 }
      );
    }

    const metrics = getAdvertiserDetailedMetrics(advertiserId);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
