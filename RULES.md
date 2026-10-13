# Project Coding Rules & Standards

## Stack & Tech
- Framework: Next.js 14+ / 16 (App Router, Server Components by default)
- Language: TypeScript (Strict mode enabled, NO `any`)
- Database: PostgreSQL + Drizzle ORM
- Styling: Tailwind CSS + Shadcn UI
- Form Handling: React Hook Form + Zod validation

## Naming Conventions
- Components: PascalCase (`DeveloperCard.tsx`, `PropertyFilter.tsx`)
- DB Tables/Columns: snake_case (`developers`, `project_units`, `created_at`)
- Utilities & Hooks: camelCase (`useFilter.ts`, `formatPrice.ts`)
- Routes: kebab-case (`app/(public)/developers/[slug]/page.tsx`)

## Architecture Principles
1. Multi-Tenancy: Every Developer/Builder is scoped by `developer_id` or `slug`.
2. Public vs Private: Classifieds and Developers share UI components, but have separated backend access roles.
3. Performance: All images MUST use `next/image` with WebP/AVIF formats.
