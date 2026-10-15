"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Percent,
  Calendar,
  Wallet,
  Shield,
  Home,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getAdBlock1Variant, MASKANI_AD_CONTACTS } from "@/lib/ads/ad-config";
import { AdModal } from "./ad-modal";

interface AdBlock1Props {
  seed: string | number;
  className?: string;
}

export function AdBlock1({ seed, className = "" }: AdBlock1Props) {
  const { language, tDual } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const variant = getAdBlock1Variant(seed);

  const prefilledEskhataMortgageMsg = encodeURIComponent(
    "Здравствуйте! Интересует ипотека от Банка Эсхата (16% годовых, до 500 000 сомони, до 10 лет) по объявлению на Maskani.tj."
  );

  const prefilledEskhataInsuranceMsg = encodeURIComponent(
    "Здравствуйте! Интересует страхование недвижимости в Эсхата Страхование (тариф 0.3% - 10%) по объявлению на Maskani.tj."
  );

  return (
    <>
      <aside
        data-ad-slot="block-1"
        data-variant={variant}
        className={`w-full max-w-full lg:w-[340px] min-h-[420px] max-h-[450px] rounded-[12px] overflow-hidden border border-slate-200/90 bg-white shadow-sm flex flex-col justify-between relative transition-all duration-200 hover:shadow-md ${className}`}
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

        {/* VARIANT 1 (40%): MASKANI SELF-PROMO WITH BANNER IMAGE */}
        {variant === "self_promo" && (
          <div
            onClick={() => setModalOpen(true)}
            className="w-full h-full flex flex-col justify-between cursor-pointer group relative overflow-hidden bg-emerald-900"
          >
            {/* Background Creative Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/ads/maskani-ad-banner.jpg"
                alt="Ваша реклама на Maskani.tj"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-black/20" />
            </div>

            {/* Top Brand Tagline */}
            <div className="relative z-10 p-5 text-white">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block">
                MASKANI.TJ
              </span>
              <h4 className="text-xl font-extrabold tracking-tight leading-tight mt-1 drop-shadow-md">
                {tDual("ВАША РЕКЛАМА ЗДЕСЬ", "РЕКЛАМАИ ШУМО ДАР ИН ҶО")}
              </h4>
              <p className="text-xs text-emerald-100/90 mt-1 drop-shadow-sm font-medium">
                {tDual("Ваша аудитория — на Maskani.tj", "Мухотабони шумо — дар Maskani.tj")}
              </p>
            </div>

            {/* Bottom Call to Action */}
            <div className="relative z-10 p-4 pt-0">
              <Button
                size="sm"
                className="w-full bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs h-10 rounded-[10px] shadow-lg gap-2 cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
              >
                <span>{tDual("Разместить рекламу", "Ҷойгиркунии реклама")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </Button>
            </div>
          </div>
        )}

        {/* VARIANT 2 (30%): BANK ESKHATA MORTGAGE */}
        {variant === "eskhata_mortgage" && (
          <div className="w-full h-full p-5 flex flex-col justify-between bg-gradient-to-br from-white via-rose-50/40 to-red-50/70 border-t-4 border-t-[#B71C1C]">
            <div className="space-y-4">
              {/* Brand Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B71C1C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#B71C1C] text-sm tracking-tight leading-none">
                    БАНК ЭСХАТА
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {tDual("Надёжный банк Таджикистана", "Бонки боэътимоди Тоҷикистон")}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                  {tDual("Станьте владельцем своего дома", "Соҳиби хонаи худ шавед")}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {tDual(
                    "Выгодная ипотека для покупки квартир и домов на вторичном рынке.",
                    "Ипотекаи мусоид барои хариди хонаҳо дар бозори дуюмдараҷа."
                  )}
                </p>
              </div>

              {/* Terms Pillars */}
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Percent className="w-3.5 h-3.5 text-[#B71C1C]" />
                    {tDual("Ставка:", "Меъёр:")}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">16% годовых</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Wallet className="w-3.5 h-3.5 text-[#B71C1C]" />
                    {tDual("Сумма кредита:", "Маблағи қарз:")}
                  </span>
                  <span className="font-bold text-slate-900">до 500 000 сомони</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-100 shadow-2xs">
                  <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#B71C1C]" />
                    {tDual("Срок ипотеки:", "Мӯҳлати ипотека:")}
                  </span>
                  <span className="font-bold text-slate-900">до 10 лет</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <a
                href={`https://wa.me/${MASKANI_AD_CONTACTS.whatsapp}?text=${prefilledEskhataMortgageMsg}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button className="w-full bg-[#B71C1C] hover:bg-[#991414] text-white font-bold text-xs h-10 rounded-[10px] shadow-sm gap-2">
                  <span>{tDual("Рассчитать ипотеку", "Ҳисоб кардани ипотека")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* VARIANT 3 (30%): ESKHATA INSURANCE */}
        {variant === "eskhata_insurance" && (
          <div className="w-full h-full p-5 flex flex-col justify-between bg-gradient-to-br from-white via-blue-50/40 to-sky-50/70 border-t-4 border-t-[#0277BD]">
            <div className="space-y-4">
              {/* Brand Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0277BD] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0277BD] text-sm tracking-tight leading-none">
                    ЭСХАТА СТРАХОВАНИЕ
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {tDual("Защита имущества и семьи", "Ҳимояи амвол ва оила")}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                  {tDual("Защитите свой дом с помощью страхования", "Хонаи худро тавассути суғурта ҳимоя кунед")}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {tDual(
                    "Полное покрытие рисков: пожары, затопления, стихийные бедствия и гражданская ответственность.",
                    "Ҳимояи пурра аз сӯхтор, обхезӣ ва дигар ҳолатҳои фавқулодда."
                  )}
                </p>
              </div>

              {/* Tariff Card */}
              <div className="p-3 rounded-xl bg-white border border-sky-100 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-sky-900">
                  <Shield className="w-4 h-4 text-[#0277BD]" />
                  <span>{tDual("Годовой страховой тариф:", "Тарофаи солонаи суғурта:")}</span>
                </div>
                <div className="text-base font-extrabold text-[#0277BD]">
                  от 0,3% до 10%
                </div>
                <div className="text-[11px] text-slate-500">
                  {tDual("от страховой суммы объекта недвижимости", "аз маблағи суғуртаи амвол")}
                </div>
              </div>

              {/* Quick Perks */}
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{tDual("Оформление онлайн за 15 минут", "Барасмиятдарорӣ дар 15 дақиқа")}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <a
                href={`https://wa.me/${MASKANI_AD_CONTACTS.whatsapp}?text=${prefilledEskhataInsuranceMsg}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button className="w-full bg-[#0277BD] hover:bg-[#01579B] text-white font-bold text-xs h-10 rounded-[10px] shadow-sm gap-2">
                  <span>{tDual("Оформить полис", "Гирифтани суғуртанома")}</span>
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
        bannerTitle={
          variant === "self_promo"
            ? "Ваша реклама здесь (Блок 1)"
            : variant === "eskhata_mortgage"
            ? "Банк Эсхата Ипотека (Блок 1)"
            : "Эсхата Страхование (Блок 1)"
        }
      />
    </>
  );
}
