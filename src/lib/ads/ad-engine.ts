/**
 * Programmatic Ad Engine & Super-Admin Ad Serving for Maskani.tj
 *
 * Implements:
 * 1. Annual Flat Sponsorships (Годовые эксклюзивные пакеты для гигантов: Эсхата, Мегафон, Tcell и др.)
 * 2. Auction Bidding Engine (Аукцион показов по ставке CPM / CPC как в Яндекс Директ)
 * 3. Geo & Category Targeting (Согд, Худжанд, Истаравшан, Исфара; Новостройки, Вторичка, Коммерция)
 * 4. Self-Promo Fallback & Impression/Click Tracking
 */

export interface AdvertiserDto {
  id: string;
  companyName: string;
  brandName: string;
  tin: string;
  contactPerson: string;
  phone: string;
  email: string;
  websiteUrl: string;
  logoUrl?: string;
  industry: "bank" | "telecom" | "developer" | "manufacturing" | "retail" | "services";
  tier: "sponsor_annual" | "auction_bidder" | "partner_direct";
  status: "active" | "paused" | "pending_approval";
  balanceTjs: number;
  balanceUsd: number;
  totalSpentTjs: number;
  totalSpentUsd: number;
  contractStartDate?: string;
  contractEndDate?: string;
  annualContractValueTjs?: number;
  notes?: string;
}

export interface AdCreativeDto {
  id: string;
  campaignId: string;
  titleRu: string;
  titleTg: string;
  subtitleRu: string;
  subtitleTg: string;
  badgeTextRu?: string;
  badgeTextTg?: string;
  ctaTextRu: string;
  ctaTextTg: string;
  targetUrl: string;
  bannerImageUrl?: string;
  mobileImageUrl?: string;
  actionType: "link" | "phone" | "whatsapp";
  phone?: string;
  whatsapp?: string;
  bgColorHex: string;
  textColorHex: string;
  accentColorHex: string;
  isActive: boolean;
  impressionsCount: number;
  clicksCount: number;
}

export interface AdCampaignDto {
  id: string;
  advertiserId: string;
  name: string;
  billingModel: "annual_sponsorship" | "auction_cpm" | "auction_cpc";
  bidAmountTjs: number; // Ставка за 1000 показов (CPM) или за клик (CPC)
  bidAmountUsd: number;
  totalBudgetTjs: number;
  dailyLimitTjs: number;
  startDate: string;
  endDate?: string;
  geoTargeting: string[]; // ["all"] or ["khujand", "istaravshan", ...]
  categoryTargeting: string[]; // ["all"] or ["new_buildings", "secondary", "commercial"]
  placementSlots: string[]; // ["catalog_banner", "homepage_hero", "search_featured"]
  status: "active" | "paused" | "completed" | "draft";
  impressionsCount: number;
  clicksCount: number;
  creatives: AdCreativeDto[];
}

export interface ServeAdRequest {
  city?: string;
  category?: string;
  slot?: "catalog_banner" | "homepage_hero" | "search_featured";
  language?: "ru" | "tg";
}

export interface ServedBannerResult {
  advertiserId: string;
  advertiserName: string;
  campaignId: string;
  creativeId: string;
  tier: "sponsor_annual" | "auction_bidder" | "self_promo";
  title: string;
  subtitle: string;
  badgeText?: string;
  ctaText: string;
  targetUrl: string;
  actionType: "link" | "phone" | "whatsapp";
  phone?: string;
  whatsapp?: string;
  bgColorHex: string;
  textColorHex: string;
  accentColorHex: string;
  bannerImageUrl?: string;
}

// In-memory persistent state (seeded with major Tajikistan brands)
let advertisersStore: AdvertiserDto[] = [
  {
    id: "adv-eskhata",
    companyName: 'ОАО «Банк Эсхата»',
    brandName: "Банк Эсхата",
    tin: "010014589",
    contactPerson: "Мавзуна Рахимова (Департамент маркетинга)",
    phone: "+992 (44) 600-0-600",
    email: "marketing@eskhata.tj",
    websiteUrl: "https://eskhata.com",
    industry: "bank",
    tier: "sponsor_annual",
    status: "active",
    balanceTjs: 120000,
    balanceUsd: 11000,
    totalSpentTjs: 45000,
    totalSpentUsd: 4100,
    contractStartDate: "2026-01-01",
    contractEndDate: "2026-12-31",
    annualContractValueTjs: 120000,
    notes: "Генеральный финансовый партнер Согда. Ипотека, кредиты на ремонт, страхование.",
  },
  {
    id: "adv-megafon",
    companyName: 'ЗАО «ТТ Мобайл» (МегаФон Таджикистан)',
    brandName: "МегаФон Таджикистан",
    tin: "020011234",
    contactPerson: "Фаррух Каримов",
    phone: "+992 90 000 0000",
    email: "corp@megafon.tj",
    websiteUrl: "https://megafon.tj",
    industry: "telecom",
    tier: "sponsor_annual",
    status: "active",
    balanceTjs: 95000,
    balanceUsd: 8700,
    totalSpentTjs: 32000,
    totalSpentUsd: 2900,
    contractStartDate: "2026-02-01",
    contractEndDate: "2027-01-31",
    annualContractValueTjs: 95000,
    notes: "Генеральный телеком-партнер. Домашний интернет для новостроек, умный дом.",
  },
  {
    id: "adv-tcell",
    companyName: 'ЗАО «Индиго Таджикистан» (Tcell)',
    brandName: "Tcell",
    tin: "010099887",
    contactPerson: "Дилшод Назиров",
    phone: "+992 93 500 0000",
    email: "business@tcell.tj",
    websiteUrl: "https://tcell.tj",
    industry: "telecom",
    tier: "sponsor_annual",
    status: "active",
    balanceTjs: 90000,
    balanceUsd: 8200,
    totalSpentTjs: 28000,
    totalSpentUsd: 2550,
    contractStartDate: "2026-03-01",
    contractEndDate: "2027-02-28",
    annualContractValueTjs: 90000,
    notes: "Спонсор цифровых сервисов и связи в Согде.",
  },
  {
    id: "adv-farovon",
    companyName: 'Группа компаний «Фаровон-1»',
    brandName: "Фаровон",
    tin: "030044556",
    contactPerson: "Бахтиёр Саидов",
    phone: "+992 92 777 5555",
    email: "info@farovon.tj",
    websiteUrl: "https://farovon.tj",
    industry: "manufacturing",
    tier: "auction_bidder",
    status: "active",
    balanceTjs: 25000,
    balanceUsd: 2300,
    totalSpentTjs: 14500,
    totalSpentUsd: 1320,
    notes: "Стройматериалы, металлопрокат, комбикорм, мука.",
  },
  {
    id: "adv-somon-sohtmon",
    companyName: 'ООО «Сомон Сохтмон»',
    brandName: "Сомон Сохтмон",
    tin: "010022334",
    contactPerson: "Хуршед Шарипов",
    phone: "+992 92 888 7777",
    email: "sales@somonsohtmon.tj",
    websiteUrl: "https://somonsohtmon.tj",
    industry: "developer",
    tier: "auction_bidder",
    status: "active",
    balanceTjs: 35000,
    balanceUsd: 3200,
    totalSpentTjs: 19800,
    totalSpentUsd: 1800,
    notes: "Жилые комплексы премиум-класса в Худжанде.",
  },
  {
    id: "adv-artel",
    companyName: 'Artel Таджикистан',
    brandName: "Artel",
    tin: "040055667",
    contactPerson: "Умиджон Алимов",
    phone: "+992 92 999 1111",
    email: "artel@sughd.tj",
    websiteUrl: "https://artelgroup.org",
    industry: "retail",
    tier: "auction_bidder",
    status: "active",
    balanceTjs: 18000,
    balanceUsd: 1650,
    totalSpentTjs: 8900,
    totalSpentUsd: 810,
    notes: "Бытовая техника для новосёлов.",
  },
];

let campaignsStore: AdCampaignDto[] = [
  // 1. Eskhata Mortgage (Annual Sponsorship)
  {
    id: "camp-eskhata-mortgage",
    advertiserId: "adv-eskhata",
    name: "Ипотека 16% годовых в Согде",
    billingModel: "annual_sponsorship",
    bidAmountTjs: 35,
    bidAmountUsd: 3.2,
    totalBudgetTjs: 120000,
    dailyLimitTjs: 0,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    geoTargeting: ["all"],
    categoryTargeting: ["all"],
    placementSlots: ["catalog_banner", "homepage_hero"],
    status: "active",
    impressionsCount: 24890,
    clicksCount: 1420,
    creatives: [
      {
        id: "cr-eskhata-1",
        campaignId: "camp-eskhata-mortgage",
        titleRu: "Банк Эсхата — Станьте владельцем своего дома",
        titleTg: "Бонки Эсхата — Соҳиби хонаи орзуҳои худ шавед",
        subtitleRu: "Ипотека от 16% годовых • До 500 000 сомони • Срок до 10 лет",
        subtitleTg: "Ипотека аз 16% солона • То 500 000 сомонӣ • Мӯҳлат то 10 сол",
        badgeTextRu: "Генеральный партнер",
        badgeTextTg: "Шарики генералӣ",
        ctaTextRu: "Рассчитать ипотеку",
        ctaTextTg: "Ҳисоби ипотека",
        targetUrl: "https://eskhata.com/ib/loans/mortgage/",
        actionType: "link",
        bgColorHex: "#064e3b",
        textColorHex: "#ffffff",
        accentColorHex: "#34d399",
        isActive: true,
        impressionsCount: 24890,
        clicksCount: 1420,
      },
    ],
  },

  // 2. Megafon Home Internet (Annual Sponsorship)
  {
    id: "camp-megafon-home",
    advertiserId: "adv-megafon",
    name: "Домашний интернет МегаФон в новостройки",
    billingModel: "annual_sponsorship",
    bidAmountTjs: 30,
    bidAmountUsd: 2.7,
    totalBudgetTjs: 95000,
    dailyLimitTjs: 0,
    startDate: "2026-02-01",
    endDate: "2027-01-31",
    geoTargeting: ["all"],
    categoryTargeting: ["new_buildings"],
    placementSlots: ["catalog_banner"],
    status: "active",
    impressionsCount: 18450,
    clicksCount: 940,
    creatives: [
      {
        id: "cr-megafon-1",
        campaignId: "camp-megafon-home",
        titleRu: "МегаФон — Скоростной интернет в каждую квартиру",
        titleTg: "МегаФон — Интернети баландсуръат ба ҳар як хонадон",
        subtitleRu: "Оптика до 200 Мбит/с + ТВ в подарок • Подключение новостроек Согда",
        subtitleTg: "Оптика то 200 Мбит/с + ТВ тӯҳфа • Пайвастшавии биноҳои нави Суғд",
        badgeTextRu: "Спонсор связи",
        badgeTextTg: "Шарики алоқа",
        ctaTextRu: "Подключить дом",
        ctaTextTg: "Пайваст кардан",
        targetUrl: "https://megafon.tj/home/",
        actionType: "link",
        bgColorHex: "#022c22",
        textColorHex: "#ffffff",
        accentColorHex: "#00b956",
        isActive: true,
        impressionsCount: 18450,
        clicksCount: 940,
      },
    ],
  },

  // 3. Farovon Building Materials (Auction CPM)
  {
    id: "camp-farovon-materials",
    advertiserId: "adv-farovon",
    name: "Стройматериалы Фаровон для ремонта и стройки",
    billingModel: "auction_cpm",
    bidAmountTjs: 28,
    bidAmountUsd: 2.5,
    totalBudgetTjs: 25000,
    dailyLimitTjs: 500,
    startDate: "2026-03-01",
    geoTargeting: ["khujand", "istaravshan", "isfara"],
    categoryTargeting: ["all"],
    placementSlots: ["catalog_banner"],
    status: "active",
    impressionsCount: 11200,
    clicksCount: 530,
    creatives: [
      {
        id: "cr-farovon-1",
        campaignId: "camp-farovon-materials",
        titleRu: "Фаровон — Качественные стройматериалы от производителя",
        titleTg: "Фаровон — Масолеҳи сохтмонии баландсифат аз истеҳсолкунанда",
        subtitleRu: "Арматура, цемент, профили с доставкой по Худжанду и Согду",
        subtitleTg: "Арматура, семент, профилҳо бо интиқол дар Хуҷанд ва Суғд",
        badgeTextRu: "Стройматериалы",
        badgeTextTg: "Масолеҳи сохтмон",
        ctaTextRu: "Заказать оптом",
        ctaTextTg: "Фармоиши яклухт",
        targetUrl: "https://farovon.tj/catalog/",
        actionType: "link",
        bgColorHex: "#1e293b",
        textColorHex: "#ffffff",
        accentColorHex: "#38bdf8",
        isActive: true,
        impressionsCount: 11200,
        clicksCount: 530,
      },
    ],
  },

  // 4. Artel Home Appliances (Auction CPC)
  {
    id: "camp-artel-appliances",
    advertiserId: "adv-artel",
    name: "Обустройство новой квартиры с Artel",
    billingModel: "auction_cpc",
    bidAmountTjs: 2.5, // 2.5 сомони за клик
    bidAmountUsd: 0.23,
    totalBudgetTjs: 18000,
    dailyLimitTjs: 300,
    startDate: "2026-03-15",
    geoTargeting: ["all"],
    categoryTargeting: ["all"],
    placementSlots: ["catalog_banner"],
    status: "active",
    impressionsCount: 9800,
    clicksCount: 460,
    creatives: [
      {
        id: "cr-artel-1",
        campaignId: "camp-artel-appliances",
        titleRu: "Artel — Техника для вашего нового дома со скидкой 15%",
        titleTg: "Artel — Техника барои хонаи нави шумо бо тахфифи 15%",
        subtitleRu: "Холодильники, стиральные машины, кондиционеры с гарантией 3 года",
        subtitleTg: "Яхдонҳо, мошинҳои ҷомашӯӣ, кондитсионерҳо бо кафолати 3 сол",
        badgeTextRu: "Новосёл",
        badgeTextTg: "Хонаи нав",
        ctaTextRu: "Выбрать технику",
        ctaTextTg: "Интихоби техника",
        targetUrl: "https://artelgroup.org",
        actionType: "link",
        bgColorHex: "#312e81",
        textColorHex: "#ffffff",
        accentColorHex: "#a5b4fc",
        isActive: true,
        impressionsCount: 9800,
        clicksCount: 460,
      },
    ],
  },
];

/**
 * Self-Promo Fallback Banner (когда нет подходящей рекламы или для привлечения новых партнеров)
 */
function getSelfPromoBanner(lang: "ru" | "tg"): ServedBannerResult {
  const isTg = lang === "tg";
  return {
    advertiserId: "adv-maskani",
    advertiserName: "Maskani.tj",
    campaignId: "camp-self-promo",
    creativeId: "cr-self-promo",
    tier: "self_promo",
    title: isTg
      ? "Рекламаи шумо дар ин ҷо — Портали №1 амволи Суғд"
      : "Ваша реклама здесь — Портал недвижимости №1 в Согде",
    subtitle: isTg
      ? "Ба ҳазорҳо харидорони фаъоли хонаҳо ва бинокорон дастрасӣ пайдо кунед. Эсхата ва МегаФон аллакай бо мо ҳастанд."
      : "Охватите тысячи реальных покупателей жилья и застройщиков. Эсхата, МегаФон и Tcell уже сотрудничают с нами.",
    badgeText: isTg ? "Ҷойи реклама" : "Рекламное место",
    ctaText: isTg ? "Ҷойгир кардани реклама" : "Разместить рекламу",
    targetUrl: "/advertiser",
    actionType: "phone",
    phone: "+992 92 888 1234",
    whatsapp: "992928881234",
    bgColorHex: "#0f172a",
    textColorHex: "#ffffff",
    accentColorHex: "#10b981",
  };
}

/**
 * Core Programmatic Ad Serving Algorithm:
 * 1. Filter campaigns by Slot, Geo and Category.
 * 2. Give 60% priority weight to Annual Sponsors (Эсхата, Мегафон, Tcell).
 * 3. Compete remaining impressions via auction bid (Highest bid = higher probability).
 * 4. Fallback to Self-Promo if no campaigns active.
 */
export function serveAdBanner(req: ServeAdRequest): ServedBannerResult {
  const lang = req.language || "ru";
  const slot = req.slot || "catalog_banner";
  const city = (req.city || "all").toLowerCase();
  const category = (req.category || "all").toLowerCase();

  // 1. Filter matching active campaigns
  const eligibleCampaigns = campaignsStore.filter((c) => {
    if (c.status !== "active") return false;
    if (!c.placementSlots.includes(slot) && !c.placementSlots.includes("all")) return false;

    // Geo check
    const matchesGeo =
      c.geoTargeting.includes("all") ||
      c.geoTargeting.map((g) => g.toLowerCase()).includes(city);
    if (!matchesGeo) return false;

    // Category check
    const matchesCategory =
      c.categoryTargeting.includes("all") ||
      c.categoryTargeting.map((cat) => cat.toLowerCase()).includes(category);
    if (!matchesCategory) return false;

    return c.creatives.some((cr) => cr.isActive);
  });

  if (eligibleCampaigns.length === 0) {
    return getSelfPromoBanner(lang);
  }

  // 2. Separate into Annual Sponsors vs Auction Bidders
  const sponsorCampaigns = eligibleCampaigns.filter(
    (c) => c.billingModel === "annual_sponsorship"
  );
  const auctionCampaigns = eligibleCampaigns.filter(
    (c) => c.billingModel !== "annual_sponsorship"
  );

  let selectedCampaign: AdCampaignDto;

  // 3. Selection probability:
  // If we have sponsors, 65% of the time serve a sponsor, 35% auction
  const roll = Math.random() * 100;
  if (sponsorCampaigns.length > 0 && (roll < 65 || auctionCampaigns.length === 0)) {
    // Pick randomly among active sponsors (or rotate by lowest impressions)
    const sortedSponsors = [...sponsorCampaigns].sort(
      (a, b) => a.impressionsCount - b.impressionsCount
    );
    selectedCampaign = sortedSponsors[0];
  } else if (auctionCampaigns.length > 0) {
    // Weighted auction selection based on bid amount
    const totalBids = auctionCampaigns.reduce((acc, c) => acc + (c.bidAmountTjs || 1), 0);
    let randomThreshold = Math.random() * totalBids;
    let chosen = auctionCampaigns[0];
    for (const c of auctionCampaigns) {
      randomThreshold -= c.bidAmountTjs || 1;
      if (randomThreshold <= 0) {
        chosen = c;
        break;
      }
    }
    selectedCampaign = chosen;
  } else {
    selectedCampaign = eligibleCampaigns[0];
  }

  // 4. Select active creative
  const activeCreatives = selectedCampaign.creatives.filter((cr) => cr.isActive);
  const selectedCreative = activeCreatives[0] || selectedCampaign.creatives[0];

  // Increment in-memory counter
  selectedCampaign.impressionsCount += 1;
  selectedCreative.impressionsCount += 1;

  const advertiser = advertisersStore.find((a) => a.id === selectedCampaign.advertiserId);

  return {
    advertiserId: selectedCampaign.advertiserId,
    advertiserName: advertiser ? advertiser.brandName : "Партнер",
    campaignId: selectedCampaign.id,
    creativeId: selectedCreative.id,
    tier: selectedCampaign.billingModel === "annual_sponsorship" ? "sponsor_annual" : "auction_bidder",
    title: lang === "tg" ? selectedCreative.titleTg : selectedCreative.titleRu,
    subtitle: lang === "tg" ? (selectedCreative.subtitleTg || "") : (selectedCreative.subtitleRu || ""),
    badgeText: lang === "tg" ? selectedCreative.badgeTextTg : selectedCreative.badgeTextRu,
    ctaText: lang === "tg" ? selectedCreative.ctaTextTg : selectedCreative.ctaTextRu,
    targetUrl: selectedCreative.targetUrl,
    actionType: selectedCreative.actionType,
    phone: selectedCreative.phone,
    whatsapp: selectedCreative.whatsapp,
    bgColorHex: selectedCreative.bgColorHex,
    textColorHex: selectedCreative.textColorHex,
    accentColorHex: selectedCreative.accentColorHex,
    bannerImageUrl: selectedCreative.bannerImageUrl,
  };
}

/**
 * Super Admin Management API Functions
 */
export function getAllAdvertisers(): AdvertiserDto[] {
  return [...advertisersStore];
}

export function getAdvertiserById(id: string): AdvertiserDto | undefined {
  return advertisersStore.find((a) => a.id === id);
}

export function createAdvertiser(data: Omit<AdvertiserDto, "id" | "totalSpentTjs" | "totalSpentUsd">): AdvertiserDto {
  const newAdv: AdvertiserDto = {
    ...data,
    id: `adv-${Date.now()}`,
    totalSpentTjs: 0,
    totalSpentUsd: 0,
  };
  advertisersStore.push(newAdv);
  return newAdv;
}

export function updateAdvertiser(id: string, updates: Partial<AdvertiserDto>): AdvertiserDto | null {
  const idx = advertisersStore.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  advertisersStore[idx] = { ...advertisersStore[idx], ...updates };
  return advertisersStore[idx];
}

export function getAllCampaigns(): AdCampaignDto[] {
  return [...campaignsStore];
}

export function getCampaignById(id: string): AdCampaignDto | undefined {
  return campaignsStore.find((c) => c.id === id);
}

export function createCampaign(data: Omit<AdCampaignDto, "id" | "impressionsCount" | "clicksCount">): AdCampaignDto {
  const newCamp: AdCampaignDto = {
    ...data,
    id: `camp-${Date.now()}`,
    impressionsCount: 0,
    clicksCount: 0,
  };
  campaignsStore.push(newCamp);
  return newCamp;
}

export function updateCampaign(id: string, updates: Partial<AdCampaignDto>): AdCampaignDto | null {
  const idx = campaignsStore.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  campaignsStore[idx] = { ...campaignsStore[idx], ...updates };
  return campaignsStore[idx];
}

export function recordAdClick(campaignId: string, creativeId: string): boolean {
  const camp = campaignsStore.find((c) => c.id === campaignId);
  if (camp) {
    camp.clicksCount += 1;
    const cr = camp.creatives.find((c) => c.id === creativeId);
    if (cr) cr.clicksCount += 1;
    return true;
  }
  return false;
}

/**
 * Super Admin Executive Analytics Summary
 */
export function getSuperAdminAdAnalytics() {
  const totalAdvertisers = advertisersStore.length;
  const activeSponsors = advertisersStore.filter((a) => a.tier === "sponsor_annual" && a.status === "active").length;
  const totalAnnualContractValueTjs = advertisersStore.reduce(
    (acc, a) => acc + (a.annualContractValueTjs || 0),
    0
  );

  const totalImpressions = campaignsStore.reduce((acc, c) => acc + c.impressionsCount, 0);
  const totalClicks = campaignsStore.reduce((acc, c) => acc + c.clicksCount, 0);
  const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  return {
    totalAdvertisers,
    activeSponsors,
    totalAnnualContractValueTjs,
    totalAnnualContractValueUsd: Math.round(totalAnnualContractValueTjs / 10.9),
    totalImpressions,
    totalClicks,
    averageCtr: `${averageCtr}%`,
    advertisers: advertisersStore,
    campaigns: campaignsStore,
  };
}
