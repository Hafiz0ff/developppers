import { NextRequest, NextResponse } from "next/server";
import {
  getServerCrmSettings,
  updateServerCrmSettings,
} from "@/lib/crm-booking-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const developerId = searchParams.get("developerId") || "dev-1";

  const settings = getServerCrmSettings(developerId);

  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      developerId = "dev-1",
      crmConnected,
      bookingScenarioEnabled,
      workHoursStart,
      workHoursEnd,
    } = body;

    const current = getServerCrmSettings(developerId);

    const updated = updateServerCrmSettings(developerId, {
      crmConnected:
        typeof crmConnected === "boolean" ? crmConnected : current.crmConnected,
      bookingScenarioEnabled:
        typeof bookingScenarioEnabled === "boolean"
          ? bookingScenarioEnabled
          : current.bookingScenarioEnabled,
      workHoursStart: workHoursStart || current.workHoursStart,
      workHoursEnd: workHoursEnd || current.workHoursEnd,
    });

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error) {
    console.error("Error updating developer CRM settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
