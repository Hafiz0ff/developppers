"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import {
  PlusCircle,
  Grid3X3,
  Edit,
  ArrowUpRight,
  MapPin,
  Building2,
  Calendar,
  Percent,
} from "lucide-react";
import { ProjectCatalogCardBadge } from "@/components/modules/project-engagement-pills";

export default function DeveloperProjectsPage() {
  const { formatPrice } = useCurrency();
  const { language, tDual } = useLanguage();
  const [selectedDevId, setSelectedDevId] = useState<string>("all");

  const projects =
    selectedDevId === "all"
      ? INITIAL_PROJECTS
      : INITIAL_PROJECTS.filter((p) => p.developerId === selectedDevId);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            {tDual("Жилые комплексы застройщика", "Маҷмааҳои истиқоматии сохтмончӣ")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {tDual(
              "Управление объектами, поэтажными планировками и статусами квартир в Согде",
              "Идоракунии объектҳо, тарҳи хонаҳо ва ҳолати хонадонҳо дар Суғд"
            )}
          </p>
        </div>
        <Link href="/developer-admin/projects/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-xs">
            <PlusCircle className="h-4 w-4" />
            {tDual("Добавить новый ЖК", "Иловаи МИ нав")}
          </Button>
        </Link>
      </div>

      {/* Developer Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          onClick={() => setSelectedDevId("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedDevId === "all"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {tDual("Все комплексы", "Ҳамаи маҷмааҳо")} ({INITIAL_PROJECTS.length})
        </button>
        {INITIAL_DEVELOPERS.map((dev) => {
          const count = INITIAL_PROJECTS.filter(
            (p) => p.developerId === dev.id
          ).length;
          return (
            <button
              key={dev.id}
              onClick={() => setSelectedDevId(dev.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedDevId === dev.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {dev.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {projects.map((proj) => {
          const displayName = language === "tg" && proj.nameTg ? proj.nameTg : proj.name;
          const displayAddress = language === "tg" && proj.addressTg ? proj.addressTg : proj.address;
          const displayLandmark = language === "tg" && proj.landmarkTg ? proj.landmarkTg : proj.landmark;

          return (
            <Card
              key={proj.id}
              className="overflow-hidden border hover:border-emerald-500/50 transition-all p-4 sm:p-5 flex flex-col md:flex-row gap-5"
            >
              {/* Image Preview */}
              <div className="relative md:w-56 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-muted">
                <img
                  src={proj.coverImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 z-10">
                  <ProjectCatalogCardBadge slug={proj.slug} />
                </div>
                <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px]">
                  {proj.status === "under_construction"
                    ? tDual("Строится", "Дар ҳоли сохтмон")
                    : proj.status === "ready"
                    ? tDual("Сдан", "Ба истифода дода шуд")
                    : tDual("Проектирование", "Лоиҳакашӣ")}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {displayName}
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      {proj.buildingClass === "business"
                        ? tDual("Бизнес-класс", "Синфи тиҷоратӣ (Бизнес)")
                        : proj.buildingClass === "comfort"
                        ? tDual("Комфорт-класс", "Синфи бароҳат (Комфорт)")
                        : proj.buildingClass}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {displayAddress} ({displayLandmark})
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                    <span>
                      {tDual("Этажность:", "Ошёнаҳо:")} <strong>{proj.floorsCount} {tDual("этажей", "ошёна")}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {tDual("Секции:", "Бахшҳо:")} <strong>{proj.sectionsCount} {tDual("подъезда", "бахш")}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {tDual("Срок:", "Муҳлат:")} <strong>{language === "tg" ? `семоҳаи ${proj.deadlineQuarter}-и с. ${proj.deadlineYear}` : `${proj.deadlineQuarter} кв. ${proj.deadlineYear} г.`}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      {tDual(`Рассрочка до ${proj.installmentMonths} мес`, `Пардохти қисм-қисм то ${proj.installmentMonths} моҳ`)}
                    </span>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-muted-foreground">{tDual("Цена от: ", "Нарх аз: ")}</span>
                    <strong className="text-emerald-600 text-sm">
                      {formatPrice(proj.minTotalPriceTjs, proj.minTotalPriceUsd)}
                    </strong>
                    <span className="text-muted-foreground text-[11px] ml-1">
                      ({formatPrice(proj.minPricePerMeterTjs, proj.minPricePerMeterUsd)} / м²)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/developer-admin/projects/${proj.id}/units`}>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 gap-1.5"
                      >
                        <Grid3X3 className="h-3.5 w-3.5" />
                        {tDual("Шахматка квартир", "Ҷадвали шоҳмотии хонаҳо")}
                      </Button>
                    </Link>

                    <Link href={`/developer-admin/projects/${proj.id}/edit`}>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        {tDual("Редактировать", "Таҳрир кардан")}
                      </Button>
                    </Link>

                    <Link href={`/projects/${proj.slug}`}>
                      <Button size="sm" variant="ghost" className="h-8 text-xs gap-1">
                        {tDual("Витрина", "Витрина")}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
