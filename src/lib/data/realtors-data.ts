/**
 * MASKANI.TJ — Certified Public Realtors Catalog Data
 * Real estate specialists directory conforming to Stage 2 Specification (AC-10, AC-14)
 */

export interface RealtorData {
  id: string;
  slug: string;
  name: string;
  nameTg: string;
  agencyName?: string;
  agencyNameTg?: string;
  phone: string;
  whatsapp: string;
  rating: string;
  reviewsCount: number;
  dealsCount: number;
  experienceYears: number;
  city: string;
  specialization: string;
  specializationTg: string;
  districts: string[];
  photoUrl: string;
  isVerified: boolean;
  bio: string;
  bioTg: string;
}

export const REALTORS_DATA: RealtorData[] = [
  {
    id: "rlt_01",
    slug: "rustam-ahmedov",
    name: "Рустам Ахмедов",
    nameTg: "Рустам Аҳмедов",
    agencyName: "«Согд Капитал Недвижимость»",
    agencyNameTg: "«Суғд Капитал Амвол»",
    phone: "+992 92 770 1122",
    whatsapp: "+992927701122",
    rating: "4.98",
    reviewsCount: 42,
    dealsCount: 84,
    experienceYears: 7,
    city: "khujand",
    specialization: "Вторичный рынок и новостройки премиум-класса",
    specializationTg: "Бозори дуюмдараҷа ва навсохтҳои дараҷаи олӣ",
    districts: ["Центр", "18-й микрорайон", "Шёлкокомбинат"],
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    isVerified: true,
    bio: "Аттестованный специалист по недвижимости Худжанда. 7 лет успешной практики, эксперт по сложным цепочкам сделок и инвестициям.",
    bioTg: "Мутахассиси аттестатсияшудаи амволи Хуҷанд. 7 соли таҷриба, коршиноси аҳдҳои мураккаб ва сармоягузорӣ.",
  },
  {
    id: "rlt_02",
    slug: "zarina-komilova",
    name: "Зарина Комилова",
    nameTg: "Зарина Комилова",
    agencyName: "«Шаҳри Зебо» Realty",
    agencyNameTg: "«Шаҳри Зебо» Realty",
    phone: "+992 92 881 3344",
    whatsapp: "+992928813344",
    rating: "4.95",
    reviewsCount: 38,
    dealsCount: 62,
    experienceYears: 5,
    city: "khujand",
    specialization: "Жилая аренда и продажа 1-3 комнатных квартир",
    specializationTg: "Иҷораи истиқоматӣ ва фурӯши хонадонҳои 1-3 ҳуҷрагӣ",
    districts: ["8-й микрорайон", "12-й микрорайон", "Панджшанбе"],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    isVerified: true,
    bio: "Специалист по подбору жилья для семей и экспатов. Быстрый выход на сделку, проверка юридической чистоты каждого объекта.",
    bioTg: "Коршинос оид ба интихоби манзил барои оилаҳо. Баромад ба аҳд дар фурсати кӯтоҳ, санҷиши пурраи ҳуҷҷатҳо.",
  },
  {
    id: "rlt_03",
    slug: "dilshod-sharipov",
    name: "Дильшод Шарипов",
    nameTg: "Дилшод Шарифов",
    agencyName: "Частный риелтор (ИП Шарипов)",
    agencyNameTg: "Риелтори инфиродӣ (СИ Шарифов)",
    phone: "+992 92 994 5566",
    whatsapp: "+992929945566",
    rating: "4.92",
    reviewsCount: 29,
    dealsCount: 47,
    experienceYears: 6,
    city: "khujand",
    specialization: "Частные дома, дачи и земельные участки",
    specializationTg: "Ҳавлиҳо, дачаҳо ва қитъаҳои замин",
    districts: ["Раззок", "Махалля Садир Шариф", "Гафуров"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    isVerified: true,
    bio: "Эксперт по загородной и малоэтажной недвижимости. Оценка земельных участков, оформление кадастровых паспортов и техпаспортов БТИ.",
    bioTg: "Коршиноси амволи беруназшаҳрӣ ва ҳавлиҳо. Баҳодиҳии замин ва тартиб додани ҳуҷҷатҳои КДХ ва БТИ.",
  },
  {
    id: "rlt_04",
    slug: "malika-usmonova",
    name: "Малика Усмонова",
    nameTg: "Малика Усмонова",
    agencyName: "«Амволи Суғд»",
    agencyNameTg: "«Амволи Суғд»",
    phone: "+992 92 662 7788",
    whatsapp: "+992926627788",
    rating: "4.90",
    reviewsCount: 24,
    dealsCount: 39,
    experienceYears: 4,
    city: "khujand",
    specialization: "Коммерческая недвижимость и аренда офисов",
    specializationTg: "Амволи тиҷоратӣ ва иҷораи офисҳо",
    districts: ["Центр", "Пр. И. Сомони", "Бозори Панҷшанбе"],
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    isVerified: true,
    bio: "Подбор торговых площадей, складов и представительских офисов для бизнеса в Худжанде и по Согдийской области.",
    bioTg: "Интихоби майдонҳои тиҷоратӣ, анборҳо ва дафтарҳои корӣ барои соҳибкорон дар Хуҷанд ва вилояти Суғд.",
  },
];
