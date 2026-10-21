"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CompareProperty,
  getStoredCompareItems,
  addToCompareStore,
  removeFromCompareStore,
  clearCompareStore,
  isItemInCompareStore,
  COMPARE_CHANGED_EVENT,
  MAX_COMPARE_ITEMS,
} from "@/lib/compare/compare-store";

interface CompareContextType {
  compareItems: CompareProperty[];
  compareCount: number;
  addToCompare: (item: CompareProperty) => { success: boolean; error?: string };
  removeFromCompare: (idOrSlug: string) => void;
  toggleCompare: (item: CompareProperty) => { success: boolean; error?: string; isNowCompared: boolean };
  clearCompare: () => void;
  isInCompare: (idOrSlug: string) => boolean;
  onlyDifferences: boolean;
  setOnlyDifferences: (val: boolean) => void;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType>({
  compareItems: [],
  compareCount: 0,
  addToCompare: () => ({ success: false }),
  removeFromCompare: () => {},
  toggleCompare: () => ({ success: false, isNowCompared: false }),
  clearCompare: () => {},
  isInCompare: () => false,
  onlyDifferences: false,
  setOnlyDifferences: () => {},
  maxItems: MAX_COMPARE_ITEMS,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareProperty[]>([]);
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setItems(getStoredCompareItems());

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ items?: CompareProperty[] }>;
      if (customEvent.detail?.items) {
        setItems(customEvent.detail.items);
      } else {
        setItems(getStoredCompareItems());
      }
    };

    window.addEventListener(COMPARE_CHANGED_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(COMPARE_CHANGED_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const addToCompare = useCallback((item: CompareProperty) => {
    const res = addToCompareStore(item);
    if (res.success) {
      setItems(res.items);
    }
    return res;
  }, []);

  const removeFromCompare = useCallback((idOrSlug: string) => {
    const updated = removeFromCompareStore(idOrSlug);
    setItems(updated);
  }, []);

  const toggleCompare = useCallback(
    (item: CompareProperty) => {
      const alreadyIn = items.some((c) => c.id === item.id || c.slug === item.slug);
      if (alreadyIn) {
        removeFromCompare(item.id);
        return { success: true, isNowCompared: false };
      } else {
        const res = addToCompare(item);
        return { ...res, isNowCompared: res.success };
      }
    },
    [items, addToCompare, removeFromCompare]
  );

  const clearCompare = useCallback(() => {
    clearCompareStore();
    setItems([]);
  }, []);

  const isInCompare = useCallback(
    (idOrSlug: string) => {
      return items.some((c) => c.id === idOrSlug || c.slug === idOrSlug);
    },
    [items]
  );

  return (
    <CompareContext.Provider
      value={{
        compareItems: items,
        compareCount: items.length,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        onlyDifferences,
        setOnlyDifferences,
        maxItems: MAX_COMPARE_ITEMS,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
