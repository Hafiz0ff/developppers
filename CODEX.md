# CODEX.md — Инструкции для OpenAI Codex и автономных кодинг-агентов (Maskani / Sogd Realty)

Данный манифест регламентирует работу **OpenAI Codex** и других автономных агентов при модификации, тестировании и сборке кодовой базы **Maskani (`sogd-realty`)**.

---

## 1. Среда выполнения и проверка сборки

- **Корень проекта**: `/Users/hafizov/Developers/sogd-realty`
- **Фреймворк**: Next.js 16.2 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4.
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
| **CRM-бронирование и звонки** | `crm-booking-store.ts` | `/api/crm/lead-booking`, `/api/developer/crm-settings` | `projects/project-deal-builder-block.tsx`, `projects/lead-request-drawer.tsx`, `developer-admin/developer-crm-booking-settings.tsx` |
| **Шахматки ЖК, паркинга и кладовых** | `mock-data.ts` | `/api/projects`, `/api/pdf/unit/[id]` | `projects/chessboard.tsx`, `projects/building-cross-section.tsx`, `projects/parking-chessboard-modal.tsx`, `projects/storage-chessboard-modal.tsx` |
| **Интеграция со строительной ERP** | `erp-engine.ts` | `/api/erp/sync` | `app/developer-admin/page.tsx` |
| **Платёжные шлюзы и VAS** | `payment-gateway.ts`, `classifieds-vas.ts` | `/api/payments/checkout`, `/api/classifieds/vas` | `payments/payment-checkout-modal.tsx`, `classifieds/vas-upsell-modal.tsx` |
| **Сравнение объектов** | `compare-store.ts` | — | `app/compare/page.tsx`, `layout/compare-floating-bar.tsx` |
| **Рекламный движок и Суперадмин** | `ad-engine.ts`, `super-admin-analytics.ts` | `/api/ads/decision`, `/api/ads/event`, `/api/super-admin/overview` | `ads/native-ad-slot.tsx`, `app/advertiser/page.tsx`, `app/super-admin/page.tsx` |

---

## 3. Строгие контракты и правила безопасности

1. **Zero Client Trust в `/api/crm/lead-booking`**:
   - Всегда вызывай `verifyAndResolveLeadDealBundle` из `src/lib/crm-booking-store.ts`.
   - Проверяй: принадлежность проекта застройщику (`DEVELOPER_MISMATCH`), подключение CRM (`CRM_NOT_ACTIVE`), активность сценария (`FEATURE_DISABLED`), статус `"available"` для каждого выбранного лота (`unitId`, `parkingId`, `storageId`) и пересчитывай стоимость на сервере в `TJS`.
   - Никогда не меняй статус лота на `"booked"` или `"sold"` в момент отправки клиентской заявки.
2. **UI-инварианты сценария бронирования**:
   - Иконка `(?)` располагается **слева** от тумблера в `DeveloperCrmBookingSettings` и поддерживает как `hover`-поповер на десктопе, так и модальное окно при клике / на мобильных.
   - Оверлей `LeadRequestDrawer` выезжает **слева** (`left-0 slide-in-from-left`), содержит радиокнопки «В течение 15 минут» (по умолчанию) и «Выбрать время», а также квадратный чекбокс согласия с ПДн (`/privacy`), который по умолчанию **не отмечен** (`false`).
3. **Типобезопасность**:
   - Использование `any` и `@ts-ignore` запрещено. Все DTO и доменные модели типизированы в `src/lib/*`.
4. **Синхронизация документации**:
   - При изменении архитектуры или добавлении новых маршрутов обновляй `README.md`, `ARCHITECTURE.md`, `TASKS.md` и `MEMORY.md`.
