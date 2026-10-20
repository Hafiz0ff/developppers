import { NextRequest, NextResponse } from "next/server";
import { confirmPayment } from "@/lib/payments/payment-gateway";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, externalId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "Обязательное поле: transactionId" },
        { status: 400 }
      );
    }

    const result = confirmPayment(transactionId, externalId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Не удалось подтвердить платеж" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка подтверждения платежа" },
      { status: 500 }
    );
  }
}
