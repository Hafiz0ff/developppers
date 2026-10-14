"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ProjectStats,
  getBaselineProjectStats,
  recordUniqueProjectView,
  isProjectInFavorites,
  toggleProjectFavorite,
} from "@/lib/project-analytics";

export function useProjectAnalytics(slug: string, autoRecordView = false) {
  const [stats, setStats] = useState<ProjectStats>(() => getBaselineProjectStats(slug));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const base = getBaselineProjectStats(slug);
    const fav = isProjectInFavorites(slug);
    setIsFavorite(fav);

    if (autoRecordView) {
      const isNew = recordUniqueProjectView(slug);
      if (isNew) {
        base.viewsCount += 1;
        base.viewsMonthCount += 1;
      }
    }

    if (fav) {
      base.favoritesCount += 1;
      base.favoritesMonthCount += 1;
    }

    setStats({ ...base });
    setIsInitialized(true);
  }, [slug, autoRecordView]);

  const toggleFavorite = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const nextState = toggleProjectFavorite(slug);
      setIsFavorite(nextState);

      setStats((prev) => ({
        ...prev,
        favoritesCount: nextState ? prev.favoritesCount + 1 : Math.max(0, prev.favoritesCount - 1),
        favoritesMonthCount: nextState
          ? prev.favoritesMonthCount + 1
          : Math.max(0, prev.favoritesMonthCount - 1),
      }));

      // Dispatch a custom window event so other cards update synchronously
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sogd_favorite_changed", {
            detail: { slug, isFavorite: nextState },
          })
        );
      }

      return nextState;
    },
    [slug]
  );

  // Listen for favorite events from other components (e.g. Catalog card <-> Slug page)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{ slug: string; isFavorite: boolean }>;
      if (custom.detail && custom.detail.slug === slug) {
        setIsFavorite(custom.detail.isFavorite);
        setStats((prev) => ({
          ...prev,
          favoritesCount: custom.detail.isFavorite
            ? prev.favoritesCount + 1
            : Math.max(0, prev.favoritesCount - 1),
          favoritesMonthCount: custom.detail.isFavorite
            ? prev.favoritesMonthCount + 1
            : Math.max(0, prev.favoritesMonthCount - 1),
        }));
      }
    };

    window.addEventListener("sogd_favorite_changed", handleSync);
    return () => window.removeEventListener("sogd_favorite_changed", handleSync);
  }, [slug]);

  return {
    stats,
    isFavorite,
    isInitialized,
    toggleFavorite,
  };
}
