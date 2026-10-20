import { NextResponse } from "next/server";
import { getSuperAdminAdAnalytics } from "@/lib/ads/ad-engine";

export async function GET() {
  try {
    const analytics = getSuperAdminAdAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load advertising analytics" },
      { status: 500 }
    );
  }
}
