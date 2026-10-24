import { NextResponse } from "next/server";
import { generateSitemapIndexXml } from "@/lib/seo/sitemap-generator";

export async function GET() {
  const xml = generateSitemapIndexXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}
