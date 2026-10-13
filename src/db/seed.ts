import { db } from "./index";
import {
  users,
  developers,
  projects,
  units,
  classifieds,
} from "./schema";

export async function seed() {
  console.log("🌱 Starting Sogd Realty database seeding...");

  // 1. Создаем тестовых пользователей
  const [adminUser] = await db
    .insert(users)
    .values([
      {
        id: "usr_admin_01",
        name: "Администратор Портала",
        email: "admin@sogd-realty.tj",
        role: "admin",
        phone: "+992927770001",
        city: "khujand",
      },
      {
        id: "usr_realtor_01",
        name: "Рустам Каримов (Агентство «Сугд-Инвест»)",
        email: "rustam@sugd-invest.tj",
        role: "realtor",
        phone: "+992928881234",
        city: "khujand",
        agencyName: "Сугд-Инвест Недвижимость",
        isVerifiedRealtor: true,
      },
      {
        id: "usr_dev_rep_01",
        name: "Отдел Продаж «Рахш Сохтмон»",
        email: "sales@rahsh-stroy.tj",
        role: "developer",
        phone: "+992927005555",
        city: "khujand",
      },
      {
        id: "usr_private_01",
        name: "Дилшод Назаров",
        email: "dilshod@gmail.com",
        role: "user",
        phone: "+992929994321",
        city: "khujand",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log("✓ Users seeded");

  // 2. Создаем застройщиков Согда
  await db
    .insert(developers)
    .values([
      {
        id: "dev_rahsh",
        name: "Рахш Сохтмон",
        slug: "rahsh-sohtmon",
        logoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=200&h=200&fit=crop",
        description:
          "Один из ведущих застройщиков Согдийской области. Современные монолитно-каркасные дома с сейсмостойкостью до 9 баллов и видом на реку Сырдарья.",
        foundedYear: 2012,
        completedProjectsCount: 8,
        activeProjectsCount: 3,
        rating: "4.90",
        isVerified: true,
        city: "khujand",
        officeAddress: "г. Худжанд, проспект Исмоили Сомони, 142",
        phone: "+992927005555",
        whatsapp: "+992927005555",
        telegram: "rahsh_sales",
        email: "info@rahsh-stroy.tj",
        createdById: "usr_dev_rep_01",
      },
      {
        id: "dev_sayhun",
        name: "Сайҳун Девелопмент",
        slug: "sayhun-development",
        logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop",
        description:
          "Специализируется на строительстве жилых комплексов комфорт- и бизнес-класса в 18, 19 и 34 микрорайонах Худжанда.",
        foundedYear: 2016,
        completedProjectsCount: 5,
        activeProjectsCount: 2,
        rating: "4.85",
        isVerified: true,
        city: "khujand",
        officeAddress: "г. Худжанд, 19-й микрорайон, набережная Сырдарьи",
        phone: "+992928114444",
        whatsapp: "+992928114444",
        email: "sales@sayhun.tj",
        createdById: "usr_dev_rep_01",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Developers seeded");

  // 3. Создаем жилые комплексы (Новостройки)
  await db
    .insert(projects)
    .values([
      {
        id: "proj_sirdaryo_plaza",
        developerId: "dev_rahsh",
        name: "ЖК «Сирдарё Плаза»",
        slug: "sirdaryo-plaza",
        shortDescription:
          "Элитный жилой комплекс на первой линии набережной Сырдарьи в Худжанде",
        description:
          "ЖК «Сирдарё Плаза» — это современный 16-этажный архитектурный комплекс в 19 микрорайоне. Из окон открывается великолепная панорама на реку Сырдарья и Монумент Исмоила Сомони. Собственный закрытый двор, подземный двухуровневый паркинг и автономное отопление.",
        status: "under_construction",
        buildingClass: "business",
        finishing: "rough",
        city: "khujand",
        district: "19 мкр",
        address: "19-й микрорайон, ул. Рахима Джалила 12",
        landmark: "Набережная реки Сырдарья, напротив парка Сомони",
        floorsCount: 16,
        sectionsCount: 3,
        ceilingHeight: "3.20",
        constructionType: "Монолитно-каркасный",
        deadlineQuarter: 4,
        deadlineYear: 2026,
        minPricePerMeterTjs: "6570.00",
        minPricePerMeterUsd: "600.00",
        minTotalPriceTjs: "348210.00",
        minTotalPriceUsd: "31800.00",
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
          "Подземный паркинг",
          "Скоростные лифты",
          "Охрана и видеонаблюдение 24/7",
          "Детская и спортивная площадка",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
        ],
        viewsCount: 1420,
        isFeatured: true,
      },
      {
        id: "proj_sugdiyon",
        developerId: "dev_sayhun",
        name: "ЖК «Суғдиён Сити»",
        slug: "sugdiyon-city",
        shortDescription: "Семейный жилой комплекс комфорт-класса в 18 микрорайоне",
        description:
          "Уютный жилой квартал с благоустроенным двором, прогулочными аллеями и собственной коммерческой зоной на первом этаже. Рядом расположены школы №28, детские сады и супермаркет «Амид».",
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
        constructionType: "Монолитный железобетон с кирпичным заполнением",
        deadlineQuarter: 2,
        deadlineYear: 2027,
        minPricePerMeterTjs: "5475.00",
        minPricePerMeterUsd: "500.00",
        minTotalPriceTjs: "262800.00",
        minTotalPriceUsd: "24000.00",
        hasInstallment: true,
        installmentMonths: 36,
        installmentDownPaymentPercent: 20,
        hasElevator: true,
        hasPlayground: true,
        hasSecurity: true,
        hasAutonomousHeating: true,
        amenities: [
          "Беспроцентная рассрочка до 36 мес",
          "Рядом школа и детский сад",
          "Супермаркет на 1 этаже",
          "Утепленный фасад",
        ],
        coverImageUrl:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
        ],
        viewsCount: 980,
        isFeatured: true,
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Projects seeded");

  // 4. Создаем юниты (квартиры в ЖК)
  await db
    .insert(units)
    .values([
      {
        id: "unit_sirdaryo_101",
        projectId: "proj_sirdaryo_plaza",
        unitNumber: "Кв. 12",
        type: "apartment",
        roomsCount: 1,
        totalArea: "53.00",
        livingArea: "24.00",
        kitchenArea: "14.00",
        floor: 4,
        section: "Секция 1",
        priceTjs: "348210.00",
        priceUsd: "31800.00",
        pricePerMeterTjs: "6570.00",
        pricePerMeterUsd: "600.00",
        status: "available",
        finishing: "rough",
        hasBalcony: true,
        windowView: "Вид на реку Сырдарья",
        layoutPlanUrl:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop",
      },
      {
        id: "unit_sirdaryo_201",
        projectId: "proj_sirdaryo_plaza",
        unitNumber: "Кв. 28",
        type: "apartment",
        roomsCount: 2,
        totalArea: "78.50",
        livingArea: "42.00",
        kitchenArea: "16.00",
        floor: 8,
        section: "Секция 2",
        priceTjs: "515745.00",
        priceUsd: "47100.00",
        pricePerMeterTjs: "6570.00",
        pricePerMeterUsd: "600.00",
        status: "available",
        finishing: "rough",
        hasBalcony: true,
        windowView: "Панорамный вид на Сырдарью и мост",
        layoutPlanUrl:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&fit=crop",
      },
      {
        id: "unit_sirdaryo_301",
        projectId: "proj_sirdaryo_plaza",
        unitNumber: "Кв. 45",
        type: "apartment",
        roomsCount: 3,
        totalArea: "115.00",
        livingArea: "68.00",
        kitchenArea: "20.00",
        floor: 11,
        section: "Секция 1",
        priceTjs: "788400.00",
        priceUsd: "72000.00",
        pricePerMeterTjs: "6856.00",
        pricePerMeterUsd: "626.00",
        status: "available",
        finishing: "rough",
        hasBalcony: true,
        hasTerrace: true,
        windowView: "Двусторонняя: река Сырдарья и горы Моголтау",
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Units seeded");

  // 5. Создаем частные объявления (Вторичка, Хавли, Коммерция)
  await db
    .insert(classifieds)
    .values([
      {
        id: "class_01_khujand_apt",
        userId: "usr_realtor_01",
        title: "Продается 3-комнатная квартира с евроремонтом в 18 мкр",
        slug: "3-komnatnaya-kvartira-18-mkr-khujand",
        description:
          "Отличная просторная 3-комнатная квартира улучшенной планировки (ленинградский проект). Чистый подъезд с домофоном, раздельный санузел, утепленный балкон. Полностью меблирована, кондиционер зима-лето, автономный водонагреватель (термекс).",
        dealType: "sale",
        propertyType: "apartment",
        status: "active",
        city: "khujand",
        district: "18 мкр",
        address: "18-й микрорайон, дом 15",
        landmark: "Напротив школы №28, рядом рынок 18 мкр",
        roomsCount: 3,
        totalArea: "76.00",
        livingArea: "48.00",
        kitchenArea: "12.00",
        floor: 3,
        floorsCount: 5,
        buildingType: "Панельный",
        renovation: "Евроремонт",
        hasCityWater: true,
        hasElectricity: true,
        hasHeating: true,
        hasSewerage: true,
        isFurnished: true,
        originalCurrency: "USD",
        priceTjs: "536550.00",
        priceUsd: "49000.00",
        isNegotiable: true,
        contactName: "Рустам Каримов",
        contactPhone: "+992928881234",
        contactWhatsapp: "+992928881234",
        photos: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&fit=crop",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&fit=crop",
        ],
        viewsCount: 540,
        isPromoted: true,
      },
      {
        id: "class_02_gafurov_havli",
        userId: "usr_private_01",
        title: "Продается благоустроенный дом (Ҳавлӣ) 6 соток в Б. Гафурове",
        slug: "dom-havli-6-sotok-gafurov",
        description:
          "Большой традиционный уютный дом (хавли). 5 просторных комнат, большой айван, плодоносящий фруктовый сад (урюк, персик, хурма, виноградник). Постоянный свет (отдельный трансформатор), артезианская вода + хауз на 10 тонн, гараж на 2 машины.",
        dealType: "sale",
        propertyType: "house",
        status: "active",
        city: "gafurov",
        district: "Джамоат Унчи",
        address: "ул. Сомониён, 58",
        landmark: "Ориентир — мечеть Унчи",
        roomsCount: 5,
        totalArea: "180.00",
        landAreaSotka: "6.50",
        floorsCount: 1,
        buildingType: "Кирпичный",
        renovation: "Хороший ремонт",
        hasCityWater: true,
        hasWaterHauz: true,
        hasElectricity: true,
        hasHeating: true,
        hasSewerage: true,
        originalCurrency: "USD",
        priceTjs: "711750.00",
        priceUsd: "65000.00",
        isNegotiable: true,
        exchangePossible: true,
        contactName: "Дилшод Назаров",
        contactPhone: "+992929994321",
        contactWhatsapp: "+992929994321",
        photos: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&fit=crop",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&fit=crop",
        ],
        viewsCount: 820,
        isPromoted: true,
      },
      {
        id: "class_03_panjshanbe_comm",
        userId: "usr_realtor_01",
        title: "Аренда торгового помещения возле рынка «Панчшанбе»",
        slug: "arenda-torgovogo-pomeshcheniya-panjshanbe",
        description:
          "Первая линия, высокий пешеходный трафик! Идеально подходит под магазин одежды, электроники, аптеку или салон красоты. Витринные окна, отдельный вход с улицы, кондиционер.",
        dealType: "rent_long",
        propertyType: "commercial",
        status: "active",
        city: "khujand",
        district: "Центр / Панчшанбе",
        address: "ул. Шарк 24",
        landmark: "50 метров от главных ворот рынка Панчшанбе",
        totalArea: "65.00",
        floor: 1,
        floorsCount: 4,
        buildingType: "Монолитный",
        renovation: "Свежий ремонт",
        hasCityWater: true,
        hasElectricity: true,
        hasSewerage: true,
        originalCurrency: "TJS",
        priceTjs: "8500.00",
        priceUsd: "776.00",
        isNegotiable: false,
        contactName: "Рустам Каримов",
        contactPhone: "+992928881234",
        contactWhatsapp: "+992928881234",
        photos: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&fit=crop",
        ],
        viewsCount: 390,
      },
    ])
    .onConflictDoNothing();

  console.log("✓ Classifieds seeded");
  console.log("🎉 Database seeding completed successfully!");
}

// Запуск при прямом вызове
if (require.main === module || process.argv[1]?.includes("seed.ts")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    });
}
