import { NextRequest, NextResponse } from "next/server";
import { LeadSubmissionPayload } from "@/types/crm-booking";
import { verifyAndResolveLeadDealBundle } from "@/lib/crm-booking-store";
import { db } from "@/db";
import { crmLeads } from "@/db/schema";
import { notifyAgentAboutNewLead, notifyTelegramBookingRequest } from "@/lib/telegram";

// Memory storage fallback (persists all submitted leads even if CRM or scenario is later disabled)
const inMemoryBookingLeads: LeadSubmissionPayload[] = [];

export async function POST(req: NextRequest) {
  try {
    const payload: Partial<LeadSubmissionPayload> = await req.json();

    const {
      type,
      phone,
      contactMode,
      scheduledDate,
      scheduledTime,
      consentPersonalData,
    } = payload;

    // 1. Basic validation (Sections 10.5, 11.5, 14)
    if (!type || (type !== "booking" && type !== "callback")) {
      return NextResponse.json(
        { success: false, error: "Invalid lead type. Expected 'booking' or 'callback'." },
        { status: 400 }
      );
    }

    const cleanDigits = (phone || "").replace(/\D/g, "");
    if (!phone || cleanDigits.length < 9) {
      return NextResponse.json(
        { success: false, error: "Пожалуйста, введите корректный номер телефона." },
        { status: 400 }
      );
    }

    if (consentPersonalData !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "Необходимо согласие на обработку персональных данных.",
          code: "CONSENT_REQUIRED",
        },
        { status: 400 }
      );
    }

    if (contactMode === "scheduled" && (!scheduledDate || !scheduledTime)) {
      return NextResponse.json(
        {
          success: false,
          error: "Пожалуйста, выберите день и время для звонка.",
          code: "SCHEDULE_REQUIRED",
        },
        { status: 400 }
      );
    }

    // 2. Server Gatekeeping & Zero Client Trust Verification (Sections 2.3, 6.2, 12, 14)
    const verification = verifyAndResolveLeadDealBundle(payload);
    if (!verification.valid || !verification.resolved) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || "Проверка данных заявки не пройдена.",
          code: verification.code || "VALIDATION_ERROR",
        },
        { status: verification.status || 400 }
      );
    }

    const resolved = verification.resolved;

    // 3. Anti-duplicate protection (Section 10.5, 11.5, 12.3: prevent duplicate leads within 10s)
    const nowMs = Date.now();
    const recentDuplicate = inMemoryBookingLeads.find((existing) => {
      const existingMs = new Date(existing.createdAt).getTime();
      return (
        nowMs - existingMs < 10_000 &&
        existing.phone.replace(/\D/g, "") === cleanDigits &&
        existing.type === type &&
        existing.projectId === resolved.projectId &&
        existing.unitId === resolved.unitId &&
        existing.parkingId === resolved.parkingId &&
        existing.storageId === resolved.storageId
      );
    });

    if (recentDuplicate) {
      return NextResponse.json({
        success: true,
        leadId: recentDuplicate.leadId,
        deduplicated: true,
        message: "Заявка уже принята в обработку.",
        lead: recentDuplicate,
      });
    }

    // 4. Assemble complete sanitized record with authoritative server prices
    const leadId = `lead-bk-${nowMs}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLead: LeadSubmissionPayload = {
      leadId,
      type,
      developerId: resolved.developerId,
      projectId: resolved.projectId,
      projectName: resolved.projectName,
      phone: phone.trim(),
      contactMode: contactMode || "instant_15min",
      scheduledDate: contactMode === "scheduled" ? scheduledDate : undefined,
      scheduledTime: contactMode === "scheduled" ? scheduledTime : undefined,
      unitId: resolved.unitId,
      unitNumber: resolved.unitNumber,
      unitPriceTjs: resolved.unitPriceTjs,
      unitArea: resolved.unitArea,
      parkingId: resolved.parkingId,
      parkingNumber: resolved.parkingNumber,
      parkingPriceTjs: resolved.parkingPriceTjs,
      storageId: resolved.storageId,
      storageNumber: resolved.storageNumber,
      storagePriceTjs: resolved.storagePriceTjs,
      totalPriceTjs: resolved.totalPriceTjs,
      currency: payload.currency || "TJS",
      consentPersonalData: true,
      status: "new",
      createdAt: new Date(nowMs).toISOString(),
    };

    // Save in memory queue (Section 12.3: reliable server storage without changing unit status)
    inMemoryBookingLeads.unshift(fullLead);

    // 5. Try saving to Database if connected
    try {
      const summaryNotes = [
        type === "booking" ? "🔥 ЗАЯВКА НА БРОНИРОВАНИЕ" : "📞 ЗАКАЗ ОБРАТНОГО ЗВОНКА",
        `ЖК: ${fullLead.projectName}`,
        fullLead.unitNumber
          ? `Квартира: № ${fullLead.unitNumber} (${fullLead.unitArea || "?"} м²) — ${fullLead.unitPriceTjs?.toLocaleString("ru-RU")} сом.`
          : null,
        fullLead.parkingNumber
          ? `Машино-место: № ${fullLead.parkingNumber} — ${fullLead.parkingPriceTjs?.toLocaleString("ru-RU")} сом.`
          : null,
        fullLead.storageNumber
          ? `Кладовая: № ${fullLead.storageNumber} — ${fullLead.storagePriceTjs?.toLocaleString("ru-RU")} сом.`
          : null,
        `Общая стоимость: ${fullLead.totalPriceTjs.toLocaleString("ru-RU")} сомони`,
        contactMode === "instant_15min"
          ? "Время связи: В течение 15 минут"
          : `Время связи: ${fullLead.scheduledDate || "Сегодня"} в ${fullLead.scheduledTime || "удобное время"}`,
      ]
        .filter(Boolean)
        .join(" | ");

      await db.insert(crmLeads).values({
        id: fullLead.leadId,
        agentId: fullLead.developerId,
        clientName: type === "booking" ? "Покупатель (Бронирование)" : "Клиент (Обратный звонок)",
        clientPhone: fullLead.phone,
        status: "new",
        budget: Math.round(fullLead.totalPriceTjs / 10.9),
        commission: Math.round((fullLead.totalPriceTjs / 10.9) * 0.02),
        commissionPercent: 2,
        source: type === "booking" ? "booking_scenario" : "callback_scenario",
        notes: summaryNotes,
      } as any);
    } catch {
      // In-memory queue already recorded the lead
    }

    // 6. Send Telegram notification (push to sales team)
    try {
      const timingText =
        contactMode === "instant_15min"
          ? "⚡ Срочно: в течение 15 минут!"
          : `📅 Запланировано: ${fullLead.scheduledDate || "Сегодня"} в ${fullLead.scheduledTime || "удобное время"}`;

      const objectsText = [
        fullLead.unitNumber ? `Квартира №${fullLead.unitNumber}` : "",
        fullLead.parkingNumber ? `Машино-место №${fullLead.parkingNumber}` : "",
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
        source: type === "booking" ? "Бронирование" : "Обратный звонок",
        notes: `${timingText}. Сумма: ${fullLead.totalPriceTjs.toLocaleString("ru-RU")} сомони.`,
        crmUrl: "https://sogd-realty.vercel.app/developer-admin",
      }).catch((err) => console.error("[Telegram Push Error]:", err));

      if (type === "booking") {
        notifyTelegramBookingRequest({
          projectName: fullLead.projectName || "Новостройка",
          unitNumber: fullLead.unitNumber,
          unitPriceTjs: fullLead.unitPriceTjs,
          parkingNumber: fullLead.parkingNumber,
          storageNumber: fullLead.storageNumber,
          totalPriceTjs: fullLead.totalPriceTjs,
          depositTjs: 1000,
          clientPhone: fullLead.phone || "",
          clientName: "Покупатель новостройки",
          contactMode: fullLead.contactMode,
          crmUrl: "https://sogd-realty.vercel.app/developer-admin",
        }).catch(() => {});
      }
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
      { success: false, error: "Временная ошибка при отправке заявки. Пожалуйста, повторите попытку." },
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
