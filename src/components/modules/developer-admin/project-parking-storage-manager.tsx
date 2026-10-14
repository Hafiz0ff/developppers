"use client";

import React, { useState, useEffect } from "react";
import {
  ProjectParkingConfig,
  ProjectStorageConfig,
  ParkingSpot,
  StorageUnit,
  ParkingType,
  ParkingSpotStatus,
  StorageUnitStatus,
} from "@/types/parking-storage";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { validateDescriptionLength, validateUniqueNumbers } from "@/lib/parking-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Archive,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Layers,
  Sparkles,
  Zap,
  Users,
  Bike,
  ShieldCheck,
  Check,
} from "lucide-react";

interface ProjectParkingStorageManagerProps {
  projectId: string;
  initialParkingConfig?: ProjectParkingConfig;
  initialStorageConfig?: ProjectStorageConfig;
  initialSpots?: ParkingSpot[];
  initialStorageUnits?: StorageUnit[];
  onSave?: (data: {
    parkingConfig: ProjectParkingConfig;
    storageConfig: ProjectStorageConfig;
    parkingSpots: ParkingSpot[];
    storageUnits: StorageUnit[];
  }) => void;
}

export function ProjectParkingStorageManager({
  projectId,
  initialParkingConfig,
  initialStorageConfig,
  initialSpots = [],
  initialStorageUnits = [],
  onSave,
}: ProjectParkingStorageManagerProps) {
  const { language, tDual } = useLanguage();
  const { formatPrice } = useCurrency();

  // Storage key for local persistence
  const storageKey = `sogd_dev_admin_parking_storage_${projectId}`;

  // PARKING STATE
  const [parkingEnabled, setParkingEnabled] = useState<boolean>(() => {
    return initialParkingConfig?.isEnabled ?? false;
  });
  const [parkingTitleRu, setParkingTitleRu] = useState<string>(
    initialParkingConfig?.title || "Паркинг"
  );
  const [parkingTitleTg, setParkingTitleTg] = useState<string>(
    initialParkingConfig?.titleTg || "Таваққуфгоҳ"
  );
  const [parkingSubtitleRu, setParkingSubtitleRu] = useState<string>(
    initialParkingConfig?.subtitle || "Подземные паркинги"
  );
  const [parkingSubtitleTg, setParkingSubtitleTg] = useState<string>(
    initialParkingConfig?.subtitleTg || "Таваққуфгоҳҳои зеризаминӣ"
  );
  const [parkingDescRu, setParkingDescRu] = useState<string>(
    initialParkingConfig?.description || ""
  );
  const [parkingDescTg, setParkingDescTg] = useState<string>(
    initialParkingConfig?.descriptionTg || ""
  );
  const [parkingImages, setParkingImages] = useState<string[]>(
    initialParkingConfig?.images || []
  );
  const [parkingChessboardPublished, setParkingChessboardPublished] = useState<boolean>(
    initialParkingConfig?.isChessboardPublished ?? true
  );
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(initialSpots);

  // STORAGE STATE
  const [storageEnabled, setStorageEnabled] = useState<boolean>(() => {
    return initialStorageConfig?.isEnabled ?? false;
  });
  const [storageTitleRu, setStorageTitleRu] = useState<string>(
    initialStorageConfig?.title || "Кладовые"
  );
  const [storageTitleTg, setStorageTitleTg] = useState<string>(
    initialStorageConfig?.titleTg || "Анборхонаҳо"
  );
  const [storageSubtitleRu, setStorageSubtitleRu] = useState<string>(
    initialStorageConfig?.subtitle || "Кладовые для хранения вещей"
  );
  const [storageSubtitleTg, setStorageSubtitleTg] = useState<string>(
    initialStorageConfig?.subtitleTg || "Анборхонаҳо барои нигоҳдории ашё"
  );
  const [storageDescRu, setStorageDescRu] = useState<string>(
    initialStorageConfig?.description || ""
  );
  const [storageDescTg, setStorageDescTg] = useState<string>(
    initialStorageConfig?.descriptionTg || ""
  );
  const [storageImages, setStorageImages] = useState<string[]>(
    initialStorageConfig?.images || []
  );
  const [storageChessboardPublished, setStorageChessboardPublished] = useState<boolean>(
    initialStorageConfig?.isChessboardPublished ?? true
  );
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(initialStorageUnits);

  // UI helpers
  const [newParkingPhotoUrl, setNewParkingPhotoUrl] = useState("");
  const [newStoragePhotoUrl, setNewStoragePhotoUrl] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"parking" | "storage">("parking");

  // New spot form state
  const [newSpotNumber, setNewSpotNumber] = useState("");
  const [newSpotLevel, setNewSpotLevel] = useState("-1 этаж");
  const [newSpotType, setNewSpotType] = useState<ParkingType>("standard");
  const [newSpotArea, setNewSpotArea] = useState("19.0");
  const [newSpotPriceUsd, setNewSpotPriceUsd] = useState("5000");

  // New storage unit form state
  const [newUnitNumber, setNewUnitNumber] = useState("");
  const [newUnitLevel, setNewUnitLevel] = useState("Цокольный этаж / Подвал");
  const [newUnitArea, setNewUnitArea] = useState("4.5");
  const [newUnitPriceUsd, setNewUnitPriceUsd] = useState("1500");

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.parkingConfig) {
          setParkingEnabled(parsed.parkingConfig.isEnabled);
          setParkingTitleRu(parsed.parkingConfig.title || "Паркинг");
          setParkingTitleTg(parsed.parkingConfig.titleTg || "Таваққуфгоҳ");
          setParkingSubtitleRu(parsed.parkingConfig.subtitle || "Подземные паркинги");
          setParkingSubtitleTg(parsed.parkingConfig.subtitleTg || "Таваққуфгоҳҳои зеризаминӣ");
          setParkingDescRu(parsed.parkingConfig.description || "");
          setParkingDescTg(parsed.parkingConfig.descriptionTg || "");
          setParkingImages(parsed.parkingConfig.images || []);
          setParkingChessboardPublished(parsed.parkingConfig.isChessboardPublished);
        }
        if (parsed.parkingSpots) setParkingSpots(parsed.parkingSpots);

        if (parsed.storageConfig) {
          setStorageEnabled(parsed.storageConfig.isEnabled);
          setStorageTitleRu(parsed.storageConfig.title || "Кладовые");
          setStorageTitleTg(parsed.storageConfig.titleTg || "Анборхонаҳо");
          setStorageSubtitleRu(parsed.storageConfig.subtitle || "Кладовые для хранения вещей");
          setStorageSubtitleTg(parsed.storageConfig.subtitleTg || "Анборхонаҳо барои нигоҳдории ашё");
          setStorageDescRu(parsed.storageConfig.description || "");
          setStorageDescTg(parsed.storageConfig.descriptionTg || "");
          setStorageImages(parsed.storageConfig.images || []);
          setStorageChessboardPublished(parsed.storageConfig.isChessboardPublished);
        }
        if (parsed.storageUnits) setStorageUnits(parsed.storageUnits);
      }
    } catch {
      // Ignore parse error
    }
  }, [storageKey]);

  // Validation checks
  const isParkingDescRuValid = validateDescriptionLength(parkingDescRu, 400);
  const isParkingDescTgValid = validateDescriptionLength(parkingDescTg, 400);
  const isStorageDescRuValid = validateDescriptionLength(storageDescRu, 400);
  const isStorageDescTgValid = validateDescriptionLength(storageDescTg, 400);

  const spotUniqueness = validateUniqueNumbers(parkingSpots, "number");
  const unitUniqueness = validateUniqueNumbers(storageUnits, "number");

  // Save handler
  const handleSave = () => {
    const pConfig: ProjectParkingConfig = {
      isEnabled: parkingEnabled,
      title: parkingTitleRu,
      titleTg: parkingTitleTg,
      subtitle: parkingSubtitleRu,
      subtitleTg: parkingSubtitleTg,
      description: parkingDescRu,
      descriptionTg: parkingDescTg,
      images: parkingImages,
      isChessboardPublished: parkingChessboardPublished,
      totalSpots: parkingSpots.length,
      availableSpots: parkingSpots.filter((s) => s.status === "available").length,
      minPriceTjs: parkingSpots.reduce((min, s) => Math.min(min, s.priceTjs), Infinity),
      minPriceUsd: parkingSpots.reduce((min, s) => Math.min(min, s.priceUsd), Infinity),
    };

    const sConfig: ProjectStorageConfig = {
      isEnabled: storageEnabled,
      title: storageTitleRu,
      titleTg: storageTitleTg,
      subtitle: storageSubtitleRu,
      subtitleTg: storageSubtitleTg,
      description: storageDescRu,
      descriptionTg: storageDescTg,
      images: storageImages,
      isChessboardPublished: storageChessboardPublished,
      totalUnits: storageUnits.length,
      availableUnits: storageUnits.filter((u) => u.status === "available").length,
      minPriceTjs: storageUnits.reduce((min, u) => Math.min(min, u.priceTjs), Infinity),
      minPriceUsd: storageUnits.reduce((min, u) => Math.min(min, u.priceUsd), Infinity),
    };

    const dataToSave = {
      parkingConfig: pConfig,
      storageConfig: sConfig,
      parkingSpots,
      storageUnits,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch {
      // Storage error fallback
    }

    if (onSave) {
      onSave(dataToSave);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Photo handlers for parking
  const handleAddParkingPhoto = () => {
    if (!newParkingPhotoUrl.trim()) return;
    if (parkingImages.length >= 3) return;
    setParkingImages([...parkingImages, newParkingPhotoUrl.trim()]);
    setNewParkingPhotoUrl("");
  };

  const handleMoveParkingPhoto = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parkingImages.length) return;
    const updated = [...parkingImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setParkingImages(updated);
  };

  const handleDeleteParkingPhoto = (index: number) => {
    setParkingImages(parkingImages.filter((_, i) => i !== index));
  };

  // Photo handlers for storage
  const handleAddStoragePhoto = () => {
    if (!newStoragePhotoUrl.trim()) return;
    setStorageImages([...storageImages, newStoragePhotoUrl.trim()]);
    setNewStoragePhotoUrl("");
  };

  const handleDeleteStoragePhoto = (index: number) => {
    setStorageImages(storageImages.filter((_, i) => i !== index));
  };

  // Spot handlers
  const handleAddSpot = () => {
    if (!newSpotNumber.trim()) return;
    const formattedNum = newSpotNumber.startsWith("№") ? newSpotNumber : `№ ${newSpotNumber}`;
    const priceUsd = Number(newSpotPriceUsd) || 5000;
    const priceTjs = Math.round(priceUsd * 10.95);
    const area = Number(newSpotArea) || 19;

    const newSpot: ParkingSpot = {
      id: `ps_custom_${Date.now()}`,
      projectId,
      level: newSpotLevel,
      levelTg: newSpotLevel === "-1 этаж" ? "Ошёнаи -1" : "Ошёнаи -2",
      number: formattedNum,
      type: newSpotType,
      area,
      priceTjs,
      priceUsd,
      status: "available",
    };

    setParkingSpots([...parkingSpots, newSpot]);
    setNewSpotNumber("");
  };

  const handleToggleSpotStatus = (spotId: string) => {
    setParkingSpots((prev) =>
      prev.map((s) => {
        if (s.id !== spotId) return s;
        const nextStatus: ParkingSpotStatus =
          s.status === "available" ? "reserved" : s.status === "reserved" ? "sold" : "available";
        return { ...s, status: nextStatus };
      })
    );
  };

  const handleDeleteSpot = (spotId: string) => {
    setParkingSpots(parkingSpots.filter((s) => s.id !== spotId));
  };

  // Storage unit handlers
  const handleAddStorageUnit = () => {
    if (!newUnitNumber.trim()) return;
    const formattedNum = newUnitNumber.startsWith("К-") ? newUnitNumber : `К-${newUnitNumber}`;
    const priceUsd = Number(newUnitPriceUsd) || 1500;
    const priceTjs = Math.round(priceUsd * 10.95);
    const area = Number(newUnitArea) || 4.5;

    const newUnit: StorageUnit = {
      id: `su_custom_${Date.now()}`,
      projectId,
      level: newUnitLevel,
      levelTg: "Ошёнаи таҳхона",
      number: formattedNum,
      area,
      priceTjs,
      priceUsd,
      status: "available",
      features: ["Металлическая дверь", "Вентиляция"],
      featuresTg: ["Дари оҳанин", "Вентилятсия"],
    };

    setStorageUnits([...storageUnits, newUnit]);
    setNewUnitNumber("");
  };

  const handleToggleUnitStatus = (unitId: string) => {
    setStorageUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextStatus: StorageUnitStatus =
          u.status === "available" ? "reserved" : u.status === "reserved" ? "sold" : "available";
        return { ...u, status: nextStatus };
      })
    );
  };

  const handleDeleteUnit = (unitId: string) => {
    setStorageUnits(storageUnits.filter((u) => u.id !== unitId));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Car className="h-5 w-5 text-emerald-600" />
            {tDual("Паркинг и кладовые помещения", "Таваққуфгоҳ ва анборхонаҳо")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {tDual(
              "Управление независимыми блоками витрины, коллажами и интерактивными шахматками машино-мест и кладовых",
              "Идоракунии мустақили таваққуфгоҳ ва анборхонаҳо, суратҳо ва ҷадвалҳои интерактивӣ"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>{tDual("Настройки сохранены!", "Танзимот сабт шуд!")}</span>
            </div>
          )}

          <Button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{tDual("Сохранить всё", "Ҳамаро сабт кардан")}</span>
          </Button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("parking")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "parking"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Car className="h-4 w-4" />
          <span>{tDual("Блок «Паркинг»", "Бахши «Таваққуфгоҳ»")}</span>
          <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${parkingEnabled ? "bg-emerald-500/20 text-white border-transparent" : "opacity-60"}`}>
            {parkingEnabled ? tDual("Включён", "Фаъол") : tDual("Выкл", "Хомӯш")}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("storage")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "storage"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Archive className="h-4 w-4" />
          <span>{tDual("Блок «Кладовые»", "Бахши «Анборхонаҳо»")}</span>
          <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${storageEnabled ? "bg-emerald-500/20 text-white border-transparent" : "opacity-60"}`}>
            {storageEnabled ? tDual("Включён", "Фаъол") : tDual("Выкл", "Хомӯш")}
          </Badge>
        </button>
      </div>

      {/* ============================================================== */}
      {/* PARKING CONFIGURATION & CHESSBOARD */}
      {/* ============================================================== */}
      {activeTab === "parking" && (
        <div className="space-y-6">
          {/* Master Enable Switch */}
          <Card className="border-emerald-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Car className="h-4 w-4 text-emerald-600" />
                    {tDual("Отображение блока «Паркинг» на витрине", "Намоиши бахши «Таваққуфгоҳ» дар витрина")}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {tDual(
                      "Если выключено, блок паркинга и кнопка выбора машино-места полностью скрыты от покупателей. Все созданные машино-места сохраняются.",
                      "Агар хомӯш бошад, бахши таваққуфгоҳ дар сомона нишон дода намешавад. Тамоми ҷойҳои сохташуда нигоҳ дошта мешаванд."
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {parkingEnabled ? tDual("Включён", "Фаъол") : tDual("Отключён", "Хомӯш")}
                  </span>
                  <Switch checked={parkingEnabled} onCheckedChange={setParkingEnabled} />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Texts & Descriptions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">
                {tDual("Заголовки и текстовое описание (до 400 символов)", "Сарлавҳаҳо ва шарҳ (то 400 аломат)")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Заголовок (RU)", "Сарлавҳа (RU)")}</Label>
                  <Input value={parkingTitleRu} onChange={(e) => setParkingTitleRu(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Заголовок (TG)", "Сарлавҳа (TG)")}</Label>
                  <Input value={parkingTitleTg} onChange={(e) => setParkingTitleTg(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Подзаголовок (RU)", "Зерсарлавҳа (RU)")}</Label>
                  <Input value={parkingSubtitleRu} onChange={(e) => setParkingSubtitleRu(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Подзаголовок (TG)", "Зерсарлавҳа (TG)")}</Label>
                  <Input value={parkingSubtitleTg} onChange={(e) => setParkingSubtitleTg(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label>{tDual("Описание паркинга (RU)", "Шарҳи таваққуфгоҳ (RU)")}</Label>
                  <span className={`text-[11px] font-mono ${isParkingDescRuValid ? "text-muted-foreground" : "text-rose-600 font-bold"}`}>
                    {parkingDescRu.length} / 400 {tDual("символов", "аломат")}
                  </span>
                </div>
                <Textarea
                  value={parkingDescRu}
                  onChange={(e) => setParkingDescRu(e.target.value)}
                  rows={3}
                  className={!isParkingDescRuValid ? "border-rose-500 ring-rose-500/20" : ""}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label>{tDual("Описание паркинга (TG)", "Шарҳи таваққуфгоҳ (TG)")}</Label>
                  <span className={`text-[11px] font-mono ${isParkingDescTgValid ? "text-muted-foreground" : "text-rose-600 font-bold"}`}>
                    {parkingDescTg.length} / 400 {tDual("символов", "аломат")}
                  </span>
                </div>
                <Textarea
                  value={parkingDescTg}
                  onChange={(e) => setParkingDescTg(e.target.value)}
                  rows={3}
                  className={!isParkingDescTgValid ? "border-rose-500 ring-rose-500/20" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* 3-Photo Collage Management */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-emerald-600" />
                    {tDual("Фотоколлаж паркинга (3 фотографии)", "Коллажи аксҳои таваққуфгоҳ (3 акс)")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDual("Первое фото — главное крупное, 2 и 3 — боковые дополнительные", "Акси якум — асосӣ, 2 ва 3 — иловагӣ")}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {parkingImages.length} / 3
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {parkingImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl border p-2 bg-muted/20 space-y-2">
                    <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100">
                      <img src={img} alt={`Паркинг ${idx + 1}`} className="w-full h-full object-cover" />
                      <Badge className="absolute top-2 left-2 bg-black/60 text-white text-[10px]">
                        {idx === 0 ? tDual("Главное фото", "Акси асосӣ") : `${tDual("Фото", "Акси")} ${idx + 1}`}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-1">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveParkingPhoto(idx, "left")}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === parkingImages.length - 1}
                          onClick={() => handleMoveParkingPhoto(idx, "right")}
                          className="h-7 w-7 p-0"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteParkingPhoto(idx)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {parkingImages.length < 3 && (
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder={tDual("Вставьте URL фотографии паркинга...", "URL акси таваққуфгоҳро гузоред...")}
                    value={newParkingPhotoUrl}
                    onChange={(e) => setNewParkingPhotoUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    onClick={handleAddParkingPhoto}
                    size="sm"
                    className="h-9 px-3 gap-1 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {tDual("Добавить", "Илова кардан")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Chessboard Constructor for Parking */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    {tDual("Шахматка машино-мест паркинга", "Ҷадвали шоҳмотии ҷойҳои мошин")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDual(
                      `Всего машино-мест: ${parkingSpots.length}. Кликните на статус места для его переключения.`,
                      `Ҳамагӣ: ${parkingSpots.length} ҷой. Барои тағйири статус ба он зер кунед.`
                    )}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {tDual("Опубликовать шахматку", "Нашри ҷадвал")}
                  </span>
                  <Switch
                    checked={parkingChessboardPublished}
                    onCheckedChange={setParkingChessboardPublished}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!spotUniqueness.isValid && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>
                    {tDual("Обнаружены дубликаты номеров машино-мест:", "Дубликати рақамҳо ёфт шуд:")}{" "}
                    <strong>{spotUniqueness.duplicates.join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* Add Spot Form */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                <span className="text-xs font-bold block">{tDual("Добавить новое машино-место", "Иловаи ҷойи нави мошин")}</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Номер", "Рақам")}</Label>
                    <Input
                      placeholder="№ 39"
                      value={newSpotNumber}
                      onChange={(e) => setNewSpotNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Уровень", "Ошёна")}</Label>
                    <Input
                      value={newSpotLevel}
                      onChange={(e) => setNewSpotLevel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Тип", "Намуд")}</Label>
                    <select
                      value={newSpotType}
                      onChange={(e) => setNewSpotType(e.target.value as ParkingType)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                    >
                      <option value="standard">Стандарт</option>
                      <option value="large">Увеличенное (EV)</option>
                      <option value="family_double">Семейное (2 авто)</option>
                      <option value="moto">Мотоместо</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Площадь м²", "Масоҳат м²")}</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={newSpotArea}
                      onChange={(e) => setNewSpotArea(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Цена USD", "Нарх USD")}</Label>
                    <Input
                      type="number"
                      value={newSpotPriceUsd}
                      onChange={(e) => setNewSpotPriceUsd(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSpot}
                  className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {tDual("Добавить в шахматку", "Илова кардан ба ҷадвал")}
                </Button>
              </div>

              {/* Spots List */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 border rounded-2xl p-2 bg-muted/10">
                {parkingSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/70 text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold w-12">{spot.number}</span>
                      <span className="text-muted-foreground w-20">{spot.level}</span>
                      <span className="font-medium w-16">{spot.area} м²</span>
                      <span className="font-bold text-emerald-600 w-24">
                        {formatPrice(spot.priceTjs, spot.priceUsd)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSpotStatus(spot.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          spot.status === "available"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : spot.status === "reserved"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {spot.status === "available"
                          ? tDual("Свободно", "Дастрас")
                          : spot.status === "reserved"
                          ? tDual("Бронь", "Банд")
                          : tDual("Продано", "Фурӯхта")}
                      </button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSpot(spot.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* STORAGE CONFIGURATION & CHESSBOARD */}
      {/* ============================================================== */}
      {activeTab === "storage" && (
        <div className="space-y-6">
          {/* Master Enable Switch */}
          <Card className="border-emerald-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Archive className="h-4 w-4 text-emerald-600" />
                    {tDual("Отображение блока «Кладовые» на витрине", "Намоиши бахши «Анборхонаҳо» дар витрина")}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {tDual(
                      "Если выключено, блок кладовых скрыт от покупателей. Все созданные кладовые сохраняются.",
                      "Агар хомӯш бошад, бахши анборхонаҳо нишон дода намешавад. Тамоми анборхонаҳо нигоҳ дошта мешаванд."
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {storageEnabled ? tDual("Включён", "Фаъол") : tDual("Отключён", "Хомӯш")}
                  </span>
                  <Switch checked={storageEnabled} onCheckedChange={setStorageEnabled} />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Texts & Descriptions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">
                {tDual("Заголовки и описание (до 400 символов)", "Сарлавҳа ва шарҳ (то 400 аломат)")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Заголовок (RU)", "Сарлавҳа (RU)")}</Label>
                  <Input value={storageTitleRu} onChange={(e) => setStorageTitleRu(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Заголовок (TG)", "Сарлавҳа (TG)")}</Label>
                  <Input value={storageTitleTg} onChange={(e) => setStorageTitleTg(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Подзаголовок (RU)", "Зерсарлавҳа (RU)")}</Label>
                  <Input value={storageSubtitleRu} onChange={(e) => setStorageSubtitleRu(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{tDual("Подзаголовок (TG)", "Зерсарлавҳа (TG)")}</Label>
                  <Input value={storageSubtitleTg} onChange={(e) => setStorageSubtitleTg(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label>{tDual("Описание кладовых (RU)", "Шарҳи анборхонаҳо (RU)")}</Label>
                  <span className={`text-[11px] font-mono ${isStorageDescRuValid ? "text-muted-foreground" : "text-rose-600 font-bold"}`}>
                    {storageDescRu.length} / 400 {tDual("символов", "аломат")}
                  </span>
                </div>
                <Textarea
                  value={storageDescRu}
                  onChange={(e) => setStorageDescRu(e.target.value)}
                  rows={3}
                  className={!isStorageDescRuValid ? "border-rose-500 ring-rose-500/20" : ""}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label>{tDual("Описание кладовых (TG)", "Шарҳи анборхонаҳо (TG)")}</Label>
                  <span className={`text-[11px] font-mono ${isStorageDescTgValid ? "text-muted-foreground" : "text-rose-600 font-bold"}`}>
                    {storageDescTg.length} / 400 {tDual("символов", "аломат")}
                  </span>
                </div>
                <Textarea
                  value={storageDescTg}
                  onChange={(e) => setStorageDescTg(e.target.value)}
                  rows={3}
                  className={!isStorageDescTgValid ? "border-rose-500 ring-rose-500/20" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage Photos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-600" />
                {tDual("Фотографии кладовых", "Аксҳои анборхонаҳо")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {storageImages.map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl border p-2 bg-muted/20 space-y-2">
                    <div className="relative h-24 rounded-xl overflow-hidden bg-slate-100">
                      <img src={img} alt={`Кладовая ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteStoragePhoto(idx)}
                      className="w-full h-7 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      {tDual("Удалить", "Нобуд")}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder={tDual("URL фотографии кладовой...", "URL акси анборхона...")}
                  value={newStoragePhotoUrl}
                  onChange={(e) => setNewStoragePhotoUrl(e.target.value)}
                  className="text-xs"
                />
                <Button
                  type="button"
                  onClick={handleAddStoragePhoto}
                  size="sm"
                  className="h-9 px-3 gap-1 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {tDual("Добавить", "Илова кардан")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Storage Chessboard Constructor */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Archive className="h-4 w-4 text-emerald-600" />
                    {tDual("Шахматка кладовых помещений", "Ҷадвали шоҳмотии анборхонаҳо")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {tDual(`Всего помещений: ${storageUnits.length}`, `Ҳамагӣ: ${storageUnits.length}`)}
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    {tDual("Опубликовать шахматку", "Нашри ҷадвал")}
                  </span>
                  <Switch
                    checked={storageChessboardPublished}
                    onCheckedChange={setStorageChessboardPublished}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!unitUniqueness.isValid && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>
                    {tDual("Обнаружены дубликаты номеров кладовых:", "Дубликати рақамҳо ёфт шуд:")}{" "}
                    <strong>{unitUniqueness.duplicates.join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* Add Storage Unit Form */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                <span className="text-xs font-bold block">{tDual("Добавить новую кладовую", "Иловаи анборхонаи нав")}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Номер", "Рақам")}</Label>
                    <Input
                      placeholder="К-17"
                      value={newUnitNumber}
                      onChange={(e) => setNewUnitNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Уровень", "Ошёна")}</Label>
                    <Input
                      value={newUnitLevel}
                      onChange={(e) => setNewUnitLevel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Площадь м²", "Масоҳат м²")}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newUnitArea}
                      onChange={(e) => setNewUnitArea(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">{tDual("Цена USD", "Нарх USD")}</Label>
                    <Input
                      type="number"
                      value={newUnitPriceUsd}
                      onChange={(e) => setNewUnitPriceUsd(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddStorageUnit}
                  className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {tDual("Добавить в шахматку", "Илова кардан ба ҷадвал")}
                </Button>
              </div>

              {/* Units List */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 border rounded-2xl p-2 bg-muted/10">
                {storageUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/70 text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold w-12">{unit.number}</span>
                      <span className="text-muted-foreground w-28 truncate">{unit.level}</span>
                      <span className="font-medium w-16">{unit.area} м²</span>
                      <span className="font-bold text-emerald-600 w-24">
                        {formatPrice(unit.priceTjs, unit.priceUsd)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleUnitStatus(unit.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                          unit.status === "available"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : unit.status === "reserved"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {unit.status === "available"
                          ? tDual("Свободно", "Дастрас")
                          : unit.status === "reserved"
                          ? tDual("Бронь", "Банд")
                          : tDual("Продано", "Фурӯхта")}
                      </button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
