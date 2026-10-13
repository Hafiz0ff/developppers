# Project Memory & Context

## Project Goals
Building a combined Real Estate Marketplace for Sughd Province (Khujand) merging primary developer showcases with a C2C secondary market classifieds section.

## Key Decisions Made
- Tech Stack: Next.js App Router + TypeScript + Tailwind + Drizzle + Postgres.
- Region First: Focus exclusively on Sughd initially to build user base before expanding to Dushanbe.
- AI Executor: Antigravity (Gemini 3.8 Flash), Claude, and Codex handling core implementation code.
- Auth System: Better Auth with Drizzle PostgreSQL adapter and role-based access (SUPER_ADMIN, DEVELOPER_ADMIN, CITIZEN).
- Dual Currency: Real-time TJS (сомони) and USD calculation with automatic formatting.

## Current State
Phase 1 Foundation & Database schema completed with full TypeScript definitions, generated PostgreSQL DDL migrations, and initial seed data.
