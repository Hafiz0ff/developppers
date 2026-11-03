/**
 * MASKANI.TJ — Real Estate & Home Services Directory
 * Conforms to Stage 2 Specification (AC-09, AC-14, AC-16)
 */

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  titleTg: string;
  category: string;
  categoryTg: string;
  priceStartingFromTjs: number;
  priceStartingFromUsd: number;
  priceUnit: string;
  priceUnitTg: string;
  providerName: string;
  providerNameTg: string;
  phone: string;
  whatsapp: string;
  rating: string;
  reviewsCount: number;
  isVerified: boolean;
  city: string;
  iconName: string; // Lucide icon identifier
  imageUrl: string;
  shortDescription: string;
  shortDescriptionTg: string;
}

export const SERVICES_DATA: ServiceData[] = [
  {
    id: "srv_legal",
    slug: "yuridicheskoe-soprovozhdenie",
    title: "Юридическое сопровождение сделок",
    titleTg: "Ҳамроҳии ҳуқуқии аҳдҳо",
    category: "Юриспруденция и нотариат",
    categoryTg: "Ҳуқуқ ва нотариат",
    priceStartingFromTjs: 500,
    priceStartingFromUsd: 45,
    priceUnit: "за договор",
    priceUnitTg: "барои шартнома",
    providerName: "Юридический центр «Ҳимоят»",
    providerNameTg: "Маркази ҳуқуқии «Ҳимоят»",
    phone: "+992 92 770 9900",
    whatsapp: "+992927709900",
    rating: "4.96",
    reviewsCount: 52,
    isVerified: true,
    city: "khujand",
    iconName: "ShieldCheck",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&h=400&fit=crop",
    shortDescription: "Полная проверка юридической чистоты квартиры, истории собственников, отсутствие обременений в БТИ и сопровождение нотариальной сделки.",
    shortDescriptionTg: "Санҷиши пурраи таърихи соҳибмулкон, набудани баҳс дар БТИ ва назорати пурраи бақайдгирии нотариалӣ.",
  },
  {
    id: "srv_valuation",
    slug: "otsenka-nedvizhimosti",
    title: "Независимая экспертная оценка",
    titleTg: "Баҳодиҳии мустақили амвол",
    category: "Оценка и экспертиза",
    categoryTg: "Баҳодиҳӣ ва экспертиза",
    priceStartingFromTjs: 400,
    priceStartingFromUsd: 36,
    priceUnit: "за отчёт",
    priceUnitTg: "барои ҳисобот",
    providerName: "ООО «Суғд Эксперт Баҳо»",
    providerNameTg: "ҶДММ «Суғд Эксперт Баҳо»",
    phone: "+992 92 884 2211",
    whatsapp: "+992928842211",
    rating: "4.92",
    reviewsCount: 39,
    isVerified: true,
    city: "khujand",
    iconName: "Calculator",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
    shortDescription: "Официальный отчёт об оценке для банков Таджикистана (Банк Эсхата, Ориёнбанк), ипотеки, залога и судебных споров.",
    shortDescriptionTg: "Ҳисоботи расмии баҳодиҳӣ барои бонкҳои Тоҷикистон (Эсхата, Ориёнбонк), ипотека ва гарав.",
  },
  {
    id: "srv_interior",
    slug: "dizayn-interyera-3d",
    title: "Дизайн интерьера и 3D-планировка",
    titleTg: "Тарроҳии дохилӣ ва тарҳи 3D",
    category: "Архитектура и дизайн",
    categoryTg: "Меъморӣ ва тарроҳӣ",
    priceStartingFromTjs: 120,
    priceStartingFromUsd: 11,
    priceUnit: "за м²",
    priceUnitTg: "барои м²",
    providerName: "Студия архитектуры «Mekmor»",
    providerNameTg: "Студияи меъмории «Меъмор»",
    phone: "+992 92 711 5566",
    whatsapp: "+992927115566",
    rating: "4.98",
    reviewsCount: 46,
    isVerified: true,
    city: "khujand",
    iconName: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
    shortDescription: "Разработка авторского дизайн-проекта новостройки: 3D-визуализация комнат, схемы электрики, сантехники и спецификация мебели.",
    shortDescriptionTg: "Тарҳрезии муаллифии хонадон дар навсохтҳо: тарҳи 3D, нақшаи барқ ва обу таҷҳизот бо ҳисоби масолеҳ.",
  },
  {
    id: "srv_renovation",
    slug: "remont-kvartir-pod-klyuch",
    title: "Ремонт и отделка «под ключ»",
    titleTg: "Таъмири хонадон «зери калид»",
    category: "Строительство и ремонт",
    categoryTg: "Сохтмон ва таъмир",
    priceStartingFromTjs: 850,
    priceStartingFromUsd: 78,
    priceUnit: "за м² работ",
    priceUnitTg: "барои м² кор",
    providerName: "Строительная артель «Усто Сохтмон»",
    providerNameTg: "Гурӯҳи бинокорони «Усто Сохтмон»",
    phone: "+992 92 990 4433",
    whatsapp: "+992929904433",
    rating: "4.89",
    reviewsCount: 64,
    isVerified: true,
    city: "khujand",
    iconName: "Wrench",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop",
    shortDescription: "Капитальный и чистовой евроремонт квартир в новостройках Худжанда: стяжка пола, кафель, штукатурка, сантехника с гарантией 2 года.",
    shortDescriptionTg: "Таъмири босифати аврупоии хонадонҳо: фаршбандӣ, кошинкорӣ, гачкорӣ ва сантехника бо кафолати 2-сола.",
  },
];
