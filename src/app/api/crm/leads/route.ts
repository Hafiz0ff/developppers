import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crmLeads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notifyAgentAboutNewLead } from "@/lib/telegram";

// Демо-набор начальных лидов для полноценного тестирования и работы
const DEFAULT_DEMO_LEADS = [
  {
    id: "lead-1",
    agentId: "agent-default",
    clientName: "Фарход Назиров",
    clientPhone: "+992 92 771 44 22",
    classifiedId: "c1",
    classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
    status: "new",
    budget: 49000,
    commission: 980,
    commissionPercent: 2,
    source: "whatsapp_click",
    notes: "Нажал кнопку WhatsApp на сайте. Ищет квартиру для семьи с двумя детьми.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: "lead-2",
    agentId: "agent-default",
    clientName: "Дилшод Рахимов",
    clientPhone: "+992 93 505 11 88",
    classifiedId: "c2",
    classifiedTitle: "Благоустроенный дом (Ҳавлӣ) 6.5 соток, Унчи",
    status: "contacted",
    budget: 65000,
    commission: 1300,
    commissionPercent: 2,
    source: "phone_click",
    notes: "Созвонились в 14:00. Хочет посмотреть дом в субботу утром.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "lead-3",
    agentId: "agent-default",
    clientName: "Зарина Каримова",
    clientPhone: "+992 92 880 33 55",
    classifiedId: "c1",
    classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
    status: "showing",
    budget: 48000,
    commission: 960,
    commissionPercent: 2,
    source: "website",
    notes: "Показ назначен на завтра в 16:30. Торгуется на $1,000, готова внести аванс.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "lead-4",
    agentId: "agent-default",
    clientName: "Алишер Махмудов",
    clientPhone: "+992 90 011 22 33",
    classifiedId: "c3",
    classifiedTitle: "Торговое помещение у рынка «Панчшанбе»",
    status: "deal",
    budget: 776,
    commission: 776,
    commissionPercent: 100, // 1 месяц аренды в качестве комиссии
    source: "manual",
    notes: "Договор аренды подписан на 1 год. Оплата комиссии получена.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

// In-memory хранилище для бесперебойной работы при отсутствии подключенной БД
let inMemoryLeads = [...DEFAULT_DEMO_LEADS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agent_id") || "agent-default";

    try {
      const records = await db
        .select()
        .from(crmLeads)
        .where(eq(crmLeads.agentId, agentId))
        .orderBy(desc(crmLeads.createdAt));

      if (records && records.length > 0) {
        return NextResponse.json({ success: true, leads: records });
      }
    } catch {
      // Fallback на in-memory
    }

    return NextResponse.json({
      success: true,
      leads: inMemoryLeads,
      isDemo: true,
    });
  } catch (error) {
    console.error("CRM Leads GET error:", error);
    return NextResponse.json(
      { success: false, leads: inMemoryLeads },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName = "Новый клиент",
      clientPhone = "+992 92 ___ __ __",
      classifiedId,
      classifiedTitle,
      budget = 0,
      commissionPercent = 2,
      source = "website",
      notes,
      agentId = "agent-default",
    } = body;

    const calculatedCommission = Math.round((budget * commissionPercent) / 100);

    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      agentId,
      clientName,
      clientPhone,
      classifiedId: classifiedId || null,
      classifiedTitle: classifiedTitle || null,
      status: "new",
      budget: Number(budget) || 0,
      commission: calculatedCommission,
      commissionPercent: Number(commissionPercent) || 2,
      source,
      notes: notes || `Создано через источник: ${source}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.insert(crmLeads).values(newLead as any);
    } catch {
      // Сохраняем в in-memory
    }

    inMemoryLeads = [newLead, ...inMemoryLeads];

    // Отправляем мгновенное Telegram-уведомление маклеру / агентству
    try {
      const baseUrl = req.nextUrl?.origin || "https://sogd-realty.vercel.app";
      notifyAgentAboutNewLead({
        clientName: newLead.clientName,
        clientPhone: newLead.clientPhone,
        classifiedTitle: newLead.classifiedTitle,
        budget: newLead.budget,
        commission: newLead.commission,
        source: newLead.source,
        notes: newLead.notes,
        crmUrl: `${baseUrl}/profile/crm`,
      }).catch((err) => console.error("[Telegram Push Error]:", err));
    } catch {
      // Ignored
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("CRM Leads POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, budget, commission, commissionPercent, notes, clientName, clientPhone } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    const leadIndex = inMemoryLeads.findIndex((l) => l.id === id);
    if (leadIndex !== -1) {
      const existing = inMemoryLeads[leadIndex];
      const updatedBudget = budget !== undefined ? Number(budget) : existing.budget;
      const updatedPercent = commissionPercent !== undefined ? Number(commissionPercent) : existing.commissionPercent;
      const updatedCommission =
        commission !== undefined
          ? Number(commission)
          : Math.round((updatedBudget * updatedPercent) / 100);

      inMemoryLeads[leadIndex] = {
        ...existing,
        status: status !== undefined ? status : existing.status,
        budget: updatedBudget,
        commission: updatedCommission,
        commissionPercent: updatedPercent,
        notes: notes !== undefined ? notes : existing.notes,
        clientName: clientName !== undefined ? clientName : existing.clientName,
        clientPhone: clientPhone !== undefined ? clientPhone : existing.clientPhone,
        updatedAt: new Date(),
      };
    }

    try {
      await db
        .update(crmLeads)
        .set({
          ...(status && { status }),
          ...(budget !== undefined && { budget: Number(budget) }),
          ...(commission !== undefined && { commission: Number(commission) }),
          ...(commissionPercent !== undefined && { commissionPercent: Number(commissionPercent) }),
          ...(notes !== undefined && { notes }),
          ...(clientName !== undefined && { clientName }),
          ...(clientPhone !== undefined && { clientPhone }),
          updatedAt: new Date(),
        })
        .where(eq(crmLeads.id, id));
    } catch {
      // Ignored if DB offline
    }

    const updated = inMemoryLeads.find((l) => l.id === id);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("CRM Leads PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    }

    inMemoryLeads = inMemoryLeads.filter((l) => l.id !== id);

    try {
      await db.delete(crmLeads).where(eq(crmLeads.id, id));
    } catch {
      // Ignored
    }

    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    console.error("CRM Leads DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
