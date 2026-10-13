# System Architecture

## Core Concepts
- **Multi-Tenant Portal**: Platform hosting multiple Real Estate Developers (Застройщики) alongside a Citizen Classifieds (Вторичка) section.
- **Geographic Focus**: Primary launch region — Sughd Province (Khujand, Buston, B. Gafurov), scalability to Dushanbe.

## Directory Structure
```
├── app/
│   ├── (auth)/             # Login / Register
│   ├── (public)/           # Public Portal (Main, Developers Catalog, Classifieds)
│   ├── (developer-admin)/  # Builder Backoffice (Manage Projects, Units, Chessboards)
│   ├── (admin)/            # Superadmin Backoffice (Moderation, Payments)
│   └── api/                # REST / Webhook endpoints (Telegram, Storage)
├── db/                     # Drizzle schema, migrations, seeds
├── components/
│   ├── ui/                 # Shadcn atomic UI components
│   ├── shared/             # Cards, Headers, Filters
│   └── modules/            # Developer-specific / Chessboard components
├── lib/                    # Utils, Constants, Helpers
└── public/                 # Static assets
```

## User Roles & Access
1. **SUPER_ADMIN**: Full access, moderates classifieds and approves developers.
2. **DEVELOPER_ADMIN**: Access only to their company's projects, units, and leads.
3. **CITIZEN**: Can post free secondary market ads.
