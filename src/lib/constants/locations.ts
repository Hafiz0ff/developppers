export interface CityOption {
  value: string;
  nameRu: string;
  nameTj: string;
  nameEn?: string;
  isRegionalCenter?: boolean;
  popularDistricts?: string[];
}

export const SOGD_CITIES: CityOption[] = [
  {
    value: "khujand",
    nameRu: "Худжанд",
    nameTj: "ш. Хуҷанд",
    nameEn: "Khujand",
    isRegionalCenter: true,
    popularDistricts: [
      "18 мкр",
      "19 мкр",
      "20 мкр",
      "28 мкр",
      "32 мкр",
      "34 мкр",
      "Центр / Панчшанбе",
      "Шелкокомбинат",
      "Правый берег (Сохили рост)",
      "Левый берег (Сохили чап)",
      "Пахтакор",
      "Раззок",
    ],
  },
  {
    value: "gafurov",
    nameRu: "Б. Гафуров",
    nameTj: "н. Бобоҷон Ғафуров",
    nameEn: "B. Gafurov",
    popularDistricts: ["пгт. Гафуров", "Хистеварз", "Унчи", "Исфисор", "Овчи-Калача"],
  },
  {
    value: "guliston",
    nameRu: "Гулистон (Кайраккум)",
    nameTj: "ш. Гулистон",
    nameEn: "Guliston (Kayrakkum)",
    popularDistricts: ["Центр", "Побережье «Таджикского моря»", "1 мкр", "Зона отдыха"],
  },
  {
    value: "buston",
    nameRu: "Бустон (Чкаловск)",
    nameTj: "ш. Бӯстон",
    nameEn: "Buston (Chkalovsk)",
    popularDistricts: ["Центр", "Аэропорт", "1 мкр", "2 мкр"],
  },
  {
    value: "isfara",
    nameRu: "Исфара",
    nameTj: "ш. Исфара",
    nameEn: "Isfara",
    popularDistricts: ["Центр", "Навобод", "Ворух", "Чоркух", "Кулканд"],
  },
  {
    value: "istaravshan",
    nameRu: "Истаравшан",
    nameTj: "ш. Истаравшан",
    nameEn: "Istaravshan",
    popularDistricts: ["Центр", "Уротеппа", "Гули Сурх", "Сугдиён", "Калаи Муг"],
  },
  {
    value: "konibodom",
    nameRu: "Канибадам",
    nameTj: "ш. Конибодом",
    nameEn: "Konibodom",
    popularDistricts: ["Центр", "Ортиков", "Патар", "Шарипов"],
  },
  {
    value: "panjakent",
    nameRu: "Пенджикент",
    nameTj: "ш. Панҷакент",
    nameEn: "Panjakent",
    popularDistricts: ["Центр", "Саразм", "Рудаки", "Сужина"],
  },
  {
    value: "spitamen",
    nameRu: "Спитамен (Нав)",
    nameTj: "н. Спитамен",
    nameEn: "Spitamen",
    popularDistricts: ["пгт. Нав", "Куруш", "Тагояк"],
  },
  {
    value: "zafarobod",
    nameRu: "Зафарабад",
    nameTj: "н. Зафаробод",
    nameEn: "Zafarobod",
  },
  {
    value: "rasulov",
    nameRu: "Дж. Расулов (Пролетарск)",
    nameTj: "н. Ҷаббор Расулов",
    nameEn: "J. Rasulov",
  },
  {
    value: "mastchoh",
    nameRu: "Матча (Бустон)",
    nameTj: "н. Мастчоҳ",
    nameEn: "Mastchoh",
  },
  {
    value: "asht",
    nameRu: "Ашт (Шайдон)",
    nameTj: "н. Ашт",
    nameEn: "Asht",
  },
  {
    value: "shahriston",
    nameRu: "Шахристан",
    nameTj: "н. Шаҳристон",
    nameEn: "Shahriston",
  },
  {
    value: "ayni",
    nameRu: "Айни",
    nameTj: "н. Айнӣ",
    nameEn: "Ayni",
  },
  {
    value: "devashtich",
    nameRu: "Деваштич (Гончи)",
    nameTj: "н. Деваштич",
    nameEn: "Devashtich",
  },
  {
    value: "kuhistoni_mastchoh",
    nameRu: "Горная Матча",
    nameTj: "н. Кӯҳистони Мастчоҳ",
    nameEn: "Kuhistoni Mastchoh",
  },
];
