import {
  ParkingSpot,
  StorageUnit,
  ParkingSpotStatus,
  StorageUnitStatus,
  ParkingType,
} from "@/types/parking-storage";

export interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  reservedSpots: number;
  soldSpots: number;
  minPriceTjs: number;
  minPriceUsd: number;
}

export interface StorageStats {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  minPriceTjs: number;
  minPriceUsd: number;
}

/**
 * Calculates summary metrics for parking spots
 */
export function calculateParkingStats(spots: ParkingSpot[]): ParkingStats {
  if (!spots || spots.length === 0) {
    return {
      totalSpots: 0,
      availableSpots: 0,
      reservedSpots: 0,
      soldSpots: 0,
      minPriceTjs: 0,
      minPriceUsd: 0,
    };
  }

  let available = 0;
  let reserved = 0;
  let sold = 0;
  let minPriceTjs = Infinity;
  let minPriceUsd = Infinity;

  for (const s of spots) {
    if (s.status === "available") {
      available++;
      if (s.priceTjs < minPriceTjs) minPriceTjs = s.priceTjs;
      if (s.priceUsd < minPriceUsd) minPriceUsd = s.priceUsd;
    } else if (s.status === "reserved") {
      reserved++;
    } else if (s.status === "sold") {
      sold++;
    }
  }

  return {
    totalSpots: spots.length,
    availableSpots: available,
    reservedSpots: reserved,
    soldSpots: sold,
    minPriceTjs: minPriceTjs === Infinity ? 0 : minPriceTjs,
    minPriceUsd: minPriceUsd === Infinity ? 0 : minPriceUsd,
  };
}

/**
 * Calculates summary metrics for storage units
 */
export function calculateStorageStats(units: StorageUnit[]): StorageStats {
  if (!units || units.length === 0) {
    return {
      totalUnits: 0,
      availableUnits: 0,
      reservedUnits: 0,
      soldUnits: 0,
      minPriceTjs: 0,
      minPriceUsd: 0,
    };
  }

  let available = 0;
  let reserved = 0;
  let sold = 0;
  let minPriceTjs = Infinity;
  let minPriceUsd = Infinity;

  for (const u of units) {
    if (u.status === "available") {
      available++;
      if (u.priceTjs < minPriceTjs) minPriceTjs = u.priceTjs;
      if (u.priceUsd < minPriceUsd) minPriceUsd = u.priceUsd;
    } else if (u.status === "reserved") {
      reserved++;
    } else if (u.status === "sold") {
      sold++;
    }
  }

  return {
    totalUnits: units.length,
    availableUnits: available,
    reservedUnits: reserved,
    soldUnits: sold,
    minPriceTjs: minPriceTjs === Infinity ? 0 : minPriceTjs,
    minPriceUsd: minPriceUsd === Infinity ? 0 : minPriceUsd,
  };
}

/**
 * Validates description length according to requirements (max 400 characters)
 */
export function validateDescriptionLength(desc: string, maxChars = 400): boolean {
  if (!desc) return true;
  return desc.trim().length <= maxChars;
}

/**
 * Validates unique identifier numbers across spots or units
 */
export function validateUniqueNumbers<T>(items: T[], key: keyof T): { isValid: boolean; duplicates: string[] } {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    const val = String(item[key]).trim();
    if (seen.has(val)) {
      duplicates.add(val);
    } else {
      seen.add(val);
    }
  }

  return {
    isValid: duplicates.size === 0,
    duplicates: Array.from(duplicates),
  };
}

/**
 * Generates realistic parking spots for flagship project «Qayroqum Avenue»
 * Levels: -1 этаж (20 мест) and -2 этаж (18 мест) = 38 spots total
 */
export function generateParkingSpotsForQayroqum(): ParkingSpot[] {
  const spots: ParkingSpot[] = [];

  // Level -1 (20 spots: P1-01 to P1-20)
  for (let i = 1; i <= 20; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    let type: ParkingType = "standard";
    let area = 19.5;
    let priceUsd = 5000;
    let note = "Рядом с лифтом Блока А";
    let noteTg = "Назди лифти блоки А";

    if (i === 5 || i === 12) {
      type = "family_double";
      area = 34.0;
      priceUsd = 8200;
      note = "Семейное двойное место (2 авто)";
      noteTg = "Ҷойи мошини дукаратаи оилавӣ (барои 2 мошин)";
    } else if (i === 10 || i === 20) {
      type = "moto";
      area = 7.5;
      priceUsd = 2000;
      note = "Для мотоцикла или электробайка";
      noteTg = "Барои мототсикл ё электробайк";
    } else if (i % 3 === 0) {
      type = "large";
      area = 22.0;
      priceUsd = 5800;
      note = "Увеличенное место с розеткой 220V для электромобилей";
      noteTg = "Ҷойи васеъ бо васлаки 220V барои электромобилҳо";
    }

    let status: ParkingSpotStatus = "available";
    if (i === 3 || i === 7 || i === 14) {
      status = "reserved";
    } else if (i === 2 || i === 8 || i === 16 || i === 19) {
      status = "sold";
    }

    const priceTjs = Math.round(priceUsd * 10.95);

    spots.push({
      id: `ps_qa_p1_${num}`,
      projectId: "proj_qayroqum",
      level: "-1 этаж",
      levelTg: "Ошёнаи -1",
      number: `№ ${num}`,
      type,
      area,
      priceTjs,
      priceUsd,
      status,
      note,
      noteTg,
    });
  }

  // Level -2 (18 spots: P2-21 to P2-38)
  for (let i = 21; i <= 38; i++) {
    const num = `${i}`;
    let type: ParkingType = "standard";
    let area = 18.5;
    let priceUsd = 4500;
    let note = "Удобный въезд с рампы Блока Б";
    let noteTg = "Даромади мувофиқ аз хатти блоки Б";

    if (i === 25 || i === 34) {
      type = "family_double";
      area = 33.0;
      priceUsd = 7500;
      note = "Семейное место для 2 авто";
      noteTg = "Ҷойи оилавӣ барои 2 мошин";
    } else if (i === 30) {
      type = "moto";
      area = 7.0;
      priceUsd = 1800;
      note = "Мотоместо";
      noteTg = "Ҷойи мототсикл";
    } else if (i % 4 === 0) {
      type = "large";
      area = 21.5;
      priceUsd = 5200;
      note = "Широкое паркоместо у колонны";
      noteTg = "Ҷойи васеъ дар назди сутун";
    }

    let status: ParkingSpotStatus = "available";
    if (i === 24 || i === 31) {
      status = "reserved";
    } else if (i === 22 || i === 28 || i === 36) {
      status = "sold";
    }

    const priceTjs = Math.round(priceUsd * 10.95);

    spots.push({
      id: `ps_qa_p2_${num}`,
      projectId: "proj_qayroqum",
      level: "-2 этаж",
      levelTg: "Ошёнаи -2",
      number: `№ ${num}`,
      type,
      area,
      priceTjs,
      priceUsd,
      status,
      note,
      noteTg,
    });
  }

  return spots;
}

/**
 * Generates realistic storage units for flagship project «Qayroqum Avenue»
 * Level: Basement level (16 storage units: К-01 to К-16)
 */
export function generateStorageUnitsForQayroqum(): StorageUnit[] {
  const units: StorageUnit[] = [];

  const defaultFeaturesRu = [
    "Металлическая взломостойкая дверь",
    "Приточная вентиляция",
    "Стеллажи для хранения",
    "Индивидуальный счетчик и освещение",
  ];

  const defaultFeaturesTg = [
    "Дари оҳании зидди шикаст",
    "Вентилятсияи доимии ҳаво",
    "Рафҳои васлшуда барои ашё",
    "Ҳисобкунаки алоҳида ва чароғҳо",
  ];

  for (let i = 1; i <= 16; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const area = Number((3.2 + (i % 5) * 1.1).toFixed(1)); // from 3.2m² to 7.6m²
    const priceUsd = Math.round(area * 320); // ~$320 per m²
    const priceTjs = Math.round(priceUsd * 10.95);

    let status: StorageUnitStatus = "available";
    if (i === 4 || i === 9) {
      status = "reserved";
    } else if (i === 2 || i === 7 || i === 13) {
      status = "sold";
    }

    units.push({
      id: `su_qa_b1_${num}`,
      projectId: "proj_qayroqum",
      level: "Цокольный этаж / Подвал",
      levelTg: "Ошёнаи таҳхона",
      number: `К-${num}`,
      area,
      priceTjs,
      priceUsd,
      status,
      features: defaultFeaturesRu,
      featuresTg: defaultFeaturesTg,
    });
  }

  return units;
}
