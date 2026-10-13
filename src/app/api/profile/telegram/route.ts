import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendTelegramMessage } from "@/lib/telegram";

// Демо-хранилище настроек телеграма в памяти на случай оффлайн БД
let inMemoryTelegramSettings: Record<string, { chatId: string; enabled: boolean }> = {
  "default-user": {
    chatId: "",
    enabled: true,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id") || "default-user";

    let settings = inMemoryTelegramSettings[userId] || { chatId: "", enabled: true };

    try {
      const records = await db
        .select({
          telegramChatId: users.telegramChatId,
          telegramNotificationsEnabled: users.telegramNotificationsEnabled,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (records.length > 0 && records[0].telegramChatId !== null) {
        settings = {
          chatId: records[0].telegramChatId || "",
          enabled: records[0].telegramNotificationsEnabled ?? true,
        };
      }
    } catch {
      // Ignored
    }

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "SogdRealtyBot";

    return NextResponse.json({
      success: true,
      settings,
      botUsername,
      botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    });
  } catch (error) {
    console.error("Telegram settings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "default-user", chatId, enabled = true, action } = body;

    // 1. Тестовая отправка сообщения
    if (action === "test") {
      if (!chatId || chatId.trim() === "") {
        return NextResponse.json(
          { success: false, error: "Укажите Telegram Chat ID для проверки" },
          { status: 400 }
        );
      }

      const testHtml = [
        `🤖 <b>Тестовое уведомление Maskani.tj</b>`,
        ``,
        `✅ Ваш Telegram успешно подключен к личному кабинету маклера!`,
        `Теперь вы будете мгновенно получать уведомления, когда клиенты открывают номер или кликают WhatsApp на ваших объектах.`,
        ``,
        `🔗 <a href="https://sogd-realty.vercel.app/profile/crm">Открыть воронку CRM</a>`,
      ].join("\n");

      const result = await sendTelegramMessage(chatId.trim(), testHtml);

      return NextResponse.json({
        success: result.success,
        simulated: result.simulated,
        error: result.error,
        message: result.simulated
          ? "Бот в демо-режиме: уведомление эмулировано в логах"
          : "Тестовое сообщение успешно отправлено в ваш Telegram!",
      });
    }

    // 2. Сохранение настроек
    inMemoryTelegramSettings[userId] = {
      chatId: chatId?.trim() || "",
      enabled: Boolean(enabled),
    };

    try {
      await db
        .update(users)
        .set({
          telegramChatId: chatId?.trim() || null,
          telegramNotificationsEnabled: Boolean(enabled),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } catch {
      // Ignored if DB offline
    }

    return NextResponse.json({
      success: true,
      settings: inMemoryTelegramSettings[userId],
      message: "Настройки Telegram-уведомлений успешно сохранены",
    });
  } catch (error) {
    console.error("Telegram settings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
