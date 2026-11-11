"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Tv,
  Refrigerator,
  Flame,
  CheckCircle2,
  Percent,
  Calendar,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getAdBlock2Variant, MASKANI_AD_CONTACTS } from "@/lib/ads/ad-config";
import { AdModal } from "./ad-modal";

interface AdBlock2Props {
  seed: string | number;
  className?: string;
}

export function AdBlock2({ seed, className = "" }: AdBlock2Props) {
  const { tDual } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const variant = getAdBlock2Variant(seed);

  const prefilledArtelMsg = encodeURIComponent(
    "Здравствуйте! Интересует бытовая техника Artel для обустройства квартиры по объявлению на Maskani.tj."
  );

  return (
    <>
      <aside
        data-ad-slot="block-2"
        data-variant={variant}
        className={`w-full max-w-full lg:w-[340px] min-h-[400px] max-h-[450px] rounded-[12px] overflow-hidden border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between relative transition-all duration-200 hover:shadow-md ${className}`}
      >
        {/* Top Ad Identification Label */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <Badge
            variant="secondary"
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 backdrop-blur-md bg-black/40 text-white border-0 shadow-xs"
          >
            {tDual("Реклама", "Реклама")}
          </Badge>
        </div>

        {/* VARIANT 1 (40%): ARTEL VISUAL HERO POSTER */}
        {variant === "artel_standard" && (
          <div className="w-full h-full flex flex-col justify-between relative overflow-hidden bg-emerald-950">
            {/* Poster Creative Background */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/ads/artel-ad-banner.jpg"
                alt="Artel — Бытовая техника для каждого"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
            </div>

            {/* Top Brand & Tagline */}
            <div className="relative z-10 p-5 text-white">
              <span className="text-[13px] font-extrabold uppercase tracking-widest text-emerald-400 block font-mono">
                artel
              </span>
              <h4 className="text-xl font-extrabold tracking-tight leading-tight mt-1 text-white drop-shadow-md">
                {tDual("Бытовая техника для каждого", "Техникаи маишӣ барои ҳар як оила")}
              </h4>
              <p className="text-xs text-slate-200 mt-1.5 drop-shadow-sm font-medium leading-relaxed">
                {tDual(
                  "Холодильники, кондиционеры и стиральные машины для вашего нового дома.",
                  "Яхдонҳо, кондитсионерҳо ва мошинҳои ҷомашӯӣ барои хонаи нави шумо."
                )}
              </p>
            </div>

            {/* Bottom Key Features & CTA */}
            <div className="relative z-10 p-4 pt-0 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {tDual("Официальная гарантия 3 года", "Кафолати расмии 3 сол")}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {tDual("Доставка по Согду", "Бобури ба тамоми Суғд")}
                </span>
              </div>

              <a
                href={`https://wa.me/${MASKANI_AD_CONTACTS.whatsapp}?text=${prefilledArtelMsg}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-[10px] shadow-lg gap-2 cursor-pointer transition-all">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{tDual("Выбрать технику для дома", "Интихоби техника")}</span>
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* VARIANT 2 (60%): ARTEL APPLIANCES + MORTGAGE/FURNISHING COMBO */}
        {variant === "artel_mortgage_bundle" && (
          <div className="w-full h-full p-5 flex flex-col justify-between bg-card border-t-2 border-t-primary">
            <div className="space-y-4">
              {/* Brand Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-foreground text-sm tracking-tight leading-none font-mono">
                    ARTEL · ТАДЖИКИСТАН
                  </h4>
                  <span className="text-xs text-muted-foreground font-medium">
                    {tDual("Бытовая техника для каждого", "Техникаи маишӣ барои ҳар як оила")}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h3 className="text-base font-extrabold text-foreground tracking-tight leading-tight">
                  {tDual(
                    "Обустройте квартиру выгодно: техника + ипотека",
                    "Хонаро бо манфиат обод кунед: техника + ипотека"
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {tDual(
                    "Специальная программа для покупателей вторичного жилья с партнёрскими банками.",
                    "Барномаи махсус барои харидорони амвол бо бонкҳои шарик."
                  )}
                </p>
              </div>

              {/* Special Partner Terms */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60 shadow-2xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Percent className="w-3.5 h-3.5 text-primary" />
                    {tDual("Ипотека / кредит:", "Ипотека / қарз:")}
                  </span>
                  <span className="font-bold text-foreground">16% годовых</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60 shadow-2xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Wallet className="w-3.5 h-3.5 text-primary" />
                    {tDual("Лимит:", "Маблағ:")}
                  </span>
                  <span className="font-bold text-foreground">до 500 000 сомони</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60 shadow-2xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {tDual("Срок:", "Мӯҳлат:")}
                  </span>
                  <span className="font-bold text-foreground">до 10 лет</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 p-2 rounded-lg border border-primary/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{tDual("Скидка до 15% на комплект техники для новосёлов", "Тахфифи то 15% барои маҷмӯи техника")}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <a
                href={`https://wa.me/${MASKANI_AD_CONTACTS.whatsapp}?text=${prefilledArtelMsg}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button className="w-full font-bold text-xs h-10 rounded-xl shadow-xs gap-2">
                  <span>{tDual("Каталог техники Artel", "Каталоги техникаи Artel")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        )}
      </aside>

      <AdModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bannerTitle="Artel Бытовая техника (Блок 2)"
      />
    </>
  );
}
