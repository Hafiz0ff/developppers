"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit,
  Eye,
  FileText,
  Search,
  ExternalLink,
  Sliders,
  Sparkles,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { TaxonomyCategory } from "@/lib/seo/taxonomy-store";
import type { BatchSeoAuditReport } from "@/lib/seo/batch-seo-processor";

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<TaxonomyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"categories" | "audit" | "aliases">("categories");

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TaxonomyCategory | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [nameRu, setNameRu] = useState("");
  const [nameTg, setNameTg] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugRu, setSlugRu] = useState("");
  const [slugTg, setSlugTg] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugMode, setSlugMode] = useState<"AUTO" | "MANUAL">("MANUAL");
  const [isIndexable, setIsIndexable] = useState(false);
  const [code, setCode] = useState("");

  // Preview state
  const [previewData, setPreviewData] = useState<{
    affectedListingsCount: number;
    sampleOldUrls: string[];
    sampleNewUrls: string[];
    redirectPlan: Array<{ from: string; to: string }>;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Audit state
  const [auditReport, setAuditReport] = useState<BatchSeoAuditReport | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin/categories");
      const json = await res.json();
      if (json.success && json.categories) {
        setCategories(json.categories);
      }
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Trigger DRY RUN audit
  const handleRunAudit = async () => {
    try {
      setAuditLoading(true);
      setActiveTab("audit");
      const res = await fetch("/api/super-admin/seo/dry-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: true }),
      });
      const json = await res.json();
      if (json.success && json.report) {
        setAuditReport(json.report);
      }
    } catch (e) {
      console.error("Audit failed", e);
    } finally {
      setAuditLoading(false);
    }
  };

  const openEditModal = (cat: TaxonomyCategory) => {
    setEditingCategory(cat);
    setIsNewCategory(false);
    setCode(cat.code);
    setNameRu(cat.name.ru);
    setNameTg(cat.name.tg);
    setNameEn(cat.name.en);
    setSlugRu(cat.slug.ru);
    setSlugTg(cat.slug.tg);
    setSlugEn(cat.slug.en);
    setSlugMode(cat.slugMode);
    setIsIndexable(cat.indexable);
    setPreviewData(null);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingCategory(null);
    setIsNewCategory(true);
    setCode(`cat_${Date.now()}`);
    setNameRu("");
    setNameTg("");
    setNameEn("");
    setSlugRu("");
    setSlugTg("");
    setSlugEn("");
    setSlugMode("AUTO");
    setIsIndexable(false); // Rule AC-23: false by default
    setPreviewData(null);
    setIsModalOpen(true);
  };

  // Check preview of slug changes
  const handleCheckPreview = async () => {
    if (!editingCategory) return;
    try {
      setPreviewLoading(true);
      const res = await fetch("/api/super-admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory.id,
          isPreview: true,
          name: { ru: nameRu, tg: nameTg, en: nameEn },
          slug: { ru: slugRu, tg: slugTg, en: slugEn },
          slugMode,
        }),
      });
      const json = await res.json();
      if (json.success && json.preview) {
        setPreviewData(json.preview);
      }
    } catch (e) {
      console.error("Failed to generate preview", e);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      setSaving(true);
      const method = isNewCategory ? "POST" : "PATCH";
      const payload: Record<string, unknown> = {
        name: { ru: nameRu, tg: nameTg, en: nameEn },
        slug: { ru: slugRu, tg: slugTg, en: slugEn },
        slugMode,
        indexable: isIndexable,
      };

      if (isNewCategory) {
        payload.code = code;
        payload.routeKind = "combined";
      } else if (editingCategory) {
        payload.id = editingCategory.id;
      }

      const res = await fetch("/api/super-admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        loadCategories();
      } else {
        alert(json.error || "Ошибка сохранения");
      }
    } catch (e) {
      console.error("Save error", e);
      alert("Ошибка сети");
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.ru.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Globe className="h-4 w-4" />
            <span>Таксономия и SEO-маршруты · Maskani.tj v1.7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Управление категориями и SEO
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Централизованный справочник категорий, локализованные SEO-slug, режимы AUTO/MANUAL, allowlist индексации и пакетный аудит DRY RUN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={handleRunAudit}
            disabled={auditLoading}
            variant="outline"
            className="h-10 px-4 rounded-xl border-emerald-500/30 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 font-semibold text-xs shadow-xs gap-2 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${auditLoading ? "animate-spin" : ""}`} />
            <span>{auditLoading ? "Анализирую..." : "Запустить DRY RUN"}</span>
          </Button>

          <Button
            onClick={openNewModal}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Новая категория</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Всего категорий</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {categories.length}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              3 сделки · 5 типов объектов
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-linear-to-b from-emerald-50/30 via-white to-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Индексируемые (Allowlist)</span>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {categories.filter((c) => c.indexable).length}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Только качественные посадочные страницы
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Локали URL</span>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              RU · TG · EN
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              RU без префикса, TG /tg/, EN /en/
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Режим генерации</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Zero Manual SEO
            </div>
            <p className="text-[11px] text-amber-700 font-semibold">
              Партнёры заполняют только бизнес-данные
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === "categories"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Справочник таксономии ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "audit"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Пакетный аудит DRY RUN</span>
          {auditReport && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white">
              {auditReport.totalListingsEvaluated}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CATEGORIES TABLE */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск по названию, коду или slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Код / ID</th>
                    <th className="py-3 px-4">Название (RU / TG / EN)</th>
                    <th className="py-3 px-4">SEO Slug (RU / TG / EN)</th>
                    <th className="py-3 px-4 text-center">Режим Slug</th>
                    <th className="py-3 px-4 text-center">Индексация</th>
                    <th className="py-3 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                        <div>{cat.code}</div>
                        <div className="text-[10px] text-slate-400">{cat.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{cat.name.ru}</div>
                        <div className="text-[11px] text-slate-500">
                          {cat.name.tg} · <span className="italic">{cat.name.en}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-emerald-700 font-semibold">/{cat.slug.ru}/</div>
                        <div className="text-slate-400">
                          /tg/.../{cat.slug.tg}/ · /en/.../{cat.slug.en}/
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${
                            cat.slugMode === "AUTO"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {cat.slugMode}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {cat.indexable ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Allowlist</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            noindex
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(cat)}
                          className="h-8 px-2.5 text-xs rounded-lg gap-1 border-slate-200 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Настроить</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT DRY RUN REPORT */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          {!auditReport && !auditLoading && (
            <Card className="rounded-2xl border-slate-200 text-center p-8 space-y-3">
              <RefreshCw className="h-8 w-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Аудит ещё не запускался</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Запустите пакетный DRY RUN аудит для анализа фактических объявлений проекта, выявления старых/новых URL и генерации карты 301-редиректов.
              </p>
              <Button
                onClick={handleRunAudit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl px-4 py-2 cursor-pointer"
              >
                Запустить аудит прямо сейчас
              </Button>
            </Card>
          )}

          {auditLoading && (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                Выполняется безопасный DRY RUN аудит...
              </div>
              <div className="text-xs text-slate-500">
                Анализ таксономии, проверка коллизий URL и формирование redirect-map без записи в базу данных.
              </div>
            </div>
          )}

          {auditReport && !auditLoading && (
            <div className="space-y-6">
              {/* Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4 rounded-xl border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Объявлений проверено</div>
                  <div className="text-2xl font-black text-slate-900">{auditReport.totalListingsEvaluated}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Фактические данные каталога</div>
                </Card>
                <Card className="p-4 rounded-xl border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Новые канонические URL</div>
                  <div className="text-2xl font-black text-emerald-600">{auditReport.totalUrlsChanged}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Будут защищены 301-алиасами</div>
                </Card>
                <Card className="p-4 rounded-xl border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Коллизии URL</div>
                  <div className="text-2xl font-black text-slate-900">
                    {auditReport.collisionsDetected.length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">0 конфликтов маршрутов</div>
                </Card>
                <Card className="p-4 rounded-xl border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Время аудита</div>
                  <div className="text-2xl font-black text-slate-900">{auditReport.durationMs} мс</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Высокая производительность</div>
                </Card>
              </div>

              {/* Sample Diff Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Примеры сопоставления URL (До → После)
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditReport, null, 2));
                      const downloadAnchor = document.createElement("a");
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `seo_dry_run_report_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="h-8 text-xs gap-1.5 rounded-lg border-slate-200 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Экспорт JSON</span>
                  </Button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Объявление</th>
                        <th className="py-2.5 px-3">Категория</th>
                        <th className="py-2.5 px-3">Старый URL (301 From)</th>
                        <th className="py-2.5 px-3">Новый канонический URL (200 Target)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditReport.sampleDiffs.map((diff) => (
                        <tr key={diff.listingId} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-500">{diff.listingId}</td>
                          <td className="py-2 px-3 font-medium text-slate-900 max-w-xs truncate">
                            {diff.title}
                          </td>
                          <td className="py-2 px-3">
                            <Badge variant="outline" className="text-[10px]">
                              {diff.categoryCode}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-amber-700 bg-amber-50/30">
                            {diff.oldUrl}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-emerald-700 bg-emerald-50/30 font-semibold">
                            {diff.newUrl}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDIT / ADD CATEGORY */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {isNewCategory ? "Добавление новой категории" : `Настройка: ${editingCategory?.name.ru}`}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Глобальная таксономия Maskani.tj. Изменение названий и SEO-slug синхронизирует URL для всех зависимых объектов.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Code */}
            {isNewCategory && (
              <div className="space-y-1">
                <Label className="text-xs">Внутренний код (code)</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. sale_penthouse"
                  className="font-mono text-xs h-8"
                />
              </div>
            )}

            {/* Mode & Indexable Switches */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Режим Slug</Label>
                  <Badge variant="outline" className="text-[10px]">
                    {slugMode}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={slugMode === "AUTO" ? "default" : "outline"}
                    onClick={() => setSlugMode("AUTO")}
                    className="h-7 text-[11px] px-2.5 cursor-pointer"
                  >
                    AUTO
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={slugMode === "MANUAL" ? "default" : "outline"}
                    onClick={() => setSlugMode("MANUAL")}
                    className="h-7 text-[11px] px-2.5 cursor-pointer"
                  >
                    MANUAL
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400">
                  {slugMode === "AUTO"
                    ? "Slug пересчитывается из названия"
                    : "Slug зафиксирован, смена названия не меняет URL"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Индексация (SEO)</Label>
                  <Switch
                    checked={isIndexable}
                    onCheckedChange={setIsIndexable}
                  />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  {isIndexable
                    ? "Категория включена в Allowlist и sitemap.xml"
                    : "Категория закрыта от поисковиков (noindex)"}
                </p>
              </div>
            </div>

            {/* Names per locale */}
            <div className="space-y-2">
              <Label className="text-xs font-bold">Отображаемые названия (Label)</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">RU</span>
                  <Input
                    value={nameRu}
                    onChange={(e) => {
                      setNameRu(e.target.value);
                      if (slugMode === "AUTO") {
                        // transliterate immediately
                      }
                    }}
                    placeholder="Квартиры"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">TG</span>
                  <Input
                    value={nameTg}
                    onChange={(e) => setNameTg(e.target.value)}
                    placeholder="Хонадонҳо"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">EN</span>
                  <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Apartments"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Slugs per locale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">SEO URL-slug</Label>
                <span className="text-[10px] text-emerald-600 font-mono">
                  /{slugRu || "..."}/
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">RU slug</span>
                  <Input
                    value={slugRu}
                    onChange={(e) => setSlugRu(e.target.value)}
                    placeholder="kvartiry"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">TG slug</span>
                  <Input
                    value={slugTg}
                    onChange={(e) => setSlugTg(e.target.value)}
                    placeholder="khonadon"
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">EN slug</span>
                  <Input
                    value={slugEn}
                    onChange={(e) => setSlugEn(e.target.value)}
                    placeholder="apartments"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* PREVIEW SECTION FOR SLUG MIGRATION (Rule AC-04, AC-22) */}
            {!isNewCategory && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    Проверка влияния на опубликованные URL:
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCheckPreview}
                    disabled={previewLoading}
                    className="h-7 text-[11px] px-2.5 rounded-lg border-slate-300 cursor-pointer"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{previewLoading ? "Расчёт..." : "Предпросмотр миграции"}</span>
                  </Button>
                </div>

                {previewData && (
                  <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>
                        Затрагивает {previewData.affectedListingsCount} опубликованных объявлений
                      </span>
                    </div>
                    {previewData.redirectPlan.length > 0 && (
                      <div className="text-[10px] text-slate-600 space-y-1">
                        <div className="font-semibold text-slate-700">План редиректов (301):</div>
                        {previewData.redirectPlan.slice(0, 3).map((r, i) => (
                          <div key={i} className="font-mono truncate">
                            <span className="text-amber-700">{r.from}</span> →{" "}
                            <span className="text-emerald-700">{r.to}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleSaveCategory}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
            >
              {saving ? "Сохранение..." : "Сохранить и применить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
