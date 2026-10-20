# Cross-Cutting Services Reference

## 1. Bilingual Localization (`ru` & `tg`)
* **State Context**: `src/context/language-context.tsx` (`LanguageProvider`, `useLanguage`).
* **Helper**: `tDual(ru: string, tg: string): string` provides fast inline dual text rendering without requiring large dictionary lookups.
* **Translations Dictionary**: `src/lib/i18n/translations.ts` for static navigation, errors, and common UI elements.
* **Component Switcher**: `src/components/layout/language-switcher.tsx`.
* **Database Columns**: Entities support both languages (e.g. `title` & `titleTg`, `address` & `addressTg`, `city` & `cityTg`).

## 2. Dual Currency (`TJS` & `USD`)
* **State Context**: `src/context/currency-context.tsx` (`CurrencyProvider`, `useCurrency`).
* **Helper**: `formatPrice(priceTjs?: number, priceUsd?: number): string`.
* **Pricing Calculator**: `src/lib/pricing/new-building-price.ts` (`formatPricePerSquareMeter`, `formatPrice`).
* **Formatting Rule**: Prices must always separate thousands with non-breaking spaces and include currency units (e.g. `11 250 сомони/м²` or `125 000 сомони`).

## 3. Geographic & Geocoding Services
* **Sughd Scope**: Cities (`Худжанд`, `Б.Гафуров`, `Истаравшан`, `Исфара`, `Гулистон`, `Конибодом`, `Мастчох`).
* **Locations Registry**: `src/lib/constants/locations.ts`.
* **Yandex Geocoder**: `src/lib/yandex-geocoder.ts` with Sughd bounding box restrictions.
* **Routing**: `src/lib/geo-utils.ts` (`generateYandexMapsRouteUrl`).
* **Interactive Map**: `src/components/modules/interactive-map.tsx`, `interactive-map-wrapper.tsx` using Leaflet with custom Sughd tiles and clustering.

## 4. Entity Metrics & Analytics
* **Hook**: `src/hooks/use-entity-metrics.ts`.
* **Deduplication**: 24-hour cookie/localStorage-based view tracking to prevent counter inflation.
* **Favorites**: Synchronized state across local client storage and authenticated server API.

## 5. Security, Roles & RBAC
* **Roles**: `superadmin`, `developer`, `agent`, `client`.
* **RBAC Library**: `src/lib/auth/rbac.ts` (`hasPermission`, `canAccessProject`).
* **Audit Logger**: `src/lib/audit-logger.ts` redacting passwords, session tokens, and secrets from all logs.
