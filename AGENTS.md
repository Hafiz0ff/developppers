# AGENTS.md — Универсальный манифест для ИИ-агентов (Maskani / Sogd Realty)

Данный файл определяет обязательные архитектурные, продуктовые и инженерные правила при работе любого ИИ-агента (`Antigravity`, `Claude Code`, `OpenAI Codex`, `Cursor`, `Gemini`) с репозиторием **Maskani (`sogd-realty`)**.

---

## 1. Обязательный контекст перед началом работы

Перед внесением изменений в код агент обязан ознакомиться со следующими документами:
1. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — слоистая архитектура, границы модулей, контракты API и схемы данных.
2. [`DESIGN.md`](./DESIGN.md) — дизайн-система, цветовые токены (`#059669` Emerald, `#D97706` Amber, `#0F172A` Slate), адаптивные паттерны и состояния компонентов.
3. [`RULES.md`](./RULES.md) — стандарты TypeScript (`strict: true`), безопасность (`Zero Client Trust`), SEO-правила (ТЗ v1.7) и правила гигиены Git.
4. [`TASKS.md`](./TASKS.md) и [`MEMORY.md`](./MEMORY.md) — текущий статус фич и история архитектурных решений.
5. [`docs/specs/SPEC_SEO_URL_ARCHITECTURE.md`](./docs/specs/SPEC_SEO_URL_ARCHITECTURE.md) — эталонное ТЗ v1.7 по URL-архитектуре и автоматизации SEO.
6. [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md) — ТЗ по сценарию бронирования и звонков.

---

## 2. Архитектурные инварианты (Dependency Rule)

Поток импортов строго однонаправленный:
`src/app` / `src/middleware.ts` $\rightarrow$ `src/components/modules` $\rightarrow$ `src/components/ui` $\rightarrow$ `src/lib`

- **Запрещено**: импортировать компоненты из `src/app/*` внутрь `src/components/*` или `src/lib/*`.
- **Запрещено**: помещать бизнес-логику расчёта цен, ипотеки, генерации SEO-маршрутов, хлебных крошек или JSON-LD непосредственно в JSX-компоненты — вся доменная логика должна находиться в `src/lib/*` и покрываться тестами `src/lib/*.test.ts`.

---

## 3. Ключевые доменные модули и точки входа

| Домен | Основные файлы |
| :--- | :--- |
| **URL-архитектура, мультиязычные роуты и автоматизация SEO (ТЗ v1.7)** | `src/lib/seo/taxonomy-store.ts`, `src/lib/seo/url-resolver.ts`, `src/lib/seo/url-alias-store.ts`, `src/lib/seo/batch-seo-processor.ts`, `src/lib/seo/sitemap-generator.ts`, `next.config.ts`, `src/app/[city]/page.tsx`, `src/app/[city]/[...slug]/page.tsx`, `src/app/super-admin/categories/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts` |
| **Сценарий бронирования и звонков (CRM Deal Builder)** | `src/lib/crm-booking-store.ts`, `src/app/api/crm/lead-booking/route.ts`, `src/components/modules/projects/project-deal-builder-block.tsx`, `src/components/modules/projects/lead-request-drawer.tsx`, `src/components/modules/developer-admin/developer-crm-booking-settings.tsx` |
| **Шахматки квартир, паркинга и кладовых** | `src/components/modules/projects/chessboard.tsx`, `src/components/modules/projects/parking-chessboard-modal.tsx`, `src/components/modules/projects/storage-chessboard-modal.tsx` |
| **Интеграция со строительной ERP** | `src/lib/erp-engine.ts`, `src/app/api/erp/sync/route.ts`, `src/app/developer-admin/page.tsx` |
| **Платёжные шлюзы РТ и VAS-монетизация** | `src/lib/payment-gateway.ts`, `src/lib/classifieds-vas.ts`, `src/app/api/payments/checkout/route.ts`, `src/components/modules/payments/payment-checkout-modal.tsx` |
| **Модуль сравнения объектов** | `src/lib/compare-store.ts`, `src/app/compare/page.tsx` |
| **Рекламный движок и Суперадмин** | `src/lib/ad-engine.ts`, `src/lib/super-admin-analytics.ts`, `src/app/super-admin/page.tsx` |

---

## 4. Критические SEO- и бизнес-правила

1. **Языковые префиксы URL**:
   - `RU` — строго без префикса (например, `/dushanbe/arenda/kvartiry/...`). Никогда не генерировать `/ru/`.
   - `TG` — с префиксом `/tg/` (например, `/tg/dushanbe/ijora/khonadon/...`).
   - `EN` — с префиксом `/en/` (например, `/en/dushanbe/rent/apartments/...`).
   - `self-canonical` обязателен для каждой языковой версии. `hreflang` взаимный, `x-default` указывает на RU.
2. **Ликвидация цепочек редиректов (Single-Hop 301)**:
   - При смене категории или переезде объявления старый URL сохраняется в реестре алиасов и возвращает серверный 301 на актуальный канонический URL. Цепочки редиректов (`A -> B -> C`) автоматически схлопываются в `A -> C`. Циклические переходы (`A -> A`) исключены.
3. **Zero Manual SEO для партнёров**:
   - В формах подачи объявлений запрещено требовать ручного ввода SEO-полей. Все метатеги, H1, Title, Description, BreadcrumbList и RealEstateListing JSON-LD формируются централизованно через `url-resolver.ts`.
4. **Масштабируемость без фиктивных строк в БД**:
   - При пакетной обработке и аудитах работать только с фактическими данными проекта в режиме `DRY RUN`. Тестирование производительности на 10 000+ записей выполняется в изолированных in-memory бенчмарках.

---

## 5. Проверка качества перед коммитом (Definition of Done)

```bash
# 1. Запуск всех 187 тестов
npx tsx --test 'src/**/*.test.ts'

# 2. Проверка строгой типизации и сборки Next.js
npm run build
```
