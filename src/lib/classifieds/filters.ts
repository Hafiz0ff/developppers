export type ClassifiedListQuery = {
  city?: string;
  propertyType?: string;
  dealType?: string;
  rooms?: string;
  priceMin?: number;
  priceMax?: number;
  q?: string;
};

export type FilterableClassified = {
  id: string;
  status: string;
  city: string;
  propertyType: string;
  dealType: string;
  roomsCount: number | null;
  priceUsd: number;
  title: string;
  district?: string | null;
};

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseClassifiedListQuery(
  params: Record<string, string | undefined>
): ClassifiedListQuery {
  return {
    city: params.city || undefined,
    propertyType: params.propertyType || undefined,
    dealType: params.dealType || undefined,
    rooms: params.rooms || undefined,
    priceMin: parseNumber(params.priceMin),
    priceMax: parseNumber(params.priceMax),
    q: params.q?.trim() || undefined,
  };
}

export function filterPublicClassifieds<T extends FilterableClassified>(
  rows: T[],
  query: ClassifiedListQuery
): T[] {
  return rows.filter((row) => {
    if (row.status !== "active") return false;
    if (query.city && row.city !== query.city) return false;
    if (query.propertyType && row.propertyType !== query.propertyType) return false;
    if (query.dealType && row.dealType !== query.dealType) return false;
    if (query.rooms === "4+") {
      if ((row.roomsCount ?? 0) < 4) return false;
    } else if (query.rooms && query.rooms !== "all" && query.rooms !== "studio") {
      const rooms = Number(query.rooms);
      if (row.roomsCount !== rooms) return false;
    } else if (query.rooms === "studio") {
      if ((row.roomsCount ?? 0) !== 0) return false;
    }
    if (query.priceMin != null && row.priceUsd < query.priceMin) return false;
    if (query.priceMax != null && row.priceUsd > query.priceMax) return false;
    if (query.q) {
      const hay = `${row.title} ${row.district ?? ""}`.toLowerCase();
      if (!hay.includes(query.q.toLowerCase())) return false;
    }
    return true;
  });
}
