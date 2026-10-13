export interface CatalogProperty {
  id: string;
  title: string;
  dealType: "Продажа" | "Аренда";
  propertyType: "Квартира" | "Дом / Ҳавлӣ" | "Новостройка" | "Коммерция";
  city: string;
  district: string;
  landmark: string;
  rooms: number;
  area: number;
  floor?: string;
  landArea?: string;
  priceTjs: number;
  priceUsd: number;
  sellerType: string;
  phone: string;
  whatsapp: string;
  isNegotiable: boolean;
  image: string;
  images?: string[];
  floorPlanImage?: string;
  features: string[];
  description?: string;
}

export const CATALOG_PROPERTIES: CatalogProperty[] = [
  {
    id: "c1",
    title: "3-комнатная квартира с дизайнерским евроремонтом",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "г. Худжанд",
    district: "18-й микрорайон",
    landmark: "Напротив школы №28",
    rooms: 3,
    area: 76,
    floor: "3 из 5 этаж",
    priceTjs: 536550,
    priceUsd: 49000,
    sellerType: "Риелтор (Сугд-Инвест)",
    phone: "+992 92 888 1234",
    whatsapp: "+992928881234",
    isNegotiable: true,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80",
    ],
    floorPlanImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    features: ["Евроремонт", "С итальянской мебелью", "Автономное отопление", "Окна во двор"],
    description:
      "Светлая уютная квартира в одном из самых развитых районов Худжанда. Полностью заменена проводка и сантехника, теплые полы, новая кухонная гарнитура со встроенной техникой. Рядом парк, супермаркет и школа.",
  },
  {
    id: "c2",
    title: "Благоустроенный традиционный дом (Ҳавлӣ) 6.5 соток",
    dealType: "Продажа",
    propertyType: "Дом / Ҳавлӣ",
    city: "Б. Гафуров",
    district: "Джамоат Унчи",
    landmark: "Около мечети Унчи",
    rooms: 5,
    area: 180,
    landArea: "6.5 соток",
    priceTjs: 711750,
    priceUsd: 65000,
    sellerType: "Собственник",
    phone: "+992 92 999 4321",
    whatsapp: "+992929994321",
    isNegotiable: true,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop&q=80",
    ],
    features: ["Фруктовый сад", "Хауз 10 тонн", "Гараж на 2 авто", "Летняя кухня (айван)"],
    description:
      "Качественный кирпичный дом с высоким фундаментом. Ухоженный двор с плодовыми деревьями (абрикос, инжир, хурма), традиционный айван, постоянная родниковая вода, природный газ и свет 24/7.",
  },
  {
    id: "c3",
    title: "Торговое помещение у рынка «Панчшанбе»",
    dealType: "Аренда",
    propertyType: "Коммерция",
    city: "г. Худжанд",
    district: "Центр / Панчшанбе",
    landmark: "50 метров от главных ворот рынка",
    rooms: 1,
    area: 65,
    floor: "1-й этаж (первая линия)",
    priceTjs: 8500,
    priceUsd: 776,
    sellerType: "Агентство",
    phone: "+992 92 888 1234",
    whatsapp: "+992928881234",
    isNegotiable: false,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80",
    ],
    features: ["Первая линия", "Витринные панорамные окна", "Кондиционер зима-лето", "Пешеходный трафик"],
    description:
      "Высочайшая проходимость в центре города. Идеально под аптеку, брендовый бутик, филиал банка или кофейню. Все коммуникации подключены, установлена охранная сигнализация.",
  },
  {
    id: "c4",
    title: "2-комнатная квартира в ЖК «Согдиана» (Новостройка)",
    dealType: "Продажа",
    propertyType: "Новостройка",
    city: "г. Худжанд",
    district: "19-й микрорайон",
    landmark: "Рядом с ТЦ «Амид»",
    rooms: 2,
    area: 64,
    floor: "6 из 12 этаж",
    priceTjs: 416100,
    priceUsd: 38000,
    sellerType: "Застройщик (Рахш Сохтмон)",
    phone: "+992 92 700 0011",
    whatsapp: "+992927000011",
    isNegotiable: true,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1000&auto=format&fit=crop&q=80",
    ],
    features: ["Монолитный каркас", "Панорамный балкон", "Подземный паркинг", "Бесшумный лифт"],
    description:
      "Современная квартира свободной планировки в премиальном жилом комплексе. Высота потолков 3.10м. Закрытая охраняемая территория, видеонаблюдение 24/7, детская игровая площадка.",
  },
];

export function getPropertyById(id: string): CatalogProperty | undefined {
  return CATALOG_PROPERTIES.find((p) => p.id === id);
}

export function getPropertiesByIds(ids: string[]): CatalogProperty[] {
  return CATALOG_PROPERTIES.filter((p) => ids.includes(p.id));
}
