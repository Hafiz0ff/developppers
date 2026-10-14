"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATALOG_PROPERTIES, getPropertyById, type CatalogProperty } from "@/lib/catalog-data";
import type { ClassifiedCard } from "@/lib/classifieds/map-card";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Droplet,
  Eye,
  Heart,
  Home,
  Layers,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TreePine,
  User,
  X,
  Zap,
} from "lucide-react";

export default function ClassifiedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { t, tDual, language } = useLanguage();
  const isTg = language === "tg";
  const { formatPrice, currency } = useCurrency();

  const [item, setItem] = useState<ClassifiedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Quick inquiry form
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("+992 ");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  // Fetch classified data
  useEffect(() => {
    async function fetchClassified() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/classifieds/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (json.success && json.classified) {
          setItem(json.classified);
        } else {
          // Check fallback in local CATALOG_PROPERTIES
          const match =
            getPropertyById(slug) ||
            CATALOG_PROPERTIES.find(
              (p) =>
                p.id === slug ||
                p.slug === slug ||
                `classified-${p.id}` === slug ||
                slug.includes(p.id)
            );
          if (match) {
            setItem({
              ...match,
              slug: match.slug || `classified-${match.id}`,
              status: "active",
              viewsCount: 36,
              userId: "demo",
            });
          } else {
            setItem(null);
          }
        }
      } catch {
        const match =
          getPropertyById(slug) ||
          CATALOG_PROPERTIES.find(
            (p) =>
              p.id === slug ||
              p.slug === slug ||
              `classified-${p.id}` === slug ||
              slug.includes(p.id)
          );
        if (match) {
          setItem({
            ...match,
            slug: match.slug || `classified-${match.id}`,
            status: "active",
            viewsCount: 36,
            userId: "demo",
          });
        } else {
          setItem(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchClassified();
  }, [slug]);

  // Favorites state in localStorage
  useEffect(() => {
    if (!item) return;
    try {
      const favs = JSON.parse(localStorage.getItem("sogd_favorites") || "[]");
      setIsFavorite(favs.includes(item.id || item.slug));
    } catch {}
  }, [item]);

  const toggleFavorite = () => {
    if (!item) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("sogd_favorites") || "[]");
      const id = item.id || item.slug;
      let next: string[];
      if (favs.includes(id)) {
        next = favs.filter((f) => f !== id);
        setIsFavorite(false);
      } else {
        next = [...favs, id];
        setIsFavorite(true);
      }
      localStorage.setItem("sogd_favorites", JSON.stringify(next));
    } catch {}
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.title || "Maskani",
          text: item?.title || "Объявление на Maskani.tj",
          url,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {}
  };

  const handleRevealPhone = () => {
    setPhoneRevealed(true);
    if (!item) return;
    try {
      fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "Посетитель сайта (Звонок по объявлению)",
          clientPhone: "+992 (просмотр номера)",
          classifiedId: item.id,
          classifiedTitle: item.title,
          budget: item.priceUsd,
          commissionPercent: 2,
          source: "phone_click",
          notes: `Посетитель открыл номер телефона на детальной странице: ${item.title} (${item.city}, ${item.district}).`,
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleWhatsappClick = () => {
    if (!item) return;
    try {
      fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "Посетитель сайта (WhatsApp запрос)",
          clientPhone: "+992 (переход в WA)",
          classifiedId: item.id,
          classifiedTitle: item.title,
          budget: item.priceUsd,
          commissionPercent: 2,
          source: "whatsapp_click",
          notes: `Посетитель перешел в WhatsApp по объявлению: ${item.title}.`,
        }),
      }).catch(() => {});
    } catch {}
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setInquiryLoading(true);
    try {
      await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: inquiryName || (isTg ? "Муштарӣ" : "Покупатель"),
          clientPhone: inquiryPhone,
          classifiedId: item.id,
          classifiedTitle: item.title,
          budget: item.priceUsd,
          commissionPercent: 2,
          source: "lead_form",
          notes: `Заявка с сайта: ${inquiryMessage || "Интересует данный объект"}. Объект: ${item.title}.`,
        }),
      });
      setInquirySent(true);
    } catch {
      setInquirySent(true);
    } finally {
      setInquiryLoading(false);
    }
  };

  // Similar properties
  const similarItems = useMemo(() => {
    if (!item) return [];
    return CATALOG_PROPERTIES.filter((p) => p.id !== item.id).slice(0, 3);
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-10 w-3/4 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-96 w-full bg-slate-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[70vh] bg-slate-50/60 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">
            {tDual("Объявление не найдено", "Эълон ёфт нашуд")}
          </h1>
          <p className="text-xs text-slate-500">
            {tDual(
              "Возможно, объект уже продан или снят с публикации собственником.",
              "Шояд амвол фурӯхта шудааст ё аз ҷониби соҳибмулк аз нашр гирифта шудааст."
            )}
          </p>
          <Link href="/classifieds">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl w-full">
              {tDual("Перейти в каталог объявлений", "Ба феҳристи эълонҳо гузаштан")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // All photos list
  const photos =
    item.images && item.images.length > 0
      ? item.images
      : [item.image || "/images/hero-bg.png"];

  const activePhoto = photos[activePhotoIndex] || photos[0];
  const pricePerSqm =
    item.area > 0 ? Math.round(item.priceUsd / item.area) : 0;
  const pricePerSqmTjs =
    item.area > 0 ? Math.round(item.priceTjs / item.area) : 0;

  const rawPhone = item.phone || "+992928881234";
  const rawWhatsapp = (item.whatsapp || rawPhone).replace(/\D/g, "");

  const prefilledWhatsappMsg = encodeURIComponent(
    isTg
      ? `Ассалому алейкум! Ман оид ба эълони шумо дар Maskani.tj навишта истодаам: «${item.title}» бо нархи $${item.priceUsd?.toLocaleString()}. Оё эълон то ҳол фаъол аст?`
      : `Здравствуйте! Пишу по поводу вашего объявления на Maskani.tj: «${item.title}» за $${item.priceUsd?.toLocaleString()}. Объявление еще актуально?`
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. TOP BREADCRUMBS & ACTIONS */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <Link
              href="/classifieds"
              className="hover:text-emerald-700 flex items-center gap-1 font-medium shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {tDual("Вторичный рынок", "Бозори дуюмдараҷа")}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="truncate text-slate-800 font-semibold">
              {item.city}, {item.district}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{tDual("Скопировано!", "Нусхабардорӣ шуд!")}</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{tDual("Поделиться", "Мубодила")}</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFavorite}
              className={`h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-slate-200 transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  isFavorite ? "fill-red-600 text-red-600" : "text-slate-500"
                }`}
              />
              <span className="hidden sm:inline">
                {isFavorite ? tDual("В избранном", "Дар писандидаҳо") : tDual("В избранное", "Ба писандидаҳо")}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 2. HEADER: TITLE & LOCATION */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-600 text-white font-medium text-xs">
              {isTg
                ? item.dealType === "Аренда"
                  ? "Иҷора"
                  : "Фурӯш"
                : item.dealType}
            </Badge>
            <Badge variant="secondary" className="bg-white text-slate-800 border border-slate-200 font-medium text-xs">
              {isTg
                ? item.propertyType === "Квартира"
                  ? "Хонадон"
                  : item.propertyType.includes("Ҳавлӣ") || item.propertyType.includes("Дом")
                  ? "Ҳавлӣ"
                  : item.propertyType === "Коммерция"
                  ? "Амволи тиҷоратӣ"
                  : item.propertyType
                : item.propertyType}
            </Badge>
            {item.isNegotiable && (
              <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs font-medium">
                {tDual("Торг уместен", "Савдо мешавад")}
              </Badge>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
              <Eye className="h-3.5 w-3.5" />
              {item.viewsCount || 24} {tDual("просмотров", "биниш")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {item.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {item.city}, {item.district}
              {item.landmark ? ` (${item.landmark})` : ""}
            </span>
          </p>
        </div>

        {/* 3. PHOTO GALLERY (CIAN / AIRBNB STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main Large Image */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="md:col-span-3 relative h-72 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-sm"
          >
            <img
              src={activePhoto}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Maximize2 className="h-3.5 w-3.5" />
              {tDual("Нажмите для полноэкранного просмотра", "Барои дидани пурра пахш кунед")} (
              {activePhotoIndex + 1}/{photos.length})
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Sidebar */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-2.5 h-full">
            {photos.slice(0, 3).map((p, idx) => (
              <div
                key={p + idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative h-24 sm:h-28 md:h-[146px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  activePhotoIndex === idx
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={p}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 2 && photos.length > 3 && (
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm"
                  >
                    +{photos.length - 3} {tDual("фото", "акс")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. MAIN CONTENT GRID (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: SPECS, AMENITIES, DESCRIPTION, MAP */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Box for Mobile / Tablet */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    {tDual("Стоимость объекта:", "Нархи амвол:")}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
                    {formatPrice(item.priceTjs, item.priceUsd)}
                  </div>
                </div>
                {item.area > 0 && (
                  <div className="text-xs text-slate-500 sm:text-right">
                    <span className="font-semibold text-slate-800">
                      ${pricePerSqm} / м²
                    </span>{" "}
                    ({pricePerSqmTjs.toLocaleString()} TJS / м²)
                  </div>
                )}
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600" />
                {tDual("Характеристики объекта", "Мушаххасоти амвол")}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">{tDual("Общая площадь", "Масоҳати умумӣ")}</span>
                  <span className="font-bold text-slate-900 text-sm">{item.area} м²</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">{tDual("Комнаты", "Ҳуҷраҳо")}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.rooms} {tDual("комн.", "ҳуҷр.")}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">
                    {item.landArea ? tDual("Участок", "Қитъаи замин") : tDual("Этаж", "Ошёна")}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.landArea || item.floor || tDual("Не указан", "Нишон дода нашудааст")}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">{tDual("Тип сделки", "Навъи муомила")}</span>
                  <span className="font-bold text-slate-900 text-sm">{item.dealType}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">{tDual("Тип недвижимости", "Намуди амвол")}</span>
                  <span className="font-bold text-slate-900 text-sm">{item.propertyType}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">{tDual("Продавец", "Фурӯшанда")}</span>
                  <span className="font-bold text-slate-900 text-sm">{item.sellerType}</span>
                </div>
              </div>

              {/* Specific features tags */}
              {item.features && item.features.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs text-slate-400 block mb-2 font-medium">
                    {tDual("Особенности и преимущества:", "Хусусиятҳо ва бартариҳо:")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sughd Infrastructure & Communications Box */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                {tDual("Коммуникации и условия", "Шабакаҳои муҳандисӣ ва шароит")}
              </h2>
              <p className="text-xs text-slate-500">
                {tDual(
                  "Ключевые коммуникации, проверенные в объекте:",
                  "Коммуникатсияҳои асосии тасдиқшуда дар ин иншоот:"
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{tDual("Водоснабжение", "Обтаъминкунӣ")}</span>
                    <span className="text-[11px] text-slate-500">{tDual("Постоянный водопровод", "Оби доимӣ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{tDual("Электричество", "Қувваи барқ")}</span>
                    <span className="text-[11px] text-slate-500">{tDual("24/7 без перебоев", "24/7 бе қатъшавӣ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Home className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{tDual("Отопление", "Гармидиҳӣ")}</span>
                    <span className="text-[11px] text-slate-500">{tDual("Автономное / городское", "Мустақил / шаҳрӣ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <TreePine className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{tDual("Двор и территория", "Ҳавлӣ ва ҳудуд")}</span>
                    <span className="text-[11px] text-slate-500">{tDual("Озеленение и благоустройство", "Кабудизоркунӣ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {tDual("Описание объекта", "Тавсифи муфассали амвол")}
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description ||
                  tDual(
                    "Светлая уютная квартира со всеми удобствами и полным пакетом документов. Развитая инфраструктура, рядом школы, детские сады, торговые центры и общественный транспорт.",
                    "Хонадони равшану барҳаво бо тамоми шароити мусоид ва ҳуҷҷатҳои пурраи расмӣ. Инфрасохтори хуб инкишофёфта, дар наздикии мактабҳо, боғчаҳо ва нақлиёти ҷамъиятӣ."
                  )}
              </div>
            </div>

            {/* Floor Plan (if available) */}
            {item.floorPlanImage && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {tDual("Планировка объекта", "Нақшаи банақшагирии хона")}
                </h2>
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-96 flex items-center justify-center p-4">
                  <img
                    src={item.floorPlanImage}
                    alt="Floor plan"
                    className="max-h-80 w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Safety & Legal Verification Banner */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                {tDual("Безопасность сделки в Согде", "Бехатарии хариду фурӯш дар Суғд")}
              </div>
              <p className="leading-relaxed">
                {tDual(
                  "Перед совершением сделки рекомендуем лично осмотреть объект, сверить оригиналы правоустанавливающих документов (сертификат БТИ, технический паспорт, справку об отсутствии обременений в нотариате). Не отправляйте предоплату на анонимные счета.",
                  "Пеш аз бастани аҳд тавсия медиҳем, ки иншоотро шахсан аз назар гузаронед ва ҳуҷҷатҳои аслии амволро (Шаҳодатномаи БТИ, шиносномаи техникӣ ва маълумотномаи нотариалӣ)-ро санҷед. Ҳаргиз ба суратҳисобҳои ношинос пешпардохт нагузаронед."
                )}
              </p>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: STICKY CONTACT CARD & INQUIRY */}
          <div className="space-y-6 lg:sticky lg:top-20">
            {/* Seller Contact Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {item.sellerType}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{tDual("Проверенный продавец", "Фурӯшандаи тасдиқшуда")}</span>
                  </div>
                </div>
              </div>

              {/* Phone Button */}
              <div>
                {phoneRevealed ? (
                  <a
                    href={`tel:${rawPhone.replace(/\s/g, "")}`}
                    className="flex items-center justify-center gap-2 w-full h-12 bg-slate-900 hover:bg-black text-white font-mono font-bold text-sm rounded-xl transition-all shadow-sm"
                  >
                    <Phone className="h-4 w-4 text-emerald-400" />
                    {rawPhone}
                  </a>
                ) : (
                  <Button
                    onClick={handleRevealPhone}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm gap-2 cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    {tDual("Показать номер телефона", "Нишон додани рақами телефон")}
                  </Button>
                )}
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${rawWhatsapp}?text=${prefilledWhatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                onClick={handleWhatsappClick}
                className="flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="h-5 w-5" />
                {tDual("Написать в WhatsApp", "Навиштан дар WhatsApp")}
              </a>

              <p className="text-[11px] text-slate-400 text-center">
                {tDual(
                  "Скажите продавцу, что нашли объявление на Maskani.tj",
                  "Ба фурӯшанда гӯед, ки эълонро дар Maskani.tj пайдо кардед"
                )}
              </p>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {tDual("Задать вопрос продавцу", "Савол ба фурӯшанда")}
              </h3>

              {inquirySent ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-xs">{tDual("Заявка отправлена!", "Дархост фиристода шуд!")}</p>
                  <p className="text-[11px] text-emerald-700">
                    {tDual("Продавец свяжется с вами в ближайшее время.", "Фурӯшанда ба наздикӣ бо шумо тамос мегирад.")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {tDual("Ваше имя", "Номи шумо")}
                    </label>
                    <Input
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder={tDual("Например, Фаррух", "Масалан, Фаррух")}
                      className="text-xs h-9 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {tDual("Номер телефона", "Рақами телефон")}
                    </label>
                    <Input
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+992 92 000 0000"
                      className="text-xs h-9 rounded-xl font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {tDual("Сообщение", "Паём")}
                    </label>
                    <Textarea
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder={tDual(
                        "Здравствуйте, когда можно посмотреть квартиру?",
                        "Салом, кай метавонам хонаро бубинам?"
                      )}
                      rows={3}
                      className="text-xs rounded-xl resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full bg-slate-900 hover:bg-black text-white text-xs font-semibold h-10 rounded-xl gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {inquiryLoading
                      ? tDual("Отправка...", "Дар ҳоли фиристодан...")
                      : tDual("Отправить заявку", "Фиристодани дархост")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 5. SIMILAR / RECOMMENDED OBJECTS */}
        {similarItems.length > 0 && (
          <div className="pt-8 border-t border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {tDual("Похожие объявления в Согде", "Эълонҳои монанд дар Суғд")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tDual("Другие предложения в этом же регионе", "Пешниҳодҳои дигар дар ин минтақа")}
                </p>
              </div>
              <Link
                href="/classifieds"
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                {tDual("Смотреть все", "Ҳамаро дидан")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarItems.map((sim) => (
                <Card
                  key={sim.id}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all overflow-hidden group flex flex-col justify-between"
                >
                  <Link
                    href={`/classifieds/classified-${sim.id}`}
                    className="relative h-44 w-full overflow-hidden bg-slate-100 block"
                  >
                    <img
                      src={sim.image}
                      alt={sim.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <Badge className="bg-emerald-600 text-white text-[10px] font-medium">
                        {sim.dealType}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/90 text-slate-800 text-[10px] font-medium">
                        {sim.propertyType}
                      </Badge>
                    </div>
                  </Link>

                  <CardContent className="p-4 space-y-2">
                    <div className="text-base font-bold text-emerald-600">
                      {formatPrice(sim.priceTjs, sim.priceUsd)}
                    </div>
                    <Link href={`/classifieds/classified-${sim.id}`}>
                      <h4 className="font-semibold text-xs text-slate-900 line-clamp-1 hover:text-emerald-600 transition-colors">
                        {sim.title}
                      </h4>
                    </Link>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{sim.city}, {sim.district}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white text-xs">
            <span className="font-semibold">
              {activePhotoIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Center Image with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={activePhoto}
              alt="Fullscreen photo"
              className="max-h-[80vh] max-w-full object-contain rounded-xl select-none"
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
                  }
                  className="absolute left-2 sm:left-6 h-12 w-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 sm:right-6 h-12 w-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {photos.map((p, idx) => (
              <button
                key={p + idx}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`h-14 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  activePhotoIndex === idx
                    ? "border-emerald-500 scale-105"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
