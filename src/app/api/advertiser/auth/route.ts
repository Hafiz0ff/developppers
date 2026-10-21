import { NextRequest, NextResponse } from "next/server";
import { getAllAdvertisers, getAdvertiserById } from "@/lib/ads/ad-engine";

export async function GET() {
  try {
    const list = getAllAdvertisers().map((a) => ({
      id: a.id,
      companyName: a.companyName,
      brandName: a.brandName,
      phone: a.phone,
      tier: a.tier,
      contactPerson: a.contactPerson,
      balanceTjs: a.balanceTjs,
    }));

    return NextResponse.json({
      success: true,
      advertisers: list,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch advertisers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { advertiserId, phone, otpCode } = body;

    // Fast login by ID
    if (advertiserId) {
      const adv = getAdvertiserById(advertiserId);
      if (!adv) {
        return NextResponse.json(
          { success: false, error: "Рекламодатель не найден" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        advertiser: adv,
      });
    }

    // Phone + SMS OTP login (accepts standard demo '1234')
    if (phone) {
      if (otpCode !== "1234") {
        return NextResponse.json(
          { success: false, error: "Неверный СМС-код (используйте 1234)" },
          { status: 400 }
        );
      }

      const all = getAllAdvertisers();
      const cleanPhone = phone.replace(/\D/g, "");
      const found = all.find((a) => a.phone.replace(/\D/g, "").includes(cleanPhone)) || all[0];

      return NextResponse.json({
        success: true,
        advertiser: found,
      });
    }

    return NextResponse.json(
      { success: false, error: "Укажите advertiserId или phone с otpCode" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}
