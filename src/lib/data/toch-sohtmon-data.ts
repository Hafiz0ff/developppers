// Real data for developer Тоҷ Сохтмон (Toj Sohtmon) and its 9 residential complexes in Sughd
import { DeveloperData, ProjectData } from "./mock-db";

export const TOJ_SOHTMON_DEVELOPER: DeveloperData = {
  id: "dev_toch_sohtmon",
  name: "«Тоҷ Сохтмон» (Toj Sohtmon)",
  nameTg: "«Тоҷ Сохтмон» (Toj Sohtmon)",
  slug: "toch-sohtmon",
  logoUrl: "https://cdntj.somon.tj/media/cache1/0e/1f/0e1f8b6cdf50746a7f83a6899a2ad6a0.webp",
  coverUrl: "https://cdntj.somon.tj/media/cache1/11/aa/11aa128e44140ae41d3b074ebca6fb6c.webp",
  description:
    "Строительная компания «Тоҷ Сохтмон» (Toj Sohtmon) — одна из ведущих компаний Согдийской области, успешно работающая на рынке более 7 лет (с 2017 года). За это время компанией было реализовано несколько значимых проектов в Худжанде (включая «Рудаки Плаза») и ведется строительство в 17 локациях. Компания специализируется на монолитном строительстве с повышенной сейсмостойкостью до 9 баллов.",
  descriptionTg:
    "Ширкати сохтмонии «Тоҷ Сохтмон» (Toj Sohtmon) — яке аз ширкатҳои пешсафи вилояти Суғд, ки зиёда аз 7 сол дар бозор фаъолият мебарад. Ширкат бо сохтмони муосири монолитии сейсмотобовар то 9 балл ва лоиҳаҳои сармоягузории боэътимод дар шаҳри Хуҷанд маъруф аст.",
  foundedYear: 2017,
  completedProjectsCount: 5,
  activeProjectsCount: 17,
  rating: "4.90",
  isVerified: true,
  city: "khujand",
  officeAddress: "г. Худжанд, 13-й микрорайон, д. 9А",
  officeAddressTg: "ш. Хуҷанд, маҳаллаи 13-ум, бинои 9А",
  phone: "+992 92 011 5060",
  whatsapp: "+992920115060",
  telegram: "toch_sohtmon",
  email: "info@toch-sohtmon.tj",
  websiteUrl: "https://somon.tj/new-buildings/developer/38-toch-sohtmon/",
};

export const TOJ_SOHTMON_PROJECTS: ProjectData[] = [
  {
    "id": "proj_toch_46",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Фирдавси Плаза»",
    "nameTg": "МҶ «Фирдавсӣ Плаза»",
    "slug": "zhk-firdavsi-plaza",
    "shortDescription": "13-этажный современный жилой комплекс из монолита и газоблока с видовыми террасами",
    "shortDescriptionTg": "Маҷмааи муосири 13-ошёнаи монолитӣ бо айвонҳои барҳаво ва сохтори мустаҳкам",
    "description": "Здание построено из монолита и газоблока, что обеспечивает его прочность и надёжность. В комплексе предлагаются 1-3 комнатные квартиры с балконами и террасами, создающие уютную атмосферу для каждого жильца.\r\n\r\nВ непосредственной близости от комплекса находятся школа, детский сад, магазины, мечеть, заправка и остановка, что делает проживание здесь особенно удобным для семей. Для детей предусмотрена безопасная игровая площадка, а для автомобилистов — парковка.\r\n\r\nНа первых двух этажах комплекса будут располагаться коммерческие магазины, что обеспечит жильцов всем необходимым прямо у дома. \"Фирдавси Плаза\" — это идеальный выбор для тех, кто ценит комфорт, безопасность и удобство.\r\n\r\nАдрес: ул. Тилокон, 13 микрорайон, г. Худжанд (ориентир мечеть \"Такво\").\r\n\r\nОплата возможна наличными или в рассрочку с 0% ставкой.",
    "descriptionTg": "МҶ «Фирдавсӣ Плаза» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "12 мкр, ул. Фирдавси",
    "districtTg": "микрорайони 12, кӯчаи Фирдавсӣ",
    "address": "г. Худжанд, 12-й микрорайон, ул. Фирдавси",
    "addressTg": "ш. Хуҷанд, микрорайони 12, кӯчаи Фирдавсӣ",
    "landmark": "12-й микрорайон, удобный выезд на проспект",
    "landmarkTg": "Микрорайони 12, назди хиёбони асосӣ",
    "floorsCount": 13,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2025,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0046:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_46_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_46_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_46_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_46_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_46_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 6200,
    "minPricePerMeterUsd": 566,
    "minTotalPriceTjs": 291400,
    "minTotalPriceUsd": 26612,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/49/74/4974f2879d20ec2bb4726ed12d7828e0.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/49/74/4974f2879d20ec2bb4726ed12d7828e0.png",
      "https://cdntj.somon.tj/media/cache1/39/29/39298cd2dec02dd087a961b23fd8e0d8.png",
      "https://cdntj.somon.tj/media/cache1/68/10/68106d1dd13e8669d52c5d925913ac43.png",
      "https://cdntj.somon.tj/media/cache1/ca/1d/ca1d4b4c5f988b69db803797c6220a91.png",
      "https://cdntj.somon.tj/media/cache1/ca/3f/ca3f903f420a2b4ef035b4102759bc14.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №46/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/49/74/4974f2879d20ec2bb4726ed12d7828e0.png",
          "https://cdntj.somon.tj/media/cache1/39/29/39298cd2dec02dd087a961b23fd8e0d8.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.2913713350352,
      "lng": 69.58861372681648,
      "zoom": 14
    },
    "latitude": 40.2913713350352,
    "longitude": 69.58861372681648,
    "locationFeatures": [
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "250 м.",
        "valueTg": "250 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "200 м.",
        "valueTg": "200 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "900 м.",
        "valueTg": "900 м."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "1,9 км.",
        "valueTg": "1,9 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "70 м.",
        "valueTg": "70 м."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,45 км.",
        "valueTg": "1,45 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "900 м.",
        "valueTg": "900 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "2,8 км.",
        "valueTg": "2,8 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,25 км.",
        "valueTg": "1,25 км."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "4,5 км.",
        "valueTg": "4,5 км."
      },
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "60 м.",
        "valueTg": "60 м."
      }
    ]
  },
  {
    "id": "proj_toch_105",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Тавхид Мол»",
    "nameTg": "МҶ «Тавҳид Молл»",
    "slug": "zhk-tavhid-mol",
    "shortDescription": "Премиальный 19-этажный многофункциональный комплекс с крупным торгово-развлекательным центром",
    "shortDescriptionTg": "Маҷмааи бисёрфунксионалии 19-ошёнаи дараҷаи олӣ бо маркази бузурги савдо ва фароғатӣ",
    "description": "Жилой комплекс \"Тавхид Мол\" строится по адресу: улица Фирдавси 117, в самом центре города. Это идеальное место для жизни, с удобным доступом к магазинам, кафе, ресторанам, а также таким важным объектам, как к парку и театру Камоли Худжанди.\r\n\r\nКомплекс состоит из 20 этажей, включая 2 этажа пентхаусов. Здание возводится с использованием современных технологий — монолита и газоблока, что обеспечивает надёжность и долговечность конструкций. В \"Тавхид Мол\" будут представлены квартиры с разными планировками: от уютных однокомнатных до просторных трёхкомнатных.\r\n\r\nПреимущества ЖК \"Тавхид Мол\":\r\n\r\n- Подземная и надземная парковка для автомобилей.\r\n- Детский сад, который обеспечит комфортное проживание для семей с детьми.\r\n- Закрытая территория с обеспечением безопасности.\r\n- Игровая площадка для детей.\r\n\r\nРассрочка до 2 лет, предоплата от 30%.\r\n\r\nЖилой комплекс будет оборудован всем необходимым для комфортного проживания. Приятная окружающая среда, современная архитектура и развитая инфраструктура сделают \"Тавхид Мол\" идеальным местом для жизни.",
    "descriptionTg": "МҶ «Тавҳид Молл» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "premium",
    "finishing": "rough",
    "city": "khujand",
    "district": "Центр, ул. Фирдавси 117",
    "districtTg": "Марказ, кӯчаи Фирдавсӣ 117",
    "address": "г. Худжанд, ул. Фирдавси, 117 (самый центр города)",
    "addressTg": "ш. Хуҷанд, кӯчаи Фирдавсӣ, 117 (маркази шаҳр)",
    "landmark": "Рядом с центральной площадью и торговыми центрами",
    "landmarkTg": "Дар наздикии майдони марказӣ ва марказҳои савдо",
    "floorsCount": 19,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2027,
    "landArea": "0.65 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0105:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_105_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_105_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_105_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_105_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_105_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 10000,
    "minPricePerMeterUsd": 913,
    "minTotalPriceTjs": 700000,
    "minTotalPriceUsd": 63927,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": true,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/57/e0/57e0085f770243ad9c61af10a2bd4c8c.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/57/e0/57e0085f770243ad9c61af10a2bd4c8c.png",
      "https://cdntj.somon.tj/media/cache1/68/f2/68f2de00dc0f96e2cf76d0426e733247.png",
      "https://cdntj.somon.tj/media/cache1/cb/5e/cb5e37a84948001eecd4023257415586.png",
      "https://cdntj.somon.tj/media/cache1/ab/02/ab021eefe2501530b6892fe525e6a4fc.png",
      "https://cdntj.somon.tj/media/cache1/b3/b1/b3b1e6cde4a84213f44a7d86204c97d3.png",
      "https://cdntj.somon.tj/media/cache1/19/54/1954c82c78f1ca72c66207094fd9f1cb.png",
      "https://cdntj.somon.tj/media/cache1/81/3f/813f18bf2946af3b9df33692099c8067.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №105/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/57/e0/57e0085f770243ad9c61af10a2bd4c8c.png",
          "https://cdntj.somon.tj/media/cache1/68/f2/68f2de00dc0f96e2cf76d0426e733247.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.282941612204155,
      "lng": 69.6226850805365,
      "zoom": 14
    },
    "latitude": 40.282941612204155,
    "longitude": 69.6226850805365,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "950 м.",
        "valueTg": "950 м."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "80 м.",
        "valueTg": "80 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "200 м.",
        "valueTg": "200 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "480 м.",
        "valueTg": "480 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "750 м.",
        "valueTg": "750 м."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "50 м.",
        "valueTg": "50 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "800 м.",
        "valueTg": "800 м."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "560 м.",
        "valueTg": "560 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "350 м.",
        "valueTg": "350 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "500 м.",
        "valueTg": "500 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "400 м.",
        "valueTg": "400 м."
      }
    ]
  },
  {
    "id": "proj_toch_148",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «19 микрорайон»",
    "nameTg": "МҶ «Микрорайони 19»",
    "slug": "zhk-toch-19-mikrorajon",
    "shortDescription": "12-этажный монолитный комплекс в самом сердце развитого 19-го микрорайона",
    "shortDescriptionTg": "Бинои 12-ошёнаи монолитӣ дар маркази микрорайони ободи 19-ум",
    "description": "Жилой комплекс из 13 этажей, здание строится из монолита, расположен в центре 19-го микрорайона. Строительство комплекса ведется быстрыми темпами.\r\n\r\n📅 Сдача комплекса запланирована на декабрь 2025 года.\r\n\r\nИнфраструктура ЖК \"19-й микрорайон\":\r\n\r\n- Детские площадки для игр и активного отдыха.\r\n- Спортивная площадка для ведения здорового образа жизни.\r\n- Парковка для жителей во дворе здания.\r\n\r\nЖК \"19-й микрорайон\" — это дом, где комфорт сочетается с качеством, а все необходимые условия для жизни находятся поблизости.\r\n\r\n📞 Для получения дополнительной информации звоните по номеру 5060 и приобретайте квартиры по выгодной цене!",
    "descriptionTg": "МҶ «Микрорайони 19» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "19 мкр",
    "districtTg": "микрорайони 19",
    "address": "г. Худжанд, 19-й микрорайон (в центре квартала)",
    "addressTg": "ш. Хуҷанд, микрорайони 19 (маркази маҳалла)",
    "landmark": "В центре 19-го микрорайона, рядом с набережной",
    "landmarkTg": "Дар маркази микрорайони 19, дар наздикии соҳил",
    "floorsCount": 12,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2025,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0148:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_148_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_148_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_148_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_148_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_148_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 4600,
    "minPricePerMeterUsd": 420,
    "minTotalPriceTjs": 234600,
    "minTotalPriceUsd": 21425,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/dd/5b/dd5b2cbc69e7996175df8d8b445c4352.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/dd/5b/dd5b2cbc69e7996175df8d8b445c4352.png",
      "https://cdntj.somon.tj/media/cache1/27/f6/27f6056090bb721feae7aaf11c7b88d6.png",
      "https://cdntj.somon.tj/media/cache1/3c/a8/3ca84dc155b846d7d389ac51062a920c.png",
      "https://cdntj.somon.tj/media/cache1/d7/f7/d7f7bc2cdbca06643fcde15de3b4ee5d.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №148/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "6-10 этаж готов",
        "title": "Текущая стадия: 6-10 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/dd/5b/dd5b2cbc69e7996175df8d8b445c4352.png",
          "https://cdntj.somon.tj/media/cache1/27/f6/27f6056090bb721feae7aaf11c7b88d6.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.2961664839511,
      "lng": 69.60828116140995,
      "zoom": 14
    },
    "latitude": 40.2961664839511,
    "longitude": 69.60828116140995,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "2 км.",
        "valueTg": "2 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "190 м.",
        "valueTg": "190 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,8 км.",
        "valueTg": "2,8 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,45 км.",
        "valueTg": "1,45 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,25 км.",
        "valueTg": "1,25 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "210 м.",
        "valueTg": "210 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "3,3 км.",
        "valueTg": "3,3 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "470 м.",
        "valueTg": "470 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "280 м.",
        "valueTg": "280 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "500 м.",
        "valueTg": "500 м."
      }
    ]
  },
  {
    "id": "proj_toch_162",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Пахтакор - 2»",
    "nameTg": "МҶ «Пахтакор - 2»",
    "slug": "zhk-pahtakor-2",
    "shortDescription": "10-этажный дом с двумя подъездами, закрытым двором и детской площадкой",
    "shortDescriptionTg": "Бинои 10-ошёна бо ду даромадгоҳ, ҳавлии муҳофизатшаванда ва майдончаи бозии кӯдакон",
    "description": "Этот современный 10-этажный дом с двумя подъездами станет вашим идеальным домом. \r\n\r\nОсобенности ЖК \"Пахтакор - 2\":\r\n\r\n- Качественное строительство: Комплекс возводится из жженого кирпича, что обеспечивает \r\nдолговечность и надежность.\r\n- Современные удобства: Лифт в каждом подъезде обеспечивает комфортный и быстрый доступ на любой этаж.\r\n- Активный отдых: На территории комплекса расположены детская и спортивная площадки, которые помогут вам и вашим детям наслаждаться активным образом жизни.\r\n- Эстетика и комфорт: Фасад здания выполнен из керамогранита, что придает комплексу стильный и современный вид.\r\n\r\nЕсть рассрочка до 2 лет (до окончания строительства) без предоплаты.\r\n\r\nУдобное расположение:\r\n\r\nЖилой комплекс «Пахтакор - 2\" находится в центре жизни города, рядом с магазинами, ресторанами и кафе. Всего в нескольких минутах находятся:\r\n\r\n- Магазин \"Амид\" для удобных покупок,\r\n- Детский развлекательный центр для веселого досуга детей,\r\n- Дом-музей Анора для увлекательных экскурсий,\r\n- Перинатальный центр для заботы о здоровье вашей семьи.",
    "descriptionTg": "МҶ «Пахтакор - 2» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "р-н Пахтакор",
    "districtTg": "минтақаи Пахтакор",
    "address": "г. Худжанд, массив Пахтакор",
    "addressTg": "ш. Хуҷанд, мавзеи Пахтакор",
    "landmark": "Район стадиона «Пахтакор»",
    "landmarkTg": "Дар наздикии варзишгоҳи «Пахтакор»",
    "floorsCount": 10,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2026,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0162:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_162_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_162_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_162_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_162_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_162_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 5100,
    "minPricePerMeterUsd": 466,
    "minTotalPriceTjs": 316200,
    "minTotalPriceUsd": 28877,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/30/7e/307e3c213e7950b469d01272988725c4.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/30/7e/307e3c213e7950b469d01272988725c4.png",
      "https://cdntj.somon.tj/media/cache1/38/1b/381befd2e4399172d0b9ec5027d8984b.png",
      "https://cdntj.somon.tj/media/cache1/a9/0a/a90a7a7a89ff96765e45b8cbd4958d55.png",
      "https://cdntj.somon.tj/media/cache1/57/a1/57a1e3df20d698b76379194d642edb5f.png",
      "https://cdntj.somon.tj/media/cache1/5c/ce/5cce32501f6a9cb17f04f21a31740420.png",
      "https://cdntj.somon.tj/media/cache1/1d/f6/1df6bce56f2e506b81d3437b93c20149.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №162/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/30/7e/307e3c213e7950b469d01272988725c4.png",
          "https://cdntj.somon.tj/media/cache1/38/1b/381befd2e4399172d0b9ec5027d8984b.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.27228967886748,
      "lng": 69.60451334386427,
      "zoom": 14
    },
    "latitude": 40.27228967886748,
    "longitude": 69.60451334386427,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "970 м.",
        "valueTg": "970 м."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "85 м.",
        "valueTg": "85 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,15 км.",
        "valueTg": "2,15 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,43 км.",
        "valueTg": "1,43 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "2,4 км.",
        "valueTg": "2,4 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,2 км.",
        "valueTg": "2,2 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,45 км.",
        "valueTg": "1,45 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "2,16 км.",
        "valueTg": "2,16 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "920 м.",
        "valueTg": "920 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "900 м.",
        "valueTg": "900 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "400 м.",
        "valueTg": "400 м."
      }
    ]
  },
  {
    "id": "proj_toch_95",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Бустон»",
    "nameTg": "МҶ «Бӯстон» (Тоҷ Сохтмон)",
    "slug": "zhk-toch-buston",
    "shortDescription": "Уютный 8-этажный жилой комплекс в городе Бустон с развитой инфраструктурой",
    "shortDescriptionTg": "Маҷмааи бароҳати 8-ошёна дар шаҳри Бӯстон бо дастрасии осон ба тамоми муассисаҳо",
    "description": "ЖК \"Бустон\" современный жилой комплекс, который отличается удобным месторасположением — в шаговой доступности от базара, школы, больницы, магазинов, ресторанов и детских садов, что делает жизнь комфортной и удобной для всей семьи.\r\n\r\nЖилой комплекс включает 7 этажей плюс пентхаус. Постройка выполнена из кирпича, что обеспечивает высокую теплоизоляцию и надёжность. В ЖК \"Бустон\" представлены 1-, 2- и 3-комнатные квартиры, которые подойдут как для небольших семей, так и для тех, кто ищет больше пространства.\r\n\r\nДля удобства жильцов предусмотрены детская площадка и парковка, а первый этаж отведён под коммерческие помещения, что добавляет объекту современности и функциональности. В доме есть лифт и пандус для комфортного передвижения. Система вентиляции и кондиционирования обеспечивает свежий воздух и поддерживает комфортную температуру в любое время года.\r\n\r\nАдрес: ул. Опланчука 12, Бустон, Согдийская область",
    "descriptionTg": "МҶ «Бӯстон» (Тоҷ Сохтмон) аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "buston",
    "district": "г. Бустон, центр",
    "districtTg": "ш. Бӯстон, марказ",
    "address": "г. Бустон (Чкаловск), центральный район",
    "addressTg": "ш. Бӯстон (Чкаловск), қисми марказӣ",
    "landmark": "В шаговой доступности от базара, школы и больницы",
    "landmarkTg": "Дар масофаи наздик аз бозор, мактаб ва беморхона",
    "floorsCount": 8,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2025,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0095:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_95_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_95_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_95_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_95_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_95_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 5000,
    "minPricePerMeterUsd": 457,
    "minTotalPriceTjs": 465000,
    "minTotalPriceUsd": 42466,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/19/14/1914dd8179a9530405665a63348aef72.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/19/14/1914dd8179a9530405665a63348aef72.png",
      "https://cdntj.somon.tj/media/cache1/5e/1f/5e1f47453eaacf1394a8189edf8fb014.png",
      "https://cdntj.somon.tj/media/cache1/2c/de/2cde7cdd1797be36a66dff3bbbe30af1.png",
      "https://cdntj.somon.tj/media/cache1/6c/89/6c897a44e65e275ece2c043143f03b58.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №95/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/19/14/1914dd8179a9530405665a63348aef72.png",
          "https://cdntj.somon.tj/media/cache1/5e/1f/5e1f47453eaacf1394a8189edf8fb014.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.23234041181504,
      "lng": 69.69199336011127,
      "zoom": 14
    },
    "latitude": 40.23234041181504,
    "longitude": 69.69199336011127,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "50 м.",
        "valueTg": "50 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "550 м.",
        "valueTg": "550 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "700 м.",
        "valueTg": "700 м."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "510 м.",
        "valueTg": "510 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "460 м.",
        "valueTg": "460 м."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "160 м.",
        "valueTg": "160 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "50 м.",
        "valueTg": "50 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "800 м.",
        "valueTg": "800 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "450 м.",
        "valueTg": "450 м."
      }
    ]
  },
  {
    "id": "proj_toch_63",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Согдиана»",
    "nameTg": "МҶ «Суғдиёна»",
    "slug": "zhk-sogdiana",
    "shortDescription": "16-этажное монолитное здание бизнес-класса на финальном этапе фасадных работ",
    "shortDescriptionTg": "Бинои 16-ошёнаи монолитии дараҷаи тиҷоратӣ дар марҳилаи ниҳоии корҳои намоӣ",
    "description": "Жилой комплекс «Согдиана» который находится по адресу Максудчон Танбури 3, ориентир гостиница Сугдиён - это современное 16-этажное монолитное здание, предлагающее удобные и комфортные условия для жизни.\r\n\r\nАрхитектура: Монолитный каркас, балконы и террасы, 1-3 комнатные квартиры.\r\n\r\nУдобства: Подземная парковка, закрытая детская футбольная и игровая площадки, коммерческие помещения на первом этаже.\r\n\r\nСовременные технологии: Лифты на солнечных панелях, наличие пандуса.\r\n\r\nБезопасность: Шлагбаум, видеонаблюдение, доступ по чипу. Оплата возможна наличными или в рассрочку с 0% ставкой.",
    "descriptionTg": "МҶ «Суғдиёна» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "business",
    "finishing": "rough",
    "city": "khujand",
    "district": "Центр, ул. М. Танбури",
    "districtTg": "Марказ, кӯчаи М. Танбӯрӣ",
    "address": "г. Худжанд, ул. Максуджона Танбури, 3",
    "addressTg": "ш. Хуҷанд, кӯчаи Мақсудҷон Танбӯрӣ, 3",
    "landmark": "Рядом с гостиницей «Суғдиён»",
    "landmarkTg": "Дар наздикии меҳмонхонаи «Суғдиён»",
    "floorsCount": 11,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2025,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0063:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_63_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_63_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_63_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_63_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_63_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 8000,
    "minPricePerMeterUsd": 731,
    "minTotalPriceTjs": 600000,
    "minTotalPriceUsd": 54795,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/66/65/66652f971b4ee5e5f7ac10daf09c132c.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/66/65/66652f971b4ee5e5f7ac10daf09c132c.webp",
      "https://cdntj.somon.tj/media/cache1/b8/98/b898a04813c06f049902cc8ded3d936e.webp",
      "https://cdntj.somon.tj/media/cache1/d3/60/d3601d4e6a074da27086fa535cc7984b.webp",
      "https://cdntj.somon.tj/media/cache1/18/9b/189b7ebd48424375b253dda8ccee8bfe.webp",
      "https://cdntj.somon.tj/media/cache1/d3/56/d3566a989190627e87d4746f566e3e16.webp",
      "https://cdntj.somon.tj/media/cache1/f4/3b/f43b67c2ba48567eb4eb6451a14ef4f2.webp",
      "https://cdntj.somon.tj/media/cache1/c4/46/c44639553059caeb066df226d4ffc9fd.webp",
      "https://cdntj.somon.tj/media/cache1/80/8c/808cfbaa90412412465fd699e121a87a.webp",
      "https://cdntj.somon.tj/media/cache1/26/a6/26a6b4bfbe11f29cc62145d52fd4cf40.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №63/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Этап фасада",
        "title": "Текущая стадия: Этап фасада",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/66/65/66652f971b4ee5e5f7ac10daf09c132c.webp",
          "https://cdntj.somon.tj/media/cache1/b8/98/b898a04813c06f049902cc8ded3d936e.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.28688416175006,
      "lng": 69.61982732467897,
      "zoom": 14
    },
    "latitude": 40.28688416175006,
    "longitude": 69.61982732467897,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,1 км.",
        "valueTg": "1,1 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "250 м.",
        "valueTg": "250 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "1 км.",
        "valueTg": "1 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "750 м.",
        "valueTg": "750 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "60 м.",
        "valueTg": "60 м."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "830 м.",
        "valueTg": "830 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,05 км.",
        "valueTg": "1,05 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "200 м.",
        "valueTg": "200 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "500 м.",
        "valueTg": "500 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "950 м.",
        "valueTg": "950 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "850 м.",
        "valueTg": "850 м."
      }
    ]
  },
  {
    "id": "proj_toch_154",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Пахтакор - 3»",
    "nameTg": "МҶ «Пахтакор - 3»",
    "slug": "zhk-pahtakor-3",
    "shortDescription": "10-этажный жилой квартал с удобной транспортной доступностью и паркингом",
    "shortDescriptionTg": "Маҷмааи 10-ошёна бо таваққуфгоҳ ва роҳҳои қулайи нақлиётӣ",
    "description": "🏢Старт продаж ЖК «Пахтакор - 3»! \r\n\r\nРады сообщить о начале продаж нового жилого комплекса «Пахтакор - 3», который находится в удобной локации недалеко от супермаркета «Амид», ориентир — круг «Спутника». \r\n\r\n🔑 Преимущества ЖК «Пахтакор - 3»: \r\n\r\n1. Возможность приобрести квартиру на начальном этапе строительства — это выгодное решение для вас и вашей семьи. \r\n2. Гибкие условия рассрочки для удобной покупки. \r\n\r\nПредлагаются варианты квартир от 39,92 кв.м до 146,05 кв.м, подходящие для любых потребностей. \r\n\r\nТакже предлагается закрытая территория комплекса с круглосуточным видеонаблюдением и контролируемым доступом. \r\n\r\n🏢Создайте свой уютный дом в современном ЖК «Пахтакор - 3»! \r\n\r\n📞Оставьте заявку или позвоните нам по номеру 5060 и воспользуйтесь выгодными условиями уже сегодня.",
    "descriptionTg": "МҶ «Пахтакор - 3» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "р-н Пахтакор",
    "districtTg": "минтақаи Пахтакор",
    "address": "г. Худжанд, массив Пахтакор (новый квартал)",
    "addressTg": "ш. Хуҷанд, мавзеи Пахтакор (маҳаллаи нав)",
    "landmark": "Рядом с супермаркетом и школой",
    "landmarkTg": "Дар наздикии супермаркет ва мактаб",
    "floorsCount": 10,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 1,
    "deadlineYear": 2027,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0154:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_154_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_154_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_154_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_154_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_154_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 306000,
    "minTotalPriceUsd": 27945,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/bc/83/bc83b5988667f08d4ada9111ffdb762d.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/bc/83/bc83b5988667f08d4ada9111ffdb762d.png",
      "https://cdntj.somon.tj/media/cache1/c5/d1/c5d1af3aad58cd705b064a2200382ac5.png",
      "https://cdntj.somon.tj/media/cache1/f1/61/f1612cb60b1119bdcfbdf023f099e7e3.png",
      "https://cdntj.somon.tj/media/cache1/68/97/6897f85b7d5203795285aa76f69341f5.png",
      "https://cdntj.somon.tj/media/cache1/9a/89/9a893c5f01ce36960ecee3ca09e0128f.png",
      "https://cdntj.somon.tj/media/cache1/b4/1b/b41b801337581138db2ccf82f949af92.png",
      "https://cdntj.somon.tj/media/cache1/02/9b/029b7054c6aade7644accf9ec00af44e.png",
      "https://cdntj.somon.tj/media/cache1/0f/13/0f13c8030c177347fa930623d7109493.png",
      "https://cdntj.somon.tj/media/cache1/81/3c/813c4f2e236873f818fc29fc1228a73c.png",
      "https://cdntj.somon.tj/media/cache1/d2/95/d29514af11dc79001aa4f94b5a3fc523.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №154/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/bc/83/bc83b5988667f08d4ada9111ffdb762d.png",
          "https://cdntj.somon.tj/media/cache1/c5/d1/c5d1af3aad58cd705b064a2200382ac5.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.271564048737886,
      "lng": 69.60434852504795,
      "zoom": 14
    },
    "latitude": 40.271564048737886,
    "longitude": 69.60434852504795,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1 км.",
        "valueTg": "1 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "20 м.",
        "valueTg": "20 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,25 км.",
        "valueTg": "2,25 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "3,6 км.",
        "valueTg": "3,6 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,3 км.",
        "valueTg": "2,3 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,5 км.",
        "valueTg": "1,5 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "2,2 км.",
        "valueTg": "2,2 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "980 м.",
        "valueTg": "980 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "860 м.",
        "valueTg": "860 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "500 м.",
        "valueTg": "500 м."
      }
    ]
  },
  {
    "id": "proj_toch_132",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Оила»",
    "nameTg": "МҶ «Оила»",
    "slug": "zhk-oila",
    "shortDescription": "Семейный 9-этажный жилой комплекс, созданный для комфортной жизни с детьми",
    "shortDescriptionTg": "Маҷмааи оилавии 9-ошёна бо муҳити орому осуда барои тарбияи фарзандон",
    "description": "🏢 Наш новый жилой комплекс в 18 микрорайоне города Худжанд!\r\n\r\nС радостью объявляем о начале продаж квартир в современном ЖК «Оила», расположенном в удобной локации рядом с клиникой «Бахри Шифо» в 18 микрорайоне. \r\n\r\n🔑 Почему стоит выбрать ЖК «Оила»?\r\n\r\n1. Начальный этап строительства — лучшее время для выгодного приобретения жилья. \r\n2. Удобные условия рассрочки, чтобы покупка была комфортной. \r\n3. Широкий выбор планировок: от уютных 48,14 кв.м до просторных 122,42 кв.м — для любых запросов. \r\n4. Современная инфраструктура: \r\n- Детская площадка и зона отдыха для всей семьи. \r\n- Спортивная площадка для активного образа жизни. \r\n\r\n🏢 ЖК «Оила» — это идеальное место для комфортной жизни в гармонии с окружающей средой.\r\n\r\n📞 Звоните по номеру 5060 или оставьте заявку, чтобы узнать больше и успеть выбрать свою квартиру!",
    "descriptionTg": "МҶ «Оила» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "18 мкр",
    "districtTg": "микрорайони 18",
    "address": "г. Худжанд, 18-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 18",
    "landmark": "18 микрорайон, рядом с детсадом и парком",
    "landmarkTg": "Микрорайони 18, дар наздикии кӯдакистон ва боғ",
    "floorsCount": 9,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2026,
    "landArea": "0.40 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0132:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_132_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_132_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_132_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_132_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_132_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 288000,
    "minTotalPriceUsd": 26301,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": false,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/e2/38/e2383168c51c487ff7f8ff3afe7414b9.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/e2/38/e2383168c51c487ff7f8ff3afe7414b9.png",
      "https://cdntj.somon.tj/media/cache1/72/f2/72f2fd2d76bf3a3e7b4228f4d8545ef0.png",
      "https://cdntj.somon.tj/media/cache1/94/de/94deabbd948d0e1b78a0697a8e5ff21a.png",
      "https://cdntj.somon.tj/media/cache1/50/46/5046ee4ec970ad96db086b0380ee22ac.png",
      "https://cdntj.somon.tj/media/cache1/ec/07/ec07ee8428f60eab8d405d10a7087317.png",
      "https://cdntj.somon.tj/media/cache1/9c/71/9c713bc5fa6b2d6042a8dd845cc19670.png",
      "https://cdntj.somon.tj/media/cache1/e3/8c/e38c928b8fd981cd37b58befecfea105.png",
      "https://cdntj.somon.tj/media/cache1/6d/aa/6daa42454072f1cf2aa19c69ccdb3da7.png",
      "https://cdntj.somon.tj/media/cache1/1b/d3/1bd353427ae703d072b7f89ef23b2d99.png",
      "https://cdntj.somon.tj/media/cache1/bb/65/bb6521f43f85d7a8bdca8db2cdae0531.png",
      "https://cdntj.somon.tj/media/cache1/7a/a4/7aa44d8f3b4480238696c84e7a67131a.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №132/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/e2/38/e2383168c51c487ff7f8ff3afe7414b9.png",
          "https://cdntj.somon.tj/media/cache1/72/f2/72f2fd2d76bf3a3e7b4228f4d8545ef0.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.29563086670371,
      "lng": 69.59940548789844,
      "zoom": 14
    },
    "latitude": 40.29563086670371,
    "longitude": 69.59940548789844,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,5 км.",
        "valueTg": "1,5 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "200 м.",
        "valueTg": "200 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "3,4 км.",
        "valueTg": "3,4 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "650 м.",
        "valueTg": "650 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,67 км.",
        "valueTg": "1,67 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "770 м.",
        "valueTg": "770 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "660 м.",
        "valueTg": "660 м."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "530 м.",
        "valueTg": "530 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "730 м.",
        "valueTg": "730 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "300 м.",
        "valueTg": "300 м."
      }
    ]
  },
  {
    "id": "proj_toch_48",
    "developerId": "dev_toch_sohtmon",
    "name": "ЖК «Империал»",
    "nameTg": "МҶ «Империал»",
    "slug": "zhk-imperial",
    "shortDescription": "Грандиозный 22-этажный жилой комплекс премиум-класса — воплощение элегантности и роскоши",
    "shortDescriptionTg": "Маҷмааи муҳташами 22-ошёнаи дараҷаи олӣ — рамзи зебоӣ, бароҳатӣ ва шукӯҳ",
    "description": "Жилой комплекс \"Империал\" — это воплощение элегантности и удобства в самом сердце города. Ощутите высший уровень комфорта и качества жизни в одном из самых престижных комплексов Худжанда.\r\n\r\nОсновные преимущества ЖК \"Империал\":\r\n\r\n- Современная архитектура с уникальным дизайном.\r\n- Просторные и светлые квартиры с удобными планировками.\r\n- Качественная отделка с использованием лучших материалов.\r\n- Закрытая охраняемая территория для вашей безопасности и спокойствия.\r\n- Собственный подземный паркинг с доступом прямо из дома.\r\n- Коммерческие помещения на двух нижних этажах для вашего бизнеса.\r\n- Благоустроенная придомовая территория с детской площадкой и зоной отдыха.\r\n- Эксклюзивные пентхаусы с панорамными видами на город.\r\n- Удобное местоположение в центре города позволяет быстро добраться до любой точки Худжанда.\r\n- Квартиры от 1 до 3 комнат на выбор.\r\n\r\nАдрес: проспект Ташкентский, г. Худжанд. (ориентир Стелла)\r\n\r\nКолл центр: 5060. Звоните и записывайтесь на просмотр уже сегодня! Количество квартир ограничено!",
    "descriptionTg": "МҶ «Империал» аз ширкати бонуфузи «Тоҷ Сохтмон» (Toj Sohtmon). Маҷмаа бо сифати баланди монолитӣ, меъмории муосир, тобоварии зилзила то 9 балл ва шароити мусоид барои зиндагии осуда бунёд мегардад. Ҳамаи ҳуҷҷатҳо ва иҷозатномаи расмии сохтмон мавҷуданд.",
    "status": "under_construction",
    "buildingClass": "premium",
    "finishing": "rough",
    "city": "khujand",
    "district": "28 мкр / Центр",
    "districtTg": "микрорайони 28 / Марказ",
    "address": "г. Худжанд, 28-й микрорайон, проспект Рахимова",
    "addressTg": "ш. Хуҷанд, микрорайони 28, хиёбони Раҳимов",
    "landmark": "Престижный район 28 мкр с панорамным видом на город",
    "landmarkTg": "Минтақаи бонуфузи микрорайони 28 бо манзараи шаҳр",
    "floorsCount": 22,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2026,
    "landArea": "0.65 га",
    "wallMaterial": "Монолит + кирпич и газоблок",
    "facade": "Вентилируемый керамогранит и декоративная штукатурка",
    "cadastralNumber": "73:01:0048:202",
    "customBuildingFeatures": [
      {
        "id": "cbf_toch_48_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_toch_48_2",
        "title": "Лифты",
        "value": "Бесшумные скоростные"
      },
      {
        "id": "cbf_toch_48_3",
        "title": "Паркинг",
        "value": "Подземный + гостевой"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_toch_48_1",
        "title": "Входная дверь",
        "description": "Бронированная металлическая дверь с итальянскими замками."
      },
      {
        "id": "ff_toch_48_2",
        "title": "Окна и лоджии",
        "description": "Энергосберегающие пятикамерные стеклопакеты с панорамным обзором."
      }
    ],
    "minPricePerMeterTjs": 8000,
    "minPricePerMeterUsd": 731,
    "minTotalPriceTjs": 384000,
    "minTotalPriceUsd": 35068,
    "hasInstallment": true,
    "installmentMonths": 36,
    "installmentDownPaymentPercent": 30,
    "hasUndergroundParking": true,
    "hasElevator": true,
    "hasPlayground": true,
    "hasSecurity": true,
    "hasAutonomousHeating": true,
    "amenities": [
      "Монолитный каркас повышенной прочности",
      "Сейсмостойкость 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с круглосуточным видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи устувори монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати доимии видеоӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/d6/5b/d65bc673eb8a546a37e9163e8dd1df3b.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/d6/5b/d65bc673eb8a546a37e9163e8dd1df3b.png",
      "https://cdntj.somon.tj/media/cache1/d3/c5/d3c5f08e03db5b55ac33ba166ab9f5b9.png",
      "https://cdntj.somon.tj/media/cache1/2a/22/2a22247d4e6ca20cedc160e943063ce1.png",
      "https://cdntj.somon.tj/media/cache1/b9/dc/b9dcdedbca0f4c32dda168a1b37e7ca9.png",
      "https://cdntj.somon.tj/media/cache1/57/2b/572ba0d95c674ee1752df48492c8d09b.png",
      "https://cdntj.somon.tj/media/cache1/14/bf/14bf6a30cd1c88bb8b80698b90095211.png",
      "https://cdntj.somon.tj/media/cache1/9e/98/9e981739a9893a65964d3fe2925108a6.png",
      "https://cdntj.somon.tj/media/cache1/52/b6/52b67843a0427ef86553c09e439e92e4.png",
      "https://cdntj.somon.tj/media/cache1/6d/2a/6d2a039e61485b91f6a20ce30cc81107.png",
      "https://cdntj.somon.tj/media/cache1/84/fb/84fb62215e9f78d28a10debe937031e0.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №48/TS",
        "fileUrl": "#"
      },
      {
        "name": "Сертификат сейсмостойкости 9 баллов",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "6-10 этаж готов",
        "title": "Текущая стадия: 6-10 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/d6/5b/d65bc673eb8a546a37e9163e8dd1df3b.png",
          "https://cdntj.somon.tj/media/cache1/d3/c5/d3c5f08e03db5b55ac33ba166ab9f5b9.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.30309516834935,
      "lng": 69.61318471226895,
      "zoom": 14
    },
    "latitude": 40.30309516834935,
    "longitude": 69.61318471226895,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "180 м.",
        "valueTg": "180 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,65 км.",
        "valueTg": "2,65 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,65 км.",
        "valueTg": "1,65 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,15 км.",
        "valueTg": "1,15 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,15 км.",
        "valueTg": "2,15 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,4 км.",
        "valueTg": "1,4 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "270 м.",
        "valueTg": "270 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "650 м.",
        "valueTg": "650 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "450 м.",
        "valueTg": "450 м."
      }
    ]
  }
];
