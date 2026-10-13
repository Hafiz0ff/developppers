# Tasks & Roadmap — Sogd Realty

## Phase 1: Foundation & Database Setup ⏳
- [x] Initialize Next.js project with Tailwind & Shadcn UI
- [x] Setup PostgreSQL schema via Drizzle ORM
- [x] Implement Auth (Superadmin, Developer, Citizen, Realtor)
- [x] Create base layout & navigation

## Phase 2: Developer Backoffice & Catalog 🎯
- [x] Protected Developer Backoffice layout (`/developer-admin`)
- [x] Developer profile management (`/developer-admin/profile` — logo, cover, contacts, Khujand address)
- [x] Complex / Project creation & editing (`/developer-admin/projects/new`, `/projects/[id]/edit`)
- [x] Interactive Unit Chessboard component with 2 modes (visual grid + filter list) and status toggling (`/components/modules/chessboard.tsx`)
- [x] Backoffice unit management page (`/developer-admin/projects/[id]/units`)
- [x] Public Developer showcase page (`/developers/[slug]`)
- [x] Public Complex showcase page with buyer chessboard (`/projects/[slug]`)
- [x] Public Demo Deployment on Vercel + Supabase (`https://sogd-realty.vercel.app`)
- [x] Cloud Database Seeding (`pnpm db:seed`) with 108 units, projects, and developers

## Phase 3: Secondary Market (Classifieds) 📦
- [x] Classified schema with communications, area, and multi-currency (USD/TJS)
- [x] Showcase on main page (`/` — apartments, houses/havli, commercial)
- [ ] Free ad posting form for citizens

## Phase 4: B2B CRM & Broker Analytics Module 💼
- [x] Database schema for listing analytics (`classified_analytics`: views, phone clicks, WhatsApp, chats, favorites, date)
- [x] API keys schema for CRM integrations (`api_keys`: token hash, permissions, status)
- [x] Realtor/Broker Analytics Dashboard (`/profile/analytics`):
  - [x] Key performance indicator cards (Views, Leads, WhatsApp, Calls, Favorites, Conversion CTR)
  - [x] Interactive timeline chart for daily traffic and leads
  - [x] Channel breakdown (WhatsApp vs Phone vs Web Chat)
  - [x] Date filters: `Сегодня`, `7 дней`, `30 дней`, `За всё время`
  - [x] Instant Excel / CSV export with UTF-8 BOM encoding
  - [x] Property performance table with conversion rates
  - [x] API key generator, copy button, and cURL documentation
- [x] REST API endpoints (`/api/v1/external/`):
  - [x] `GET /api/v1/external/analytics` — aggregated metrics, channel shares, daily breakdown
  - [x] `POST /api/v1/external/feed/import` — batch property import from external CRMs

## Phase 5: UI/UX & WebGL Shaders 🚀
- [x] Lightweight WebGL/Canvas shader effects (`/components/ui/shader-background.tsx` with `aurora`, `gradient-mesh`, `light-leak`)
- [x] Battery & Mobile optimization (`IntersectionObserver` pause, DPR 1.5 clamp, Tailwind fallback)
- [x] Hero search living shader (`/`) and luxury complex ambient light leak (`/projects/[slug]`)
- [x] Sans-serif typography standard (Inter / Apple System) and typography polish
- [x] Fallback avatar for developer logos (`DeveloperAvatar`)
