# Codebase Architecture & Dependency Chain Rules for Maskani.tj (Sogd Realty)

You are an expert full-stack engineer and software architect working on **Maskani.tj / Sogd Realty**.
Follow these mandatory architecture rules at all times:

## 1. Complete Dependency Chain Rule (Never Edit in Isolation)
When any user request mentions or touches a file, component, endpoint, or feature:
- **Do not treat any file as isolated.**
- Always examine the full architectural flow:
  `Database Schema (src/db/schema) ➔ Domain Logic & Stores (src/lib) ➔ API Routes (src/app/api) ➔ Context/Hooks (src/context, src/hooks) ➔ UI Modules (src/components) ➔ Page Views (src/app)`
- Trace **Upstream Dependencies** (what this file relies on) and **Downstream Consumers** (what pages or components will be impacted).
- Use the built-in dependency tracer:
  ```bash
  npm run arch:trace <keyword_or_filename>
  ```
- Refer to the system map in [`ARCHITECTURE.md`](file:///Users/hafizov/Developers/sogd-realty/ARCHITECTURE.md) and the `.agents/skills/codebase-architecture/` skill.

## 2. Cross-Cutting Contracts
- **Bilingual Localization (`ru` & `tg`)**: Always use `tDual(ruText, tgText)` from `useLanguage()`. Never render unlocalized user-facing strings.
- **Dual Currency (`TJS` & `USD`)**: Always support both currencies. Use `formatPrice(priceTjs, priceUsd)` from `useCurrency()`.
- **Geographic Precision**: Follow Sughd regions, districts, and coordinates defined in `src/lib/constants/locations.ts`.
- **Responsive Layout Integrity**: Ensure desktop sticky elements (e.g. `lg:sticky lg:top-20 self-start`) and mobile breakpoints behave cleanly without overflow.

## 3. Verification Protocol
After making any code changes:
- Run the test suite: `npm test`
- Run the production build: `npm run build`
- Ensure zero TypeScript or linting regressions.

## 4. Vibe Coding Methodology (roboco-io/awesome-vibecoding)
- Follow the **Vibe Development Lifecycle (VDLC)**: Intent & Spec ➔ Architectural Dependency Trace ➔ Staged Atomic Edits ➔ Verification Gates (`npm test` & `npm run build`) ➔ Git Checkpoint.
- Reference curated tools, workflows and guides in [`docs/awesome-vibecoding/`](file:///Users/hafizov/Developers/sogd-realty/docs/awesome-vibecoding/README.md) and skill [`.agents/skills/vibe-coding/SKILL.md`](file:///Users/hafizov/Developers/sogd-realty/.agents/skills/vibe-coding/SKILL.md).
