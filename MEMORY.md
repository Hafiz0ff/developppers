# Project Memory & Context

## Project Goals
Building a combined Real Estate Marketplace for Sughd Province (Khujand) merging primary developer showcases with a C2C secondary market classifieds section.

## Key Decisions Made
- **Tech Stack**: Next.js App Router + TypeScript + Tailwind + Drizzle + Postgres.
- **Region First**: Focus exclusively on Sughd initially (Khujand, B. Gafurov, Buston, Isfara, Istaravshan, Konibodom) to build market dominance before expanding to Dushanbe.
- **AI Executors**: Antigravity (Gemini 3.8 Flash), Claude, and Codex handling core implementation code.
- **Auth System**: Better Auth with Drizzle PostgreSQL adapter and role-based access (`SUPER_ADMIN`, `DEVELOPER_ADMIN`, `CITIZEN`).
- **Dual Currency**: Real-time TJS (сомони) and USD calculation with automatic formatting across all cards, tables, and chessboards.
- **Unit Chessboard Architecture**: Two distinct viewing modes (Visual Grid by Floor $\times$ Section and Parameter Filter Table), color-coded statuses (`available` emerald, `reserved` amber, `sold` slate), buyer WhatsApp lead generator, and developer backoffice instant status switching.

## Current State
- **Phase 1 (Foundation & Database Setup)**: Completed.
- **Phase 2 (Developer Backoffice & Chessboard)**: Completed. Includes `/developer-admin`, profile management, project creation/editing, interactive chessboard, `/developers/[slug]`, and `/projects/[slug]`. Production build passes cleanly with 0 TypeScript errors.
- **Phase 3 (Secondary Market / Classifieds)**: Next up.
