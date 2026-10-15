"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { MASKANI_AD_CONTACTS } from "@/lib/ads/ad-config";

interface AdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerTitle?: string;
}

export function AdModal({ open, onOpenChange, bannerTitle }: AdModalProps) {
  const { tDual } = useLanguage();

  const prefilledWhatsappMsg = encodeURIComponent(
    `Здравствуйте! Интересует размещение рекламы на Maskani.tj (запрос по баннеру: ${bannerTitle || "Сайдбар карточки вторички"}). Подскажите условия и пакеты.`
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 sm:p-7 rounded-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white text-[11px] font-semibold gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{tDual("Реклама на Maskani.tj", "Реклама дар Maskani.tj")}</span>
            </Badge>
            <span className="text-xs text-muted-foreground">B2B & Корпоративные пакеты</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {tDual(
              "Ваша аудитория — покупатели недвижимости в Таджикистане",
              "Мухотабони шумо — харидорони амвол дар Тоҷикистон"
            )}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {tDual(
              "Maskani.tj объединяет активных покупателей квартир, инвесторов, застройщиков и новосёлов Согда и Душанбе.",
              "Maskani.tj харидорони фаъол, сармоягузорон ва сохтмончиёни Суғд ва Душанберо муттаҳид мекунад."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {/* Formats highlight */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{tDual("Спонсорство (1 год)", "Сарпарастӣ (1 сол)")}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {tDual(
                  "Фиксированное премиум-место во всех карточках каталога.",
                  "Ҷойи собити олӣ дар тамоми эълонҳои феҳрист."
                )}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{tDual("Аукцион и гео", "Музояда ва макон")}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {tDual(
                  "Таргетинг по городам, категориям (вторичка / новостройки) и бюджету.",
                  "Ҳадафгирӣ аз рӯи шаҳрҳо, гурӯҳҳо ва буҷа."
                )}
              </p>
            </div>
          </div>

          {/* Partner benefits */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200 space-y-1.5">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {tDual("Для банков, ритейла и брендов стройматериалов:", "Барои бонкҳо ва брендҳои техника:")}
            </span>
            <p className="text-[11px] leading-relaxed opacity-90">
              {tDual(
                "Банки (ипотека и страхование), ритейлеры техники (Артель), девелоперы и строительные компании получают прямой поток тёплых заявок.",
                "Бонкҳо (ипотека ва суғурта), фурӯшандагони техника ва ширкатҳои сохтмонӣ муштариёни воқеӣ мегиранд."
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <a
            href={`https://wa.me/${MASKANI_AD_CONTACTS.whatsapp}?text=${prefilledWhatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs h-10 gap-2 shadow-sm rounded-xl">
              <MessageCircle className="w-4 h-4" />
              <span>{tDual("Написать в WhatsApp", "Навиштан дар WhatsApp")}</span>
            </Button>
          </a>

          <a href={`tel:${MASKANI_AD_CONTACTS.phone.replace(/\s/g, "")}`} className="w-full sm:flex-1">
            <Button variant="outline" className="w-full text-xs h-10 gap-2 rounded-xl border-slate-200 font-semibold">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{MASKANI_AD_CONTACTS.phone}</span>
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
