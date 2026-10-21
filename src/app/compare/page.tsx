"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  Trash2,
  Share2,
  Check,
  Plus,
  Building2,
  Home,
  MapPin,
  Phone,
  MessageCircle,
  X,
  Droplet,
  Zap,
  Flame,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCompare } from "@/context/compare-context";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import {
  detectBestMetrics,
  getDifferingRowKeys,
  type CompareRowKey,
  type CompareProperty,
} from "@/lib/compare/compare-store";
import { formatTJS, formatUSD } from "@/lib/currency";

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    compareItems,
    compareCount,
    removeFromCompare,
    clearCompare,
    onlyDifferences,
    setOnlyDifferences,
    maxItems,
  } = useCompare();

  const { currency, formatPrice } = useCurrency();
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  useEffect(() => {
    setMounted(true);
  }, []);

  const bestMetrics = useMemo(() => {
    return detectBestMetrics(compareItems);
  }, [compareItems]);

  const differingKeys = useMemo(() => {
    return getDifferingRowKeys(compareItems);
  }, [compareItems]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const slugs = compareItems.map((c) => c.slug || c.id).join(",");
    const url = `${window.location.origin}/compare?items=${encodeURIComponent(slugs)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: isTg ? "Муқоисаи амвол дар Maskani.tj" : "Сравнение объектов на Maskani.tj",
          text: isTg
            ? `Муқоисаи ${compareCount} амвол дар вилояти Суғд`
            : `Сравнение ${compareCount} объектов недвижимости в Согдийской области`,
          url,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-lg mx-auto mb-4" />
        <div className="h-64 max-w-4xl bg-slate-100 animate-pulse rounded-2xl mx-auto" />
      </div>
    );
  }

  // Empty state
  if (compareCount === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            {isTg ? "Асосӣ" : "Главная"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">
            {isTg ? "Муқоисаи амвол" : "Сравнение объектов"}
          </span>
        </nav>

        <Card className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-14 text-center shadow-sm">
          <div className="h-20 w-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5 border border-blue-100 shadow-inner">
            <ArrowLeftRight className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            {isTg ? "Рӯйхати муқоиса холӣ аст" : "В сравнении пока ничего нет"}
          </h1>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
            {isTg
              ? "Ҳангоми тамошои эълонҳо тугмаи муқоисаро (⇄) пахш намоед. Шумо метавонед то 4 амволро аз рӯи нарх, масоҳат ва коммуникатсияҳо (об, барқ, хауз) якҷоя муқоиса намоед."
              : "Нажимайте на значок сравнения (⇄) на карточках или странице объекта в каталоге. Вы сможете одновременно сопоставить до 4 вариантов по ценам, планировкам и согдийским коммуникациям."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/classifieds">
              <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm gap-2 cursor-pointer">
                <Home className="h-4 w-4" />
                <span>{isTg ? "Ба феҳристи амвол" : "Перейти в каталог недвижимости"}</span>
              </Button>
            </Link>
            <Link href="/#new-buildings">
              <Button
                variant="outline"
                className="h-11 px-6 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm gap-2 cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-emerald-600" />
                <span>{isTg ? "Новостройкаҳо" : "Новостройки от застройщиков"}</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Row visibility helper: checks if row should be shown when onlyDifferences is enabled
  const shouldShowRow = (key: CompareRowKey): boolean => {
    if (!onlyDifferences) return true;
    return differingKeys.has(key);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          {isTg ? "Асосӣ" : "Главная"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/classifieds" className="hover:text-emerald-600 transition-colors">
          {isTg ? "Амвол" : "Каталог"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">
          {isTg ? "Муқоиса" : "Сравнение"}
        </span>
      </nav>

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isTg ? "Муқоисаи амволи ғайриманқул" : "Сравнение объектов недвижимости"}
            </h1>
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
              {compareCount} / {maxItems}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isTg
              ? "Нархҳо, масоҳат, ошёна ва шабакаҳои коммуналии вилояти Суғдро якҷоя санҷед"
              : "Наглядное сопоставление стоимости, планировок и ключевых коммуникаций Согда"}
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Difference Switch */}
          <div className="flex items-center gap-2 bg-slate-100/90 rounded-xl px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-800">
            <Switch
              size="sm"
              checked={onlyDifferences}
              onCheckedChange={setOnlyDifferences}
              id="diff-toggle"
            />
            <label htmlFor="diff-toggle" className="cursor-pointer select-none">
              {isTg ? "Танҳо фарқиятҳо" : "Только различия"}
            </label>
            {onlyDifferences && (
              <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-1.5 py-0.5 rounded-md">
                {differingKeys.size}
              </span>
            )}
          </div>

          {/* Share Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="h-9 px-3 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">{isTg ? "Нусхабардорӣ шуд!" : "Скопировано!"}</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-600" />
                <span>{isTg ? "Пайванд" : "Поделиться"}</span>
              </>
            )}
          </Button>

          {/* Clear All */}
          <Button
            size="sm"
            variant="outline"
            onClick={clearCompare}
            className="h-9 px-3 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isTg ? "Тоза кардан" : "Очистить всё"}</span>
          </Button>

          {/* Add more button */}
          {compareCount < maxItems && (
            <Link href="/classifieds">
              <Button
                size="sm"
                className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isTg ? "Иловаи дигар" : "Добавить объект"}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="mt-6 overflow-x-auto pb-8">
        <div
          className="grid gap-4 min-w-[720px]"
          style={{
            gridTemplateColumns: `220px repeat(${compareItems.length}, minmax(240px, 1fr)) ${
              compareCount < maxItems ? "minmax(200px, 240px)" : ""
            }`,
          }}
        >
          {/* Header Row: Labels column */}
          <div className="flex flex-col justify-end pb-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>{isTg ? "Амволҳои муқоисашаванда" : "Объекты в сравнении"}</span>
          </div>

          {/* Header Row: Property Cards */}
          {compareItems.map((item) => {
            const isLowestPrice = bestMetrics.lowestPriceId === item.id;
            const isLowestPpm = bestMetrics.lowestPricePerMeterId === item.id;
            const isLargestArea = bestMetrics.largestAreaId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col justify-between relative group hover:border-emerald-300 transition-all"
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCompare(item.id)}
                  title={isTg ? "Тоза кардан аз муқоиса" : "Удалить из сравнения"}
                  aria-label="Remove"
                  className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-slate-900/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div>
                  {/* Thumbnail Image */}
                  <Link href={`/classifieds/${item.slug}`} className="block relative h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">
                        {isTg ? item.dealTypeTg || "Фурӯш" : item.dealType}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/90 text-slate-900 text-[10px] font-medium backdrop-blur-xs">
                        {isTg ? item.propertyTypeTg || "Хонадон" : item.propertyType}
                      </Badge>
                    </div>
                  </Link>

                  {/* Badges for Best Values */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {isLowestPrice && (
                      <Badge className="bg-emerald-500/15 text-emerald-700 border border-emerald-300/80 text-[10px] font-bold">
                        ★ {isTg ? "Нархи беҳтарин" : "Лучшая цена"}
                      </Badge>
                    )}
                    {isLowestPpm && (
                      <Badge className="bg-blue-500/15 text-blue-700 border border-blue-300/80 text-[10px] font-bold">
                        ✦ {isTg ? "Барои 1 м² арзон" : "Выгодный м²"}
                      </Badge>
                    )}
                    {isLargestArea && (
                      <Badge className="bg-purple-500/15 text-purple-700 border border-purple-300/80 text-[10px] font-bold">
                        ⚑ {isTg ? "Масоҳати калонтарин" : "Макс. площадь"}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/classifieds/${item.slug}`}>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
                      {isTg && item.titleTg ? item.titleTg : item.title}
                    </h3>
                  </Link>

                  {/* Location */}
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium truncate">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {item.city}, {item.district}
                    </span>
                  </p>

                  {/* Price Block */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-lg font-extrabold text-emerald-600">
                      {formatPrice(item.priceTjs, item.priceUsd)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {currency === "TJS" ? formatUSD(item.priceUsd) : formatTJS(item.priceTjs)}
                    </div>
                  </div>
                </div>

                {/* Quick actions: Phone & WhatsApp */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                  <a
                    href={`tel:${item.phone.replace(/\s+/g, "")}`}
                    className="flex-1 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-emerald-200/60"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isTg ? "Занг" : "Звонок"}</span>
                  </a>
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition-colors shrink-0 shadow-xs"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Add more slot card if < 4 */}
          {compareCount < maxItems && (
            <Link
              href="/classifieds"
              className="border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
            >
              <div className="h-12 w-12 rounded-full bg-white group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-600 border border-slate-200 flex items-center justify-center mb-3 transition-colors shadow-xs">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-bold text-sm text-slate-700 group-hover:text-emerald-700 mb-1">
                {isTg ? "Амволи дигарро илова кунед" : "Добавить объект"}
              </span>
              <span className="text-xs text-slate-400 max-w-[150px]">
                {isTg
                  ? `Боз ${maxItems - compareCount} ҷой барои муқоиса боқӣ монд`
                  : `Осталось слотов: ${maxItems - compareCount}`}
              </span>
            </Link>
          )}

          {/* ======================================================== */}
          {/* SECTION 1: СТОИМОСТЬ И ФИНАНСЫ                          */}
          {/* ======================================================== */}
          <SectionHeader
            title={isTg ? "Нарх ва шартҳои молиявӣ" : "Стоимость и условия"}
            span={compareItems.length + (compareCount < maxItems ? 2 : 1)}
          />

          {shouldShowRow("price") && (
            <TableRow
              label={isTg ? "Нархи умумӣ" : "Общая стоимость"}
              items={compareItems}
              render={(item) => (
                <div className="font-bold text-slate-900 text-sm">
                  {formatPrice(item.priceTjs, item.priceUsd)}
                  <span className="block text-[11px] text-slate-400 font-normal font-mono">
                    {currency === "TJS" ? formatUSD(item.priceUsd) : formatTJS(item.priceTjs)}
                  </span>
                </div>
              )}
            />
          )}

          {shouldShowRow("pricePerMeter") && (
            <TableRow
              label={isTg ? "Нарх барои 1 м²" : "Цена за 1 м²"}
              items={compareItems}
              render={(item) => (
                <div className="font-bold text-slate-900 text-sm">
                  {currency === "USD"
                    ? `${formatUSD(item.pricePerMeterUsd)} / м²`
                    : `${formatTJS(item.pricePerMeterTjs)} / м²`}
                  {bestMetrics.lowestPricePerMeterId === item.id && (
                    <span className="block text-[10px] text-blue-600 font-semibold">
                      ★ {isTg ? "Аз ҳама мусоид" : "Выгоднее всего"}
                    </span>
                  )}
                </div>
              )}
            />
          )}

          {shouldShowRow("isNegotiable") && (
            <TableRow
              label={isTg ? "Савдо мешавад" : "Торг"}
              items={compareItems}
              render={(item) => (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    item.isNegotiable
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.isNegotiable
                    ? isTg
                      ? "Савдо мешавад"
                      : "Торг уместен"
                    : isTg
                    ? "Бе савдо"
                    : "Без торга"}
                </span>
              )}
            />
          )}

          {shouldShowRow("propertyType") && (
            <TableRow
              label={isTg ? "Навъи аҳд" : "Тип сделки"}
              items={compareItems}
              render={(item) => (
                <span className="text-xs font-medium text-slate-800">
                  {isTg ? item.dealTypeTg || "Фурӯш" : item.dealType}
                </span>
              )}
            />
          )}

          {/* ======================================================== */}
          {/* SECTION 2: ПАРАМЕТРЫ ПОМЕЩЕНИЯ                          */}
          {/* ======================================================== */}
          <SectionHeader
            title={isTg ? "Параметрҳои манзил" : "Параметры и планировка"}
            span={compareItems.length + (compareCount < maxItems ? 2 : 1)}
          />

          {shouldShowRow("area") && (
            <TableRow
              label={isTg ? "Масоҳати умумӣ" : "Общая площадь"}
              items={compareItems}
              render={(item) => (
                <div className="font-extrabold text-slate-900 text-sm">
                  {item.area} м²
                  {bestMetrics.largestAreaId === item.id && (
                    <span className="block text-[10px] text-purple-600 font-semibold">
                      ★ {isTg ? "Бузургтарин" : "Наибольшая"}
                    </span>
                  )}
                </div>
              )}
            />
          )}

          {shouldShowRow("rooms") && (
            <TableRow
              label={isTg ? "Ҳуҷраҳо" : "Комнат"}
              items={compareItems}
              render={(item) => (
                <span className="font-semibold text-slate-900 text-xs">
                  {isTg ? `${item.rooms} ҳуҷрагӣ` : `${item.rooms}-комнатная`}
                </span>
              )}
            />
          )}

          {shouldShowRow("floor") && (
            <TableRow
              label={isTg ? "Ошёна" : "Этаж"}
              items={compareItems}
              render={(item) => (
                <span className="text-xs font-medium text-slate-800">
                  {item.floor || "-"}
                </span>
              )}
            />
          )}

          {shouldShowRow("renovation") && (
            <TableRow
              label={isTg ? "Ҳолати таъмир" : "Ремонт"}
              items={compareItems}
              render={(item) => (
                <span className="text-xs font-medium text-slate-800">
                  {item.renovation || (isTg ? "Бо таъмир" : "С ремонтом")}
                </span>
              )}
            />
          )}

          {shouldShowRow("buildingType") && (
            <TableRow
              label={isTg ? "Навъи сохтмон" : "Тип постройки"}
              items={compareItems}
              render={(item) => (
                <span className="text-xs font-medium text-slate-800">
                  {item.buildingType || (isTg ? "Хиштӣ / Монолит" : "Кирпич / Монолит")}
                </span>
              )}
            />
          )}

          {/* ======================================================== */}
          {/* SECTION 3: КОММУНИКАЦИИ И СПЕЦИФИКА СОГДА               */}
          {/* ======================================================== */}
          <SectionHeader
            title={isTg ? "Шабакаҳои коммуналии Суғд" : "Коммуникации Согда"}
            span={compareItems.length + (compareCount < maxItems ? 2 : 1)}
          />

          {shouldShowRow("hasCityWater") && (
            <TableRow
              label={isTg ? "Оби шаҳрӣ (доимӣ)" : "Городская вода (постоянная)"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.hasCityWater)}
                  labelYes={isTg ? "Пайваст аст" : "Есть (постоянная)"}
                  labelNo={isTg ? "Аз рӯи ҷадвал" : "По графику / Нет"}
                  icon={<Droplet className="h-3.5 w-3.5 text-blue-500" />}
                />
              )}
            />
          )}

          {shouldShowRow("hasWaterHauz") && (
            <TableRow
              label={isTg ? "Ҳавзи об (резервуар)" : "Водяной хауз / резервуар"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.hasWaterHauz)}
                  labelYes={isTg ? "Ҳавзи шахсӣ ҳаст" : "Имеется хауз"}
                  labelNo={isTg ? "Ҳавз нест" : "Отсутствует"}
                  icon={<Droplet className="h-3.5 w-3.5 text-teal-500" />}
                />
              )}
            />
          )}

          {shouldShowRow("hasElectricity") && (
            <TableRow
              label={isTg ? "Барқ (3-фаза)" : "3-фазное электричество"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.hasElectricity)}
                  labelYes={isTg ? "3-фаза ҳаст" : "3-фазное (стабильное)"}
                  labelNo={isTg ? "Якфазагӣ" : "Стандартное 220V"}
                  icon={<Zap className="h-3.5 w-3.5 text-amber-500" />}
                />
              )}
            />
          )}

          {shouldShowRow("hasHeating") && (
            <TableRow
              label={isTg ? "Гармидиҳӣ" : "Отопление"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.hasHeating)}
                  labelYes={isTg ? "Гармидиҳӣ ҳаст" : "Автономное / котел"}
                  labelNo={isTg ? "Нест" : "Отсутствует"}
                  icon={<Flame className="h-3.5 w-3.5 text-red-500" />}
                />
              )}
            />
          )}

          {shouldShowRow("hasSewerage") && (
            <TableRow
              label={isTg ? "Канализатсия" : "Канализация"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.hasSewerage)}
                  labelYes={isTg ? "Шабакаи марказӣ" : "Центральная"}
                  labelNo={isTg ? "Септик / Маҳаллӣ" : "Септик / Выгребная"}
                  icon={<Layers className="h-3.5 w-3.5 text-slate-500" />}
                />
              )}
            />
          )}

          {shouldShowRow("isFurnished") && (
            <TableRow
              label={isTg ? "Мебел ва таҷҳизот" : "Мебель и техника"}
              items={compareItems}
              render={(item) => (
                <UtilityBadge
                  has={Boolean(item.isFurnished)}
                  labelYes={isTg ? "Бо мебел" : "С мебелью"}
                  labelNo={isTg ? "Бе мебел" : "Без мебели"}
                  icon={<Sparkles className="h-3.5 w-3.5 text-emerald-500" />}
                />
              )}
            />
          )}

          {/* ======================================================== */}
          {/* SECTION 4: ЛОКАЦИЯ                                      */}
          {/* ======================================================== */}
          <SectionHeader
            title={isTg ? "Макон ва нишона" : "Локация и адрес"}
            span={compareItems.length + (compareCount < maxItems ? 2 : 1)}
          />

          {shouldShowRow("city") && (
            <TableRow
              label={isTg ? "Шаҳр" : "Город"}
              items={compareItems}
              render={(item) => (
                <span className="font-semibold text-slate-900 text-xs">
                  {item.city}
                </span>
              )}
            />
          )}

          {shouldShowRow("district") && (
            <TableRow
              label={isTg ? "Ноҳия / Маҳалла" : "Район / Массив"}
              items={compareItems}
              render={(item) => (
                <span className="text-xs text-slate-800">
                  {item.district}
                </span>
              )}
            />
          )}

          <TableRow
            label={isTg ? "Нишона" : "Ориентир"}
            items={compareItems}
            render={(item) => (
              <span className="text-xs text-slate-600 line-clamp-2">
                {item.landmark || "-"}
              </span>
            )}
          />

          {/* ======================================================== */}
          {/* SECTION 5: ПРОДАВЕЦ                                     */}
          {/* ======================================================== */}
          <SectionHeader
            title={isTg ? "Фурӯшанда ва тамос" : "Продавец и контакты"}
            span={compareItems.length + (compareCount < maxItems ? 2 : 1)}
          />

          {shouldShowRow("sellerType") && (
            <TableRow
              label={isTg ? "Навъи фурӯшанда" : "Тип продавца"}
              items={compareItems}
              render={(item) => (
                <Badge variant="outline" className="text-xs font-medium border-slate-300">
                  {item.sellerType}
                </Badge>
              )}
            />
          )}

          <TableRow
            label={isTg ? "Тамос" : "Связь"}
            items={compareItems}
            render={(item) => (
              <div className="flex flex-col gap-1.5">
                <a
                  href={`tel:${item.phone.replace(/\s+/g, "")}`}
                  className="font-mono text-xs font-semibold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1"
                >
                  <Phone className="h-3 w-3 text-emerald-600" />
                  <span>{item.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] font-medium flex items-center gap-1"
                >
                  <MessageCircle className="h-3 w-3 text-emerald-600" />
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Micro-Components for Comparison Layout
// ----------------------------------------------------------------------

function SectionHeader({ title, span }: { title: string; span: number }) {
  return (
    <div
      className="bg-slate-100/90 font-bold text-xs uppercase tracking-wider text-slate-700 px-3.5 py-2 rounded-xl mt-4 border border-slate-200/70"
      style={{ gridColumn: `1 / span ${span}` }}
    >
      {title}
    </div>
  );
}

function TableRow({
  label,
  items,
  render,
}: {
  label: string;
  items: CompareProperty[];
  render: (item: CompareProperty) => React.ReactNode;
}) {
  return (
    <>
      {/* Parameter label cell */}
      <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-50/70 rounded-xl px-3 py-2.5 border border-slate-100">
        <span>{label}</span>
      </div>

      {/* Item cells */}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center bg-white rounded-xl px-3 py-2.5 border border-slate-200/70 shadow-2xs"
        >
          {render(item)}
        </div>
      ))}
    </>
  );
}

function UtilityBadge({
  has,
  labelYes,
  labelNo,
  icon,
}: {
  has: boolean;
  labelYes: string;
  labelNo: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {icon}
      <span
        className={`font-medium ${
          has ? "text-slate-900 font-semibold" : "text-slate-400"
        }`}
      >
        {has ? labelYes : labelNo}
      </span>
    </div>
  );
}
