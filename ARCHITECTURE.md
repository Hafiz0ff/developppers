# System Architecture — Sogd Realty

## Core Concepts
- **Multi-Tenant Portal**: Platform hosting multiple Real Estate Developers (Застройщики) alongside a Citizen Classifieds (Вторичка) section.
- **Geographic Focus**: Primary launch region — Sughd Province (Khujand, Buston, B. Gafurov, Isfara, Istaravshan), scalability across Tajikistan.
- **B2B CRM & Open API**: Built-in mini-CRM for private realtors/brokers with lead analytics, plus Open API integration for established agencies with their own CRM systems (AmoCRM, Bitrix24, 1C).

## Directory Structure
```
├── src/app/
│   ├── (auth)/             # Login / Register (Better Auth)
│   ├── (public)/           # Public Portal (Main, Developers Catalog, Classifieds)
│   ├── projects/[slug]/    # Complex Showcase & Buyer Chessboard
│   ├── developer-admin/    # Builder Backoffice (Manage Projects, Units, Chessboards)
│   ├── profile/analytics/  # B2B CRM & Broker Analytics (KPIs, Charts, API Keys, Excel export)
│   └── api/                # REST / Webhook endpoints
│       ├── auth/           # Better Auth endpoints
│       └── v1/external/    # Open API for external CRMs (analytics & auto-feed import)
├── src/db/                 # Drizzle ORM schema, migrations, seeds
│   ├── schema/
│   │   ├── auth.ts         # Users, Sessions, Accounts
│   │   ├── developers.ts   # Construction Companies & Members
│   │   ├── projects.ts     # Residential Complexes (ЖК)
│   │   ├── units.ts        # Apartments & Commercial Spaces
│   │   ├── classifieds.ts  # Secondary Market Ads
│   │   ├── analytics.ts    # Classified Analytics (views, phones, whatsapp, chats)
│   │   ├── api-keys.ts     # CRM Open API authentication keys
│   │   └── relations.ts    # Relational definitions
├── src/components/
│   ├── ui/                 # Shadcn atomic UI components
│   ├── layout/             # Header, Navigation, Footer
│   └── modules/            # Developer-specific / Chessboard components
└── src/lib/                # Utils, Constants, Helpers
```

## User Roles & Access
1. **SUPER_ADMIN**: Full access, moderates classifieds and approves developers.
2. **DEVELOPER_ADMIN**: Access only to their company's projects, units, and leads.
3. **REALTOR / BROKER**: Access to built-in CRM analytics (`/profile/analytics`), lead statistics, CSV exports, and API keys.
4. **CITIZEN**: Can post free secondary market ads and manage favorites.

## B2B CRM & Open API Architecture

### 1. Database Schema
- **`classified_analytics`**: Daily snapshot metrics per listing:
  - `classified_id` (FK -> `classifieds`)
  - `date` (`YYYY-MM-DD` for chronological rollups)
  - `views_count` (page hits)
  - `phone_views_count` (phone number reveal clicks)
  - `whatsapp_clicks` (direct WhatsApp inquiries)
  - `chat_initiations` (in-portal web chats)
  - `favorites_count` (saved to favorites)
- **`api_keys`**: Token-based CRM access:
  - `user_id` (FK -> `user`)
  - `key` (`sr_live_...`)
  - `permissions` (`["read_analytics", "auto_import_feed"]`)
  - `is_active`, `last_used_at`

### 2. External REST Endpoints (`/api/v1/external/`)
- `GET /api/v1/external/analytics`:
  - Auth: `Authorization: Bearer <API_KEY>` or `X-API-Key: <API_KEY>`
  - Params: `?period=today|7d|30d|all`, `&classified_id=<id>`
  - Output: Aggregated summary, channel breakdown (% phone vs WhatsApp vs chat), daily breakdown, per-listing conversion metrics.
- `POST /api/v1/external/feed/import`:
  - Batch import / synchronization of property listings from external CRMs (AmoCRM, Bitrix24, 1C, custom feeds) directly into Sogd Realty without manual data entry.
