# AGENTS.md — Универсальный манифест для ИИ-агентов (Maskani / Sogd Realty)

Данный файл определяет обязательные архитектурные, продуктовые и инженерные правила при работе любого ИИ-агента (`Antigravity`, `Claude Code`, `OpenAI Codex`, `Cursor`, `Gemini`) с репозиторием **Maskani (`sogd-realty`)**.

---

## 1. Обязательный контекст перед началом работы

Перед внесением изменений в код агент обязан ознакомиться со следующими документами:
1. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — слоистая архитектура, границы модулей, контракты API и схемы данных.
2. [`DESIGN.md`](./DESIGN.md) — дизайн-система, цветовые токены (`#059669` Emerald, `#D97706` Amber, `#0F172A` Slate), адаптивные паттерны и состояния компонентов.
3. [`RULES.md`](./RULES.md) — стандарты TypeScript (`strict: true`), безопасность (`Zero Client Trust`), правила гигиены Git и тестирования.
4. [`TASKS.md`](./TASKS.md) и [`MEMORY.md`](./MEMORY.md) — текущий статус фич и история архитектурных решений.
5. [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md) — эталонное 15-секционное ТЗ по сценарию бронирования и звонков.

---

## 2. Архитектурные инварианты (Dependency Rule)

Поток импортов строго однонаправленный:
`src/app` $\rightarrow$ `src/components/modules` $\rightarrow$ `src/components/ui` $\rightarrow$ `src/lib`

- **Запрещено**: импортировать компоненты из `src/app/*` внутрь `src/components/*` или `src/lib/*`.
- **Запрещено**: помещать бизнес-логику расчёта цен, ипотеки, рекламного аукциона или серверной валидации сделок непосредственно в JSX-компоненты — вся доменная логика должна находиться в `src/lib/*` и покрываться модульными тестами `src/lib/*.test.ts`.
- **Серверные и клиентские компоненты**: по умолчанию файлы в `src/app/*` являются React Server Components (RSC). Директива `"use client"` добавляется только в интерактивные модули (`src/components/modules/*`) или страницы с локальным состоянием.

---

## 3. Ключевые доменные модули и точки входа

| Домен | Основные файлы |
| :--- | :--- |
| **Сценарий бронирования и звонков (CRM Deal Builder)** | `src/lib/crm-booking-store.ts`, `src/app/api/crm/lead-booking/route.ts`, `src/app/api/developer/crm-settings/route.ts`, `src/components/modules/projects/project-deal-builder-block.tsx`, `src/components/modules/projects/lead-request-drawer.tsx`, `src/components/modules/developer-admin/developer-crm-booking-settings.tsx` |
| **Шахматки квартир, паркинга и кладовых** | `src/components/modules/projects/chessboard.tsx`, `src/components/modules/projects/building-cross-section.tsx`, `src/components/modules/projects/parking-chessboard-modal.tsx`, `src/components/modules/projects/storage-chessboard-modal.tsx` |
| **Интеграция со строительной ERP** | `src/lib/erp-engine.ts`, `src/app/api/erp/sync/route.ts`, `src/app/developer-admin/page.tsx` |
| **Платёжные шлюзы РТ и VAS-монетизация** | `src/lib/payment-gateway.ts`, `src/lib/classifieds-vas.ts`, `src/app/api/payments/checkout/route.ts`, `src/app/api/classifieds/vas/route.ts`, `src/components/modules/payments/payment-checkout-modal.tsx`, `src/components/modules/classifieds/vas-upsell-modal.tsx` |
| **Модуль сравнения объектов** | `src/lib/compare-store.ts`, `src/app/compare/page.tsx`, `src/components/layout/compare-floating-bar.tsx` |
| **Рекламный движок и Суперадмин** | `src/lib/ad-engine.ts`, `src/lib/super-admin-analytics.ts`, `src/app/advertiser/page.tsx`, `src/app/super-admin/page.tsx` |

---

## 4. Критические бизнес-правила (Zero Client Trust)

1. **Авторитетный расчёт цен на сервере**:
   - В `POST /api/crm/lead-booking` клиент передаёт идентификаторы выбранных объектов (`unitId`, `parkingId`, `storageId`). Сервер **игнорирует** клиентские цены и вычисляет итоговую стоимость сделки (`totalPriceTjs`) по серверному реестру в сомони (`TJS`).
2. **Неизменность статуса лотов при подаче заявки**:
   - Отправка заявки на бронирование через витрину **не переводит** квартиру, машино-место или кладовую в статус `booked` или `sold` автоматически. Статус остаётся `available` до подтверждения менеджером застройщика в CRM.
3. **Зависимость сценария от CRM**:
   - Если у застройщика отключается интеграция с CRM (`crmConnected = false`), тумблер «Сценарий бронирования и звонков» (`bookingScenarioEnabled`) автоматически сбрасывается в `false` на уровне сервера.
4. **Согласие на обработку ПДн**:
   - Чекбокс согласия в оверлеях «Забронировать» и «Звонок» по умолчанию **не проставлен** (`false`). Без `consentPersonalData === true` отправка формы заблокирована и на клиенте, и на сервере (`400 CONSENT_REQUIRED`).

---

## 5. Проверка качества перед коммитом (Definition of Done)

Любое изменение считается завершённым только после успешного прохождения двух команд:

```bash
# 1. Запуск всех модульных и интеграционных тестов (176+ тестов)
npx tsx --test 'src/**/*.test.ts'

# 2. Проверка строгой типизации и production-сборки Next.js
npm run build
```

При добавлении новой функциональности агент обязан:
- добавить/обновить unit-тесты в `src/lib/*.test.ts`;
- синхронизировать документацию (`README.md`, `ARCHITECTURE.md`, `TASKS.md`, `MEMORY.md`).
