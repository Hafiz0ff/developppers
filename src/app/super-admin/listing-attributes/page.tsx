"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  Archive,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Eye,
  Sliders,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListingIcon } from "@/components/ui/listing-icon";
import type {
  ListingSectionDefinition,
  ListingAttributeDefinition,
} from "@/lib/classifieds/attributes";

export default function SuperAdminListingAttributesPage() {
  const [sections, setSections] = useState<ListingSectionDefinition[]>([]);
  const [attributes, setAttributes] = useState<ListingAttributeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<"all" | "residential" | "commercial">("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchAttributes = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/super-admin/listing-attributes", {
        headers: { "x-test-role": "super_admin" },
      });
      const data = await res.json();
      if (data.success) {
        setSections(data.sections || []);
        setAttributes(data.attributes || []);
      } else {
        setActionError(data.error || "Ошибка загрузки характеристик");
      }
    } catch (err: any) {
      setActionError(err.message || "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleToggleActive = async (attr: ListingAttributeDefinition) => {
    const action = attr.active ? "archive" : "restore";
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch("/api/super-admin/listing-attributes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-test-role": "super_admin",
        },
        body: JSON.stringify({
          code: attr.code,
          action,
          reason: `SuperAdmin toggled active to ${!attr.active}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(
          `Характеристика '${attr.labels.ru}' успешно ${action === "archive" ? "архивирована" : "восстановлена"}`
        );
        // Update local state
        setAttributes((prev) =>
          prev.map((a) => (a.code === attr.code ? { ...a, active: !attr.active } : a))
        );
        setTimeout(() => setActionSuccess(null), 3500);
      } else {
        setActionError(data.message || data.error || "Ошибка выполнения операции");
      }
    } catch (err: any) {
      setActionError(err.message || "Сетевая ошибка при обновлении");
    }
  };

  // Filter attributes
  const filteredAttributes = attributes.filter((attr) => {
    // Group filter
    const section = sections.find((s) => s.code === attr.sectionCode);
    if (selectedGroup !== "all" && section?.targetGroup !== selectedGroup) {
      return false;
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName =
        attr.labels.ru.toLowerCase().includes(q) ||
        attr.labels.tg.toLowerCase().includes(q) ||
        attr.labels.en.toLowerCase().includes(q) ||
        attr.code.toLowerCase().includes(q);
      if (!matchName) return false;
    }

    return true;
  });

  const activeCount = attributes.filter((a) => a.active).length;
  const archivedCount = attributes.filter((a) => !a.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Справочники портала • SPEC_CLASSIFIEDS_AD_PLACEMENT v1.0
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 text-[11px]">
              Single Source of Truth
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            Характеристики и удобства объявлений
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Централизованное управление секциями, применимостью и иконками для жилой и коммерческой недвижимости
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAttributes}
            disabled={loading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </Button>
        </div>
      </div>

      {/* Metric Banners */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Всего характеристик</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{attributes.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-2xs">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-1">Активных в форме</span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{activeCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Архивировано</span>
          <span className="text-2xl font-black text-slate-600 dark:text-slate-400">{archivedCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Секций в матрице</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{sections.length}</span>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или коду..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedGroup("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedGroup === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70"
            }`}
          >
            Все ({attributes.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup("residential")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedGroup === "residential"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70"
            }`}
          >
            Жилая
          </button>
          <button
            type="button"
            onClick={() => setSelectedGroup("commercial")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedGroup === "commercial"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70"
            }`}
          >
            Коммерческая
          </button>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Иконка & Название</th>
                <th className="py-3 px-4">Код (ID)</th>
                <th className="py-3 px-4">Секция</th>
                <th className="py-3 px-4">Тип значения</th>
                <th className="py-3 px-4">Сделки</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredAttributes.map((attr) => {
                const sec = sections.find((s) => s.code === attr.sectionCode);
                const isLegal = attr.sectionCode === "legal_info";

                return (
                  <tr
                    key={attr.code}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                      !attr.active ? "opacity-60 bg-slate-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                          <ListingIcon iconKey={attr.iconKey} className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {attr.labels.ru}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {attr.labels.tg} • {attr.labels.en}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {attr.code}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          isLegal
                            ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                            : sec?.targetGroup === "commercial"
                            ? "bg-blue-500/10 text-blue-700 border-blue-500/30"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {sec?.labels.ru || attr.sectionCode}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {attr.valueType}
                        {attr.unit ? ` (${attr.unit.ru})` : ""}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {attr.appliesTo.deals.includes("sale") && attr.appliesTo.deals.length === 1 ? (
                        <span className="text-amber-600 font-semibold">Только продажа</span>
                      ) : (
                        <span>Продажа, аренда</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {attr.active ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 text-[10px]">
                          Активен
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-[10px]">
                          Архив
                        </Badge>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={attr.active ? "outline" : "default"}
                        onClick={() => handleToggleActive(attr)}
                        className={`text-xs h-7 px-2.5 ${
                          attr.active
                            ? "text-slate-600 hover:text-rose-600 hover:border-rose-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {attr.active ? (
                          <>
                            <Archive className="h-3 w-3 mr-1" />
                            Архивировать
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Восстановить
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
