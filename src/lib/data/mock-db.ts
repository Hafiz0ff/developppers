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
    landArea: "0.45 га",
    wallMaterial: "Газоблок",
    facade: "Декоративная штукатурка с элементами травертина",
    cadastralNumber: "73:01:0018005:42",
    customBuildingFeatures: [
      { id: "cbf_4", title: "Отопление", value: "Индивидуальное автономное" },
    ],
    finishingFeatures: [
      {
        id: "ff_4",
        title: "Шумоизоляция",
        description: "Усиленная межквартирная звукоизоляция из минераловатных плит толщиной 50 мм в стяжке пола.",
      },
    ],
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
  {
    id: "proj_qayroqum",
    developerId: "dev_qayroqum",
    name: "ЖК «Qayroqum Avenue»",
    slug: "qayroqum-avenue",
    shortDescription:
      "Муосиртарин маҷмааи истиқоматӣ дар соҳили «Баҳри Тоҷик» бо мактаб, боғча ва ҳавзи шиноварӣ",
    description:
      "«Qayroqum Avenue» — маҷмааи муосири истиқоматии дараҷаи олӣ дар ш. Гулистон (Қайроққум). Ҳадафи лоиҳа — фароҳам овардани муҳитест, ки тамоми имкониятҳои зарурии зиндагӣ ба хонаи шумо наздик бошанд. Дар ҳудуди маҷмаа мактаб ва боғчаи кӯдакон, клиникаи хусусӣ, супермаркет, бозор ва нуқтаҳои савдо, толори фитнес, ҳавзи шиноварӣ ва варзишгоҳи хурд, минтақаҳои сабзи истироҳатӣ, коворкинг, қаҳвахонаҳо ва тарабхонаҳо пешбинӣ шудаанд. Барои сокинон таваққуфгоҳи зеризаминии дуошёна барои беш аз 500 мошин бо нуқтаҳои пуркунии электромобилҳо, ҳудуди комилан пӯшида ва назорати видеоии 24-соата сохта мешавад.",
    status: "under_construction",
    buildingClass: "premium",
    finishing: "pre_finishing",
    city: "guliston",
    district: "Побережье «Таджикского моря»",
    address: "ш. Гулистон (Қайроққум), шоҳроҳи Хуҷанд — Гулистон",
    landmark: "Соҳили «Баҳри Тоҷик» (Таджикское море)",
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
