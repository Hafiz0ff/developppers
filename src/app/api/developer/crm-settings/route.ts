import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CRM_SETTINGS } from "@/lib/crm-booking-store";
import { DeveloperCrmSettings } from "@/types/crm-booking";

// In-memory runtime state for settings
const runtimeSettings: Record<string, DeveloperCrmSettings> = {
  ...DEFAULT_CRM_SETTINGS,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const developerId = searchParams.get("developerId") || "dev-1";

  const settings = runtimeSettings[developerId] || {
    developerId,
    crmConnected: false,
    bookingScenarioEnabled: false,
    workHoursStart: "09:00",
    workHoursEnd: "22:00",
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { developerId = "dev-1", crmConnected, bookingScenarioEnabled, workHoursStart, workHoursEnd } = body;

    const current = runtimeSettings[developerId] || {
      developerId,
      crmConnected: false,
      bookingScenarioEnabled: false,
      workHoursStart: "09:00",
      workHoursEnd: "22:00",
      updatedAt: new Date().toISOString(),
    };

    const updated: DeveloperCrmSettings = {
      ...current,
      crmConnected: typeof crmConnected === "boolean" ? crmConnected : current.crmConnected,
      bookingScenarioEnabled:
        typeof bookingScenarioEnabled === "boolean"
          ? bookingScenarioEnabled
          : current.bookingScenarioEnabled,
      workHoursStart: workHoursStart || current.workHoursStart,
      workHoursEnd: workHoursEnd || current.workHoursEnd,
      updatedAt: new Date().toISOString(),
    };

    // Rule: if CRM is disconnected, scenario cannot remain ON
    if (!updated.crmConnected) {
      updated.bookingScenarioEnabled = false;
    }

    runtimeSettings[developerId] = updated;

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
