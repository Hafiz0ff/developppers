"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Share2,
  Copy,
  Download,
  Check,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  Building2,
  Home,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Info,
} from "lucide-react";
import type { PublishableObjectSummary } from "@/app/api/publications/objects/route";
import type { PreparedPublicationMaterial } from "@/lib/publications/publication-builder";
import type { Locale } from "@/lib/seo/taxonomy-store";

interface PublicationWorkspaceProps {
  forcedRole?: "realtor" | "developer";
}

export function PublicationWorkspace({ forcedRole }: PublicationWorkspaceProps) {
  const { language, tDual } = useLanguage();

  const [objects, setObjects] = useState<PublishableObjectSummary[]>([]);
  const [loadingObjects, setLoadingObjects] = useState(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Target platforms state (Rule TZ Section 6.3: ephemeral UI state, manual publication note)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, boolean>>({
    telegram: true,
    whatsapp: true,
    instagram: false,
    vkontakte: false,
  });

  // Selected locale for generation
  const [targetLocale, setTargetLocale] = useState<Locale>(language as Locale);

  // Material generation state
  const [preparing, setPreparing] = useState(false);
  const [material, setMaterial] = useState<PreparedPublicationMaterial | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy feedback states
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fetch publishable objects
  const fetchObjects = async () => {
    setLoadingObjects(true);
    setErrorMessage(null);
    try {
      const demoParam = forcedRole ? `?demoRole=${forcedRole}` : "";
      const res = await fetch(`/api/publications/objects${demoParam}`);
      const data = await res.json();
      if (data.success) {
        setObjects(data.items);
        if (data.items.length > 0 && !selectedObjectId) {
          setSelectedObjectId(data.items[0].id);
        }
      } else {
        setErrorMessage(data.message || "Ошибка загрузки объектов");
      }
    } catch (err) {
      console.error("Fetch objects error:", err);
      setErrorMessage("Не удалось загрузить список объектов");
    } finally {
      setLoadingObjects(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, [forcedRole]);

  // Selected object item
  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  // Prepare publication material
  const handlePrepareMaterial = async () => {
    if (!selectedObject) return;

    setPreparing(true);
    setErrorMessage(null);
    setCopiedText(false);
    setCopiedUrl(false);

    try {
      const res = await fetch("/api/publications/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: selectedObject.id,
          objectType: selectedObject.type,
          locale: targetLocale,
          demoRole: forcedRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMaterial(data.material);
      } else {
        setErrorMessage(data.message || "Ошибка при подготовке материала");
        setMaterial(null);
      }
    } catch (err) {
      console.error("Prepare material error:", err);
      setErrorMessage("Ошибка связи с сервером");
    } finally {
      setPreparing(false);
    }
  };

  // Copy full text
  const handleCopyText = async () => {
    if (!material) return;
    try {
      await navigator.clipboard.writeText(material.text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Copy link
  const handleCopyUrl = async () => {
    if (!material) return;
    try {
      await navigator.clipboard.writeText(material.canonicalUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Download photos ZIP
  const handleDownloadPhotos = () => {
    if (!selectedObject) return;
    const demoParam = forcedRole ? `&demoRole=${forcedRole}` : "";
    window.location.href = `/api/publications/download-photos?objectId=${selectedObject.id}&objectType=${selectedObject.type}${demoParam}`;
  };

  const filteredObjects = objects.filter((o) => {
    const titleMatch = o.title.toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = o.location.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || locMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header (Section 6.1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Share2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {tDual("Публикация объектов", "Нашри амвол", "Object Publication")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tDual(
              "Подготовьте объявления для размещения в своих каналах. Данные и фотографии будут взяты из ваших опубликованных объектов на Maskani",
              "Эълонҳоро барои нашр дар шабакаҳои худ омода намоед. Маълумот ва аксҳо аз амволи фаъоли шумо дар Maskani гирифта мешаванд",
              "Prepare listings for posting to your external channels. Content and photos are populated from your published listings on Maskani"
            )}
          </p>
        </div>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="sm"
          onClick={fetchObjects}
          disabled={loadingObjects}
          className="gap-1.5 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loadingObjects ? "animate-spin" : ""}`} />
          <span>{tDual("Обновить список", "Навсозии рӯйхат", "Refresh")}</span>
        </Button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Object Selector & Target Channels */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Step 1: Select Listing */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                  1
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  {tDual("Выберите опубликованный объект", "Интихоби амволи нашршуда", "Select Published Object")}
                </h2>
              </div>
              <Badge variant="secondary" className="text-[10px] font-semibold text-slate-600">
                {objects.length} {tDual("доступно", "дастрас", "available")}
              </Badge>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                placeholder={tDual("Поиск по названию или району...", "Ҷустуҷӯ аз рӯи ном ё маҳалла...", "Search listings...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>

            {/* Object Cards List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {loadingObjects ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto text-emerald-500 mb-2" />
                  {tDual("Загрузка объектов...", "Боргирии рӯйхат...", "Loading listings...")}
                </div>
              ) : filteredObjects.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
                  <Info className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-700">
                    {tDual("Нет активных объектов", "Амволи фаъол ёфт нашуд", "No active listings")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {tDual(
                      "Для подготовки материалов требуются опубликованные объявления",
                      "Барои омодасозӣ эълонҳои нашршуда лозиманд"
                    )}
                  </p>
                </div>
              ) : (
                filteredObjects.map((obj) => {
                  const isSelected = selectedObjectId === obj.id;
                  const displayTitle = language === "tg" ? obj.titleTg || obj.title : obj.title;
                  const displayLoc = language === "tg" ? obj.locationTg || obj.location : obj.location;

                  return (
                    <motion.div
                      key={obj.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedObjectId(obj.id);
                        setMaterial(null);
                        setErrorMessage(null);
                      }}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-50/70 border-emerald-500/60 shadow-xs ring-1 ring-emerald-500/30"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                        <img
                          src={obj.image}
                          alt={displayTitle}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1 rounded-tl-md backdrop-blur-xs flex items-center gap-0.5">
                          <ImageIcon className="h-2.5 w-2.5" />
                          {obj.photosCount}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
                          {displayTitle}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {displayLoc}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-emerald-700">
                            {new Intl.NumberFormat(language === "tg" ? "tg-TJ" : "ru-RU").format(obj.priceTjs)} {language === "tg" ? "сомонӣ" : "сомони"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            • {obj.propertyType}
                          </span>
                        </div>
                      </div>

                      {/* Radio / Check indicator */}
                      <div className="shrink-0 pl-1">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Step 2: Target Channels (Section 6.3) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                  2
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  {tDual("Куда планируете разместить?", "Ба куҷо нашр кардан мехоҳед?", "Where will you post?")}
                </h2>
              </div>

              {/* Prominent Badge for Manual Publishing */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-[10px] font-bold">
                <Info className="h-3 w-3 text-amber-600" />
                <span>{tDual("Ручная публикация", "Нашри дастӣ", "Manual posting")}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {tDual(
                "Отметьте каналы для своего удобства. Подключение аккаунтов не требуется — материалы готовятся для самостоятельного копирования.",
                "Шабакаҳоро қайд намоед. Пайвасти аккаунт лозим нест — матн ва аксҳо барои нусхабардории дастӣ омода мешаванд.",
                "Select channels for your convenience. No account linking needed — materials are prepared for manual copy & paste."
              )}
            </p>

            {/* 4 Platforms Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "telegram", label: "Telegram", color: "hover:border-sky-400 bg-sky-50/30" },
                { id: "whatsapp", label: "WhatsApp", color: "hover:border-emerald-400 bg-emerald-50/30" },
                { id: "instagram", label: "Instagram", color: "hover:border-pink-400 bg-pink-50/30" },
                { id: "vkontakte", label: "ВКонтакте", color: "hover:border-blue-400 bg-blue-50/30" },
              ].map((plat) => {
                const checked = Boolean(selectedPlatforms[plat.id]);
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() =>
                      setSelectedPlatforms((prev) => ({ ...prev, [plat.id]: !prev[plat.id] }))
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
                      checked
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{plat.label}</span>
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                        checked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Language Selector for Published Version */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                {tDual("Язык публикации:", "Забони нашр:", "Publish Language:")}
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                {[
                  { id: "ru", label: "RU" },
                  { id: "tg", label: "TG (Тоҷ)" },
                  { id: "en", label: "EN" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setTargetLocale(l.id as Locale);
                      setMaterial(null);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      targetLocale === l.id
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prepare Button */}
            <Button
              onClick={handlePrepareMaterial}
              disabled={!selectedObject || preparing}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md gap-2 cursor-pointer transition-all"
            >
              <Sparkles className={`h-4 w-4 ${preparing ? "animate-spin" : ""}`} />
              <span>
                {preparing
                  ? tDual("Подготовка материалов...", "Омодасозӣ...", "Preparing...")
                  : tDual("Подготовить материалы", "Омода кардани мавод", "Prepare Materials")}
              </span>
            </Button>
          </div>
        </div>

        {/* Right Column (7 cols): Prepared Materials & Download Actions */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Top Bar of Prepared Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {tDual("Готовые материалы для копирования", "Маводи омода барои нусхабардорӣ", "Prepared Materials")}
                </h3>
              </div>

              {material && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[11px] gap-1 px-2.5 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{material.statusNotice}</span>
                </Badge>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {tDual("Внимание при подготовке", "Огоҳӣ ҳангоми омодасозӣ", "Preparation Notice")}
                  </p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Workspace Content */}
            {!material && !errorMessage && (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mx-auto text-slate-400">
                  <Share2 className="h-7 w-7" />
                </div>
                <div className="max-w-sm mx-auto">
                  <p className="text-xs font-bold text-slate-700">
                    {tDual("Материалы пока не сформированы", "Мавод ҳанӯз таҳия нашудааст", "Materials not prepared yet")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {tDual(
                      "Выберите объявление слева и нажмите «Подготовить материалы»",
                      "Амволро аз тарафи чап интихоб намуда, тугмаи «Омода кардани мавод»-ро пахш намоед"
                    )}
                  </p>
                </div>
              </div>
            )}

            {material && (
              <div className="space-y-4">
                {/* Status Notice Subtext (Section 10.1) */}
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  {tDual(
                    "Скопируйте текст и скачайте фотографии, чтобы самостоятельно разместить объявление на выбранных площадках.",
                    "Матнро нусхабардорӣ намуда ва аксҳоро боргирӣ кунед, то эълонро дар шабакаҳои худ дастӣ нашр намоед.",
                    "Copy text and download photos to manually post the listing to your selected channels."
                  )}
                </p>

                {/* Textarea with generated universal text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {tDual("Текст публикации:", "Матни нашр:", "Publication Text:")}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {material.text.length} {tDual("символов", "аломат", "chars")}
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      readOnly
                      value={material.text}
                      rows={14}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/70 font-mono text-xs leading-relaxed text-slate-800 outline-none select-all resize-y shadow-inner"
                    />
                  </div>
                </div>

                {/* Actions Toolbar (Copy Text, Copy Link, Download ZIP) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Copy Text Button */}
                  <Button
                    onClick={handleCopyText}
                    className={`h-10 text-xs font-bold rounded-xl gap-2 cursor-pointer transition-all ${
                      copiedText
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {copiedText ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{tDual("Текст скопирован", "Матн нусхабардорӣ шуд", "Text Copied!")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>{tDual("Скопировать текст", "Нусхабардории матн", "Copy Text")}</span>
                      </>
                    )}
                  </Button>

                  {/* Copy Link Button */}
                  <Button
                    variant="outline"
                    onClick={handleCopyUrl}
                    className={`h-10 text-xs font-bold rounded-xl gap-2 cursor-pointer transition-all ${
                      copiedUrl
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-300 text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>{tDual("Ссылка скопирована", "Пайванд нусха шуд", "Link Copied!")}</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 text-slate-500" />
                        <span>{tDual("Скопировать ссылку", "Нусхаи пайванд", "Copy Link")}</span>
                      </>
                    )}
                  </Button>

                  {/* Download Photos ZIP Button */}
                  <Button
                    variant="outline"
                    disabled={!material.hasPhotos}
                    onClick={handleDownloadPhotos}
                    className={`h-10 text-xs font-bold rounded-xl gap-2 cursor-pointer transition-all ${
                      material.hasPhotos
                        ? "border-emerald-600/40 text-emerald-800 hover:bg-emerald-50"
                        : "border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                    }`}
                    title={
                      !material.hasPhotos
                        ? tDual("У объявления пока нет доступных фотографий", "Амвол ҳоло акс надорад")
                        : tDual("Скачать все фотографии одним архивом", "Боргирии ҳамаи аксҳо бо як архив")
                    }
                  >
                    <Download className="h-4 w-4 text-emerald-600" />
                    <span>
                      {material.hasPhotos
                        ? `${tDual("Скачать фото (ZIP)", "Боргирии аксҳо (ZIP)", "Download Photos (ZIP)")}`
                        : tDual("Нет фотографий", "Акс нест", "No Photos")}
                    </span>
                  </Button>
                </div>

                {/* Photos notice */}
                {!material.hasPhotos && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80">
                    {tDual(
                      "У объявления пока нет доступных фотографий. Текст сформирован и готов к публикации.",
                      "Барои ин эълон аксҳо дастрас нестанд. Матни нашр омода аст."
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
