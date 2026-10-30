"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sliders,
  FolderTree,
  Tag,
  Link as LinkIcon,
  Home,
  Store,
  Briefcase,
  KeyRound,
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
import type { MenuItem, MenuItemTree, MenuItemType } from "@/lib/navigation/menu-store";

export default function SuperAdminNavigationPage() {
  const [menuTree, setMenuTree] = useState<MenuItemTree[]>([]);
  const [flatItems, setFlatItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("header_main");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [id, setId] = useState("");
  const [type, setType] = useState<MenuItemType>("link-to-category");
  const [labelRu, setLabelRu] = useState("");
  const [labelTg, setLabelTg] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [targetType, setTargetType] = useState<"category" | "facet" | "catalog" | "url">("category");
  const [targetId, setTargetId] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [column, setColumn] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const [resTree, resFlat] = await Promise.all([
        fetch(`/api/super-admin/navigation?location=${selectedLocation}&tree=true`),
        fetch(`/api/super-admin/navigation?location=${selectedLocation}`),
      ]);

      const dataTree = await resTree.json();
      const dataFlat = await resFlat.json();

      if (dataTree.success) setMenuTree(dataTree.tree);
      if (dataFlat.success) setFlatItems(dataFlat.items);
    } catch (err) {
      console.error("Failed to load navigation menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedLocation]);

  const handleOpenAdd = (parent?: string, col?: number) => {
    setIsNewItem(true);
    setEditingItem(null);
    setId(`nav_${Date.now()}`);
    setType("link-to-category");
    setLabelRu("");
    setLabelTg("");
    setLabelEn("");
    setTargetType("category");
    setTargetId("");
    setParentId(parent || "");
    setColumn(col || 1);
    setSortOrder(flatItems.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setIsNewItem(false);
    setEditingItem(item);
    setId(item.id);
    setType(item.type);
    setLabelRu(item.label.ru);
    setLabelTg(item.label.tg);
    setLabelEn(item.label.en);
    setTargetType(item.targetType || "category");
    setTargetId(item.targetId || "");
    setParentId(item.parentId || "");
    setColumn(item.column || 1);
    setSortOrder(item.sortOrder);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      const payload: Partial<MenuItem> = {
        id,
        menuLocation: selectedLocation as MenuItem["menuLocation"],
        type,
        label: { ru: labelRu, tg: labelTg || labelRu, en: labelEn || labelRu },
        targetType: type === "group-header" ? undefined : targetType,
        targetId: type === "group-header" ? undefined : targetId,
        parentId: parentId || null,
        column: type === "group-header" || parentId ? column : undefined,
        sortOrder,
        isActive,
      };

      const res = await fetch("/api/super-admin/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        await fetchMenu();
        setIsModalOpen(false);
      } else {
        alert(data.error || "Save error");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Удалить этот пункт меню?")) return;
    try {
      const res = await fetch(`/api/super-admin/navigation?id=${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchMenu();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getTypeBadge = (itemType: MenuItemType) => {
    switch (itemType) {
      case "group-header":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Заголовок группы</Badge>;
      case "link-to-category":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Категория</Badge>;
      case "link-to-facet":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Фасет</Badge>;
      case "link-to-catalog":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Каталог</Badge>;
      case "action-button":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-300">CTA Кнопка</Badge>;
      default:
        return <Badge variant="outline">Ссылка</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Управление меню и навигацией
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Иерархическая структура мега-меню, 2-колоночные списки, группы и привязка целей (ТЗ v1.1, Раздел 10.3)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMenu}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Обновить</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleOpenAdd()}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Добавить элемент</span>
          </Button>
        </div>
      </div>

      {/* Menu Location Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "header_main", label: "Главное меню шапки (Header Mega-Menu)" },
          { id: "header_action", label: "CTA Кнопки шапки (Header Actions)" },
          { id: "footer", label: "Подвал сайта (Footer)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedLocation(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedLocation === tab.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hierarchical Tree of Navigation Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" />
            Загрузка структуры меню...
          </div>
        ) : menuTree.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            Элементы меню не найдены
          </div>
        ) : (
          menuTree.map((topItem) => {
            const hasChildren = Boolean(topItem.children && topItem.children.length > 0);
            const col1Items = topItem.children?.filter((c) => c.column === 1 || !c.column) || [];
            const col2Items = topItem.children?.filter((c) => c.column === 2) || [];

            return (
              <div
                key={topItem.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Top Level Item Header */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                      {topItem.sortOrder}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">
                          {topItem.label.ru}
                        </span>
                        {getTypeBadge(topItem.type)}
                        {topItem.targetId && (
                          <span className="font-mono text-xs text-slate-500">
                            → {topItem.targetId}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {topItem.label.tg} • {topItem.label.en}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenAdd(topItem.id, 1)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>В Колонку 1</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenAdd(topItem.id, 2)}
                      className="text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>В Колонку 2</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(topItem)}
                      className="h-8 w-8 p-0 text-slate-600 hover:text-emerald-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Submenu Columns (2 Columns for Mega-Menu) */}
                {hasChildren && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                    {/* Column 1 */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>Колонка 1</span>
                        <span className="text-slate-300 font-mono text-[10px]">{col1Items.length} элементов</span>
                      </div>
                      <div className="space-y-1">
                        {col1Items.map((child) => (
                          <div
                            key={child.id}
                            className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              child.type === "group-header"
                                ? "bg-amber-50/70 border border-amber-200/80 font-bold text-amber-900 mt-2"
                                : "hover:bg-slate-50 text-slate-700 pl-4 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {child.type === "group-header" && (
                                <Tag className="h-3.5 w-3.5 text-amber-600" />
                              )}
                              <span>{child.label.ru}</span>
                              {child.targetId && (
                                <span className="font-mono text-[10px] text-slate-400">
                                  ({child.targetId})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEdit(child)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-600"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(child.id)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>Колонка 2</span>
                        <span className="text-slate-300 font-mono text-[10px]">{col2Items.length} элементов</span>
                      </div>
                      <div className="space-y-1">
                        {col2Items.map((child) => (
                          <div
                            key={child.id}
                            className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                              child.type === "group-header"
                                ? "bg-amber-50/70 border border-amber-200/80 font-bold text-amber-900 mt-2"
                                : "hover:bg-slate-50 text-slate-700 pl-4 border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {child.type === "group-header" && (
                                <Tag className="h-3.5 w-3.5 text-amber-600" />
                              )}
                              <span>{child.label.ru}</span>
                              {child.targetId && (
                                <span className="font-mono text-[10px] text-slate-400">
                                  ({child.targetId})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEdit(child)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-600"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(child.id)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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
          })
        )}
      </div>

      {/* Edit / Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isNewItem ? "Добавить элемент меню" : `Редактировать: ${editingItem?.label.ru}`}
            </DialogTitle>
            <DialogDescription>
              Настройка типа пункта, локализованных названий и привязки к категории или фасету.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Идентификатор (ID)</Label>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={!isNewItem}
                  className="font-mono text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Тип элемента</Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MenuItemType)}
                  className="w-full text-xs font-semibold rounded-md border border-slate-300 py-2 px-2.5 bg-white text-slate-800 outline-none focus:border-emerald-500 mt-1"
                >
                  <option value="link-to-category">link-to-category (Ссылка на категорию)</option>
                  <option value="link-to-facet">link-to-facet (Ссылка на фасет)</option>
                  <option value="link-to-catalog">link-to-catalog (Каталог застройщиков/услуг)</option>
                  <option value="group-header">group-header (Заголовок группы UI)</option>
                  <option value="action-button">action-button (Кнопка действия)</option>
                </select>
              </div>
            </div>

            {/* Localized Labels */}
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Локализованные подписи
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px] text-slate-600">На русском (RU)</Label>
                  <Input
                    value={labelRu}
                    onChange={(e) => setLabelRu(e.target.value)}
                    placeholder="Квартиры на вторичке"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">На таджикском (TG)</Label>
                  <Input
                    value={labelTg}
                    onChange={(e) => setLabelTg(e.target.value)}
                    placeholder="Хонадонҳои дуюмдараҷа"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-slate-600">На английском (EN)</Label>
                  <Input
                    value={labelEn}
                    onChange={(e) => setLabelEn(e.target.value)}
                    placeholder="Secondary apartments"
                    className="text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Target Settings (hidden if group-header per TZ Section 10.3) */}
            {type !== "group-header" && (
              <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Тип цели (Target Type)</Label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as typeof targetType)}
                    className="w-full text-xs font-semibold rounded-md border border-slate-300 py-2 px-2.5 bg-white text-slate-800 outline-none focus:border-emerald-500 mt-1"
                  >
                    <option value="category">category (ID категории)</option>
                    <option value="facet">facet (ID фасета)</option>
                    <option value="catalog">catalog (Ключ каталога)</option>
                    <option value="url">url (Прямой URL)</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Идентификатор цели (Target ID)</Label>
                  <Input
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    placeholder="cat_sale_resale или facet_sale_comm_office"
                    className="font-mono text-xs mt-1"
                  />
                </div>
              </div>
            )}

            {/* Hierarchy & Layout */}
            <div className="border-t border-slate-200 pt-3 grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Родительский элемент</Label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full text-xs font-semibold rounded-md border border-slate-300 py-2 px-2 bg-white text-slate-800 outline-none focus:border-emerald-500 mt-1"
                >
                  <option value="">(Верхний уровень)</option>
                  <option value="nav_buy">Купить (nav_buy)</option>
                  <option value="nav_rent">Арендовать (nav_rent)</option>
                  <option value="nav_companies">Компании (nav_companies)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Колонка мега-меню</Label>
                <select
                  value={column}
                  onChange={(e) => setColumn(Number(e.target.value))}
                  className="w-full text-xs font-semibold rounded-md border border-slate-300 py-2 px-2 bg-white text-slate-800 outline-none focus:border-emerald-500 mt-1"
                >
                  <option value={1}>Колонка 1</option>
                  <option value={2}>Колонка 2</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Порядок сортировки</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="text-xs mt-1"
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
              onClick={handleSaveItem}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Сохранение..." : "Сохранить элемент"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
