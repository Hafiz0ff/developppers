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

export interface ProjectData {
  id: string;
  developerId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: "planned" | "under_construction" | "ready";
  buildingClass: "economy" | "comfort" | "business" | "premium";
  finishing: "rough" | "pre_finishing" | "turnkey";
  city: string;
  district: string;
  address: string;
  landmark: string;
  floorsCount: number;
  sectionsCount: number;
  ceilingHeight: string;
  constructionType: string;
  deadlineQuarter: number;
  deadlineYear: number;
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
  coverImageUrl: string;
  images: string[];
  documents: { name: string; fileUrl: string }[];
  constructionProgress: { date: string; title: string; photos: string[] }[];
}

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
    id: "dev_rahsh",
    name: "Рахш Сохтмон",
    slug: "rahsh-sohtmon",
    logoUrl:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=200&h=200&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=600&fit=crop",
    description:
      "Ведущая строительная компания Согдийской области с 2012 года. Мы возводим современные сейсмостойкие жилые комплексы с использованием европейских материалов и автономных инженерных коммуникаций.",
    foundedYear: 2012,
    completedProjectsCount: 8,
    activeProjectsCount: 3,
    rating: "4.90",
    isVerified: true,
    city: "khujand",
    officeAddress: "г. Худжанд, проспект Исмоили Сомони, 142",
    phone: "+992 92 700 5555",
    phoneSecondary: "+992 92 700 7777",
    whatsapp: "+992927005555",
    telegram: "rahsh_sales",
    email: "info@rahsh-stroy.tj",
    websiteUrl: "https://rahsh-stroy.tj",
  },
  {
    id: "dev_sayhun",
    name: "Сайҳун Девелопмент",
    slug: "sayhun-development",
    logoUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=600&fit=crop",
    description:
      "Специализируемся на возведении кварталов комфорт-класса в 18 и 19 микрорайонах Худжанда со встроенной социальной инфраструктурой.",
    foundedYear: 2016,
    completedProjectsCount: 5,
    activeProjectsCount: 2,
    rating: "4.85",
    isVerified: true,
    city: "khujand",
    officeAddress: "г. Худжанд, 19-й микрорайон, набережная Сырдарьи",
    phone: "+992 92 811 4444",
    whatsapp: "+992928114444",
    telegram: "sayhun_realty",
    email: "sales@sayhun.tj",
  },
];

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: "proj_sirdaryo_plaza",
    developerId: "dev_rahsh",
    name: "ЖК «Сирдарё Плаза»",
    slug: "sirdaryo-plaza",
    shortDescription:
      "Элитный 16-этажный комплекс на набережной Сырдарьи с панорамным видом",
    description:
      "ЖК «Сирдарё Плаза» расположен в самом престижном районе Худжанда — 19 микрорайоне на первой линии реки Сырдарья. В комплексе предусмотрены скоростные бесшумные лифты, двухуровневый подземный паркинг, автономная котельная, система очистки воды и закрытый охраняемый двор без машин.",
    status: "under_construction",
    buildingClass: "business",
    finishing: "rough",
    city: "khujand",
    district: "19 мкр",
    address: "19-й микрорайон, набережная Сырдарьи 14",
    landmark: "Напротив парка Камоли Худжанди и памятника Исмоила Сомони",
    floorsCount: 16,
    sectionsCount: 3,
    ceilingHeight: "3.20",
    constructionType: "Монолитно-каркасный с кирпичным заполнением",
    deadlineQuarter: 4,
    deadlineYear: 2026,
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
      "Бесшумные скоростные лифты",
      "Охраняемая территория 24/7",
      "Детские и спортивные площадки",
      "Собственная управляющая компания",
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
  },
  {
    id: "proj_sugdiyon",
    developerId: "dev_sayhun",
    name: "ЖК «Суғдиён Сити»",
    slug: "sugdiyon-city",
    shortDescription: "Семейный жилой квартал в 18 микрорайоне Худжанда",
    description:
      "Современный жилой комплекс комфорт-класса, созданный для счастливой жизни семей. В шаговой доступности школа №28, детский сад и гипермаркет.",
    status: "under_construction",
    buildingClass: "comfort",
    finishing: "rough",
    city: "khujand",
    district: "18 мкр",
    address: "18-й микрорайон, проспект Гафурова 4",
    landmark: "Рядом с супермаркетом «Амид»",
    floorsCount: 12,
    sectionsCount: 2,
    ceilingHeight: "3.00",
    constructionType: "Монолитно-каркасный",
    deadlineQuarter: 2,
    deadlineYear: 2027,
    minPricePerMeterTjs: 5475,
    minPricePerMeterUsd: 500,
    minTotalPriceTjs: 262800,
    minTotalPriceUsd: 24000,
    hasInstallment: true,
    installmentMonths: 36,
    installmentDownPaymentPercent: 20,
    hasUndergroundParking: false,
    hasElevator: true,
    hasPlayground: true,
    hasSecurity: true,
    hasAutonomousHeating: true,
    amenities: ["Беспроцентная рассрочка 36 мес", "Школа №28", "Закрытый двор"],
    coverImageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
    ],
    documents: [{ name: "Проектная декларация ЖК «Суғдиён»", fileUrl: "#" }],
    constructionProgress: [],
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

export const INITIAL_UNITS: UnitData[] = generateUnitsForSirdaryoPlaza();
