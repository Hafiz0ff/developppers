"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Send,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Globe,
  Info,
  Lock,
  Radio,
  Eye,
  Bot,
  ShieldCheck,
  HelpCircle,
  CheckCheck,
} from "lucide-react";
import type { PublishableObjectSummary } from "@/app/api/publications/objects/route";
import type { PreparedPublicationMaterial } from "@/lib/publications/publication-builder";
import type { LinkedTelegramChannel } from "@/lib/publications/telegram-channel-store";
import { calculateTelegramCharCount } from "@/lib/publications/publication-builder";
import type { Locale } from "@/lib/seo/taxonomy-store";

interface PublicationWorkspaceProps {
  forcedRole?: "realtor" | "developer";
}

export function PublicationWorkspace({ forcedRole }: PublicationWorkspaceProps) {
  const { language, tDual } = useLanguage();

  // 1. Objects List State
  const [objects, setObjects] = useState<PublishableObjectSummary[]>([]);
  const [loadingObjects, setLoadingObjects] = useState(true);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Telegram Channel Connection State (Section 9.1)
  const [channelInput, setChannelInput] = useState("");
  const [linkedChannel, setLinkedChannel] = useState<LinkedTelegramChannel | null>(null);
  const [checkingChannel, setCheckingChannel] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);
  const [showChannelHelp, setShowChannelHelp] = useState(false);

  // 3. Generation & Editing State (RU and TG only)
  const [targetLocale, setTargetLocale] = useState<Locale>(
    language === "tg" ? "tg" : "ru"
  );
  const [preparing, setPreparing] = useState(false);
  const [material, setMaterial] = useState<PreparedPublicationMaterial | null>(null);
  const [editableText, setEditableText] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4. Publishing Process State (Section 9.3 & 9.4)
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<{
    messageId: number;
    postUrl: string;
    channelUsername: string;
    simulated?: boolean;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // 5. Copy Feedback States (Section 10)
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fetch current user's linked Telegram channel
  const fetchLinkedChannel = async () => {
    try {
      const demoParam = forcedRole ? `?demoRole=${forcedRole}` : "";
      const res = await fetch(`/api/publications/telegram/channel${demoParam}`);
      const data = await res.json();
      if (data.success && data.channel) {
        setLinkedChannel(data.channel);
        setChannelInput(data.channel.channelUsername);
      }
    } catch (err) {
      console.error("Fetch channel error:", err);
    }
  };

  // Fetch publishable objects (strictly owned & active)
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
    fetchLinkedChannel();
  }, [forcedRole]);

  // Selected object item
  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  // Handle Telegram Channel Verification (Section 9.1)
  const handleVerifyChannel = async () => {
    if (!channelInput.trim()) {
      setChannelError("Введите адрес канала (например, @my_channel)");
      return;
    }

    setCheckingChannel(true);
    setChannelError(null);

    try {
      const res = await fetch("/api/publications/telegram/verify-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelUsername: channelInput.trim(),
          demoRole: forcedRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.channel) {
        setLinkedChannel(data.channel);
        setChannelInput(data.channel.channelUsername);
        setChannelError(null);
      } else {
        setChannelError(data.message || "Не удалось подтвердить права бота в канале");
      }
    } catch (err) {
      console.error("Verify channel error:", err);
      setChannelError("Ошибка соединения с сервером проверки");
    } finally {
      setCheckingChannel(false);
    }
  };

  // Prepare publication material
  const handlePrepareMaterial = async (overridePhoto?: string) => {
    if (!selectedObject) return;

    setPreparing(true);
    setErrorMessage(null);
    setPublishSuccess(null);
    setPublishError(null);
    setCopiedText(false);
    setCopiedUrl(false);

    try {
      const photoToUse = overridePhoto || selectedPhoto || selectedObject.image;
      const res = await fetch("/api/publications/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: selectedObject.id,
          objectType: selectedObject.type,
          locale: targetLocale,
          demoRole: forcedRole,
          selectedPhoto: photoToUse,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMaterial(data.material);
        setEditableText(data.material.editableBody);
        setSelectedPhoto(data.material.selectedPhoto || data.material.images[0] || "");
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

  // Live Telegram character counting (Section 6 & 6.1)
  const charCounts = material
    ? calculateTelegramCharCount(editableText, material.protectedContacts, material.mandatoryCtaText)
    : { totalVisibleChars: 0, remainingChars: 1024, isOverLimit: false, reservedChars: 0, maxAllowedBodyChars: 1024 };

  // Handle Telegram Single Photo Publishing (Section 9.3 & 9.4)
  const handlePublishToTelegram = async () => {
    if (!material || !selectedObject) return;
    if (charCounts.isOverLimit) {
      setPublishError(`Длина текста превышает лимит на ${Math.abs(charCounts.remainingChars)} символов.`);
      return;
    }
    if (!linkedChannel && !channelInput.trim()) {
      setPublishError("Пожалуйста, подключите Telegram-канал для публикации.");
      return;
    }

    setPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);

    try {
      const res = await fetch("/api/publications/telegram/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectId: selectedObject.id,
          objectType: selectedObject.type,
          photoUrl: selectedPhoto || material.selectedPhoto || material.images[0],
          editableBody: editableText,
          locale: targetLocale,
          channelUsername: linkedChannel?.channelUsername || channelInput.trim(),
          demoRole: forcedRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishSuccess({
          messageId: data.messageId,
          postUrl: data.postUrl,
          channelUsername: data.channelUsername,
          simulated: data.simulated,
        });
      } else {
        setPublishError(data.message || "Не удалось опубликовать в Telegram");
      }
    } catch (err) {
      console.error("Publish to Telegram error:", err);
      setPublishError("Сетевая ошибка при отправке публикации");
    } finally {
      setPublishing(false);
    }
  };

  // Copy full text (Section 10)
  const handleCopyText = async () => {
    if (!material) return;
    try {
      const fullCopy = `${editableText.trim()}\n\n${material.protectedContacts}\n\n${material.mandatoryCtaText}: ${material.canonicalUrl}`;
      await navigator.clipboard.writeText(fullCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Copy link (Section 10)
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

  const filteredObjects = objects.filter((o) => {
    const titleMatch = o.title.toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = o.location.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || locMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
              <Send className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {tDual("Публикация объектов в Telegram", "Нашри амвол дар Telegram", "Telegram Object Publication")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tDual(
              "Автоматическая подготовка и публикация ваших объектов в Telegram-канал с фотографией обложки и прямой ссылкой на Maskani.tj",
              "Омодасозӣ ва нашри худкори амволи шумо дар канали Telegram бо акси муқова ва пайванди мустақим ба Maskani.tj",
              "Automated preparation and publication of your listings to your Telegram channel with cover photo and direct link to Maskani.tj"
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
        {/* Left Column (5 cols): Object Selector & Channel Connection */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Step 1: Select Listing */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                  1
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  {tDual("Выберите ваш объект", "Интихоби амволи худ", "Select Your Object")}
                </h2>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold text-slate-600">
                {objects.length} {tDual("активных", "фаъол", "active")}
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
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {loadingObjects ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto text-emerald-500 mb-2" />
                  {tDual("Загрузка ваших объектов...", "Боргирии амвол...", "Loading listings...")}
                </div>
              ) : filteredObjects.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200">
                  <Info className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-700">
                    {tDual("Нет доступных объектов", "Амволи фаъол ёфт нашуд", "No available listings")}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tDual(
                      "Отображаются только ваши собственные активные объекты",
                      "Танҳо амволи фаъоли худи шумо нишон дода мешавад"
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
                        setPublishSuccess(null);
                        setPublishError(null);
                        setSelectedPhoto(obj.image);
                      }}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-accent/20 border-foreground/30 shadow-xs ring-1 ring-foreground/20"
                          : "bg-card hover:bg-muted/50 border-border/80"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                        <img
                          src={obj.image}
                          alt={displayTitle}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-xs font-bold px-1 rounded-tl-md backdrop-blur-xs flex items-center gap-0.5">
                          <ImageIcon className="h-2.5 w-2.5" />
                          {obj.photosCount}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
                          {displayTitle}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {displayLoc}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-emerald-700">
                            {new Intl.NumberFormat(language === "tg" ? "tg-TJ" : "ru-RU").format(obj.priceTjs)} {language === "tg" ? "сомонӣ" : "сомони"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
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

          {/* 2. Step 2: Telegram Channel Integration (Section 9.1) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-xs">
                  2
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  {tDual("Ваш Telegram-канал", "Канали Telegram-и шумо", "Your Telegram Channel")}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowChannelHelp(!showChannelHelp)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{tDual("Инструкция", "Дастур", "Guide")}</span>
              </button>
            </div>

            {/* Instruction Callout */}
            <AnimatePresence>
              {showChannelHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/50 border border-border/60 rounded-xl p-3 text-xs text-foreground space-y-1.5"
                >
                  <p className="font-bold flex items-center gap-1.5 text-foreground">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                    {tDual("Как подключить канал за 3 шага:", "Тарзи пайваст дар 3 қадам:")}
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground pl-1">
                    <li>{tDual("Откройте настройки вашего канала в Telegram → Администраторы.", "Танзимоти канали Telegram-ро кушоед → Мудирон.")}</li>
                    <li>{tDual("Добавьте официального бота платформы (@MaskaniBot) администратором.", "Боти расмии @MaskaniBot-ро мудир таъин намоед.")}</li>
                    <li>{tDual("Включите право «Публикация сообщений» (can_post_messages).", "Ҳуқуқи «Нашри паёмҳо»-ро фаъол созед.")}</li>
                    <li>{tDual("Введите адрес канала (@channel_name) ниже и нажмите «Проверить».", "Номи каналро (@channel) ворид намуда «Санҷидан»-ро пахш кунед.")}</li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Linked Status Banner */}
            {linkedChannel ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/80 text-foreground text-xs shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{linkedChannel.channelTitle}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{linkedChannel.channelUsername}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0 font-medium ml-2">
                  {tDual("Подключён", "Пайваст шуд", "Connected")}
                </Badge>
              </div>
            ) : null}

            {/* Channel Input & Verify Button */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="@my_realty_channel"
                  value={channelInput}
                  onChange={(e) => {
                    setChannelInput(e.target.value);
                    setChannelError(null);
                  }}
                  className="text-xs h-9 font-mono rounded-xl flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleVerifyChannel}
                  disabled={checkingChannel || !channelInput.trim()}
                  className="h-9 px-3 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white gap-1.5 cursor-pointer shrink-0"
                >
                  <Bot className={`h-3.5 w-3.5 ${checkingChannel ? "animate-spin" : ""}`} />
                  <span>{checkingChannel ? tDual("Проверка...", "Санҷиш...") : tDual("Проверить", "Санҷидан", "Verify")}</span>
                </Button>
              </div>

              {channelError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{channelError}</span>
                </p>
              )}
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
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setTargetLocale(l.id as Locale);
                      setMaterial(null);
                      setPublishSuccess(null);
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
              onClick={() => handlePrepareMaterial()}
              disabled={!selectedObject || preparing}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md gap-2 cursor-pointer transition-all"
            >
              <Sparkles className={`h-4 w-4 ${preparing ? "animate-spin" : ""}`} />
              <span>
                {preparing
                  ? tDual("Подготовка публикации...", "Омодасозӣ...", "Preparing...")
                  : tDual("Сформировать публикацию", "Омода кардани нашр", "Prepare Publication")}
              </span>
            </Button>
          </div>
        </div>

        {/* Right Column (7 cols): Photo Cover Selection, Text Editor & Telegram Mockup */}
        <div className="lg:col-span-7 space-y-5">
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg border-l-2 border-l-amber-500 bg-muted/40 border border-border/60 text-foreground text-xs flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">{tDual("Внимание при подготовке", "Огоҳӣ ҳангоми омодасозӣ")}</p>
                <p className="text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!material && !errorMessage && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400 space-y-3 shadow-xs">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mx-auto text-slate-400">
                <Send className="h-7 w-7 text-sky-500" />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="text-xs font-bold text-slate-700">
                  {tDual("Материалы публикации пока не сформированы", "Мавод ҳанӯз таҳия нашудааст")}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {tDual(
                    "Выберите объект слева и нажмите «Сформировать публикацию». Система создаст текст, подключит контакты и обязательную ссылку.",
                    "Амволро интихоб намуда, тугмаи «Омода кардани нашр»-ро пахш кунед."
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Prepared Workspace */}
          {material && (
            <div className="space-y-5">
              {/* 3. Step 3: Single Cover Photo Selector (Section 7.1) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-xs">
                      3
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">
                      {tDual("Выберите одну фотографию для обложки в Telegram", "Интихоби як акс барои муқоваи Telegram")}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {material.images.length} {tDual("фото", "акс")}
                  </span>
                </div>

                {material.images.length === 0 ? (
                  <div className="p-3 rounded-lg border-l-2 border-l-amber-500 bg-muted/40 border border-border/60 text-foreground text-xs">
                    {tDual(
                      "У этого объекта нет загруженных фотографий. Для отправки в Telegram требуется хотя бы одна фотография.",
                      "Барои ин амвол акс нест. Барои нашр дар Telegram ҳадди аққал як акс лозим аст."
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {material.images.map((imgUrl, idx) => {
                      const isSelected = (selectedPhoto || material.selectedPhoto) === imgUrl;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedPhoto(imgUrl);
                            setPublishSuccess(null);
                          }}
                          className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected
                              ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-102 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald-950/25 flex items-center justify-center">
                              <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Step 4: Text Editor & Protected Cards (Sections 5 & 6) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-xs">
                      4
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">
                      {tDual("Текст публикации и защищённые блоки", "Матни нашр ва қисмҳои ҳимояшуда")}
                    </h3>
                  </div>

                  {/* Character Counter (Section 6.1) */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                        charCounts.isOverLimit
                          ? "bg-destructive/10 text-destructive border-destructive/30"
                          : charCounts.remainingChars < 50
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          : "bg-muted text-foreground border-border/80"
                      }`}
                    >
                      {charCounts.totalVisibleChars} / 1024
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({tDual("осталось:", "боқӣ:")} {charCounts.remainingChars})
                    </span>
                  </div>
                </div>

                {/* Over Limit Warning */}
                {charCounts.isOverLimit && (
                  <div className="p-3 rounded-lg border-l-2 border-l-destructive bg-muted/40 border border-border/60 text-foreground text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                    <span>
                      {tDual(
                        `Превышен лимит Telegram на ${Math.abs(charCounts.remainingChars)} символов. Пожалуйста, сократите описание.`,
                        `Лимити Telegram ба ${Math.abs(charCounts.remainingChars)} аломат гузашт. Лутфан матнро кӯтоҳ кунед.`
                      )}
                    </span>
                  </div>
                )}

                {/* Editable Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>{tDual("Редактируемая часть (заголовок, цена, описание):", "Қисми таҳриршаванда (ном, нарх, тавсиф):")}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {tDual(
                        `лимит: ${charCounts.maxAllowedBodyChars} симв.`,
                        `ҳадди аксар: ${charCounts.maxAllowedBodyChars} аломат`,
                        `limit: ${charCounts.maxAllowedBodyChars} chars`
                      )}
                    </span>
                  </label>
                  <textarea
                    value={editableText}
                    maxLength={charCounts.maxAllowedBodyChars}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length > charCounts.maxAllowedBodyChars) {
                        setEditableText(val.slice(0, charCounts.maxAllowedBodyChars));
                      } else {
                        setEditableText(val);
                      }
                      setPublishSuccess(null);
                      setPublishError(null);
                    }}
                    rows={8}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-mono text-xs leading-relaxed text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-y shadow-inner"
                  />
                </div>

                {/* Protected Contacts Block (Section 5.1) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 text-xs block">{tDual("Контакты (защищены от изменения):", "Тамос (ҳимояшуда):")}</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {material.protectedContacts || tDual("Не указаны", "Нишон дода нашудааст")}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-slate-500">
                    {tDual("Защищено", "Ҳимояшуда", "Locked")}
                  </Badge>
                </div>

                {/* Protected Mandatory CTA Block (Section 5.2, 5.3 & 5.4) */}
                <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      {tDual("Обязательный призыв к действию (CTA):", "Даъват ба амал (CTA):")}
                    </span>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {tDual("Неизменяемый", "Тағйирнопазир", "Mandatory")}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted border border-border/60 text-xs">
                    <a
                      href={material.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{material.mandatoryCtaText}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </a>
                  </div>

                  {/* Section 5.4 Explanation */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tDual(
                      "Обязательная ссылка на Maskani.tj привлекает потенциальных клиентов на страницу вашего объекта и помогает находить покупателей.",
                      "Пайванди ҳатмӣ ба Maskani.tj муштариёнро ба саҳифаи амволи шумо ҷалб намуда, ба ёфтани харидорон кумак мерасонад.",
                      "The required link to Maskani.tj brings potential leads directly to your listing page."
                    )}
                  </p>
                </div>
              </div>

              {/* 5. Step 5: Telegram Preview Mockup (Section 8) */}
              <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center text-white">
                      <Send className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {tDual("Предпросмотр сообщения в Telegram", "Пешнамоиши паём дар Telegram", "Telegram Post Preview")}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {linkedChannel?.channelUsername || "@channel"}
                  </span>
                </div>

                {/* Telegram Card Bubble */}
                <div className="bg-[#182533] rounded-xl overflow-hidden max-w-lg border border-slate-700/60 shadow-lg">
                  {/* Photo Cover */}
                  {(selectedPhoto || material.selectedPhoto) && (
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-black/40">
                      <img
                        src={selectedPhoto || material.selectedPhoto}
                        alt="Telegram preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Caption & Anchors */}
                  <div className="p-3.5 space-y-2.5 font-sans text-xs text-[#e1e3e6] leading-relaxed">
                    <div className="whitespace-pre-line text-[12px]">{editableText}</div>

                    {material.protectedContacts && (
                      <div className="font-semibold text-sky-300 pt-1 border-t border-slate-700/50">
                        {material.protectedContacts}
                      </div>
                    )}

                    <div className="pt-1">
                      <a
                        href={material.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#64b5f6] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{material.mandatoryCtaText}</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-end gap-1 text-xs text-slate-400 pt-1">
                      <Eye className="h-3 w-3" />
                      <span>1</span>
                      <span className="ml-1">11:00</span>
                      <CheckCheck className="h-3 w-3 text-sky-400 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Result Banner (Section 9.4) */}
              {publishSuccess && (
                <div className="p-4 rounded-xl border-l-2 border-l-emerald-600 bg-muted/60 border border-border/60 text-xs text-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-sm">
                      {tDual("Публикация успешно отправлена в Telegram!", "Нашр бомуваффақият ба Telegram фиристода шуд!")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {tDual(
                      `Сообщение с фотографией и ссылкой опубликовано в канале ${publishSuccess.channelUsername}.`,
                      `Паём бо акс ва пайванд дар канали ${publishSuccess.channelUsername} нашр гардид.`
                    )}
                    {publishSuccess.simulated && (
                      <span className="block mt-0.5 text-emerald-700 italic">
                        (Режим симуляции: бот-токен не задан в .env, проверен тестовый сценарий)
                      </span>
                    )}
                  </p>
                  {publishSuccess.postUrl && (
                    <a
                      href={publishSuccess.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                    >
                      <span>{tDual("Открыть публикацию в Telegram", "Кушодани нашр дар Telegram")}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Error Alert */}
              {publishError && (
                <div className="p-3.5 rounded-lg border-l-2 border-l-destructive bg-muted/40 border border-border/60 text-foreground text-xs flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">{tDual("Не удалось опубликовать в Telegram", "Нашр дар Telegram ноком шуд")}</p>
                    <p className="text-muted-foreground">{publishError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                {/* Main Publish to Telegram Button */}
                <Button
                  onClick={handlePublishToTelegram}
                  disabled={
                    publishing ||
                    charCounts.isOverLimit ||
                    (!selectedPhoto && !material.selectedPhoto) ||
                    (!linkedChannel && !channelInput.trim())
                  }
                  className="sm:col-span-6 h-11 text-xs font-bold rounded-xl gap-2 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white shadow-md transition-all disabled:opacity-50"
                >
                  <Send className={`h-4 w-4 ${publishing ? "animate-spin" : ""}`} />
                  <span>
                    {publishing
                      ? tDual("Отправка в Telegram...", "Ирсол ба Telegram...")
                      : tDual("Опубликовать в Telegram", "Нашр дар Telegram", "Publish to Telegram")}
                  </span>
                </Button>

                {/* Copy Text Button (Section 10) */}
                <Button
                  variant="outline"
                  onClick={handleCopyText}
                  className={`sm:col-span-3 h-11 text-xs font-bold rounded-xl gap-1.5 cursor-pointer transition-all ${
                    copiedText
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-slate-300 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{tDual("Скопировано", "Нусха шуд")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tDual("Копировать текст", "Нусхаи матн")}</span>
                    </>
                  )}
                </Button>

                {/* Copy Link Button (Section 10) */}
                <Button
                  variant="outline"
                  onClick={handleCopyUrl}
                  className={`sm:col-span-3 h-11 text-xs font-bold rounded-xl gap-1.5 cursor-pointer transition-all ${
                    copiedUrl
                      ? "border-foreground/40 bg-accent/20 text-foreground"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {copiedUrl ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{tDual("Ссылка скопирована", "Пайванд нусха шуд")}</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tDual("Копировать ссылку", "Нусхаи пайванд")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
