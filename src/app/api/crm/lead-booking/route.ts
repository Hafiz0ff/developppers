import { NextRequest, NextResponse } from "next/server";
import { LeadSubmissionPayload } from "@/types/crm-booking";
import { DEFAULT_CRM_SETTINGS } from "@/lib/crm-booking-store";
import { db } from "@/db";
import { crmLeads } from "@/db/schema";
import { notifyAgentAboutNewLead } from "@/lib/telegram";

// Memory storage fallback
const inMemoryBookingLeads: LeadSubmissionPayload[] = [];

export async function POST(req: NextRequest) {
  try {
    const payload: Partial<LeadSubmissionPayload> = await req.json();

    const {
      type,
      developerId,
      projectId,
      projectName,
      phone,
      contactMode,
      scheduledDate,
      scheduledTime,
      unitNumber,
      unitPriceTjs,
      parkingNumber,
      parkingPriceTjs,
      storageNumber,
      storagePriceTjs,
      totalPriceTjs,
      consentPersonalData,
    } = payload;

    // 1. Basic validation
    if (!type || (type !== "booking" && type !== "callback")) {
      return NextResponse.json(
        { success: false, error: "Invalid lead type. Expected 'booking' or 'callback'." },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, error: "Valid phone number is required." },
        { status: 400 }
      );
    }

    if (consentPersonalData !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "Consent to personal data processing is required (consentPersonalData: true).",
        },
        { status: 400 }
      );
    }

    // 2. Server Gatekeeping (Zero Client Trust)
    // Check if CRM and scenario are active for this developer
    const devId = developerId || "dev-1";
    const devSettings = DEFAULT_CRM_SETTINGS[devId];

    // If developer settings explicitly show CRM disabled in production check
    if (devSettings && !devSettings.crmConnected) {
      return NextResponse.json(
        {
          success: false,
          error: "CRM_NOT_ACTIVE: Developer CRM is not connected.",
          code: "CRM_NOT_ACTIVE",
        },
        { status: 403 }
      );
    }

    if (devSettings && !devSettings.bookingScenarioEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: "FEATURE_DISABLED: Booking and call request scenario is turned off.",
          code: "FEATURE_DISABLED",
        },
        { status: 403 }
      );
    }

    // 3. Assemble complete sanitized record
    const leadId = `lead-bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLead: LeadSubmissionPayload = {
      leadId,
      type,
      developerId: devId,
      projectId: projectId || "unknown-project",
      projectName: projectName || "Жилой комплекс",
      phone: phone.trim(),
      contactMode: contactMode || "instant_15min",
      scheduledDate: contactMode === "scheduled" ? scheduledDate : undefined,
      scheduledTime: contactMode === "scheduled" ? scheduledTime : undefined,
      unitId: payload.unitId,
      unitNumber,
      unitPriceTjs,
      unitArea: payload.unitArea,
      parkingId: payload.parkingId,
      parkingNumber,
      parkingPriceTjs,
      storageId: payload.storageId,
      storageNumber,
      storagePriceTjs,
      totalPriceTjs: totalPriceTjs || (unitPriceTjs || 0) + (parkingPriceTjs || 0) + (storagePriceTjs || 0),
      currency: payload.currency || "TJS",
      consentPersonalData: true,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    inMemoryBookingLeads.unshift(fullLead);

    // 4. Try saving to Database if connected
    try {
      const summaryNotes = [
        type === "booking" ? "🔥 ЗАЯВКА НА БРОНИРОВАНИЕ" : "📞 ЗАКАЗ ОБРАТНОГО ЗВОНКА",
        `ЖК: ${fullLead.projectName}`,
        fullLead.unitNumber ? `Квартира: № ${fullLead.unitNumber} (${fullLead.unitArea || "?"} м²)` : null,
        fullLead.parkingNumber ? `Паркинг: № ${fullLead.parkingNumber}` : null,
        fullLead.storageNumber ? `Кладовая: № ${fullLead.storageNumber}` : null,
        `Итоговая стоимость: ${fullLead.totalPriceTjs.toLocaleString("ru-RU")} сомони`,
        contactMode === "instant_15min"
          ? "Время связи: в течение 15 минут"
          : `Время связи: ${fullLead.scheduledDate || "Сегодня"} в ${fullLead.scheduledTime || "удобное время"}`,
      ]
        .filter(Boolean)
        .join(" | ");

      await db.insert(crmLeads).values({
        id: fullLead.leadId,
        agentId: fullLead.developerId,
        clientName: type === "booking" ? "Покупатель (Бронь)" : "Клиент (Звонок)",
        clientPhone: fullLead.phone,
        status: "new",
        budget: Math.round(fullLead.totalPriceTjs / 10.9), // TJS -> USD approximate
        commission: Math.round((fullLead.totalPriceTjs / 10.9) * 0.02),
        commissionPercent: 2,
        source: type === "booking" ? "booking_scenario" : "callback_scenario",
        notes: summaryNotes,
      } as any);
    } catch {
      // In-memory fallback is already recorded
    }

    // 5. Send Telegram notification (push to sales team)
    try {
      const timingText =
        contactMode === "instant_15min"
          ? "⚡ Срочно: в течение 15 минут!"
          : `📅 Запланировано: ${fullLead.scheduledDate || "Сегодня"} в ${fullLead.scheduledTime || "удобное время"}`;

      const objectsText = [
        fullLead.unitNumber ? `Квартира №${fullLead.unitNumber}` : "",
        fullLead.parkingNumber ? `Паркинг №${fullLead.parkingNumber}` : "",
        fullLead.storageNumber ? `Кладовая №${fullLead.storageNumber}` : "",
      ]
        .filter(Boolean)
        .join(" + ");

      notifyAgentAboutNewLead({
        clientName: type === "booking" ? "Заявка на бронирование" : "Заказ обратного звонка",
        clientPhone: fullLead.phone,
        classifiedTitle: `${fullLead.projectName} [${objectsText || "Консультация"}]`,
        budget: Math.round(fullLead.totalPriceTjs / 10.9),
        commission: Math.round((fullLead.totalPriceTjs / 10.9) * 0.02),
        source: type === "booking" ? "Сценарий бронирования" : "Обратный звонок",
        notes: `${timingText}. Сумма: ${fullLead.totalPriceTjs.toLocaleString("ru-RU")} сомони.`,
        crmUrl: "https://sogd-realty.vercel.app/developer-admin",
      }).catch((err) => console.error("[Telegram Push Error]:", err));
    } catch {
      // Ignored
    }

    return NextResponse.json({
      success: true,
      leadId: fullLead.leadId,
      message: "Lead successfully recorded into CRM pipeline.",
      lead: fullLead,
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error submitting lead" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const developerId = searchParams.get("developerId");

  const results = developerId
    ? inMemoryBookingLeads.filter((l) => l.developerId === developerId)
    : inMemoryBookingLeads;

  return NextResponse.json({
    success: true,
    leads: results,
  });
}
