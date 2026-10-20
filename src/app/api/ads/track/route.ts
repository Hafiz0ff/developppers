import { NextRequest, NextResponse } from "next/server";
import { recordAdClick } from "@/lib/ads/ad-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, creativeId, eventType } = body;

    if (!campaignId || !creativeId) {
      return NextResponse.json(
        { success: false, error: "Missing campaignId or creativeId" },
        { status: 400 }
      );
    }

    if (eventType === "click") {
      recordAdClick(campaignId, creativeId);
    }

    return NextResponse.json({
      success: true,
      tracked: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record tracking event" },
      { status: 500 }
    );
  }
}
