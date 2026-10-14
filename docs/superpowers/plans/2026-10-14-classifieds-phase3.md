# Phase 3 Classifieds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Живой вторичный рынок: гражданин подаёт объявление с фото с устройства, видит его на витрине и карточке, управляет в `/profile/ads`; затем модерация, лимит и подтверждение телефона.

**Architecture:** Чистые функции (Zod, доступ, фильтры, slug) в `src/lib/classifieds/*` с `node:test`. Route handlers вызывают их и Drizzle. UI — мастер, каталог, карточка, кабинет. Фото через `POST /api/classifieds/photos` (Supabase Storage или локальный `public/classified-photos` если нет ключей). Заход 1 автоодобряет в `active`; заход 2 оставляет `pending`.

**Tech Stack:** Next.js App Router, Drizzle, Zod 4, Better Auth, Supabase Storage, Shadcn, `tsx --test`.

**Spec:** `docs/superpowers/specs/2026-10-14-classifieds-phase3-design.md`

---

## File map

Create:

- `src/lib/classifieds/schema.ts` — Zod payload
- `src/lib/classifieds/schema.test.ts`
- `src/lib/classifieds/access.ts` — роли и владелец
- `src/lib/classifieds/access.test.ts`
- `src/lib/classifieds/filters.ts` — витрина только active + query
- `src/lib/classifieds/filters.test.ts`
- `src/lib/classifieds/slug.ts`
- `src/lib/classifieds/slug.test.ts`
- `src/lib/classifieds/map-card.ts` — строка БД → карточка UI
- `src/lib/classifieds/session.ts` — actor из Better Auth
- `src/lib/classifieds/photos.ts` — сохранение файлов
- `src/app/api/classifieds/route.ts`
- `src/app/api/classifieds/[id]/route.ts`
- `src/app/api/classifieds/[id]/status/route.ts`
- `src/app/api/classifieds/photos/route.ts`
- `src/components/classifieds/classified-card.tsx`
- `src/components/classifieds/photo-uploader.tsx`
- `src/components/classifieds/classified-wizard.tsx`
- `src/app/classifieds/page.tsx`
- `src/app/classifieds/[slug]/page.tsx`
- `src/app/classifieds/new/page.tsx`
- `src/app/classifieds/[slug]/edit/page.tsx`
- `src/app/profile/ads/page.tsx`
- `src/app/admin/classifieds/page.tsx` (заход 2)
- `src/lib/classifieds/rate-limit.ts` (заход 2)
- `src/lib/classifieds/otp.ts` (заход 2)

Modify:

- `package.json` — скрипт `test`
- `src/lib/auth.ts` — если `role` не попадает в session, оставить fallback чтением `users`
- `src/components/layout/header.tsx`
- `src/app/page.tsx`
- `src/app/profile/crm/page.tsx`
- `src/app/api/crm/collections/[shareCode]/route.ts` — properties из classifieds
- `src/lib/catalog-data.ts` — тонкая обёртка или удалить использование на витрине
- `TASKS.md`, `MEMORY.md`
- `.env.example` — ключи Storage

Do not restructure unrelated CRM/leads code.

---

### Task 1: Zod-схема объявления

**Files:**
- Create: `src/lib/classifieds/schema.ts`
- Test: `src/lib/classifieds/schema.test.ts`
- Modify: `package.json` (скрипт test)

- [ ] **Step 1: Добавить npm-скрипт test**

В `package.json` scripts:

```json
"test": "tsx --test src/**/*.test.ts"
```

- [ ] **Step 2: Написать падающий тест**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { classifiedInputSchema } from "./schema";

test("rejects classified without required fields", () => {
  const result = classifiedInputSchema.safeParse({
    title: "",
    photos: [],
  });
  assert.equal(result.success, false);
});

test("accepts a minimal apartment sale", () => {
  const result = classifiedInputSchema.safeParse({
    title: "3-комнатная в 18 мкр",
    description: "Светлая квартира с евроремонтом и документами.",
    dealType: "sale",
    propertyType: "apartment",
    city: "khujand",
    address: "18 мкр, дом 15",
    roomsCount: 3,
    totalArea: 76,
    priceTjs: 536550,
    priceUsd: 49000,
    originalCurrency: "USD",
    contactName: "Дилшод",
    contactPhone: "+992929994321",
    photos: ["https://example.com/a.jpg"],
  });
  assert.equal(result.success, true);
});
```

- [ ] **Step 3: Запустить тест — должен упасть**

Run: `pnpm exec tsx --test src/lib/classifieds/schema.test.ts`  
Expected: FAIL `classifiedInputSchema` is not defined (нужны `all` permissions из‑за IPC tsx).

- [ ] **Step 4: Реализовать схему**

```ts
import { z } from "zod";

export const classifiedInputSchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(20).max(5000),
  dealType: z.enum(["sale", "rent_long", "rent_daily"]),
  propertyType: z.enum(["apartment", "house", "commercial", "land", "garage"]),
  city: z.enum([
    "khujand",
    "gafurov",
    "guliston",
    "buston",
    "isfara",
    "istaravshan",
    "konibodom",
    "panjakent",
    "spitamen",
    "zafarobod",
    "rasulov",
    "mastchoh",
    "asht",
    "shahriston",
    "ayni",
    "devashtich",
    "kuhistoni_mastchoh",
  ]),
  district: z.string().trim().max(80).optional(),
  address: z.string().trim().min(4).max(160),
  landmark: z.string().trim().max(120).optional(),
  roomsCount: z.number().int().min(0).max(20).nullable().optional(),
  totalArea: z.number().positive(),
  livingArea: z.number().positive().nullable().optional(),
  kitchenArea: z.number().positive().nullable().optional(),
  landAreaSotka: z.number().positive().nullable().optional(),
  floor: z.number().int().min(0).max(50).nullable().optional(),
  floorsCount: z.number().int().min(1).max(50).nullable().optional(),
  buildingType: z.string().max(40).nullable().optional(),
  renovation: z.string().max(40).nullable().optional(),
  hasCityWater: z.boolean().default(true),
  hasWaterHauz: z.boolean().default(false),
  hasElectricity: z.boolean().default(true),
  hasHeating: z.boolean().default(false),
  hasSewerage: z.boolean().default(true),
  isFurnished: z.boolean().default(false),
  originalCurrency: z.enum(["TJS", "USD"]),
  priceTjs: z.number().nonnegative(),
  priceUsd: z.number().nonnegative(),
  isNegotiable: z.boolean().default(false),
  exchangePossible: z.boolean().default(false),
  contactName: z.string().trim().min(2).max(80),
  contactPhone: z.string().trim().min(9).max(24),
  contactPhoneSecondary: z.string().trim().max(24).nullable().optional(),
  contactWhatsapp: z.string().trim().max(24).nullable().optional(),
  contactTelegram: z.string().trim().max(64).nullable().optional(),
  photos: z.array(z.string().url()).min(1).max(10),
});

export type ClassifiedInput = z.infer<typeof classifiedInputSchema>;
```

- [ ] **Step 5: Запустить тесты — должны пройти**

Run: `pnpm exec tsx --test src/lib/classifieds/schema.test.ts`  
Expected: 2 pass

- [ ] **Step 6: Commit**

```bash
git add package.json src/lib/classifieds/schema.ts src/lib/classifieds/schema.test.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): add Zod schema for citizen ads

EOF
)"
```

---

### Task 2: Доступ по роли и владельцу

**Files:**
- Create: `src/lib/classifieds/access.ts`
- Test: `src/lib/classifieds/access.test.ts`

- [ ] **Step 1: Падающий тест**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canPostClassified,
  canMutateClassified,
  canModerateClassifieds,
} from "./access";

test("only role user can post", () => {
  assert.equal(canPostClassified("user"), true);
  assert.equal(canPostClassified("realtor"), false);
  assert.equal(canPostClassified("developer"), false);
  assert.equal(canPostClassified("admin"), false);
  assert.equal(canPostClassified(undefined), false);
});

test("owner can mutate, stranger cannot", () => {
  assert.equal(canMutateClassified({ actorId: "u1", actorRole: "user", ownerId: "u1" }), true);
  assert.equal(canMutateClassified({ actorId: "u2", actorRole: "user", ownerId: "u1" }), false);
  assert.equal(canMutateClassified({ actorId: "a1", actorRole: "admin", ownerId: "u1" }), false);
});

test("only admin can moderate", () => {
  assert.equal(canModerateClassifieds("admin"), true);
  assert.equal(canModerateClassifieds("user"), false);
});
```

- [ ] **Step 2: Запустить — FAIL**

Run: `pnpm exec tsx --test src/lib/classifieds/access.test.ts`

- [ ] **Step 3: Реализация**

```ts
export type PortalRole = "user" | "realtor" | "developer" | "admin";

export function canPostClassified(role: string | undefined): boolean {
  return role === "user";
}

export function canMutateClassified(args: {
  actorId: string | undefined;
  actorRole: string | undefined;
  ownerId: string;
}): boolean {
  if (!args.actorId) return false;
  if (args.actorRole !== "user") return false;
  return args.actorId === args.ownerId;
}

export function canModerateClassifieds(role: string | undefined): boolean {
  return role === "admin";
}

export function isPubliclyListed(status: string): boolean {
  return status === "active";
}
```

- [ ] **Step 4: Тесты PASS**

Run: `pnpm exec tsx --test src/lib/classifieds/access.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/classifieds/access.ts src/lib/classifieds/access.test.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): encode citizen-only posting rules

EOF
)"
```

---

### Task 3: Фильтры витрины и slug

**Files:**
- Create: `src/lib/classifieds/filters.ts`
- Create: `src/lib/classifieds/filters.test.ts`
- Create: `src/lib/classifieds/slug.ts`
- Create: `src/lib/classifieds/slug.test.ts`

- [ ] **Step 1: Тесты фильтров и slug**

```ts
// filters.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { filterPublicClassifieds, parseClassifiedListQuery } from "./filters";

const rows = [
  { id: "a", status: "active", city: "khujand", propertyType: "apartment", dealType: "sale", roomsCount: 3, priceUsd: 49000, title: "18 мкр" },
  { id: "p", status: "pending", city: "khujand", propertyType: "apartment", dealType: "sale", roomsCount: 2, priceUsd: 38000, title: "скрыто" },
  { id: "x", status: "archived", city: "gafurov", propertyType: "house", dealType: "sale", roomsCount: 5, priceUsd: 65000, title: "хавли" },
  { id: "h", status: "active", city: "gafurov", propertyType: "house", dealType: "sale", roomsCount: 5, priceUsd: 65000, title: "дом Унчи" },
];

test("public list hides pending and archived", () => {
  const q = parseClassifiedListQuery({});
  const listed = filterPublicClassifieds(rows, q);
  assert.deepEqual(listed.map((r) => r.id), ["a", "h"]);
});

test("city and rooms filters apply on top of active", () => {
  const q = parseClassifiedListQuery({ city: "khujand", rooms: "3" });
  assert.deepEqual(filterPublicClassifieds(rows, q).map((r) => r.id), ["a"]);
});
```

```ts
// slug.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { makeClassifiedSlug } from "./slug";

test("builds unique url-safe slug", () => {
  const slug = makeClassifiedSlug("3-комнатная квартира, 18 мкр!", "id_abc123xyz");
  assert.match(slug, /18-mkr|komnatnaya|kvartira/i);
  assert.ok(slug.endsWith("abc123xyz") || slug.includes("abc123"));
  assert.equal(slug.includes(" "), false);
});
```

- [ ] **Step 2: Запустить — FAIL**

- [ ] **Step 3: Реализация**

`parseClassifiedListQuery` читает Record<string, string | undefined>: `city`, `propertyType`, `dealType`, `rooms`, `priceMin`, `priceMax`, `q`.  
`filterPublicClassifieds`: сначала `status === "active"`, затем совпадения. `rooms === "4+"` → roomsCount >= 4. Цены по `priceUsd`. `q` — title/district lowercase includes.

`makeClassifiedSlug(title, id)`: транслит ru→lat минимальный (к→k, х→h, …), lower, небуквы в `-`, схлопнуть `--`, взять 60 символов + `-` + последние 8 id.

- [ ] **Step 4: PASS оба файла тестов**

Run: `pnpm exec tsx --test src/lib/classifieds/filters.test.ts src/lib/classifieds/slug.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/classifieds/filters.ts src/lib/classifieds/filters.test.ts src/lib/classifieds/slug.ts src/lib/classifieds/slug.test.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): filter active listings and build slugs

EOF
)"
```

---

### Task 4: Session actor + маппинг карточки

**Files:**
- Create: `src/lib/classifieds/session.ts`
- Create: `src/lib/classifieds/map-card.ts`

- [ ] **Step 1: `map-card.ts`**

Числовые drizzle-поля приходят строками. Нормализовать:

```ts
export function toNumber(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function firstPhoto(photos: string[] | null | undefined): string {
  return photos?.[0] || "/images/hero-bg.png";
}
```

Экспорт типа `ClassifiedCard` с полями, которые уже ждут `page.tsx` / CRM: `id`, `slug`, `title`, `dealTypeLabel`, `propertyTypeLabel`, `cityLabel`, `district`, `landmark`, `rooms`, `area`, `floor`, `priceTjs`, `priceUsd`, `phone`, `whatsapp`, `isNegotiable`, `image`, `photos`, `description`, `status`, `viewsCount`, `userId`.

Лейблы: sale→«Продажа», rent_long/rent_daily→«Аренда», apartment→«Квартира», house→«Дом / Ҳавлӣ», и т.д. Город — `SOGD_CITIES`.

- [ ] **Step 2: `session.ts`**

```ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getClassifiedsActor() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;
  const roleFromSession = (session.user as { role?: string }).role;
  if (roleFromSession) {
    return { id: session.user.id, role: roleFromSession, name: session.user.name ?? "" };
  }
  const rows = await db
    .select({ id: users.id, role: users.role, name: users.name })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const row = rows[0];
  if (!row) return { id: session.user.id, role: "user", name: session.user.name ?? "" };
  return { id: row.id, role: row.role, name: row.name };
}
```

Нет unit-теста на session (нужен Next headers). Не мокать auth.

- [ ] **Step 3: Commit**

```bash
git add src/lib/classifieds/session.ts src/lib/classifieds/map-card.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): map DB rows and resolve listing actor

EOF
)"
```

---

### Task 5: GET/POST `/api/classifieds`

**Files:**
- Create: `src/app/api/classifieds/route.ts`

- [ ] **Step 1: Тест автоодобрения как чистой функции**

Добавить в `src/lib/classifieds/access.ts`:

```ts
export function initialClassifiedStatus(opts: { autoApprove: boolean }): "pending" | "active" {
  return opts.autoApprove ? "active" : "pending";
}
```

Тест в `access.test.ts`: заход 1 `autoApprove: true` → `active`; false → `pending`.

- [ ] **Step 2: PASS**

- [ ] **Step 3: Route GET/POST**

`GET`: query `mine=1` → без актора 401; иначе все строки `eq(classifieds.userId, actor.id)`. Без `mine` — `select` все, затем `filterPublicClassifieds` + `mapClassifiedToCard`.

`POST`: актор обязателен; `canPostClassified` иначе 403 `{ error: "citizens_only" }`; `classifiedInputSchema.safeParse`; id = `cls_${Date.now()}_${random}`; slug через `makeClassifiedSlug`; `status: initialClassifiedStatus({ autoApprove: true })`; numeric поля через `.toFixed(2)` как в `seed.ts`; `userId: actor.id`.

Не использовать `any`. Для insert типы `NewClassified`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/classifieds/route.ts src/lib/classifieds/access.ts src/lib/classifieds/access.test.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): add list and create API for citizen ads

EOF
)"
```

---

### Task 6: PATCH и смена статуса

**Files:**
- Create: `src/app/api/classifieds/[id]/route.ts`
- Create: `src/app/api/classifieds/[id]/status/route.ts`

- [ ] **Step 1: Тест разрешённых статусов владельца**

В `access.ts`:

```ts
export const ownerStatusTransitions = ["archived", "sold"] as const;
export type OwnerStatus = (typeof ownerStatusTransitions)[number];

export function canOwnerSetStatus(status: string): status is OwnerStatus {
  return ownerStatusTransitions.includes(status as OwnerStatus);
}
```

Тест: `archived`/`sold` true, `active`/`pending` false для владельца.

- [ ] **Step 2: PATCH `[id]`**

Найти по id. Нет строки → 404. `canMutateClassified` иначе 403. Body — `classifiedInputSchema.partial()` минимум для title/description/price/photos. `updatedAt: new Date()`.

- [ ] **Step 3: POST `[id]/status`**

Body `{ status }`. Владелец + `canOwnerSetStatus`. Админ-переходы `active`/`rejected` не включать до Task 16.

- [ ] **Step 4: Commit**

```bash
git add src/lib/classifieds/access.ts src/lib/classifieds/access.test.ts src/app/api/classifieds/[id]/route.ts src/app/api/classifieds/[id]/status/route.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): allow owners to edit and archive ads

EOF
)"
```

---

### Task 7: Загрузка фото

**Files:**
- Create: `src/lib/classifieds/photos.ts`
- Create: `src/lib/classifieds/photos.test.ts`
- Create: `src/app/api/classifieds/photos/route.ts`
- Modify: `.env.example`

- [ ] **Step 1: Тест валидации файла**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { assertClassifiedPhoto } from "./photos";

test("rejects empty, huge, and non-image files", () => {
  assert.throws(() => assertClassifiedPhoto({ size: 0, type: "image/jpeg", name: "a.jpg" }));
  assert.throws(() => assertClassifiedPhoto({ size: 11 * 1024 * 1024, type: "image/jpeg", name: "a.jpg" }));
  assert.throws(() => assertClassifiedPhoto({ size: 1000, type: "application/pdf", name: "a.pdf" }));
});

test("accepts jpeg under 10MB", () => {
  assert.doesNotThrow(() =>
    assertClassifiedPhoto({ size: 500_000, type: "image/jpeg", name: "p.jpg" })
  );
});
```

- [ ] **Step 2: FAIL затем реализация `assertClassifiedPhoto` + `buildPhotoObjectPath(userId, draftId, index, ext)` → `{userId}/{draftId}/{index}.jpg`**

Разрешить `image/jpeg`, `image/png`, `image/webp`. Max 10_485_760.

- [ ] **Step 3: `saveClassifiedPhotos(userId, files: File[])`**

Если есть `SUPABASE_SERVICE_ROLE_KEY` + `NEXT_PUBLIC_SUPABASE_URL` — upload в bucket `classified-photos` через `@supabase/supabase-js` `createClient`, `upsert: true`, вернуть public URLs.  
Иначе записать в `public/classified-photos/{userId}/{draftId}/` через `fs/promises` и вернуть ` /classified-photos/... ` (Next раздаёт `public`).

- [ ] **Step 4: Route POST multipart**

`getClassifiedsActor`; `canPostClassified` иначе 403; FormalData `files`; максимум 10; вызвать save; `{ urls }`.

`.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 5: PASS photos.test.ts, commit**

```bash
git add src/lib/classifieds/photos.ts src/lib/classifieds/photos.test.ts src/app/api/classifieds/photos/route.ts .env.example
git commit -m "$(cat <<'EOF'
feat(classifieds): upload listing photos from device

EOF
)"
```

---

### Task 8: UI-карточка объявления

**Files:**
- Create: `src/components/classifieds/classified-card.tsx`

Клиентский компонент. Проп: `ClassifiedCard` + `formatPrice`. Разметка как блок вторички на главной: фото, бейджи сделки/типа, цена, район, комнаты/м², «Показать телефон», WhatsApp. Клик по фото/заголовку → `Link href={/classifieds/${slug}}`. Phone/WA — те же POST `/api/crm/leads`, что в `src/app/page.tsx` (скопировать `togglePhone`/`handleWhatsappLead` внутрь компонента, чтобы главная не дублировала).

Не оборачивать в лишний декоративный dashboard-card chrome сверх существующего стиля главной.

- [ ] **Step 1: Реализовать компонент**
- [ ] **Step 2: Commit**

```bash
git add src/components/classifieds/classified-card.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): extract listing preview card

EOF
)"
```

---

### Task 9: Каталог `/classifieds`

**Files:**
- Create: `src/app/classifieds/page.tsx`

Server Component: `db.select().from(classifieds)`, `filterPublicClassifieds` по `searchParams` (`city`, `propertyType`, `dealType`, `rooms`, `priceMin`, `priceMax`, `q`). Пустой список — текст + Link на `/classifieds/new`.

Клиентская обёртка фильтров допустима: вынести `ClassifiedsFilters` в `src/components/classifieds/classifieds-filters.tsx` (`router.push` с query). Поля: город (`SOGD_CITIES`), тип, сделка, комнаты (как на главной), цена от/до.

«Подать объявление» CTA сверху.

- [ ] **Step 1: Страница + фильтры**
- [ ] **Step 2: Header nav «Вторичка» → `/classifieds`** в `src/components/layout/header.tsx` (сейчас `#classifieds`).
- [ ] **Step 3: Commit**

```bash
git add src/app/classifieds/page.tsx src/components/classifieds/classifieds-filters.tsx src/components/layout/header.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): add public catalog with filters

EOF
)"
```

---

### Task 10: Карточка `/classifieds/[slug]`

**Files:**
- Create: `src/app/classifieds/[slug]/page.tsx`

Server Component. Найти по slug. Если нет — `notFound()`. Если не `active` и актор не владелец — `notFound()`. Иначе показать галерею (`photos`), цену `useCurrency` потребует клиентский island `ClassifiedDetail` в `src/components/classifieds/classified-detail.tsx`: галерея, спеки, коммуникации, описание, контакты.

После успешного find: `viewsCount + 1` update (fire-and-forget, без блокировки рендера если update падает).

Metadata: `title` объявления.

- [ ] **Step 1: Detail UI + page**
- [ ] **Step 2: Commit**

```bash
git add src/app/classifieds/[slug]/page.tsx src/components/classifieds/classified-detail.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): add public listing detail page

EOF
)"
```

---

### Task 11: Мастер подачи и фото-аплоадер

**Files:**
- Create: `src/components/classifieds/photo-uploader.tsx`
- Create: `src/components/classifieds/classified-wizard.tsx`
- Create: `src/app/classifieds/new/page.tsx`
- Create: `src/app/classifieds/[slug]/edit/page.tsx`

- [ ] **Step 1: `PhotoUploader`**

Пропсы: `urls: string[]`, `onChange(urls)`, `disabled?`. Input `multiple` accept image/jpeg,png,webp. Drag-and-drop. Сетка превью, первое — подпись «Обложка». Кнопка удалить. На выборе файлов: `FormData` append `files`, `POST /api/classifieds/photos`, concat urls (cap 10). Ошибка >10 МБ — текст под сеткой.

- [ ] **Step 2: `ClassifiedWizard`**

5 шагов как в spec. State — объект совместимый с `classifiedInputSchema`. Курс: `DEFAULT_USD_TO_TJS` — при смене валюты пересчитывать вторую цену. `convertUsdToTjs` / `convertTjsToUsd` из `src/lib/currency.ts`.

Submit: `POST /api/classifieds` или `PATCH` если `classifiedId` задан. Успех → `router.push(/classifieds/${slug})`.

Шаг 1 для не-user: не рендерить форму (страница-обёртка проверит роль).

- [ ] **Step 3: `/classifieds/new/page.tsx`**

Client: `useSession`; нет сессии — открыть тот же паттерн что header (`AuthModal`); роль не user — текст «Эта форма для граждан. Риелторы работают в CRM.» + Link `/profile/crm`. Иначе `<ClassifiedWizard />`.

- [ ] **Step 4: edit page**

Загрузить `GET /api/classifieds?mine=1`, найти slug, 404 если чужое. Передать initial values в wizard.

- [ ] **Step 5: Header «Подать объявление»** → `router.push("/classifieds/new")` если session, иначе login modal и после входа пользователь сам жмёт ещё раз (не строить сложный redirect в этом шаге). Убрать пустой onClick.

- [ ] **Step 6: Commit**

```bash
git add src/components/classifieds/photo-uploader.tsx src/components/classifieds/classified-wizard.tsx src/app/classifieds/new/page.tsx src/app/classifieds/[slug]/edit/page.tsx src/components/layout/header.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): add Avito-style posting wizard

EOF
)"
```

---

### Task 12: `/profile/ads`

**Files:**
- Create: `src/app/profile/ads/page.tsx`
- Modify: `src/components/layout/header.tsx` (пункт меню рядом с CRM)

Список из `GET /api/classifieds?mine=1`. Колонки: превью, title, status badge (`active`→Активно, `pending`→На проверке, `archived`→Снято, `sold`→Продано, `rejected`→Отклонено), views, ссылка изменить, кнопки «Снять» (`archived`) и «Продано» (`sold`). Пусто — CTA на `/classifieds/new`.

Dropdown пользователя: Link «Мои объявления» `/profile/ads`.

- [ ] **Step 1: Страница + пункт меню**
- [ ] **Step 2: Commit**

```bash
git add src/app/profile/ads/page.tsx src/components/layout/header.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): add my-ads cabinet for citizens

EOF
)"
```

---

### Task 13: Главная с БД, не моки

**Files:**
- Modify: `src/app/page.tsx`

`page.tsx` сейчас `"use client"` с `RECENT_CLASSIFIEDS`. Не переписывать всю главную в RSC в этом шаге (hero/search завязаны на клиент). Вместо этого:

1. Вынести клиентскую главную в `src/app/home-page-client.tsx` с пропом `classifieds: ClassifiedCard[]`.
2. `src/app/page.tsx` сделать Server Component: select classifieds, `filterPublicClassifieds`, взять 6 свежих по `createdAt`, `mapClassifiedToCard`, передать в client.
3. Удалить массив `RECENT_CLASSIFIEDS` из главной.
4. Link «Смотреть все» → `/classifieds`, текст без фейкового «186».
5. Карточки секции заменить на `<ClassifiedCard />`.

- [ ] **Step 1: Сплит RSC/client и подключение БД**
- [ ] **Step 2: `pnpm exec tsc --noEmit` без ошибок по затронутым файлам**
- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/app/home-page-client.tsx src/components/classifieds/classified-card.tsx
git commit -m "$(cat <<'EOF'
feat(classifieds): render homepage listings from Postgres

EOF
)"
```

---

### Task 14: CRM-подборки из тех же объявлений

**Files:**
- Modify: `src/app/profile/crm/page.tsx`
- Modify: `src/app/api/crm/collections/[shareCode]/route.ts`
- Modify: `src/lib/catalog-data.ts` (если ещё нужен fallback)

- [ ] **Step 1: На CRM при загрузке `fetch("/api/classifieds")` и подставлять в селектор подборки вместо `CATALOG_PROPERTIES`. `propertyIds` — реальные `classifieds.id`.**

- [ ] **Step 2: Share GET: `JSON.parse(propertyIds)`, затем `db.select` where `inArray(classifieds.id, ids)` и `mapClassifiedToCard`. Fallback `getPropertiesByIds` оставить только если БД пуста и ids вида `c1` (старые демо-коды).**

- [ ] **Step 3: Страница `/p/[share_code]` уже ждёт `CatalogProperty`. Либо расширить тип карточки общими полями (`id,title,image,priceTjs,...`), либо маппить `ClassifiedCard` → тот же shape в API response `properties`. Сохранить совместимость полей `dealType` как русские строки, как сейчас в `catalog-data.ts`.**

- [ ] **Step 4: Commit**

```bash
git add src/app/profile/crm/page.tsx src/app/api/crm/collections/[shareCode]/route.ts src/lib/catalog-data.ts src/lib/classifieds/map-card.ts
git commit -m "$(cat <<'EOF'
feat(classifieds): feed CRM collections from live ads

EOF
)"
```

---

### Task 15: Документация захода 1 + проверка тестов

**Files:**
- Modify: `TASKS.md`, `MEMORY.md`

- [ ] **Step 1: В TASKS Phase 3 отметить форму, каталог, карточку, кабинет, фото. Оставить незакрытыми пункты модерации/телефона если добавляешь их явно, либо список:**

```
- [x] Free ad posting form for citizens
- [x] Listing catalog and detail pages from Postgres
- [x] Device photo upload
- [x] My ads cabinet
- [ ] Moderation queue, rate limit, phone OTP
```

`MEMORY.md`: Phase 3 рынок живой; next = заход 2 доверия, потом Phase 9 карта.

- [ ] **Step 2: `pnpm test` — все `*.test.ts` зелёные, включая старый `crm-collections-store.test.ts`.**

- [ ] **Step 3: Commit docs**

```bash
git add TASKS.md MEMORY.md
git commit -m "$(cat <<'EOF'
docs: mark classifieds marketplace slice complete

EOF
)"
```

Заход 1 готов, когда гражданин (seed `dilshod@gmail.com` / роль user) может залогиниться, подать объявление с фото, увидеть его на `/` и `/classifieds/[slug]`, снять в `/profile/ads`.

---

### Task 16: Заход 2 — pending, лимит, админка

**Files:**
- Create: `src/lib/classifieds/rate-limit.ts`
- Create: `src/lib/classifieds/rate-limit.test.ts`
- Modify: `src/app/api/classifieds/route.ts` (`autoApprove: false`)
- Modify: `src/app/api/classifieds/[id]/status/route.ts` (admin active/rejected)
- Create: `src/app/admin/classifieds/page.tsx`
- Modify: `src/db/schema/classifieds.ts` — `moderationNote: text("moderation_note")`
- Затем `pnpm db:generate` / `pnpm db:push` (нужен DATABASE_URL)

- [ ] **Step 1: Тест лимита**

```ts
export function canCreateAnotherAd(createdAtList: Date[], now = new Date(), max = 3, windowMs = 86_400_000) {
  const recent = createdAtList.filter((d) => now.getTime() - d.getTime() < windowMs);
  return recent.length < max;
}
```

Три свежих → false, два → true.

- [ ] **Step 2: POST create: `autoApprove: false` → `pending`. Перед insert посчитать объявления юзера за 24ч; 429 `{ error: "rate_limited" }`.** Honeypot: поле `website` в Zod `.optional()`, если непустое — 400 без insert.

- [ ] **Step 3: Admin status: `canModerateClassifieds` + status `active` | `rejected` + optional `moderationNote`.**

- [ ] **Step 4: `/admin/classifieds` только `role === admin`**: список pending, фото, кнопки Одобрить/Отклонить. Не-админ — `redirect("/")`.

- [ ] **Step 5: Витрина по-прежнему только active. Кабинет гражданина видит pending.**

- [ ] **Step 6: Тесты + commit**

```bash
git commit -m "$(cat <<'EOF'
feat(classifieds): require moderation and cap three ads per day

EOF
)"
```

---

### Task 17: Заход 2 — OTP телефона

**Files:**
- Create: `src/lib/classifieds/otp.ts`
- Create: `src/lib/classifieds/otp.test.ts`
- Create: `src/app/api/classifieds/otp/route.ts`
- Modify: `src/app/api/classifieds/route.ts`
- Modify: wizard — шаг контактов, если `phoneVerified === false`

- [ ] **Step 1: Чистый OTP**

```ts
const otps = new Map<string, { code: string; expiresAt: number }>();

export function issueOtp(phone: string, now = Date.now()) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otps.set(phone, { code, expiresAt: now + 10 * 60 * 1000 });
  return code;
}

export function verifyOtp(phone: string, code: string, now = Date.now()) {
  const row = otps.get(phone);
  if (!row || row.expiresAt < now) return false;
  return row.code === code;
}
```

Тест: верный код true, просроченный false. Для теста `issueOtp` должен принимать optional `code` в test helper `setOtp(phone, code, expiresAt)`.

- [ ] **Step 2: `POST /api/classifieds/otp` `{ action: "send" | "verify", phone, code? }`.** Send: без провайдера `console.log` код (как Telegram). Verify: обновить `users.phone` + `phoneVerified: true`.

- [ ] **Step 3: Create classified: если `!users.phoneVerified` → 403 `{ error: "phone_unverified" }`.** Wizard показывает блок ввода кода.

- [ ] **Step 4: TASKS закрыть модерацию/OTP. MEMORY: Phase 3 complete, next Phase 9.**

- [ ] **Step 5: `pnpm test` зелёный. Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(classifieds): verify phone before first publish

EOF
)"
```

---

## Self-review

- Spec slice 1: Tasks 1–15.
- Spec slice 2: Tasks 16–17.
- Нет TBD в шагах кода ядра; UI-страницы описаны структурой, не «добавить валидацию потом».
- Имена: `classifiedInputSchema`, `canPostClassified`, `filterPublicClassifieds`, `initialClassifiedStatus` согласованы между задачами.
- CRM share и главная переведены с моков, иначе Phase 3 снова «демо».
