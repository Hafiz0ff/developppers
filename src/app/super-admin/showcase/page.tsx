"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Layers,
  ExternalLink,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  type ShowcaseMiniCardConfig,
  type ShowcaseSectionConfig,
  computeMiniCardBadge,
} from "@/lib/showcase/showcase-store";

export default function SuperAdminShowcasePage() {
  const [activeTab, setActiveTab] = useState<"mini-cards" | "sections">("mini-cards");
  const [miniCards, setMiniCards] = useState<ShowcaseMiniCardConfig[]>([]);
  const [sections, setSections] = useState<ShowcaseSectionConfig[]>([]);
  const [allowedTargets, setAllowedTargets] = useState<{
    categories: Array<{ id: string; name: string; slug: string }>;
    catalogs: Array<{ id: string; name: string }>;
  }>({ categories: [], catalogs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load initial configuration
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/super-admin/showcase");
      const data = await res.json();
      if (data.success) {
        setMiniCards(data.miniCards);
        setSections(data.sections);
        setAllowedTargets(data.allowedTargets);
      }
    } catch (e) {
      console.error("Failed to load showcase config", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleToggleMiniCard = async (card: ShowcaseMiniCardConfig) => {
    const nextVis = !card.visible;
    const res = await fetch("/api/super-admin/showcase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_mini_card",
        id: card.id,
        updates: { visible: nextVis },
      }),
    });
    if (res.ok) {
      setMiniCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, visible: nextVis } : c))
      );
      setSaveStatus("Видимость мини-карточки сохранена");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleMoveMiniCard = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= miniCards.length) return;

    const updated = [...miniCards];
    const tempOrder = updated[idx].sortOrder;
    updated[idx].sortOrder = updated[targetIdx].sortOrder;
    updated[targetIdx].sortOrder = tempOrder;

    // Swap in array
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setMiniCards([...updated]);

    // Persist both
    await Promise.all([
      fetch("/api/super-admin/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_mini_card",
          id: updated[idx].id,
          updates: { sortOrder: updated[idx].sortOrder },
        }),
      }),
      fetch("/api/super-admin/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_mini_card",
          id: updated[targetIdx].id,
          updates: { sortOrder: updated[targetIdx].sortOrder },
        }),
      }),
    ]);
  };

  const handleToggleSection = async (section: ShowcaseSectionConfig) => {
    const nextVis = !section.visible;
    const res = await fetch("/api/super-admin/showcase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_section",
        id: section.id,
        updates: { visible: nextVis },
      }),
    });
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, visible: nextVis } : s))
      );
      setSaveStatus("Видимость секции сохранена");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleMoveSection = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    const tempOrder = updated[idx].sortOrder;
    updated[idx].sortOrder = updated[targetIdx].sortOrder;
    updated[targetIdx].sortOrder = tempOrder;

    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setSections([...updated]);

    await Promise.all([
      fetch("/api/super-admin/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_section",
          id: updated[idx].id,
          updates: { sortOrder: updated[idx].sortOrder },
        }),
      }),
      fetch("/api/super-admin/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_section",
          id: updated[targetIdx].id,
          updates: { sortOrder: updated[targetIdx].sortOrder },
        }),
      }),
    ]);
  };

  const handleResetDefaults = async () => {
    if (!confirm("Сбросить все настройки мини-карточек и секций к исходному состоянию ТЗ?")) return;
    const res = await fetch("/api/super-admin/showcase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_defaults" }),
    });
    const data = await res.json();
    if (data.success) {
      setMiniCards(data.miniCards);
      setSections(data.sections);
      setSaveStatus("Настройки успешно сброшены к эталонным");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase">
              ТЗ Этап 2 • Витрина
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              v1.0 Исправленная редакция
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Управление витриной главной страницы
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Настройка 7 навигационных мини-карточек верхнего блока и 8 витринных секций с автоматическим расчётом счётчиков без ручного переопределения (AC-40).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs font-semibold rounded-xl gap-1 text-slate-600"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Сбросить к дефолту</span>
          </Button>
          <Link href="/" target="_blank">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Главная витрина</span>
            </Button>
          </Link>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Security Rule Alert (AC-40, AC-35) */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Правила безопасности витрины (ТЗ Разделы 8.5 и 15):</p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            1. <strong>Счётчики не редактируются вручную:</strong> количество объектов (например, «25+», «30+», «5+») рассчитывается автоматически из актуальной базы данных.<br />
            2. <strong>Свободный ввод URL запрещен:</strong> цели мини-карточек и секций выбираются строго из реестра таксономии и каталогов. Скрытие карточки не удаляет целевую сущность (AC-38).
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("mini-cards")}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === "mini-cards"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Мини-карточки верхнего блока (7)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 ${
            activeTab === "sections"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Витринные секции (8)
        </button>
      </div>

      {/* Tab 1: Mini-Cards Table */}
      {activeTab === "mini-cards" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                7 утверждённых мини-карточек (156 × 213 px, Apple Tahoe)
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">
                {miniCards.filter((c) => c.visible).length} из {miniCards.length} активно
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {miniCards.map((card, idx) => {
                const liveBadge = computeMiniCardBadge(card);

                return (
                  <div
                    key={card.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Tahoe 3D Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        <img
                          src={card.icon}
                          alt={card.title.ru}
                          className="w-10 h-10 object-contain drop-shadow-sm"
                        />
                      </div>

                      {/* Titles & Target */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {card.title.ru}
                          </span>
                          <span className="text-slate-400 text-xs">/</span>
                          <span className="text-xs text-slate-500 font-medium">{card.title.tg}</span>
                          <span className="text-slate-400 text-xs">/</span>
                          <span className="text-xs text-slate-400 font-medium">{card.title.en}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            Цель: {card.targetId}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                            Счётчик: {liveBadge} (вычислен авто)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Visibility & Reordering */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveMiniCard(idx, "up")}
                          className="h-7 w-7 p-0 rounded-lg text-slate-600"
                          title="Поднять выше"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={idx === miniCards.length - 1}
                          onClick={() => handleMoveMiniCard(idx, "down")}
                          className="h-7 w-7 p-0 rounded-lg text-slate-600"
                          title="Опустить ниже"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <Button
                        variant={card.visible ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleMiniCard(card)}
                        className={`text-xs font-bold rounded-xl h-8 px-3 gap-1.5 ${
                          card.visible
                            ? "border-emerald-200 text-emerald-800 bg-emerald-50/70"
                            : "text-slate-400 bg-slate-100"
                        }`}
                      >
                        {card.visible ? (
                          <>
                            <Eye className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Показано</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Скрыто</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Showcase Sections Table */}
      {activeTab === "sections" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                8 витринных секций на главной (4 × 1 карточки на десктопе)
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">
                {sections.filter((s) => s.visible).length} из {sections.length} активно
              </Badge>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        {section.title.ru} ›
                      </span>
                      <span className="text-slate-400 text-xs">/</span>
                      <span className="text-xs text-slate-500 font-medium">{section.title.tg}</span>
                      <span className="text-slate-400 text-xs">/</span>
                      <span className="text-xs text-slate-400 font-medium">{section.title.en}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{section.subtitle.ru}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        Целевой переход: {section.targetCatalogId}
                      </span>
                      <span>•</span>
                      <span>Источник: {section.sourceType}</span>
                      <span>•</span>
                      <span>Сетка: 4 карточки (1 ряд)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, "up")}
                        className="h-7 w-7 p-0 rounded-lg text-slate-600"
                        title="Поднять выше"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMoveSection(idx, "down")}
                        className="h-7 w-7 p-0 rounded-lg text-slate-600"
                        title="Опустить ниже"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant={section.visible ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => handleToggleSection(section)}
                      className={`text-xs font-bold rounded-xl h-8 px-3 gap-1.5 ${
                        section.visible
                          ? "border-emerald-200 text-emerald-800 bg-emerald-50/70"
                          : "text-slate-400 bg-slate-100"
                      }`}
                    >
                      {section.visible ? (
                        <>
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Включена</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Выключена</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
