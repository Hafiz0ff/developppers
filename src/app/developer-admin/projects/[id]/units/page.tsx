"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { INITIAL_PROJECTS, INITIAL_UNITS, UnitData } from "@/lib/data/mock-db";
import { Chessboard } from "@/components/modules/chessboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUpRight,
  PlusCircle,
  Building2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export default function DeveloperProjectUnitsPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const project =
    INITIAL_PROJECTS.find((p) => p.id === projectId) || INITIAL_PROJECTS[0];

  const [units, setUnits] = useState<UnitData[]>(() => {
    const filtered = INITIAL_UNITS.filter(
      (u) => u.projectId === project.id || u.projectId === project.slug
    );
    return filtered.length > 0 ? filtered : INITIAL_UNITS;
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUpdateStatus = (
    unitId: string,
    newStatus: "available" | "reserved" | "sold"
  ) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status: newStatus } : u))
    );
    const unit = units.find((u) => u.id === unitId);
    setLastUpdated(
      `Статус ${unit?.unitNumber || "квартиры"} изменен на: ${
        newStatus === "available"
          ? "Свободно"
          : newStatus === "reserved"
          ? "Забронировано"
          : "Продано"
      }`
    );
    setTimeout(() => setLastUpdated(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/developer-admin/projects">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                К списку ЖК
              </Button>
            </Link>
            <Badge variant="outline" className="text-xs">
              {project.buildingClass === "business" ? "Бизнес-класс" : project.buildingClass}
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Шахматка квартир: {project.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {project.address} • {project.floorsCount} этажей • {project.sectionsCount} секции
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/projects/${project.slug}`}>
            <Button variant="outline" size="sm" className="text-xs gap-1">
              Витрина для покупателей
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {lastUpdated && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{lastUpdated}</span>
        </div>
      )}

      {/* Info notice about backoffice mode */}
      <div className="bg-card border rounded-xl p-3.5 flex items-start gap-3 text-xs">
        <div className="h-7 w-7 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-foreground">
            Режим управления шахматкой активен:
          </p>
          <p className="text-muted-foreground text-[11px]">
            Кликните на любую квартиру на сетке или в таблице, чтобы мгновенно сменить ее статус (Свободно / Бронь / Продано). Изменения отобразятся покупателям в реальном времени.
          </p>
        </div>
      </div>

      {/* CHESSBOARD COMPONENT IN EDITABLE MODE */}
      <Chessboard
        units={units}
        onUpdateUnitStatus={handleUpdateStatus}
        isEditable={true}
      />
    </div>
  );
}
