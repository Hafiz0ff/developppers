# ТЗ Этап 2: Каркас и навигация приложения (Layout & Chrome) (P1)

> **Приоритет:** P1  
> **Цель этапа:** Очистка глобального каркаса сайта: ликвидация 41 неонового свечения в хедере, устранение микро-шрифтов на бейджах счетчиков, перевод плавающей панели сравнения на физический материал Tier 3, приведение боковых панелей (Admin и CRM) к нейтральному стилю.  
> **Затрагиваемые файлы:**
> - `src/components/header.tsx`
> - `src/components/floating-compare-bar.tsx`
> - `src/components/language-switcher.tsx`
> - `src/app/super-admin/layout.tsx` (и компоненты админ-сайдбара)
> - `src/app/profile/layout.tsx` (и компоненты навигации кабинета)

---

## 1. Задачи этапа

### Задача 1.1: Полная зачистка `src/components/header.tsx` от неоновых свечений

#### Проблема
Хедер приложения стал эпицентром декоративного перегруза. Статический анализ зафиксировал **41 утилиту свечений и теней** внутри одного файла:
- `shadow-[0_0_15px_rgba(16,185,129,0.3)]` на кнопках и аватарках;
- Бейджи счетчиков избранного и сравнения оформлены как `text-[9px] font-bold bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`;
- Градиентные 2px полоски внизу шапки.

#### Решение
1. Превратить Хедер в физический плавающий слой (Tier 3):
```tsx
<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    {/* Логотип, навигация, переключатели */}
  </div>
</header>
```
2. Полностью удалить все 41 утилиту `shadow-[0_0_*]` и `shadow-emerald-*`.
3. Бейджи счетчиков избранного и сравнения перевести на четкий размер `text-xs` (12px) или минимальный компактный индикатор:
```tsx
{/* Было: text-[9px] с неоновой тенью */}
{/* Стало: строгий микро-счетчик */}
<span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground leading-none">
  {count}
</span>
```
4. Удалить декоративные градиентные полоски под шапкой.

---

### Задача 1.2: Рефакторинг переключателя языков (`LanguageSwitcher`)

#### Проблема
Селектор языков (TJ / RU / EN) использует цветные подсветки активного языка, вызывая скачки макета (layout shift) и визуальный шум рядом с кнопкой входа.

#### Решение
Сделать переключатель языков компактным сегментированным элементом либо строгим выпадающим меню:
- Контейнер: `bg-muted/80 p-0.5 rounded-md border border-border/40`;
- Неактивный язык: `text-xs text-muted-foreground hover:text-foreground px-2 py-1`;
- Активный язык: `bg-background text-foreground font-semibold shadow-2xs rounded-sm px-2 py-1`.

---

### Задача 1.3: Модернизация плавающей панели сравнения (`floating-compare-bar.tsx`)

#### Проблема
Плавающая панель сравнения, появляющаяся внизу экрана при добавлении квартир, страдает от изумрудного перегруза:
- Зеленая неоновая тень на всю ширину;
- Градиентная изумрудная рамка;
- Разноцветные миниатюры.

#### Решение
Оформить панель как парящий остров (Floating Island) в стиле Apple / Linear:
```tsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 transition-all">
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background/85 p-3 shadow-xl backdrop-blur-xl">
    {/* Превью выбранных объектов */}
    <div className="flex items-center gap-2 overflow-x-auto">
      {/* Миниатюры с нейтральными рамками */}
    </div>
    
    {/* Кнопки действий */}
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={clearCompare}>
        Очистить
      </Button>
      <Button variant="default" size="sm" asChild>
        <Link href="/compare">Сравнить ({items.length})</Link>
      </Button>
    </div>
  </div>
</div>
```

---

### Задача 1.4: Рефакторинг боковых панелей (Admin Sidebar & CRM Sidebar)

#### Проблема
В боковом меню Super-Admin и CRM риелтора:
- Пункты меню подсвечиваются разными цветами (синий, оранжевый, зеленый);
- Бейджи непрочитанных заявок имеют разноцветные фоны;
- Градиентные активные состояния.

#### Решение
1. Сайдбар строится на плотном нейтральном фоне: `bg-card border-r border-border/60`.
2. Активный пункт меню выделяется строго через нейтральный `bg-muted text-foreground font-medium` с аккуратным 2px левым маркером `bg-primary` либо контрастным текстом.
3. Счетчики уведомлений оформляются в нейтральном сером стиле (`bg-muted-foreground/15 text-foreground text-xs`).

---

## 2. Критерии приемки Этапа 2 (Definition of Done)

1. [x] **Количество неоновых теней в `src/components/layout/header.tsx`:**  
   Команда `rg "shadow-\[" src/components/layout/header.tsx` возвращает `0` совпадений.
2. [x] **Отсутствие микро-шрифтов в Chrome:**  
   В хедере, футере и сайдбарах нет классов `text-[9px]` и `text-[10px]`.
3. [x] **Поведение Floating Compare Bar:**  
   Панель выглядит как премиальный нейтральный остров, читается одинаково четко поверх любого контента и карточек в светлой и темной теме.
4. [x] **Многоязычность:**  
   Переключение между таджикским, русским и английским языками происходит без скачков верстки хедера.
5. [x] **Тесты:**  
   Все тесты функционала навигации и сравнения проходят успешно.
