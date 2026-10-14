import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { issueOtp, verifyOtp } from "@/lib/classifieds/otp";
import { getClassifiedsActor } from "@/lib/classifieds/session";

const bodySchema = z.object({
  action: z.enum(["send", "verify"]),
  phone: z.string().trim().min(9).max(24),
  code: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    if (!actor) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
    }

    const { action, phone, code } = parsed.data;

    if (action === "send") {
      const issued = issueOtp(phone);
      console.log(`[OTP] code for ${phone}: ${issued}`);
      return NextResponse.json({
        success: true,
        simulated: !process.env.SMS_PROVIDER_KEY,
        message: "Код отправлен",
      });
    }

    if (!code || !verifyOtp(phone, code)) {
      return NextResponse.json({ success: false, error: "invalid_code" }, { status: 400 });
    }

    await db
      .update(users)
      .set({ phone, phoneVerified: true, updatedAt: new Date() })
      .where(eq(users.id, actor.id));

    return NextResponse.json({ success: true, phoneVerified: true });
  } catch (error) {
    console.error("Classified OTP error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
