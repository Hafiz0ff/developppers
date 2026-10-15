"use client";

import { useState, useEffect, useCallback } from "react";
import {
  EntityStats,
  getBaselineEntityStats,
  recordUniqueEntityView,
  isEntityInFavorites,
  toggleEntityFavorite,
  normalizeEntityId,
  METRIC_CHANGED_EVENT,
} from "@/lib/entity-metrics";

interface UseEntityMetricsOptions {
  autoRecordView?: boolean;
  initialViews?: number;
  initialFavorites?: number;
}

export function useEntityMetrics(
  idOrSlug: string,
  options: UseEntityMetricsOptions = {}
) {
  const { autoRecordView = false, initialViews, initialFavorites } = options;

  const [stats, setStats] = useState<EntityStats>(() =>
    getBaselineEntityStats(idOrSlug, initialViews, initialFavorites)
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !idOrSlug) return;

    const base = getBaselineEntityStats(idOrSlug, initialViews, initialFavorites);
    const fav = isEntityInFavorites(idOrSlug);
    setIsFavorite(fav);

    if (autoRecordView) {
      const isNew = recordUniqueEntityView(idOrSlug);
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
  }, [idOrSlug, autoRecordView, initialViews, initialFavorites]);

  const toggleFavorite = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const nextState = toggleEntityFavorite(idOrSlug);
      setIsFavorite(nextState);

      setStats((prev) => ({
        ...prev,
        favoritesCount: nextState ? prev.favoritesCount + 1 : Math.max(0, prev.favoritesCount - 1),
        favoritesMonthCount: nextState
          ? prev.favoritesMonthCount + 1
          : Math.max(0, prev.favoritesMonthCount - 1),
      }));

      return nextState;
    },
    [idOrSlug]
  );

  // Synchronize in real-time across cards and browser tabs
  useEffect(() => {
    if (typeof window === "undefined" || !idOrSlug) return;

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{
        idOrSlug?: string;
        slug?: string;
        type?: string;
        isFavorite?: boolean;
        delta?: number;
      }>;
      const detail = custom.detail;
      if (!detail) return;

      const eventKey = detail.idOrSlug || detail.slug || "";
      const matches =
        eventKey === idOrSlug ||
        normalizeEntityId(eventKey) === normalizeEntityId(idOrSlug);

      if (matches) {
        if (detail.type === "favorite" || typeof detail.isFavorite === "boolean") {
          const nextFav = detail.isFavorite ?? false;
          setIsFavorite(nextFav);
          setStats((prev) => ({
            ...prev,
            favoritesCount: nextFav ? prev.favoritesCount + 1 : Math.max(0, prev.favoritesCount - 1),
            favoritesMonthCount: nextFav
              ? prev.favoritesMonthCount + 1
              : Math.max(0, prev.favoritesMonthCount - 1),
          }));
        } else if (detail.type === "view") {
          setStats((prev) => ({
            ...prev,
            viewsCount: prev.viewsCount + (detail.delta || 1),
            viewsMonthCount: prev.viewsMonthCount + (detail.delta || 1),
          }));
        }
      }
    };

    window.addEventListener(METRIC_CHANGED_EVENT, handleSync);
    window.addEventListener("sogd_favorite_changed", handleSync);

    return () => {
      window.removeEventListener(METRIC_CHANGED_EVENT, handleSync);
      window.removeEventListener("sogd_favorite_changed", handleSync);
    };
  }, [idOrSlug]);

  return {
    stats,
    isFavorite,
    isInitialized,
    toggleFavorite,
  };
}
