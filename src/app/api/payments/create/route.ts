import { NextRequest, NextResponse } from "next/server";
import { createPaymentOrder, CreatePaymentOrderRequest } from "@/lib/payments/payment-gateway";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreatePaymentOrderRequest;

    if (!body.purpose || !body.amountTjs || !body.provider || !body.payerPhone) {
      return NextResponse.json(
        { success: false, error: "Обязательные поля: purpose, amountTjs, provider, payerPhone" },
        { status: 400 }
      );
    }

    if (body.amountTjs <= 0) {
      return NextResponse.json(
        { success: false, error: "Сумма платежа должна быть больше 0" },
        { status: 400 }
      );
    }

    const tx = createPaymentOrder(body);

    return NextResponse.json({
      success: true,
      transaction: tx,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка создания платежного заказа" },
      { status: 500 }
    );
  }
}
