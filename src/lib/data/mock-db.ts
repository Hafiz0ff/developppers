export interface DeveloperData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverUrl: string;
  description: string;
  foundedYear: number;
  completedProjectsCount: number;
  activeProjectsCount: number;
  rating: string;
  isVerified: boolean;
  city: string;
  officeAddress: string;
  phone: string;
  phoneSecondary?: string;
  whatsapp: string;
  telegram?: string;
  email: string;
  websiteUrl?: string;
}

export interface CustomBuildingFeature {
  id: string;
  title: string;
  value: string;
}

export interface FinishingFeature {
  id: string;
  title: string;
  description: string;
}

export interface ProjectData {
  id: string;
  developerId: string;
  name: string;
  nameTg?: string;
  slug: string;
  shortDescription: string;
  shortDescriptionTg?: string;
  description: string;
  descriptionTg?: string;
  status: "planned" | "under_construction" | "ready";
  buildingClass: "economy" | "comfort" | "business" | "premium";
  finishing: "rough" | "pre_finishing" | "turnkey";
  city: string;
  district: string;
  districtTg?: string;
  address: string;
  addressTg?: string;
  landmark: string;
  landmarkTg?: string;
  floorsCount: number;
  sectionsCount: number;
  ceilingHeight: string;
  constructionType: string;
  deadlineQuarter: number;
  deadlineYear: number;
  // Новые характеристики участка и здания
  landArea?: string;
  wallMaterial?: string;
  facade?: string;
  cadastralNumber?: string;
  customBuildingFeatures?: CustomBuildingFeature[];
  finishingFeatures?: FinishingFeature[];
  minPricePerMeterTjs: number;
  minPricePerMeterUsd: number;
  minTotalPriceTjs: number;
  minTotalPriceUsd: number;
  hasInstallment: boolean;
  installmentMonths: number;
  installmentDownPaymentPercent: number;
  hasUndergroundParking: boolean;
  hasElevator: boolean;
  hasPlayground: boolean;
  hasSecurity: boolean;
  hasAutonomousHeating: boolean;
  amenities: string[];
  amenitiesTg?: string[];
  coverImageUrl: string;
  images: string[];
  documents: { name: string; fileUrl: string }[];
  constructionProgress: { date: string; title: string; photos: string[] }[];
  coordinates?: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  latitude?: number;
  longitude?: number;
  locationFeatures?: {
    slug: string;
    icon_web?: string;
    icon_mobile?: string;
    name: string;
    nameTg?: string;
    value: string;
    valueTg?: string;
  }[];
  // Parking & Storage modules
  parkingConfig?: ProjectParkingConfig;
  storageConfig?: ProjectStorageConfig;
  parkingSpots?: ParkingSpot[];
  storageUnits?: StorageUnit[];
}

import {
  ProjectParkingConfig,
  ProjectStorageConfig,
  ParkingSpot,
  StorageUnit,
} from "@/types/parking-storage";
import {
  generateParkingSpotsForQayroqum,
  generateStorageUnitsForQayroqum,
} from "@/lib/parking-storage";
import { ISTIQLOL_DEVELOPER, ISTIQLOL_PROJECTS } from "./istiqlol-data";
import { TOJ_SOHTMON_DEVELOPER, TOJ_SOHTMON_PROJECTS } from "./toch-sohtmon-data";

export interface UnitData {
  id: string;
  projectId: string;
  unitNumber: string;
  type: "apartment" | "penthouse" | "commercial" | "studio";
  roomsCount: number;
  totalArea: number;
  livingArea?: number;
  kitchenArea?: number;
  floor: number;
  section: string; // "Секция 1", "Секция 2", "Секция 3"
  priceTjs: number;
  priceUsd: number;
  pricePerMeterTjs: number;
  pricePerMeterUsd: number;
  status: "available" | "reserved" | "sold";
  finishing: "rough" | "pre_finishing" | "turnkey";
  hasBalcony: boolean;
  hasTerrace: boolean;
  windowView?: string;
  layoutPlanUrl?: string;
}

export const INITIAL_DEVELOPERS: DeveloperData[] = [
  {
    id: "dev_qayroqum",
    name: "«Qayroqum Avenue» Development",
    slug: "qayroqum-avenue-dev",
    logoUrl: "/images/qayroqum/qayroqum-9.jpg",
    coverUrl: "/images/qayroqum/qayroqum-10.jpg",
    description:
      "Ширкати сохтмонии пешрафта дар вилояти Суғд. Бунёди маҷмааи муосири истиқоматии «Qayroqum Avenue» дар соҳили «Баҳри Тоҷик» бо мактаб, боғча, ҳавзи шиноварӣ ва таваққуфгоҳи 2-ошёна.",
    foundedYear: 2021,
    completedProjectsCount: 3,
    activeProjectsCount: 1,
    rating: "4.95",
    isVerified: true,
    city: "guliston",
    officeAddress: "ш. Гулистон (Қайроққум), шоҳроҳи Хуҷанд — Гулистон",
    phone: "+992 92 000 0000",
    phoneSecondary: "+992 92 000 1111",
    whatsapp: "+992920000000",
    telegram: "qayroqum_avenue",
    email: "info@qayroqum-avenue.tj",
    websiteUrl: "https://t.me/+S5SHHAVz_6g0Njli",
  },
  ISTIQLOL_DEVELOPER,
  TOJ_SOHTMON_DEVELOPER,
];

export const INITIAL_PROJECTS: ProjectData[] = [
  // 1. «Qayroqum Avenue» на первом месте
  {
    id: "proj_qayroqum",
    developerId: "dev_qayroqum",
    name: "ЖК «Qayroqum Avenue»",
    nameTg: "МҶ «Qayroqum Avenue»",
    slug: "qayroqum-avenue",
    shortDescription:
      "Флагманский жилой комплекс на берегу «Таджикского моря» со школой, детсадом и бассейном",
    shortDescriptionTg:
      "Муосиртарин маҷмааи истиқоматӣ дар соҳили «Баҳри Тоҷик» бо мактаб, боғча ва ҳавзи шиноварӣ",
    description:
      "«Qayroqum Avenue» — флагманский жилой комплекс премиум-класса в г. Гулистон (Кайраккум) на первой береговой линии Кайраккумского водохранилища («Таджикское море»). Цель проекта — создать курортную экосистему, где все необходимое для жизни находится прямо у вашего дома. На территории комплекса предусмотрены собственная общеобразовательная школа и детский сад, частная клиника, супермаркет, фермерский рынок и торговая галерея, премиальный фитнес-клуб с крытым бассейном и спортивными площадками, зеленые зоны отдыха, коворкинг, уютные кофейни и видовые рестораны. Для жителей строится двухуровневый подземный паркинг на более чем 500 машиномест с зарядными станциями для электромобилей, закрытый охраняемый двор без машин и круглосуточное видеонаблюдение 24/7.",
    descriptionTg:
      "«Qayroqum Avenue» — маҷмааи муосири истиқоматии дараҷаи олӣ дар ш. Гулистон (Қайроққум). Ҳадафи лоиҳа — фароҳам овардани муҳитест, ки тамоми имкониятҳои зарурии зиндагӣ ба хонаи шумо наздик бошанд. Дар ҳудуди маҷмаа мактаб ва боғчаи кӯдакон, клиникаи хусусӣ, супермаркет, бозор ва нуқтаҳои савдо, толори фитнес, ҳавзи шиноварӣ ва варзишгоҳи хурд, минтақаҳои сабзи истироҳатӣ, коворкинг, қаҳвахонаҳо ва тарабхонаҳо пешбинӣ шудаанд. Барои сокинон таваққуфгоҳи зеризаминии дуошёна барои беш аз 500 мошин бо нуқтаҳои пуркунии электромобилҳо, ҳудуди комилан пӯшида ва назорати видеоии 24-соата сохта мешавад.",
    status: "under_construction",
    buildingClass: "premium",
    finishing: "pre_finishing",
    city: "guliston",
    district: "Побережье «Таджикского моря»",
    districtTg: "Соҳили «Баҳри Тоҷик»",
    address: "г. Гулистон (Кайраккум), шоссе Худжанд — Гулистон",
    addressTg: "ш. Гулистон (Қайроққум), шоҳроҳи Хуҷанд — Гулистон",
    landmark: "Побережье «Таджикского моря» (Кайраккумское водохранилище)",
    landmarkTg: "Соҳили «Баҳри Тоҷик» (Обанбори Қайроққум)",
    floorsCount: 14,
    sectionsCount: 4,
    ceilingHeight: "3.30",
    constructionType: "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    deadlineQuarter: 4,
    deadlineYear: 2027,
    landArea: "2.4 га",
    wallMaterial: "Монолит + жженый кирпич и энергосберегающий блок",
    facade: "Вентилируемый керамогранит, панорамное остекление и ночная подсветка",
    cadastralNumber: "73:03:0010001:089",
    customBuildingFeatures: [
      { id: "cbf_q1", title: "Паркинг", value: "2-ошёна зеризаминӣ (500+ ҷой)" },
      { id: "cbf_q2", title: "Электромобилҳо", value: "Нуқтаҳои пуркунии барқӣ" },
      { id: "cbf_q3", title: "Амният", value: "Ҳудуди пӯшида, назорати 24/7" },
    ],
    finishingFeatures: [
      {
        id: "ff_q1",
        title: "Мактаб ва боғча дар ҳудуд",
        description:
          "Дар ҳудуди маҷмаа мактаби муосир ва кӯдакистони хусусӣ фаъолият хоҳад кард, то фарзандони шумо бехатар таълим гиранд.",
      },
      {
        id: "ff_q2",
        title: "Толори фитнес ва ҳавзи шиноварӣ",
        description:
          "Барои тарзи ҳаёти солим: ҳавзи пӯшидаи шиноварӣ, толори замонавии фитнес ва майдончаҳои варзишии кушода.",
      },
      {
        id: "ff_q3",
        title: "Таваққуфгоҳи 2-ошёна ва коворкинг",
        description:
          "Таваққуфгоҳи зеризаминии дуошёна барои 500+ мошин бо пуркунандаи электромобилҳо ва фазои коворкинг барои кор.",
      },
    ],
    minPricePerMeterTjs: 5250,
    minPricePerMeterUsd: 480,
    minTotalPriceTjs: 252000,
    minTotalPriceUsd: 23040,
    hasInstallment: true,
    installmentMonths: 60,
    installmentDownPaymentPercent: 0,
    hasUndergroundParking: true,
    hasElevator: true,
    hasPlayground: true,
    hasSecurity: true,
    hasAutonomousHeating: true,
    amenities: [
      "🔑 0% первоначальный взнос (лимитированная акция)",
      "📆 Беспроцентная рассрочка до 60 месяцев (5 лет!)",
      "💰 Скидка до $230 за каждый 1 м² при 100% оплате",
      "🎁 Более 100 ценных призов и шанс выиграть BMW",
      "📚 Собственная школа и частный детский сад на территории",
      "🏊‍♂️ Крытый бассейн, фитнес-центр и спортплощадки",
      "🚗 Двухуровневый подземный паркинг на 500+ авто",
      "⚡ Зарядные станции для электромобилей",
      "🔒 Закрытая территория и видеонаблюдение 24/7",
      "🌊 Панорамный вид на Таджикское море",
    ],
    amenitiesTg: [
      "🔑 0% пешпардохт (аксияи маҳдуд)",
      "📆 Пардохти қисм-қисм то 60 моҳ (5 сол)",
      "💰 То $230 тахфиф ба ҳар 1 м²",
      "🎁 Зиёда аз 100 туҳфа ва бурди BMW",
      "📚 Мактаб ва боғчаи хусусӣ дар ҳудуд",
      "🏊‍♂️ Ҳавзи шиноварӣ ва толори фитнес",
      "🚗 Таваққуфгоҳи дуошёна барои 500+ мошин",
      "⚡ Нуқтаҳои пуркунии электромобилҳо",
      "🔒 Ҳудуди пӯшида ва назорати 24-соата",
      "🌊 Намуди панорамӣ ба «Баҳри Тоҷик»",
    ],
    coverImageUrl: "/images/qayroqum/qayroqum-9.jpg",
    images: [
      "/images/qayroqum/qayroqum-9.jpg",
      "/images/qayroqum/qayroqum-10.jpg",
      "/images/qayroqum/qayroqum-11.jpg",
      "/images/qayroqum/qayroqum-12.jpg",
      "/images/qayroqum/qayroqum-1.jpg",
      "/images/qayroqum/qayroqum-2.jpg",
      "/images/qayroqum/qayroqum-3.jpg",
      "/images/qayroqum/qayroqum-4.jpg",
      "/images/qayroqum/qayroqum-5.jpg",
      "/images/qayroqum/qayroqum-6.jpg",
      "/images/qayroqum/qayroqum-7.jpg",
      "/images/qayroqum/qayroqum-8.jpg",
    ],
    documents: [
      { name: "Муаррифии расмии «Qayroqum Avenue»", fileUrl: "https://t.me/+S5SHHAVz_6g0Njli" },
      { name: "Шартҳои аксия ва бурди BMW", fileUrl: "https://t.me/+S5SHHAVz_6g0Njli" },
    ],
    constructionProgress: [
      {
        date: "Октябр 2026",
        title: "Оғози корҳои заминӣ ва тайёрӣ ба таҳкурсии блокҳои 1 ва 2",
        photos: ["/images/qayroqum/qayroqum-11.jpg"],
      },
    ],
    coordinates: {
      lat: 40.265442,
      lng: 69.796114,
      zoom: 14,
    },
    latitude: 40.265442,
    longitude: 69.796114,
    parkingConfig: {
      isEnabled: true,
      title: "Паркинг",
      titleTg: "Таваққуфгоҳ",
      subtitle: "Подземные паркинги",
      subtitleTg: "Таваққуфгоҳҳои зеризаминӣ",
      description:
        "Двухуровневый подземный паркинг на 500+ машино-мест с круглосуточным доступом на лифте прямо с жилых этажей. Оборудован скоростными автоматическими воротами, зарядными станциями для электромобилей, системой спринклерного пожаротушения, приточно-вытяжной вентиляцией и видеонаблюдением 24/7. В наличии стандартные, увеличенные и семейные двойные места.",
      descriptionTg:
        "Таваққуфгоҳи зеризаминии 2-ошёна барои беш аз 500 мошин бо дастрасии мустақим тавассути лифт аз ошёнаҳои истиқоматӣ. Муҷаҳҳаз бо дарвозаҳои худкор, нуқтаҳои пуркунии барқии электромобилҳо, системаи зиддисӯхтор, вентилятсияи ҳаво ва назорати видеоии шабонарӯзии 24/7. Ҷойҳои стандартии васеъ ва оилавии дукарата дастрасанд.",
      images: [
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&h=600&fit=crop",
      ],
      isChessboardPublished: true,
      totalSpots: 38,
      availableSpots: 24,
      minPriceTjs: 19710,
      minPriceUsd: 1800,
    },
    storageConfig: {
      isEnabled: true,
      title: "Кладовые",
      titleTg: "Анборхонаҳо",
      subtitle: "Кладовые для хранения вещей",
      subtitleTg: "Анборхонаҳо барои нигоҳдории ашё",
      description:
        "Индивидуальные отапливаемые кладовые помещения в цокольном этаже площадью от 3.2 до 7.6 м². Идеальное решение для сезонного хранения шин, велосипедов, чемоданов и спортинвентаря, освобождающее пространство в квартире. Оснащены прочными металлическими дверями, приточной вентиляцией и системой контроля доступа.",
      descriptionTg:
        "Анборхонаҳои инфиродии гармшуда дар ошёнаи таҳхона бо масоҳати аз 3.2 то 7.6 м². Роҳи беҳтарин барои нигоҳдории чархҳои мавсимӣ, дучархаҳо, ҷомадон ва ашёи варзишӣ барои озод нигоҳ доштани фазои хонадон. Бо дари оҳанин, вентилятсияи доимӣ ва низоми назорати дастрасӣ муҷаҳҳаз гардидаанд.",
      images: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&h=600&fit=crop",
      ],
      isChessboardPublished: true,
      totalUnits: 16,
      availableUnits: 11,
      minPriceTjs: 11200,
      minPriceUsd: 1024,
    },
    parkingSpots: generateParkingSpotsForQayroqum(),
    storageUnits: generateStorageUnitsForQayroqum(),
  },

  // 2. Все 15 реальных ЖК строительной фирмы «Истиқлол Гурӯҳ» (Istiqlol Group)
  ...ISTIQLOL_PROJECTS,

  // 3. Все 9 реальных ЖК строительной фирмы «Тоҷ Сохтмон» (Toj Sohtmon)
  ...TOJ_SOHTMON_PROJECTS,

  // 4. ЖК «Сирдарё Плаза» (архивный проект)
  {
    id: "proj_sirdaryo_plaza",
    developerId: "dev_rahsh",
    name: "ЖК «Сирдарё Плаза»",
    nameTg: "МҶ «Сирдарё Плаза»",
    slug: "sirdaryo-plaza",
    shortDescription:
      "Элитный 16-этажный комплекс на набережной Сырдарьи с панорамным видом",
    shortDescriptionTg:
      "Маҷмааи истиқоматии 16-ошёнаи дараҷаи олӣ дар соҳили дарёи Сир бо манзараи панорамӣ",
    description:
      "ЖК «Сирдарё Плаза» расположен в самом престижном районе Худжанда — 19 микрорайоне на первой линии реки Сырдарья. В комплексе предусмотрены скоростные бесшумные лифты, двухуровневый подземный паркинг, автономная котельная, система очистки воды и закрытый охраняемый двор без машин.",
    descriptionTg:
      "Маҷмааи истиқоматии «Сирдарё Плаза» дар минтақаи бонуфузи шаҳри Хуҷанд — микрорайони 19 дар соҳили дарёи Сир ҷойгир аст. Дар маҷмаа лифтҳои босуръати бесадо, таваққуфгоҳи зеризаминии 2-ошёна, гармидиҳии мустақил ва ҳавлии пӯшидаи ободу муҳофизатшаванда пешбинӣ шудаанд.",
    status: "under_construction",
    buildingClass: "business",
    finishing: "rough",
    city: "khujand",
    district: "19 мкр",
    districtTg: "микрорайони 19",
    address: "19-й микрорайон, набережная Сырдарьи 14",
    addressTg: "микрорайони 19, соҳили Сирдарё 14",
    landmark: "Напротив парка Камоли Худжанди и памятника Исмоила Сомони",
    landmarkTg: "Рӯ ба рӯи боғи Камоли Хуҷандӣ ва ҳайкали Исмоили Сомонӣ",
    floorsCount: 16,
    sectionsCount: 3,
    ceilingHeight: "3.20",
    constructionType: "Монолитно-каркасный с кирпичным заполнением",
    deadlineQuarter: 4,
    deadlineYear: 2026,
    landArea: "0.85 га",
    wallMaterial: "Газоблок 300 мм + жженый кирпич",
    facade: "Клинкерная плитка и вентилируемый керамогранит",
    cadastralNumber: "73:01:0014002:114",
    customBuildingFeatures: [
      { id: "cbf_1", title: "Отопление", value: "Общее (собственная котельная)" },
      { id: "cbf_2", title: "Остекление", value: "Панорамное (Германия)" },
      { id: "cbf_3", title: "Система очистки", value: "Многоступенчатая фильтрация воды" },
    ],
    finishingFeatures: [
      {
        id: "ff_1",
        title: "IP-видеодомофон",
        description: "В каждой квартире установлен IP-видеодомофон с возможностью интеграции в систему «Умный дом» и выводом камеры на экран смартфона.",
      },
      {
        id: "ff_2",
        title: "Входная дверь",
        description: "Бронированные стальные двери 120 мм с замками 4-го класса взломостойкости и итальянской фурнитурой.",
      },
      {
        id: "ff_3",
        title: "Электропроводка",
        description: "Медный кабель ГОСТ, разводка до щитка с УЗО и автоматами Schneider Electric, ввод оптоволоконного интернета.",
      },
    ],
    minPricePerMeterTjs: 6570,
    minPricePerMeterUsd: 600,
    minTotalPriceTjs: 348210,
    minTotalPriceUsd: 31800,
    hasInstallment: true,
    installmentMonths: 24,
    installmentDownPaymentPercent: 30,
    hasUndergroundParking: true,
    hasElevator: true,
    hasPlayground: true,
    hasSecurity: true,
    hasAutonomousHeating: true,
    amenities: [
      "Панорамный вид на Сырдарью",
      "Двухуровневый подземный паркинг",
      "Беспроцентная рассрочка до 24 мес",
      "Охраняемая территория 24/7",
      "Детские и спортивные площадки",
      "Собственная управляющая компания",
    ],
    amenitiesTg: [
      "Манзараи панорамӣ ба дарёи Сир",
      "Таваққуфгоҳи зеризаминии 2-ошёна",
      "Пардохти қисм-қисми бефоиз то 24 моҳ",
      "Ҳудуди муҳофизатшавандаи 24/7",
      "Майдончаҳои варзишӣ ва кӯдакона",
      "Ширкати идоракунандаи шахсӣ",
    ],
    coverImageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    ],
    documents: [
      { name: "Разрешение на строительство №142/24", fileUrl: "#" },
      { name: "Проектная декларация и заключение сейсмоэкспертизы 9 баллов", fileUrl: "#" },
    ],
    constructionProgress: [
      {
        date: "Май 2026",
        title: "Возведение монолитного каркаса 12-го этажа",
        photos: [
          "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=600&fit=crop",
        ],
      },
      {
        date: "Февраль 2026",
        title: "Завершение работ по подземному паркингу",
        photos: [
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&fit=crop",
        ],
      },
    ],
    coordinates: {
      lat: 40.292480,
      lng: 69.621112,
      zoom: 14,
    },
    latitude: 40.292480,
    longitude: 69.621112,
  },
];

// Генератор реалистичных юнитов (квартир) для шахматки ЖК «Сирдарё Плаза»
export function generateUnitsForSirdaryoPlaza(): UnitData[] {
  const units: UnitData[] = [];
  const sections = ["Секция 1", "Секция 2", "Секция 3"];
  const totalFloors = 12; // для наглядной шахматки сделаем 12 этажей x 3 секции

  // Шаблоны квартир на площадке секции (по 3 квартиры на этаже каждой секции)
  const floorTemplates = [
    {
      unitSuffix: "A",
      rooms: 1,
      area: 53.0,
      pricePerMUsd: 600,
      planImg:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&fit=crop",
      view: "Вид на Сырдарью",
    },
    {
      unitSuffix: "B",
      rooms: 2,
      area: 78.5,
      pricePerMUsd: 610,
      planImg:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&fit=crop",
      view: "Вид на парк и набережную",
    },
    {
      unitSuffix: "C",
      rooms: 3,
      area: 115.0,
      pricePerMUsd: 630,
      planImg:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&fit=crop",
      view: "Панорама реки и гор Моголтау",
    },
  ];

  let unitCounter = 1;

  for (let floor = totalFloors; floor >= 1; floor--) {
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const section = sections[sIndex];

      for (let tIndex = 0; tIndex < floorTemplates.length; tIndex++) {
        const tpl = floorTemplates[tIndex];
        const unitNumber = `Кв. ${unitCounter++}`;

        // Распределим статусы реалистично: верхние этажи частично проданы/бронь
        let status: "available" | "reserved" | "sold" = "available";
        const pseudoRandom = (floor * 7 + sIndex * 5 + tIndex * 3) % 10;
        if (pseudoRandom === 1 || pseudoRandom === 5) {
          status = "reserved";
        } else if (pseudoRandom === 2 || pseudoRandom === 8 || floor <= 3) {
          status = "sold";
        }

        const priceUsd = Math.round(tpl.area * tpl.pricePerMUsd);
        const priceTjs = Math.round(priceUsd * 10.95);
        const pricePerMeterTjs = Math.round(tpl.pricePerMUsd * 10.95);

        units.push({
          id: `unit_${floor}_${sIndex + 1}_${tIndex + 1}`,
          projectId: "proj_sirdaryo_plaza",
          unitNumber,
          type: floor === 12 && tpl.rooms === 3 ? "penthouse" : "apartment",
          roomsCount: tpl.rooms,
          totalArea: tpl.area,
          livingArea: Math.round(tpl.area * 0.65),
          kitchenArea: Math.round(tpl.area * 0.18),
          floor,
          section,
          priceTjs,
          priceUsd,
          pricePerMeterTjs,
          pricePerMeterUsd: tpl.pricePerMUsd,
          status,
          finishing: "rough",
          hasBalcony: true,
          hasTerrace: floor === 12,
          windowView: tpl.view,
          layoutPlanUrl: tpl.planImg,
        });
      }
    }
  }

  return units;
}

// Генератор квартир для шахматки ЖК «Qayroqum Avenue» (Гулистон / Кайраккум)
export function generateUnitsForQayroqum(): UnitData[] {
  const units: UnitData[] = [];
  const sections = ["Секция 1", "Секция 2", "Секция 3", "Секция 4"];
  const totalFloors = 14;

  const floorTemplates = [
    {
      unitSuffix: "A",
      rooms: 1,
      area: 48.0,
      pricePerMUsd: 480,
      planImg: "/images/qayroqum/qayroqum-7.jpg",
      view: "Вид на сабзазор ва фаввораҳо",
    },
    {
      unitSuffix: "B",
      rooms: 2,
      area: 74.5,
      pricePerMUsd: 490,
      planImg: "/images/qayroqum/qayroqum-8.jpg",
      view: "Вид на соҳили «Баҳри Тоҷик»",
    },
    {
      unitSuffix: "C",
      rooms: 3,
      area: 108.0,
      pricePerMUsd: 510,
      planImg: "/images/qayroqum/qayroqum-5.jpg",
      view: "Панорамаи «Баҳри Тоҷик» ва кӯҳҳо",
    },
    {
      unitSuffix: "D",
      rooms: 4,
      area: 142.0,
      pricePerMUsd: 530,
      planImg: "/images/qayroqum/qayroqum-6.jpg",
      view: "Панорамаи пурраи соҳили баҳр",
    },
  ];

  let unitCounter = 1;

  for (let floor = totalFloors; floor >= 1; floor--) {
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const section = sections[sIndex];

      for (let tIndex = 0; tIndex < floorTemplates.length; tIndex++) {
        const tpl = floorTemplates[tIndex];
        const unitNumber = `Кв. ${unitCounter++}`;

        let status: "available" | "reserved" | "sold" = "available";
        const pseudo = (floor * 5 + sIndex * 7 + tIndex * 2) % 10;
        if (pseudo === 1 || pseudo === 4) {
          status = "reserved";
        } else if (pseudo === 2 || pseudo === 7 || floor <= 2) {
          status = "sold";
        }

        const priceUsd = Math.round(tpl.area * tpl.pricePerMUsd);
        const priceTjs = Math.round(priceUsd * 10.95);
        const pricePerMeterTjs = Math.round(tpl.pricePerMUsd * 10.95);

        units.push({
          id: `unit_qayroqum_${floor}_${sIndex + 1}_${tIndex + 1}`,
          projectId: "proj_qayroqum",
          unitNumber,
          type: floor === 14 ? "penthouse" : "apartment",
          roomsCount: tpl.rooms,
          totalArea: tpl.area,
          livingArea: Math.round(tpl.area * 0.65),
          kitchenArea: Math.round(tpl.area * 0.18),
          floor,
          section,
          priceTjs,
          priceUsd,
          pricePerMeterTjs,
          pricePerMeterUsd: tpl.pricePerMUsd,
          status,
          finishing: "pre_finishing",
          hasBalcony: true,
          hasTerrace: floor === 14,
          windowView: tpl.view,
          layoutPlanUrl: tpl.planImg,
        });
      }
    }
  }

  return units;
}

export const INITIAL_UNITS: UnitData[] = [
  ...generateUnitsForSirdaryoPlaza(),
  ...generateUnitsForQayroqum(),
];
