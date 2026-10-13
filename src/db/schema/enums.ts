import { pgEnum } from "drizzle-orm/pg-core";

// Города и районы Согдийской области
export const sogdCityEnum = pgEnum("sogd_city", [
  "khujand", // Худжанд
  "gafurov", // Бободжон Гафуров
  "guliston", // Гулистон (Кайраккум)
  "buston", // Бустон (Чкаловск)
  "isfara", // Исфара
  "istaravshan", // Истаравшан
  "konibodom", // Канибадам
  "panjakent", // Пенджикент
  "spitamen", // Спитамен (Нав)
  "zafarobod", // Зафарабад
  "rasulov", // Дж. Расулов (Пролетарск)
  "mastchoh", // Матча
  "asht", // Ашт (Шайдон)
  "shahriston", // Шахристан
  "ayni", // Айни
  "devashtich", // Деваштич (Гончи)
  "kuhistoni_mastchoh", // Горная Матча
]);

// Роли пользователей портала
export const userRoleEnum = pgEnum("user_role", [
  "user", // Обычный пользователь/покупатель
  "realtor", // Риелтор / Агентство
  "developer", // Представитель застройщика
  "admin", // Администратор портала
]);

// Валюты (Таджикский сомони и доллар США)
export const currencyEnum = pgEnum("currency", ["TJS", "USD"]);

// Статус строительного проекта (ЖК)
export const projectStatusEnum = pgEnum("project_status", [
  "planned", // Проектирование / старт продаж
  "under_construction", // Строится
  "ready", // Сдан в эксплуатацию
]);

// Класс жилья
export const buildingClassEnum = pgEnum("building_class", [
  "economy", // Эконом
  "comfort", // Комфорт
  "business", // Бизнес
  "premium", // Премиум / Элит
]);

// Тип отделки
export const finishingTypeEnum = pgEnum("finishing_type", [
  "rough", // Черновая (коробка)
  "pre_finishing", // Предчистовая (белый каркас)
  "turnkey", // С готовым ремонтом "под ключ"
]);

// Тип юнита/квартиры в новостройке
export const unitTypeEnum = pgEnum("unit_type", [
  "studio", // Студия
  "apartment", // Квартира
  "penthouse", // Пентхаус
  "commercial", // Коммерческое помещение
  "parking", // Парковочное место
]);

// Статус юнита
export const unitStatusEnum = pgEnum("unit_status", [
  "available", // В продаже
  "reserved", // Забронировано
  "sold", // Продано
]);

// Тип сделки для частных объявлений
export const dealTypeEnum = pgEnum("deal_type", [
  "sale", // Продажа
  "rent_long", // Долгосрочная аренда
  "rent_daily", // Посуточная аренда
]);

// Тип недвижимости для вторички / частных объявлений
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment", // Квартира
  "house", // Дом / Ҳавлӣ
  "commercial", // Коммерческая недвижимость
  "land", // Земельный участок / Замин
  "garage", // Гараж / Паркинг
]);

// Статус частного объявления
export const classifiedStatusEnum = pgEnum("classified_status", [
  "active", // Активно
  "pending", // На проверке модератора
  "rejected", // Отклонено
  "archived", // В архиве / снято владельцем
  "sold", // Продано / Сдано
]);
