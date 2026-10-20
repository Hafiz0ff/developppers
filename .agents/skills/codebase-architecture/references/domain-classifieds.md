# Domain Reference: Secondary Market (Вторичный рынок) & Classifieds

## 1. Upstream Database Schemas
* `src/db/schema/classifieds.ts` (`classifieds`):
  * Identity & ownership: `id`, `slug`, `userId`.
  * Categorization: `dealType` (`sale`, `rent`), `propertyType` (`apartment`, `house`, `commercial`, `land`).
  * Location: `city`, `cityTg`, `district`, `districtTg`, `landmark`, `lat`, `lng`.
  * Dimensions & Financials: `priceTjs`, `priceUsd`, `area`, `rooms`, `floor`, `totalFloors`, `landArea`, `isNegotiable`.
  * Status & Engagement: `status` (`draft`, `pending`, `active`, `rejected`, `archived`), `viewsCount`, `images`, `features`.
* `src/db/schema/favorites.ts` (`favorites`) & `analytics.ts` (`classified_analytics`).

## 2. Business Logic, DAL & Services
* `src/lib/classifieds/schema.ts`: Zod schema validation for creating/updating listings.
* `src/lib/classifieds/otp.ts`: Phone verification and session tokens with cooldowns.
* `src/lib/classifieds/photos.ts`: Photo uploading, validation, and storage.
* `src/lib/classifieds/filters.ts`: Catalog and map query filtering.
* `src/lib/classifieds/format-utils.ts`: Publication date formatting (`formatPublicationDate`), price per m² formatting (`formatPricePerSquareMeter`).
* `src/lib/entity-metrics.ts`: 24-hour view counting deduplication and client favorites sync.
* `src/lib/geo-utils.ts`: Sughd geographic boundary validation and Yandex Maps routing URLs.

## 3. API Endpoints
* `GET/POST /api/classifieds`: Listing search and publication.
* `GET/PUT/DELETE /api/classifieds/[id]`: Retrieval and management.
* `PATCH /api/classifieds/[id]/status`: Moderation and archive toggle.
* `POST /api/classifieds/otp`: Phone verification code dispatch and validation.
* `POST /api/classifieds/photos`: Multi-image file uploader.

## 4. UI Components & Pages
* `src/app/classifieds/page.tsx`: Catalog page with search bar, filter pills, and grid cards.
* `src/components/classifieds/classifieds-filters.tsx`: Price range, rooms, deal type, city filters.
* `src/components/classifieds/classified-card.tsx`: Responsive card preview with badges and heart toggle.
* `src/app/classifieds/[slug]/page.tsx`:
  * Top breadcrumbs and quick actions (Share, Favorite).
  * Header with deal type badges, negotiable badge, and publication date & views line (`Публикация 15.окт, 11:54 • 👁 36 просмотров`).
  * Two-column desktop layout (`lg:grid-cols-3`):
    * Left column (`lg:col-span-2`): Photo gallery (main large image + square thumbnails underneath), Specifications, Infrastructure, Description, Floor plan, Interactive Leaflet map, Legal safety advice.
    * Right column (`lg:col-span-1 lg:sticky lg:top-20 self-start`):
      1. «Дата публикации и просмотры» card (matching width of price card).
      2. «Стоимость объекта» card (price, price/m², share, favorite, compare).
      3. «Собственник» card (phone reveal, WhatsApp prefilled message).
      4. «Задать вопрос продавцу» card (quick inquiry form submitting to `/api/crm/leads`).

## 5. Associated Tests
* `src/lib/classifieds/schema.test.ts`
* `src/lib/classifieds/otp.test.ts`
* `src/lib/classifieds/filters.test.ts`
* `src/lib/classifieds/format-utils.test.ts`
* `src/lib/classifieds/detail.test.ts`
* `src/lib/entity-metrics.test.ts`
