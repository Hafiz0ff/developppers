<div align="center">

<img src="https://raw.githubusercontent.com/Hafiz0ff/developppers/main/public/logo.svg" alt="Maskani Logo" width="88" height="88">

# 🏙️ Maskani (Маскани)
### Инновационная цифровая экосистема недвижимости Таджикистана
**Платформаи муосири амволи ғайриманқули Тоҷикистон**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-maskani.tj-0D9488?style=for-the-badge)](https://sogd-realty.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-88%2F88%20passing-success?style=for-the-badge&logo=vitest)](https://github.com/Hafiz0ff/developppers)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://sogd-realty.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

*«Maskani» (аз калимаи тоҷикии **«Маскан»** — манзил, кошона, ошёни гарм) — национальная платформа недвижимости Таджикистана (Худжанд, Душанбе, Гулистон, Б. Гафуров, Истаравшан).*  
*Объединяет 6D-витрину новостроек с интерактивной шахматкой, каталог проверенной вторички и традиционных домов (ҳавлӣ), кабинет девелопера и B2B CRM для маклеров с пушами в Telegram.*

[🌐 Открыть демо-версию](https://sogd-realty.vercel.app) · [📑 Документация](#-архитектура-и-модули) · [🚀 Быстрый старт](#-быстрый-старт) · [📱 PWA](#-pwa-progressive-web-app)

</div>

---

## 📸 Галерея платформы

<div align="center">

### 1. Главная панорамная витрина Худжанда (Hero с «живым» WebGL-шейдером)
![Maskani Hero Preview](docs/screenshots/maskani-hero.png)
*Умный поиск, фильтрация по районам и комнатам, динамический расчет цен в сомони (TJS) и долларах (USD) по курсу НБТ, мгновенное переключение языка Русский ⇄ Тоҷикӣ.*

<br>

### 2. Единая архитектура экосистемы Maskani
![Maskani Ecosystem](docs/screenshots/maskani-ecosystem.jpg)
*Сквозная связка: застройщики ➔ модерация и шахматка ➔ открытая витрина первичного и вторичного жилья ➔ B2B-маклеры и покупатели.*

<br>

### 3. Кабинет девелопера и Доска объявлений
![Maskani Dashboard Concept](docs/screenshots/maskani-dashboard.jpg)
*Управление корпусами, этажами, инсоляцией, загрузка планов квартир и публикация объявлений частного сектора.*

<br>

### 4. Реальный флагманский кейс: Курортный комплекс «Qayroqum Avenue»
![Qayroqum Avenue Showcase](docs/screenshots/qayroqum-showcase.jpg)
*Премиальный жилой комплекс на берегу Таджикского Моря: шахматка квартир, солнцеход 09:00–18:00, POI-инфраструктура, паркинг, кладовые и документы.*

</div>

---

## 💎 Ключевые возможности и завершенные модули

Платформа **Maskani** разделена на 7 полностью реализованных модулей:

| Модуль | Статус | Основные возможности |
|---|:---:|---|
| **1. Главная витрина и Каталог (`/`)** | 🟢 **100%** | Умный поиск, фильтры комнат (1-5+), билингвальность (RU/TG), мультивалютность (TJS/USD по курсу 10.95), 3 WebGL-шейдера (`aurora`, `gradient-mesh`, `light-leak`). |
| **2. 6D Apple-витрина новостроек (`/projects/[slug]`)** | 🟢 **100%** | Интерактивная шахматка (2 режима), солнцеход инсоляции (09:00–18:00), карта инфраструктуры POI (школы, больницы, мечети), 3D-паркинг, келлеры, документы с водяными знаками. |
| **3. Доска объявлений вторички и Ҳавлӣ (`/classifieds`)** | 🟢 **100%** | **15 реальных объектов с Somon.tj** (8 квартир в 8, 12, 13, 18 мкр, Шелкокомбинат, Бофанда + 7 традиционных домов в Панджшанбе, Оби Тоза, Б. Гафуров, Куйбышев). Защита формы: SMS/OTP, лимит 3 объяв./24ч. |
| **4. Кабинет девелопера (`/developer-admin`)** | 🟢 **100%** | Управление жилыми комплексами, секциями, этажами, шахматкой, загрузка планов, настройка инсоляции и POI, аналитика просмотров. |
| **5. Реестр застройщиков (`/developers`, `/[slug]`)** | 🟢 **100%** | Профили строительных компаний Согдийской области (Спитамен Билдинг, Согд Сити Строй, Долина Согда, Баракат Инвест, Ориён Строй) с лицензиями, портфолио и прямыми контактами. |
| **6. B2B CRM и Аналитика маклера (`/profile/*`)** | 🟢 **100%** | Канбан-воронка лидов (Новый ➔ Квалификация ➔ Показ ➔ Бронь ➔ Сделка), авторасчет комиссии 2%, персональные WhatsApp-витрины `/p/[share_code]`, экспорт PDF, Telegram Push-уведомления. |
| **7. База данных Drizzle ORM (`src/db`)** | 🟢 **100%** | 14 реляционных таблиц PostgreSQL, автоматический сидирование реальными данными, **88 автоматизированных модульных тестов** (100% pass). |

---

## 🏛️ Архитектура системы

```mermaid
flowchart TD
    User([👤 Покупатель / Инвестор]) --> WebApp[📱 Maskani Web & PWA]
    Realtor([💼 Маклер / Агентство]) --> CRM[📊 B2B CRM /profile/crm]
    Developer([🏗️ Девелопер]) --> DevAdmin[⚙️ Кабинет /developer-admin]

    subgraph ClientLayer [Клиентский слой Next.js 16.4]
        WebApp --> Hero[Главная витрина + WebGL Shaders]
        WebApp --> Showcase6D[6D Apple-витрина ЖК /projects/slug]
        WebApp --> Secondary[Вторичка и Ҳавлӣ 15 реальных объектов]
        CRM --> Kanban[Канбан-пайплайн + Расчет комиссии 2%]
        CRM --> ShareP[WhatsApp-витрины /p/share_code]
        DevAdmin --> ChessboardEditor[Редактор шахматки и очередей]
    end

    subgraph StateAndContext [Локализация и Контексты]
        LangCtx[LanguageContext: RU ⇄ TG]
        CurrCtx[CurrencyContext: TJS ⇄ USD курс 10.95]
        LangCtx --> ClientLayer
        CurrCtx --> ClientLayer
    end

    subgraph BackendLayer [Серверные хендлеры и REST API]
        LeadsAPI[/api/crm/leads]
        CollectionsAPI[/api/crm/collections]
        TelegramAPI[/api/profile/telegram]
        OpenAPI[/api/v1/external/analytics]
    end

    ClientLayer --> BackendLayer

    subgraph DatabaseLayer [Хранилище данных Drizzle ORM]
        DB[(PostgreSQL / Supabase)]
        Tables[14 таблиц: users, projects, units, parking, storage, docs, classifieds, crm_leads...]
        DB --- Tables
    end

    BackendLayer --> DB

    subgraph Integrations [Внешние сервисы]
        TG[🤖 Telegram Bot API мгновенные Push-уведомления]
        SomonCDN[🖼️ Somon.tj CDN медиасервер]
        VercelEdge[⚡ Vercel Edge Network]
    end

    BackendLayer --> TG
    Secondary --> SomonCDN
```

---

## 🛠️ Технологический стек

```
Frontend                     Backend & ORM                Инфраструктура & QA
────────────────────────     ────────────────────────     ────────────────────────
Next.js 16.4 (App Router)     Drizzle ORM 0.45             Vercel (Production Edge)
React 19.3                   PostgreSQL (Supabase/Neon)   PWA (Service Worker + Manifest)
TypeScript 5.x               Better Auth 1.7              Telegram Bot API
Tailwind CSS v4              Zod Validation               Node.js 20+ Test Runner
Lucide Icons                 Custom WebGL Shaders         88 Automated Unit Tests
```

---

## 🌐 Билингвальность и мультивалютность

### 1. Языковая система (RU ⇄ TG)
Платформа изначально разработана с поддержкой двух государственных языков:
- **Русский язык (RU)**: профессиональная терминология рынка недвижимости СНГ.
- **Тоҷикӣ (TG)**: строгий литературный таджикский язык (*тоҷикии адабӣ*), полностью очищенный от калек и русизмов (например: *«Ҳавлӣ»* вместо «дом», *«Ошёна»* вместо «этаж», *«Нарх барои 1 м²»*, *«Таҳхона»*, *«Таваққуфгоҳ»*).

### 2. Мультивалютная система (TJS ⇄ USD)
- Динамический пересчет стоимости всех объектов, цен за квадратный метр и комиссий маклера.
- Базовая конверсия по курсу Национального Банка Таджикистана (**1 USD = 10.95 TJS**).
- Пользовательское состояние мгновенно сохраняется в `localStorage` и синхронизируется между всеми карточками и калькуляторами.

---

## 📱 PWA (Progressive Web App)

Платформа **Maskani** полностью оптимизирована для мобильных устройств:
- **Оффлайн-работа**: Service Worker (`public/sw.js`) кэширует оболочку приложения и медиа-ресурсы.
- **Установка в 1 клик**: Кастомный модальный баннер с инструкцией для Safari (iOS) и нативным `beforeinstallprompt` для Google Chrome (Android/Windows).
- **Полноэкранный режим**: Запуск без браузерного интерфейса (`display: standalone`) с фирменной бирюзовой темой (`#0D9488`).

---

## 🚀 Быстрый старт

### Требования
- **Node.js** ≥ 20.x
- **pnpm** ≥ 10.x (`npm install -g pnpm`)
- **PostgreSQL** (локальный или облачный Supabase / Neon)

### 1. Клонирование репозитория
```bash
git clone https://github.com/Hafiz0ff/developppers.git maskani
cd maskani
```

### 2. Установка зависимостей
```bash
pnpm install
```

### 3. Настройка переменных окружения
Создайте файл `.env.local`:
```bash
cp .env.example .env.local
```

Заполните ключевые переменные:
```env
# Подключение к PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/maskani"

# Аутентификация Better Auth
BETTER_AUTH_SECRET="your_secure_random_key_min_32_characters"
BETTER_AUTH_URL="http://localhost:3000"

# Публичный URL приложения
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_USD_TO_TJS_RATE="10.95"

# Telegram Bot (мгновенные уведомления о заявках)
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_BOT_USERNAME="MaskaniBot"
TELEGRAM_CHAT_ID="your_telegram_chat_id"
```

### 4. Инициализация базы данных и сидирование
```bash
pnpm db:push      # Синхронизация 14 таблиц Drizzle с PostgreSQL
pnpm db:seed      # Заполнение реальными объектами Согда (новостройки, вторичка, дома)
```

### 5. Запуск тестов
```bash
pnpm test         # Запуск 88 модульных тестов
```

### 6. Запуск сервера разработки
```bash
pnpm dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 📁 Структура проекта

```
maskani/
├── docs/
│   └── screenshots/            # Актуальные скриншоты платформы для GitHub
├── public/
│   ├── icons/                  # PWA иконки (192x192, 512x512, apple-touch-icon)
│   ├── manifest.json           # Web App Manifest для мобильных устройств
│   └── sw.js                   # Service Worker для кэширования и оффлайн-режима
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── page.tsx            # Главная витрина: Hero с WebGL, Поиск, Топ новостроек
│   │   ├── layout.tsx          # Root Layout (Шапка, PWA-баннер, провайдеры)
│   │   ├── projects/[slug]/    # 6D Apple-витрина ЖК (Шахматка, Солнцеход, POI, Паркинг)
│   │   ├── classifieds/        # Каталог вторичного жилья и традиционных домов (ҳавлӣ)
│   │   ├── developers/         # Реестр и витрины строительных компаний
│   │   ├── developer-admin/    # Кабинет застройщика (CRUD ЖК, шахматки, инсоляция)
│   │   ├── profile/            # Кабинет маклера / риелтора
│   │   │   ├── crm/            # Канбан-воронка лидов и калькулятор комиссии 2%
│   │   │   ├── analytics/      # Графики CTR, показов, конверсий и Open API
│   │   │   └── settings/       # Настройки профиля и привязка Telegram Bot
│   │   ├── p/[share_code]/     # Персональные витрины для отправки клиентам в WhatsApp
│   │   └── api/                # REST API эндпоинты
│   ├── components/             # React компоненты
│   │   ├── layout/             # Шапка, Навигация, Футер, Переключатели языка и валют
│   │   ├── modules/            # Шахматка, Солнцеход, POI, Паркинг, Документы, PWA
│   │   └── ui/                 # UI-кит на Tailwind v4 + WebGL Shader Background
│   ├── context/                # Языковой (RU/TG) и валютный (TJS/USD) контексты
│   ├── db/
│   │   ├── schema/             # Drizzle ORM схемы 14 таблиц
│   │   ├── index.ts            # Клиент подключения к PostgreSQL
│   │   └── seed.ts             # Сид реальными данными Согдийской области
│   └── lib/
│       ├── catalog-data.ts     # 15 реальных объектов вторички с Somon.tj и новостройки
│       ├── telegram.ts         # Telegram Bot API клиент для Push-уведомлений
│       ├── localization.ts     # Словари чистого таджикского и русского языков
│       └── utils.ts            # Утилиты форматирования валют и площадей
├── TASKS.md                    # Актуальный Roadmap и чеклист задач
├── RULES.md                    # Архитектурные стандарты разработки
└── package.json
```

---

## 🔌 Доступные REST API эндпоинты

| Метод | Эндпоинт | Описание |
|---|---|---|
| `GET, POST` | `/api/crm/leads` | Получение и создание лидов маклера с авто-пушем в Telegram |
| `PATCH, DELETE` | `/api/crm/leads` | Смена статуса в Канбане (`new` ➔ `won`), обновление или удаление |
| `GET, POST` | `/api/crm/collections` | Создание закрытых персонализированных WhatsApp-подборок |
| `GET` | `/api/crm/collections/[shareCode]` | Публичные данные подборки для клиента без контактов продавца |
| `GET, POST` | `/api/profile/telegram` | Проверка статуса Telegram-бота и отправка тестового уведомления |
| `GET` | `/api/v1/external/analytics` | Экспорт аналитических данных во внешние CRM (Битрикс24, amoCRM) |
| `POST` | `/api/v1/external/feed/import` | Пакетный импорт объектов из XML/JSON фидов девелоперов |

---

## 🗺️ Roadmap развития проекта

- [x] **Фаза 1: Каталог и Главная витрина** — Поиск, фильтры, двуязычность (RU/TG), валюты (TJS/USD), WebGL-шейдеры.
- [x] **Фаза 2: 6D Apple-витрина новостроек** — Интерактивная шахматка, солнцеход инсоляции, POI, паркинг, кладовые, документы.
- [x] **Фаза 3: Доска объявлений (Вторичка и Ҳавлӣ)** — 15 реальных объектов с Somon.tj, OTP-проверка, лимиты.
- [x] **Фаза 4: Кабинет застройщика (`/developer-admin`)** — CRUD комплексов, шахматки, очередей и медиа.
- [x] **Фаза 5: Публичные страницы девелоперов (`/developers/[slug]`)** — Реестр проверенных строительных компаний.
- [x] **Фаза 6: B2B CRM и Аналитика маклера (`/profile/*`)** — Канбан-доска, комиссия 2%, WhatsApp-витрины, Telegram Bot.
- [x] **Фаза 7: База данных Drizzle ORM** — 14 реляционных таблиц, сид реальными данными, 88 тестов.
- [x] **Фаза 8: PWA (Progressive Web App)** — Service Worker, Web Manifest, оффлайн-кэш, баннер установки.
- [ ] **Фаза 9: Интерактивная карта объектов** — Полноэкранная гео-карта Согдийской области (Яндекс.Карты / Leaflet).
- [ ] **Фаза 10: Мобильное приложение** — Нативное приложение на React Native / Expo для iOS и Android.
- [ ] **Фаза 11: AI-консультант по подбору недвижимости** — Интеллектуальный поиск по описанию на таджикском и русском языках.

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**. Подробности в файле [LICENSE](./LICENSE).

---

<div align="center">

Сделано с ❤️ для жителей и строителей **Таджикистана** 🇹🇯  
**Худжанд · Душанбе · Гулистон · Бобоҷон Ғафуров · Истаравшан**

[🌐 maskani.tj](https://sogd-realty.vercel.app) · [🐛 Сообщить об ошибке](https://github.com/Hafiz0ff/developppers/issues) · [💡 Предложить идею](https://github.com/Hafiz0ff/developppers/issues)

</div>
