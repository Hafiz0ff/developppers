# CLAUDE.md — Руководство для Claude Code (Maskani / Sogd Realty)

Этот файл предназначен для **Claude Code** и содержит ключевые команды, архитектурные принципы и инварианты проекта **Maskani (`sogd-realty`)** — PropTech-экосистемы недвижимости Таджикистана.

---

## Быстрые команды

```bash
# Запуск dev-сервера (Next.js 16 + Turbopack)
npm run dev

# Запуск всех unit- и интеграционных тестов (Node test runner + tsx)
npx tsx --test 'src/**/*.test.ts'

# Production-сборка и проверка TypeScript
npm run build

# Проверка линтером
npm run lint
```

---

## Архитектурный обзор

- **Стек**: Next.js 16.2 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4, `@2gis/mapgl`, `pdfkit`.
- **Слоистая структура**:
  - `src/app/` — страницы и серверные Route Handlers (`/api/*`).
  - `src/components/modules/` — доменные модули (`projects`, `developer-admin`, `classifieds`, `payments`, `ads`, `map`, `catalog`, `calculator`).
  - `src/components/ui/` — переиспользуемые UI-примитивы (`Button`, `Badge`, `Card`, `Input`).
  - `src/lib/` — чистая доменная логика, состояние, валидаторы, интеграционные движки и `*.test.ts`.
- **Однонаправленные зависимости**: `app` $\rightarrow$ `components/modules` $\rightarrow$ `components/ui` $\rightarrow$ `lib`. Обратные импорты запрещены.

---

## Ключевые продуктовые контуры

1. **Карточка ЖК и Сценарий бронирования и звонков (`/projects/[slug]`, `/developer-admin`)**:
   - Полная спецификация: [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md).
   - В кабинете застройщика (`/developer-admin`) компонент `DeveloperCrmBookingSettings` реализует 3 состояния подключения CRM и тумблера со справочным поповером/модалкой `(?)` слева от переключателя.
   - На карточке ЖК компонент `ProjectDealBuilderBlock` управляет блоками:
     - «Стоимость выбранной квартиры» (синхронизирован с «Планом секции» и «Интерактивной шахматкой»);
     - «С паркингом и кладовой покупка выгоднее» (вызов модальных шахматок `ParkingChessboardModal` и `StorageChessboardModal`);
     - «Общая стоимость» (позиционный список с удалением `[×]` и расчётом `Итого`).
   - Выдвижной слева оверлей `LeadRequestDrawer` («Заявка на бронирование» / «Когда вам перезвонить?») передаёт заявку в `POST /api/crm/lead-booking` с серверной проверкой `Zero Client Trust` (`verifyAndResolveLeadDealBundle` в `src/lib/crm-booking-store.ts`).

2. **Шлюз строительной ERP (`/api/erp/sync`, `src/lib/erp-engine.ts`)**:
   - Принимает пакетные обновления шахматки и цен из `1С`, `Profitbase`, `MacroCRM` с идемпотентной обработкой и журналом аудита.

3. **Платёжные шлюзы РТ и VAS-монетизация (`/api/payments/checkout`, `/api/classifieds/vas`)**:
   - Оплата через `Корти Милли`, `DC Next QR`, `Alif Salom`, `Эсхата Онлайн`.
   - Продвижение объявлений физлиц: `Поднять в ТОП на 7 дней` (10 смн), `Выделение цветом` (8 смн), `Срочная продажа 🔥` (12 смн), `Турбо 3-в-1` (24 смн).

4. **Модуль сравнения (`/compare`, `src/lib/compare-store.ts`)**:
   - Сравнение новостроек и вторичных квартир с режимом «Только отличия» и автоподсветкой лучших параметров.

5. **Рекламная платформа и Суперадмин (`/advertiser`, `/super-admin`, `src/lib/ad-engine.ts`)**:
   - Гибридный аукцион `CPC/CPM` с антифродом кликов и аналитикой выручки.

---

## Инженерные правила для Claude

- Не доверяй ценам и статусам, пришедшим с клиента: все расчёты стоимости сделок и платежей выполняй на сервере в базовой валюте `TJS` (сомони).
- Сохраняй существующие комментарии и документацию.
- После любых изменений в `src/lib/*` или `/api/*` запускай `npx tsx --test 'src/**/*.test.ts'` и `npm run build`.
- Подробные правила оформления кода и безопасности описаны в [`RULES.md`](./RULES.md) и [`AGENTS.md`](./AGENTS.md).
