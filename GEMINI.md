# GEMINI.md — Контекст и инструкции для Gemini / Antigravity (Maskani / Sogd Realty)

## 1. Обзор проекта
**Maskani (`sogd-realty`)** — цифровая экосистема недвижимости Таджикистана (фокус на Согдийскую область: Худжанд, Бустон, Гулистон, Истаравшан и масштабирование на Душанбе).
- **Стек**: Next.js 16.2 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4, `@2gis/mapgl`, `pdfkit`, `lucide-react`.
- **Язык интерфейса**: Русский.
- **Валюты**: Таджикский сомони (`TJS` / `смн`) как базовая валюта расчётов и биллинга + переключение в `USD` (`$`) по курсу НБТ.

---

## 2. Обязательные документы для чтения
Перед выполнением задач ознакомься с корневыми манифестами:
- [`AGENTS.md`](./AGENTS.md) — общие правила работы агентов и инварианты.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — архитектура слоёв, API и потоков данных.
- [`DESIGN.md`](./DESIGN.md) — визуальный язык «Digital Cleanliness + Tajik Modernity».
- [`RULES.md`](./RULES.md) — правила кодирования, тестирования и безопасности.
- [`TASKS.md`](./TASKS.md) и [`MEMORY.md`](./MEMORY.md) — статус задач и журнал архитектурных решений (ADR).
- [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md) — полное ТЗ (15 разделов) сценария заявок на бронирование и звонки.

---

## 3. Архитектурные правила
1. **Слоистая структура (`app` $\rightarrow$ `components/modules` $\rightarrow$ `components/ui` $\rightarrow$ `lib`)**:
   - Вся бизнес-логика (расчёт ипотеки, сборка комплексной сделки, проверка CRM-настроек, платёжный шлюз, рекламный аукцион, сравнение объектов, импорт из ERP) изолирована в `src/lib/`.
2. **Принцип Zero Client Trust**:
   - Серверные маршруты (`/api/crm/lead-booking`, `/api/payments/checkout`, `/api/classifieds/vas`, `/api/erp/sync`) не доверяют клиентским суммам и пересчитывают цены по серверному справочнику в `TJS`.
3. **Тестирование и сборка**:
   - Перед завершением задачи обязательно выполни:
     ```bash
     npx tsx --test 'src/**/*.test.ts'
     npm run build
     ```
   - Все **176 unit-тестов** должны проходить без ошибок.
