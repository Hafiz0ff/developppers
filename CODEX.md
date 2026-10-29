# CODEX.md — Инструкции для OpenAI Codex и автономных кодинг-агентов (Maskani / Sogd Realty)

Данный манифест регламентирует работу **OpenAI Codex** и других автономных агентов при модификации, тестировании и сборке кодовой базы **Maskani (`sogd-realty`)**.

---

## 1. Среда выполнения и проверка сборки

- **Корень проекта**: `/Users/hafizov/Developers/sogd-realty`
- **Фреймворк**: Next.js 16.4 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4.
- **Команда тестирования** (обязательна перед завершением любой задачи):
  ```bash
  npx tsx --test 'src/**/*.test.ts'
  ```
- **Команда проверки продакшен-сборки**:
  ```bash
  npm run build
  ```

---

## 2. Карта модулей и ответственности

| Модуль | Серверная логика / Стор (`src/lib/`) | API Endpoint (`src/app/api/`) | UI-компоненты (`src/components/modules/`) |
| :--- | :--- | :--- | :--- |
| **URL-архитектура, мультиязычность и SEO (ТЗ v1.7)** | `seo/taxonomy-store.ts`, `seo/url-resolver.ts`, `seo/url-alias-store.ts`, `seo/batch-seo-processor.ts`, `seo/sitemap-generator.ts` | `/api/super-admin/categories`, `/api/super-admin/seo/dry-run` | `app/super-admin/categories/page.tsx`, `next.config.ts`, `app/[city]/page.tsx`, `app/[city]/[...slug]/page.tsx`, `app/robots.ts`, `app/sitemap.ts` |
| **CRM-бронирование и звонки** | `crm-booking-store.ts` | `/api/crm/lead-booking`, `/api/developer/crm-settings` | `projects/project-deal-builder-block.tsx`, `projects/lead-request-drawer.tsx`, `developer-admin/developer-crm-booking-settings.tsx` |
| **Шахматки ЖК, паркинга и кладовых** | `mock-data.ts` | `/api/projects`, `/api/pdf/unit/[id]` | `projects/chessboard.tsx`, `projects/building-cross-section.tsx`, `projects/parking-chessboard-modal.tsx`, `projects/storage-chessboard-modal.tsx` |
| **Интеграция со строительной ERP** | `erp-engine.ts` | `/api/erp/sync` | `app/developer-admin/page.tsx` |
| **Платёжные шлюзы и VAS** | `payment-gateway.ts`, `classifieds-vas.ts` | `/api/payments/checkout`, `/api/classifieds/vas` | `payments/payment-checkout-modal.tsx`, `classifieds/vas-upsell-modal.tsx` |
| **Сравнение объектов** | `compare-store.ts` | — | `app/compare/page.tsx`, `layout/compare-floating-bar.tsx` |
| **Рекламный движок и Суперадмин** | `ad-engine.ts`, `super-admin-analytics.ts` | `/api/ads/decision`, `/api/ads/event`, `/api/super-admin/overview` | `ads/native-ad-slot.tsx`, `app/advertiser/page.tsx`, `app/super-admin/page.tsx` |

---

## 3. Строгие контракты и правила безопасности

1. **SEO-инварианты (ТЗ v1.7)**:
   - RU-версия **строго без префикса** (`/`). TG — `/tg/`, EN — `/en/`.
   - При смене категории или slug старый URL регистрируется в реестре алиасов и перенаправляется на актуальный канонический URL одним серверным 301.
   - Цепочки редиректов автоматически ликвидируются (`A -> C`). Циклические редиректы запрещены.
   - Партнёры заполняют только бизнес-данные. Ручные SEO-поля в кабинетах запрещены.
   - Пакетные аудиты запускать в режиме DRY RUN. Не создавать фиктивные записи в БД для нагрузочных тестов.
2. **Zero Client Trust в `/api/crm/lead-booking`**:
   - Всегда вызывай `verifyAndResolveLeadDealBundle`. Пересчитывай стоимость на сервере в `TJS`. Не меняй статус лотов на `"booked"` автоматически.
3. **Типобезопасность**:
   - Использование `any` и `@ts-ignore` запрещено. Все DTO и доменные модели типизированы в `src/lib/*`.
4. **Синхронизация документации**:
   - При изменении архитектуры или добавлении новых маршрутов обновляй `README.md`, `ARCHITECTURE.md`, `TASKS.md` и `MEMORY.md`.

---

## 4. Graphify Knowledge Graph & Agent Skills (`codex-skills`)

В репозитории подключён и настроен навык **Graphify** (`.agents/skills/graphify/SKILL.md` и `.codex/skills/graphify/SKILL.md`):
- **Схема графа знаний**: `graphify-out/graph.json` и интерактивный `graphify-out/graph.html` содержат граф AST всех 440+ файлов, импортов, экспортных символов и связей между компонентами (3970 узлов, 12183 связи).
- **Быстрый поиск связей**: перед выполнением глубокого поиска по файлам Codex и другие агенты могут использовать:
  - `graphify query "<вопрос>"` — контекстный граф-запрос;
  - `graphify path "<NodeA>" "<NodeB>"` — кратчайший путь архитектурных зависимостей;
  - `graphify explain "<Node>"` — контекст связей сущности/модели.
- **Команды в проекте**:
  - `npm run graphify:update` — быстрое обновление графа по AST (3 сек, без LLM);
  - `npm run graphify:html` — генерация интерактивной визуализации графа.

