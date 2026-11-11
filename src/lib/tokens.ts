/**
 * Maskani Design Tokens (MDS) — Source of Truth
 *
 * Централизованный реестр дизайн-токенов, микро-статусов и семантических стилей.
 * Соответствует спецификации Phase 0 (Foundations) и целевой дизайн-системе.
 */

export const BRAND_COLORS = {
  emerald: {
    light: '#107555', // hsl(158, 64%, 40%) - WCAG AA compliant on light background
    dark: '#10B981',  // hsl(158, 60%, 50%) - WCAG AA compliant on dark background
    DEFAULT: '#107555',
  },
  slate: {
    canvasLight: '#F8FAFC',
    canvasDark: '#0B0F17',
    cardLight: '#FFFFFF',
    cardDark: '#0F1523',
    borderLight: '#E2E8F0',
    borderDark: '#242E42',
  },
} as const;

export type EntityStatus =
  | 'active'
  | 'moderation'
  | 'booked'
  | 'sold'
  | 'archived'
  | 'rejected';

export interface StatusStyleConfig {
  label: string;
  dotColor: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  lineColor: string;
}

export const STATUS_STYLES: Record<EntityStatus, StatusStyleConfig> = {
  active: {
    label: 'Активно',
    dotColor: 'bg-emerald-500',
    badgeVariant: 'secondary',
    lineColor: 'border-emerald-500',
  },
  moderation: {
    label: 'На модерации',
    dotColor: 'bg-sky-500',
    badgeVariant: 'secondary',
    lineColor: 'border-sky-500',
  },
  booked: {
    label: 'Забронировано',
    dotColor: 'bg-amber-500',
    badgeVariant: 'secondary',
    lineColor: 'border-amber-500',
  },
  sold: {
    label: 'Продано',
    dotColor: 'bg-slate-400',
    badgeVariant: 'secondary',
    lineColor: 'border-slate-400',
  },
  archived: {
    label: 'В архиве',
    dotColor: 'bg-slate-400',
    badgeVariant: 'secondary',
    lineColor: 'border-slate-400',
  },
  rejected: {
    label: 'Отклонено',
    dotColor: 'bg-rose-500',
    badgeVariant: 'destructive',
    lineColor: 'border-rose-500',
  },
};

/**
 * Вспомогательная функция для безопасного получения стилей статуса
 */
export function getStatusStyle(status: string | undefined | null): StatusStyleConfig {
  if (!status || !(status in STATUS_STYLES)) {
    return STATUS_STYLES.archived;
  }
  return STATUS_STYLES[status as EntityStatus];
}
