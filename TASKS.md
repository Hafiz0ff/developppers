# Tasks & Roadmap

## Phase 1: Foundation & Database Setup ⏳
- [x] Initialize Next.js project with Tailwind & Shadcn UI
- [x] Setup PostgreSQL schema via Drizzle ORM
- [x] Implement Auth (Superadmin, Developer, Citizen)
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
- [ ] Free ad posting form for citizens
- [ ] Image upload via Cloudinary/S3
- [ ] Public search & filter (Price, Rooms, Area, District)

## Phase 4: Integrations & Polishing 🚀
- [ ] Instant Telegram lead notifications to Developers
- [ ] Interactive Map (Khujand & Sughd coordinates)
- [ ] SEO optimization & Mobile responsive check
