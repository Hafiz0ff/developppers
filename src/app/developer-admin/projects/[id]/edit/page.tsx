"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SOGD_CITIES } from "@/lib/constants/locations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Percent,
  MapPin,
  ImageIcon,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Edit3,
  Paintbrush,
  Sparkles,
  Layers,
  BarChart3,
  ExternalLink,
  Grid3X3,
  SlidersHorizontal,
} from "lucide-react";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { FinishingFeatureDialog } from "@/components/modules/projects/finishing-feature-dialog";
import type { CustomBuildingFeature, FinishingFeature } from "@/lib/data/mock-db";
import { ProjectGalleryManager } from "@/components/modules/developer-admin/project-gallery-manager";
import { ProjectPoiManager } from "@/components/modules/developer-admin/project-poi-manager";
import { ProjectViewsLayoutsManager } from "@/components/modules/developer-admin/project-views-layouts-manager";
import { ProjectInsolationSettings } from "@/components/modules/developer-admin/project-insolation-settings";
import { ProjectAnalyticsTab } from "@/components/modules/developer-admin/project-analytics-tab";
import { ProjectPreviewModal } from "@/components/modules/developer-admin/project-preview-modal";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const proj =
    INITIAL_PROJECTS.find((p) => p.id === projectId) || INITIAL_PROJECTS[0];

  const [name, setName] = useState(proj.name);
  const [buildingClass, setBuildingClass] = useState(proj.buildingClass);
  const [finishing, setFinishing] = useState(proj.finishing);
  const [city, setCity] = useState(proj.city);
  const [district, setDistrict] = useState(proj.district);
  const [address, setAddress] = useState(proj.address);
  const [landmark, setLandmark] = useState(proj.landmark);
  const [floorsCount, setFloorsCount] = useState(proj.floorsCount.toString());
  const [sectionsCount, setSectionsCount] = useState(proj.sectionsCount.toString());
  const [ceilingHeight, setCeilingHeight] = useState(proj.ceilingHeight || "3.00");
  const [deadlineQuarter, setDeadlineQuarter] = useState(proj.deadlineQuarter.toString());
  const [deadlineYear, setDeadlineYear] = useState(proj.deadlineYear.toString());

  // Standard building characteristics
  const [landArea, setLandArea] = useState(proj.landArea || "");
  const [wallMaterial, setWallMaterial] = useState(proj.wallMaterial || "");
  const [facade, setFacade] = useState(proj.facade || "");
  const [cadastralNumber, setCadastralNumber] = useState(proj.cadastralNumber || "");

  // Custom building features (up to 3)
  const [customBuildingFeatures, setCustomBuildingFeatures] = useState<CustomBuildingFeature[]>(
    proj.customBuildingFeatures && proj.customBuildingFeatures.length > 0
      ? proj.customBuildingFeatures
      : [{ id: "cbf_1", title: "", value: "" }]
  );

  // Finishing features (up to 3)
  const [finishingFeatures, setFinishingFeatures] = useState<FinishingFeature[]>(
    proj.finishingFeatures || []
  );
  const [finishingDialogOpen, setFinishingDialogOpen] = useState(false);
  const [activeFinishingFeature, setActiveFinishingFeature] = useState<FinishingFeature | null>(null);
  const [finishingDialogMode, setFinishingDialogMode] = useState<"add" | "edit" | "view">("add");

  const [minPricePerMeterUsd, setMinPricePerMeterUsd] = useState(proj.minPricePerMeterUsd.toString());
  const [minPricePerMeterTjs, setMinPricePerMeterTjs] = useState(proj.minPricePerMeterTjs.toString());
  const [installmentMonths, setInstallmentMonths] = useState(proj.installmentMonths.toString());
  const [installmentDownPayment, setInstallmentDownPayment] = useState(proj.installmentDownPaymentPercent.toString());
  const [hasUndergroundParking, setHasUndergroundParking] = useState(proj.hasUndergroundParking);
  const [hasElevator, setHasElevator] = useState(proj.hasElevator);
  const [hasAutonomousHeating, setHasAutonomousHeating] = useState(proj.hasAutonomousHeating);
  const [shortDescription, setShortDescription] = useState(proj.shortDescription);
  const [description, setDescription] = useState(proj.description);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Stage 5: Gallery, Showcase, Analytics & Preview States
  const [coverImageUrl, setCoverImageUrl] = useState(proj.coverImageUrl);
  const [images, setImages] = useState<string[]>(proj.images || [proj.coverImageUrl]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"params" | "gallery" | "interactive" | "analytics">("params");

  // Custom building features handlers
  const handleAddCustomBuildingFeature = () => {
    if (customBuildingFeatures.length >= 3) return;
    const lastItem = customBuildingFeatures[customBuildingFeatures.length - 1];
    if (lastItem && !lastItem.title.trim()) return;
    setCustomBuildingFeatures((prev) => [
      ...prev,
      { id: `cbf_${Date.now()}`, title: "", value: "" },
    ]);
  };

  const handleUpdateCustomBuildingFeature = (
    id: string,
    field: "title" | "value",
    val: string
  ) => {
    if (val.length > 40) return;
    setCustomBuildingFeatures((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleRemoveCustomBuildingFeature = (id: string) => {
    if (customBuildingFeatures.length === 1) {
      setCustomBuildingFeatures([{ id: `cbf_${Date.now()}`, title: "", value: "" }]);
    } else {
      setCustomBuildingFeatures((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Finishing features handlers
  const handleOpenAddFinishingDialog = () => {
    if (finishingFeatures.length >= 3) return;
    setActiveFinishingFeature(null);
    setFinishingDialogMode("add");
    setFinishingDialogOpen(true);
  };

  const handleOpenViewFinishingDialog = (feature: FinishingFeature) => {
    setActiveFinishingFeature(feature);
    setFinishingDialogMode("view");
    setFinishingDialogOpen(true);
  };

  const handleOpenEditFinishingDialog = (feature: FinishingFeature) => {
    setActiveFinishingFeature(feature);
    setFinishingDialogMode("edit");
    setFinishingDialogOpen(true);
  };

  const handleSaveFinishingFeature = (feature: FinishingFeature) => {
    setFinishingFeatures((prev) => {
      const idx = prev.findIndex((f) => f.id === feature.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = feature;
        return updated;
      }
      if (prev.length >= 3) return prev;
      return [...prev, feature];
    });
  };

  const handleRemoveFinishingFeature = (id: string) => {
    setFinishingFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/developer-admin/projects">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Назад к проектам
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Редактирование: {proj.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Управление витриной, 6D-слоями и характеристиками комплекса
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer shadow-xs"
          >
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            Предпросмотр на витрине
          </Button>

          <Link href={`/developer-admin/projects/${proj.id}/units`}>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 cursor-pointer">
              <Grid3X3 className="h-3.5 w-3.5 text-emerald-600" />
              Шахматка квартир
            </Button>
          </Link>

          {success && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Сохранено!
            </div>
          )}
        </div>
      </div>

      {/* Tab Switcher for Developer Admin (Section 3.4 of Spec) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {[
          { id: "params", label: "Параметры и отделка", icon: Building2 },
          {
            id: "gallery",
            label: "Галерея и обложка",
            icon: ImageIcon,
            badge: images.length.toString(),
          },
          { id: "interactive", label: "Интерактивные слои (6D)", icon: Layers },
          { id: "analytics", label: "Аналитика объекта", icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground border border-border/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Main Parameters and Finishing Form */}
      {activeTab === "params" && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" />
              Основные параметры
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-name" className="text-xs font-semibold">
                  Название комплекса
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Класс жилья</Label>
                <Select
                  value={buildingClass}
                  onValueChange={(val) => {
                    if (val) setBuildingClass(val as "economy" | "comfort" | "business" | "premium");
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Эконом-класс</SelectItem>
                    <SelectItem value="comfort">Комфорт-класс</SelectItem>
                    <SelectItem value="business">Бизнес-класс</SelectItem>
                    <SelectItem value="premium">Премиум / Элит</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Отделка</Label>
                <Select
                  value={finishing}
                  onValueChange={(val) => {
                    if (val) setFinishing(val as "rough" | "pre_finishing" | "turnkey");
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rough">Черновая (коробка)</SelectItem>
                    <SelectItem value="pre_finishing">Предчистовая (белый каркас)</SelectItem>
                    <SelectItem value="turnkey">С ремонтом под ключ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-short" className="text-xs font-semibold">
                  Краткое описание
                </Label>
                <Input
                  id="edit-short"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-desc" className="text-xs font-semibold">
                  Подробное описание
                </Label>
                <Textarea
                  id="edit-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Локация и параметры
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Город / Район</Label>
                <Select
                  value={city}
                  onValueChange={(val) => {
                    if (val) setCity(val);
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOGD_CITIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-district" className="text-xs font-semibold">
                  Микрорайон
                </Label>
                <Input
                  id="edit-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-address" className="text-xs font-semibold">
                  Адрес
                </Label>
                <Input
                  id="edit-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-landmark" className="text-xs font-semibold">
                  Ориентир
                </Label>
                <Input
                  id="edit-landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Engineering Specs & Deadlines */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Характеристики здания и сроки сдачи
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-floors" className="text-xs font-semibold">
                  Этажей
                </Label>
                <Input
                  id="edit-floors"
                  type="number"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-sections" className="text-xs font-semibold">
                  Секций (подъездов)
                </Label>
                <Input
                  id="edit-sections"
                  type="number"
                  value={sectionsCount}
                  onChange={(e) => setSectionsCount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-quarter" className="text-xs font-semibold">
                  Квартал сдачи
                </Label>
                <Select
                  value={deadlineQuarter}
                  onValueChange={(val) => {
                    if (val) setDeadlineQuarter(val);
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 квартал</SelectItem>
                    <SelectItem value="2">2 квартал</SelectItem>
                    <SelectItem value="3">3 квартал</SelectItem>
                    <SelectItem value="4">4 квартал</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-year" className="text-xs font-semibold">
                  Год сдачи
                </Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={deadlineYear}
                  onChange={(e) => setDeadlineYear(e.target.value)}
                />
              </div>
            </div>

            {/* Standard Building & Land Specs */}
            <div className="pt-2 border-t">
              <h4 className="text-xs font-bold text-foreground mb-3">
                Конструктивные особенности и земельный участок
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-land-area" className="text-xs font-semibold">
                    Площадь участка
                  </Label>
                  <Input
                    id="edit-land-area"
                    placeholder="Площадь участка у застройщика"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-wall-material" className="text-xs font-semibold">
                    Материал стен
                  </Label>
                  <Input
                    id="edit-wall-material"
                    placeholder="Газоблок"
                    value={wallMaterial}
                    onChange={(e) => setWallMaterial(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-facade" className="text-xs font-semibold">
                    Фасад
                  </Label>
                  <Input
                    id="edit-facade"
                    placeholder="Клинкерная плитка"
                    value={facade}
                    onChange={(e) => setFacade(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-cadastral" className="text-xs font-semibold">
                    Кадастровый номер
                  </Label>
                  <Input
                    id="edit-cadastral"
                    placeholder="Кадастровый код участка"
                    value={cadastralNumber}
                    onChange={(e) => setCadastralNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Custom Building Features */}
            <div className="pt-3 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground">
                    Пользовательские характеристики
                  </h4>
                  <ResponsiveTooltip
                    title="Пользовательские характеристики"
                    content="Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                  >
                    <span className="p-1 text-muted-foreground hover:text-emerald-600 cursor-pointer">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </span>
                  </ResponsiveTooltip>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Добавлено {customBuildingFeatures.filter((f) => f.title.trim()).length} из 3
                </span>
              </div>

              <div className="space-y-3">
                {customBuildingFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-3 rounded-xl bg-muted/20 border space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                      {/* Title field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Label className="text-[11px] font-semibold text-foreground">
                              Ваш заголовок
                            </Label>
                            <ResponsiveTooltip
                              title="Пользовательский заголовок"
                              content="Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                            >
                              <span className="text-muted-foreground hover:text-emerald-600 cursor-pointer">
                                <HelpCircle className="h-3 w-3" />
                              </span>
                            </ResponsiveTooltip>
                          </div>
                          <span
                            className={`text-[10px] ${
                              feat.title.length >= 40
                                ? "text-amber-600 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feat.title.length}/40
                          </span>
                        </div>
                        <Input
                          placeholder="Например, Отопление"
                          value={feat.title}
                          maxLength={40}
                          onChange={(e) =>
                            handleUpdateCustomBuildingFeature(
                              feat.id,
                              "title",
                              e.target.value
                            )
                          }
                          className="h-9 text-xs rounded-lg"
                        />
                      </div>

                      {/* Value field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-semibold text-foreground">
                            Значение характеристики
                          </Label>
                          <span
                            className={`text-[10px] ${
                              feat.value.length >= 40
                                ? "text-amber-600 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            {feat.value.length}/40
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Например, Общее (собственная котельная)"
                            value={feat.value}
                            maxLength={40}
                            onChange={(e) =>
                              handleUpdateCustomBuildingFeature(
                                feat.id,
                                "value",
                                e.target.value
                              )
                            }
                            className="h-9 text-xs rounded-lg flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveCustomBuildingFeature(feat.id)
                            }
                            title="Удалить характеристику"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add next custom feature button */}
              {customBuildingFeatures.length < 3 && (
                <div className="pt-1 flex items-center justify-start">
                  <ResponsiveTooltip
                    title="Добавление характеристики"
                    content="Вы можете добавить свой заголовок, например „Отопление“, и указать его значение, например „Общее (собственная котельная)“"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCustomBuildingFeature}
                      disabled={
                        !customBuildingFeatures[
                          customBuildingFeatures.length - 1
                        ]?.title.trim()
                      }
                      className="h-8 px-3 text-xs gap-1.5 border-dashed border-emerald-600/40 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Добавить пользовательскую характеристику (
                      {customBuildingFeatures.length}/3)
                    </Button>
                  </ResponsiveTooltip>
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Подземный паркинг</span>
                <Switch
                  checked={hasUndergroundParking}
                  onCheckedChange={setHasUndergroundParking}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Скоростные лифты</span>
                <Switch checked={hasElevator} onCheckedChange={setHasElevator} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="font-semibold">Автономное отопление</span>
                <Switch
                  checked={hasAutonomousHeating}
                  onCheckedChange={setHasAutonomousHeating}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEW BLOCK: Finishing & Fit-out (Отделка) */}
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-emerald-600" />
                Отделка и комплектация
              </CardTitle>
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                Базовый тип:{" "}
                {finishing === "rough"
                  ? "Черновая"
                  : finishing === "pre_finishing"
                  ? "Предчистовая (White box)"
                  : "Под ключ"}
              </div>
            </div>
            <CardDescription className="text-xs">
              Добавьте до 3 расширенных характеристик отделки с подробным описанием в модальном окне
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Added features cards */}
            {finishingFeatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {finishingFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-3.5 rounded-xl border bg-card hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-2 shadow-xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-bold text-foreground line-clamp-1">
                          {feat.title}
                        </h5>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {feat.description.length}/400
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {feat.description || "Без описания"}
                      </p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenViewFinishingDialog(feat)}
                        title="Посмотреть полное описание"
                        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-emerald-600 rounded-md gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        Просмотр
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditFinishingDialog(feat)}
                        title="Редактировать"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFinishingFeature(feat.id)}
                        title="Удалить"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed text-center space-y-2 bg-muted/10">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  Индивидуальные характеристики отделки еще не добавлены
                </p>
                <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                  Вы можете добавить до 3 уникальных параметров (домофон, входная дверь, звукоизоляция, стяжка) с подробным описанием.
                </p>
              </div>
            )}

            {/* Add button with Tooltip */}
            <div className="flex items-center justify-between pt-1">
              {finishingFeatures.length < 3 ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddFinishingDialog}
                    className="h-9 px-4 text-xs font-semibold bg-white dark:bg-card border-emerald-600/40 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Добавить характеристику отделки ({finishingFeatures.length}/3)
                  </Button>

                  <ResponsiveTooltip
                    title="Характеристика отделки"
                    content="Вы можете добавить свою характеристику, например „Домофон“, и дать ей расширенное описание, например „В каждой квартире установлен IP-видеодомофон с возможностью интеграции в систему «Умный дом»“"
                  >
                    <span className="p-1.5 text-muted-foreground hover:text-emerald-600 cursor-pointer">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                  </ResponsiveTooltip>
                </div>
              ) : (
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Добавлено максимальное количество характеристик (3 из 3)
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/developer-admin/projects">
            <Button variant="outline" type="button" className="text-xs">
              Отмена
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 gap-2 shadow-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </div>
      </form>
      )}

      {/* TAB 2: Gallery and Cover Management (Section 3.4 of Spec) */}
      {activeTab === "gallery" && (
        <ProjectGalleryManager
          images={images}
          coverImageUrl={coverImageUrl}
          onChange={(newImages, newCover) => {
            setImages(newImages);
            setCoverImageUrl(newCover);
          }}
        />
      )}

      {/* TAB 3: Interactive 6D Showcase Layers (Section 3.4 of Spec) */}
      {activeTab === "interactive" && (
        <div className="space-y-6">
          <ProjectPoiManager />
          <ProjectViewsLayoutsManager />
          <ProjectInsolationSettings />
        </div>
      )}

      {/* TAB 4: Complex Engagement Analytics (Section 3.4 of Spec) */}
      {activeTab === "analytics" && (
        <ProjectAnalyticsTab projectName={proj.name} />
      )}

      {/* Finishing Feature Dialog */}
      <FinishingFeatureDialog
        open={finishingDialogOpen}
        onOpenChange={setFinishingDialogOpen}
        initialData={activeFinishingFeature}
        mode={finishingDialogMode}
        onSave={handleSaveFinishingFeature}
        onEditRequested={(feat) => {
          setActiveFinishingFeature(feat);
          setFinishingDialogMode("edit");
        }}
      />

      {/* Full Interactive 6D Showcase Preview Modal (Section 3.4 of Spec) */}
      <ProjectPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        projectName={name}
        coverImageUrl={coverImageUrl}
        images={images}
        installmentMonths={parseInt(installmentMonths, 10) || 24}
        installmentDownPaymentPercent={parseInt(installmentDownPayment, 10) || 30}
        slug={proj.slug}
      />
    </div>
  );
}
