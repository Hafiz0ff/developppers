# CLAUDE.md — Руководство для Claude Code (Maskani / Sogd Realty)

Этот файл предназначен для **Claude Code** и содержит ключевые команды, архитектурные принципы и инварианты проекта **Maskani (`sogd-realty`)** — PropTech-экосистемы недвижимости Таджикистана.

---

## Быстрые команды

```bash
# Запуск dev-сервера (Next.js 16 + Turbopack)
npm run dev

# Запуск всех 192 unit- и интеграционных тестов
npx tsx --test 'src/**/*.test.ts'

# Production-сборка и проверка TypeScript
npm run build

# Проверка линтером
npm run lint
```

---

## Архитектурный обзор

- **Стек**: Next.js 16.4 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4, Edge Middleware, `@2gis/mapgl`, `pdfkit`.
- **Слоистая структура**:
  - `src/app/` — страницы, динамические SEO-хабы (`[city]`, `[city]/[...slug]`) и серверные Route Handlers (`/api/*`).
  - `next.config.ts` — серверные rewrites для `/tg` и `/en`, 301-редиректы запрещённого `/ru/`.
  - `src/components/modules/` — доменные модули (`projects`, `developer-admin`, `classifieds`, `payments`, `ads`, `map`, `catalog`, `calculator`).
  - `src/components/ui/` — переиспользуемые UI-примитивы (`Button`, `Badge`, `Card`, `Input`).
  - `src/lib/` — чистая доменная логика, SEO-движок (`src/lib/seo/`), валидаторы, интеграционные движки и `*.test.ts`.

---

## Ключевые продуктовые контуры

1. **URL-архитектура и автоматизация SEO (ТЗ v1.7 FINAL)**:
   - Полная спецификация: [`docs/specs/SPEC_SEO_URL_ARCHITECTURE.md`](./docs/specs/SPEC_SEO_URL_ARCHITECTURE.md).
   - Единый генератор `src/lib/seo/url-resolver.ts`:
     - RU без префикса, TG `/tg/`, EN `/en/`.
     - `self-canonical` и взаимный `hreflang` (`ru`, `tg`, `en`, `x-default` -> RU).
     - Синхронизированные видимые крошки и Schema.org `BreadcrumbList`.
     - `RealEstateListing` JSON-LD с точным совпадением видимых цен и статусов.
   - Реестр 301-алиасов `src/lib/seo/url-alias-store.ts` с устранением цепочек (`A -> C`, `B -> C`) и защитой от циклов.
   - Zero Manual SEO для партнёров (в кабинетах нет технических SEO-полей).
   - Super Admin: управление категориями и безопасный аудит DRY RUN (`/super-admin/categories`).
   - Масштабируемость 10 000+ записей без добавления фиктивных данных в БД.

2. **Карточка ЖК и Сценарий бронирования и звонков (`/projects/[slug]`, `/developer-admin`)**:
   - Полная спецификация: [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md).
   - Конструктор комплексной сделки (`Квартира + Паркинг + Кладовая`).
   - Выдвижной оверлей бронирования с Zero Client Trust валидацией на сервере.

3. **Шлюз строительной ERP (`/api/erp/sync`, `src/lib/erp-engine.ts`)**:
   - Принимает пакетные обновления шахматки и цен из `1С`, `Profitbase`, `MacroCRM` с аудитом.

4. **Платёжные шлюзы РТ и VAS-монетизация (`/api/payments/checkout`, `/api/classifieds/vas`)**:
   - Оплата через `Корти Милли`, `DC Next QR`, `Alif Salom`, `Эсхата Онлайн`.

---

## Инженерные правила для Claude

- Не доверяй ценам и статусам, пришедшим с клиента: все расчёты выполняй на сервере в базовой валюте `TJS`.
- При генерации URL соблюдай правила языковых префиксов (RU — без префикса, TG — `/tg/`, EN — `/en/`).
- Сохраняй существующие комментарии и документацию.
- После любых изменений запускай `npx tsx --test 'src/**/*.test.ts'` и `npm run build`.
- Подробные правила описаны в [`RULES.md`](./RULES.md) и [`AGENTS.md`](./AGENTS.md).
