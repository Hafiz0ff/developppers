import { NextRequest, NextResponse } from "next/server";
import {
  getFintechAnalytics,
  listPaymentTransactions,
} from "@/lib/payments/payment-gateway";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;
    const provider = searchParams.get("provider") as any;
    const purpose = searchParams.get("purpose") as any;

    const analytics = getFintechAnalytics();
    const transactions = listPaymentTransactions({
      status,
      provider,
      purpose,
    });

    return NextResponse.json({
      success: true,
      analytics,
      transactions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка загрузки финтех-аналитики" },
      { status: 500 }
    );
  }
}
