import { NextRequest, NextResponse } from "next/server";
import {
  getAdvertiserCampaigns,
  addBannerToAdvertiser,
  updateCampaign,
} from "@/lib/ads/ad-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const advertiserId = searchParams.get("advertiserId");

    if (!advertiserId) {
      return NextResponse.json(
        { success: false, error: "Missing advertiserId parameter" },
        { status: 400 }
      );
    }

    const campaigns = getAdvertiserCampaigns(advertiserId);
    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load advertiser campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      advertiserId,
      titleRu,
      titleTg,
      subtitleRu,
      subtitleTg,
      ctaTextRu,
      ctaTextTg,
      targetUrl,
      slot = "block_1",
      billingModel = "auction_cpm",
      bidAmountTjs = 25,
      bannerImageUrl,
    } = body;

    if (!advertiserId || !titleRu || !targetUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: advertiserId, titleRu, targetUrl" },
        { status: 400 }
      );
    }

    const result = addBannerToAdvertiser(advertiserId, {
      titleRu,
      titleTg,
      subtitleRu,
      subtitleTg,
      ctaTextRu,
      ctaTextTg,
      targetUrl,
      slot,
      billingModel,
      bidAmountTjs: Number(bidAmountTjs) || 25,
      bannerImageUrl,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
