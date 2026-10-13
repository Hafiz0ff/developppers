<div align="center">

<img src="https://raw.githubusercontent.com/Hafiz0ff/developppers/main/public/logo.svg" alt="Sogd Realty Logo" width="80" height="80">

# 🏙️ Sogd Realty

**Премиальная платформа недвижимости для Согдийской области**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sogd--realty.vercel.app-059669?style=for-the-badge)](https://sogd-realty.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

*Современная платформа для поиска и продажи недвижимости в Худжанде и Согдийской области Таджикистана — с кабинетом застройщика, интерактивной шахматкой и мультивалютной поддержкой (TJS / USD).*

</div>

---

## ✨ Возможности

| Раздел | Описание |
|---|---|
| 🏢 **Каталог ЖК** | Витрина новостроек с фильтрацией по городу, стадии и цене |
| 🗃️ **Шахматка квартир** | Интерактивная визуализация этажей и статусов квартир в реальном времени |
| 🏠 **Вторичный рынок** | Объявления частных продавцов с фото и описанием |
| 🏗️ **Кабинет застройщика** | Управление проектами, корпусами, квартирами и бронированиями |
| 📊 **B2B Канбан CRM** | Учет клиентов, авто-создание лидов при звонках и калькулятор комиссии |
| 📲 **WhatsApp-витрины** | Персональные ссылки `/p/[code]` для клиентов без рекламы и прямых контактов |
| 🤖 **Telegram Push-уведомления** | Мгновенные оповещения в Telegram-бот о звонках и откликах |
| 📈 **Аналитика & Open API** | Воронка конверсий (CTR, показы) и интеграция с AmoCRM / Bitrix24 |
| 💱 **Мультивалютность** | Мгновенное переключение TJS ⇄ USD с актуальным курсом |
| 🎨 **WebGL-шейдеры** | Премиальные фоновые эффекты (aurora / gradient-mesh / light-leak) |
| 🔐 **Аутентификация** | Безопасный вход для застройщиков через Better Auth |
| 📱 **Mobile-first** | Адаптивный дизайн под все размеры экранов |

---

## 🛠️ Технологический стек

```
Frontend          Backend / ORM        Инфраструктура
─────────────     ──────────────       ──────────────
Next.js 16.4      Drizzle ORM          Vercel (Hobby)
React 19          PostgreSQL           Supabase (Free)
TypeScript 5      Better Auth          GitHub
Tailwind CSS v4   Zod validation
Shadcn/UI
WebGL (custom)
```

### Полный список зависимостей

| Категория | Пакет | Версия |
|---|---|---|
| Framework | `next` | `^16.4.0` |
| UI | `react`, `react-dom` | `^19.3.0` |
| Styling | `tailwindcss` | `^4.0` |
| Components | `@shadcn/ui` | latest |
| ORM | `drizzle-orm` | latest |
| Auth | `better-auth` | latest |
| DB Driver | `postgres` | latest |
| Validation | `zod` | latest |

---

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** ≥ 20.x
- **pnpm** ≥ 10.x — `npm install -g pnpm`
- **PostgreSQL** (или аккаунт [Supabase](https://supabase.com))

### 1. Клонирование

```bash
git clone https://github.com/Hafiz0ff/developppers.git
cd developppers
```

### 2. Установка зависимостей

```bash
pnpm install
```

### 3. Переменные окружения

Скопируй шаблон и заполни значения:

```bash
cp .env.example .env.local
```

```env
# База данных (Supabase / любой PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Аутентификация
BETTER_AUTH_SECRET=your_random_secret_32_chars_min
BETTER_AUTH_URL=http://localhost:3000

# Публичные переменные
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_USD_TO_TJS_RATE=10.95
```

> ⚠️ **Никогда не коммить `.env.local`** — он уже добавлен в `.gitignore`.

### 4. Миграция базы данных

```bash
pnpm db:push      # применить схему
pnpm db:seed      # заполнить тестовыми данными
```

### 5. Запуск в режиме разработки

```bash
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000) в браузере.

### 6. Сборка для продакшена

```bash
pnpm build
pnpm start
```

---

## 📁 Структура проекта

```
sogd-realty/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Главная (Hero с фоновым переключателем + Каталог)
│   │   ├── layout.tsx          # Root Layout (шапка, шрифты, провайдеры валюты)
│   │   ├── globals.css         # Tailwind v4 + CSS-переменные темы
│   │   ├── projects/[slug]/    # Страница конкретного ЖК (шахматка, корпус)
│   │   ├── developers/[slug]/  # Страница застройщика с портфолио
│   │   ├── developer-admin/    # Кабинет застройщика (CRUD проектов, шахматки)
│   │   ├── profile/            # Личный кабинет риелтора / маклера
│   │   │   ├── crm/            # Канбан-воронка лидов & калькулятор комиссии
│   │   │   ├── analytics/      # Аналитика конверсий, графики & Open API
│   │   │   └── settings/       # Настройки профиля & Telegram Bot интеграция
│   │   ├── p/[share_code]/     # Персональная мобильная витрина для WhatsApp
│   │   └── api/                # API Route Handlers
│   │       ├── crm/leads/      # REST: лиды маклера (CRUD + Telegram push)
│   │       ├── crm/collections/# REST: персональные подборки
│   │       ├── profile/telegram# REST: Telegram Chat ID и тест бота
│   │       ├── v1/external/    # Open API: экспорт аналитики и импорт фидов
│   │       └── auth/[...all]/  # Better Auth endpoints
│   ├── components/             # React компоненты
│   │   ├── ui/                 # Shadcn + ShaderBackground WebGL
│   │   ├── layout/             # Header, Navigation, Footer
│   │   └── modules/            # Интерактивная шахматка квартир
│   ├── db/
│   │   ├── schema/             # Drizzle ORM (auth, crm, projects, units, analytics)
│   │   ├── index.ts            # Подключение к PostgreSQL (Supabase / Neon)
│   │   └── seed.ts             # Скрипт наполнения тестовыми данными
│   ├── lib/
│   │   ├── telegram.ts         # Telegram Bot API клиент для уведомлений
│   │   ├── catalog-data.ts     # Каталог объектов недвижимости
│   │   ├── auth.ts             # Конфиг Better Auth
│   │   └── utils.ts            # Утилиты форматирования валют (TJS / USD)
│   └── context/                # Контексты (валюта, стейт)
├── public/                     # Статика и концептуальные фоны
├── TASKS.md                    # Roadmap задач
├── RULES.md                    # Архитектурные стандарты
└── package.json
```

---

## 🗄️ Схема базы данных

```mermaid
erDiagram
    DEVELOPERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ BUILDINGS : has
    BUILDINGS ||--o{ UNITS : contains
    PROJECTS {
        uuid id PK
        text name
        text slug UK
        text city
        text stage
        text cover_url
        text description
        timestamp created_at
    }
    BUILDINGS {
        uuid id PK
        uuid project_id FK
        text name
        int floors
    }
    UNITS {
        uuid id PK
        uuid building_id FK
        int floor
        int number
        text status
        int rooms
        numeric area_m2
        numeric price_tjs
    }
    CLASSIFIEDS {
        uuid id PK
        text title
        text city
        text type
        int rooms
        numeric price_tjs
        text contact_phone
        timestamp created_at
    }
```

---

## 🎨 WebGL-шейдеры

Компонент [`ShaderBackground`](./src/components/ui/shader-background.tsx) предоставляет три варианта премиальных фоновых эффектов, реализованных на чистом WebGL (0 новых зависимостей):

| Вариант | Описание | Применение |
|---|---|---|
| `aurora` | Переливающееся северное сияние | Hero-секция главной страницы |
| `gradient-mesh` | Анимированная градиентная сетка | Общие фоны |
| `light-leak` | Мягкие световые блики | Страница ЖК |

**Оптимизации:**
- `IntersectionObserver` — пауза анимации вне viewport (экономия батареи)
- `prefers-reduced-motion` — автоотключение для пользователей с вестибулярными нарушениями
- DPR ≤ 1.5 — ограничение разрешения на hi-DPI экранах
- CSS gradient fallback — при отсутствии WebGL / режиме экономии энергии

---

## 🌐 Окружения

| Окружение | URL | Ветка |
|---|---|---|
| **Production** | [sogd-realty.vercel.app](https://sogd-realty.vercel.app) | `main` |
| **Local Dev** | http://localhost:3000 | любая |

---

## 🔑 Переменные окружения (справочник)

| Переменная | Обязательная | Описание |
|---|---|---|
| `DATABASE_URL` | ✅ | Строка подключения PostgreSQL |
| `BETTER_AUTH_SECRET` | ✅ | Секрет JWT-токенов (мин. 32 символа) |
| `BETTER_AUTH_URL` | ✅ | Базовый URL приложения для Auth |
| `NEXT_PUBLIC_APP_URL` | ✅ | Публичный URL (для OpenGraph и шеринга) |
| `NEXT_PUBLIC_USD_TO_TJS_RATE` | ✅ | Курс USD → TJS (например `10.95`) |
| `TELEGRAM_BOT_TOKEN` | ⚙️ | Токен Telegram-бота для мгновенных уведомлений |
| `TELEGRAM_BOT_USERNAME` | ⚙️ | Юзернейм бота (по умолчанию `SogdRealtyBot`) |
| `TELEGRAM_CHAT_ID` | ⚙️ | Дефолтный Chat ID администратора/агентства |

---

## 📋 Доступные команды

```bash
pnpm dev          # Режим разработки (порт 3000)
pnpm build        # Продакшн-сборка
pnpm start        # Запуск продакшн-сервера
pnpm lint         # ESLint проверка
pnpm db:push      # Применить схему Drizzle к БД
pnpm db:studio    # Открыть Drizzle Studio (GUI для БД)
pnpm db:seed      # Заполнить БД тестовыми данными
```

---

## 🗺️ Roadmap

- [x] Phase 1 — Публичный каталог ЖК и квартир
- [x] Phase 2 — Кабинет застройщика + Шахматка
- [x] Phase 3 — Вторичный рынок (частные объявления)
- [x] Phase 4 — Деплой на Vercel + Supabase
- [x] Phase 5 — WebGL-шейдеры (премиальный UI)
- [x] Phase 6 — Hybrid B2B CRM (Канбан-воронка + WhatsApp-витрины)
- [x] Phase 7 — Telegram Bot Push-уведомления о лидах
- [ ] Phase 8 — Интерактивная карта объектов (Яндекс.Карты / Leaflet)
- [ ] Phase 9 — Мобильное приложение (React Native / Expo)

---

## 🤝 Разработка

Pull request-ы приветствуются! Перед отправкой:

1. Создай ветку `feature/your-feature` от `main`
2. Убедись, что `pnpm build` проходит без ошибок
3. Следуй правилам из [`RULES.md`](./RULES.md)
4. Напиши осмысленный commit-сообщение в стиле [Conventional Commits](https://conventionalcommits.org)

---

## 📄 Лицензия

Распространяется под лицензией **MIT**. Подробности в файле [LICENSE](./LICENSE).

---

<div align="center">

Сделано с ❤️ в **Худжанде, Таджикистан** 🇹🇯

[🌐 Демо](https://sogd-realty.vercel.app) · [🐛 Баги](https://github.com/Hafiz0ff/developppers/issues) · [💡 Предложения](https://github.com/Hafiz0ff/developppers/issues)

</div>
