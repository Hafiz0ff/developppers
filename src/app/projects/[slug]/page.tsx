"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  INITIAL_PROJECTS,
  INITIAL_DEVELOPERS,
  INITIAL_UNITS,
  UnitData,
  generateUnitsForAnyProject,
} from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { Chessboard } from "@/components/modules/chessboard";
import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/ui/shader-background";
import { DeveloperAvatar } from "@/components/ui/developer-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectEngagementHeaderPill } from "@/components/modules/project-engagement-pills";
import { ProjectVisualShowcase } from "@/components/modules/project-visual-showcase";
import { useProjectAnalytics } from "@/hooks/use-project-analytics";
import { ProjectParkingSection } from "@/components/modules/projects/project-parking-section";
import { ProjectStorageSection } from "@/components/modules/projects/project-storage-section";
import { ParkingChessboardModal } from "@/components/modules/projects/parking-chessboard-modal";
import { StorageChessboardModal } from "@/components/modules/projects/storage-chessboard-modal";
import { ProjectDocumentsSection } from "@/components/modules/projects/project-documents-section";
import { InteractiveMapWrapper } from "@/components/modules/interactive-map-wrapper";
import { formatNewBuildingPricePerMeter, getPricePerMeterLabel } from "@/lib/pricing/new-building-price";

import {
  Building2,
  MapPin,
  Calendar,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Layers,
  Sparkles,
  Paintbrush,
  Navigation,
  Compass,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { generateYandexMapsRouteUrl, generateGoogleMapsUrl } from "@/lib/geo-utils";

export default function PublicProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice, currency } = useCurrency();
  const { language, t, tDual } = useLanguage();

  const project =
    INITIAL_PROJECTS.find((p) => p.slug === slug) || INITIAL_PROJECTS[0];

  const developer =
    INITIAL_DEVELOPERS.find((d) => d.id === project.developerId) ||
    INITIAL_DEVELOPERS[0];

  const displayName = language === "tg" && project.nameTg ? project.nameTg : project.name;
  const displayDesc = language === "tg" && project.descriptionTg ? project.descriptionTg : project.description;
  const displayAddress = language === "tg" && project.addressTg ? project.addressTg : project.address;
  const displayLandmark = language === "tg" && project.landmarkTg ? project.landmarkTg : project.landmark;
  const displayAmenities = language === "tg" && project.amenitiesTg ? project.amenitiesTg : project.amenities;

  const pricePerMeterFormatted = formatNewBuildingPricePerMeter({
    pricePerMeterTjs: project.minPricePerMeterTjs,
    pricePerMeterUsd: project.minPricePerMeterUsd,
    totalPriceTjs: project.minTotalPriceTjs,
    totalPriceUsd: project.minTotalPriceUsd,
    currency,
    language,
  });

  const finishingLabels: Record<string, string> = {
    rough: tDual("Черновая отделка", "Пардози аввалия (қуттӣ)"),
    pre_finishing: tDual("Предчистовая отделка (White box)", "Пардози пешакӣ (қуттии сафед)"),
    turnkey: tDual("Чистовая под ключ", "Таъмири пурра («калид дар даст»)"),
  };

  const { isFavorite, toggleFavorite } = useProjectAnalytics(project.slug, true);
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);

  const [units, setUnits] = useState<UnitData[]>(() => {
    return generateUnitsForAnyProject(project);
  });

  // Сбор всех доступных характеристик с фильтрацией пустых значений
  const rawSpecs: Array<{
    label: string;
    value: string | number | null | undefined;
    highlight?: boolean;
  }> = [
    {
      label: tDual("Срок сдачи", "Муҳлати супоридан"),
      value:
        project.deadlineQuarter && project.deadlineYear
          ? language === "tg"
            ? `семоҳаи ${project.deadlineQuarter}-и с. ${project.deadlineYear}`
            : `${project.deadlineQuarter} кв. ${project.deadlineYear} г.`
          : null,
    },
    {
      label: tDual("Этажность", "Шумораи ошёнаҳо"),
      value: project.floorsCount
        ? language === "tg"
          ? `${project.floorsCount} ошёна`
          : `${project.floorsCount} этажей`
        : null,
    },
    {
      label: tDual("Секций (подъездов)", "Бахшҳо (даромадгоҳҳо)"),
      value: project.sectionsCount
        ? language === "tg"
          ? `${project.sectionsCount} бахш`
          : `${project.sectionsCount} секции`
        : null,
    },
    {
      label: tDual("Высота потолков", "Баландии шифт"),
      value: project.ceilingHeight ? `${project.ceilingHeight} м` : null,
    },
    {
      label: tDual("Конструкция", "Сохтори бино"),
      value: project.constructionType
        ? language === "tg"
          ? project.constructionType.replace("Монолитный каркас", "Каркаси монолитӣ").replace("кирпичное заполнение", "пуркунии ғиштӣ")
          : project.constructionType
        : null,
    },
    {
      label: tDual("Сейсмостойкость", "Муқовимат ба заминларза"),
      value: tDual("До 9 баллов", "То 9 балл"),
      highlight: true,
    },
    {
      label: tDual("Площадь участка", "Масоҳати қитъа"),
      value: project.landArea || null,
    },
    {
      label: tDual("Материал стен", "Масолеҳи деворҳо"),
      value: project.wallMaterial
        ? language === "tg"
          ? project.wallMaterial.replace("Обожжённый кирпич", "Ғишти пухта").replace("газоблок", "газоблок")
          : project.wallMaterial
        : null,
    },
    {
      label: tDual("Фасад", "Намуди фасад"),
      value: project.facade
        ? language === "tg"
          ? project.facade.replace("Вентилируемый керамогранит", "Керамогранити шамолдиҳанда").replace("фиброцементные панели", "панелҳои фибросементӣ")
          : project.facade
        : null,
    },
    {
      label: tDual("Кадастровый номер", "Рақами кадастрӣ"),
      value: project.cadastralNumber || null,
    },
    ...(project.customBuildingFeatures || []).map((cf) => ({
      label: cf.title,
      value: cf.value,
      highlight: false,
    })),
  ];

  const buildingSpecs = rawSpecs.filter(
    (item): item is { label: string; value: string | number; highlight?: boolean } =>
      item.value !== null &&
      item.value !== undefined &&
      String(item.value).trim() !== ""
  );

  return (
    <div className="pb-24 space-y-10">
      {/* BREADCRUMB & BACK BUTTON */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {tDual("Назад на главную", "Бозгашт ба саҳифаи аслӣ")}
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              {tDual("Поделиться", "Мубодила кардан")}
            </Button>
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={toggleFavorite}
              className={`h-8 text-xs gap-1.5 transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "hover:text-rose-600"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-white" : ""}`} />
              {isFavorite ? tDual("В избранном", "Дар баргузидаҳо") : tDual("В избранное", "Ба баргузидаҳо")}
            </Button>
          </div>
        </div>
      </div>

      {/* HERO SECTION: TITLE, 30-DAY STATS, PRICING & VISUAL SHOWCASE */}
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                {project.status === "under_construction"
                  ? tDual("Строится", "Дар ҳоли сохтмон")
                  : project.status === "ready"
                  ? tDual("Сдан", "Ба истифода дода шудааст")
                  : tDual("Проектирование", "Лоиҳакашӣ")}
              </Badge>
              <Badge variant="secondary" className="font-semibold text-xs">
                {project.buildingClass === "business"
                  ? tDual("Бизнес-класс", "Синфи тиҷоратӣ (Бизнес)")
                  : project.buildingClass === "comfort"
                  ? tDual("Комфорт", "Синфи бароҳат (Комфорт)")
                  : project.buildingClass === "premium"
                  ? tDual("Премиум", "Синфи аъло (Премиум)")
                  : project.buildingClass}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <Link
                href={`/developers/${developer.slug}`}
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Building2 className="h-3.5 w-3.5" />
                {developer.name}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {displayName}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {displayAddress} ({displayLandmark})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            {/* 30-Day Activity Stats (Section 3.1: Vertical column alongside price) */}
            <ProjectEngagementHeaderPill slug={project.slug} autoRecordView={true} />

            {/* Pricing Highlight Card */}
            <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-sm text-left shrink-0 flex flex-col justify-center min-w-[240px]">
              <div className="text-xs text-muted-foreground">{tDual("Стоимость квартир:", "Нархи хонадонҳо:")}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 sm:text-right">
                {tDual("от", "аз")} {formatPrice(project.minTotalPriceTjs, project.minTotalPriceUsd)}
              </div>
              {pricePerMeterFormatted && (
                <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground font-normal">
                    {getPricePerMeterLabel(language)}
                  </span>
                  <span className="font-bold text-foreground tabular-nums text-right">
                    {pricePerMeterFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* APPLE-STYLE VISUAL SHOWCASE & 6D NAVIGATOR (Sections 4 & 5) */}
        <ProjectVisualShowcase
          projectName={displayName}
          coverImageUrl={project.coverImageUrl}
          images={project.images}
          installmentMonths={project.installmentMonths}
          installmentDownPaymentPercent={project.installmentDownPaymentPercent}
          units={units}
          developerContact={{
            phone: developer.phone,
            whatsapp: developer.whatsapp,
          }}
          onSelectUnitMode={() => {
            document.getElementById("chessboard-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>

      {/* SPECS & KEY ADVANTAGES */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                {tDual("О жилом комплексе", "Дар бораи маҷмааи истиқоматӣ")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {displayDesc}
              </p>
            </div>

            {/* Specifications Grid */}
            {buildingSpecs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground">
                  {tDual("Характеристики дома", "Мушаххасоти бино")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {buildingSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-card border space-y-1"
                    >
                      <span className="text-muted-foreground text-[11px] block truncate" title={spec.label}>
                        {spec.label}:
                      </span>
                      <strong
                        className={`text-xs block break-words ${
                          spec.highlight
                            ? "text-emerald-600 font-bold"
                            : "text-foreground font-semibold"
                        }`}
                      >
                        {spec.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finishing & Fit-out Block */}
            {(project.finishing || (project.finishingFeatures && project.finishingFeatures.length > 0)) && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-base font-bold text-foreground">
                      {tDual("Отделка и комплектация", "Пардоз ва таҷҳизонидан")}
                    </h3>
                  </div>
                  {project.finishing && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs px-2.5 py-1 font-medium"
                    >
                      {finishingLabels[project.finishing] || project.finishing}
                    </Badge>
                  )}
                </div>

                {project.finishingFeatures && project.finishingFeatures.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {project.finishingFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="p-4 rounded-xl bg-card border border-border/80 hover:border-emerald-500/40 transition-colors space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">
                              <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <h4
                              className="text-xs font-bold text-foreground line-clamp-1"
                              title={feature.title}
                            >
                              {feature.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      {tDual("Стандарт базовой отделки:", "Стандарти пардози асосӣ:")}{" "}
                      <strong className="text-foreground">
                        {project.finishing ? finishingLabels[project.finishing] || project.finishing : tDual("По запросу", "Мувофиқи дархост")}
                      </strong>
                      {tDual(". Подробности уточняйте в отделе продаж застройщика.", ". Тафсилотро аз шуъбаи фурӯши сохтмончӣ дақиқ кунед.")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Amenities Pills */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">
                {tDual("Удобства и инфраструктура", "Имкониятҳо ва инфрасохтор")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {displayAmenities.map((am) => (
                  <div
                    key={am}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {am}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mini-Map Section */}
            {project.coordinates?.lat && project.coordinates?.lng && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {tDual("Расположение на карте", "Мавқеи ҷойгиршавӣ дар харита")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {project.address} · {project.district}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={generateYandexMapsRouteUrl(
                        project.coordinates.lat,
                        project.coordinates.lng
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-red-500" />
                      <span>{tDual("Маршрут в Яндекс", "Хатсайр дар Яндекс")}</span>
                    </a>
                    <Link
                      href={`/map?city=${project.city}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{tDual("На карте Согда", "Дар харитаи Суғд")}</span>
                    </Link>
                  </div>
                </div>

                <div className="h-72 w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                  <InteractiveMapWrapper
                    properties={[
                      {
                        id: `project-${project.id}`,
                        slug: project.slug,
                        title: project.name,
                        titleTg: project.nameTg,
                        category: "complex",
                        dealType: "sale",
                        city: project.city,
                        cityTg: project.city === "guliston" ? "Гулистон" : "Хуҷанд",
                        district: project.district,
                        districtTg: project.districtTg,
                        lat: project.coordinates.lat,
                        lng: project.coordinates.lng,
                        priceTjs: project.minTotalPriceTjs,
                        priceUsd: project.minTotalPriceUsd,
                        areaM2: 54,
                        rooms: 1,
                        coverImage: project.coverImageUrl,
                        phone: developer.phone,
                        whatsapp: developer.whatsapp,
                        url: `/projects/${project.slug}`,
                        developerName: developer.name,
                        stage: project.status === "ready" ? "Сдан" : "Строится",
                        isVerified: true,
                      },
                    ]}
                    defaultCenter={[project.coordinates.lat, project.coordinates.lng]}
                    defaultZoom={15}
                    currency={currency}
                    language={language}
                    showControls={true}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DEVELOPER CONTACT CARD & INSTALLMENT CALCULATOR */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4 border-emerald-500/30">
              <div className="flex items-center gap-3">
                <DeveloperAvatar
                  name={developer.name}
                  logoUrl={developer.logoUrl}
                  size="md"
                />

                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {developer.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {tDual("Официальный застройщик в Согдийской области", "Сохтмончии расмӣ дар вилояти Суғд")}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t pt-3">
                <div className="text-[11px] text-muted-foreground">
                  {tDual("Адрес офиса продаж:", "Суроғаи дафтари фурӯш:")}
                </div>
                <div className="font-medium text-foreground">
                  {developer.officeAddress}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    language === "tg"
                      ? `Салом! Ба ман хариди хонадон дар МИ «${displayName}» писанд омад. Лутфан дар бораи шартҳои пардохти қисм-қисм маълумот диҳед.`
                      : `Здравствуйте! Интересует покупка квартиры в ЖК «${displayName}». Расскажите подробнее об условиях рассрочки.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  {tDual("Консультация в WhatsApp", "Машварат дар WhatsApp")}
                </a>

                <a
                  href={`tel:${developer.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {developer.phone}
                </a>

                {project.coordinates?.lat && project.coordinates?.lng && (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={generateYandexMapsRouteUrl(project.coordinates.lat, project.coordinates.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                      title={tDual("Маршрут в Яндекс.Картах", "Хатсайр дар Харитаи Яндекс")}
                    >
                      <Navigation className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span>{tDual("Яндекс.Карты", "Харитаи Яндекс")}</span>
                    </a>
                    <a
                      href={generateGoogleMapsUrl(project.coordinates.lat, project.coordinates.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                      title={tDual("Маршрут в Google Maps", "Хатсайр дар Google Maps")}
                    >
                      <Compass className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Installment Badge Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border space-y-2 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-emerald-600" />
                {tDual("Беспроцентная рассрочка", "Пардохти қисм-қисми бефоиз")}
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {language === "tg" ? (
                  <>
                    Сохтмончӣ пардохти қисм-қисми бефоизро то{" "}
                    <strong>{project.installmentMonths} моҳ</strong> бе иштироки бонкҳо пешниҳод мекунад. Пешпардохт — аз{" "}
                    <strong>{project.installmentDownPaymentPercent}%</strong>.
                  </>
                ) : (
                  <>
                    Застройщик предоставляет рассрочку на срок до{" "}
                    <strong>{project.installmentMonths} месяцев</strong> без участия банков. Первоначальный взнос — от{" "}
                    <strong>{project.installmentDownPaymentPercent}%</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PARKING & STORAGE MODULES (OPTIONAL & INDEPENDENT) */}
      <ProjectParkingSection
        config={project.parkingConfig}
        spots={project.parkingSpots}
        onSelectSpotClick={() => setIsParkingModalOpen(true)}
      />

      <ProjectStorageSection
        config={project.storageConfig}
        units={project.storageUnits}
        onSelectUnitClick={() => setIsStorageModalOpen(true)}
      />

      {/* PARKING & STORAGE INTERACTIVE CHESSBOARD MODALS */}
      {project.parkingSpots && project.parkingSpots.length > 0 && (
        <ParkingChessboardModal
          isOpen={isParkingModalOpen}
          onClose={() => setIsParkingModalOpen(false)}
          projectName={displayName}
          spots={project.parkingSpots}
          developerContact={{
            phone: developer.phone,
            whatsapp: developer.whatsapp,
          }}
        />
      )}

      {project.storageUnits && project.storageUnits.length > 0 && (
        <StorageChessboardModal
          isOpen={isStorageModalOpen}
          onClose={() => setIsStorageModalOpen(false)}
          projectName={displayName}
          units={project.storageUnits}
          developerContact={{
            phone: developer.phone,
            whatsapp: developer.whatsapp,
          }}
        />
      )}

      {/* INTERACTIVE UNIT CHESSBOARD FOR BUYERS */}
      <section id="chessboard-section" className="container mx-auto px-4 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {tDual("Выбор квартиры", "Интихоби хонадон")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {tDual(`Интерактивная шахматка ЖК «${displayName}»`, `Ҷадвали интерактивии МИ «${displayName}»`)}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {tDual(
                "Выберите этаж и расположение на площадке или отфильтруйте планировки по комнатности и цене",
                "Ошёна ва мавқеиятро дар майдонча интихоб намоед ё нақшаҳоро аз рӯи шумораи ҳуҷраҳо ва нарх филтр кунед"
              )}
            </p>
          </div>
        </div>

        {/* CHESSBOARD COMPONENT */}
        <Chessboard
          units={units}
          projectName={displayName}
          isEditable={false}
          developerContact={{
            phone: developer.phone,
            whatsapp: developer.whatsapp,
          }}
        />
      </section>

      {/* CONSTRUCTION PROGRESS (ХОД СТРОИТЕЛЬСТВА) */}
      {project.constructionProgress.length > 0 && (
        <section className="container mx-auto px-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {tDual("Ход строительства", "Раванди сохтмон")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tDual(
                "Фотоотчеты со строительной площадки",
                "Ҳисоботи аксҳо аз майдони сохтмон"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.constructionProgress.map((item, idx) => (
              <Card key={idx} className="overflow-hidden border p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{item.title}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {item.date}
                  </Badge>
                </div>
                {item.photos[0] && (
                  <div className="h-48 rounded-xl overflow-hidden bg-muted">
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* OFFICIAL PROJECT DOCUMENTS (STRICTLY AFTER CONSTRUCTION PROGRESS) */}
      <ProjectDocumentsSection
        projectName={displayName}
        config={project.documentsConfig}
        documents={project.officialDocuments}
      />
    </div>
  );
}
