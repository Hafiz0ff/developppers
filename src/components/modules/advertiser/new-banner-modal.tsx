"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Layers, ArrowRight, UploadCloud, CheckCircle2 } from "lucide-react";

interface NewBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertiserId: string;
  onSuccess: () => void;
}

export function NewBannerModal({ open, onOpenChange, advertiserId, onSuccess }: NewBannerModalProps) {
  const [titleRu, setTitleRu] = useState("");
  const [titleTg, setTitleTg] = useState("");
  const [subtitleRu, setSubtitleRu] = useState("");
  const [ctaTextRu, setCtaTextRu] = useState("Узнать больше");
  const [targetUrl, setTargetUrl] = useState("https://");
  const [slot, setSlot] = useState<"block_1" | "block_2" | "catalog_banner">("block_1");
  const [billingModel, setBillingModel] = useState<"auction_cpm" | "auction_cpc">("auction_cpm");
  const [bidAmountTjs, setBidAmountTjs] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleRu || !targetUrl) {
      setError("Заполните название и целевую ссылку");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/advertiser/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advertiserId,
          titleRu,
          titleTg: titleTg || titleRu,
          subtitleRu,
          ctaTextRu,
          targetUrl,
          slot,
          billingModel,
          bidAmountTjs,
          bannerImageUrl: "/images/hero-bg.png",
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onOpenChange(false);
        setTitleRu("");
        setTitleTg("");
        setSubtitleRu("");
      } else {
        setError(data.error || "Не удалось создать баннер");
      }
    } catch {
      setError("Ошибка сети при отправке баннера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 sm:p-7 bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Запустить новый рекламный баннер / A-B тест
              </DialogTitle>
              <p className="text-xs text-slate-500">
                Таргетированные показы по платежеспособной аудитории Согда
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Заголовок баннера (RU) *
            </label>
            <Input
              value={titleRu}
              onChange={(e) => setTitleRu(e.target.value)}
              placeholder="Например: Ипотека для новосёлов от 16%"
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Заголовок баннера (TG - тоҷикӣ)
            </label>
            <Input
              value={titleTg}
              onChange={(e) => setTitleTg(e.target.value)}
              placeholder="Масалан: Ипотека барои хонадони нав аз 16%"
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Подзаголовок / Ключевое УТП
            </label>
            <Input
              value={subtitleRu}
              onChange={(e) => setSubtitleRu(e.target.value)}
              placeholder="Срок до 10 лет, оформление онлайн за 15 минут"
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Целевая ссылка (URL или WhatsApp) *
              </label>
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://..."
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Текст на кнопке (CTA)
              </label>
              <Input
                value={ctaTextRu}
                onChange={(e) => setCtaTextRu(e.target.value)}
                placeholder="Рассчитать / Оформить"
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Placement Slot Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Слот размещения
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "block_1", name: "Блок 1 (Боковой)", desc: "Карточка объекта" },
                { id: "block_2", name: "Блок 2 (Врезка)", desc: "Внутри контента" },
                { id: "catalog_banner", name: "Каталог", desc: "Сетка объявлений" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlot(s.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    slot === s.id
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="text-xs">{s.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Model & Bid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Модель аукциона
              </label>
              <select
                value={billingModel}
                onChange={(e) => setBillingModel(e.target.value as any)}
                className="w-full h-9 px-2 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="auction_cpm">CPM (за 1 000 показов)</option>
                <option value="auction_cpc">CPC (за клик по баннеру)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {billingModel === "auction_cpm" ? "Ставка за 1000 показов" : "Ставка за 1 клик"}
              </label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={bidAmountTjs}
                  onChange={(e) => setBidAmountTjs(Number(e.target.value))}
                  className="h-9 text-xs rounded-lg bg-white"
                />
                <span className="text-xs font-bold text-slate-700">TJS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-xl text-xs"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              {loading ? "Запуск..." : "Запустить показы баннера"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
