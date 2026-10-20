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
      color: "text-amber-600 bg-amber-50 border-amber-300",
      perkRu: "Закрепление на самом верху каталога вторички + бейдж 👑 ТОП",
      perkTg: "Маҳкамкунӣ дар болои феҳрист + бейҷи 👑 ТОП",
      badge: "👑 ТОП",
    },
    {
      id: "classified_highlight" as const,
      nameRu: "Выделение цветом",
      nameTg: "Ҷудокунӣ бо ранг",
      priceTjs: 8,
      priceUsd: 0.73,
      durationRu: "14 дней",
      durationTg: "14 рӯз",
      icon: Sparkles,
      color: "text-emerald-600 bg-emerald-50 border-emerald-300",
      perkRu: "Золотистая рамка с градиентом и мягким фоном",
      perkTg: "Чаҳорчӯбаи заррин ва фони махсус",
      badge: "✨ VIP",
    },
    {
      id: "classified_urgent" as const,
      nameRu: "Срочная продажа (огонь)",
      nameTg: "Фурӯши таъҷилӣ (оташ)",
      priceTjs: 7,
      priceUsd: 0.64,
      durationRu: "10 дней",
      durationTg: "10 рӯз",
      icon: Flame,
      color: "text-red-600 bg-red-50 border-red-300",
      perkRu: "Яркий пульсирующий значок 🔥 Срочно на фотографии",
      perkTg: "Бейҷи дурахшони 🔥 Таъҷилӣ дар болои сурат",
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
      color: "text-purple-600 bg-purple-50 border-purple-300",
      perkRu: "👑 ТОП + ✨ Золотая рамка + 🔥 Срочно со скидкой 20%",
      perkTg: "👑 ТОП + ✨ Чаҳорчӯба + 🔥 Таъҷилӣ бо тахфифи 20%",
      badge: "⚡ Скидка 20%",
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
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border-slate-200 shadow-2xl bg-white">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs mb-2">
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span>{isTg ? "Хизматрасониҳои пулакӣ (Freemium)" : "Платные услуги продвижения (VAS)"}</span>
              </Badge>

              <span className="text-[11px] text-slate-400">Корти Милли • DC • Alif • Эсхата</span>
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isTg ? "Пешбарии эълон дар феҳрист" : "Продвижение объявления в каталоге"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300 mt-1">
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
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
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
                          ? "border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {opt.isBestValue && (
                        <div className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                          {isTg ? "Фоиданоктарин" : "Выгодно -20%"}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${opt.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-extrabold text-xs text-slate-900">
                              {isTg ? opt.nameTg : opt.nameRu}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 leading-snug">
                          {isTg ? opt.perkTg : opt.perkRu}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-slate-900">
                            {opt.priceTjs} смн
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (~${opt.priceUsd})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {isTg ? opt.durationTg : opt.durationRu}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Action Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">
                  {isTg ? "Маблағи пардохт:" : "Итого к оплате:"}
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {currentOption.priceTjs} сомони{" "}
                  <span className="text-xs text-emerald-600 font-semibold">
                    (~${currentOption.priceUsd} USD)
                  </span>
                </span>
              </div>

              <Button
                onClick={handleStartPayment}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md gap-2 cursor-pointer"
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
