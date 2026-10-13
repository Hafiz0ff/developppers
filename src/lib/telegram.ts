/**
 * Telegram Bot Notification Helper for Maskani.tj
 * Sends instant push notifications to brokers and developers about new leads.
 */

export interface LeadNotificationPayload {
  clientName: string;
  clientPhone: string;
  classifiedTitle?: string | null;
  budget?: number;
  commission?: number;
  source: string;
  notes?: string;
  crmUrl?: string;
}

export async function sendTelegramMessage(
  chatId: string,
  htmlText: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken || botToken.trim() === "") {
    console.log(
      `[Telegram] ⚠️ TELEGRAM_BOT_TOKEN не настроен в .env. Уведомление симулировано в консоль для chatId: ${chatId}:\n${htmlText}`
    );
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("[Telegram API Error]:", data);
      return { success: false, error: data.description || "Telegram API Error" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Telegram Network Error]:", err?.message || err);
    return { success: false, error: err?.message || "Network error" };
  }
}

export function formatLeadHtmlMessage(payload: LeadNotificationPayload): string {
  const {
    clientName,
    clientPhone,
    classifiedTitle,
    budget = 0,
    commission = 0,
    source,
    notes,
    crmUrl = "https://maskani.tj/profile/crm",
  } = payload;

  const sourceLabels: Record<string, string> = {
    phone_click: "📞 Просмотр телефона (Звонок)",
    whatsapp_click: "💬 Переход в WhatsApp",
    website: "🌐 Заявка с сайта",
    manual: "✍️ Добавлен вручную",
  };

  const channelText = sourceLabels[source] || `📍 ${source}`;

  return [
    `🔔 <b>Новый лид на Maskani.tj!</b>`,
    ``,
    `👤 <b>Клиент:</b> ${escapeHtml(clientName)}`,
    `📞 <b>Телефон:</b> <code>${escapeHtml(clientPhone)}</code>`,
    classifiedTitle ? `🏢 <b>Объект:</b> ${escapeHtml(classifiedTitle)}` : ``,
    budget > 0
      ? `💰 <b>Бюджет:</b> $${budget.toLocaleString()} ${
          commission > 0 ? `<i>(Комиссия ~ $${commission.toLocaleString()})</i>` : ""
        }`
      : ``,
    `📊 <b>Канал:</b> ${channelText}`,
    notes ? `📝 <b>Детали:</b> <i>${escapeHtml(notes)}</i>` : ``,
    ``,
    `👉 <a href="${crmUrl}"><b>Открыть карточку в CRM Воронке</b></a>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function notifyAgentAboutNewLead(
  payload: LeadNotificationPayload,
  agentChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  // Chat ID конкретного маклера или резервный глобальный Chat ID агентства/администратора
  const targetChatId =
    agentChatId ||
    process.env.TELEGRAM_CHAT_ID ||
    process.env.ADMIN_TELEGRAM_CHAT_ID;

  if (!targetChatId) {
    console.log("[Telegram] Chat ID не указан для маклера или системы. Уведомление пропущено.");
    return { success: false, simulated: true };
  }

  const message = formatLeadHtmlMessage(payload);
  return sendTelegramMessage(targetChatId, message);
}
