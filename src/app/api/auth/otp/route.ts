import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { issueOtp, verifyOtp } from "@/lib/classifieds/otp";
import { getClassifiedsActor } from "@/lib/classifieds/session";

const bodySchema = z.object({
  action: z.enum(["send", "verify"]),
  phone: z.string().trim().min(6).max(28),
  code: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "invalid_input", message: "Некорректные параметры запроса" },
        { status: 400 }
      );
    }

    const { action, phone, code } = parsed.data;
    const normalizedPhone = phone.replace(/\s+/g, "");
    const isSimulated = !process.env.SMS_PROVIDER_KEY;

    if (action === "send") {
      const issued = issueOtp(normalizedPhone, Date.now(), 4);
      console.log(`[Maskani Auth V7 OTP] 4-digit code for ${normalizedPhone}: ${issued}`);
      return NextResponse.json({
        success: true,
        simulated: isSimulated,
        demoCode: isSimulated ? issued : undefined,
        message: "Проверочный 4-значный код отправлен",
      });
    }

    if (!code || !/^\d{4,6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: "invalid_code", message: "Введите корректный код" },
        { status: 400 }
      );
    }

    // Explicitly reject "0000" in simulation so error state & shake animation can be tested
    if (code === "0000") {
      return NextResponse.json(
        { success: false, error: "invalid_code", message: "Неверный код подтверждения" },
        { status: 400 }
      );
    }

    const isValidIssued = verifyOtp(normalizedPhone, code);
    const isDemoPasscode = isSimulated && (code === "4545" || code === "1234" || code.length === 4);

    if (!isValidIssued && !isDemoPasscode) {
      return NextResponse.json(
        { success: false, error: "invalid_code", message: "Неверный или истёкший код" },
        { status: 400 }
      );
    }

    // If user is authenticated, mark phoneVerified = true in DB (best effort if DB is online)
    try {
      const actor = await getClassifiedsActor();
      if (actor?.id) {
        await db
          .update(users)
          .set({ phone, phoneVerified: true, updatedAt: new Date() })
          .where(eq(users.id, actor.id));
      }
    } catch {
      // Offline / demo environment fallback — verification still succeeds
    }

    return NextResponse.json({
      success: true,
      phoneVerified: true,
    });
  } catch (error) {
    console.error("Maskani Auth OTP error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
