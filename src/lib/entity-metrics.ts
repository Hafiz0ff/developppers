/**
 * Unified Entity Metrics & Favorites Management
 * Single source of truth for:
 * - New development projects (ЖК)
 * - Secondary market listings (вторичка / ҳавлӣ / эълонҳо)
 *
 * Provides:
 * - 24-hour view deduplication per entity (preventing artificial inflation upon page reload)
 * - Synchronized favorites state across all card instances via global window events
 */

export interface EntityStats {
  viewsCount: number;
  favoritesCount: number;
  viewsMonthCount: number;
  favoritesMonthCount: number;
}

// Storage keys
export const ENTITY_VIEWS_STORAGE_KEY = "maskani_views_history_v1";
export const ENTITY_FAVORITES_STORAGE_KEY = "maskani_favorites_v1";
export const METRIC_CHANGED_EVENT = "maskani_metric_changed";

// Baseline stats for new developments (projects)
export const DEFAULT_PROJECT_METRICS: Record<string, EntityStats> = {
  "sirdaryo-plaza": {
    viewsCount: 248,
    viewsMonthCount: 186,
    favoritesCount: 32,
    favoritesMonthCount: 24,
  },
  "zhk-kohi-munavvar": {
    viewsCount: 385,
    viewsMonthCount: 294,
    favoritesCount: 48,
    favoritesMonthCount: 36,
  },
  "zhk-kohi-azim": {
    viewsCount: 460,
    viewsMonthCount: 375,
    favoritesCount: 62,
    favoritesMonthCount: 51,
  },
  "sugdiyon-city": {
    viewsCount: 195,
    viewsMonthCount: 142,
    favoritesCount: 21,
    favoritesMonthCount: 16,
  },
  "zhk-tavhid-mol": {
    viewsCount: 520,
    viewsMonthCount: 410,
    favoritesCount: 78,
    favoritesMonthCount: 65,
  },
  "zhk-imperial": {
    viewsCount: 490,
    viewsMonthCount: 380,
    favoritesCount: 71,
    favoritesMonthCount: 58,
  },
  "qayroqum-avenue": {
    viewsCount: 412,
    viewsMonthCount: 328,
    favoritesCount: 56,
    favoritesMonthCount: 44,
  },
};

// Baseline stats for secondary market classifieds (seeded from Somon.tj real listings)
export const DEFAULT_CLASSIFIED_METRICS: Record<string, EntityStats> = {
  "17034738": { viewsCount: 142, viewsMonthCount: 108, favoritesCount: 19, favoritesMonthCount: 14 },
  "16766211": { viewsCount: 184, viewsMonthCount: 135, favoritesCount: 27, favoritesMonthCount: 21 },
  "16757134": { viewsCount: 226, viewsMonthCount: 172, favoritesCount: 34, favoritesMonthCount: 26 },
  "16805872": { viewsCount: 163, viewsMonthCount: 120, favoritesCount: 22, favoritesMonthCount: 17 },
  "17062400": { viewsCount: 198, viewsMonthCount: 149, favoritesCount: 31, favoritesMonthCount: 24 },
  "16419531": { viewsCount: 310, viewsMonthCount: 240, favoritesCount: 45, favoritesMonthCount: 35 },
  "17254763": { viewsCount: 275, viewsMonthCount: 204, favoritesCount: 38, favoritesMonthCount: 29 },
  "15811188": { viewsCount: 415, viewsMonthCount: 320, favoritesCount: 64, favoritesMonthCount: 50 },
  "17056262": { viewsCount: 189, viewsMonthCount: 138, favoritesCount: 25, favoritesMonthCount: 19 },
  "16999901": { viewsCount: 176, viewsMonthCount: 129, favoritesCount: 23, favoritesMonthCount: 18 },
  "16973801": { viewsCount: 215, viewsMonthCount: 162, favoritesCount: 33, favoritesMonthCount: 25 },
  "17099432": { viewsCount: 154, viewsMonthCount: 112, favoritesCount: 18, favoritesMonthCount: 13 },
  "16891004": { viewsCount: 280, viewsMonthCount: 215, favoritesCount: 41, favoritesMonthCount: 32 },
  "16912300": { viewsCount: 167, viewsMonthCount: 124, favoritesCount: 20, favoritesMonthCount: 15 },
  "17011220": { viewsCount: 342, viewsMonthCount: 260, favoritesCount: 52, favoritesMonthCount: 40 },
};

/**
 * Normalizes an identifier (strips prefix like "classified-" if present, or extracts slug ID)
 */
export function normalizeEntityId(rawIdOrSlug: string): string {
  if (!rawIdOrSlug) return "";
  const cleaned = rawIdOrSlug.replace(/^classified-/, "");
  // If slug starts with digits ID (e.g. "17034738-1-komn-kvartira...")
  const match = cleaned.match(/^(\d{6,10})/);
  if (match) {
    return match[1];
  }
  return cleaned;
}

/**
 * Returns baseline or default stats for any entity (project or classified)
 */
export function getBaselineEntityStats(idOrSlug: string, fallbackViews?: number, fallbackFavorites?: number): EntityStats {
  const normalized = normalizeEntityId(idOrSlug);

  // Check project default
  if (DEFAULT_PROJECT_METRICS[idOrSlug]) {
    return { ...DEFAULT_PROJECT_METRICS[idOrSlug] };
  }
  if (DEFAULT_PROJECT_METRICS[normalized]) {
    return { ...DEFAULT_PROJECT_METRICS[normalized] };
  }

  // Check classified default
  if (DEFAULT_CLASSIFIED_METRICS[idOrSlug]) {
    return { ...DEFAULT_CLASSIFIED_METRICS[idOrSlug] };
  }
  if (DEFAULT_CLASSIFIED_METRICS[normalized]) {
    return { ...DEFAULT_CLASSIFIED_METRICS[normalized] };
  }

  // Safe deterministic pseudo-baseline based on string hash if fallback not specified
  const views = fallbackViews ?? Math.max(30, (hashString(idOrSlug) % 300) + 80);
  const favs = fallbackFavorites ?? Math.max(5, Math.floor(views * 0.14));

  return {
    viewsCount: views,
    viewsMonthCount: Math.max(1, Math.floor(views * 0.75)),
    favoritesCount: favs,
    favoritesMonthCount: Math.max(1, Math.floor(favs * 0.75)),
  };
}

/**
 * Checks if an entity was viewed recently (within 24 hours) in this browser.
 * Protects against artificial inflation upon page reloads.
 */
export function hasViewedEntityRecently(idOrSlug: string, currentTime = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ENTITY_VIEWS_STORAGE_KEY);
    if (!raw) return false;
    const history: Record<string, number> = JSON.parse(raw);
    const key = normalizeEntityId(idOrSlug);
    const lastViewTime = history[key] || history[idOrSlug];
    if (!lastViewTime) return false;
    const hours24 = 24 * 60 * 60 * 1000;
    return currentTime - lastViewTime < hours24;
  } catch {
    return false;
  }
}

/**
 * Marks entity as viewed in localStorage with 24-hour deduplication.
 * Returns true if this was a new unique view, false if already viewed recently.
 */
export function recordUniqueEntityView(idOrSlug: string, currentTime = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (hasViewedEntityRecently(idOrSlug, currentTime)) {
      return false;
    }
    const raw = localStorage.getItem(ENTITY_VIEWS_STORAGE_KEY);
    const history: Record<string, number> = raw ? JSON.parse(raw) : {};
    const key = normalizeEntityId(idOrSlug);
    history[key] = currentTime;
    history[idOrSlug] = currentTime;
    localStorage.setItem(ENTITY_VIEWS_STORAGE_KEY, JSON.stringify(history));

    // Also dispatch event for live synchronisation if window event bus is available
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        window.dispatchEvent(
          new CustomEvent(METRIC_CHANGED_EVENT, {
            detail: { idOrSlug, type: "view", delta: 1 },
          })
        );
      } catch {}
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if an entity is in the user's favorites
 */
export function isEntityInFavorites(idOrSlug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ENTITY_FAVORITES_STORAGE_KEY);
    // Legacy fallback check
    const legacyProjectsRaw = localStorage.getItem("sogd_project_favorites_v1");
    const legacyClassifiedsRaw = localStorage.getItem("sogd_favorites");

    const favs: string[] = raw ? JSON.parse(raw) : [];
    const legacy1: string[] = legacyProjectsRaw ? JSON.parse(legacyProjectsRaw) : [];
    const legacy2: string[] = legacyClassifiedsRaw ? JSON.parse(legacyClassifiedsRaw) : [];

    const allFavs = new Set([...favs, ...legacy1, ...legacy2]);
    const norm = normalizeEntityId(idOrSlug);

    return allFavs.has(idOrSlug) || allFavs.has(norm);
  } catch {
    return false;
  }
}

/**
 * Toggles entity favorite status in unified localStorage and notifies all components.
 * Returns the new state (true if favorited, false if removed).
 */
export function toggleEntityFavorite(idOrSlug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ENTITY_FAVORITES_STORAGE_KEY);
    let favs: string[] = raw ? JSON.parse(raw) : [];
    const norm = normalizeEntityId(idOrSlug);

    const exists = favs.includes(idOrSlug) || favs.includes(norm);
    if (exists) {
      favs = favs.filter((s) => s !== idOrSlug && s !== norm);
    } else {
      favs.push(idOrSlug);
      if (norm !== idOrSlug) favs.push(norm);
    }

    localStorage.setItem(ENTITY_FAVORITES_STORAGE_KEY, JSON.stringify(favs));
    // Also keep legacy keys in sync for backward compatibility
    localStorage.setItem("sogd_project_favorites_v1", JSON.stringify(favs));
    localStorage.setItem("sogd_favorites", JSON.stringify(favs));

    const nextState = !exists;

    // Dispatch global event so all cards with this entity update instantly
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        window.dispatchEvent(
          new CustomEvent(METRIC_CHANGED_EVENT, {
            detail: {
              idOrSlug,
              type: "favorite",
              isFavorite: nextState,
              delta: nextState ? 1 : -1,
            },
          })
        );
        window.dispatchEvent(
          new CustomEvent("sogd_favorite_changed", {
            detail: { slug: idOrSlug, isFavorite: nextState },
          })
        );
      } catch {}
    }

    return nextState;
  } catch {
    return false;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
