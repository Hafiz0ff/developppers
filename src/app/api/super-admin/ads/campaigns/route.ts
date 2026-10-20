import { NextRequest, NextResponse } from "next/server";
import {
  getAllCampaigns,
  createCampaign,
  updateCampaign,
} from "@/lib/ads/ad-engine";

export async function GET() {
  try {
    const campaigns = getAllCampaigns();
    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.advertiserId || !body.name || !body.billingModel) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: advertiserId, name, billingModel" },
        { status: 400 }
      );
    }

    const campaign = createCampaign({
      advertiserId: body.advertiserId,
      name: body.name,
      billingModel: body.billingModel,
      bidAmountTjs: Number(body.bidAmountTjs) || 15,
      bidAmountUsd: Number(body.bidAmountUsd) || 1.4,
      totalBudgetTjs: Number(body.totalBudgetTjs) || 0,
      dailyLimitTjs: Number(body.dailyLimitTjs) || 0,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate,
      geoTargeting: body.geoTargeting || ["all"],
      categoryTargeting: body.categoryTargeting || ["all"],
      placementSlots: body.placementSlots || ["catalog_banner"],
      status: body.status || "active",
      creatives: body.creatives || [],
    });

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create campaign" },
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
        { success: false, error: "Missing campaign id" },
        { status: 400 }
      );
    }

    const updated = updateCampaign(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
