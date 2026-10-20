/**
 * Tajikistan National FinTech & Payment Gateway Core for Maskani.tj
 *
 * Supported Payment Systems & Rail Providers:
 * 1. Корти Милли (National Processing Center of Tajikistan / НПЦ РТ) - 3D Secure SMS OTP
 * 2. Dushanbe City (DC Wallet / DC Next / DC Pay QR)
 * 3. Alif Pay & Alif Salom (0% installment by Alif Bank / Alif Mobi QR)
 * 4. Эсхата Онлайн (ОАО «Банк Эсхата» - General Financial Partner of Sughd)
 * 5. Visa / Mastercard (International card acquiring settled in TJS)
 */

import { topUpAdvertiserBalance } from "@/lib/ads/ad-engine";

export const TJS_TO_USD_RATE = 10.9;

export type PaymentProvider =
  | "korti_milli"
  | "dushanbe_city"
  | "alif_mobi"
  | "eskhata_online"
  | "visa_mastercard";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export type PaymentPurpose =
  | "ad_balance"
  | "ad_sponsorship"
  | "classified_top"
  | "classified_highlight"
  | "classified_urgent"
  | "classified_turbo"
  | "unit_booking";

export type PaymentMethod = "card" | "qr" | "wallet" | "installment_salom";

export interface PaymentTransactionDto {
  id: string;
  userId?: string;
  advertiserId?: string;
  classifiedId?: string;
  unitId?: string;
  amountTjs: number;
  amountUsd: number;
  currency: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  descriptionRu: string;
  descriptionTg: string;
  payerPhone: string;
  payerName?: string;
  payerEmail?: string;
  externalTransactionId?: string;
  paymentUrl?: string;
  qrCodeData?: string;
  otpCode?: string;
  installmentMonths?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PaymentProviderMeta {
  id: PaymentProvider;
  nameRu: string;
  nameTg: string;
  subtitleRu: string;
  subtitleTg: string;
  badge: string;
  colorHex: string;
  accentBg: string;
  supportedMethods: PaymentMethod[];
}

export const PAYMENT_PROVIDERS: Record<PaymentProvider, PaymentProviderMeta> = {
  korti_milli: {
    id: "korti_milli",
    nameRu: "Корти Милли",
    nameTg: "Корти Миллӣ",
    subtitleRu: "Карты всех банков РТ с СМС-кодом 3D-Secure (НПЦ РТ)",
    subtitleTg: "Кортҳои ҳамаи бонкҳои Тоҷикистон бо рамзи 3D-Secure",
    badge: "НПЦ РТ",
    colorHex: "#059669",
    accentBg: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    supportedMethods: ["card"],
  },
  dushanbe_city: {
    id: "dushanbe_city",
    nameRu: "Dushanbe City (DC)",
    nameTg: "Dushanbe City (DC)",
    subtitleRu: "Оплата по QR-коду DC Pay или с кошелька DC Next",
    subtitleTg: "Пардохт бо DC Pay QR ё ҳамёни электронии DC Next",
    badge: "DC Wallet",
    colorHex: "#D97706",
    accentBg: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    supportedMethods: ["qr", "wallet"],
  },
  alif_mobi: {
    id: "alif_mobi",
    nameRu: "Alif Pay & Рассрочка Salom",
    nameTg: "Alif Pay ва Насияи Salom",
    subtitleRu: "QR-оплата через Alif Mobi или 0% рассрочка Салом",
    subtitleTg: "Пардохти QR дар Alif Mobi ё насияи бефоизи Салом",
    badge: "Alif 0%",
    colorHex: "#10B981",
    accentBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    supportedMethods: ["qr", "installment_salom"],
  },
  eskhata_online: {
    id: "eskhata_online",
    nameRu: "Эсхата Онлайн",
    nameTg: "Эсхата Онлайн",
    subtitleRu: "Банк Эсхата — генеральный финансовый партнер Согда",
    subtitleTg: "Бонки Эсхата — шарики генералии молиявии вилояти Суғд",
    badge: "Банк Эсхата",
    colorHex: "#2563EB",
    accentBg: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    supportedMethods: ["qr", "wallet"],
  },
  visa_mastercard: {
    id: "visa_mastercard",
    nameRu: "Международные карты (Visa / Mastercard)",
    nameTg: "Кортҳои байналмилалӣ (Visa / Mastercard)",
    subtitleRu: "Прием карт зарубежных банков с автоконвертацией в сомони",
    subtitleTg: "Қабули кортҳои хориҷӣ бо табдили худкор ба сомонӣ",
    badge: "Visa / MC",
    colorHex: "#6366F1",
    accentBg: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    supportedMethods: ["card"],
  },
};

export interface VasServiceMeta {
  id: PaymentPurpose;
  nameRu: string;
  nameTg: string;
  descriptionRu: string;
  descriptionTg: string;
  priceTjs: number;
  priceUsd: number;
  durationDays: number;
  badgeRu: string;
  badgeTg: string;
  iconName: string;
}

export const VAS_SERVICES: Record<string, VasServiceMeta> = {
  classified_top: {
    id: "classified_top",
    nameRu: "ТОП-размещение (7 дней)",
    nameTg: "Маҳкамкунӣ дар ТОП (7 рӯз)",
    descriptionRu: "Объявление закрепляется в самом верху каталога вторички с приоритетом",
    descriptionTg: "Эълон дар болои феҳристи бозори дуюмдараҷа бо афзалият меистад",
    priceTjs: 25,
    priceUsd: 2.3,
    durationDays: 7,
    badgeRu: "ТОП",
    badgeTg: "ТОП",
    iconName: "TrendingUp",
  },
  classified_highlight: {
    id: "classified_highlight",
    nameRu: "Выделение цветом и рамкой",
    nameTg: "Ҷудокунӣ бо чаҳорчӯбаи заррин",
    descriptionRu: "Яркая рамка с градиентом привлекает в 3 раза больше кликов",
    descriptionTg: "Чаҳорчӯбаи равшан диққати бештарро ҷалб мекунад",
    priceTjs: 15,
    priceUsd: 1.4,
    durationDays: 14,
    badgeRu: "VIP",
    badgeTg: "VIP",
    iconName: "Sparkles",
  },
  classified_urgent: {
    id: "classified_urgent",
    nameRu: "Срочная продажа (бейдж «Срочно»)",
    nameTg: "Фурӯши таъҷилӣ (бейҷи «Таъҷилӣ»)",
    descriptionRu: "Значок огня и бейдж «Срочно» ускоряют поиск реального покупателя",
    descriptionTg: "Аломати оташ ва бейҷи махсус фурӯшро метезонад",
    priceTjs: 20,
    priceUsd: 1.85,
    durationDays: 10,
    badgeRu: "Срочно",
    badgeTg: "Таъҷилӣ",
    iconName: "Flame",
  },
  classified_turbo: {
    id: "classified_turbo",
    nameRu: "Турбо-пакет «Все включено»",
    nameTg: "Бастаи «Турбо-фурӯш» (Ҳамааш дар як)",
    descriptionRu: "ТОП + Выделение рамкой + Бейдж «Срочно» со скидкой 25%",
    descriptionTg: "ТОП + Ранг + Таъҷилӣ бо тахфифи 25%",
    priceTjs: 45,
    priceUsd: 4.15,
    durationDays: 14,
    badgeRu: "Турбо -25%",
    badgeTg: "Турбо -25%",
    iconName: "Zap",
  },
};

export const AD_PACKAGES = [
  {
    id: "ad_pack_starter",
    nameRu: "Старт (20 000 показов)",
    nameTg: "Оғоз (20 000 намоиш)",
    amountTjs: 500,
    amountUsd: 46,
    impressions: 20000,
  },
  {
    id: "ad_pack_business",
    nameRu: "Бизнес (65 000 показов)",
    nameTg: "Бизнес (65 000 намоиш)",
    amountTjs: 1500,
    amountUsd: 138,
    impressions: 65000,
  },
  {
    id: "ad_pack_corporate",
    nameRu: "Корпоративный (220 000 показов)",
    nameTg: "Корпоративӣ (220 000 намоиш)",
    amountTjs: 5000,
    amountUsd: 460,
    impressions: 220000,
  },
];

// Persistent In-Memory State for Payments
let transactionsStore: PaymentTransactionDto[] = [
  {
    id: "pay_eskhata_annual_2026",
    advertiserId: "adv-eskhata",
    amountTjs: 120000,
    amountUsd: 11000,
    currency: "TJS",
    provider: "eskhata_online",
    method: "wallet",
    status: "completed",
    purpose: "ad_sponsorship",
    descriptionRu: "Оплата годового генерального спонсорского пакета Банка Эсхата",
    descriptionTg: "Пардохти бастаи солонаи сарпарастии генералии Бонки Эсхата",
    payerPhone: "+992 (44) 600-0-600",
    payerName: "ОАО «Банк Эсхата»",
    externalTransactionId: "ESK-20260101-9921",
    metadata: { package: "sponsor_annual", year: 2026 },
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:02:15Z",
    completedAt: "2026-01-01T10:02:15Z",
  },
  {
    id: "pay_megafon_cpm_topup",
    advertiserId: "adv-megafon",
    amountTjs: 15000,
    amountUsd: 1376,
    currency: "TJS",
    provider: "dushanbe_city",
    method: "qr",
    status: "completed",
    purpose: "ad_balance",
    descriptionRu: "Пополнение баланса рекламного аукциона МегаФон (GPON и 5G)",
    descriptionTg: "Пур кардани тавозуни музоядаи таблиғотии МегаФон",
    payerPhone: "+992 90 000 0000",
    payerName: "ЗАО «ТТ Мобайл»",
    externalTransactionId: "DC-QR-8834190",
    metadata: { campaignId: "camp-megafon-home-net" },
    createdAt: "2026-02-15T14:30:00Z",
    updatedAt: "2026-02-15T14:31:10Z",
    completedAt: "2026-02-15T14:31:10Z",
  },
  {
    id: "pay_farovon_pack",
    advertiserId: "adv-farovon",
    amountTjs: 5000,
    amountUsd: 460,
    currency: "TJS",
    provider: "alif_mobi",
    method: "qr",
    status: "completed",
    purpose: "ad_balance",
    descriptionRu: "Пополнение рекламного баланса ГК Фаровон через Alif Pay",
    descriptionTg: "Пур кардани тавозуни таблиғотӣ аз тариқи Alif Pay",
    payerPhone: "+992 92 888 8888",
    payerName: "ГК Фаровон",
    externalTransactionId: "ALF-PAY-771239",
    metadata: { campaignId: "camp-farovon-concrete" },
    createdAt: "2026-03-01T09:15:00Z",
    updatedAt: "2026-03-01T09:16:05Z",
    completedAt: "2026-03-01T09:16:05Z",
  },
  {
    id: "pay_vas_khujand_top",
    classifiedId: "classified-1",
    amountTjs: 25,
    amountUsd: 2.3,
    currency: "TJS",
    provider: "korti_milli",
    method: "card",
    status: "completed",
    purpose: "classified_top",
    descriptionRu: "Закрепление объявления в ТОП каталога на 7 дней (Худжанд)",
    descriptionTg: "Маҳкамкунии эълон дар ТОП барои 7 рӯз (Хуҷанд)",
    payerPhone: "+992 92 700 1122",
    payerName: "Рустам Каримов",
    externalTransactionId: "KM-NPC-4491823",
    metadata: { days: 7, city: "khujand" },
    createdAt: "2026-10-18T11:20:00Z",
    updatedAt: "2026-10-18T11:21:00Z",
    completedAt: "2026-10-18T11:21:00Z",
  },
  {
    id: "pay_vas_istaravshan_turbo",
    classifiedId: "classified-2",
    amountTjs: 45,
    amountUsd: 4.15,
    currency: "TJS",
    provider: "alif_mobi",
    method: "installment_salom",
    status: "completed",
    purpose: "classified_turbo",
    descriptionRu: "Оплата Турбо-пакета продажи дома (Истаравшан) через Alif Salom",
    descriptionTg: "Пардохти бастаи Турбо-фурӯши ҳавлӣ бо насияи Салом",
    payerPhone: "+992 93 555 4433",
    payerName: "Диловар Саидов",
    installmentMonths: 3,
    externalTransactionId: "ALF-SLM-991204",
    metadata: { days: 14, city: "istaravshan" },
    createdAt: "2026-10-19T16:45:00Z",
    updatedAt: "2026-10-19T16:46:12Z",
    completedAt: "2026-10-19T16:46:12Z",
  },
  {
    id: "pay_deposit_qayroqum_apt",
    unitId: "unit-qa-402",
    amountTjs: 1000,
    amountUsd: 92,
    currency: "TJS",
    provider: "eskhata_online",
    method: "qr",
    status: "completed",
    purpose: "unit_booking",
    descriptionRu: "Задаток онлайн-бронирования 2-комн. квартиры (Qayroqum Avenue)",
    descriptionTg: "Байъонаи қайди онлайни хонаи 2-ҳуҷрагӣ (Qayroqum Avenue)",
    payerPhone: "+992 92 711 9900",
    payerName: "Фарзона Негматова",
    externalTransactionId: "ESK-DEP-339180",
    metadata: { projectId: "proj-qayroqum-avenue", holdHours: 72 },
    createdAt: "2026-10-20T12:00:00Z",
    updatedAt: "2026-10-20T12:01:45Z",
    completedAt: "2026-10-20T12:01:45Z",
  },
];

export interface CreatePaymentOrderRequest {
  purpose: PaymentPurpose;
  amountTjs: number;
  provider: PaymentProvider;
  method?: PaymentMethod;
  payerPhone: string;
  payerName?: string;
  payerEmail?: string;
  advertiserId?: string;
  classifiedId?: string;
  unitId?: string;
  userId?: string;
  installmentMonths?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Creates a new payment transaction with provider-specific parameters
 */
export function createPaymentOrder(params: CreatePaymentOrderRequest): PaymentTransactionDto {
  const txId = `pay_${params.provider.slice(0, 3)}_${Date.now()}`;
  const amountUsd = Math.round(params.amountTjs / TJS_TO_USD_RATE);

  const providerMeta = PAYMENT_PROVIDERS[params.provider];
  const method = params.method || providerMeta.supportedMethods[0];

  let descRu = "";
  let descTg = "";

  if (params.purpose === "ad_balance") {
    descRu = `Пополнение баланса рекламного аукциона Maskani на ${params.amountTjs} TJS`;
    descTg = `Пур кардани тавозуни таблиғоти Maskani ба маблағи ${params.amountTjs} сомонӣ`;
  } else if (params.purpose === "ad_sponsorship") {
    descRu = `Оплата спонсорского пакета Maskani на ${params.amountTjs} TJS`;
    descTg = `Пардохти бастаи сарпарастии Maskani ба маблағи ${params.amountTjs} сомонӣ`;
  } else if (VAS_SERVICES[params.purpose]) {
    const vas = VAS_SERVICES[params.purpose];
    descRu = `${vas.nameRu} для объявления на Maskani.tj`;
    descTg = `${vas.nameTg} барои эълон дар Maskani.tj`;
  } else if (params.purpose === "unit_booking") {
    descRu = `Задаток бронирования объекта недвижимости на ${params.amountTjs} TJS`;
    descTg = `Байъонаи бронкунии амвол ба маблағи ${params.amountTjs} сомонӣ`;
  } else {
    descRu = `Оплата услуг Maskani.tj на сумму ${params.amountTjs} TJS`;
    descTg = `Пардохти хизматрасониҳои Maskani.tj ба маблағи ${params.amountTjs} сомонӣ`;
  }

  // Generate QR data or 3D-Secure challenge
  let qrCodeData: string | undefined;
  let paymentUrl: string | undefined;
  let otpCode: string | undefined;

  if (method === "qr") {
    if (params.provider === "dushanbe_city") {
      qrCodeData = `dcpay://qr?merchant=maskani_tj&amount=${params.amountTjs}&orderId=${txId}&currency=972`;
    } else if (params.provider === "alif_mobi") {
      qrCodeData = `alif://pay?recipient=maskani&amount=${params.amountTjs}&account=maskani_tj&order=${txId}`;
    } else if (params.provider === "eskhata_online") {
      qrCodeData = `eskhata://qr?provider=maskani&sum=${params.amountTjs}&bill=${txId}`;
    }
  }

  if (method === "card") {
    // 3D Secure simulation code (always 1234 or dynamic 4 digits for Korti Milli)
    otpCode = "1234";
    paymentUrl = `/payments/checkout/${txId}`;
  }

  const newTx: PaymentTransactionDto = {
    id: txId,
    userId: params.userId,
    advertiserId: params.advertiserId,
    classifiedId: params.classifiedId,
    unitId: params.unitId,
    amountTjs: params.amountTjs,
    amountUsd,
    currency: "TJS",
    provider: params.provider,
    method,
    status: method === "card" ? "processing" : "pending",
    purpose: params.purpose,
    descriptionRu: descRu,
    descriptionTg: descTg,
    payerPhone: params.payerPhone,
    payerName: params.payerName || "Клиент Maskani",
    payerEmail: params.payerEmail,
    externalTransactionId: `${params.provider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    paymentUrl,
    qrCodeData,
    otpCode,
    installmentMonths: params.installmentMonths,
    metadata: params.metadata || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  transactionsStore.unshift(newTx);
  return newTx;
}

/**
 * Verifies 3D Secure SMS OTP for Korti Milli / Card payment
 */
export function verifyPaymentOtp(
  transactionId: string,
  enteredOtp: string
): { success: boolean; error?: string; transaction?: PaymentTransactionDto } {
  const tx = transactionsStore.find((t) => t.id === transactionId);
  if (!tx) {
    return { success: false, error: "Транзакция не найдена" };
  }

  if (tx.status === "completed") {
    return { success: true, transaction: tx };
  }

  // Verify OTP (accepts tx.otpCode or default demo "1234")
  if (enteredOtp !== tx.otpCode && enteredOtp !== "1234") {
    return { success: false, error: "Неверный проверочный СМС-код (используйте 1234)" };
  }

  tx.status = "completed";
  tx.completedAt = new Date().toISOString();
  tx.updatedAt = new Date().toISOString();

  // Apply business logic on completion
  applySuccessfulPaymentEffects(tx);

  return { success: true, transaction: tx };
}

/**
 * Confirms payment (for QR scan or webhook callback)
 */
export function confirmPayment(
  transactionId: string,
  externalId?: string
): { success: boolean; transaction?: PaymentTransactionDto } {
  const tx = transactionsStore.find((t) => t.id === transactionId);
  if (!tx) {
    return { success: false };
  }

  tx.status = "completed";
  if (externalId) tx.externalTransactionId = externalId;
  tx.completedAt = new Date().toISOString();
  tx.updatedAt = new Date().toISOString();

  applySuccessfulPaymentEffects(tx);

  return { success: true, transaction: tx };
}

/**
 * Internal effect handler when payment reaches 'completed'
 */
function applySuccessfulPaymentEffects(tx: PaymentTransactionDto) {
  // If payment is for advertising balance top-up
  if (tx.purpose === "ad_balance" && tx.advertiserId) {
    topUpAdvertiserBalance(tx.advertiserId, tx.amountTjs, tx.amountUsd);
  }
}

/**
 * Returns single transaction by ID
 */
export function getPaymentTransaction(id: string): PaymentTransactionDto | null {
  return transactionsStore.find((t) => t.id === id) || null;
}

/**
 * Lists transactions with optional filters
 */
export function listPaymentTransactions(filter?: {
  advertiserId?: string;
  userId?: string;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  purpose?: PaymentPurpose;
}): PaymentTransactionDto[] {
  let list = [...transactionsStore];

  if (filter?.advertiserId) {
    list = list.filter((t) => t.advertiserId === filter.advertiserId);
  }
  if (filter?.userId) {
    list = list.filter((t) => t.userId === filter.userId);
  }
  if (filter?.status) {
    list = list.filter((t) => t.status === filter.status);
  }
  if (filter?.provider) {
    list = list.filter((t) => t.provider === filter.provider);
  }
  if (filter?.purpose) {
    list = list.filter((t) => t.purpose === filter.purpose);
  }

  return list;
}

export interface FintechAnalyticsDto {
  totalProcessedTjs: number;
  totalProcessedUsd: number;
  completedTransactionsCount: number;
  pendingTransactionsCount: number;
  averageCheckTjs: number;
  byProvider: Record<PaymentProvider, { count: number; volumeTjs: number; volumeUsd: number }>;
  byPurpose: Record<string, { count: number; volumeTjs: number }>;
  recentTransactions: PaymentTransactionDto[];
}

/**
 * Returns aggregated FinTech KPIs for Super Admin & Financial Reports
 */
export function getFintechAnalytics(): FintechAnalyticsDto {
  const completed = transactionsStore.filter((t) => t.status === "completed");
  const pending = transactionsStore.filter((t) => t.status === "pending" || t.status === "processing");

  const totalProcessedTjs = completed.reduce((acc, t) => acc + t.amountTjs, 0);
  const totalProcessedUsd = Math.round(totalProcessedTjs / TJS_TO_USD_RATE);
  const averageCheckTjs = completed.length > 0 ? Math.round(totalProcessedTjs / completed.length) : 0;

  const byProvider: Record<PaymentProvider, { count: number; volumeTjs: number; volumeUsd: number }> = {
    korti_milli: { count: 0, volumeTjs: 0, volumeUsd: 0 },
    dushanbe_city: { count: 0, volumeTjs: 0, volumeUsd: 0 },
    alif_mobi: { count: 0, volumeTjs: 0, volumeUsd: 0 },
    eskhata_online: { count: 0, volumeTjs: 0, volumeUsd: 0 },
    visa_mastercard: { count: 0, volumeTjs: 0, volumeUsd: 0 },
  };

  for (const t of completed) {
    if (byProvider[t.provider]) {
      byProvider[t.provider].count += 1;
      byProvider[t.provider].volumeTjs += t.amountTjs;
      byProvider[t.provider].volumeUsd += t.amountUsd;
    }
  }

  const byPurpose: Record<string, { count: number; volumeTjs: number }> = {};
  for (const t of completed) {
    if (!byPurpose[t.purpose]) {
      byPurpose[t.purpose] = { count: 0, volumeTjs: 0 };
    }
    byPurpose[t.purpose].count += 1;
    byPurpose[t.purpose].volumeTjs += t.amountTjs;
  }

  return {
    totalProcessedTjs,
    totalProcessedUsd,
    completedTransactionsCount: completed.length,
    pendingTransactionsCount: pending.length,
    averageCheckTjs,
    byProvider,
    byPurpose,
    recentTransactions: transactionsStore.slice(0, 10),
  };
}

/**
 * Formats amount with proper Tajik Somoni and USD currency symbols
 */
export function formatPaymentPrice(amountTjs: number) {
  const formattedTjs = amountTjs.toLocaleString("ru-RU") + " сомони";
  const amountUsd = Math.round(amountTjs / TJS_TO_USD_RATE);
  const formattedUsd = "$" + amountUsd.toLocaleString("en-US");

  return {
    tjs: amountTjs,
    usd: amountUsd,
    formattedTjs,
    formattedUsd,
  };
}
