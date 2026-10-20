# Domain Reference: New Buildings & Complexes (Новостройки)

## 1. Upstream Database Schemas
* `src/db/schema/developers.ts` (`developers`, `developer_members`)
* `src/db/schema/projects.ts` (`projects`): Contains fields for title, titleTg, address, landmark, coordinates, completionYear, completionQuarter, minPricePerMeterTjs, minPricePerMeterUsd, installmentMonths, installmentDownPaymentPercent, parking/storage/documents JSON configs.
* `src/db/schema/units.ts` (`units`): Individual apartments, floor, entrance, number, rooms, area, priceTjs, priceUsd, status (`available`, `reserved`, `sold`).

## 2. Business Logic & DAL
* `src/lib/catalog-data.ts`: Mock and production project catalog loader (`CATALOG_PROPERTIES`, `getPropertyById`).
* `src/lib/parking-storage.ts`: Types and helper utilities for parking spaces and storage rooms.
* `src/lib/documents.ts`: Validation, file sizing (`formatFileSize`), date formatting (`formatDocumentDate`).
* `src/lib/pricing/new-building-price.ts`: Calculation and formatting of price per m² with localized separators.
* `src/lib/project-analytics.ts`: 30-day views and favorites tracking.

## 3. Presentation & Components
* `src/app/projects/[slug]/page.tsx`:
  * Header with DeveloperAvatar, Project Title, Address, MapPin.
  * `ProjectEngagementHeaderPill` (`src/components/modules/project-engagement-pills.tsx`): Unified card containing views and favorites.
  * `NewBuildingPriceBlock` (`src/components/modules/new-building-price-block.tsx`): Total price range & price/m².
  * `ProjectVisualShowcase` (`src/components/modules/project-visual-showcase.tsx`): 6D navigator (General, Layout, Window View, Sun Track, Chessboard).
  * `ProjectDealBuilderBlock` (`src/components/modules/projects/project-deal-builder-block.tsx`): Interactive installment calculator & lead booking trigger.
  * `ProjectParkingSection` (`src/components/modules/projects/project-parking-section.tsx`): Bottom-aligned 3 photos with advantage bullets; action button under 3rd photo.
  * `ProjectStorageSection` (`src/components/modules/projects/project-storage-section.tsx`): Bottom-aligned photos with 4 advantage cards; action button under 3rd photo.
  * `ProjectDocumentsSection` (`src/components/modules/projects/project-documents-section.tsx`): Legal documents grid with 75% «Открыть PDF» and 25% «Скачать» buttons.
  * `LeadRequestDrawer` (`src/components/modules/projects/lead-request-drawer.tsx`): Booking and callback drawer form submitting to `/api/crm/lead-booking`.

## 4. Associated Tests
* `src/lib/pricing/new-building-price.test.ts`
* `src/lib/parking-storage.test.ts`
* `src/lib/documents.test.ts`
* `src/lib/project-analytics.test.ts`
* `src/lib/crm-booking.test.ts`
* `src/db/db-schema.test.ts`
