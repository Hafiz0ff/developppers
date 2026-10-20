"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Phone,
  MessageCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { serveAdBanner, ServedBannerResult } from "@/lib/ads/ad-engine";

interface SponsoredPartnerBannerProps {
  city?: string;
  category?: string;
  slot?: "catalog_banner" | "homepage_hero" | "search_featured";
  variant?: "card" | "horizontal" | "compact";
  className?: string;
}

export function SponsoredPartnerBanner({
  city = "all",
  category = "all",
  slot = "catalog_banner",
  variant = "horizontal",
  className = "",
}: SponsoredPartnerBannerProps) {
  const { language, tDual } = useLanguage();
  const [ad, setAd] = useState<ServedBannerResult | null>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    // Determine the banner to serve
    const banner = serveAdBanner({
      city,
      category,
      slot,
      language: language === "tg" ? "tg" : "ru",
    });
    setAd(banner);

    // Track impression
    if (banner && !hasTrackedImpression && banner.campaignId) {
      try {
        fetch("/api/ads/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: banner.campaignId,
            creativeId: banner.creativeId,
            eventType: "impression",
          }),
        }).catch(() => {});
        setHasTrackedImpression(true);
      } catch {
        // silent fail
      }
    }
  }, [city, category, slot, language, hasTrackedImpression]);

  if (!ad) return null;

  const handleClick = (e: React.MouseEvent) => {
    try {
      fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: ad.campaignId,
          creativeId: ad.creativeId,
          eventType: "click",
        }),
      }).catch(() => {});
    } catch {
      // silent
    }

    if (ad.actionType === "whatsapp" && ad.whatsapp) {
      e.preventDefault();
      window.open(
        `https://wa.me/${ad.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          tDual(
            `Здравствуйте! Пишу по партнерскому предложению «${ad.title}» на платформе Maskani.tj.`,
            `Салом! Ман дар бораи пешниҳоди шариконаи «${ad.title}» дар платформаи Maskani.tj муроҷиат мекунам.`
          )
        )}`,
        "_blank"
      );
    } else if (ad.actionType === "phone" && ad.phone) {
      e.preventDefault();
      window.location.href = `tel:${ad.phone.replace(/\s+/g, "")}`;
    }
  };

  const isAnnualSponsor = ad.tier === "sponsor_annual";
  const isAuctionBidder = ad.tier === "auction_bidder";

  // HORIZONTAL VARIANT (Great for catalog interstitial row or top/bottom banner)
  if (variant === "horizontal") {
    return (
      <div
        className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isAnnualSponsor
            ? "border-emerald-200/90 bg-linear-to-r from-emerald-950/90 via-slate-900 to-slate-950 text-white shadow-md shadow-emerald-950/20"
            : isAuctionBidder
            ? "border-blue-200/80 bg-linear-to-r from-slate-900 via-slate-900 to-blue-950 text-white shadow-md shadow-blue-950/20"
            : "border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm"
        } ${className}`}
      >
        {/* Glow Accent */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none ${
            isAnnualSponsor ? "bg-emerald-400" : "bg-blue-400"
          }`}
        />

        <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left Info Column */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {isAnnualSponsor ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Award className="h-3 w-3 text-emerald-400" />
                  <span>
                    {ad.badgeText ||
                      tDual("Генеральный партнер Согда", "Шарики генералии Суғд")}
                  </span>
                </Badge>
              ) : isAuctionBidder ? (
                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  <span>
                    {ad.badgeText ||
                      tDual("Рекомендуемый партнер", "Шарики тавсияшуда")}
                  </span>
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Megaphone className="h-3 w-3 text-amber-400" />
                  <span>{ad.badgeText || tDual("Партнерство", "Шарикӣ")}</span>
                </Badge>
              )}

              <span className="text-[11px] text-slate-400 font-medium">
                • {ad.advertiserName}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
              {ad.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ad.subtitle}
            </p>
          </div>

          {/* Right Action Column */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            {ad.actionType === "link" ? (
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm gap-2 transition-all">
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : ad.actionType === "whatsapp" ? (
              <Button
                onClick={handleClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm gap-2 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{ad.ctaText}</span>
              </Button>
            ) : (
              <Button
                onClick={handleClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm gap-2 transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>{ad.ctaText}</span>
              </Button>
            )}

            <Link href="/advertiser" className="text-center">
              <span className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors underline-offset-4 hover:underline">
                {tDual("Разместить рекламу", "Ҷойгиркунии реклама")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CARD VARIANT (Fits inside 3-column product grid alongside properties)
  return (
    <div
      className={`rounded-2xl border flex flex-col justify-between overflow-hidden relative p-5 transition-all duration-300 hover:shadow-lg ${
        isAnnualSponsor
          ? "border-emerald-300/80 bg-linear-to-b from-slate-900 via-slate-900 to-emerald-950 text-white shadow-md shadow-emerald-950/20"
          : isAuctionBidder
          ? "border-blue-300/80 bg-linear-to-b from-slate-900 via-slate-900 to-blue-950 text-white shadow-md shadow-blue-950/20"
          : "border-slate-200 bg-linear-to-b from-slate-900 to-slate-950 text-white shadow-sm"
      } ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isAnnualSponsor
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
            }`}
          >
            <Award className="h-3 w-3" />
            <span>
              {ad.badgeText ||
                (isAnnualSponsor
                  ? tDual("Генеральный партнер", "Шарики генералӣ")
                  : tDual("Спонсор", "Спонсор"))}
            </span>
          </Badge>

          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {tDual("Реклама", "Реклама")}
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {ad.advertiserName}
          </span>
          <h4 className="text-base font-extrabold tracking-tight text-white leading-snug">
            {ad.title}
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
          {ad.subtitle}
        </p>
      </div>

      <div className="pt-5 mt-4 border-t border-slate-700/60 space-y-2">
        {ad.actionType === "link" ? (
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="block w-full"
          >
            <Button className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs gap-2">
              <span>{ad.ctaText}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        ) : ad.actionType === "whatsapp" ? (
          <Button
            onClick={handleClick}
            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{ad.ctaText}</span>
          </Button>
        ) : (
          <Button
            onClick={handleClick}
            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>{ad.ctaText}</span>
          </Button>
        )}

        <div className="text-center">
          <Link
            href="/advertiser"
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
          >
            <span>{tDual("Стать партнером Maskani", "Шарики Maskani шудан")}</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
