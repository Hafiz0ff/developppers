import { DeveloperCrmSettings, LeadSubmissionPayload, SelectedDealBundle } from "@/types/crm-booking";
import { INITIAL_PROJECTS, generateUnitsForAnyProject } from "@/lib/data/mock-db";

export const DEFAULT_CRM_SETTINGS: Record<string, DeveloperCrmSettings> = {
  "dev-1": {
    developerId: "dev-1",
    crmConnected: true,
    bookingScenarioEnabled: true,
    workHoursStart: "09:00",
    workHoursEnd: "22:00",
    updatedAt: new Date().toISOString(),
  },
  "dev-2": {
    developerId: "dev-2",
    crmConnected: false,
    bookingScenarioEnabled: false,
    workHoursStart: "09:00",
    workHoursEnd: "20:00",
    updatedAt: new Date().toISOString(),
  },
  "dev-3": {
    developerId: "dev-3",
    crmConnected: true,
    bookingScenarioEnabled: false,
    workHoursStart: "09:00",
    workHoursEnd: "22:00",
    updatedAt: new Date().toISOString(),
  },
};

// Shared server-side runtime state across API routes
const serverRuntimeCrmSettings: Record<string, DeveloperCrmSettings> = {
  ...DEFAULT_CRM_SETTINGS,
};

const STORAGE_KEY_SETTINGS_PREFIX = "maskani_crm_settings_";
const STORAGE_KEY_LEADS = "maskani_booking_leads";

export function getServerCrmSettings(developerId: string): DeveloperCrmSettings {
  return (
    serverRuntimeCrmSettings[developerId] ||
    DEFAULT_CRM_SETTINGS[developerId] || {
      developerId,
      crmConnected: false,
      bookingScenarioEnabled: false,
      workHoursStart: "09:00",
      workHoursEnd: "22:00",
      updatedAt: new Date().toISOString(),
    }
  );
}

export function updateServerCrmSettings(
  developerId: string,
  patch: Partial<DeveloperCrmSettings>
): DeveloperCrmSettings {
  const current = getServerCrmSettings(developerId);
  const updated: DeveloperCrmSettings = {
    ...current,
    ...patch,
    developerId,
    updatedAt: new Date().toISOString(),
  };

  // Rule (Section 2.3 & 3.5): if CRM is disconnected, scenario cannot remain ON
  if (!updated.crmConnected) {
    updated.bookingScenarioEnabled = false;
  }

  serverRuntimeCrmSettings[developerId] = updated;
  return updated;
}

export function getDeveloperCrmSettings(developerId: string): DeveloperCrmSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_SETTINGS_PREFIX}${developerId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as DeveloperCrmSettings;
        if (!parsed.crmConnected) {
          parsed.bookingScenarioEnabled = false;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  return getServerCrmSettings(developerId);
}

export function saveDeveloperCrmSettings(settings: DeveloperCrmSettings): DeveloperCrmSettings {
  const normalized: DeveloperCrmSettings = {
    ...settings,
    bookingScenarioEnabled: settings.crmConnected ? settings.bookingScenarioEnabled : false,
    updatedAt: new Date().toISOString(),
  };

  updateServerCrmSettings(normalized.developerId, normalized);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_SETTINGS_PREFIX}${normalized.developerId}`,
        JSON.stringify(normalized)
      );
      window.dispatchEvent(new Event("maskani-crm-settings-changed"));

      // Sync with backend API asynchronously
      fetch("/api/developer/crm-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      }).catch(() => {});
    } catch (e) {
      console.error("Failed to save CRM settings to localStorage", e);
    }
  }

  return normalized;
}

export function getLocalBookingLeads(developerId?: string): LeadSubmissionPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    if (!raw) return [];
    const list = JSON.parse(raw) as LeadSubmissionPayload[];
    return developerId ? list.filter((l) => l.developerId === developerId) : list;
  } catch {
    return [];
  }
}

export function saveLocalBookingLead(lead: LeadSubmissionPayload): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalBookingLeads();
    if (existing.some((l) => l.leadId === lead.leadId)) return;
    const updated = [lead, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    window.dispatchEvent(new Event("maskani-booking-leads-changed"));
  } catch {
    // ignore
  }
}

export function calculateBundleTotal(bundle: SelectedDealBundle, currency: "TJS" | "USD" = "TJS") {
  const isUsd = currency === "USD";
  const unitCost = bundle.unit ? (isUsd ? bundle.unit.priceUsd : bundle.unit.priceTjs) : 0;
  const parkingCost = bundle.parking ? (isUsd ? bundle.parking.priceUsd : bundle.parking.priceTjs) : 0;
  const storageCost = bundle.storage ? (isUsd ? bundle.storage.priceUsd : bundle.storage.priceTjs) : 0;

  return {
    unitCost,
    parkingCost,
    storageCost,
    total: unitCost + parkingCost + storageCost,
    hasItems: Boolean(bundle.unit || bundle.parking || bundle.storage),
    itemsCount: (bundle.unit ? 1 : 0) + (bundle.parking ? 1 : 0) + (bundle.storage ? 1 : 0),
  };
}

export function formatSeparatedNumber(num: number): string {
  if (isNaN(num) || num <= 0) return "0";
  return Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Generates selectable half-hour time slots between start and end (e.g. 09:00 - 22:00)
 */
export function generateTimeSlots(
  startHourStr = "09:00",
  endHourStr = "22:00",
  isToday = false
): Array<{ value: string; label: string; disabled: boolean }> {
  const [startHour, startMin] = startHourStr.split(":").map(Number);
  const [endHour, endMin] = endHourStr.split(":").map(Number);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: Array<{ value: string; label: string; disabled: boolean }> = [];

  let current = startHour * 60 + (startMin || 0);
  const finish = endHour * 60 + (endMin || 0);

  while (current <= finish) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    // If it's today, disable slots that have already passed (+15 min buffer)
    const isPast = isToday && current <= currentMinutes + 15;

    slots.push({
      value: timeStr,
      label: timeStr,
      disabled: isPast,
    });

    current += 30; // 30-minute interval
  }

  return slots;
}

export interface ServerBundleVerificationResult {
  valid: boolean;
  status?: number;
  code?: string;
  error?: string;
  resolved?: {
    developerId: string;
    projectId: string;
    projectName: string;
    unitId?: string;
    unitNumber?: string;
    unitPriceTjs?: number;
    unitArea?: number;
    parkingId?: string;
    parkingNumber?: string;
    parkingPriceTjs?: number;
    storageId?: string;
    storageNumber?: string;
    storagePriceTjs?: number;
    totalPriceTjs: number;
  };
}

/**
 * Section 6.2 & Section 14: Zero Client Trust verification of objects, ownership, availability, and prices.
 */
export function verifyAndResolveLeadDealBundle(
  payload: Partial<LeadSubmissionPayload>
): ServerBundleVerificationResult {
  const project = payload.projectId
    ? INITIAL_PROJECTS.find((p) => p.id === payload.projectId || p.slug === payload.projectId)
    : undefined;

  const resolvedDevId = project ? project.developerId : payload.developerId || "dev-1";

  // Section 14: Prevent sending lead to another developer's CRM
  if (project && payload.developerId && payload.developerId !== project.developerId) {
    return {
      valid: false,
      status: 403,
      code: "DEVELOPER_MISMATCH",
      error: "Недопустимый идентификатор застройщика для указанной новостройки.",
    };
  }

  // Verify CRM & scenario settings on server
  const devSettings = getServerCrmSettings(resolvedDevId);
  if (!devSettings.crmConnected) {
    return {
      valid: false,
      status: 403,
      code: "CRM_NOT_ACTIVE",
      error: "CRM_NOT_ACTIVE: CRM застройщика не подключена.",
    };
  }

  if (!devSettings.bookingScenarioEnabled) {
    return {
      valid: false,
      status: 403,
      code: "FEATURE_DISABLED",
      error: "FEATURE_DISABLED: Сценарий заявок на бронирование и звонки выключен.",
    };
  }

  let unitId = payload.unitId;
  let unitNumber = payload.unitNumber;
  let unitPriceTjs = payload.unitPriceTjs || 0;
  let unitArea = payload.unitArea;

  let parkingId = payload.parkingId;
  let parkingNumber = payload.parkingNumber;
  let parkingPriceTjs = payload.parkingPriceTjs || 0;

  let storageId = payload.storageId;
  let storageNumber = payload.storageNumber;
  let storagePriceTjs = payload.storagePriceTjs || 0;

  if (project) {
    // 1. Verify unit against server project units
    if (unitId) {
      const serverUnits = generateUnitsForAnyProject(project);
      const serverUnit = serverUnits.find((u) => u.id === unitId);
      if (!serverUnit) {
        return {
          valid: false,
          status: 400,
          code: "UNIT_NOT_FOUND",
          error: "Выбранная квартира не найдена в данной новостройке.",
        };
      }
      if (serverUnit.status !== "available") {
        return {
          valid: false,
          status: 409,
          code: "UNIT_UNAVAILABLE",
          error: `Квартира №${serverUnit.unitNumber} больше недоступна для выбора. Пожалуйста, выберите другую квартиру.`,
        };
      }
      unitId = serverUnit.id;
      unitNumber = serverUnit.unitNumber;
      unitPriceTjs = serverUnit.priceTjs;
      unitArea = serverUnit.totalArea;
    }

    // 2. Verify parking spot against server project parkingSpots
    if (parkingId) {
      const serverSpot = (project.parkingSpots || []).find((s) => s.id === parkingId);
      if (!serverSpot) {
        return {
          valid: false,
          status: 400,
          code: "PARKING_NOT_FOUND",
          error: "Выбранное машино-место не найдено в данной новостройке.",
        };
      }
      if (serverSpot.status !== "available") {
        return {
          valid: false,
          status: 409,
          code: "PARKING_UNAVAILABLE",
          error: `Машино-место №${serverSpot.number} стало недоступно. Пожалуйста, выберите другое место.`,
        };
      }
      parkingId = serverSpot.id;
      parkingNumber = serverSpot.number;
      parkingPriceTjs = serverSpot.priceTjs;
    }

    // 3. Verify storage unit against server project storageUnits
    if (storageId) {
      const serverStorage = (project.storageUnits || []).find((s) => s.id === storageId);
      if (!serverStorage) {
        return {
          valid: false,
          status: 400,
          code: "STORAGE_NOT_FOUND",
          error: "Выбранная кладовая не найдена в данной новостройке.",
        };
      }
      if (serverStorage.status !== "available") {
        return {
          valid: false,
          status: 409,
          code: "STORAGE_UNAVAILABLE",
          error: `Кладовая №${serverStorage.number} стала недоступна. Пожалуйста, выберите другую кладовую.`,
        };
      }
      storageId = serverStorage.id;
      storageNumber = serverStorage.number;
      storagePriceTjs = serverStorage.priceTjs;
    }
  }

  const totalPriceTjs =
    (unitId ? unitPriceTjs : 0) +
    (parkingId ? parkingPriceTjs : 0) +
    (storageId ? storagePriceTjs : 0);

  return {
    valid: true,
    resolved: {
      developerId: resolvedDevId,
      projectId: project ? project.id : payload.projectId || "unknown-project",
      projectName: project ? project.name : payload.projectName || "Жилой комплекс",
      unitId: unitId || undefined,
      unitNumber: unitId ? unitNumber : undefined,
      unitPriceTjs: unitId ? unitPriceTjs : undefined,
      unitArea: unitId ? unitArea : undefined,
      parkingId: parkingId || undefined,
      parkingNumber: parkingId ? parkingNumber : undefined,
      parkingPriceTjs: parkingId ? parkingPriceTjs : undefined,
      storageId: storageId || undefined,
      storageNumber: storageId ? storageNumber : undefined,
      storagePriceTjs: storageId ? storagePriceTjs : undefined,
      totalPriceTjs,
    },
  };
}
