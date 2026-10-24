# Итоговое техническое задание (ТЗ v1.7 FINAL): URL-архитектура и автоматизация SEO платформы Maskani.tj

> **Статус реализации**: ✅ **100% Реализовано и протестировано** (`src/lib/seo/seo-engine.test.ts`, покрыто всеми 187 тестами платформы).
>
> **Ключевые файлы реализации**:
> - Единый справочник таксономии и категорий: [`src/lib/seo/taxonomy-store.ts`](../../src/lib/seo/taxonomy-store.ts)
> - Единый генератор URL, Breadcrumbs, JSON-LD и canonical: [`src/lib/seo/url-resolver.ts`](../../src/lib/seo/url-resolver.ts)
> - Реестр 301-алиасов с устранением цепочек и защитой от циклов: [`src/lib/seo/url-alias-store.ts`](../../src/lib/seo/url-alias-store.ts)
> - Пакетный процессор DRY RUN и тест масштабируемости 10 000+ записей: [`src/lib/seo/batch-seo-processor.ts`](../../src/lib/seo/batch-seo-processor.ts)
> - Генератор индексных и локализованных карт сайта: [`src/lib/seo/sitemap-generator.ts`](../../src/lib/seo/sitemap-generator.ts)
> - Next.js Middleware для 301-редиректов: [`src/middleware.ts`](../../src/middleware.ts)
> - Robots.txt и Sitemap Routes: [`src/app/robots.ts`](../../src/app/robots.ts), [`src/app/sitemap.ts`](../../src/app/sitemap.ts), [`src/app/sitemap-index.xml/route.ts`](../../src/app/sitemap-index.xml/route.ts)
> - Кабинет Super Admin: Управление категориями и аудит DRY RUN: [`src/app/super-admin/categories/page.tsx`](../../src/app/super-admin/categories/page.tsx)
> - API таксономии и аудита: [`src/app/api/super-admin/categories/route.ts`](../../src/app/api/super-admin/categories/route.ts), [`src/app/api/super-admin/seo/dry-run/route.ts`](../../src/app/api/super-admin/seo/dry-run/route.ts)
> - Тестовый набор (AC-01 .. AC-35): [`src/lib/seo/seo-engine.test.ts`](../../src/lib/seo/seo-engine.test.ts)

---

## 1. Сводка архитектурных решений

| Ключевое решение | Фиксируемое поведение |
| :--- | :--- |
| **Гибкая категория** | При изменении назначенной категории объявления система автоматически пересчитывает URL и связанные SEO-данные. |
| **Языки** | RU — без префикса (`/`); TG — `/tg/`; EN — `/en/`. Запрещено добавлять `/ru/`. |
| **Стабильный ID** | ID объявления не зависит от slug, сохраняется при смене категории и не переиспользуется. |
| **История URL** | Старые адреса сохраняются в таблице алиасов; переезды обрабатываются одним серверным 301 без цепочек (`A -> C`). |
| **Одна модель данных** | URL, canonical, breadcrumb, hreflang, JSON-LD, sitemap и внутренние ссылки строятся из единого источника данных (`url-resolver.ts`). |
| **Управление категориями** | Таксономия и SEO-slug настраиваются в Super Admin; агенты только выбирают разрешённые категории. |
| **SEO-поля партнёров** | C2C клиенты, риэлторы, застройщики и агентства вводят обычные бизнес-данные; H1, meta title/description, URL, canonical, hreflang, JSON-LD и sitemap формируются системой автоматически. |
| **Массовая обработка** | 10 000+ объявлений обрабатываются автоматически через централизованные шаблоны и пакетные задачи; для существующих данных обязателен DRY RUN. Работа с фактическими данными проекта без фиктивных строк в БД. |

---

## 2. Языковая архитектура и Hreflang

- **RU**: `https://maskani.tj/` (без языкового префикса).
- **TG**: `https://maskani.tj/tg/`
- **EN**: `https://maskani.tj/en/`
- Каждая языковая версия имеет собственный `self-canonical`.
- `hreflang` взаимный (reciprocal): `ru`, `tg`, `en` и `x-default` (указывает на русскую версию как дефолтную).

---

## 3. Таблица URL-паттернов

- Главная: `/` (TG: `/tg/`, EN: `/en/`)
- Хаб города: `/{city}/`
- Хаб сделки: `/{city}/{deal-slug}/` (например, `/dushanbe/arenda/`)
- Категория квартир в аренде: `/{city}/arenda/kvartiry/`
- Вторичный рынок квартир: `/{city}/kupit/vtorichka/`
- Категория новостроек: `/{city}/kupit/novostroyki/`
- Дома/Ҳавлӣ: `/{city}/kupit/doma/`
- Районная категория: `/{city}/{deal-slug}/{cat-slug}/{district-slug}/`
- Карточка объявления: `/{city}/{deal-slug}/{cat-slug}/[{district-slug}/]{title-slug}-{listing_id}`
- Карточка лота в ЖК: `/{city}/kupit/novostroyki/{complex-slug}/{title-slug}-{listing_id}`

---

## 4. Кабинеты партнёров и Zero Manual SEO

Партнёры (C2C, застройщики, риэлторы, агентства) не являются SEO-специалистами. В личных кабинетах отсутствуют технические поля:
- Нет полей «URL-slug», «H1», «Meta Title», «Meta Description», «canonical», «hreflang», «JSON-LD».
- Партнёр вводит факты объекта (комнаты, площадь, этаж, адрес, цену, фото, контакты) и выбирает категорию из утверждённого списка Super Admin.
- Система автоматически формирует все SEO-данные и JSON-LD.

---

## 5. Super Admin: Управление таксономией и DRY RUN аудит

В панели управления `/super-admin/categories`:
- Список категорий с кодом, отображаемыми именами (RU/TG/EN), SEO-slug (RU/TG/EN), режимом (`AUTO` vs `MANUAL`), статусом `indexable` allowlist.
- В режиме `MANUAL`: изменение названий не меняет URL.
- В режиме `AUTO`: изменение названий предлагает новый slug.
- При изменении slug опубликованной категории система рассчитывает предварительный просмотр (Preview), показывая количество затронутых объявлений и redirect plan (старые -> новые URL), и требует подтверждения миграции.
- Кнопка «Запустить DRY RUN» проводит пакетный аудит фактических объявлений каталога без записи в БД, проверяя коллизии и генерируя карту редиректов.
- Изолированный тест масштабируемости доказывает обработку 10 000+ синтетических записей в оперативной памяти тестовой среды менее чем за 100 мс.
