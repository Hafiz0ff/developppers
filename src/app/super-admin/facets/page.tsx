"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
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
  Check,
  Building2,
  Store,
  Home,
  Tag,
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
import type { FacetConfig } from "@/lib/seo/facet-store";

export default function SuperAdminFacetsPage() {
  const [facets, setFacets] = useState<FacetConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacet, setEditingFacet] = useState<FacetConfig | null>(null);
  const [isNewFacet, setIsNewFacet] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [id, setId] = useState("");
  const [categoryId, setCategoryId] = useState("cat_sale_commercial");
  const [facetKey, setFacetKey] = useState("commercial_type");
  const [valueKey, setValueKey] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [nameTg, setNameTg] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugRu, setSlugRu] = useState("");
  const [slugTg, setSlugTg] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [hasOwnPage, setHasOwnPage] = useState(false);
  const [isIndexable, setIsIndexable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  const fetchFacets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/facets");
      const data = await res.json();
      if (data.success) {
        setFacets(data.facets);
      }
    } catch (err) {
      console.error("Failed to load facets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacets();
  }, []);

  const handleOpenAdd = () => {
    setIsNewFacet(true);
    setEditingFacet(null);
    setId(`facet_${Date.now()}`);
    setCategoryId("cat_sale_commercial");
    setFacetKey("commercial_type");
    setValueKey("");
    setNameRu("");
    setNameTg("");
    setNameEn("");
    setSlugRu("");
    setSlugTg("");
    setSlugEn("");
    setHasOwnPage(false);
    setIsIndexable(false);
    setIsActive(true);
    setSortOrder(facets.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FacetConfig) => {
    setIsNewFacet(false);
    setEditingFacet(f);
    setId(f.id);
    setCategoryId(f.categoryId);
    setFacetKey(f.facetKey);
    setValueKey(f.valueKey);
    setNameRu(f.displayName.ru);
    setNameTg(f.displayName.tg);
    setNameEn(f.displayName.en);
    setSlugRu(f.valueSlug.ru);
    setSlugTg(f.valueSlug.tg);
    setSlugEn(f.valueSlug.en);
    setHasOwnPage(f.hasOwnPage);
    setIsIndexable(f.indexable);
    setIsActive(f.active);
    setSortOrder(f.sortOrder);
    setIsModalOpen(true);
  };

  const handleSaveFacet = async () => {
    setSaving(true);
    try {
      const payload = {
        id,
        categoryId,
        facetKey,
        valueKey,
        displayName: { ru: nameRu, tg: nameTg || nameRu, en: nameEn || nameRu },
        valueSlug: { ru: slugRu, tg: slugTg || slugRu, en: slugEn || slugRu },
        hasOwnPage,
        indexable: isIndexable,
        active: isActive,
        sortOrder,
      };

      const res = await fetch("/api/super-admin/facets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        await fetchFacets();
        setIsModalOpen(false);
      } else {
        alert(data.error || "Save error");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save facet");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleIndexable = async (f: FacetConfig) => {
    try {
      const updated = { ...f, indexable: !f.indexable };
      await fetch("/api/super-admin/facets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setFacets((prev) => prev.map((item) => (item.id === f.id ? updated : item)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleToggleOwnPage = async (f: FacetConfig) => {
    try {
      const updated = {
        ...f,
        hasOwnPage: !f.hasOwnPage,
        // If hasOwnPage is disabled, indexable must also be false
        indexable: !f.hasOwnPage ? f.indexable : false,
      };
      await fetch("/api/super-admin/facets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setFacets((prev) => prev.map((item) => (item.id === f.id ? updated : item)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const filteredFacets = facets.filter((f) => {
    const matchesSearch =
      f.displayName.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.valueSlug.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facetKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.valueKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || f.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalCount = facets.length;
  const ownPageCount = facets.filter((f) => f.hasOwnPage).length;
  const indexableCount = facets.filter((f) => f.indexable).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Управление фасетами (SEO-фильтрами)
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Конфигурация коммерческих типов, комнатности и генерации посадочных страниц (ТЗ v1.1, Разделы 4, 5, 10.2)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFacets}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Обновить</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить фасет</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Всего фасетов
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Tag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Собственные URL (has_own_page)
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{ownPageCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Индексируемые (allowlist)
              </p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{indexableCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Категория:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-slate-300 py-1.5 px-2.5 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500"
          >
            <option value="all">Все категории</option>
            <option value="cat_sale_commercial">Коммерция (Продажа)</option>
            <option value="cat_rent_commercial">Коммерция (Аренда)</option>
            <option value="cat_sale_resale">Вторичка (Продажа комнат)</option>
            <option value="cat_rent_apartments">Аренда (Квартиры по комнатам)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Поиск по названию или slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Facets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Название (RU / TG / EN)</th>
                <th className="py-3 px-4">Ключ и Значение</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">SEO Slug (RU)</th>
                <th className="py-3 px-4 text-center">Собственный URL</th>
                <th className="py-3 px-4 text-center">Индексация</th>
                <th className="py-3 px-4 text-center">Сортировка</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" />
                    Загрузка фасетов...
                  </td>
                </tr>
              ) : filteredFacets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Фасеты не найдены
                  </td>
                </tr>
              ) : (
                filteredFacets.map((facet) => (
                  <tr key={facet.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{facet.displayName.ru}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {facet.displayName.tg} • {facet.displayName.en}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                        {facet.facetKey} = <strong>{facet.valueKey}</strong>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="font-mono text-[10px] text-slate-600">
                        {facet.categoryId}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                      /{facet.valueSlug.ru}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleOwnPage(facet)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          facet.hasOwnPage
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {facet.hasOwnPage ? "Да (URL активен)" : "Нет (Фильтр)"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={!facet.hasOwnPage}
                        onClick={() => handleToggleIndexable(facet)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          !facet.hasOwnPage
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                            : facet.indexable
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                        }`}
                        title={
                          !facet.hasOwnPage
                            ? "Сначала включите собственный URL"
                            : facet.indexable
                            ? "robots: index, follow"
                            : "robots: noindex, follow"
                        }
                      >
                        {facet.indexable ? "index, follow" : "noindex"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                      {facet.sortOrder}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(facet)}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-emerald-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isNewFacet ? "Создание нового фасета" : `Редактирование фасета: ${editingFacet?.displayName.ru}`}
            </DialogTitle>
            <DialogDescription>
              Настройка локализованных названий, URL-slug и параметров индексируемости поисковиками.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Идентификатор (ID)</Label>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={!isNewFacet}
                  className="font-mono text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Родительская категория</Label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-md border border-slate-300 py-2 px-2.5 bg-white text-slate-800 outline-none focus:border-emerald-500 mt-1"
                >
                  <option value="cat_sale_commercial">cat_sale_commercial (Коммерция Продажа)</option>
                  <option value="cat_rent_commercial">cat_rent_commercial (Коммерция Аренда)</option>
                  <option value="cat_sale_resale">cat_sale_resale (Вторичка Продажа)</option>
                  <option value="cat_rent_apartments">cat_rent_apartments (Аренда квартир)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Ключ поля (facetKey)</Label>
                <Input
                  value={facetKey}
                  onChange={(e) => setFacetKey(e.target.value)}
                  placeholder="commercial_type или rooms"
                  className="font-mono text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Значение поля (valueKey)</Label>
                <Input
                  value={valueKey}
                  onChange={(e) => setValueKey(e.target.value)}
                  placeholder="office или 1"
                  className="font-mono text-xs mt-1"
                />
              </div>
            </div>

            {/* Localized Labels */}
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Отображаемые названия (Display Names)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px] text-slate-600">На русском (RU)</Label>
                  <Input
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="Офисы"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">На таджикском (TG)</Label>
                  <Input
                    value={nameTg}
                    onChange={(e) => setNameTg(e.target.value)}
                    placeholder="Дафтарҳо"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">На английском (EN)</Label>
                  <Input
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Offices"
                    className="text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Localized SEO Slugs */}
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                SEO URL Slugs
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px] text-slate-600">Slug RU</Label>
                  <Input
                    value={slugRu}
                    onChange={(e) => setSlugRu(e.target.value)}
                    placeholder="ofisy"
                    className="font-mono text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">Slug TG</Label>
                  <Input
                    value={slugTg}
                    onChange={(e) => setSlugTg(e.target.value)}
                    placeholder="daftarho"
                    className="font-mono text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">Slug EN</Label>
                  <Input
                    value={slugEn}
                    onChange={(e) => setSlugEn(e.target.value)}
                    placeholder="offices"
                    className="font-mono text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Switches */}
            <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <Label className="text-xs font-bold text-slate-900">Собственная страница</Label>
                  <p className="text-[10px] text-slate-500">Генерирует отдельный URL посадочной</p>
                </div>
                <Switch checked={hasOwnPage} onCheckedChange={setHasOwnPage} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <Label className="text-xs font-bold text-slate-900">Индексация роботами</Label>
                  <p className="text-[10px] text-slate-500">allowlist: robots: index, follow</p>
                </div>
                <Switch
                  checked={isIndexable}
                  onCheckedChange={setIsIndexable}
                  disabled={!hasOwnPage}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleSaveFacet}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Сохранение..." : "Сохранить фасет"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
