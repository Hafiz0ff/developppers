"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  INITIAL_PROJECTS,
  INITIAL_DEVELOPERS,
  INITIAL_UNITS,
  UnitData,
} from "@/lib/data/mock-db";
import { useCurrency } from "@/context/currency-context";
import { Chessboard } from "@/components/modules/chessboard";
import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/ui/shader-background";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

export default function PublicProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { formatPrice } = useCurrency();

  const project =
    INITIAL_PROJECTS.find((p) => p.slug === slug) || INITIAL_PROJECTS[0];

  const developer =
    INITIAL_DEVELOPERS.find((d) => d.id === project.developerId) ||
    INITIAL_DEVELOPERS[0];

  const [activeImage, setActiveImage] = useState(project.coverImageUrl);
  const [units, setUnits] = useState<UnitData[]>(INITIAL_UNITS);

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
            Назад на главную
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Поделиться
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              В избранное
            </Button>
          </div>
        </div>
      </div>

      {/* HERO SECTION: TITLE & GALLERY */}
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-600 text-white font-semibold text-xs">
                {project.status === "under_construction"
                  ? "Строится"
                  : project.status === "ready"
                  ? "Сдан"
                  : "Проектирование"}
              </Badge>
              <Badge variant="secondary" className="font-semibold text-xs">
                {project.buildingClass === "business"
                  ? "Бизнес-класс"
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
              {project.name}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              {project.address} ({project.landmark})
            </p>
          </div>

          {/* Pricing Highlight Card */}
          <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-sm text-left lg:text-right shrink-0">
            <div className="text-xs text-muted-foreground">Стоимость квартир:</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              от {formatPrice(project.minTotalPriceTjs, project.minTotalPriceUsd)}
            </div>
            <div className="text-xs font-semibold text-foreground mt-0.5">
              от {formatPrice(project.minPricePerMeterTjs, project.minPricePerMeterUsd)} / м²
            </div>
          </div>
        </div>

        {/* PHOTO GALLERY WITH LIGHT LEAK SHADER GLOW */}
        <div className="relative space-y-3">
          {/* Ambient Light Leak Aura behind luxury project hero */}
          <ShaderBackground
            variant="light-leak"
            speed={0.4}
            intensity={0.45}
            className="absolute -inset-3 sm:-inset-6 rounded-3xl blur-2xl opacity-60 dark:opacity-30 -z-10 pointer-events-none"
          />

          <div className="relative h-[360px] sm:h-[480px] w-full rounded-2xl overflow-hidden border bg-muted shadow-md">
            <img
              src={activeImage}
              alt={project.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Subtle soft organic light sheen overlay */}
            <ShaderBackground
              variant="light-leak"
              speed={0.3}
              intensity={0.25}
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
            />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs z-10">
              <Percent className="h-3.5 w-3.5 text-emerald-600" />
              Рассрочка от застройщика до {project.installmentMonths} месяцев (Взнос от {project.installmentDownPaymentPercent}%)
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {project.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === img
                    ? "border-emerald-600 shadow-sm"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Фото ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SPECS & KEY ADVANTAGES */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                О жилом комплексе
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">
                Характеристики дома
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Срок сдачи:</span>
                  <strong className="text-foreground text-xs">
                    {project.deadlineQuarter} кв. {project.deadlineYear} г.
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Этажность:</span>
                  <strong className="text-foreground text-xs">
                    {project.floorsCount} этажей
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Секций (подъездов):</span>
                  <strong className="text-foreground text-xs">
                    {project.sectionsCount} секции
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Высота потолков:</span>
                  <strong className="text-foreground text-xs">
                    {project.ceilingHeight} м
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Конструкция:</span>
                  <strong className="text-foreground text-xs">
                    {project.constructionType}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-card border space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Сейсмостойкость:</span>
                  <strong className="text-foreground text-xs text-emerald-600">
                    До 9 баллов
                  </strong>
                </div>
              </div>
            </div>

            {/* Amenities Pills */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">
                Удобства и инфраструктура
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((am) => (
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
          </div>

          {/* DEVELOPER CONTACT CARD & INSTALLMENT CALCULATOR */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4 border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden border bg-muted shrink-0">
                  <img
                    src={developer.logoUrl}
                    alt={developer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {developer.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Официальный застройщик в Худжанде
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t pt-3">
                <div className="text-[11px] text-muted-foreground">
                  Адрес офиса продаж:
                </div>
                <div className="font-medium text-foreground">
                  {developer.officeAddress}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Здравствуйте! Интересует покупка квартиры в ЖК «${project.name}» (г. Худжанд). Расскажите подробнее об условиях рассрочки.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Консультация в WhatsApp
                </a>

                <a
                  href={`tel:${developer.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border hover:bg-muted font-semibold text-xs transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {developer.phone}
                </a>
              </div>
            </Card>

            {/* Installment Badge Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border space-y-2 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-emerald-600" />
                Беспроцентная рассрочка
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Застройщик предоставляет рассрочку на срок до{" "}
                <strong>{project.installmentMonths} месяцев</strong> без участия банков. Первоначальный взнос — от{" "}
                <strong>{project.installmentDownPaymentPercent}%</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE UNIT CHESSBOARD FOR BUYERS */}
      <section className="container mx-auto px-4 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Выбор квартиры
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Интерактивная шахматка ЖК «{project.name}»
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Выберите этаж и расположение на площадке или отфильтруйте планировки по комнатности и цене
            </p>
          </div>
        </div>

        {/* CHESSBOARD COMPONENT */}
        <Chessboard
          units={units}
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
              Ход строительства
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Фотоотчеты со строительной площадки в 19 микрорайоне Худжанда
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
    </div>
  );
}
