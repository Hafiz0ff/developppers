import { NextRequest, NextResponse } from "next/server";
import { getPaymentTransaction } from "@/lib/payments/payment-gateway";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tx = getPaymentTransaction(id);

    if (!tx) {
      return NextResponse.json(
        { success: false, error: "Платеж не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: tx,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка получения статуса платежа" },
      { status: 500 }
    );
  }
}
