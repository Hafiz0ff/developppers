import { NextRequest, NextResponse } from "next/server";
import { generateReconciliationAct } from "@/lib/ads/ad-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const advertiserId = searchParams.get("advertiserId");

    if (!advertiserId) {
      return NextResponse.json(
        { success: false, error: "Missing advertiserId parameter" },
        { status: 400 }
      );
    }

    const act = generateReconciliationAct(advertiserId);
    if (!act) {
      return NextResponse.json(
        { success: false, error: "Advertiser not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      act,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate reconciliation act" },
      { status: 500 }
    );
  }
}
