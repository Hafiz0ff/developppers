# ТЗ Этап 0: Фундамент и архитектура дизайн-системы (P0)

> **Приоритет:** P0 (Критический системный фундамент)  
> **Цель этапа:** Восстановление управляемости интерфейсом через токены, активация темной темы (Dark Mode), устранение 43 директив `!important`, переписывание классов Liquid Glass в нейтральные адаптивные материалы.  
> **Затрагиваемые файлы:**
> - `src/app/globals.css`
> - `src/app/layout.tsx`
> - `src/app/manifest.ts`
> - `src/lib/tokens.ts` (новый файл типизированных дизайн-токенов)

---

## 1. Задачи этапа

### Задача 1.1: Перепривязка `--primary` и семантических токенов в `globals.css`

#### Проблема
В `src/app/globals.css:52-140` токен `--primary` определен как околочерный сланец:
```css
--primary: hsl(222.2 47.4% 11.2%);
```
Однако в 90% компонентов разработчики обходили этот токен и писали `bg-emerald-600`. В результате смена темы или токена не приводила ни к каким изменениям.

#### Решение
Привязать `--primary` к фирменному изумрудному оттенку Maskani с соблюдением контрастности WCAG AA:

```css
:root {
  /* Базовый холст и текст */
  --background: hsl(210 40% 98%);       /* #F8FAFC */
  --foreground: hsl(222 47% 11%);       /* #0F172A */

  /* Карточки и всплывающие слои */
  --card: hsl(0 0% 100%);               /* #FFFFFF */
  --card-foreground: hsl(222 47% 11%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222 47% 11%);

  /* Фирменный бренд-акцент: изумрудный */
  --primary: hsl(158 64% 40%);          /* #107555 — четкий, строгий, контрастный */
  --primary-foreground: hsl(0 0% 100%); /* #FFFFFF */

  /* Вторичные и приглушенные поверхности */
  --secondary: hsl(210 40% 96%);        /* #F1F5F9 */
  --secondary-foreground: hsl(222 47% 11%);
  --muted: hsl(210 40% 96%);
  --muted-foreground: hsl(215 16% 47%); /* #64748B */

  /* Контуры и фокус */
  --border: hsl(214 32% 91%);           /* #E2E8F0 */
  --input: hsl(214 32% 91%);
  --ring: hsl(158 64% 40%);

  /* Деструктивные действия */
  --destructive: hsl(0 72% 51%);        /* #DC2626 */
  --destructive-foreground: hsl(0 0% 100%);

  /* Радиусы */
  --radius: 0.5rem; /* 8px базовый */
}

.dark {
  --background: hsl(222 47% 7%);        /* #0B0F17 — глубокий премиальный темный */
  --foreground: hsl(210 40% 98%);       /* #F8FAFC */

  --card: hsl(222 47% 10%);             /* #0F1523 */
  --card-foreground: hsl(210 40% 98%);
  --popover: hsl(222 47% 10%);
  --popover-foreground: hsl(210 40% 98%);

  /* В темной теме изумруд слегка высветлен для читаемости */
  --primary: hsl(158 60% 50%);          /* #10B981 */
  --primary-foreground: hsl(222 47% 7%);

  --secondary: hsl(217 33% 15%);        /* #1E2638 */
  --secondary-foreground: hsl(210 40% 98%);
  --muted: hsl(217 33% 15%);
  --muted-foreground: hsl(215 20% 65%); /* #94A3B8 */

  --border: hsl(217 33% 18%);           /* #242E42 */
  --input: hsl(217 33% 18%);
  --ring: hsl(158 60% 50%);

  --destructive: hsl(0 62% 40%);
  --destructive-foreground: hsl(210 40% 98%);
}
```

---

### Задача 1.2: Подключение Theme Provider в `src/app/layout.tsx`

#### Проблема
В строке 47 `src/app/layout.tsx`:
```tsx
<html lang={locale} className="scroll-smooth" suppressHydrationWarning>
```
Класс `dark` никогда не применяется к `<html>`. В коде нет провайдера тем (например, `next-themes` или легковесного хука), поэтому все стили с префиксом `dark:` остаются мертвым грузом в собранном бандле.

#### Решение
1. Внедрить легковесный провайдер тем `ThemeProvider` (на базе `next-themes` с `attribute="class"`, `defaultTheme="system"`, `enableSystem`).
2. Обеспечить отсутствие "мигания" темы (flash of unstyled content) при загрузке страницы.
3. Добавить в `metadata` и `viewport` правильные мета-теги `theme-color`:
```tsx
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F17' },
  ],
};
```

---

### Задача 1.3: Синхронизация `src/app/manifest.ts`

Обновить цвета веб-манифеста в соответствии с новой токен-системой:
- `background_color`: `#0B0F17` (темный фон приложения);
- `theme_color`: `#107555` (фирменный изумруд бренда).

---

### Задача 1.4: Создание единого модуля дизайн-констант `src/lib/tokens.ts`

Создать типизированный файл, экспортирующий семантические константы для использования в TSX (статусы объектов, типы недвижимости, валюты):

```typescript
/**
 * Единый источник правды для дизайн-системы и статусов Maskani
 */
export const STATUS_STYLES = {
  active: {
    label: 'Активно',
    dotColor: 'bg-emerald-500',
    badgeVariant: 'secondary' as const,
  },
  moderation: {
    label: 'На модерации',
    dotColor: 'bg-sky-500',
    badgeVariant: 'secondary' as const,
  },
  booked: {
    label: 'Забронировано',
    dotColor: 'bg-amber-500',
    badgeVariant: 'secondary' as const,
  },
  sold: {
    label: 'Продано',
    dotColor: 'bg-slate-400',
    badgeVariant: 'secondary' as const,
  },
  archived: {
    label: 'В архиве',
    dotColor: 'bg-slate-400',
    badgeVariant: 'secondary' as const,
  },
  rejected: {
    label: 'Отклонено',
    dotColor: 'bg-rose-500',
    badgeVariant: 'destructive' as const,
  },
} as const;
```

---

### Задача 1.5: Полная зачистка и нейтрализация классов Liquid Glass в `globals.css`

#### Проблема
В `src/app/globals.css:140-230` объявлена 21 утилита класса `glass-*`, содержащая:
- 43 директивы `!important`;
- Ядовито-зеленые рамки при ховере: `border-color: rgba(16, 185, 129, 0.4) !important`;
- Зеленые неоновые тени: `box-shadow: 0 0 25px rgba(16, 185, 129, 0.15) !important`;
- Градиентные подложки.

#### Решение
Полностью удалить все 43 `!important`. Заменить класс `glass` на один универсальный физический материал для плавающих поверхностей (Tier 3):

```css
/* Нейтральный физический Frosted Glass для плавающих слоев */
.glass,
.glass-panel,
.glass-card {
  background-color: hsl(var(--background) / 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.6);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.dark .glass,
.dark .glass-panel,
.dark .glass-card {
  background-color: hsl(var(--background) / 0.75);
  border: 1px solid hsl(var(--border) / 0.5);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}
```

Все цветные ховеры и неоновые тени удаляются полностью.

---

## 2. Критерии приемки Этапа 0 (Definition of Done)

1. [ ] **Проверка `globals.css` на `!important`:**  
   Команда `rg "!important" src/app/globals.css` возвращает `0` совпадений в правилах компонентов и материалов.
2. [ ] **Проверка Dark Mode:**  
   При добавлении класса `dark` к `<html>` весь интерфейс мгновенно переключается на темную нейтральную палитру без артефактов и белых непрозрачных рамок.
3. [ ] **Централизованный контроль `--primary`:**  
   Изменение значения `--primary` в `globals.css` на тестовый оттенок меняет цвет всех кнопок и ссылок с классом `bg-primary` / `text-primary`.
4. [ ] **Тесты:**  
   Все 268 существующих тестов (`pnpm test`) успешно проходят без регрессий.
5. [ ] **Сборка:**  
   Команда `pnpm build` завершается без ошибок компиляции и типов.
