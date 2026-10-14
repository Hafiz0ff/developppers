"use client";

import React from "react";
import { Eye, Heart } from "lucide-react";
import { useProjectAnalytics } from "@/hooks/use-project-analytics";

interface ProjectEngagementProps {
  slug: string;
  autoRecordView?: boolean;
}

/**
 * Detailed 30-day activity card for project page (/projects/[slug])
 * Rendered alongside the price block according to Section 3.1 of the specification.
 */
export function ProjectEngagementHeaderPill({ slug, autoRecordView = true }: ProjectEngagementProps) {
  const { stats, isFavorite, toggleFavorite } = useProjectAnalytics(slug, autoRecordView);

  return (
    <div className="bg-card border rounded-2xl p-3 sm:p-4 shadow-xs flex items-center gap-4 sm:gap-6 shrink-0">
      {/* 30-day Unique Views */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
          <Eye className="h-4 w-4" />
        </div>
        <div>
          <div className="text-base sm:text-lg font-bold text-foreground leading-tight">
            {stats.viewsMonthCount}
          </div>
          <div className="text-[11px] text-muted-foreground whitespace-nowrap">
            Просмотров за 30 дней
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-border/80" />

      {/* 30-day Favorites with Interactive Click */}
      <button
        type="button"
        onClick={toggleFavorite}
        className="group flex items-center gap-2.5 text-left cursor-pointer transition-transform active:scale-95"
        title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isFavorite
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500"
          }`}
        >
          <Heart className={`h-4 w-4 transition-transform group-hover:scale-110 ${isFavorite ? "fill-rose-600" : ""}`} />
        </div>
        <div>
          <div className="text-base sm:text-lg font-bold text-foreground leading-tight flex items-center gap-1.5">
            {stats.favoritesMonthCount}
          </div>
          <div className="text-[11px] text-muted-foreground whitespace-nowrap">
            В избранном за 30 дней
          </div>
        </div>
      </button>
    </div>
  );
}

/**
 * Compact stats badge for catalog cards on homepage (Section 2.1)
 * Displays eye and heart count in a clean, non-intrusive format.
 */
export function ProjectCatalogCardBadge({ slug }: { slug: string }) {
  const { stats, isFavorite, toggleFavorite } = useProjectAnalytics(slug, false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium shadow-xs"
    >
      <button
        type="button"
        onClick={toggleFavorite}
        className="inline-flex items-center gap-1 hover:text-rose-300 transition-colors cursor-pointer"
        title={isFavorite ? "В избранном" : "Добавить в избранное"}
      >
        <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        <span>{stats.favoritesCount}</span>
      </button>

      <span className="opacity-40">•</span>

      <div className="inline-flex items-center gap-1 opacity-90" title="Уникальных просмотров">
        <Eye className="h-3.5 w-3.5" />
        <span>{stats.viewsCount}</span>
      </div>
    </div>
  );
}
