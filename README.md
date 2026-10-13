# Sogd Realty (Суғд Эстейт) 🏢🏔️

Портал недвижимости для **Согдийской области Таджикистана** (Худжанд, Б. Гафуров, Исфара, Истаравшан, Канибадам, Гулистон, Пенджикент и др.), объединяющий:
1. **Каталог новостроек от застройщиков** (ЖК, блоки, планировки квартир, цены за м², рассрочка от 0%).
2. **Доску частных объявлений и вторичного рынка** (квартиры во вторичке, традиционные дома — *ҳавлӣ* с земельными участками, коммерция, аренда).
3. **Двухвалютную систему расчета**: поддержка цен в таджикских сомони (**TJS**) и долларах США (**USD**) с переключением в реальном времени.
4. **Аутентификацию на базе Better Auth + Drizzle ORM (PostgreSQL)** с ролями: *покупатель/пользователь*, *риелтор*, *застройщик*, *администратор*.

---

## 🛠 Стек технологий

- **Фреймворк**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **База данных и ORM**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit`
- **Аутентификация**: [Better Auth](https://better-auth.com/) (с Drizzle Adapter и хранением в PostgreSQL)
- **Стилизация и UI**: Tailwind CSS v4 + [Shadcn UI](https://ui.shadcn.com/) (Radix / Base UI) + Lucide Icons
- **Управление пакетами**: `pnpm`

---

## 🗄 Спроектированная схема базы данных (`src/db/schema/`)

### 1. Перечисления (`enums.ts`)
- `sogd_city`: `khujand`, `gafurov`, `guliston`, `buston`, `isfara`, `istaravshan`, `konibodom`, `panjakent`, `spitamen`, `zafarobod`, `rasulov`, `mastchoh`, `asht`, `shahriston`, `ayni`, `devashtich`, `kuhistoni_mastchoh`.
- `user_role`: `user` (покупатель/частник), `realtor` (риелтор/агентство), `developer` (застройщик), `admin` (администратор).
- `currency`: `TJS`, `USD`.
- `project_status`: `planned` (проектирование), `under_construction` (строится), `ready` (сдан).
- `building_class`: `economy`, `comfort`, `business`, `premium`.
- `finishing_type`: `rough` (черновая/коробка), `pre_finishing` (предчистовая/белый каркас), `turnkey` (под ключ).
- `unit_type`: `studio`, `apartment`, `penthouse`, `commercial`, `parking`.
- `deal_type`: `sale` (продажа), `rent_long` (долгосрочная аренда), `rent_daily` (посуточно).
- `property_type`: `apartment` (квартира), `house` (дом / ҳавлӣ), `commercial`, `land` (замин), `garage`.

### 2. Пользователи и Авторизация (`auth.ts`)
- **`user`**: `id`, `name`, `email`, `role`, `phone`, `phone_verified`, `city`, `agency_name`, `is_verified_realtor`, `bio`.
- **`session`**, **`account`**, **`verification`**: стандартные таблицы Better Auth с каскадным удалением.

### 3. Застройщики (`developers.ts`)
- **`developers`**: название, `slug`, логотип, обложка, описание, год основания, количество сданных и строящихся домов, рейтинг, статус верификации, город офиса, адрес в Согде, контакты (телефон, WhatsApp, Telegram, сайт).
- **`developer_members`**: связь пользователей/менеджеров отдела продаж с компанией-застройщиком.

### 4. Жилые комплексы / Новостройки (`projects.ts`)
- **`projects`**: привязка к `developer_id`, название, `slug`, статус строительства, класс жилья, отделка, город Согда, микрорайон/ориентир (напр. *19 мкр, набережная Сырдарьи*), координаты, этажность, высота потолков, сроки сдачи (квартал, год), минимальная цена за м² и за квартиру (в TJS и USD), условия рассрочки (срок в месяцах, первый взнос %), инфраструктура (лифт, подземный паркинг, детплощадка, автономное отопление), фотогалерея, ход строительства, проектные документы.

### 5. Квартиры и планировки в ЖК (`units.ts`)
- **`units`**: привязка к `project_id`, номер квартиры, тип (`apartment`, `penthouse` и т.д.), комнатность, общая площадь (м²), жилая, кухня, этаж, секция, цены в TJS и USD, цена за м² в TJS и USD, статус (`available`, `reserved`, `sold`), вид из окон, балкон/терраса, ссылка на план планировки.

### 6. Вторичный рынок и частные объявления (`classifieds.ts`)
- **`classifieds`**: привязка к `user_id`, заголовок, `slug`, описание, тип сделки, тип недвижимости, статус модерации, город Согда, микрорайон/махалля/джамоат (напр. *18 мкр, Махалля Раззок, Джамоат Унчи*), ориентир, площадь, сотки для домов/земли, этаж/этажность, материал стен, ремонт, коммунальные параметры (городская вода, резервуар *хауз*, свет/3-фазы, отопление, септик), цены в TJS и USD, базовая валюта продавца, признак торга, контакты продавца (имя, телефон, WhatsApp).

### 7. Избранное (`favorites.ts`)
- **`favorites`**: привязка `user_id` к `project_id` или `classified_id`.

---

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
cd sogd-realty
pnpm install
```

### 2. Настройка переменных окружения
Скопируйте пример окружения:
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sogd_realty"
BETTER_AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_USD_TO_TJS_RATE="10.95"
```

### 3. Генерация и применение миграций базы данных
```bash
# Генерация SQL миграций
pnpm db:generate

# Применение схемы в PostgreSQL (push)
pnpm db:push

# Запуск Drizzle Studio для визуального просмотра таблиц
pnpm db:studio
```

### 4. Наполнение базы реалистичными данными для Согда
```bash
pnpm db:seed
```

### 5. Запуск сервера разработки
```bash
pnpm dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 🔑 Авторизация (Better Auth)

API эндпоинты аутентификации доступны по маршруту:
`/api/auth/[...all]`

Клиентский вызов:
```tsx
import { signIn, signUp, useSession, signOut } from "@/lib/auth-client";

// Вход по Email и паролю
const { data, error } = await signIn.email({ email, password });

// Регистрация с ролью и телефоном
const { data, error } = await signUp.email({
  email,
  password,
  name: "Дилшод Назаров",
  role: "realtor", // "user" | "realtor" | "developer"
  phone: "+992928881234",
  city: "khujand",
});

// Получение сессии
const { data: session } = useSession();
```
