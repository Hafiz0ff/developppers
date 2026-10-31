import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { getLinkedChannel } from "@/lib/publications/telegram-channel-store";

export async function GET(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const { searchParams } = new URL(req.url);

    const demoRole = searchParams.get("demoRole") || req.headers.get("x-demo-role");
    const role = actor?.role || demoRole || null;
    const actorId = actor?.id || (role === "developer" ? "usr_dev_rep_01" : "usr_realtor_01");

    if (!role) {
      return NextResponse.json(
        { success: false, error: "unauthorized", message: "Требуется авторизация" },
        { status: 401 }
      );
    }

    const channel = await getLinkedChannel(actorId);

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
