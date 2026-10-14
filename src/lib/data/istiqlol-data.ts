// Real data for developer Istiqlol Group and its 15 residential complexes in Sughd
import { DeveloperData, ProjectData } from "./mock-db";

export const ISTIQLOL_DEVELOPER: DeveloperData = {
  id: "dev_istiqlol",
  name: "«Истиқлол Гурӯҳ» (Istiqlol Group)",
  slug: "istiqlol-group",
  logoUrl: "https://cdntj.somon.tj/media/cache1/cd/17/cd17b24841b420e071c15b51c676ffe5.webp",
  coverUrl: "https://cdntj.somon.tj/media/cache1/2e/47/2e479a7d3a2ddb48e87426f65faa73c8.webp",
  description:
    "«Истиқлол Гурӯҳ» (Istiqlol Group) — одна из крупнейших девелоперских компаний Согдийской области, работающая с 2014 года. В портфеле девелопера более 20 масштабных жилых комплексов в Худжанде и Гулистоне, отличающихся монолитным качеством строительства, сейсмостойкостью до 9 баллов, скоростными лифтами и современной инфраструктурой.",
  foundedYear: 2014,
  completedProjectsCount: 5,
  activeProjectsCount: 15,
  rating: "4.95",
  isVerified: true,
  city: "khujand",
  officeAddress: "г. Худжанд, 17-й микрорайон",
  phone: "+992 44 600 7507",
  phoneSecondary: "+992 92 888 1280",
  whatsapp: "+992928881280",
  telegram: "istiqlol_group",
  email: "info@istiqlolgroup.tj",
  websiteUrl: "https://somon.tj/new-buildings/developer/20-istiqlol-group/",
};

export const ISTIQLOL_PROJECTS: ProjectData[] = [
  {
    "id": "proj_istiqlol_392",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Кохи Мунаввар»",
    "nameTg": "МҶ «Кохи Мунаввар»",
    "slug": "zhk-kohi-munavvar",
    "shortDescription": "21-этажный монолитный небоскреб с панорамными видами и коммерческой галереей",
    "shortDescriptionTg": "Бинои 21-ошёнаи монолитии дараҷаи тиҷоратӣ бо манзараи панорамӣ ва маркази тиҷоратӣ",
    "description": "ЖК «Кохи Мунаввар» — высота, панорамные виды и новые возможности для комфортной жизни. Расположенный на улице Гагарина, рядом с городской больницей, этот жилой комплекс привлекает сочетанием современной архитектуры, просторного жилого пространства и коммерческой инфраструктуры.\r\n\r\nАрхитектура, которую замечают\r\n\r\nБлоки высотой 21 этаж формируют выразительный облик комплекса. Панорамные окна наполняют квартиры естественным светом, создавая ощущение простора и открывая новые перспективы городской жизни. Скоростные лифты обеспечивают удобное передвижение между этажами.\r\n\r\nЖизнь, в которой всё рядом\r\n\r\nОсобенность ЖК «Кохи Мунаввар» — сочетание жилого и коммерческо��о пространства. Первый и второй этажи отведены под коммерческие помещения, что создаёт возможности для размещения магазинов, офисов и других объектов обслуживания. Благодаря этому комплекс становится не просто местом проживания, а частью городской среды.\r\n\r\nКомфорт в каждой детали\r\n\r\n— Панорамные окна с хорошим естественным освещением\r\n— Скоростные лифты\r\n— Подземная парковка\r\n— Видеонаблюдение и охрана территории\r\n— Охраняемая парковка\r\n— Детская площадка\r\n— Оптиковолоконный интернет\r\n— Кабельное телевидение\r\n\r\nЛокация с преимуществами\r\n\r\nУлица Гагарина — удобное расположение для тех, кому важна доступность городской инфраструктуры. Рядом находится городская больница, а транспортная доступность помогает планировать повседневные поездки и решать бытовые вопросы без лишних сложностей.\r\n\r\nЖК «Кохи Мунаввар» — пространство, где современная архитектура встречается с практичностью, а городская динамика сочетается с комфортом собственного дома.",
    "descriptionTg": "МҶ «Кохи Мунаввар» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "business",
    "finishing": "rough",
    "city": "khujand",
    "district": "17 мкр",
    "districtTg": "микрорайони 17",
    "address": "г. Худжанд, ул. Гагарина (17-й микрорайон)",
    "addressTg": "ш. Хуҷанд, кӯчаи Гагарин (микрорайони 17)",
    "landmark": "Рядом с городской больницей",
    "landmarkTg": "Дар наздикии беморхонаи шаҳрӣ",
    "floorsCount": 21,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2029,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0392:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_392_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_392_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_392_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_392_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_392_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6500,
    "minPricePerMeterUsd": 594,
    "minTotalPriceTjs": 234000,
    "minTotalPriceUsd": 21370,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/2e/47/2e479a7d3a2ddb48e87426f65faa73c8.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/2e/47/2e479a7d3a2ddb48e87426f65faa73c8.webp",
      "https://cdntj.somon.tj/media/cache1/07/1f/071f448dd8bae3572a2a1f68abd4c6c0.webp",
      "https://cdntj.somon.tj/media/cache1/8f/96/8f9621bf6775ec5f79aa59ed9bdec491.webp",
      "https://cdntj.somon.tj/media/cache1/90/fe/90fe5696b14c23ea68f735fb6fe03c90.webp",
      "https://cdntj.somon.tj/media/cache1/6b/b8/6bb8be190ae64a69c9bbc14537092591.webp",
      "https://cdntj.somon.tj/media/cache1/2a/78/2a78f2cfcb8814b38536cb5cd1e0fd63.webp",
      "https://cdntj.somon.tj/media/cache1/fd/53/fd5387e9835973edee3df403ee18534f.webp",
      "https://cdntj.somon.tj/media/cache1/df/ea/dfeaa429cfd6aa4330c9ecfc50f175eb.webp",
      "https://cdntj.somon.tj/media/cache1/a2/cd/a2cd1fa9bef584f88901ca4b82136052.webp",
      "https://cdntj.somon.tj/media/cache1/d3/2f/d32f500ae95fa5641768045d1b9be13c.webp",
      "https://cdntj.somon.tj/media/cache1/d4/2d/d42d4c16601eb8423457fa40719f8b56.webp",
      "https://cdntj.somon.tj/media/cache1/00/84/0084e776493f19a378136eee369fe5ac.webp",
      "https://cdntj.somon.tj/media/cache1/d9/48/d9484828d89a27509ded8a62846b8bf6.webp",
      "https://cdntj.somon.tj/media/cache1/04/2e/042edce7ad5c34d69bc749f1fa3f5d8b.webp",
      "https://cdntj.somon.tj/media/cache1/58/47/5847ad05be20d5fb43f9256d5a58e344.webp",
      "https://cdntj.somon.tj/media/cache1/8e/05/8e05f178f9ba590cd280c694ea444a4e.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №392/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/2e/47/2e479a7d3a2ddb48e87426f65faa73c8.webp",
          "https://cdntj.somon.tj/media/cache1/07/1f/071f448dd8bae3572a2a1f68abd4c6c0.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.274657080314206,
      "lng": 69.6417827651935,
      "zoom": 14
    },
    "latitude": 40.274657080314206,
    "longitude": 69.6417827651935,
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
        "value": "100 м.",
        "valueTg": "100 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,9 км.",
        "valueTg": "2,9 км."
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
        "value": "1 км.",
        "valueTg": "1 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,6 км.",
        "valueTg": "2,6 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,6 км.",
        "valueTg": "2,6 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "2,9 км.",
        "valueTg": "2,9 км."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "850 м.",
        "valueTg": "850 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "1,1 км.",
        "valueTg": "1,1 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      }
    ]
  },
  {
    "id": "proj_istiqlol_391",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Кохи Азим»",
    "nameTg": "МҶ «Кохи Азим»",
    "slug": "zhk-kohi-azim",
    "shortDescription": "Флагманский 26-этажный комплекс премиум-класса в самом сердце Худжанда",
    "shortDescriptionTg": "Муҳташамтарин маҷмааи истиқоматии 26-ошёнаи дараҷаи олӣ дар маркази шаҳри Хуҷанд",
    "description": "ЖК «Кохи Азим» — современный жилой комплекс, расположенный в городе Худжанд по адресу: проспект Исмоили Сомони, 3. Комплекс сочетает комфортное жилое пространство, современную инфраструктуру и удобное расположение в городе.\r\n\r\nВсё необходимое рядом\r\n\r\nНа 1-м, 2-м, 3-м и 4-м этажах комплекса предусмотрены торговые помещения и магазины, что обеспечивает жителям удобный доступ к необходимым товарам и услугам непосредственно рядом с домом.\r\n\r\nПреимущества ЖК «Кохи Азим»\r\n\r\n— Панорамные окна — больше естественного света и открытые виды\r\n— Скоростные лифты для комфортного перемещения по комплексу\r\n— Подземная парковка\r\n— Видеонаблюдение для дополнительной безопасности\r\n— Охрана территории\r\n— Охраняемая парковка\r\n— Детская площадка\r\n— Оптиковолоконное интернет-соединение\r\n— Кабельное телевидение\r\n\r\nКомфорт и безопасность\r\n\r\n«Кохи Азим» создан для тех, кто ценит современный уровень комфорта, безопасность и удобство городской жизни. Панорамное остекление, современные лифты, система видеонаблюдения, охрана и развитая инфраструктура делают комплекс привлекательным местом как для проживания, так и для приобретения недвижимости.\r\n\r\nЖК «Кохи Азим» — современный формат городской жизни в одном из удобных районов Худжанда.",
    "descriptionTg": "МҶ «Кохи Азим» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "premium",
    "finishing": "rough",
    "city": "khujand",
    "district": "Центр, пр. Исмоили Сомони",
    "districtTg": "Марказ, хиёбони Исмоили Сомонӣ",
    "address": "г. Худжанд, проспект Исмоили Сомони, 3",
    "addressTg": "ш. Хуҷанд, хиёбони Исмоили Сомонӣ, 3",
    "landmark": "Центральный проспект города",
    "landmarkTg": "Хиёбони марказии шаҳр",
    "floorsCount": 26,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2029,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0391:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_391_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_391_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_391_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_391_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_391_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 270000,
    "minTotalPriceUsd": 24658,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/dc/ef/dcefb0f4d1a607c1d2248856b8b0f11a.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/dc/ef/dcefb0f4d1a607c1d2248856b8b0f11a.webp",
      "https://cdntj.somon.tj/media/cache1/e2/55/e25583b3a779784b319416313efaf949.webp",
      "https://cdntj.somon.tj/media/cache1/0d/26/0d2603f7d9a6c4facee3893e5c72109f.webp",
      "https://cdntj.somon.tj/media/cache1/57/b9/57b92543221ffe85a157605879ad4b3b.webp",
      "https://cdntj.somon.tj/media/cache1/d4/43/d443432dff54ee020aea8e5ad8b37707.webp",
      "https://cdntj.somon.tj/media/cache1/d5/14/d5142db81881fa6500b4d1356d5143a5.webp",
      "https://cdntj.somon.tj/media/cache1/12/16/121647fdc5ccbf6151e73f138649e87d.webp",
      "https://cdntj.somon.tj/media/cache1/8b/7c/8b7c360cf894ada1c4e42f813adfe2ed.webp",
      "https://cdntj.somon.tj/media/cache1/a4/f4/a4f4275bddae2cbe43423fd7fb7ca012.webp",
      "https://cdntj.somon.tj/media/cache1/be/67/be67173a93d16b28a6f7c8839f4c944b.webp",
      "https://cdntj.somon.tj/media/cache1/0b/9d/0b9d5970d4f4be4eea2b4532378e7bf3.webp",
      "https://cdntj.somon.tj/media/cache1/96/bf/96bf45194df1b6dcbd5d69a3b57d8411.webp",
      "https://cdntj.somon.tj/media/cache1/36/bb/36bbfd2132aa1bbefdaed4e316e01542.webp",
      "https://cdntj.somon.tj/media/cache1/2f/d6/2fd6a78bdeff0be42bb042a46804fc41.webp",
      "https://cdntj.somon.tj/media/cache1/e2/c1/e2c1b86990c75ce07a99c6db3077ef76.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №391/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/dc/ef/dcefb0f4d1a607c1d2248856b8b0f11a.webp",
          "https://cdntj.somon.tj/media/cache1/e2/55/e25583b3a779784b319416313efaf949.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.285589481967406,
      "lng": 69.6235756690227,
      "zoom": 14
    },
    "latitude": 40.285589481967406,
    "longitude": 69.6235756690227,
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
        "value": "10 м.",
        "valueTg": "10 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "2,8 км.",
        "valueTg": "2,8 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,1 км.",
        "valueTg": "2,1 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "400  м.",
        "valueTg": "400  м."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
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
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      }
    ]
  },
  {
    "id": "proj_istiqlol_368",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Royal Towers»",
    "nameTg": "МҶ «Istiqlol Royal Towers»",
    "slug": "zhk-istiqlol-royal-towers",
    "shortDescription": "Современный 16-этажный комплекс с видовыми пентхаусами и террасами",
    "shortDescriptionTg": "Маҷмааи муосири 16-ошёна бо пентхаусҳо ва айвонҳои кушоди зебоманзар",
    "description": "ЖК Istiqlol Royal Towers — современный комплекс с пентхаусами и террасами!\r\n\r\nЖК Istiqlol Royal Towers — современный жилой комплекс, расположенный по адресу: проспект Рифат Ходжиева, дом 27. Проект сочетает комфортную жилую инфраструктуру, современные технологии и высокий уровень безопасности, создавая удобную и качественную среду для жизни всей семьи.\r\n\r\nЖилой комплекс состоит из 4 блоков: А, Б, В и Г. Блоки Б, В и Г имеют по 16 этажей. Архитектура комплекса предусматривает современные планировки, коммерческую инфраструктуру, подземный паркинг и комфортную территорию для жителей.\r\n\r\nСтруктура комплекса\r\nБлок А — современный жилой блок с продуманной инфраструктурой.\r\nБлок Б — 16 этажей.\r\nБлок В — 16 этажей.\r\nБлок Г — 16 этажей.\r\n\r\nВ блоках Б, В и Г предусмотрена рассрочка сроком до 36 месяцев, что позволяет приобрести квартиру на более удобных условиях.\r\n\r\nВ комплексе предусмотрена продуманная структура: на -1 этаже расположен подземный паркинг, на 1–2 этажах — торговый центр или магазины, 3–15 этажи занимают квартиры, а на 16 этаже расположены пентхаусы с террасами.\r\n\r\nСдача комплекса запланирована до 2029 года. Для покупателей предусмотрены удобные условия приобретения: в зависимости от блока действует рассрочка до 24 или до 36 месяцев, с первоначальным взносом от 30%.\r\n\r\nПреимущества ЖК Istiqlol Royal Towers\r\nКонсьерж-сервис — профессиональное обслуживание для дополнительного комфорта жителей.\r\nПанорамные окна — больше естественного света и красивые виды из окон квартир.\r\nПодземная парковка — удобное и безопасное место для автомобилей жителей комплекса.\r\nВидеонаблюдение — круглосуточный контроль территории.\r\nОхрана — профессиональная служба безопасности.\r\nОхраняемая парковка — дополнительная защита автомобилей.\r\nДетская площадка — безопасное пространство для игр и отдыха детей.\r\nОптиковолоконный интернет — высокоскоростное соединение для работы, учёбы и развлечений.\r\nДополнительная шумоизоляция — комфортная атмосфера благодаря снижению уровня посторонних шумов.\r\nКабельное телевидение — доступ к широкому выбору телевизионных каналов.\r\nЦентральная горячая вода — стабильное обеспечение горячим водоснабжением.\r\nДвор без машин — безопасная территория для прогулок и отдыха жителей.\r\nСистема «Умный дом» — современные технологии для управления различными функциями квартиры.\r\nОтопление — комфортная температура в квартире в холодное время года.\r\nОсобенность ЖК Istiqlol Royal Towers\r\n\r\nIstiqlol Royal Towers — это сочетание современного жилья, коммерческой инфраструктуры и продуманных решений для комфортной жизни. Комплекс состоит из 4 блоков — А, Б, В и Г, а блоки Б, В и Г включают по 16 этажей.\r\n\r\nПентхаусы с террасами, панорамные окна, подземный паркинг, двор без машин, система «Умный дом», развитая инфраструктура и современные технологии делают Istiqlol Royal Towers привлекательным выбором для тех, кто ценит комфорт, безопасность, качество и современный стиль жизни.\r\n\r\nIstiqlol Royal Towers — современное пространство для жизни, где комфорт встречается с архитектурой будущего.",
    "descriptionTg": "МҶ «Istiqlol Royal Towers» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "business",
    "finishing": "rough",
    "city": "khujand",
    "district": "28 мкр",
    "districtTg": "микрорайони 28",
    "address": "г. Худжанд, проспект Рахимова (28-й микрорайон)",
    "addressTg": "ш. Хуҷанд, хиёбони Раҳимов (микрорайони 28)",
    "landmark": "Проспект Рахимова, 28 мкр",
    "landmarkTg": "Хиёбони Раҳимов, микрорайони 28",
    "floorsCount": 16,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2029,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0368:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_368_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_368_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_368_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_368_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_368_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6600,
    "minPricePerMeterUsd": 603,
    "minTotalPriceTjs": 303600,
    "minTotalPriceUsd": 27726,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/bf/62/bf6296279f008d11b26e480316074018.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/bf/62/bf6296279f008d11b26e480316074018.webp",
      "https://cdntj.somon.tj/media/cache1/90/21/902177c16f9d8e1e1951fcfedaedd7db.webp",
      "https://cdntj.somon.tj/media/cache1/28/b5/28b5a300593c13005684578a3f7eb912.webp",
      "https://cdntj.somon.tj/media/cache1/9f/43/9f430a6e2c908d16f55ea1e441ec90f2.webp",
      "https://cdntj.somon.tj/media/cache1/7d/8f/7d8f5a966c1761623a303cb7eeec8d07.webp",
      "https://cdntj.somon.tj/media/cache1/5d/d7/5dd7e82948377207cd8dbc84baf9166d.webp",
      "https://cdntj.somon.tj/media/cache1/c0/65/c065bb295f6a62f103f291d6858e380d.webp",
      "https://cdntj.somon.tj/media/cache1/24/23/2423665a74851e4ef58c415c41cff627.webp",
      "https://cdntj.somon.tj/media/cache1/11/0f/110f275c7f029ba0178bfcde4aa69e0e.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №368/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Фундамент",
        "title": "Текущая стадия: Фундамент",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/bf/62/bf6296279f008d11b26e480316074018.webp",
          "https://cdntj.somon.tj/media/cache1/90/21/902177c16f9d8e1e1951fcfedaedd7db.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.30009568341052,
      "lng": 69.62030379159935,
      "zoom": 14
    },
    "latitude": 40.30009568341052,
    "longitude": 69.62030379159935,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "500 м.",
        "valueTg": "500 м."
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
        "value": "2,3 км.",
        "valueTg": "2,3 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "3,4 км.",
        "valueTg": "3,4 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,0 км.",
        "valueTg": "1,0 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,3 км.",
        "valueTg": "2,3 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "800 м.",
        "valueTg": "800 м."
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
        "value": "450 м.",
        "valueTg": "450 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      }
    ]
  },
  {
    "id": "proj_istiqlol_365",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Премиум Класс»",
    "nameTg": "МҶ «Премиум Класс»",
    "slug": "zhk-premium-class",
    "shortDescription": "Элитный 17-этажный жилой дом с двухуровневым подземным паркингом",
    "shortDescriptionTg": "Бинои 17-ошёнаи дараҷаи олӣ бо таваққуфгоҳи зеризаминии дусатҳа",
    "description": "Жилой комплекс Премиум Класс — современный жилой комплекс премиум-класса, расположенный рядом с Городской боль��ицей в одном из удобных районов Душанбе. Проект сочетает современную архитектуру, качественное строительство и продуманную инфраструктуру, создавая высокий уровень комфорта для будущих жителей. На 17-м этаже комплекса предусмотрена просторная терраса, где можно наслаждаться панорамными видами города и проводить время с семьей и друзьями.\r\n\r\nДля покупателей действует удобная рассрочка сроком до 24 месяцев с первоначальным взносом 30%. Первые три этажа комплекса занимают коммерческие помещения и магазины, благодаря чему все необходимые товары и услуги находятся в шаговой доступности. ЖК Премиум Класс — это сочетание престижного расположения, современных технологий строительства и комфортной городской среды.\r\n\r\nПреимущества ЖК Премиум Класса\r\n\r\n- Панорамные окна\r\nМаксимум естественного света и великолепные виды на город.\r\n\r\n- Скоростные лифты\r\nСовременные лифты обеспечивают быстрое и комфортное перемещение между этажами.\r\n\r\n- Подземная парковка\r\nБезопасное и удобное место для автомобилей жителей комплекса.\r\n\r\n- Коммерческие помещения\r\nНа 1–3 этажах расположены магазины и объекты инфраструктуры для ежедневных покупок и услуг.\r\n\r\n- Видеонаблюдение\r\nКруглосуточный контроль территории для обеспечения безопасности.\r\n\r\n- Охрана\r\nПрофессиональная служба безопасности для спокойствия жителей.\r\n\r\n- Охраняемая парковка\r\nДополнительная защита автомобилей на территории комплекса.\r\n\r\n- Детская площадка\r\nСовременная игровая зона для активного отдыха детей.\r\n\r\n- Дополнительная шумоизоляция\r\nПовышенный комфорт благодаря эффективной защите от постороннего шума.\r\n\r\n- Кабельное телевидение\r\nДоступ к широкому выбору телевизионных каналов.\r\n\r\nОсобенность ЖК Премиум Класса\r\n\r\n\r\nЖК Премиум Класс — это жилой комплекс премиум-класса, где каждая деталь продумана для комфортной жизни. Просторная терраса на 17-м этаже, современная архитектура, развитая инфраструктура и высокий уровень безопасности создают идеальное пространство для тех, кто ценит качество, престиж и удобство. Здесь городской ритм гармонично сочетается с уютом и комфортом вашего дома.",
    "descriptionTg": "МҶ «Премиум Класс» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "premium",
    "finishing": "rough",
    "city": "khujand",
    "district": "17 мкр",
    "districtTg": "микрорайони 17",
    "address": "г. Худжанд, ул. Гагарина, рядом с горбольницей",
    "addressTg": "ш. Хуҷанд, кӯчаи Гагарин, дар наздикии беморхонаи шаҳрӣ",
    "landmark": "Рядом с Городской больницей",
    "landmarkTg": "Дар наздикии беморхонаи шаҳрӣ",
    "floorsCount": 17,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 1,
    "deadlineYear": 2029,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0365:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_365_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_365_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_365_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_365_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_365_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6500,
    "minPricePerMeterUsd": 594,
    "minTotalPriceTjs": 370500,
    "minTotalPriceUsd": 33836,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/e6/dd/e6ddba2f6c6c8a0df1dfc11b754e6faa.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/e6/dd/e6ddba2f6c6c8a0df1dfc11b754e6faa.webp",
      "https://cdntj.somon.tj/media/cache1/3c/b6/3cb625c089d93223d194a987fcd6183e.webp",
      "https://cdntj.somon.tj/media/cache1/d0/27/d027d451408cdada644cc28845628ba6.webp",
      "https://cdntj.somon.tj/media/cache1/a1/6d/a16de43cf0aa52db21f10f309014d6a9.webp",
      "https://cdntj.somon.tj/media/cache1/75/f1/75f1830a3e096edf4275b721acf1f521.webp",
      "https://cdntj.somon.tj/media/cache1/88/a7/88a7fc85982c88094f0ea2f859da1716.webp",
      "https://cdntj.somon.tj/media/cache1/30/91/30915a133b663e59101b24b5c0354420.webp",
      "https://cdntj.somon.tj/media/cache1/d6/34/d634a6312f7d39dd239de43bd5d24dfe.webp",
      "https://cdntj.somon.tj/media/cache1/b9/ad/b9ad39c3222aa5d2a79e7848334f6cf0.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №365/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/e6/dd/e6ddba2f6c6c8a0df1dfc11b754e6faa.webp",
          "https://cdntj.somon.tj/media/cache1/3c/b6/3cb625c089d93223d194a987fcd6183e.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.27387501453733,
      "lng": 69.64201100667756,
      "zoom": 14
    },
    "latitude": 40.27387501453733,
    "longitude": 69.64201100667756,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,0 км.",
        "valueTg": "1,0 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "4 м.",
        "valueTg": "4 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "850 м.",
        "valueTg": "850 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "500 м.",
        "valueTg": "500 м."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,0 км.",
        "valueTg": "1,0 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "1,0 км.",
        "valueTg": "1,0 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,6 км.",
        "valueTg": "2,6 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "3,5 км.",
        "valueTg": "3,5 км."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "3,4 км.",
        "valueTg": "3,4 км."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "1,0 км.",
        "valueTg": "1,0 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      }
    ]
  },
  {
    "id": "proj_istiqlol_331",
    "developerId": "dev_istiqlol",
    "name": "ЖК «8 мкр Болаёкат»",
    "nameTg": "МҶ «Микрорайони 8 (Болаёқат)»",
    "slug": "zhk-8-mkr-bolayokat",
    "shortDescription": "Уютный 17-этажный комплекс комфорт-класса с развитой инфраструктурой",
    "shortDescriptionTg": "Маҷмааи бароҳати 17-ошёна бо шароити мусоид ва инфрасохтори рушдёфта",
    "description": "ЖК «8 мкр Болаёкат» — современный жилой комплекс, расположенный в 8-м микрорайоне города Худжанд. Проект сочетает удобное расположение, качественное строительство и продуманную инфраструктуру, создавая комфортные условия для жизни всей семьи.\r\n\r\nНа первых двух этажах комплекса расположены магазины и коммерческие помещения, благодаря чему все необходимые товары и услуги будут находиться в шаговой доступности. На 17 этаже предусмотрены просторные террасы с прекрасными видами на город.\r\n\r\nКомплекс находится в районе с развитой инфраструктурой и удобной транспортной доступностью, что делает его отличным выбором как для проживания, так и для инвестиций.\r\n\r\nПреимущества комплекса:\r\n✅ Развитая инфраструктура района;\r\n✅ Удобная транспортная развязка;\r\n✅ Панорамные окна;\r\n✅ Просторные террасы на 17 этаже;\r\n✅ Коммерческие помещения на 1 и 2 этажах.\r\n✅ Удобства для жителей:\r\n✅ Скоростные лифты;\r\n✅ Подземный паркинг;\r\n✅ Охраняемая парковка;\r\n✅ Круглосуточная охрана;\r\n✅ Видеонаблюдение;\r\n✅ Современная детская площадка;\r\n✅ Дополнительная шумоизоляция квартир;\r\n✅ Кабельное телевидение.\r\nУсловия покупки:\r\n- Рассрочка до 20 месяцев;\r\n- Первоначальный взнос — от 30%.\r\n\r\nЖК «8 мкр Болаёкат» — это современное жилье, где комфорт, безопасность и удобное расположение объединены для вашего комфортного будущего.",
    "descriptionTg": "МҶ «Микрорайони 8 (Болаёқат)» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "8 мкр",
    "districtTg": "микрорайони 8",
    "address": "г. Худжанд, 8-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 8",
    "landmark": "8-й микрорайон Худжанда",
    "landmarkTg": "Микрорайони 8-уми шаҳри Хуҷанд",
    "floorsCount": 17,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2028,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0331:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_331_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_331_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_331_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_331_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_331_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5000,
    "minPricePerMeterUsd": 457,
    "minTotalPriceTjs": 255000,
    "minTotalPriceUsd": 23288,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/7c/40/7c40604010a9d3e3c8cd036145c3d423.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/7c/40/7c40604010a9d3e3c8cd036145c3d423.webp",
      "https://cdntj.somon.tj/media/cache1/99/4a/994a56efd158072dcf0ce631fb3a4d6f.webp",
      "https://cdntj.somon.tj/media/cache1/dc/6e/dc6ebc8fedb6bbc887508877c23e168d.webp",
      "https://cdntj.somon.tj/media/cache1/59/2f/592f4ee3e730dc0a1964f97da382cf79.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №331/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/7c/40/7c40604010a9d3e3c8cd036145c3d423.webp",
          "https://cdntj.somon.tj/media/cache1/99/4a/994a56efd158072dcf0ce631fb3a4d6f.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.283142882778236,
      "lng": 69.58555878086034,
      "zoom": 14
    },
    "latitude": 40.283142882778236,
    "longitude": 69.58555878086034,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,2 км.",
        "valueTg": "1,2 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "350 м.",
        "valueTg": "350 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "4,8 км.",
        "valueTg": "4,8 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,1 км.",
        "valueTg": "1,1 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,2 км.",
        "valueTg": "1,2 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "300 м.",
        "valueTg": "300 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,6 км.",
        "valueTg": "1,6 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "3,7 км.",
        "valueTg": "3,7 км."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "1,4 км.",
        "valueTg": "1,4 км."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      }
    ]
  },
  {
    "id": "proj_istiqlol_265",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Residence»",
    "nameTg": "МҶ «Istiqlol Residence»",
    "slug": "zhk-istiqlol-residence",
    "shortDescription": "Масштабный 14-этажный жилой квартал с безопасным закрытым двором",
    "shortDescriptionTg": "Маҳаллаи бузурги 14-ошёна бо ҳавлии пӯшида ва амнияти комил",
    "description": "Жилой комплекс «Istiqlol Residence» строится в городе Худжанд, в 20 микрорайоне, рядом со зданием Коррупции. Это масштабный современный проект, ориентированный на комфортную городскую жизнь, безопасность и удобство для семей, специалистов и инвесторов.\r\n\r\n🏢 Концепция жилого комплекса\r\n\r\nЖК «Istiqlol Residence» — это продуманное жилое пространство с коммерческой инфраструктурой на нижних этажах и комфортными квартирами на верхних уровнях. Комплекс сочетает современную архитектуру, надежные технологии строительства и удобное расположение в одном из активно развивающихся районов города.\r\n\r\n⭐ Удобства и преимущества ЖК\r\n- Скоростные лифты — быстрый и бесшумный доступ на любой этаж\r\n- Панорамные окна — максимум естественного света и открытые виды\r\n- Подземная парковка на -2 этажа — удобство и защита автомобилей в любое время года\r\n- Охраняемая парковка\r\n- Круглосуточное видеонаблюдение — по периметру и в общих зонах\r\n- Служба охраны — дополнительный уровень безопасности\r\n- Современная детская площадка — безопасное пространство для детей\r\n- Оптико-волоконный интернет — стабильная и высокая скорость соединения\r\n- Кабельное телевидение\r\n- Дополнительная шумоизоляция — тишина и комфорт в квартирах\r\n\r\n🏗 Технические характеристики\r\n- Материал строительства: монолит — прочность, долговечность и устойчивость\r\n- 5 блоков — сбалансированная плотность застройки\r\n- 1–2 этажи — коммерческая зона (магазины, сервисы, услуги)\r\n- 3–14 этажи — жилые квартиры\r\n- 15 этаж — пентхаусы с террасами, идеальные для ценителей пространства и приватности\r\n\r\n💳 Условия покупки\r\n- Рассрочка до 30 месяцев\r\n- Предоплата от 30%\r\n- Гибкие условия, подходящие как для проживания, так и для инвестиций\r\n\r\n📍 Локация и инфраструктура\r\n20 микрорайон — район с развитой инфраструктурой и отличной транспортной развязкой.\r\nВ шаговой доступности находятся:\r\n- государственные учреждения\r\n- школы и детские сады\r\n- магазины, супермаркеты, аптеки\r\n- остановки общественного транспорта\r\n\r\nЖК «Istiqlol Residence» — это современный уровень жизни в Худжанде. Удобное расположение, продуманные планировки, безопасность и комфорт в каждом элементе комплекса.",
    "descriptionTg": "МҶ «Istiqlol Residence» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "business",
    "finishing": "rough",
    "city": "khujand",
    "district": "20 мкр",
    "districtTg": "микрорайони 20",
    "address": "г. Худжанд, 20-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 20",
    "landmark": "20-й микрорайон",
    "landmarkTg": "Микрорайони 20",
    "floorsCount": 14,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2028,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0265:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_265_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_265_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_265_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_265_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_265_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 342000,
    "minTotalPriceUsd": 31233,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/4d/8a/4d8abb880bee80ad92de8d59c42af8a2.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/4d/8a/4d8abb880bee80ad92de8d59c42af8a2.webp",
      "https://cdntj.somon.tj/media/cache1/c2/fb/c2fb0a81023fb0de7343d6348a1f5c72.webp",
      "https://cdntj.somon.tj/media/cache1/be/6f/be6fbbbca45d21be15206d09235813e1.webp",
      "https://cdntj.somon.tj/media/cache1/5d/35/5d3545b1e1a2be6ea0437fecc0c27440.webp",
      "https://cdntj.somon.tj/media/cache1/cb/20/cb20516cdc7ddd90b2dfe6b525c89980.webp",
      "https://cdntj.somon.tj/media/cache1/1b/ea/1beafa5bbe6fcf2cce3a86bdf99fd303.webp",
      "https://cdntj.somon.tj/media/cache1/4d/f0/4df094ad501a39e522d15281c1df5fa2.webp",
      "https://cdntj.somon.tj/media/cache1/b7/c6/b7c679e8b93a43aa4b1bee36339903c7.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №265/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/4d/8a/4d8abb880bee80ad92de8d59c42af8a2.webp",
          "https://cdntj.somon.tj/media/cache1/c2/fb/c2fb0a81023fb0de7343d6348a1f5c72.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.30394296020844,
      "lng": 69.62196787879398,
      "zoom": 14
    },
    "latitude": 40.30394296020844,
    "longitude": 69.62196787879398,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "580 м.",
        "valueTg": "580 м."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "210 м.",
        "valueTg": "210 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "3,9 км.",
        "valueTg": "3,9 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "2,5 км.",
        "valueTg": "2,5 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,7 км.",
        "valueTg": "1,7 км."
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
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,9 км.",
        "valueTg": "2,9 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,65 км.",
        "valueTg": "1,65 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК",
        "valueTg": "Дар дохили маҷмаа"
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "1,15 км.",
        "valueTg": "1,15 км."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "350 м.",
        "valueTg": "350 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_278",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Dusti Tower»",
    "nameTg": "МҶ «Dusti Tower» (Бурҷи Дӯстӣ)",
    "slug": "zhk-dusti-tower",
    "shortDescription": "16-этажная башня комфорт-класса напротив Планетария",
    "shortDescriptionTg": "Маҷмааи баланди 16-ошёна рӯ ба рӯи Расадхона дар микрорайони 31",
    "description": "ЖК Dusti Tower — современный жилой комплекс, строящийся в городе Худжанд в 31-м микрорайоне, удобный ориентир — напротив Планетария. Одним из главных преимуществ проекта является близость к Ботаническому саду, что обеспечивает чистый воздух, зелёные зоны и приятную атмосферу для жизни. Комплекс сочетает удобную локацию, современную архитектуру и комфортные планировки, идеально подходящие для семей и инвесторов. Dusti Tower — отличный выбор для тех, кто ценит спокойствие, природу и городской комфорт одновременно.\r\n⭐Удобства и сервисы для жителей:\r\n\r\n- Панорамные окна\r\n- Скоростные и бесшумные лифты\r\n- Система видеонаблюдения\r\n- Современные детские площадки\r\n- Консьерж-сервис\r\n- Подземная и охраняемая наземная парковка\r\n- Круглосуточная охрана\r\n- Система «умный дом»\r\n- Возможность зарядки электротранспорта\r\n- Оптоволоконное интернет-соединение\r\n- Кабельное телевидение\r\n\r\n🏗Технические характеристики:\r\n- Материал строительства — монолит\r\n- Блоки А, Б и В: квартиры расположены с 3 по 17 этаж, первые два этажа отведены под коммерческую зону.\r\n- Блоки Г, Д, Е и Ж: жилые квартиры размещены с 1 по 17 этаж.\r\n- 17 этаж во всех блоках — пентхаусы с собственными террасами.\r\n\r\n💳 Условия покупки:\r\nРассрочка до окончания строительства\r\nСрок рассрочки — до 24 месяцев с первоначальным взносом 30%\r\nГибкие и индивидуальные условия для покупателей и инвесторов.\r\n\r\n📍 Локация:\r\nЖК Dusti Tower расположен в 31-м микрорайоне — районе с развитой инфраструктурой и удобной транспортной развязкой. В шаговой доступности находятся школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Dusti Tower» — это не просто жильё, а новый уровень жизни, где комфорт, безопасность и статус объединены в одном уникальном проекте в самом центре Худжанда.",
    "descriptionTg": "МҶ «Dusti Tower» (Бурҷи Дӯстӣ) аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "31 мкр",
    "districtTg": "микрорайони 31",
    "address": "г. Худжанд, 31-й микрорайон, напротив Планетария",
    "addressTg": "ш. Хуҷанд, микрорайони 31, рӯ ба рӯи Расадхона (Планетарий)",
    "landmark": "Напротив Планетария",
    "landmarkTg": "Рӯ ба рӯи Расадхона (Планетарий)",
    "floorsCount": 16,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2028,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0278:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_278_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_278_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_278_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_278_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_278_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5600,
    "minPricePerMeterUsd": 511,
    "minTotalPriceTjs": 308000,
    "minTotalPriceUsd": 28128,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/cf/64/cf64b2cd306adcb7a0ddec04cd27a70e.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/cf/64/cf64b2cd306adcb7a0ddec04cd27a70e.webp",
      "https://cdntj.somon.tj/media/cache1/be/d5/bed587898439d7414dec6d2b8add8680.webp",
      "https://cdntj.somon.tj/media/cache1/dc/26/dc26fe6234ec0bdb9414dbe0eff987c8.webp",
      "https://cdntj.somon.tj/media/cache1/2c/f1/2cf17137a0c787034a935877fa2a6ece.webp",
      "https://cdntj.somon.tj/media/cache1/54/a4/54a4025b8b9a1aedd031389c0e3141e0.webp",
      "https://cdntj.somon.tj/media/cache1/c4/9e/c49e333c987e211ef044542cdd751b04.webp",
      "https://cdntj.somon.tj/media/cache1/0e/03/0e03b2ab1cc70d3112316af3a6de9b67.webp",
      "https://cdntj.somon.tj/media/cache1/28/a1/28a1d106ac2c83d5244c390b6da336ca.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №278/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Фундамент",
        "title": "Текущая стадия: Фундамент",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/cf/64/cf64b2cd306adcb7a0ddec04cd27a70e.webp",
          "https://cdntj.somon.tj/media/cache1/be/d5/bed587898439d7414dec6d2b8add8680.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.301817994096226,
      "lng": 69.6404081583023,
      "zoom": 14
    },
    "latitude": 40.301817994096226,
    "longitude": 69.6404081583023,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,69 км.",
        "valueTg": "1,69 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "242 м.",
        "valueTg": "242 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "560 м.",
        "valueTg": "560 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,9 км.",
        "valueTg": "1,9 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "2,46 км.",
        "valueTg": "2,46 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "3,3 км.",
        "valueTg": "3,3 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "4,3 км.",
        "valueTg": "4,3 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "350 м.",
        "valueTg": "350 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК.",
        "valueTg": "Внутри ЖК."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "350 м.",
        "valueTg": "350 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "150 м.",
        "valueTg": "150 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_298",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Burji Azim»",
    "nameTg": "МҶ «Бурҷи Азим»",
    "slug": "zhk-burji-azim",
    "shortDescription": "Премиальный 16-этажный комплекс с потрясающим видом на Сырдарью",
    "shortDescriptionTg": "Маҷмааи бонуфузи 16-ошёнаи дараҷаи олӣ бо манзараи дилрабои Сирдарё",
    "description": "ЖК Burji Azim — современный жилой комплекс, строящийся в городе Худжанд на улице Сырдарьинская, удобный ориентир — рядом с рестораном «Яккасарой». Одним из ключевых преимуществ проекта является близость к реке Сырдарья, что создаёт атмосферу уюта, свежего воздуха и живописных видов. Комплекс сочетает выгодную локацию, современную архитектуру и продуманные планировки, подходящие как для комфортной жизни, так и для инвестиций. Главной особенностью проекта станет ресторан на последнем этаже, который подчеркнёт статус комплекса и подарит жителям уникальное пространство для отдыха с панорамным видом.\r\n\r\n⭐ Комфорт и сервис для жителей:\r\n- Просторные квартиры с панорамными окнами\r\n- Современные скоростные и бесшумные лифты\r\n- Круглосуточная система видеонаблюдения\r\n- Безопасные и современные детские площадки\r\n- Консьерж-сервис для удобства жильцов\r\n- Подземная и охраняемая наземная парковка\r\n- 24/7 охрана территории\r\n- Инновационная система «умный дом»\r\n- Зарядные станции для электротранспорта\r\n- Высокоскоростное оптоволоконное интернет-соединение\r\n- Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n- Материал строительства — монолит (прочность и долговечность конструкции)\r\n- Здание состоит из одного блока\r\n- Жилые квартиры расположены с 3 по 16 этаж\r\n- 1–2 этажи предусмотрены под коммерческие помещения\r\n- На 17 этаже разместится ресторан с панорамным видом\r\n\r\n💳 Условия покупки:\r\n- Рассрочка действует до завершения строительства\r\n- Срок рассрочки — от 25 до 30 месяцев\r\n- Первоначальный взнос — 30%\r\n\r\n📍 Локация:\r\nЖК Burji Azim расположен на улице Сырдарьинская — в районе с развитой инфраструктурой, на берегу реки и с удобной транспортной развязкой. В шаговой доступности находятся школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта, что делает проживание здесь максимально комфортным и удобным\r\n\r\nЖК «Burji Azim» — это больше, чем просто жильё. Это современное пространство для жизни, где сочетаются комфорт, безопасность и престиж в одном проекте, расположенном в самом сердце Худжанда.",
    "descriptionTg": "МҶ «Бурҷи Азим» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "premium",
    "finishing": "rough",
    "city": "khujand",
    "district": "Центр, набережная",
    "districtTg": "Марказ, соҳили Сирдарё",
    "address": "г. Худжанд, ул. Сырдарьинская (ориентир — «Яккасарой»)",
    "addressTg": "ш. Хуҷанд, кӯчаи Сирдарё (дар наздикии «Яккасарой»)",
    "landmark": "Рядом с рестораном «Яккасарой»",
    "landmarkTg": "Дар наздикии тарабхонаи «Яккасарой»",
    "floorsCount": 16,
    "sectionsCount": 3,
    "ceilingHeight": "3.20",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2028,
    "landArea": "0.75 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0298:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_298_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_298_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_298_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_298_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_298_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 9400,
    "minPricePerMeterUsd": 858,
    "minTotalPriceTjs": 648600,
    "minTotalPriceUsd": 59233,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/10/b4/10b4620e25ba4f2998a4eae3f4da95ab.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/10/b4/10b4620e25ba4f2998a4eae3f4da95ab.webp",
      "https://cdntj.somon.tj/media/cache1/04/04/0404f97c0035835ebca2c3295a788171.webp",
      "https://cdntj.somon.tj/media/cache1/b7/a1/b7a17fa5876f618b8f75c130b48ad8f9.webp",
      "https://cdntj.somon.tj/media/cache1/2a/6e/2a6e3f1e3aa0f9cea39570e37547701c.webp",
      "https://cdntj.somon.tj/media/cache1/bb/80/bb806e878ca7f586d7184cec18036306.webp",
      "https://cdntj.somon.tj/media/cache1/6c/40/6c4017f22ac05cba25712b7e472eb232.webp",
      "https://cdntj.somon.tj/media/cache1/12/f1/12f10f5a043e65d79ce610cffa305b92.webp",
      "https://cdntj.somon.tj/media/cache1/32/96/3296b3caa4f14a28476a666f63d3feb1.webp",
      "https://cdntj.somon.tj/media/cache1/50/6d/506d551343c5199d6d603b2cf3dffd44.webp",
      "https://cdntj.somon.tj/media/cache1/b3/36/b336aff6c90076e0731bdaeb6fd8f93c.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №298/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Фундамент",
        "title": "Текущая стадия: Фундамент",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/10/b4/10b4620e25ba4f2998a4eae3f4da95ab.webp",
          "https://cdntj.somon.tj/media/cache1/04/04/0404f97c0035835ebca2c3295a788171.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.292480427280715,
      "lng": 69.62111248721247,
      "zoom": 14
    },
    "latitude": 40.292480427280715,
    "longitude": 69.62111248721247,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,9 км.",
        "valueTg": "1,9 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "680 м.",
        "valueTg": "680 м."
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
        "value": "3,9 км.",
        "valueTg": "3,9 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "760 м.",
        "valueTg": "760 м."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "1,6 км.",
        "valueTg": "1,6 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2,3 км.",
        "valueTg": "2,3 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,7 км.",
        "valueTg": "1,7 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК.",
        "valueTg": "Внутри ЖК."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "1,4 км.",
        "valueTg": "1,4 км."
      }
    ]
  },
  {
    "id": "proj_istiqlol_309",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Кайрокум»",
    "nameTg": "МҶ «Қайроққум» (Истиқлол)",
    "slug": "zhk-kajrokum",
    "shortDescription": "Курортный 7-этажный жилой дом в Гулистоне рядом с побережьем",
    "shortDescriptionTg": "Бинои 7-ошёнаи истиқоматӣ дар ш. Гулистон дар наздикии соҳили баҳр",
    "description": "ЖК «Кайрокум» — современный жилой комплекс в городе Гулистон, расположенный на улице Истиклол, напротив парка Матери. Одним из ключевых преимуществ проекта является близость к реке Сырдарья, создающая атмосферу уюта, свежего воздуха и живописных видов. Комплекс сочетает выгодное расположение, современную архитектуру и продуманные планировки, подходящие как для комфортного проживания, так и для инвестиций. Особенностью проекта станет ресторан на последнем этаже с панорамными видами, который придаёт комплексу дополнительный уровень комфорта и статуса.\r\n\r\n⭐ Комфорт и сервис для жителей:\r\n- Просторные квартиры с панорамными окнами\r\n- Современные скоростные и бесшумные лифты\r\n- Круглосуточное видеонаблюдение\r\n- Безопасные и благоустроенные детские площадки\r\n- Охрана территории 24/7\r\n- Высокоскоростной оптоволоконный интернет\r\n- Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n- Строительство ведётся по монолитной технологии (прочность и долговечность)\r\n- Комплекс состоит из 2 блоков\r\n- Квартиры расположены с 1 по 7 этажи\r\n- 1 этаж отведён под коммерческие помещения\r\n- На 7 этаже предусмотрены квартиры с террасами\r\n\r\n💳 Условия покупки:\r\n- Рассрочка до завершения строительства\r\n- Срок — до 18 месяцев\r\n- Первоначальный взнос — от 30%\r\n\r\n📍 Локация:\r\nЖК «Кайрокум» расположен на улице Истиклол — в районе с развитой инфраструктурой, рядом с рекой и удобной транспортной доступностью. В шаговой доступности находятся школы, детские сады, супермаркеты, кафе, медицинские учреждения и остановки общественного транспорта, что делает проживание максимально удобным.\r\n\r\nЖК «Кайрокум» — это современное пространство для жизни, где гармонично сочетаются комфорт, безопасность и престиж в одном проекте в сердце Гулистона.",
    "descriptionTg": "МҶ «Қайроққум» (Истиқлол) аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "guliston",
    "district": "г. Гулистон, ул. Истиклол",
    "districtTg": "ш. Гулистон, кӯчаи Истиқлол",
    "address": "г. Гулистон (Кайраккум), ул. Истиклол",
    "addressTg": "ш. Гулистон (Қайроққум), кӯчаи Истиқлол",
    "landmark": "Напротив парка Матери",
    "landmarkTg": "Рӯ ба рӯи боғи Модар",
    "floorsCount": 7,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2027,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0309:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_309_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_309_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_309_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_309_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_309_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5000,
    "minPricePerMeterUsd": 457,
    "minTotalPriceTjs": 220000,
    "minTotalPriceUsd": 20091,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/b0/4a/b04aaf40f880f8e765e717a8e8587f8a.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/b0/4a/b04aaf40f880f8e765e717a8e8587f8a.webp",
      "https://cdntj.somon.tj/media/cache1/a0/da/a0da69209b1dd473b65782dc25ebe640.webp",
      "https://cdntj.somon.tj/media/cache1/32/74/32747b4ce75deb7f23ecf79245b65189.webp",
      "https://cdntj.somon.tj/media/cache1/ea/ea/eaea8ae31ed9fcae43d8acac78912a30.webp",
      "https://cdntj.somon.tj/media/cache1/6e/4b/6e4b7637eed007fcf67e7fc324d67479.webp",
      "https://cdntj.somon.tj/media/cache1/9f/8c/9f8c713a344c77a6f1ac42543eac0f1e.webp",
      "https://cdntj.somon.tj/media/cache1/6e/71/6e7152866236b3f6b3b54fdbc29d7c28.webp",
      "https://cdntj.somon.tj/media/cache1/68/78/687864b182eab9ceda2ddccd7bed9617.webp",
      "https://cdntj.somon.tj/media/cache1/eb/83/eb83dcdd113868a59b25c138375f3dfa.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №309/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/b0/4a/b04aaf40f880f8e765e717a8e8587f8a.webp",
          "https://cdntj.somon.tj/media/cache1/a0/da/a0da69209b1dd473b65782dc25ebe640.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.265441886337484,
      "lng": 69.79611420661588,
      "zoom": 14
    },
    "latitude": 40.265441886337484,
    "longitude": 69.79611420661588,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "440 м.",
        "valueTg": "440 м."
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
        "value": "700 м.",
        "valueTg": "700 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,4 км.",
        "valueTg": "1,4 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,1 км.",
        "valueTg": "1,1 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК.",
        "valueTg": "Внутри ЖК."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "170 м.",
        "valueTg": "170 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "100 м.",
        "valueTg": "100 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_293",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Group 32 Микрорайон»",
    "nameTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 32»",
    "slug": "zhk-istiqlol-group-32-mkr",
    "shortDescription": "10-этажный дом рядом с парком им. Абумахмуда Худжанди",
    "shortDescriptionTg": "Бинои 10-ошёна дар наздикии боғи ба номи Абумаҳмуди Хуҷандӣ",
    "description": "ЖК Istiqlol Group — современный жилой комплекс, который строится в городе Худжанд, в 32-м микрорайоне. Удобным ориентиром служат Планетарий и парк имени Абумахмуди Худжанди — места, где можно наслаждаться прогулками, природой и спокойной атмосферой. Близость к парку и зелёным зонам создаёт особое ощущение уюта и гармонии для будущих жителей. Современная архитектура и продуманные планировки делают комплекс отличным выбором как для семейной жизни, так и для выгодных инвестиций.\r\n\r\n⭐ Удобства и сервисы для жителей:\r\n - Скоростные и бесшумные лифты\r\n - Круглосуточная охрана и система видеонаблюдения\r\n - Охраняемая парковка для автомобилей\r\n - Современные и безопасные детские площадки\r\n - Высокоскоростной оптоволоконный интернет\r\n - Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n - Строительство по монолитной технологии\r\n - Здание состоит из 1 блока высотой от 1 до 10 этажей\r\n\r\n💳 Условия покупки:\r\n - Рассрочка до окончания строительства\r\n - Срок рассрочки — до 12 месяцев\r\n - Первоначальный взнос — 50%\r\n - Индивидуальные и гибкие условия для покупателей и инвесторов\r\n\r\n📍 Локация:\r\nЖК Istiqlol Group расположен в 32-м микрорайоне Худжанда — районе с развитой инфраструктурой и удобной транспортной доступностью. Рядом находятся школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Istiqlol Group» — это больше, чем просто жильё. Это пространство для комфортной и спокойной жизни, где рядом природа, безопасность и всё необходимое для счастливой жизни в современном городе. 🌿",
    "descriptionTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 32» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "32 мкр",
    "districtTg": "микрорайони 32",
    "address": "г. Худжанд, 32-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 32",
    "landmark": "Парк им. Абумахмуда Худжанди",
    "landmarkTg": "Боғи ба номи Абумаҳмуди Хуҷандӣ",
    "floorsCount": 10,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2027,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0293:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_293_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_293_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_293_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_293_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_293_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5000,
    "minPricePerMeterUsd": 457,
    "minTotalPriceTjs": 265000,
    "minTotalPriceUsd": 24201,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/f9/bc/f9bc5cd79aa49e679bc109d528db105a.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/f9/bc/f9bc5cd79aa49e679bc109d528db105a.webp",
      "https://cdntj.somon.tj/media/cache1/19/40/1940f1dbcd534d1e204d70c338055404.webp",
      "https://cdntj.somon.tj/media/cache1/1a/61/1a61e693ca18915eef3faad535f4c2b8.webp",
      "https://cdntj.somon.tj/media/cache1/ad/22/ad22ae32c76b74a4d4d3a54d8f5a7189.webp",
      "https://cdntj.somon.tj/media/cache1/38/42/3842f369f5f69d34a0539e78688a3e2b.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №293/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Фундамент",
        "title": "Текущая стадия: Фундамент",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/f9/bc/f9bc5cd79aa49e679bc109d528db105a.webp",
          "https://cdntj.somon.tj/media/cache1/19/40/1940f1dbcd534d1e204d70c338055404.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.303584239377564,
      "lng": 69.63529371427458,
      "zoom": 14
    },
    "latitude": 40.303584239377564,
    "longitude": 69.63529371427458,
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
        "value": "320 м.",
        "valueTg": "320 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "660 м.",
        "valueTg": "660 м."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "2,1 км.",
        "valueTg": "2,1 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "2,2 км.",
        "valueTg": "2,2 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,9 км.",
        "valueTg": "2,9 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "4 км.",
        "valueTg": "4 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "390 м.",
        "valueTg": "390 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "490 м.",
        "valueTg": "490 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "390 м.",
        "valueTg": "390 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_292",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Group 18 Микрорайон»",
    "nameTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 18»",
    "slug": "zhk-istiqlol-group-18-mkr",
    "shortDescription": "10-этажный современный комплекс в развитом 18 микрорайоне",
    "shortDescriptionTg": "Маҷмааи муосири 10-ошёна дар микрорайони ободи 18-ум",
    "description": "ЖК Istiqlol Group — современный жилой комплекс, который строится в городе Худжанд, в 18-м микрорайоне. Удобным ориентиром служит Парк Победы , где можно наслаждаться прогулками, природой и спокойной атмосферой. Близость к парку и зелёным зонам создаёт особое ощущение уюта и гармонии для будущих жителей. Современная архитектура и продуманные планировки делают комплекс отличным выбором как для семейной жизни, так и для выгодных инвестиций.\r\n\r\n⭐ Удобства и сервисы для жителей:\r\n - Скоростные и бесшумные лифты\r\n - Круглосуточная охрана и система видеонаблюдения\r\n - Охраняемая парковка для автомобилей\r\n - Современные и безопасные детские площадки\r\n - Высокоскоростной оптоволоконный интернет\r\n - Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n - Строительство по монолитной технологии\r\n - Здание состоит из 1 блока высотой от 1 до 10 этажей\r\n\r\n💳 Условия покупки:\r\n - Рассрочка до окончания строительства\r\n - Срок рассрочки — до 12 месяцев\r\n - Первоначальный взнос — 50%\r\n - Индивидуальные и гибкие условия для покупателей и инвесторов\r\n\r\n📍 Локация:\r\nЖК Istiqlol Group расположен в 32-м микрорайоне Худжанда — районе с развитой инфраструктурой и удобной транспортной доступностью. Рядом находятся школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Istiqlol Group» — это больше, чем просто жильё. Это пространство для комфортной и спокойной жизни, где рядом природа, безопасность и всё необходимое для счастливой жизни в современном городе. 🌿",
    "descriptionTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 18» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "18 мкр",
    "districtTg": "микрорайони 18",
    "address": "г. Худжанд, 18-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 18",
    "landmark": "Ориентир — Парк Победы",
    "landmarkTg": "Дар наздикии Боғи Ғалаба",
    "floorsCount": 10,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 3,
    "deadlineYear": 2027,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0292:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_292_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_292_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_292_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_292_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_292_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 318000,
    "minTotalPriceUsd": 29041,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/32/48/324851a2a37c36381d466bbe27c38091.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/32/48/324851a2a37c36381d466bbe27c38091.webp",
      "https://cdntj.somon.tj/media/cache1/72/58/725822c57da9f865b6cce7cfc1d68a25.webp",
      "https://cdntj.somon.tj/media/cache1/79/8c/798c1dff343c4c449607ac1d9082b97a.webp",
      "https://cdntj.somon.tj/media/cache1/62/ed/62ed577026743c95bdfd90bbeb134828.webp",
      "https://cdntj.somon.tj/media/cache1/41/09/41093995644233fcd4c2beb46ce38700.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №292/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/32/48/324851a2a37c36381d466bbe27c38091.webp",
          "https://cdntj.somon.tj/media/cache1/72/58/725822c57da9f865b6cce7cfc1d68a25.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.29779268251844,
      "lng": 69.60830211639403,
      "zoom": 14
    },
    "latitude": 40.29779268251844,
    "longitude": 69.60830211639403,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "2,2 км.",
        "valueTg": "2,2 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "380 м.",
        "valueTg": "380 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "2,1 км.",
        "valueTg": "2,1 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "4,8 км.",
        "valueTg": "4,8 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "4,8 км.",
        "valueTg": "4,8 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "760 м.",
        "valueTg": "760 м."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "600 м.",
        "valueTg": "600 м."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "100 м.",
        "valueTg": "100 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "360 м.",
        "valueTg": "360 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_291",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Group 12 Микрорайон»",
    "nameTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 12»",
    "slug": "zhk-istiqlol-group-12-mkr",
    "shortDescription": "15-этажный жилой комплекс рядом со школой №23 и мечетью «Такво»",
    "shortDescriptionTg": "Маҷмааи 15-ошёна дар наздикии мактаби №23 ва масҷиди «Тақво»",
    "description": "ЖК Istiqlol Group — современный жилой комплекс в городе Худжанд, расположенный в 12 микрорайоне. Удобный ориентир — напротив школы №23 и рядом с мечетью «Такво». Одним из главных преимуществ комплекса является близость к реке Сырдарья, что создаёт приятную атмосферу, зелёные зоны для прогулок и ощущение уюта. Современная архитектура и продуманные планировки делают комплекс отличным выбором как для комфортной семейной жизни, так и для инвестиций.\r\n\r\n⭐ Удобства и сервисы для жителей:\r\n - Панорамные окна с большим количеством естественного света\r\n - Скоростные и бесшумные лифты\r\n - Круглосуточная охрана и система видеонаблюдения\r\n - Охраняемая парковка\r\n - Современные и безопасные детские площадки\r\n - Высокоскоростной оптоволоконный интернет\r\n - Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n - Строительство по монолитной технологии\r\n - Комплекс состоит из одного блока\r\n - 1–2 этажи предусмотрены под коммерческие помещения\r\n - Жилые квартиры расположены со 2 по 16 этаж\r\n - На 16 этаже предусмотрены пентхаусы с просторной террасой\r\n\r\n💳 Условия покупки:\r\n - Рассрочка до завершения строительства\r\n - Срок рассрочки — до 18 месяцев\r\n - Первоначальный взнос — от 30%\r\n - Индивидуальные и гибкие условия для покупателей и инвесторов\r\n\r\n📍 Расположение:\r\nЖК Istiqlol Group находится в 12 микрорайоне Худжанда — районе с развитой инфраструктурой и удобной транспортной доступностью. В шаговой доступности расположены школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Istiqlol Group» — это современный жилой комплекс, где комфорт, безопасность и удобство городской жизни объединены в одном проекте в городе Худжанд.",
    "descriptionTg": "МҶ «Истиқлол Гурӯҳ — Микрорайони 12» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "12 мкр",
    "districtTg": "микрорайони 12",
    "address": "г. Худжанд, 12-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 12",
    "landmark": "Напротив школы №23 и мечети «Такво»",
    "landmarkTg": "Рӯ ба рӯи мактаби №23 ва масҷиди «Тақво»",
    "floorsCount": 15,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2028,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0291:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_291_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_291_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_291_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_291_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_291_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5800,
    "minPricePerMeterUsd": 530,
    "minTotalPriceTjs": 284200,
    "minTotalPriceUsd": 25954,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/50/0d/500d77c3122f84a6885089f00c9a9b5a.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/50/0d/500d77c3122f84a6885089f00c9a9b5a.webp",
      "https://cdntj.somon.tj/media/cache1/cb/03/cb03eb772e436dfc78102989cf73c49e.webp",
      "https://cdntj.somon.tj/media/cache1/01/3c/013c3f9d8e9c11e31f4c1862ee940a2d.webp",
      "https://cdntj.somon.tj/media/cache1/86/6d/866de17f6d59b88e78d3b5732f8f7e6e.webp",
      "https://cdntj.somon.tj/media/cache1/03/bd/03bd52a4923776f1f406cbc3d072c733.webp",
      "https://cdntj.somon.tj/media/cache1/d4/9b/d49b9a633ab0d398e5e8ace297995690.webp",
      "https://cdntj.somon.tj/media/cache1/e7/fa/e7fa7f29984416f424687cfd50916e27.webp",
      "https://cdntj.somon.tj/media/cache1/98/8e/988e63764b93f0c214f14a391747ea08.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №291/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/50/0d/500d77c3122f84a6885089f00c9a9b5a.webp",
          "https://cdntj.somon.tj/media/cache1/cb/03/cb03eb772e436dfc78102989cf73c49e.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.29153203080078,
      "lng": 69.58680152893065,
      "zoom": 14
    },
    "latitude": 40.29153203080078,
    "longitude": 69.58680152893065,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "330 м.",
        "valueTg": "330 м."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "273 м.",
        "valueTg": "273 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "4 км.",
        "valueTg": "4 км."
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
        "value": "3 км.",
        "valueTg": "3 км."
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
        "value": "1,1 км.",
        "valueTg": "1,1 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,8 км.",
        "valueTg": "1,8 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "Внутри ЖК.",
        "valueTg": "Внутри ЖК."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "240 м.",
        "valueTg": "240 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "700 м.",
        "valueTg": "700 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_287",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Group» (8 мкр, 287)",
    "nameTg": "МҶ «Истиқлол Гурӯҳ» (микрорайони 8, 287)",
    "slug": "zhk-istiqlol-group-8-mkr-287",
    "shortDescription": "9-этажный уютный дом рядом с Турецкой школой",
    "shortDescriptionTg": "Бинои бароҳати 9-ошёна дар наздикии Мактаби туркӣ",
    "description": "ЖК Istiqlol Group — современный жилой комплекс в городе Худжанд, расположенный в 12 микрорайоне рядом с Турецкой школой. Одним из главных преимуществ проекта является близость к реке Сырдарья, что создаёт зелёную зону отдыха, свежий воздух и уютную атмосферу для жизни. Архитектура комплекса выполнена в современном стиле, а продуманные планировки подойдут как для комфортного проживания, так и для инвестиций. Особой изюминкой станет пентхаус с просторной террасой на 10 этаже.\r\n\r\n⭐ Удобства и сервисы для жителей:\r\n - Панорамные окна\r\n - Современные скоростные и бесшумные лифты\r\n - Система видеонаблюдения\r\n - Благоустроенные детские площадки\r\n - Подземная и охраняемая наземная парковка\r\n - Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\n - Строительство из жжёного кирпича на монолитной основе (прочность и надёжность)\r\n - Один блок высотой 10 этажей\r\n - На 10 этаже предусмотрена просторная терраса\r\n\r\n💳 Условия покупки:\r\n - Рассрочка до завершения строительства\r\n - Срок — до 20 месяцев\r\n - Первоначальный взнос — от 30%\r\n - Гибкий и индивидуальный подход к каждому покупателю\r\n\r\n📍 Расположение:\r\nКомплекс находится в 12 микрорайоне, рядом с рекой Сырдарья — в районе с развитой инфраструктурой и удобной транспортной доступностью. В шаговой доступности школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Istiqlol Group» — это современный формат жизни, где сочетаются комфорт, безопасность и престиж в одном проекте.",
    "descriptionTg": "МҶ «Истиқлол Гурӯҳ» (микрорайони 8, 287) аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "8 мкр",
    "districtTg": "микрорайони 8",
    "address": "г. Худжанд, 8-й микрорайон (рядом с Турецкой школой)",
    "addressTg": "ш. Хуҷанд, микрорайони 8 (наздикии Мактаби туркӣ)",
    "landmark": "Рядом с Турецкой школой",
    "landmarkTg": "Дар наздикии Мактаби туркӣ",
    "floorsCount": 9,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2027,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0287:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_287_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_287_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_287_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_287_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_287_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 5200,
    "minPricePerMeterUsd": 475,
    "minTotalPriceTjs": 213200,
    "minTotalPriceUsd": 19470,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/82/0c/820cea720304afaf88b8d64c8359fe0c.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/82/0c/820cea720304afaf88b8d64c8359fe0c.webp",
      "https://cdntj.somon.tj/media/cache1/8d/92/8d92945f7fbe0fb8ed05803796e97752.webp",
      "https://cdntj.somon.tj/media/cache1/19/b4/19b444a0ae9ffcef322b5bc38e5b76f1.webp",
      "https://cdntj.somon.tj/media/cache1/5e/cc/5ecc24ab598fbbc587c5b16c3c361da9.webp",
      "https://cdntj.somon.tj/media/cache1/ca/94/ca94954e7e780a134ac8c5b154e06348.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №287/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Фундамент",
        "title": "Текущая стадия: Фундамент",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/82/0c/820cea720304afaf88b8d64c8359fe0c.webp",
          "https://cdntj.somon.tj/media/cache1/8d/92/8d92945f7fbe0fb8ed05803796e97752.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.288650157841,
      "lng": 69.58499768170806,
      "zoom": 14
    },
    "latitude": 40.288650157841,
    "longitude": 69.58499768170806,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "800 м.",
        "valueTg": "800 м."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "4 км.",
        "valueTg": "4 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,5 км.",
        "valueTg": "1,5 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "3,4 км.",
        "valueTg": "3,4 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "2,5 км.",
        "valueTg": "2,5 км."
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
        "value": "1,9 км.",
        "valueTg": "1,9 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "470 м.",
        "valueTg": "470 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "240 м.",
        "valueTg": "240 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "600 м.",
        "valueTg": "600 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_117",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Avenue 2»",
    "nameTg": "МҶ «Istiqlol Avenue 2»",
    "slug": "zhk-istiqlol-avenue-2",
    "shortDescription": "15-этажный готовый монолитный дом с резервным генератором и скоростными лифтами",
    "shortDescriptionTg": "Бинои монолитии 15-ошёна бо генератори захиравӣ ва лифтҳои босуръат",
    "description": "Современный архитектурный стиль и премиальное качество строительства.\r\n\r\n- Два скоростных лифта в каждом подъезде для вашего удобства.\r\n- Резервный генератор – свет, вода и лифты работают всегда, даже при отключении электричества.\r\n- Закрытая охраняемая территория с детской площадкой – уют и безопасность для всей семьи.\r\n- Коммерческие помещения на первых этажах – всё необходимое в шаговой доступности.\r\n\r\nЕсть рассрочка до 2 лет с предоплатой от 30%.\r\n\r\nНаша компания успешно функционирует 10 лет! Нами сданы много интересных проектов, которые профессионально и в срок уже служат своим счастливым покупателям!\r\n\r\n📞 Звоните прямо сейчас, чтобы забронировать свою идеальную квартиру! Количество ограничено!",
    "descriptionTg": "МҶ «Istiqlol Avenue 2» аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "business",
    "finishing": "rough",
    "city": "khujand",
    "district": "28 мкр",
    "districtTg": "микрорайони 28",
    "address": "г. Худжанд, 28-й микрорайон",
    "addressTg": "ш. Хуҷанд, микрорайони 28",
    "landmark": "28-й микрорайон, проспект Рахимова",
    "landmarkTg": "Микрорайони 28, хиёбони Раҳимов",
    "floorsCount": 15,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 1,
    "deadlineYear": 2026,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0117:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_117_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_117_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_117_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_117_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_117_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 6000,
    "minPricePerMeterUsd": 548,
    "minTotalPriceTjs": 270000,
    "minTotalPriceUsd": 24658,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/12/ab/12ab613d539b5080ab836c356be621a8.png",
    "images": [
      "https://cdntj.somon.tj/media/cache1/12/ab/12ab613d539b5080ab836c356be621a8.png",
      "https://cdntj.somon.tj/media/cache1/49/33/49334236459cd42d00198ba629ac72d3.png",
      "https://cdntj.somon.tj/media/cache1/f4/ca/f4ca8745cf02aade23b3f7aa381cbdae.png",
      "https://cdntj.somon.tj/media/cache1/9c/9c/9c9cf57f90b20b33ed87e64c7d521fd5.png",
      "https://cdntj.somon.tj/media/cache1/76/f6/76f696bb1aa9825c932c0137691cb663.png",
      "https://cdntj.somon.tj/media/cache1/1b/a6/1ba66fa2026544f066f5049e9a85482e.png",
      "https://cdntj.somon.tj/media/cache1/36/c4/36c48f907754a04df943101ecf317e24.png"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №117/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "1-5 этаж готов",
        "title": "Текущая стадия: 1-5 этаж готов",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/12/ab/12ab613d539b5080ab836c356be621a8.png",
          "https://cdntj.somon.tj/media/cache1/49/33/49334236459cd42d00198ba629ac72d3.png"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.30299825195684,
      "lng": 69.60744236083198,
      "zoom": 14
    },
    "latitude": 40.30299825195684,
    "longitude": 69.60744236083198,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,9 км.",
        "valueTg": "1,9 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "400 м.",
        "valueTg": "400 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "3,2 км.",
        "valueTg": "3,2 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "1,5 км.",
        "valueTg": "1,5 км."
      },
      {
        "slug": "pool",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Pool.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Pool.png",
        "name": "Бассейн",
        "nameTg": "Ҳавзи шиноварӣ",
        "value": "1,6 км.",
        "valueTg": "1,6 км."
      },
      {
        "slug": "gym",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Fitness.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Fitness.png",
        "name": "Тренажерный зал / фитнес",
        "nameTg": "Толори варзишӣ (фитнес)",
        "value": "1,5 км.",
        "valueTg": "1,5 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "2 км.",
        "valueTg": "2 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "1,3 км.",
        "valueTg": "1,3 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "470 м.",
        "valueTg": "470 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "710 м.",
        "valueTg": "710 м."
      },
      {
        "slug": "kindergarden",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Kindergarden.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Kindergarden.png",
        "name": "Детский сад",
        "nameTg": "Кӯдакистон",
        "value": "550 м.",
        "valueTg": "550 м."
      }
    ]
  },
  {
    "id": "proj_istiqlol_286",
    "developerId": "dev_istiqlol",
    "name": "ЖК «Istiqlol Group» (8 мкр, 286)",
    "nameTg": "МҶ «Истиқлол Гурӯҳ» (микрорайони 8, 286)",
    "slug": "zhk-istiqlol-group-8-mkr-286",
    "shortDescription": "10-этажный дом в 8 микрорайоне рядом с Президентской школой",
    "shortDescriptionTg": "Бинои 10-ошёна дар микрорайони 8 дар наздикии Мактаби президентӣ",
    "description": "ЖК Istiqlol Group — современный жилой комплекс, строящийся в городе Худжанд в 8 микрорайоне, рядом с Президентской школой. Одним из ключевых преимуществ проекта является близость к реке Сырдарья, что создаёт зелёную, свежую и спокойную атмосферу для комфортной жизни. Удачное расположение, современная архитектура и продуманные планировки делают комплекс привлекательным как для семейного проживания, так и для выгодных инвестиций. Istiqlol Group — идеальный выбор для тех, кто ценит гармонию природы и удобство городской инфраструктуры одновременно.\r\n\r\n⭐Удобства и сервисы для жителей:\r\n- Панорамные окна\r\n- Скоростные и бесшумные лифты\r\n- Система видеонаблюдения\r\n- Современные детские площадки\r\n- Подземная и охраняемая наземная парковка\r\n- Кабельное телевидение\r\n\r\n🏗 Технические характеристики:\r\nДом возводится по монолитной технологии, обеспечивающей прочность и долговечность\r\nКомплекс представлен одним блоком высотой 10 этажей\r\n\r\n💳 Условия покупки:\r\nРассрочка действует до завершения строительства\r\nСрок рассрочки — до 20 месяцев\r\nПервоначальный взнос — от 30%\r\nИндивидуальные и гибкие условия для покупателей и инвесторов\r\n\r\n📍 Расположение:\r\nЖК «Istiqlol Group» находится в 8 микрорайоне, рядом с рекой Сырдарья — в районе с развитой инфраструктурой и удобной транспортной доступностью. В шаговой доступности расположены школы, детские сады, супермаркеты, кафе, медицинские центры и остановки общественного транспорта.\r\n\r\nЖК «Istiqlol Group» — это современный жилой комплекс, где гармонично сочетаются комфорт, безопасность и престиж городской жизни.",
    "descriptionTg": "МҶ «Истиқлол Гурӯҳ» (микрорайони 8, 286) аз ширкати бонуфузи «Истиқлол Гурӯҳ» (Istiqlol Group). Бино бо стандартҳои баланди замонавӣ, сохтори монолитии сейсмотобовар то 9 балл, лифтҳои босуръати бесадо ва ҳавлии ободу муҳофизатшаванда бунёд мегардад. Ҳамаи ҳуҷҷатҳои шаҳрсозӣ ва иҷозатномаи сохтмон расман тасдиқ шудаанд.",
    "status": "under_construction",
    "buildingClass": "comfort",
    "finishing": "rough",
    "city": "khujand",
    "district": "8 мкр",
    "districtTg": "микрорайони 8",
    "address": "г. Худжанд, 8-й микрорайон (рядом с Президентской школой)",
    "addressTg": "ш. Хуҷанд, микрорайони 8 (наздикии Мактаби президентӣ)",
    "landmark": "Рядом с Президентской школой",
    "landmarkTg": "Дар наздикии Мактаби президентӣ",
    "floorsCount": 10,
    "sectionsCount": 2,
    "ceilingHeight": "3.00",
    "constructionType": "Монолитно-каркасный с сейсмостойкостью 9 баллов",
    "deadlineQuarter": 4,
    "deadlineYear": 2027,
    "landArea": "0.45 га",
    "wallMaterial": "Монолит + жженый кирпич и газоблок",
    "facade": "Вентилируемый фасад и декоративная штукатурка",
    "cadastralNumber": "73:01:0286:101",
    "customBuildingFeatures": [
      {
        "id": "cbf_286_1",
        "title": "Сейсмостойкость",
        "value": "9 баллов"
      },
      {
        "id": "cbf_286_2",
        "title": "Лифты",
        "value": "Скоростные бесшумные"
      },
      {
        "id": "cbf_286_3",
        "title": "Паркинг",
        "value": "Подземный"
      }
    ],
    "finishingFeatures": [
      {
        "id": "ff_286_1",
        "title": "Входные двери",
        "description": "Бронированные металлические двери высокого класса взломостойкости."
      },
      {
        "id": "ff_286_2",
        "title": "Остекление",
        "description": "Энергосберегающие металлопластиковые профили с панорамным видом."
      }
    ],
    "minPricePerMeterTjs": 4750,
    "minPricePerMeterUsd": 434,
    "minTotalPriceTjs": 247000,
    "minTotalPriceUsd": 22557,
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
      "Сейсмостойкость до 9 баллов",
      "Бесшумные скоростные лифты",
      "Беспроцентная рассрочка от застройщика",
      "Подземный паркинг и гостевая автостоянка",
      "Охраняемый закрытый двор с видеонаблюдением"
    ],
    "amenitiesTg": [
      "Конструксияи олии монолитӣ",
      "Тобоварии баланди зилзилаи 9 балл",
      "Лифтҳои босуръати бесадо",
      "Пардохти қисм-қисми бефоиз аз ширкат",
      "Таваққуфгоҳи зеризаминӣ ва меҳмонӣ",
      "Ҳавлии пӯшида бо назорати видеоӣ ва посбонӣ"
    ],
    "coverImageUrl": "https://cdntj.somon.tj/media/cache1/71/06/710687381641a22f92f062b3f8070c87.webp",
    "images": [
      "https://cdntj.somon.tj/media/cache1/71/06/710687381641a22f92f062b3f8070c87.webp",
      "https://cdntj.somon.tj/media/cache1/cc/e2/cce29e8c0241c95c3f8e223b429275d0.webp",
      "https://cdntj.somon.tj/media/cache1/f3/47/f347a2571a099d7438a46063257dfa2c.webp",
      "https://cdntj.somon.tj/media/cache1/c7/fa/c7faf1ecf317f56d79c4d3a3cf7762c4.webp",
      "https://cdntj.somon.tj/media/cache1/78/f2/78f243a35246957d48073c64e6dd2519.webp"
    ],
    "documents": [
      {
        "name": "Разрешение на строительство №286/IG",
        "fileUrl": "#"
      },
      {
        "name": "Заключение сейсмостойкости (9 баллов)",
        "fileUrl": "#"
      }
    ],
    "constructionProgress": [
      {
        "date": "Котлован",
        "title": "Текущая стадия: Котлован",
        "photos": [
          "https://cdntj.somon.tj/media/cache1/71/06/710687381641a22f92f062b3f8070c87.webp",
          "https://cdntj.somon.tj/media/cache1/cc/e2/cce29e8c0241c95c3f8e223b429275d0.webp"
        ]
      }
    ],
    "coordinates": {
      "lat": 40.28320575947127,
      "lng": 69.58363786339758,
      "zoom": 14
    },
    "latitude": 40.28320575947127,
    "longitude": 69.58363786339758,
    "locationFeatures": [
      {
        "slug": "mosque",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Mosque.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Mosque.png",
        "name": "Мечеть",
        "nameTg": "Масҷид",
        "value": "1,4 км.",
        "valueTg": "1,4 км."
      },
      {
        "slug": "bus",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Bus.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Bus.png",
        "name": "Общественный транспорт",
        "nameTg": "Нақлиёти ҷамъиятӣ",
        "value": "300 м.",
        "valueTg": "300 м."
      },
      {
        "slug": "center",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Center.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Center.png",
        "name": "Центр города",
        "nameTg": "Маркази шаҳр",
        "value": "5 км.",
        "valueTg": "5 км."
      },
      {
        "slug": "hospital",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Hospital.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Hospital.png",
        "name": "Больница",
        "nameTg": "Беморхона",
        "value": "2,4 км.",
        "valueTg": "2,4 км."
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
        "value": "2,7 км.",
        "valueTg": "2,7 км."
      },
      {
        "slug": "cinema",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Cinema.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Cinema.png",
        "name": "Кинотеатр",
        "nameTg": "Синамо (кинотеатр)",
        "value": "1,7 км.",
        "valueTg": "1,7 км."
      },
      {
        "slug": "park",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Park.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Park.png",
        "name": "Парк",
        "nameTg": "Боғи истироҳатӣ",
        "value": "2,1 км.",
        "valueTg": "2,1 км."
      },
      {
        "slug": "supermarket",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/Store.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/Store.png",
        "name": "Супермаркет",
        "nameTg": "Супермаркет",
        "value": "300 м.",
        "valueTg": "300 м."
      },
      {
        "slug": "school",
        "icon_web": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/web/School.png",
        "icon_mobile": "https://cdntj.somon.tj/media/new_buildings/images/location-features-icons/mobile/School.png",
        "name": "Школа",
        "nameTg": "Мактаб",
        "value": "150 м.",
        "valueTg": "150 м."
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
