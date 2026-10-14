import { db, pgClient } from "./index";
import {
  users,
  developers,
  projects,
  units,
  classifieds,
  crmLeads,
  crmCollections,
  apiKeys,
} from "./schema";
import {
  generateUnitsForSirdaryoPlaza,
  generateUnitsForQayroqum,
  INITIAL_DEVELOPERS,
  INITIAL_PROJECTS,
} from "../lib/data/mock-db";

export async function seed() {
  console.log("🌱 [Sogd Realty] Начинаем сидирование базы данных Drizzle ORM...");

  try {
    // 1. Создаем тестовых пользователей с разными ролями
    console.log("-> 1. Создание пользователей (Superadmin, Developer, Realtor, Citizen)...");
    await db
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
          name: "Рустам Аҳмедов (Агентии «Суғд-Инвест»)",
          email: "rustam@sugd-invest.tj",
          role: "realtor",
          phone: "+992927770022",
          city: "khujand",
          agencyName: "Агентии «Суғд-Инвест»",
          isVerifiedRealtor: true,
          telegramChatId: "123456789",
          telegramNotificationsEnabled: true,
        },
        {
          id: "usr_dev_rep_01",
          name: "Отдел Продаж «Qayroqum Avenue» Development",
          email: "sales@qayroqum-avenue.tj",
          role: "developer",
          phone: "+992927005555",
          city: "guliston",
        },
        {
          id: "usr_private_01",
          name: "Дилшод Раҳимов",
          email: "dilshod@gmail.com",
          role: "user",
          phone: "+992935051188",
          phoneVerified: true,
          city: "khujand",
        },
      ])
      .onConflictDoNothing();

    console.log("✓ Пользователи успешно созданы");

    // 2. Создаем ведущих застройщиков Согдийской области
    console.log("-> 2. Создание ведущих застройщиков Согдийской области...");
    const developersToSeed = INITIAL_DEVELOPERS.map((dev) => ({
      id: dev.id,
      name: dev.name,
      nameTg: dev.nameTg || dev.name,
      slug: dev.slug,
      logoUrl: dev.logoUrl,
      coverUrl: dev.coverUrl,
      description: dev.description,
      descriptionTg: dev.descriptionTg || dev.description,
      foundedYear: dev.foundedYear,
      completedProjectsCount: dev.completedProjectsCount,
      activeProjectsCount: dev.activeProjectsCount,
      rating: dev.rating,
      isVerified: dev.isVerified,
      city: (dev.city as any) || "khujand",
      officeAddress: dev.officeAddress,
      officeAddressTg: dev.officeAddressTg || dev.officeAddress,
      phone: dev.phone,
      phoneSecondary: dev.phoneSecondary || null,
      whatsapp: dev.whatsapp,
      telegram: dev.telegram || null,
      email: dev.email,
      websiteUrl: dev.websiteUrl || null,
      createdById: "usr_dev_rep_01",
    }));

    await db.insert(developers).values(developersToSeed).onConflictDoNothing();
    console.log(`✓ Застройщики успешно созданы (${developersToSeed.length} компаний)`);

    // 3. Создаем жилые комплексы (Новостройки)
    console.log("-> 3. Создание флагманских жилых комплексов Согда...");
    const projectsToSeed = INITIAL_PROJECTS.slice(0, 4).map((p) => ({
      id: p.id,
      developerId: p.developerId,
      name: p.name,
      nameTg: p.nameTg || p.name,
      slug: p.slug,
      shortDescription: p.shortDescription || p.description.slice(0, 150),
      description: p.description,
      descriptionTg: p.descriptionTg || p.description,
      status: p.status,
      buildingClass: p.buildingClass,
      finishing: p.finishing,
      city: (p.city as any) || "khujand",
      district: p.district || null,
      address: p.address,
      addressTg: p.addressTg || p.address,
      landmark: p.landmark || null,
      landmarkTg: p.landmarkTg || p.landmark || null,
      floorsCount: p.floorsCount,
      sectionsCount: p.sectionsCount,
      ceilingHeight: p.ceilingHeight || "3.00",
      constructionType: p.constructionType,
      deadlineQuarter: p.deadlineQuarter || 4,
      deadlineYear: p.deadlineYear || 2026,
      landArea: p.landArea || null,
      wallMaterial: p.wallMaterial || null,
      facade: p.facade || null,
      cadastralNumber: p.cadastralNumber || null,
      customBuildingFeatures: p.customBuildingFeatures || [],
      finishingFeatures: p.finishingFeatures || [],
      minPricePerMeterTjs: p.minPricePerMeterTjs.toFixed(2),
      minPricePerMeterUsd: p.minPricePerMeterUsd.toFixed(2),
      minTotalPriceTjs: p.minTotalPriceTjs.toFixed(2),
      minTotalPriceUsd: p.minTotalPriceUsd.toFixed(2),
      hasInstallment: p.hasInstallment,
      installmentMonths: p.installmentMonths,
      installmentDownPaymentPercent: p.installmentDownPaymentPercent,
      hasUndergroundParking: p.hasUndergroundParking,
      hasElevator: p.hasElevator,
      hasPlayground: p.hasPlayground,
      hasSecurity: p.hasSecurity,
      hasAutonomousHeating: p.hasAutonomousHeating,
      amenities: p.amenities,
      amenitiesTg: p.amenitiesTg || p.amenities,
      parkingConfig: p.parkingConfig || null,
      parkingSpots: p.parkingSpots || [],
      storageConfig: p.storageConfig || null,
      storageUnits: p.storageUnits || [],
      documentsConfig: p.documentsConfig || null,
      officialDocuments: p.officialDocuments || [],
      coverImageUrl: p.coverImageUrl,
      images: p.images,
      constructionProgress: p.constructionProgress || [],
      documents: p.documents || [],
      viewsCount: (p as any).viewsCount ?? 1200,
      isFeatured: (p as any).isFeatured ?? true,
    }));

    await db.insert(projects).values(projectsToSeed as any).onConflictDoNothing();
    console.log(`✓ Жилые комплексы успешно созданы (${projectsToSeed.length} ЖК)`);

    // 4. Создаем юниты (квартиры шахматки)
    console.log("-> 4. Наполнение шахматки квартирами (по этажам и секциям)...");
    const sirdaryoUnits = generateUnitsForSirdaryoPlaza();
    const qayroqumUnits = generateUnitsForQayroqum();
    const allUnits = [...sirdaryoUnits, ...qayroqumUnits];

    const formattedUnits = allUnits.map((u) => ({
      id: u.id,
      projectId: u.projectId,
      unitNumber: u.unitNumber,
      type: u.type,
      roomsCount: u.roomsCount,
      totalArea: u.totalArea.toFixed(2),
      livingArea: u.livingArea ? u.livingArea.toFixed(2) : null,
      kitchenArea: u.kitchenArea ? u.kitchenArea.toFixed(2) : null,
      floor: u.floor,
      section: u.section,
      priceTjs: u.priceTjs.toFixed(2),
      priceUsd: u.priceUsd.toFixed(2),
      pricePerMeterTjs: u.pricePerMeterTjs.toFixed(2),
      pricePerMeterUsd: u.pricePerMeterUsd.toFixed(2),
      status: u.status,
      finishing: u.finishing,
      hasBalcony: u.hasBalcony,
      hasTerrace: u.hasTerrace,
      windowView: u.windowView || null,
      layoutPlanUrl: u.layoutPlanUrl || null,
    }));

    // Вставляем порциями
    const chunkSize = 50;
    for (let i = 0; i < formattedUnits.length; i += chunkSize) {
      const chunk = formattedUnits.slice(i, i + chunkSize);
      await db.insert(units).values(chunk).onConflictDoNothing();
    }
    console.log(`✓ Создано ${formattedUnits.length} квартир для шахматки (Qayroqum Avenue + Sirdaryo Plaza)`);

    // 5. Создаем частные объявления (Вторичка, Хавли, Коммерция)
    console.log("-> 5. Создание объявлений вторичного рынка и домов (ҳавлӣ)...");
    await db
      .insert(classifieds)
      .values([
        {
          id: "c1",
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
          contactName: "Рустам Аҳмедов",
          contactPhone: "+992927770022",
          contactWhatsapp: "+992927770022",
          photos: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&fit=crop",
          ],
          viewsCount: 540,
          isPromoted: true,
        },
        {
          id: "c2",
          userId: "usr_private_01",
          title: "Продается благоустроенный дом (Ҳавлӣ) 6.5 соток в Б. Гафурове",
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
          contactName: "Дилшод Раҳимов",
          contactPhone: "+992935051188",
          contactWhatsapp: "+992935051188",
          photos: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&fit=crop",
          ],
          viewsCount: 820,
          isPromoted: true,
        },
        {
          id: "c3",
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
          contactName: "Рустам Аҳмедов",
          contactPhone: "+992927770022",
          contactWhatsapp: "+992927770022",
          photos: [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&fit=crop",
          ],
          viewsCount: 390,
        },
      ])
      .onConflictDoNothing();

    console.log("✓ Объявления вторичного рынка успешно созданы");

    // 6. Создаем CRM Лиды и Клиентские подборки
    console.log("-> 6. Создание демонстрационных лидов CRM и подборок...");
    await db
      .insert(crmLeads)
      .values([
        {
          id: "lead-1",
          agentId: "agent-default",
          clientName: "Фарҳод Нозиров",
          clientPhone: "+992 92 771 44 22",
          classifiedId: "c1",
          classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
          status: "new",
          budget: 49000,
          commission: 980,
          commissionPercent: 2,
          source: "whatsapp_click",
          notes: "Нажал кнопку WhatsApp на сайте. Ищет квартиру для семьи с двумя детьми.",
        },
        {
          id: "lead-2",
          agentId: "agent-default",
          clientName: "Дилшод Раҳимов",
          clientPhone: "+992 93 505 11 88",
          classifiedId: "c2",
          classifiedTitle: "Благоустроенный дом (Ҳавлӣ) 6.5 соток, Унчи",
          status: "contacted",
          budget: 65000,
          commission: 1300,
          commissionPercent: 2,
          source: "phone_click",
          notes: "Созвонились в 14:00. Хочет посмотреть дом в субботу утром.",
        },
        {
          id: "lead-3",
          agentId: "agent-default",
          clientName: "Зарина Каримова",
          clientPhone: "+992 92 880 33 55",
          classifiedId: "c1",
          classifiedTitle: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
          status: "showing",
          budget: 48000,
          commission: 960,
          commissionPercent: 2,
          source: "website",
          notes: "Показ назначен на завтра в 16:30. Готова внести аванс.",
        },
        {
          id: "lead-4",
          agentId: "agent-default",
          clientName: "Алишер Маҳмудов",
          clientPhone: "+992 90 011 22 33",
          classifiedId: "c3",
          classifiedTitle: "Торговое помещение у рынка «Панчшанбе»",
          status: "deal",
          budget: 776,
          commission: 776,
          commissionPercent: 100,
          source: "manual",
          notes: "Договор аренды подписан на 1 год. Оплата комиссии получена.",
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(crmCollections)
      .values([
        {
          id: "col-demo-1",
          shareCode: "khujand-top3",
          agentId: "agent-default",
          agentName: "Рустам Аҳмедов",
          agentPhone: "+992 92 777 00 22",
          agentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
          agentAgency: "Агентии «Суғд-Инвест»",
          title: "Эксклюзивная подборка квартир в 18 и 19 мкр (Худжанд)",
          notes: "Отобрал лучшие варианты с евроремонтом и готовыми документами для вашей семьи.",
          propertyIds: JSON.stringify(["c1", "c4", "c2"]),
          viewsCount: 14,
        },
      ])
      .onConflictDoNothing();

    console.log("✓ CRM Лиды и подборки успешно созданы");

    // 7. Создаем API Ключи для интеграций
    console.log("-> 7. Создание API ключей для внешней интеграции...");
    await db
      .insert(apiKeys)
      .values([
        {
          id: "key-demo-01",
          userId: "usr_realtor_01",
          name: "Интеграция CRM & Аналитики",
          key: "sr_live_9b4e72f0a1c6e482390d4",
          permissions: ["read_analytics", "auto_import_feed"],
          isActive: true,
        },
      ])
      .onConflictDoNothing();

    console.log("✓ API Ключи успешно созданы");
    console.log("🎉 [Sogd Realty] База данных успешно наполнена всеми демонстрационными данными!");
  } catch (error) {
    console.error("❌ Ошибка при сидировании базы данных:", error);
    throw error;
  } finally {
    // Безопасное закрытие соединения с базой данных
    await pgClient.end({ timeout: 5 });
  }
}

// Запуск сидирования если файл вызван напрямую через tsx
if (require.main === module || process.argv[1]?.includes("seed.ts")) {
  seed()
    .then(() => {
      console.log("✨ Процесс завершен.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Критическая ошибка:", err);
      process.exit(1);
    });
}
