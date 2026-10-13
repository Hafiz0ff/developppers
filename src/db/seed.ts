import { db, pgClient } from "./index";
import {
  users,
  developers,
  projects,
  units,
  classifieds,
} from "./schema";
import { generateUnitsForSirdaryoPlaza } from "../lib/data/mock-db";

export async function seed() {
  console.log("🌱 [Sogd Realty] Начинаем сидирование базы данных...");

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
      .onConflictDoNothing();

    console.log("✓ Пользователи успешно созданы");

    // 2. Создаем застройщиков Согда
    console.log("-> 2. Создание ведущих застройщиков Согдийской области...");
    await db
      .insert(developers)
      .values([
        {
          id: "dev_rahsh",
          name: "Рахш Сохтмон",
          slug: "rahsh-sohtmon",
          logoUrl:
            "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=200&h=200&fit=crop",
          coverUrl:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=600&fit=crop",
          description:
            "Ведущая строительная компания Согдийской области с 2012 года. Современные монолитно-каркасные дома с сейсмостойкостью до 9 баллов и панорамным видом на реку Сырдарья.",
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
          createdById: "usr_dev_rep_01",
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
            "Специализируется на строительстве жилых комплексов комфорт- и бизнес-класса в 18, 19 и 34 микрорайонах Худжанда со встроенной социальной инфраструктурой.",
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
          createdById: "usr_dev_rep_01",
        },
      ])
      .onConflictDoNothing();

    console.log("✓ Застройщики успешно созданы");

    // 3. Создаем жилые комплексы (Новостройки)
    console.log("-> 3. Создание жилых комплексов (ЖК «Сирдарё Плаза», ЖК «Суғдиён Сити»)...");
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
          constructionType: "Монолитно-каркасный с кирпичным заполнением",
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
            { name: "Заключение сейсмоэкспертизы 9 баллов", fileUrl: "#" },
          ],
          constructionProgress: [
            {
              date: "Май 2026",
              title: "Возведение монолитного каркаса 12-го этажа",
              photos: [
                "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=600&fit=crop",
              ],
            },
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
          ],
          documents: [{ name: "Проектная декларация ЖК «Суғдиён»", fileUrl: "#" }],
          viewsCount: 980,
          isFeatured: true,
        },
      ])
      .onConflictDoNothing();

    console.log("✓ Жилые комплексы успешно созданы");

    // 4. Создаем юниты (квартиры шахматки)
    console.log("-> 4. Наполнение шахматки квартирами (по этажам и секциям)...");
    const generatedUnits = generateUnitsForSirdaryoPlaza();
    const formattedUnits = generatedUnits.map((u) => ({
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
    const chunkSize = 25;
    for (let i = 0; i < formattedUnits.length; i += chunkSize) {
      const chunk = formattedUnits.slice(i, i + chunkSize);
      await db.insert(units).values(chunk).onConflictDoNothing();
    }
    console.log(`✓ Создано ${formattedUnits.length} квартир для шахматки ЖК «Сирдарё Плаза»`);

    // 5. Создаем частные объявления (Вторичка, Хавли, Коммерция)
    console.log("-> 5. Создание объявлений вторичного рынка и домов (ҳавлӣ)...");
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
          ],
          viewsCount: 540,
          isPromoted: true,
        },
        {
          id: "class_02_gafurov_havli",
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
          contactName: "Дилшод Назаров",
          contactPhone: "+992929994321",
          contactWhatsapp: "+992929994321",
          photos: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&fit=crop",
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

    console.log("✓ Объявления вторичного рынка успешно созданы");
    console.log("🎉 [Sogd Realty] База данных успешно наполнена всеми демонстрационными данными!");
  } catch (error) {
    console.error("❌ Ошибка при сидировании базы данных:", error);
    throw error;
  } finally {
    // Безопасное закрытие соединения с базой данных
    await pgClient.end({ timeout: 5 });
  }
}

// Запуск сидирования
seed()
  .then(() => {
    console.log("✨ Процесс завершен.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Критическая ошибка:", err);
    process.exit(1);
  });
