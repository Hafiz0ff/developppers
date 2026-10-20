import { pgTable, text, timestamp, integer, boolean, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { adAdvertisers } from "./ads";
import { classifieds } from "./classifieds";
import { units } from "./units";

// Платежные провайдеры Таджикистана
export const paymentProviderEnum = pgEnum("payment_provider", [
  "korti_milli",      // Национальная карта «Корти Милли» (НПЦ РТ)
  "dushanbe_city",    // Dushanbe City (DC Wallet / DC Next / QR)
  "alif_mobi",        // Alif Pay / Alif Mobi / Рассрочка Alif Salom
  "eskhata_online",   // Банк Эсхата Онлайн (партнерский шлюз)
  "visa_mastercard",  // Международный эквайринг (в сомони)
]);

// Статусы платежных транзакций
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",          // Создан, ожидает ввода реквизитов / подтверждения
  "processing",       // В обработке (ожидает 3D Secure СМС OTP)
  "completed",        // Успешно оплачен и зачислен
  "failed",           // Ошибка / отклонен банком
  "refunded",         // Возврат средств
]);

// Назначение платежа
export const paymentPurposeEnum = pgEnum("payment_purpose", [
  "ad_balance",          // Пополнение рекламного баланса аукциона (CPM/CPC)
  "ad_sponsorship",      // Оплата спонсорского пакета (Flat / Semi-Annual)
  "classified_top",      // Платная услуга: ТОП-размещение объявления на 7 дней
  "classified_highlight",// Платная услуга: Выделение цветом и рамкой
  "classified_urgent",   // Платная услуга: Бейдж «Срочная продажа»
  "classified_turbo",    // Платная услуга: Пакет «Турбо-продажа» (все включено)
  "unit_booking",        // Бронирование квартиры в новостройке (задаток)
]);

// Метод оплаты
export const paymentMethodEnum = pgEnum("payment_method", [
  "card",                // Банковская карта Корти Милли / Visa
  "qr",                  // Оплата по QR-коду (DC Pay, Alif, Eskhata)
  "wallet",              // Списание с электронного кошелька по номеру телефона
  "installment_salom",   // Рассрочка Alif Salom (0%)
]);

export const paymentTransactions = pgTable(
  "payment_transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    advertiserId: text("advertiser_id").references(() => adAdvertisers.id, { onDelete: "set null" }),
    classifiedId: text("classified_id").references(() => classifieds.id, { onDelete: "set null" }),
    unitId: text("unit_id").references(() => units.id, { onDelete: "set null" }),

    amountTjs: integer("amount_tjs").notNull(),
    amountUsd: integer("amount_usd").notNull(),
    currency: text("currency").default("TJS").notNull(),

    provider: paymentProviderEnum("provider").notNull(),
    method: paymentMethodEnum("method").notNull(),
    status: paymentStatusEnum("status").default("pending").notNull(),
    purpose: paymentPurposeEnum("purpose").notNull(),

    descriptionRu: text("description_ru").notNull(),
    descriptionTg: text("description_tg").notNull(),

    payerPhone: text("payer_phone").notNull(),
    payerName: text("payer_name"),
    payerEmail: text("payer_email"),

    externalTransactionId: text("external_transaction_id"),
    paymentUrl: text("payment_url"),
    qrCodeData: text("qr_code_data"),
    otpCode: text("otp_code"), // Код СМС-подтверждения 3D Secure

    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_payment_status").on(table.status),
    index("idx_payment_user").on(table.userId),
    index("idx_payment_advertiser").on(table.advertiserId),
    index("idx_payment_provider").on(table.provider),
    index("idx_payment_created_at").on(table.createdAt),
  ]
);

export const paymentWebhooksLog = pgTable(
  "payment_webhooks_log",
  {
    id: text("id").primaryKey(),
    transactionId: text("transaction_id"),
    provider: text("provider").notNull(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    signature: text("signature"),
    isVerified: boolean("is_verified").default(false).notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
  }
);
