/**
 * Official Yandex Geocoder API Client
 * Supports forward geocoding (address -> coordinates) and reverse geocoding (coordinates -> address).
 * Utilizes NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY.
 */

export interface YandexGeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  house?: string;
  kind?: string;
  precision?: string;
}

export interface YandexGeocodeOptions {
  apiKey?: string;
  lang?: "ru_RU" | "en_US" | "tr_TR" | "uk_UA";
  results?: number;
  /** Bounding box in format: "minLng,minLat~maxLng,maxLat" */
  bbox?: string;
  /** Restrict results strictly inside bbox */
  rspn?: boolean;
}

/**
 * Extracts and parses geo data from Yandex Geocoder JSON response
 */
export function parseYandexGeoResponse(data: unknown): YandexGeocodeResult[] {
  if (!data || typeof data !== "object") return [];

  const raw = data as {
    response?: {
      GeoObjectCollection?: {
        featureMember?: Array<{
          GeoObject?: {
            Point?: { pos?: string };
            metaDataProperty?: {
              GeocoderMetaData?: {
                text?: string;
                kind?: string;
                precision?: string;
                Address?: {
                  Components?: Array<{
                    kind: string;
                    name: string;
                  }>;
                };
              };
            };
          };
        }>;
      };
    };
  };

  const members = raw.response?.GeoObjectCollection?.featureMember;
  if (!Array.isArray(members) || members.length === 0) return [];

  const results: YandexGeocodeResult[] = [];

  for (const item of members) {
    const geoObject = item.GeoObject;
    if (!geoObject) continue;

    const pos = geoObject.Point?.pos;
    if (!pos) continue;

    // Yandex returns pos as "longitude latitude"
    const [lngStr, latStr] = pos.trim().split(/\s+/);
    const lng = parseFloat(lngStr);
    const lat = parseFloat(latStr);

    if (isNaN(lat) || isNaN(lng)) continue;

    const meta = geoObject.metaDataProperty?.GeocoderMetaData;
    const formattedAddress = meta?.text || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const kind = meta?.kind;
    const precision = meta?.precision;

    const components = meta?.Address?.Components || [];
    let country: string | undefined;
    let province: string | undefined;
    let city: string | undefined;
    let district: string | undefined;
    let street: string | undefined;
    let house: string | undefined;

    for (const comp of components) {
      if (comp.kind === "country") country = comp.name;
      else if (comp.kind === "province") province = comp.name;
      else if (comp.kind === "locality") city = comp.name;
      else if (comp.kind === "district") district = comp.name;
      else if (comp.kind === "street") street = comp.name;
      else if (comp.kind === "house") house = comp.name;
    }

    results.push({
      lat,
      lng,
      formattedAddress,
      country,
      province,
      city,
      district,
      street,
      house,
      kind,
      precision,
    });
  }

  return results;
}

/**
 * Forward Geocoding: resolves human address string into coordinates
 */
export async function geocodeAddress(
  address: string,
  options: YandexGeocodeOptions = {}
): Promise<YandexGeocodeResult[]> {
  const apiKey =
    options.apiKey ||
    process.env.NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY ||
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  if (!apiKey) {
    console.warn("Yandex Geocoder: No API key provided or configured");
    return [];
  }

  if (!address || !address.trim()) return [];

  const lang = options.lang || "ru_RU";
  const resultsCount = options.results || 5;

  let url = `https://geocode-maps.yandex.ru/1.x/?apikey=${encodeURIComponent(
    apiKey
  )}&geocode=${encodeURIComponent(address.trim())}&format=json&lang=${lang}&results=${resultsCount}`;

  if (options.bbox) {
    url += `&bbox=${encodeURIComponent(options.bbox)}`;
    if (options.rspn) {
      url += "&rspn=1";
    }
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Yandex Geocoder error: ${res.status} ${res.statusText}`);
      return [];
    }
    const json = await res.json();
    return parseYandexGeoResponse(json);
  } catch (err) {
    console.error("Yandex Geocoder fetch failed:", err);
    return [];
  }
}

/**
 * Reverse Geocoding: resolves coordinates (lat, lng) into readable address
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  options: YandexGeocodeOptions = {}
): Promise<YandexGeocodeResult | null> {
  const apiKey =
    options.apiKey ||
    process.env.NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY ||
    process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  if (!apiKey) {
    console.warn("Yandex Geocoder: No API key provided or configured");
    return null;
  }

  const lang = options.lang || "ru_RU";
  // Yandex geocode parameter for reverse is "lng,lat"
  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${encodeURIComponent(
    apiKey
  )}&geocode=${lng},${lat}&format=json&lang=${lang}&results=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Yandex Reverse Geocoder error: ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    const parsed = parseYandexGeoResponse(json);
    return parsed[0] || null;
  } catch (err) {
    console.error("Yandex Reverse Geocoder fetch failed:", err);
    return null;
  }
}
