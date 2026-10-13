export interface CityOption {
  value: string;
  nameRu: string;
  nameTj: string;
  isRegionalCenter?: boolean;
  popularDistricts?: string[];
}

export const SOGD_CITIES: CityOption[] = [
  {
    value: "khujand",
    nameRu: "г. Худжанд",
    nameTj: "ш. Хуҷанд",
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
    nameRu: "Б. Гафуров (район)",
    nameTj: "н. Бобоҷон Ғафуров",
    popularDistricts: ["пгт. Гафуров", "Хистеварз", "Унчи", "Исфисор", "Овчи-Калача"],
  },
  {
    value: "guliston",
    nameRu: "г. Гулистон (Кайраккум)",
    nameTj: "ш. Гулистон",
    popularDistricts: ["Центр", "Побережье «Таджикского моря»", "1 мкр", "Зона отдыха"],
  },
  {
    value: "buston",
    nameRu: "г. Бустон (Чкаловск)",
    nameTj: "ш. Бӯстон",
    popularDistricts: ["Центр", "Аэропорт", "1 мкр", "2 мкр"],
  },
  {
    value: "isfara",
    nameRu: "г. Исфара",
    nameTj: "ш. Исфара",
    popularDistricts: ["Центр", "Навобод", "Ворух", "Чоркух", "Кулканд"],
  },
  {
    value: "istaravshan",
    nameRu: "г. Истаравшан",
    nameTj: "ш. Истаравшан",
    popularDistricts: ["Центр", "Уротеппа", "Гули Сурх", "Сугдиён", "Калаи Муг"],
  },
  {
    value: "konibodom",
    nameRu: "г. Канибадам",
    nameTj: "ш. Конибодом",
    popularDistricts: ["Центр", "Ортиков", "Патар", "Шарипов"],
  },
  {
    value: "panjakent",
    nameRu: "г. Пенджикент",
    nameTj: "ш. Панҷакент",
    popularDistricts: ["Центр", "Саразм", "Рудаки", "Сужина"],
  },
  {
    value: "spitamen",
    nameRu: "Спитамен (Нав)",
    nameTj: "н. Спитамен",
    popularDistricts: ["пгт. Нав", "Куруш", "Тагояк"],
  },
  {
    value: "zafarobod",
    nameRu: "Зафарабад",
    nameTj: "н. Зафаробод",
  },
  {
    value: "rasulov",
    nameRu: "Дж. Расулов (Пролетарск)",
    nameTj: "н. Ҷаббор Расулов",
  },
  {
    value: "mastchoh",
    nameRu: "Матча (Бустон)",
    nameTj: "н. Мастчоҳ",
  },
  {
    value: "asht",
    nameRu: "Ашт (Шайдон)",
    nameTj: "н. Ашт",
  },
  {
    value: "shahriston",
    nameRu: "Шахристан",
    nameTj: "н. Шаҳристон",
  },
  {
    value: "ayni",
    nameRu: "Айни",
    nameTj: "н. Айнӣ",
  },
  {
    value: "devashtich",
    nameRu: "Деваштич (Гончи)",
    nameTj: "н. Деваштич",
  },
  {
    value: "kuhistoni_mastchoh",
    nameRu: "Горная Матча",
    nameTj: "н. Кӯҳистони Мастчоҳ",
  },
];
