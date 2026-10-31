import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { verifyTelegramChannelAdmin } from "@/lib/publications/telegram-publisher";
import { saveLinkedChannel } from "@/lib/publications/telegram-channel-store";

export async function POST(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const body = await req.json();

    const { channelUsername, demoRole } = body;
    const role = actor?.role || demoRole || null;
    const actorId = actor?.id || (role === "developer" ? "usr_dev_rep_01" : "usr_realtor_01");

    const isRealtor = role === "realtor" || role === "agency_agent" || role === "agency";
    const isDeveloper = role === "developer";
    const isSuperAdmin = role === "super_admin" || role === "admin";

    if (!role || (!isRealtor && !isDeveloper && !isSuperAdmin)) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ к подключению Telegram-канала разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    if (!channelUsername || typeof channelUsername !== "string" || channelUsername.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "bad_request",
          message: "Укажите имя канала (например, @my_channel или https://t.me/my_channel)",
        },
        { status: 400 }
      );
    }

    // Verify channel exists and bot has admin publishing rights
    const verification = await verifyTelegramChannelAdmin(channelUsername);

    if (!verification.verified) {
      return NextResponse.json(
        {
          success: false,
          error: "verification_failed",
          message: verification.error || "Не удалось подтвердить права администратора бота в канале",
          details: verification,
        },
        { status: 400 }
      );
    }

    // Save as default channel for this account
    const saved = await saveLinkedChannel({
      userId: actorId,
      channelUsername: verification.channelUsername,
      channelTitle: verification.channelTitle || verification.channelUsername,
      channelId: verification.channelId,
      verifiedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      verified: true,
      channel: saved,
      simulated: verification.simulated,
    });
  } catch (error) {
    console.error("Telegram verify channel POST error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при проверке Telegram-канала" },
      { status: 500 }
    );
  }
}
