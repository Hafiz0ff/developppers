"use client";

import React from "react";
import { Eye, Heart } from "lucide-react";
import { useProjectAnalytics } from "@/hooks/use-project-analytics";
import { useLanguage } from "@/context/language-context";

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
  const { tDual } = useLanguage();

  return (
    <div className="bg-card border rounded-2xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between gap-2 shrink-0 sm:w-60">
      {/* 1. Views Row */}
      <div className="flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
          <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
            <Eye className="h-3.5 w-3.5" />
          </div>
          <span>{tDual("Просмотры", "Боздидҳо")}</span>
        </div>
        <div className="text-sm font-bold text-foreground font-mono">
          {stats.viewsCount}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* 2. Favorites Row (Interactive) */}
      <button
        type="button"
        onClick={toggleFavorite}
        className={`flex items-center justify-between gap-3 px-1 py-1 rounded-xl transition-all cursor-pointer group text-left ${
          isFavorite
            ? "text-rose-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={
          isFavorite
            ? tDual("Удалить из избранного", "Аз баргузидаҳо нест кардан")
            : tDual("Добавить в избранное", "Ба баргузидаҳо илова кардан")
        }
      >
        <div className="flex items-center gap-2.5 text-xs font-medium">
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
              isFavorite
                ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                isFavorite ? "fill-rose-600 text-rose-600" : ""
              }`}
            />
          </div>
          <span className={isFavorite ? "text-rose-600 font-semibold" : ""}>
            {tDual("В избранном", "Дар баргузидаҳо")}
          </span>
        </div>
        <div
          className={`text-sm font-bold font-mono ${
            isFavorite ? "text-rose-600" : "text-foreground"
          }`}
        >
          {stats.favoritesCount}
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
  const { tDual } = useLanguage();

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
        title={
          isFavorite
            ? tDual("В избранном", "Дар баргузидаҳо")
            : tDual("Добавить в избранное", "Ба баргузидаҳо илова кардан")
        }
      >
        <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
        <span>{stats.favoritesCount}</span>
      </button>

      <span className="opacity-40">•</span>

      <div
        className="inline-flex items-center gap-1 opacity-90"
        title={tDual("Уникальных просмотров", "Шумораи боздидҳои беназир")}
      >
        <Eye className="h-3.5 w-3.5" />
        <span>{stats.viewsCount}</span>
      </div>
    </div>
  );
}
