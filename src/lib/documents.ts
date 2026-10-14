import { ProjectDocument, StandardDocumentType } from "@/types/documents";

/**
 * Formats ISO date string to DD.MM.YYYY
 */
export function formatDocumentDate(dateIso: string): string {
  if (!dateIso) return "";
  try {
    const d = new Date(dateIso);
    if (isNaN(d.getTime())) return dateIso;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateIso;
  }
}

/**
 * Formats file size in KB to readable string (e.g., "2.4 МБ" or "850 КБ")
 */
export function formatFileSize(kb: number): string {
  if (!kb || kb <= 0) return "0 КБ";
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} МБ`;
  }
  return `${Math.round(kb)} КБ`;
}

/**
 * Validates PDF file name and size (max 25MB by default)
 */
export function validatePdfFile(
  fileName: string,
  sizeBytes: number,
  maxBytes = 25 * 1024 * 1024
): { isValid: boolean; error?: string } {
  if (!fileName) {
    return { isValid: false, error: "Файл не выбран" };
  }

  const isPdf = fileName.trim().toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return {
      isValid: false,
      error: "Допустимы только файлы в формате PDF (.pdf)",
    };
  }

  if (sizeBytes > maxBytes) {
    return {
      isValid: false,
      error: `Размер файла превышает лимит ${(maxBytes / (1024 * 1024)).toFixed(0)} МБ`,
    };
  }

  return { isValid: true };
}

/**
 * Generates official documents for flagship project «Qayroqum Avenue»
 */
export function generateOfficialDocumentsForQayroqum(): ProjectDocument[] {
  return [
    {
      id: "doc_qa_permit_01",
      projectId: "proj_qayroqum",
      type: "construction_permit",
      title: "Разрешение на строительство №142/24",
      titleTg: "Иҷозатномаи сохтмон №142/24",
      documentNumber: "142/24-СУҒД",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      watermarkedFileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSizeKb: 2450, // 2.4 MB
      issuedDate: "2024-03-12T00:00:00.000Z",
      publishedAt: "2026-03-15T10:00:00.000Z",
      updatedAt: "2026-03-15T10:00:00.000Z",
      isPublished: true,
    },
    {
      id: "doc_qa_address_02",
      projectId: "proj_qayroqum",
      type: "address_decree",
      title: "Постановление о присвоении адреса №89-п",
      titleTg: "Қарор дар бораи вобаста намудани суроға №89-п",
      documentNumber: "89-п/ГУЛ",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      watermarkedFileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSizeKb: 1180, // 1.2 MB
      issuedDate: "2024-04-18T00:00:00.000Z",
      publishedAt: "2026-04-20T11:30:00.000Z",
      updatedAt: "2026-04-20T11:30:00.000Z",
      isPublished: true,
    },
    {
      id: "doc_qa_commissioning_03",
      projectId: "proj_qayroqum",
      type: "commissioning_act",
      title: "Разрешение на ввод в эксплуатацию (1-я очередь)",
      titleTg: "Иҷозатномаи ба истифода додан (навбати 1)",
      documentNumber: "07/26-ДАВЛ",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      watermarkedFileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSizeKb: 3420, // 3.4 MB
      issuedDate: "2026-08-25T00:00:00.000Z",
      publishedAt: "2026-09-01T09:00:00.000Z",
      updatedAt: "2026-09-01T09:00:00.000Z",
      isPublished: true,
    },
  ];
}
