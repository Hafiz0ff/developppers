"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import type { ClassifiedCard as ClassifiedCardData } from "@/lib/classifieds/map-card";

type Props = {
  item: ClassifiedCardData;
  formatPrice: (tjs: number, usd: number) => string;
};

function postLead(item: ClassifiedCardData, source: "phone_click" | "whatsapp_click") {
  fetch("/api/crm/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: source === "phone_click" ? "Посетитель сайта (Звонок)" : "Посетитель сайта (WhatsApp)",
      clientPhone: source === "phone_click" ? "+992 (просмотр номера)" : "+992 (переход в WA)",
      classifiedId: item.id,
      classifiedTitle: item.title,
      budget: item.priceUsd,
      commissionPercent: 2,
      source,
      notes: `Объявление: ${item.title} (${item.city}, ${item.district}).`,
    }),
  }).catch(() => {});
}

export function ClassifiedCard({ item, formatPrice }: Props) {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const [revealed, setRevealed] = useState(false);
  const href = `/classifieds/${item.slug}`;

  const dealTypeDisplay = isTg
    ? item.dealType === "Аренда"
      ? "Иҷора"
      : "Фурӯш"
    : item.dealType;

  const propertyTypeDisplay = isTg
    ? item.propertyType === "Квартира"
      ? "Хонадон"
      : item.propertyType.includes("Ҳавлӣ") || item.propertyType.includes("Дом")
      ? "Ҳавлӣ"
      : item.propertyType === "Коммерция"
      ? "Амволи тиҷоратӣ"
      : item.propertyType
    : item.propertyType;

  const sellerTypeDisplay = isTg
    ? item.sellerType === "Собственник"
      ? "Соҳибмулк"
      : item.sellerType === "Агентство"
      ? "Агентии амвол"
      : item.sellerType.includes("Риелтор")
      ? "Мутахассис (Риелтор)"
      : item.sellerType
    : item.sellerType;

  return (
    <Card className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 group">
      <div>
        <Link href={href} className="relative h-48 w-full overflow-hidden bg-slate-100 block">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-emerald-600 text-white text-[11px] font-medium shadow-xs">
              {dealTypeDisplay}
            </Badge>
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/90 text-slate-800 text-[11px] font-medium"
            >
              {propertyTypeDisplay}
            </Badge>
          </div>
          {item.isNegotiable && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-slate-700 px-2.5 py-1 rounded-md shadow-xs">
              {isTg ? "Савдо мешавад" : "Торг уместен"}
            </div>
          )}
        </Link>

        <CardContent className="p-4 sm:p-5 space-y-2.5">
          <div>
            <div className="text-lg font-bold text-emerald-600">
              {formatPrice(item.priceTjs, item.priceUsd)}
            </div>
            <Link href={href}>
              <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mt-0.5">{item.title}</h4>
            </Link>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              {item.city}, {item.district}
              {item.landmark ? ` (${item.landmark})` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 border-y border-slate-100 py-2 font-medium">
            <span className="font-bold text-slate-900">
              {isTg ? `${item.rooms} ҳуҷр.` : `${item.rooms} комн.`}
            </span>
            <span>•</span>
            <span className="font-bold text-slate-900">{item.area} м²</span>
            {item.floor || item.landArea ? (
              <>
                <span>•</span>
                <span>{item.floor || item.landArea}</span>
              </>
            ) : null}
          </div>
        </CardContent>
      </div>

      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">{sellerTypeDisplay}</span>
          <span className="font-semibold text-slate-900 font-mono text-xs">
            {revealed ? item.phone : `${item.phone.slice(0, 8)} •• ••`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={revealed ? "secondary" : "outline"}
            onClick={() => {
              const next = !revealed;
              setRevealed(next);
              if (next) postLead(item, "phone_click");
            }}
            className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg border-slate-200 cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            {revealed
              ? isTg
                ? "Пӯшидан"
                : "Скрыть"
              : isTg
              ? "Нишон додан"
              : "Показать"}
          </Button>
          <a
            href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => postLead(item, "whatsapp_click")}
            className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}
