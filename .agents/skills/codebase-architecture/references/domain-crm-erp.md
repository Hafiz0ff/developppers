# Domain Reference: B2B CRM & Developer ERP

## 1. Upstream Database Schemas
* `src/db/schema/crm.ts`:
  * `crm_leads`: `id`, `agentId`, `clientName`, `clientPhone`, `classifiedId`, `classifiedTitle`, `status` (`new`, `contacted`, `showing`, `deal`, `closed`), `budget`, `commission`, `commissionPercent`, `source` (`phone_click`, `whatsapp_click`, `lead_form`, `booking_request`, `callback_request`), `notes`.
  * `crm_collections`: `id`, `shareCode`, `agentId`, `agentName`, `agentPhone`, `title`, `notes`, `propertyIds` (JSON array of property IDs), `viewsCount`.
* `src/db/schema/developers.ts` (`developers`, `developer_members`).
* `src/db/schema/audit-logs.ts` (`audit_logs`): Action logging with actor ID, IP address, and sanitized payloads.

## 2. Business Logic, DAL & Services
* `src/lib/crm-booking-store.ts`: In-memory and persistent storage for booking requests and developer CRM settings.
* `src/lib/crm-collections-store.ts`: Agent selection builder and share link generator (`/p/[share_code]`).
* `src/lib/telegram.ts`: Telegram bot integration for real-time manager alerts upon lead or booking creation.
* `src/lib/audit-logger.ts`: Redaction of secrets and recording of administrative events.

## 3. API Endpoints
* `POST /api/crm/leads`: Ingestion of contact clicks and inquiry submissions.
* `POST /api/crm/lead-booking`: Interactive booking and instant callback submissions with auto-notification.
* `GET/POST /api/crm/collections`: Broker collection creation and listing.
* `GET /api/crm/collections/[shareCode]`: Public collection loader.
* `GET/POST /api/developer/crm-settings`: Developer booking schedule and manager notification settings.
* `GET /api/erp`: External ERP data synchronization endpoint.

## 4. UI Components & Pages
* `src/app/developer-admin/`:
  * `page.tsx`: Developer dashboard overview with metrics.
  * `developer-crm-booking-settings.tsx`: Working hours, manager phone numbers, notification toggles.
  * `project-documents-manager.tsx`, `project-parking-storage-manager.tsx`.
* `src/app/profile/crm/page.tsx`: Agent personal CRM Kanban board and lead table.
* `src/app/p/[share_code]/page.tsx`: Public client collection landing page.
* `src/app/erp/`: Construction ERP executive interactive portal.

## 5. Associated Tests
* `src/lib/crm.test.ts`
* `src/lib/crm-booking.test.ts`
* `src/lib/crm-collections-store.test.ts`
* `src/lib/audit-logger.test.ts`
