/**
 * Project Analytics & Favorites management
 * Handles unique views tracking (with 24h deduplication) and user favorites.
 */

export interface ProjectStats {
  viewsCount: number;
  viewsMonthCount: number;
  favoritesCount: number;
  favoritesMonthCount: number;
}

// Initial baseline stats for demonstration & fallback
export const DEFAULT_PROJECT_STATS: Record<string, ProjectStats> = {
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
  "qayroqum-avenue": {
    viewsCount: 412,
    viewsMonthCount: 328,
    favoritesCount: 56,
    favoritesMonthCount: 44,
  },
};

const VIEW_STORAGE_KEY = "sogd_project_views_v1";
const FAVORITES_STORAGE_KEY = "sogd_project_favorites_v1";

/**
 * Returns baseline or stored stats for a given project slug
 */
export function getBaselineProjectStats(slug: string): ProjectStats {
  const base = DEFAULT_PROJECT_STATS[slug];
  if (base) {
    return { ...base };
  }
  return {
    viewsCount: 120,
    viewsMonthCount: 85,
    favoritesCount: 14,
    favoritesMonthCount: 10,
  };
}

/**
 * Checks if a project was viewed recently (within 24 hours) in this browser
 */
export function hasViewedRecently(slug: string, currentTime = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    if (!raw) return false;
    const history: Record<string, number> = JSON.parse(raw);
    const lastViewTime = history[slug];
    if (!lastViewTime) return false;
    const hours24 = 24 * 60 * 60 * 1000;
    return currentTime - lastViewTime < hours24;
  } catch {
    return false;
  }
}

/**
 * Marks project as viewed in localStorage and returns true if this was a new unique view
 */
export function recordUniqueProjectView(slug: string, currentTime = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (hasViewedRecently(slug, currentTime)) {
      return false;
    }
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    const history: Record<string, number> = raw ? JSON.parse(raw) : {};
    history[slug] = currentTime;
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a project is in the user's favorites list
 */
export function isProjectInFavorites(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return false;
    const favs: string[] = JSON.parse(raw);
    return favs.includes(slug);
  } catch {
    return false;
  }
}

/**
 * Toggles a project's favorite state in localStorage.
 * Returns the new state (true if favorited, false if removed).
 */
export function toggleProjectFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    let favs: string[] = raw ? JSON.parse(raw) : [];
    const exists = favs.includes(slug);
    if (exists) {
      favs = favs.filter((s) => s !== slug);
    } else {
      favs.push(slug);
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
    return !exists;
  } catch {
    return false;
  }
}
