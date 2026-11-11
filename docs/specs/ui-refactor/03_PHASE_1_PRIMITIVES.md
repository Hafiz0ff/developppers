# ТЗ Этап 1: Очистка и унификация базовых примитивов UI (P0/P1)

> **Приоритет:** P0 / P1  
> **Цель этапа:** Приведение базовых компонентов (`button`, `badge`, `card`, `input`, `tabs`, `dialog`) к чистой архитектуре вариантов без жестко зашитых цветов палитры, удаление раздутых вариантов (`emerald`, `neon`, `gradient`), внедрение примитива микро-статусов.  
> **Затрагиваемые файлы:**
> - `src/components/ui/button.tsx`
> - `src/components/ui/badge.tsx`
> - `src/components/ui/card.tsx`
> - `src/components/ui/input.tsx`
> - `src/components/ui/tabs.tsx`
> - `src/components/ui/dialog.tsx`
> - `src/components/ui/developer-avatar.tsx`
> - `src/components/ui/status-badge.tsx` (новый компонент)

---

## 1. Задачи этапа

### Задача 1.1: Рефакторинг `src/components/ui/button.tsx`

#### Проблема
В `button.tsx` накопилось 9 различных вариантов стилей, включая псевдо-брендовые `variant: 'emerald'`, `variant: 'neon'`, а также кнопки с градиентной заливкой и цветными тенями `shadow-emerald-500/20`.

#### Решение
Сократить варианты `cva` до 5 строгих промышленных типов, управляемых через CSS-токены темы:

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-border/80 bg-background shadow-xs hover:bg-muted hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-muted hover:text-foreground',
        link:
          'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

*Удаляются:* Варианты `emerald`, `gradient`, `neon`, кастомные тени `shadow-emerald-*`.

---

### Задача 1.2: Рефакторинг `src/components/ui/badge.tsx`

#### Проблема
В `badge.tsx` объявлена радуга вариантов (`emerald`, `amber`, `rose`, `purple`, `blue`), каждый из которых использует сырые классы вроде `bg-emerald-50 text-emerald-700 border-emerald-200`. Это порождает 141 цветной триплет на экранах.

#### Решение
Схлопнуть `badgeVariants` до 4 семантических состояний с минимальным размером шрифта `text-xs` (12px):

```tsx
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary hover:bg-primary/15',
        secondary:
          'border-border/60 bg-muted text-muted-foreground hover:bg-muted/80',
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15',
        outline:
          'border-border text-foreground hover:bg-muted',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  }
);
```

---

### Задача 1.3: Создание компонента `src/components/ui/status-badge.tsx`

Создать выделенный примитив для отображения статусов объектов (активен, модерация, продан, архив, бронь) по стандарту Quiet Status (6px dot + 12px текст):

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'moderation' | 'booked' | 'sold' | 'archived' | 'rejected';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  label?: string;
}

const STATUS_CONFIG: Record<StatusType, { defaultLabel: string; dotClass: string }> = {
  active: { defaultLabel: 'Активно', dotClass: 'bg-emerald-500' },
  moderation: { defaultLabel: 'На модерации', dotClass: 'bg-sky-500' },
  booked: { defaultLabel: 'Забронировано', dotClass: 'bg-amber-500' },
  sold: { defaultLabel: 'Продано', dotClass: 'bg-slate-400' },
  archived: { defaultLabel: 'В архиве', dotClass: 'bg-slate-400' },
  rejected: { defaultLabel: 'Отклонено', dotClass: 'bg-rose-500' },
};

export function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.archived;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground',
        className
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dotClass)} />
      {label || config.defaultLabel}
    </span>
  );
}
```

---

### Задача 1.4: Рефакторинг `src/components/ui/card.tsx`

Убедиться, что примитив `Card` реализует физический Tier 2 (Surface Card):
- Непрозрачный фон `bg-card text-card-foreground`;
- Тонкий нейтральный контур `border border-border/60`;
- Мягкая физическая тень `shadow-xs`;
- Отсутствие встроенного размытия `backdrop-blur` и цветных градиентов.

---

### Задача 1.5: Рефакторинг `src/components/ui/input.tsx`

- Базовая высота `h-9` (или `h-10` для основных форм);
- Размер шрифта `text-sm` (14px) — гарантирует отсутствие масштабирования экрана на iOS при тапе;
- Нейтральный контур `border border-input`;
- Чистое фокусное кольцо `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

---

### Задача 1.6: Рефакторинг `src/components/ui/tabs.tsx`

- Фон контейнера вкладок: `bg-muted p-1 text-muted-foreground rounded-lg`;
- Активная вкладка: `data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs rounded-md`;
- Удаление зеленых подчеркиваний и градиентов под активными вкладками.

---

### Задача 1.7: Рефакторинг `src/components/ui/dialog.tsx`

- Полупрозрачная подложка: `bg-black/40 backdrop-blur-xs`;
- Контейнер модального окна: `bg-background border border-border/80 shadow-lg rounded-xl`;
- Удаление цветных рамок и градиентных шапок модалок.

---

### Задача 1.8: Очистка `src/components/ui/developer-avatar.tsx`

- Удаление неонового зеленого кольца вокруг логотипа застройщика;
- Замена на четкую нейтральную физическую рамку `border border-border/60 shadow-xs`.

---

## 2. Критерии приемки Этапа 1 (Definition of Done)

1. [ ] **Количество вариантов в `button.tsx`:**  
   Ровно 5 основных вариантов (`default`, `secondary`, `outline`, `ghost`, `destructive`) + `link`. Варианты `emerald` и `neon` удалены.
2. [ ] **Удаление цветных триплетов в `badge.tsx`:**  
   В `badgeVariants` отсутствуют классы вида `bg-*-50 border-*-200 text-*-800`.
3. [ ] **Минимальный шрифт:**  
   Ни один примитив UI не содержит классов `text-[9px]`, `text-[10px]`, `text-[11px]`. Минимальный размер — `text-xs`.
4. [ ] **Работоспособность StatusBadge:**  
   Новый компонент корректно рендерит все 6 состояний в светлой и темной теме.
5. [ ] **Тесты:**  
   `pnpm test` выполняется успешно со 100% прохождением тестов.
