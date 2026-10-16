export interface LeadSubmissionPayload {
  // Идентификация
  leadId: string;                     // UUID v4
  type: "booking" | "callback";       // Тип обращения
  developerId: string;                // ID девелопера
  projectId: string;                  // ID жилого комплекса
  projectName?: string;               // Название ЖК

  // Контакты и время связи
  phone: string;                      // Номер телефона в формате (+992...)
  contactMode: "instant_15min" | "scheduled";
  scheduledDate?: string;             // YYYY-MM-DD
  scheduledTime?: string;             // HH:mm (например "14:30")

  // Состав комплекта объектов (Cart context)
  unitId?: string;                    // ID выбранной квартиры
  unitNumber?: string;                // Номер квартиры (например "48")
  unitPriceTjs?: number;              // Цена квартиры на момент отправки
  unitArea?: number;                  // Площадь квартиры

  parkingId?: string;                 // ID выбранного машино-места
  parkingNumber?: string;             // Номер машино-места (например "16")
  parkingPriceTjs?: number;

  storageId?: string;                 // ID кладовой
  storageNumber?: string;             // Номер кладовой (например "12")
  storagePriceTjs?: number;

  totalPriceTjs: number;              // Суммарная стоимость комплекта в TJS
  currency: "TJS" | "USD";

  // Системные метаданные
  consentPersonalData: boolean;       // Обязательно true
  status: "new" | "in_progress" | "contacted" | "booked" | "rejected";
  createdAt: string;                  // ISO 8601
}

export interface DeveloperCrmSettings {
  developerId: string;
  crmConnected: boolean;              // Подключена ли внешняя CRM
  bookingScenarioEnabled: boolean;    // Активен ли сценарий "Заявки на бронирование и звонки"
  workHoursStart: string;             // Например "09:00"
  workHoursEnd: string;               // Например "22:00"
  updatedAt: string;
}

export interface SelectedDealBundle {
  unit?: {
    id: string;
    number: string;
    roomsCount: number;
    floor: number;
    totalArea: number;
    priceTjs: number;
    priceUsd: number;
  } | null;
  parking?: {
    id: string;
    number: string;
    level: string;
    area: number;
    priceTjs: number;
    priceUsd: number;
  } | null;
  storage?: {
    id: string;
    number: string;
    level: string;
    area: number;
    priceTjs: number;
    priceUsd: number;
  } | null;
}
