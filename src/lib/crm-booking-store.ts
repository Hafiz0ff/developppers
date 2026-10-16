import { DeveloperCrmSettings, LeadSubmissionPayload, SelectedDealBundle } from "@/types/crm-booking";

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

const STORAGE_KEY_SETTINGS_PREFIX = "maskani_crm_settings_";
const STORAGE_KEY_LEADS = "maskani_booking_leads";

export function getDeveloperCrmSettings(developerId: string): DeveloperCrmSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_SETTINGS_PREFIX}${developerId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }

  return (
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

export function saveDeveloperCrmSettings(settings: DeveloperCrmSettings): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_SETTINGS_PREFIX}${settings.developerId}`,
        JSON.stringify(settings)
      );
      // Dispatch storage event so all components react immediately
      window.dispatchEvent(new Event("maskani-crm-settings-changed"));
    } catch (e) {
      console.error("Failed to save CRM settings to localStorage", e);
    }
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
