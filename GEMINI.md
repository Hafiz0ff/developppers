# GEMINI.md — Контекст и инструкции для Gemini / Antigravity (Maskani / Sogd Realty)

## 1. Обзор проекта
**Maskani (`sogd-realty`)** — цифровая экосистема недвижимости Таджикистана (фокус на Согдийскую область: Худжанд, Бустон, Гулистон, Истаравшан и масштабирование на Душанбе).
- **Стек**: Next.js 16.4 (`App Router`), React 19.2, TypeScript 5 (`strict: true`), Tailwind CSS v4, Edge Middleware, `@2gis/mapgl`, `pdfkit`, `lucide-react`.
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
- [`docs/specs/SPEC_SEO_URL_ARCHITECTURE.md`](./docs/specs/SPEC_SEO_URL_ARCHITECTURE.md) — ТЗ v1.7 по URL-архитектуре и автоматизации SEO.
- [`docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md`](./docs/specs/SPEC_BOOKING_CALL_REQUESTS_CRM.md) — ТЗ сценария заявок на бронирование и звонки.

---

## 3. Архитектурные правила
1. **Слоистая структура (`app` / `middleware` $\rightarrow$ `components/modules` $\rightarrow$ `components/ui` $\rightarrow$ `lib`)**:
   - Вся бизнес-логика и SEO-расчёты изолированы в `src/lib/`.
2. **SEO-инварианты (ТЗ v1.7)**:
   - RU-версия строго без языкового префикса (`/`). TG — `/tg/`, EN — `/en/`.
   - Реестр 301-алиасов с автоматической ликвидацией цепочек (`A -> C`) и защитой от циклов.
   - Zero Manual SEO для партнёров (в кабинетах партнёров нет ручных SEO-полей).
   - Пакетные аудиты в режиме DRY RUN на фактических данных; тесты 10 000+ записей проводятся в изолированных бенчмарках без добавления фиктивных строк в БД.
3. **Тестирование и сборка**:
   - Перед завершением задачи обязательно выполни:
     ```bash
     npx tsx --test 'src/**/*.test.ts'
     npm run build
     ```
   - Все **187 unit-тестов** должны проходить без ошибок.
