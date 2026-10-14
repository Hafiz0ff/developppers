"use client";

import React from "react";
import Link from "next/link";
import { INITIAL_PROJECTS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCurrency } from "@/context/currency-context";
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
  const projects = INITIAL_PROJECTS; // complexes of the current developer

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Жилые комплексы застройщика
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Управление объектами, поэтажными планировками и статусами квартир в Согде
          </p>
        </div>
        <Link href="/developer-admin/projects/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-xs">
            <PlusCircle className="h-4 w-4" />
            Добавить новый ЖК
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => (
          <Card
            key={proj.id}
            className="overflow-hidden border hover:border-emerald-500/50 transition-all p-4 sm:p-5 flex flex-col md:flex-row gap-5"
          >
            {/* Image Preview */}
            <div className="relative md:w-56 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 bg-muted">
              <img
                src={proj.coverImageUrl}
                alt={proj.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 z-10">
                <ProjectCatalogCardBadge slug={proj.slug} />
              </div>
              <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px]">
                {proj.status === "under_construction"
                  ? "Строится"
                  : proj.status === "ready"
                  ? "Сдан"
                  : "Проектирование"}
              </Badge>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {proj.name}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {proj.buildingClass === "business"
                      ? "Бизнес-класс"
                      : proj.buildingClass === "comfort"
                      ? "Комфорт-класс"
                      : proj.buildingClass}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  {proj.address} ({proj.landmark})
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                  <span>
                    Этажность: <strong>{proj.floorsCount} этажей</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Секции: <strong>{proj.sectionsCount} подъезда</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Срок: <strong>{proj.deadlineQuarter} кв. {proj.deadlineYear} г.</strong>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">
                    Рассрочка до {proj.installmentMonths} мес
                  </span>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-muted-foreground">Цена от: </span>
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
                      Шахматка квартир
                    </Button>
                  </Link>

                  <Link href={`/developer-admin/projects/${proj.id}/edit`}>
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                      <Edit className="h-3.5 w-3.5" />
                      Редактировать
                    </Button>
                  </Link>

                  <Link href={`/projects/${proj.slug}`}>
                    <Button size="sm" variant="ghost" className="h-8 text-xs gap-1">
                      Витрина
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
