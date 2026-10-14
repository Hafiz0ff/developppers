export type Language = "ru" | "tg";

export interface Translations {
  // Common UI labels
  common: {
    save: string;
    cancel: string;
    back: string;
    details: string;
    book: string;
    share: string;
    call: string;
    write: string;
    search: string;
    all: string;
    loading: string;
    from: string;
    to: string;
    sqm: string;
    rooms: string;
    floor: string;
    phone: string;
    price: string;
    pricePerSqm: string;
    viewsCount: string;
    favoritesCount: string;
    addToFavorites: string;
    inFavorites: string;
    copied: string;
    copyLink: string;
  };
  // Navigation & Header
  nav: {
    home: string;
    newBuildings: string;
    resale: string;
    houses: string;
    commercial: string;
    developers: string;
    postAd: string;
    favorites: string;
    login: string;
    logout: string;
    profile: string;
    crm: string;
    analytics: string;
    settings: string;
    myAds: string;
    devCabinet: string;
    adminPanel: string;
    selectLanguage: string;
    selectCurrency: string;
  };
  // Marquee banner
  marquee: {
    portalTitle: string;
    directDev: string;
    chessboards: string;
    resaleHomes: string;
    dualCurrency: string;
    b2bCrm: string;
  };
  // Catalog & Filters
  catalog: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    city: string;
    propertyType: string;
    roomsCount: string;
    priceRange: string;
    installment: string;
    allCities: string;
    allTypes: string;
    allRooms: string;
    foundProjects: string;
    noResults: string;
    resetFilters: string;
    studio: string;
    rooms1: string;
    rooms2: string;
    rooms3: string;
    rooms4Plus: string;
  };
  // Real estate concepts
  realty: {
    complex: string;
    building: string;
    developer: string;
    deliveryDate: string;
    deliveryQuarter: string;
    installmentPlan: string;
    downPayment: string;
    parkingUnderground: string;
    evCharging: string;
    courtyardNoCars: string;
    ceilingHeight: string;
    finishing: string;
    finishingBare: string;
    finishingWhiteBox: string;
    finishingTurnkey: string;
    availableUnits: string;
    floorsTotal: string;
  };
  // Interactive 6D Showcase
  showcase: {
    modePhoto: string;
    modeMasterPlan: string;
    modeSectionPlan: string;
    modeCutaway: string;
    modeWindowView: string;
    modeFloorPlan: string;
    north: string;
    east: string;
    south: string;
    west: string;
    sunMorning: string;
    sunNoon: string;
    sunEvening: string;
    sunlightExposure: string;
    viewFromWindow: string;
    sectionCutaway: string;
    interactiveChessboard: string;
    statusAvailable: string;
    statusBooked: string;
    statusSold: string;
    bookApartment: string;
    unitNumber: string;
    unitArea: string;
    unitRooms: string;
    unitFloor: string;
    unitSection: string;
    windowOrientation: string;
    amenities: string;
    infrastructure: string;
    distanceToCoast: string;
  };
  // Developer Admin
  developer: {
    title: string;
    manageProjects: string;
    chessboardGrid: string;
    statusChange: string;
    saveChanges: string;
    previewShowcase: string;
    statsViews: string;
    statsFavorites: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    common: {
      save: "Сохранить",
      cancel: "Отмена",
      back: "Назад",
      details: "Подробнее",
      book: "Забронировать",
      share: "Поделиться",
      call: "Позвонить",
      write: "Написать",
      search: "Поиск",
      all: "Все",
      loading: "Загрузка...",
      from: "от",
      to: "до",
      sqm: "м²",
      rooms: "комн.",
      floor: "этаж",
      phone: "Телефон",
      price: "Цена",
      pricePerSqm: "за м²",
      viewsCount: "просмотров",
      favoritesCount: "в избранном",
      addToFavorites: "В избранное",
      inFavorites: "В избранном",
      copied: "Ссылка скопирована",
      copyLink: "Скопировать ссылку",
    },
    nav: {
      home: "Главная",
      newBuildings: "Новостройки",
      resale: "Вторичка",
      houses: "Дома",
      commercial: "Коммерция",
      developers: "Застройщики",
      postAd: "Подать объявление",
      favorites: "Избранное",
      login: "Войти",
      logout: "Выйти",
      profile: "Профиль",
      crm: "Канбан CRM & Подборки",
      analytics: "Аналитика & Open API",
      settings: "Настройки & Telegram",
      myAds: "Мои объявления",
      devCabinet: "Кабинет застройщика",
      adminPanel: "Панель администратора",
      selectLanguage: "Выберите язык",
      selectCurrency: "Выберите валюту",
    },
    marquee: {
      portalTitle: "MASKANI.TJ — ЕДИНЫЙ ЖИЛИЩНЫЙ ПОРТАЛ ТАДЖИКИСТАНА",
      directDev: "НОВОСТРОЙКИ НАПРЯМУЮ ОТ ЗАСТРОЙЩИКОВ БЕЗ КОМИССИИ",
      chessboards: "ИНТЕРАКТИВНЫЕ ПОЭТАЖНЫЕ ШАХМАТКИ",
      resaleHomes: "ВТОРИЧНОЕ ЖИЛЬЁ И ТРАДИЦИОННЫЕ ДОМА",
      dualCurrency: "ДВУХВАЛЮТНЫЙ ПЕРЕРАСЧЁТ TJS / USD",
      b2bCrm: "B2B CRM И МГНОВЕННЫЕ TELEGRAM-УВЕДОМЛЕНИЯ ДЛЯ МАКЛЕРОВ",
    },
    catalog: {
      title: "Новостройки и жилые комплексы Согдийской области",
      subtitle: "Прямые цены от проверенных застройщиков без переплат и скрытых комиссий",
      searchPlaceholder: "Поиск по названию ЖК, застройщику или улице...",
      city: "Город",
      propertyType: "Тип недвижимости",
      roomsCount: "Количество комнат",
      priceRange: "Стоимость",
      installment: "Рассрочка",
      allCities: "Все города Согда",
      allTypes: "Все типы жилья",
      allRooms: "Любая комнатность",
      foundProjects: "Найдено жилых комплексов",
      noResults: "По вашему запросу ничего не найдено",
      resetFilters: "Сбросить фильтры",
      studio: "Студия",
      rooms1: "1-комнатная",
      rooms2: "2-комнатная",
      rooms3: "3-комнатная",
      rooms4Plus: "4+ комнат",
    },
    realty: {
      complex: "Жилой комплекс",
      building: "Здание",
      developer: "Застройщик",
      deliveryDate: "Срок сдачи",
      deliveryQuarter: "квартал",
      installmentPlan: "Беспроцентная рассрочка",
      downPayment: "Первоначальный взнос",
      parkingUnderground: "Подземный 2-уровневый паркинг",
      evCharging: "Станция зарядки электромобилей",
      courtyardNoCars: "Закрытый двор без машин",
      ceilingHeight: "Высота потолков",
      finishing: "Отделка",
      finishingBare: "Черновая отделка (коробка)",
      finishingWhiteBox: "Предчистовая отделка (White box)",
      finishingTurnkey: "Чистовой ремонт под ключ",
      availableUnits: "Свободно квартир",
      floorsTotal: "Этажность",
    },
    showcase: {
      modePhoto: "Фотографии",
      modeMasterPlan: "Общий вид территории",
      modeSectionPlan: "План секции",
      modeCutaway: "Вид в срезе",
      modeWindowView: "Вид из окон",
      modeFloorPlan: "Планировка",
      north: "С (Север)",
      east: "В (Восток)",
      south: "Ю (Юг)",
      west: "З (Запад)",
      sunMorning: "Утро (Восход)",
      sunNoon: "Полдень (Максимум)",
      sunEvening: "Вечер (Закат)",
      sunlightExposure: "Естественное освещение и стороны света",
      viewFromWindow: "Панорамный обзор из окон",
      sectionCutaway: "Архитектурный разрез этажей",
      interactiveChessboard: "Интерактивная шахматка квартир",
      statusAvailable: "В продаже",
      statusBooked: "Забронировано",
      statusSold: "Продано",
      bookApartment: "Забронировать квартиру",
      unitNumber: "Квартира №",
      unitArea: "Площадь",
      unitRooms: "Комнатность",
      unitFloor: "Этаж",
      unitSection: "Секция (Подъезд)",
      windowOrientation: "Окна выходят на",
      amenities: "Инфраструктура и удобства",
      infrastructure: "Окружение и объекты поблизости",
      distanceToCoast: "До побережья Таджикского Моря",
    },
    developer: {
      title: "Кабинет застройщика",
      manageProjects: "Управление объектами",
      chessboardGrid: "Шахматка секций и квартир",
      statusChange: "Изменение статуса бронирования",
      saveChanges: "Сохранить изменения",
      previewShowcase: "Предпросмотр витрины",
      statsViews: "Уникальные просмотры",
      statsFavorites: "Добавлений в избранное",
    },
  },
  tg: {
    common: {
      save: "Сабт кардан",
      cancel: "Бекор кардан",
      back: "Бозгашт",
      details: "Муфассал",
      book: "Брон кардан",
      share: "Мубодила кардан",
      call: "Занг задан",
      write: "Навиштан",
      search: "Ҷустуҷӯ",
      all: "Ҳама",
      loading: "Боргирӣ меравад...",
      from: "аз",
      to: "то",
      sqm: "м²",
      rooms: "ҳуҷр.",
      floor: "ошёна",
      phone: "Телефон",
      price: "Нарх",
      pricePerSqm: "барои 1 м²",
      viewsCount: "боздид",
      favoritesCount: "дар баргузидаҳо",
      addToFavorites: "Ба баргузидаҳо",
      inFavorites: "Дар баргузидаҳо",
      copied: "Истинод нусхабардорӣ шуд",
      copyLink: "Нусхабардории истинод",
    },
    nav: {
      home: "Саҳифаи асосӣ",
      newBuildings: "Биноҳои навсохт",
      resale: "Хонаҳои пешина",
      houses: "Ҳавлиҳо",
      commercial: "Биноҳои тиҷоратӣ",
      developers: "Ширкатҳои сохтмонӣ",
      postAd: "Эълон гузоштан",
      favorites: "Баргузидаҳо",
      login: "Воридшавӣ",
      logout: "Баромад",
      profile: "Профил",
      crm: "Канбан CRM ва интихобҳо",
      analytics: "Таҳлил ва Open API",
      settings: "Танзимот ва Telegram",
      myAds: "Эълонҳои ман",
      devCabinet: "Ҳуҷраи застройшик",
      adminPanel: "Панели мудир",
      selectLanguage: "Забонро интихоб кунед",
      selectCurrency: "Асъорро интихоб кунед",
    },
    marquee: {
      portalTitle: "MASKANI.TJ — ПОРТАЛИ ЯГОНАИ АМВОЛИ ҒАЙРИМАНҚУЛИ ТОҶИКИСТОН",
      directDev: "БИНОҲОИ НАВСОХТ МУСТАҚИМ АЗ ШИРКАТҲО БЕ ВОСИТАЧӢ",
      chessboards: "ҶАДВАЛИ ШОҲМОТИИ ОШЁНАҲО БАРОИ ИНТИХОБИ ОСОН",
      resaleHomes: "АМВОЛИ ТАКРОРӢ ВА ҲАВЛИҲОИ АНЪАНАВӢ",
      dualCurrency: "ҲИСОБИ ҲАМЗАМОНИ НАРХҲО БО СОМОНӢ ВА ДОЛЛАР (TJS / USD)",
      b2bCrm: "СИСТЕМАИ CRM ВА ОГОҲИҲОИ ФАВРИИ TELEGRAM БАРОИ МАКЛЕРҲО",
    },
    catalog: {
      title: "Маҷмааҳои истиқоматӣ ва биноҳои навсохти вилояти Суғд",
      subtitle: "Нархҳои мустақим аз ширкатҳои боэътимод бе пардохтҳои пинҳонӣ ва комиссия",
      searchPlaceholder: "Ҷустуҷӯ аз рӯи номи маҷмаа, ширкат ё кӯча...",
      city: "Шаҳр",
      propertyType: "Намуди амвол",
      roomsCount: "Шумораи ҳуҷраҳо",
      priceRange: "Арзиш",
      installment: "Пардохти қисм-қисм",
      allCities: "Ҳамаи шаҳрҳои Суғд",
      allTypes: "Ҳамаи намудҳо",
      allRooms: "Ҳамаи ҳуҷраҳо",
      foundProjects: "Маҷмааҳои истиқоматии ёфтшуда",
      noResults: "Мувофиқи дархости шумо чизе ёфт нашуд",
      resetFilters: "Тоза кардани филтрҳо",
      studio: "Студия",
      rooms1: "1-ҳуҷрагӣ",
      rooms2: "2-ҳуҷрагӣ",
      rooms3: "3-ҳуҷрагӣ",
      rooms4Plus: "4+ ҳуҷрагӣ",
    },
    realty: {
      complex: "Маҷмааи истиқоматӣ",
      building: "Бино",
      developer: "Ширкати сохтмонӣ",
      deliveryDate: "Муҳлати супоридан",
      deliveryQuarter: "семоҳаи",
      installmentPlan: "Пардохти қисм-қисми бефоиз",
      downPayment: "Пешпардохт",
      parkingUnderground: "Таваққуфгоҳи зеризаминии 2-ошёна",
      evCharging: "Нуқтаи пуркунии электромобилҳо",
      courtyardNoCars: "Ҳавлии пӯшида бидуни мошин",
      ceilingHeight: "Баландии шифт",
      finishing: "Пардоз (таъмир)",
      finishingBare: "Пардози аввалия (қуттӣ)",
      finishingWhiteBox: "Пардози пешакӣ (қуттии сафед)",
      finishingTurnkey: "Таъмири пурра («калид дар даст»)",
      availableUnits: "Хонаҳои озод барои фурӯш",
      floorsTotal: "Шумораи ошёнаҳо",
    },
    showcase: {
      modePhoto: "Аксҳо",
      modeMasterPlan: "Намуди умумии ҳудуд",
      modeSectionPlan: "Нақшаи бахш",
      modeCutaway: "Буриши бино",
      modeWindowView: "Манзара аз тирезаҳо",
      modeFloorPlan: "Тарҳи хонаҳо",
      north: "Ш (Шимол)",
      east: "Шқ (Шарқ)",
      south: "Ҷ (Ҷануб)",
      west: "Ғ (Ғарб)",
      sunMorning: "Субҳ (Саҳаргоҳ)",
      sunNoon: "Нисфирӯзӣ (Авҷи офтоб)",
      sunEvening: "Бегоҳӣ (Ғуруби офтоб)",
      sunlightExposure: "Равшании табиӣ ва самтҳои олам",
      viewFromWindow: "Манзараи панорамӣ аз тирезаҳо",
      sectionCutaway: "Буриши меъмории ошёнаҳо",
      interactiveChessboard: "Ҷадвали шоҳмотии хонаҳо",
      statusAvailable: "Барои фурӯш",
      statusBooked: "Брон шудааст",
      statusSold: "Фурӯхта шудааст",
      bookApartment: "Брон кардани хонадон",
      unitNumber: "Хонадони №",
      unitArea: "Масоҳат",
      unitRooms: "Шумораи ҳуҷраҳо",
      unitFloor: "Ошёна",
      unitSection: "Бахш (Даромадгоҳ)",
      windowOrientation: "Тирезаҳо нигаронида шудаанд ба",
      amenities: "Имкониятҳо ва инфрасохтор",
      infrastructure: "Муҳити атроф ва иншооти наздик",
      distanceToCoast: "То соҳили Баҳри Тоҷик",
    },
    developer: {
      title: "Ҳуҷраи кории ширкати сохтмонӣ",
      manageProjects: "Идоракунии лоиҳаҳо",
      chessboardGrid: "Ҷадвали шоҳмотии бахшҳо ва хонаҳо",
      statusChange: "Тағйири ҳолати брони хонаҳо",
      saveChanges: "Сабти тағйирот",
      previewShowcase: "Пешнамоиши витрина",
      statsViews: "Шумораи боздидҳои беназир",
      statsFavorites: "Иловашуда ба баргузидаҳо",
    },
  },
};
