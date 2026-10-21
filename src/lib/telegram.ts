/**
 * Telegram Bot Notification Helper for Maskani.tj
 * Sends instant push notifications to management, sales team, brokers, and developers:
 * 1. Leads from classifieds and website
 * 2. FinTech payments (VAS promotions, ad balance top-ups, unit bookings)
 * 3. Apartment/parking/storage bookings in new developments
 * 4. Enterprise B2B sponsorship inquiries from corporations
 * 5. Low balance alerts for programmatic advertisers
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

export interface PaymentNotificationPayload {
  transactionId: string;
  purpose: string;
  amountTjs: number;
  amountUsd?: number;
  providerName: string;
  payerName?: string;
  payerPhone: string;
  targetTitle?: string;
  targetId?: string;
  completedAt?: string;
}

export interface BookingNotificationPayload {
  projectName: string;
  unitNumber?: string | number;
  unitPriceTjs?: number;
  parkingNumber?: string | number;
  storageNumber?: string | number;
  totalPriceTjs: number;
  depositTjs?: number;
  clientPhone: string;
  clientName?: string;
  contactMode?: string;
  crmUrl?: string;
}

export interface SponsorshipNotificationPayload {
  companyName: string;
  brandName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  packageType: string;
  estimatedBudgetTjs?: number;
  notes?: string;
}

export interface LowBalanceNotificationPayload {
  companyName: string;
  advertiserId: string;
  remainingBalanceTjs: number;
  campaignName?: string;
  contactPhone?: string;
}

export async function sendTelegramMessage(
  chatId: string,
  htmlText: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken || botToken.trim() === "") {
    console.log(
      `[Telegram Notification (Simulated)] -> Chat: ${chatId}\n${htmlText}\n----------------------------------------`
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

export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
      ? `💰 <b>Бюджет:</b> $${budget.toLocaleString("en-US")} ${
          commission > 0 ? `<i>(Комиссия ~ $${commission.toLocaleString("en-US")})</i>` : ""
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

export function formatPaymentSuccessHtmlMessage(payload: PaymentNotificationPayload): string {
  const {
    transactionId,
    purpose,
    amountTjs,
    amountUsd = Math.round(amountTjs / 10.9),
    providerName,
    payerName,
    payerPhone,
    targetTitle,
    completedAt = new Date().toISOString(),
  } = payload;

  const purposeLabels: Record<string, string> = {
    classified_top: "👑 Поднятие в ТОП на 7 дней",
    classified_highlight: "✨ Выделение цветом (14 дней)",
    classified_urgent: "🔥 Срочная продажа (10 дней)",
    classified_turbo: "⚡ Турбо-пакет: Все включено",
    ad_balance: "📈 Пополнение рекламного баланса",
    ad_sponsorship: "💎 Оплата спонсорского контракта",
    unit_booking: "🏢 Задаток бронирования недвижимости",
  };

  const purposeDisplay = purposeLabels[purpose] || purpose;

  return [
    `🟢 <b>ОПЛАТА ПОЛУЧЕНА • MASKANI.TJ</b>`,
    ``,
    `💰 <b>Сумма:</b> <b>${amountTjs.toLocaleString("ru-RU")} сомони</b> (~$${amountUsd})`,
    `🎯 <b>Услуга:</b> ${purposeDisplay}`,
    `🏦 <b>Шлюз:</b> ${escapeHtml(providerName)}`,
    payerName ? `👤 <b>Плательщик:</b> ${escapeHtml(payerName)}` : ``,
    payerPhone ? `📞 <b>Телефон:</b> <code>${escapeHtml(payerPhone)}</code>` : ``,
    targetTitle ? `📌 <b>Объект / Назначение:</b> ${escapeHtml(targetTitle)}` : ``,
    `🆔 <b>ID транзакции:</b> <code>${escapeHtml(transactionId)}</code>`,
    `⏱ <b>Время:</b> ${new Date(completedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatBookingHtmlMessage(payload: BookingNotificationPayload): string {
  const {
    projectName,
    unitNumber,
    parkingNumber,
    storageNumber,
    totalPriceTjs,
    depositTjs = 1000,
    clientPhone,
    clientName = "Покупатель",
    contactMode = "instant_15min",
    crmUrl = "https://maskani.tj/developer-admin",
  } = payload;

  const items = [
    unitNumber ? `Квартира №${unitNumber}` : "",
    parkingNumber ? `Машино-место №${parkingNumber}` : "",
    storageNumber ? `Кладовая №${storageNumber}` : "",
  ]
    .filter(Boolean)
    .join(" + ");

  const timingText =
    contactMode === "instant_15min"
      ? "⚡ Связаться в течение 15 минут!"
      : "📅 Запланированный звонок";

  return [
    `🏢 <b>НОВАЯ БРОНЬ В НОВОСТРОЙКЕ • MASKANI.TJ</b>`,
    ``,
    `🏗 <b>Жилой Комплекс:</b> <b>${escapeHtml(projectName)}</b>`,
    items ? `📦 <b>Помещения:</b> ${escapeHtml(items)}` : ``,
    `💵 <b>Общая сумма сделки:</b> ${totalPriceTjs.toLocaleString("ru-RU")} сомони`,
    depositTjs > 0 ? `🔒 <b>Задаток:</b> ${depositTjs.toLocaleString("ru-RU")} сомони` : ``,
    `👤 <b>Клиент:</b> ${escapeHtml(clientName)}`,
    `📞 <b>Телефон:</b> <code>${escapeHtml(clientPhone)}</code>`,
    `⏰ <b>Срочность:</b> ${timingText}`,
    ``,
    `👉 <a href="${crmUrl}"><b>Открыть бронь в Кабинете застройщика</b></a>`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatSponsorshipHtmlMessage(payload: SponsorshipNotificationPayload): string {
  const {
    companyName,
    brandName,
    contactPerson,
    phone,
    email,
    packageType,
    estimatedBudgetTjs = 0,
    notes,
  } = payload;

  const packageNames: Record<string, string> = {
    annual_sponsor: "💎 Генеральный спонсор (годовой контракт)",
    quarterly_sponsor: "🥇 Спонсор категории (квартальный)",
    auction_cpm: "📊 Программатик аукцион (CPM / CPC)",
  };

  const packDisplay = packageNames[packageType] || packageType;

  return [
    `💎 <b>B2B ЗАЯВКА НА СПОНСОРСТВО • MASKANI.TJ</b>`,
    ``,
    `🏢 <b>Компания:</b> <b>${escapeHtml(companyName)}</b> (${escapeHtml(brandName)})`,
    `👤 <b>Контактное лицо:</b> ${escapeHtml(contactPerson)}`,
    `📞 <b>Телефон:</b> <code>${escapeHtml(phone)}</code>`,
    email ? `✉️ <b>Email:</b> ${escapeHtml(email)}` : ``,
    `📦 <b>Интересующий пакет:</b> ${packDisplay}`,
    estimatedBudgetTjs > 0
      ? `💰 <b>Оценочный бюджет:</b> ${estimatedBudgetTjs.toLocaleString("ru-RU")} сомони (~$${Math.round(
          estimatedBudgetTjs / 10.9
        ).toLocaleString("en-US")})`
      : ``,
    notes ? `📝 <b>Комментарий:</b> <i>${escapeHtml(notes)}</i>` : ``,
    ``,
    `👉 <a href="https://maskani.tj/super-admin/ads"><b>Открыть в Super Admin Рекламы</b></a>`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatLowBalanceHtmlMessage(payload: LowBalanceNotificationPayload): string {
  const { companyName, advertiserId, remainingBalanceTjs, campaignName, contactPhone } = payload;

  return [
    `⚠️ <b>НИЗКИЙ БАЛАНС РЕКЛАМОДАТЕЛЯ • MASKANI.TJ</b>`,
    ``,
    `🏢 <b>Компания:</b> <b>${escapeHtml(companyName)}</b>`,
    `🆔 <b>ID:</b> <code>${escapeHtml(advertiserId)}</code>`,
    campaignName ? `📢 <b>Кампания:</b> ${escapeHtml(campaignName)}` : ``,
    `🚨 <b>Остаток баланса:</b> <b>${remainingBalanceTjs.toLocaleString("ru-RU")} сомони</b>`,
    `ℹ️ <i>Показы баннеров могут быть приостановлены при достижении 0 TJS.</i>`,
    contactPhone ? `📞 <b>Телефон для связи:</b> <code>${escapeHtml(contactPhone)}</code>` : ``,
  ]
    .filter(Boolean)
    .join("\n");
}

// ----------------------------------------------------------------------
// Dispatchers with Target Routing
// ----------------------------------------------------------------------

function getDefaultAdminChatId(): string {
  return (
    process.env.TELEGRAM_ADMIN_CHAT_ID ||
    process.env.TELEGRAM_CHAT_ID ||
    process.env.ADMIN_TELEGRAM_CHAT_ID ||
    "mgmt_channel"
  );
}

export async function notifyAgentAboutNewLead(
  payload: LeadNotificationPayload,
  agentChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  const targetChatId = agentChatId || getDefaultAdminChatId();
  const message = formatLeadHtmlMessage(payload);
  return sendTelegramMessage(targetChatId, message);
}

export async function notifyTelegramPaymentSuccess(
  payload: PaymentNotificationPayload,
  targetChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  const chat = targetChatId || getDefaultAdminChatId();
  const message = formatPaymentSuccessHtmlMessage(payload);
  return sendTelegramMessage(chat, message);
}

export async function notifyTelegramBookingRequest(
  payload: BookingNotificationPayload,
  targetChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  const chat = targetChatId || getDefaultAdminChatId();
  const message = formatBookingHtmlMessage(payload);
  return sendTelegramMessage(chat, message);
}

export async function notifyTelegramSponsorshipLead(
  payload: SponsorshipNotificationPayload,
  targetChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  const chat = targetChatId || getDefaultAdminChatId();
  const message = formatSponsorshipHtmlMessage(payload);
  return sendTelegramMessage(chat, message);
}

export async function notifyTelegramLowBalance(
  payload: LowBalanceNotificationPayload,
  targetChatId?: string | null
): Promise<{ success: boolean; simulated?: boolean }> {
  const chat = targetChatId || getDefaultAdminChatId();
  const message = formatLowBalanceHtmlMessage(payload);
  return sendTelegramMessage(chat, message);
}
