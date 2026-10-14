"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Edit3, Eye, Check } from "lucide-react";
import type { FinishingFeature } from "@/lib/data/mock-db";
import { useLanguage } from "@/lib/i18n/language-context";

interface FinishingFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: FinishingFeature | null;
  mode?: "add" | "edit" | "view";
  onSave?: (feature: { id: string; title: string; description: string }) => void;
  onEditRequested?: (feature: FinishingFeature) => void;
}

const MAX_TITLE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 400;

export function FinishingFeatureDialog({
  open,
  onOpenChange,
  initialData,
  mode = "add",
  onSave,
  onEditRequested,
}: FinishingFeatureDialogProps) {
  const { language } = useLanguage();
  const isTg = language === "tg";
  const [currentMode, setCurrentMode] = useState<"add" | "edit" | "view">(mode);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentMode(mode);
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setError(null);
  }, [initialData, mode, open]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_TITLE_LENGTH) {
      setTitle(val);
      if (error) setError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(val);
      if (error) setError(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) {
      setError(
        isTg
          ? "Лутфан, сарлавҳаи хусусиятро зикр намоед"
          : "Пожалуйста, укажите заголовок характеристики"
      );
      return;
    }

    if (onSave) {
      onSave({
        id: initialData?.id || `ff_${Date.now()}`,
        title: cleanTitle,
        description: cleanDesc,
      });
    }

    onOpenChange(false);
  };

  const isViewMode = currentMode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-5">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              {isViewMode ? (
                <Eye className="h-4 w-4" />
              ) : currentMode === "edit" ? (
                <Edit3 className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <DialogTitle className="text-base font-bold">
              {isViewMode
                ? isTg ? "Муоинаи хусусияти пардоз" : "Просмотр характеристики отделки"
                : currentMode === "edit"
                ? isTg ? "Таҳрири хусусияти пардоз" : "Редактирование характеристики отделки"
                : isTg ? "Иловаи хусусияти пардоз" : "Добавление характеристики отделки"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {isViewMode
              ? isTg
                ? "Тавсифи муфассали қарори пардозии маҷмаа"
                : "Подробное описание отделочного решения комплекса"
              : isTg
              ? "Сарлавҳа ва тавсифи васеи меъёри пардозро барои харидорон пур намоед"
              : "Заполните заголовок и расширенное описание стандарта отделки для покупателей"}
          </DialogDescription>
        </DialogHeader>

        {isViewMode ? (
          /* View Mode */
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl bg-muted/40 border space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                {isTg ? "Сарлавҳа" : "Заголовок"}
              </span>
              <p className="text-sm font-semibold text-foreground">{title}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                {isTg ? "Тавсифи муфассал" : "Подробное описание"}
              </span>
              <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                {description || (isTg ? "Тавсиф зикр нашудааст" : "Описание не указано")}
              </p>
            </div>
          </div>
        ) : (
          /* Edit / Add Mode */
          <form onSubmit={handleSave} className="space-y-4 py-2">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Field 1: Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="finishing-title" className="text-xs font-semibold">
                  {isTg ? "Сарлавҳаи хусусият *" : "Заголовок характеристики *"}
                </Label>
                <span
                  className={`text-[11px] ${
                    title.length >= MAX_TITLE_LENGTH
                      ? "text-amber-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {title.length} / {MAX_TITLE_LENGTH}
                </span>
              </div>
              <Input
                id="finishing-title"
                placeholder={isTg ? "Масалан, Домофон" : "Например, Домофон"}
                value={title}
                onChange={handleTitleChange}
                maxLength={MAX_TITLE_LENGTH}
                autoFocus
                className="h-10 text-xs rounded-xl"
              />
              <p className="text-[11px] text-muted-foreground">
                {isTg
                  ? `Номи мухтасари хосият (то ${MAX_TITLE_LENGTH} аломат)`
                  : `Краткое емкое название опции (до ${MAX_TITLE_LENGTH} знаков)`}
              </p>
            </div>

            {/* Field 2: Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="finishing-desc" className="text-xs font-semibold">
                  {isTg ? "Тавсифи хусусият" : "Описание характеристики"}
                </Label>
                <span
                  className={`text-[11px] ${
                    description.length >= MAX_DESCRIPTION_LENGTH
                      ? "text-amber-600 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {description.length} / {MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <Textarea
                id="finishing-desc"
                rows={4}
                placeholder={
                  isTg
                    ? "Хусусиятҳоро муфассалтар шарҳ диҳед: маводҳо, бренди фурнитура, ҳамгироӣ бо «Хонаи ҳушманд»..."
                    : "Опишите подробнее особенности: материалы, бренд фурнитуры, интеграцию в Умный дом..."
                }
                value={description}
                onChange={handleDescriptionChange}
                maxLength={MAX_DESCRIPTION_LENGTH}
                className="text-xs rounded-xl resize-none"
              />
              <p className="text-[11px] text-muted-foreground">
                {isTg
                  ? `Тафсилоти муфассал барои харидорон (то ${MAX_DESCRIPTION_LENGTH} аломат)`
                  : `Подробные детали для покупателей (до ${MAX_DESCRIPTION_LENGTH} знаков)`}
              </p>
            </div>

            <DialogFooter className="pt-2 sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-xs rounded-xl"
              >
                {isTg ? "Бекор кардан" : "Отмена"}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!title.trim()}
                className="h-9 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs gap-1.5 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                {isTg ? "Сабт кардан" : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {isViewMode && (
          <DialogFooter className="pt-2 sm:justify-end gap-2">
            {initialData && onEditRequested && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs rounded-xl gap-1.5 cursor-pointer"
                onClick={() => {
                  if (initialData) onEditRequested(initialData);
                }}
              >
                <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                {isTg ? "Таҳрир кардан" : "Редактировать"}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-5 text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl cursor-pointer"
            >
              {isTg ? "Пӯшидан" : "Закрыть"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
