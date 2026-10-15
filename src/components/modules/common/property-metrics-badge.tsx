"use client";

import React from "react";
import { Eye, Heart } from "lucide-react";
import { useEntityMetrics } from "@/hooks/use-entity-metrics";
import { useLanguage } from "@/context/language-context";

export interface PropertyMetricsBadgeProps {
  idOrSlug: string;
  variant?: "glass" | "outline" | "minimal";
  interactive?: boolean;
  initialViews?: number;
  initialFavorites?: number;
  className?: string;
}

/**
 * Standardized Unified Metrics Badge (Section 2.1 - 2.3 of specification)
 * Displays:
 * 1. Eye icon + total views count
 * 2. Heart icon + total favorites count (interactive click supported)
 *
 * Used uniformly across:
 * - Homepage new development cards
 * - Homepage secondary market classifieds cards
 * - Classifieds catalog cards
 * - Map preview cards
 */
export function PropertyMetricsBadge({
  idOrSlug,
  variant = "glass",
  interactive = true,
  initialViews,
  initialFavorites,
  className = "",
}: PropertyMetricsBadgeProps) {
  const { stats, isFavorite, toggleFavorite } = useEntityMetrics(idOrSlug, {
    autoRecordView: false,
    initialViews,
    initialFavorites,
  });
  const { tDual } = useLanguage();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (interactive) {
      toggleFavorite(e);
    }
  };

  if (variant === "outline") {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`inline-flex items-center gap-2.5 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs ${className}`}
      >
        {/* Favorite */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={!interactive}
          className={`inline-flex items-center gap-1 transition-colors ${
            interactive ? "cursor-pointer hover:text-rose-600 active:scale-95" : "cursor-default"
          }`}
          title={
            isFavorite
              ? tDual("В избранном", "Дар писандидаҳо")
              : tDual("Добавить в избранное", "Ба писандидаҳо илова кардан")
          }
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400 dark:text-slate-500"
            }`}
          />
          <span className={isFavorite ? "text-rose-600 font-semibold" : ""}>
            {stats.favoritesCount}
          </span>
        </button>

        <span className="text-slate-300 dark:text-slate-600">•</span>

        {/* Views */}
        <div
          className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400"
          title={tDual("Количество просмотров", "Шумораи боздидҳо")}
        >
          <Eye className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>{stats.viewsCount}</span>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`inline-flex items-center gap-2 text-xs text-slate-400 ${className}`}
      >
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={!interactive}
          className={`inline-flex items-center gap-1 transition-colors ${
            interactive ? "cursor-pointer hover:text-rose-500 active:scale-95" : "cursor-default"
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
          />
          <span className={isFavorite ? "text-rose-500 font-semibold" : ""}>
            {stats.favoritesCount}
          </span>
        </button>

        <span>•</span>

        <div className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          <span>{stats.viewsCount}</span>
        </div>
      </div>
    );
  }

  // Default: "glass" floating badge on images
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`inline-flex items-center gap-2 bg-slate-900/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-medium shadow-xs border border-white/10 ${className}`}
    >
      {/* Favorite button */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        disabled={!interactive}
        className={`inline-flex items-center gap-1 hover:text-rose-300 transition-colors ${
          interactive ? "cursor-pointer active:scale-95" : "cursor-default"
        }`}
        title={
          isFavorite
            ? tDual("В избранном", "Дар писандидаҳо")
            : tDual("Добавить в избранное", "Ба писандидаҳо илова кардан")
        }
      >
        <Heart
          className={`h-3.5 w-3.5 transition-colors ${
            isFavorite ? "fill-rose-500 text-rose-500" : "text-white/80"
          }`}
        />
        <span className={isFavorite ? "text-rose-300 font-semibold" : ""}>
          {stats.favoritesCount}
        </span>
      </button>

      <span className="opacity-40">•</span>

      {/* Views count */}
      <div
        className="inline-flex items-center gap-1 text-white/90"
        title={tDual("Количество просмотров", "Шумораи боздидҳо")}
      >
        <Eye className="h-3.5 w-3.5 text-white/70" />
        <span>{stats.viewsCount}</span>
      </div>
    </div>
  );
}
