"use client";

import React, { useState } from "react";
import {
  Zap,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import type { ClassifiedCard } from "@/lib/classifieds/map-card";
import { VAS_SERVICES } from "@/lib/payments/payment-gateway";
import { PaymentModal } from "@/components/modules/payments/payment-modal";

interface PromoteClassifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: ClassifiedCard | null;
  onPromotionSuccess?: () => void;
}

export function PromoteClassifiedModal({
  isOpen,
  onClose,
  card,
  onPromotionSuccess,
}: PromoteClassifiedModalProps) {
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  const [selectedPlan, setSelectedPlan] = useState<
    "classified_top" | "classified_highlight" | "classified_urgent" | "classified_turbo"
  >("classified_top");
  const [payModalOpen, setPayModalOpen] = useState(false);

  const vasOptions = [
    {
      id: "classified_top" as const,
      nameRu: "Поднять в ТОП на 7 дней",
      nameTg: "Баровардан ба ТОП (7 рӯз)",
      priceTjs: 10,
      priceUsd: 0.92,
      durationRu: "7 дней",
      durationTg: "7 рӯз",
      icon: TrendingUp,
      perkRu: "Закрепление на самом верху каталога вторички + бейдж 👑 ТОП",
      perkTg: "Маҳкамкунӣ дар болои феҳрист + бейҷи 👑 ТОП",
      badge: "👑 ТОП",
    },
    {
      id: "classified_highlight" as const,
      nameRu: "Выделение в каталоге",
      nameTg: "Ҷудокунӣ дар феҳрист",
      priceTjs: 8,
      priceUsd: 0.73,
      durationRu: "14 дней",
      durationTg: "14 рӯз",
      icon: Sparkles,
      perkRu: "Выделенная рамка и приоритетное ранжирование",
      perkTg: "Чаҳорчӯбаи намоён ва бартарият дар ҷустуҷӯ",
      badge: "VIP",
    },
    {
      id: "classified_urgent" as const,
      nameRu: "Срочная продажа",
      nameTg: "Фурӯши таъҷилӣ",
      priceTjs: 7,
      priceUsd: 0.64,
      durationRu: "10 дней",
      durationTg: "10 рӯз",
      icon: Flame,
      perkRu: "Значок 🔥 Срочно на фотографии и фильтр срочных",
      perkTg: "Бейҷи 🔥 Таъҷилӣ дар болои сурат ва филтр",
      badge: "🔥 Срочно",
    },
    {
      id: "classified_turbo" as const,
      nameRu: "Турбо-пакет: Все включено",
      nameTg: "Бастаи «Турбо-фурӯш»",
      priceTjs: 20,
      priceUsd: 1.85,
      durationRu: "14 дней",
      durationTg: "14 рӯз",
      icon: Zap,
      perkRu: "ТОП + Выделение + Срочно со скидкой 20%",
      perkTg: "ТОП + Ҷудокунӣ + Таъҷилӣ бо тахфифи 20%",
      badge: "Скидка 20%",
      isBestValue: true,
    },
  ];

  const currentOption = vasOptions.find((o) => o.id === selectedPlan) || vasOptions[0];

  const handleStartPayment = () => {
    setPayModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen && !payModalOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-card text-foreground">
          {/* Header */}
          <div className="p-6 border-b border-border/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="secondary" className="text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{isTg ? "Хизматрасониҳои пулакӣ (VAS)" : "Платные услуги продвижения (VAS)"}</span>
              </Badge>

              <span className="text-xs text-muted-foreground font-medium">Корти Милли • DC • Alif • Эсхата</span>
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {isTg ? "Пешбарии эълон дар феҳрист" : "Продвижение объявления в каталоге"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {card
                ? isTg
                  ? `Эълон: «${card.title}» (${card.city})`
                  : `Объект: «${card.title}» (${card.city})`
                : isTg
                ? "Эълони худро интихоб намуда, фурӯшро 3 маротиба тезонед"
                : "Ускорьте продажу или сдачу квартиры до 3 раз с приоритетом в поиске"}
            </DialogDescription>
          </div>

          {/* Options Grid */}
          <div className="p-6 space-y-5">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                {isTg ? "Бастаи пешбариро интихоб кунед:" : "Выберите услугу продвижения:"}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vasOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedPlan === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedPlan(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                          : "border-border/80 hover:border-border bg-card"
                      }`}
                    >
                      {opt.isBestValue && (
                        <div className="absolute -top-2.5 right-3">
                          <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5 shadow-xs">
                            {isTg ? "Тахфифи 20%" : "Выгодно -20%"}
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-xs text-foreground">
                            {isTg ? opt.nameTg : opt.nameRu}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-snug">
                          {isTg ? opt.perkTg : opt.perkRu}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-border/60 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-foreground">
                            {opt.priceTjs} сом.
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (≈${opt.priceUsd})
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {isTg ? opt.durationTg : opt.durationRu}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Action Button */}
            <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-muted-foreground block">
                  {isTg ? "Маблағи пардохт:" : "Итого к оплате:"}
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {currentOption.priceTjs} сомони{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (≈${currentOption.priceUsd} USD)
                  </span>
                </span>
              </div>

              <Button
                onClick={handleStartPayment}
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-xs shadow-xs gap-2 cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                <span>
                  {isTg ? "Пардохти онлайн (Корти Миллӣ, DC)" : "Оплатить онлайн (Корти Милли, DC)"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embedded Payment Modal */}
      {card && (
        <PaymentModal
          isOpen={payModalOpen}
          onClose={() => {
            setPayModalOpen(false);
            onClose();
          }}
          purpose={selectedPlan}
          title={isTg ? currentOption.nameTg : currentOption.nameRu}
          subtitle={
            isTg
              ? `Барои эълон: «${card.title}» (${card.city})`
              : `Для объявления: «${card.title}» (${card.city})`
          }
          amountTjs={currentOption.priceTjs}
          classifiedId={card.id}
          onSuccess={() => {
            setPayModalOpen(false);
            onClose();
            if (onPromotionSuccess) onPromotionSuccess();
          }}
        />
      )}
    </>
  );
}
