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
        className={`w-full relative overflow-hidden rounded-2xl border border-border/80 bg-slate-900 text-white shadow-xs transition-all duration-200 ${className}`}
      >
        <div className="relative p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left Info Column */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {isAnnualSponsor ? (
                <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Award className="h-3 w-3 text-primary" />
                  <span>
                    {ad.badgeText ||
                      tDual("Генеральный партнер Согда", "Шарики генералии Суғд")}
                  </span>
                </Badge>
              ) : isAuctionBidder ? (
                <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>
                    {ad.badgeText ||
                      tDual("Рекомендуемый партнер", "Шарики тавсияшуда")}
                  </span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Megaphone className="h-3 w-3 text-primary" />
                  <span>{ad.badgeText || tDual("Партнерство", "Шарикӣ")}</span>
                </Badge>
              )}

              <span className="text-xs text-slate-400 font-medium">
                • {ad.advertiserName}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
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
                <Button className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs shadow-xs gap-2 transition-all">
                  <span>{ad.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : ad.actionType === "whatsapp" ? (
              <Button
                onClick={handleClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs shadow-xs gap-2 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{ad.ctaText}</span>
              </Button>
            ) : (
              <Button
                onClick={handleClick}
                className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs shadow-xs gap-2 transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>{ad.ctaText}</span>
              </Button>
            )}

            <Link href="/advertiser" className="text-center">
              <span className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline-offset-4 hover:underline">
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
      className={`rounded-2xl border border-border/80 bg-slate-900 text-white flex flex-col justify-between overflow-hidden relative p-5 transition-all duration-200 shadow-xs hover:shadow-md ${className}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          >
            <Award className="h-3 w-3 text-primary" />
            <span>
              {ad.badgeText ||
                (isAnnualSponsor
                  ? tDual("Генеральный партнер", "Шарики генералӣ")
                  : tDual("Спонсор", "Спонсор"))}
            </span>
          </Badge>

          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            {tDual("Реклама", "Реклама")}
          </span>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            {ad.advertiserName}
          </span>
          <h4 className="text-base font-bold tracking-tight text-white leading-snug">
            {ad.title}
          </h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
          {ad.subtitle}
        </p>
      </div>

      <div className="pt-5 mt-4 border-t border-slate-800 space-y-2">
        {ad.actionType === "link" ? (
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="block w-full"
          >
            <Button className="w-full h-10 rounded-xl font-semibold text-xs shadow-xs gap-2">
              <span>{ad.ctaText}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        ) : ad.actionType === "whatsapp" ? (
          <Button
            onClick={handleClick}
            className="w-full h-10 rounded-xl font-semibold text-xs shadow-xs gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{ad.ctaText}</span>
          </Button>
        ) : (
          <Button
            onClick={handleClick}
            className="w-full h-10 rounded-xl font-semibold text-xs shadow-xs gap-2"
          >
            <Phone className="h-4 w-4" />
            <span>{ad.ctaText}</span>
          </Button>
        )}

        <div className="text-center">
          <Link
            href="/advertiser"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1"
          >
            <span>{tDual("Стать партнером Maskani", "Шарики Maskani шудан")}</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
