import { NextRequest, NextResponse } from "next/server";
import { getPublicationsActor } from "@/lib/publications/auth-guard";
import { getLinkedChannel } from "@/lib/publications/telegram-channel-store";

export async function GET(req: NextRequest) {
  try {
    const actor = await getPublicationsActor(req);

    if (!actor) {
      return NextResponse.json(
        { success: false, error: "unauthorized", message: "Требуется авторизация" },
        { status: 401 }
      );
    }

    const channel = await getLinkedChannel(actor.id);

    return NextResponse.json({
      success: true,
      channel,
      botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    });
  } catch (error) {
    console.error("Telegram get channel GET error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при получении настроек канала" },
      { status: 500 }
    );
  }
}
