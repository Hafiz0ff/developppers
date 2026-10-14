export type StandardDocumentType =
  | "construction_permit" // Разрешение на строительство
  | "address_decree"      // Постановление о присвоении адреса
  | "commissioning_act"   // Разрешение на ввод в эксплуатацию
  | "other";              // Дополнительный официальный документ

export interface ProjectDocument {
  id: string;                 // e.g. "doc_qa_permit_01"
  projectId: string;
  type: StandardDocumentType;
  title: string;              // "Разрешение на строительство №142/24"
  titleTg?: string;           // "Иҷозатномаи сохтмон №142/24"
  fileUrl: string;            // URL к оригинальному PDF-файлу
  watermarkedFileUrl?: string;// URL к версии с водяным знаком
  fileSizeKb: number;         // Размер файла в КБ
  publishedAt: string;        // Дата публикации (ISO string)
  updatedAt: string;          // Дата обновления/замены файла (ISO string)
  issuedDate?: string;        // Официальная дата выдачи документа органом
  documentNumber?: string;    // Номер документа
  isPublished: boolean;       // Опубликован ли документ на витрине
}

export interface ProjectDocumentsConfig {
  isEnabled: boolean;             // Включён ли блок «Документы» на витрине
  titlePrefix?: string;           // По умолч.: "Документы"
  titlePrefixTg?: string;         // "Ҳуҷҷатҳо"
  isWatermarkEnabled: boolean;    // Активирован ли водяной знак
  watermarkText?: string;         // Текст водяного знака
  watermarkOpacity?: number;      // Прозрачность (по умолч.: 0.18)
}
