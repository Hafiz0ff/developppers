import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentOtp } from "@/lib/payments/payment-gateway";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, otpCode } = body;

    if (!transactionId || !otpCode) {
      return NextResponse.json(
        { success: false, error: "Обязательные поля: transactionId, otpCode" },
        { status: 400 }
      );
    }

    const result = verifyPaymentOtp(transactionId, otpCode);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Неверный код СМС" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка проверки СМС-кода" },
      { status: 500 }
    );
  }
}
