export type ParkingSpotStatus = "available" | "reserved" | "sold";
export type ParkingType = "standard" | "large" | "family_double" | "moto";

export interface ParkingSpot {
  id: string;               // e.g. "ps_qa_p1_01"
  projectId: string;
  level: string;            // e.g. "-1 этаж", "-2 этаж"
  levelTg?: string;          // e.g. "Ошёнаи -1", "Ошёнаи -2"
  number: string;           // "№ 01", "№ 14"
  type: ParkingType;
  area: number;             // Площадь в м² (например, 18.5)
  priceTjs: number;         // Стоимость в сомони
  priceUsd: number;         // Стоимость в долларах
  status: ParkingSpotStatus;
  note?: string;            // "Рядом с лифтом Блока А", "Розетка 220V для зарядки"
  noteTg?: string;
  buyerName?: string;
  updatedAt?: string;
}

export type StorageUnitStatus = "available" | "reserved" | "sold";

export interface StorageUnit {
  id: string;               // e.g. "su_qa_b1_01"
  projectId: string;
  level: string;            // e.g. "Цокольный этаж / Подвал", "-1 этаж"
  levelTg?: string;          // e.g. "Ошёнаи таҳхона", "Ошёнаи -1"
  number: string;           // "К-01", "К-12"
  area: number;             // Площадь в м² (например, 4.5)
  priceTjs: number;         // Стоимость в сомони
  priceUsd: number;         // Стоимость в долларах
  status: StorageUnitStatus;
  features?: string[];      // ["Металлическая дверь", "Приточная вентиляция", "Стеллажи"]
  featuresTg?: string[];
  updatedAt?: string;
}

export interface ProjectParkingConfig {
  isEnabled: boolean;             // Включён ли блок на витрине
  title?: string;                 // По умолч.: "Паркинг"
  titleTg?: string;               // "Таваққуфгоҳ"
  subtitle?: string;              // По умолч.: "Подземные паркинги"
  subtitleTg?: string;            // "Таваққуфгоҳҳои зеризаминӣ"
  description: string;            // До 400 символов (RU)
  descriptionTg: string;          // До 400 символов (TG)
  images: string[];               // Ровно 3 фото для коллажа (или 1-3)
  isChessboardPublished: boolean; // Опубликована ли шахматка
  totalSpots?: number;
  availableSpots?: number;
  minPriceTjs?: number;
  minPriceUsd?: number;
}

export interface ProjectStorageConfig {
  isEnabled: boolean;             // Включён ли блок на витрине
  title?: string;                 // По умолч.: "Кладовые"
  titleTg?: string;               // "Анборхонаҳо"
  subtitle?: string;              // По умолч.: "Кладовые для хранения вещей"
  subtitleTg?: string;            // "Анборхонаҳо барои нигоҳдории ашё"
  description: string;            // До 400 символов (RU)
  descriptionTg: string;          // До 400 символов (TG)
  images: string[];               // Фотографии (1-5)
  isChessboardPublished: boolean; // Опубликована ли шахматка
  totalUnits?: number;
  availableUnits?: number;
  minPriceTjs?: number;
  minPriceUsd?: number;
}
