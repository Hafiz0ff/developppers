import { NextRequest, NextResponse } from "next/server";
import {
  getAllAdvertisers,
  createAdvertiser,
  updateAdvertiser,
} from "@/lib/ads/ad-engine";
import { notifyTelegramSponsorshipLead } from "@/lib/telegram";

export async function GET() {
  try {
    const advertisers = getAllAdvertisers();
    return NextResponse.json({
      success: true,
      advertisers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load advertisers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.brandName || !body.contactPerson || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: companyName, brandName, contactPerson, phone" },
        { status: 400 }
      );
    }

    const advertiser = createAdvertiser({
      companyName: body.companyName,
      brandName: body.brandName,
      tin: body.tin || "",
      contactPerson: body.contactPerson,
      phone: body.phone,
      email: body.email || "",
      websiteUrl: body.websiteUrl || "",
      industry: body.industry || "other",
      tier: body.tier || "auction_bidder",
      status: body.status || "active",
      balanceTjs: Number(body.balanceTjs) || 0,
      balanceUsd: Number(body.balanceUsd) || 0,
      annualContractValueTjs: Number(body.annualContractValueTjs) || 0,
      notes: body.notes || "",
    });

    // Notify Telegram channel about new B2B partner / sponsorship lead
    try {
      notifyTelegramSponsorshipLead({
        companyName: body.companyName,
        brandName: body.brandName,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
        packageType: body.tier || "annual_sponsor",
        estimatedBudgetTjs: Number(body.annualContractValueTjs) || 35000,
        notes: body.notes,
      }).catch(() => {});
    } catch {}

    return NextResponse.json({
      success: true,
      advertiser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create advertiser" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing advertiser id" },
        { status: 400 }
      );
    }

    const updated = updateAdvertiser(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Advertiser not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      advertiser: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update advertiser" },
      { status: 500 }
    );
  }
}
