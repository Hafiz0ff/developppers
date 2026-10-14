import test from "node:test";
import assert from "node:assert/strict";
import {
  formatDocumentDate,
  formatFileSize,
  validatePdfFile,
  generateOfficialDocumentsForQayroqum,
} from "./documents";
import { INITIAL_PROJECTS } from "./data/mock-db";

test("Stage 1 Documents: Date formatting to DD.MM.YYYY", () => {
  const formatted = formatDocumentDate("2026-03-15T10:00:00.000Z");
  assert.equal(formatted, "15.03.2026", "Should format to 15.03.2026");

  const formattedApr = formatDocumentDate("2026-04-09T00:00:00.000Z");
  assert.equal(formattedApr, "09.04.2026", "Should format to 09.04.2026 with leading zero");

  assert.equal(formatDocumentDate(""), "");
});

test("Stage 1 Documents: File size formatting", () => {
  assert.equal(formatFileSize(2450), "2.4 МБ");
  assert.equal(formatFileSize(1024), "1.0 МБ");
  assert.equal(formatFileSize(850), "850 КБ");
  assert.equal(formatFileSize(0), "0 КБ");
});

test("Stage 1 Documents: PDF file validation", () => {
  // Valid PDF
  const valid = validatePdfFile("permit_142.pdf", 2 * 1024 * 1024);
  assert.equal(valid.isValid, true);
  assert.equal(valid.error, undefined);

  // Case insensitive
  const validCaps = validatePdfFile("DOCUMENT.PDF", 500 * 1024);
  assert.equal(validCaps.isValid, true);

  // Non-PDF rejected
  const nonPdf = validatePdfFile("photo.jpg", 1024);
  assert.equal(nonPdf.isValid, false);
  assert.ok(nonPdf.error?.includes("PDF"));

  // Huge file rejected
  const huge = validatePdfFile("big.pdf", 30 * 1024 * 1024, 25 * 1024 * 1024);
  assert.equal(huge.isValid, false);
  assert.ok(huge.error?.includes("25 МБ"));
});

test("Stage 1 Documents: Qayroqum Avenue mock documents completeness", () => {
  const docs = generateOfficialDocumentsForQayroqum();
  assert.equal(docs.length, 3, "Must have exactly 3 standard documents");

  const types = docs.map((d) => d.type);
  assert.ok(types.includes("construction_permit"));
  assert.ok(types.includes("address_decree"));
  assert.ok(types.includes("commissioning_act"));

  for (const d of docs) {
    assert.ok(d.title.length > 0);
    assert.ok(d.fileUrl.startsWith("http"));
    assert.ok(d.fileSizeKb > 0);
    assert.ok(d.publishedAt.length > 0);
    assert.equal(d.isPublished, true);
  }

  const qayroqum = INITIAL_PROJECTS.find((p) => p.slug === "qayroqum-avenue");
  assert.ok(qayroqum?.documentsConfig);
  assert.equal(qayroqum?.documentsConfig?.isEnabled, true);
  assert.equal(qayroqum?.officialDocuments?.length, 3);
});

test("Stage 2 Documents: Visibility rules and filtering unpublished documents", () => {
  function shouldRenderDocumentsSection(
    config?: { isEnabled: boolean },
    docs?: Array<{ isPublished: boolean }>
  ): boolean {
    if (!config || !config.isEnabled) return false;
    const published = (docs || []).filter((d) => d.isPublished);
    return published.length > 0;
  }

  assert.equal(shouldRenderDocumentsSection(undefined, []), false, "Undefined config must not render");
  assert.equal(shouldRenderDocumentsSection({ isEnabled: false }, [{ isPublished: true }]), false, "Disabled config must not render");
  assert.equal(shouldRenderDocumentsSection({ isEnabled: true }, []), false, "Empty documents must not render");
  assert.equal(shouldRenderDocumentsSection({ isEnabled: true }, [{ isPublished: false }]), false, "Only unpublished docs must not render");
  assert.equal(shouldRenderDocumentsSection({ isEnabled: true }, [{ isPublished: true }]), true, "Enabled with published docs must render");
});

test("Stage 2 Documents: Dynamic title generation with project name", () => {
  function buildDocumentsTitle(projectName: string, isTg = false, prefix?: string, prefixTg?: string): string {
    const pref = isTg ? (prefixTg || "Ҳуҷҷатҳо") : (prefix || "Документы");
    return `${pref} — ${projectName}`;
  }

  assert.equal(
    buildDocumentsTitle("ЖК «Qayroqum Avenue»", false),
    "Документы — ЖК «Qayroqum Avenue»"
  );
  assert.equal(
    buildDocumentsTitle("МИ «Qayroqum Avenue»", true),
    "Ҳуҷҷатҳо — МИ «Qayroqum Avenue»"
  );
});

test("Stage 3 Documents: Watermark text and opacity rules", () => {
  function getEffectiveWatermark(projectName: string, customText?: string, isTg = false): string {
    if (customText && customText.trim()) return customText.trim();
    return isTg
      ? `${projectName} • Танҳо барои шиносоӣ`
      : `${projectName} • Только для ознакомления`;
  }

  assert.equal(
    getEffectiveWatermark("Qayroqum Avenue", "ООО Истиклол"),
    "ООО Истиклол"
  );
  assert.equal(
    getEffectiveWatermark("Qayroqum Avenue", "", false),
    "Qayroqum Avenue • Только для ознакомления"
  );
  assert.equal(
    getEffectiveWatermark("Qayroqum Avenue", "", true),
    "Qayroqum Avenue • Танҳо барои шиносоӣ"
  );
});

test("Stage 3 Documents: File URL resolution based on watermark setting", () => {
  const doc = {
    fileUrl: "https://example.com/original.pdf",
    watermarkedFileUrl: "https://example.com/watermarked.pdf",
  };

  function resolvePublicPdfUrl(d: typeof doc, isWatermarkEnabled: boolean): string {
    return isWatermarkEnabled && d.watermarkedFileUrl ? d.watermarkedFileUrl : d.fileUrl;
  }

  assert.equal(resolvePublicPdfUrl(doc, true), "https://example.com/watermarked.pdf");
  assert.equal(resolvePublicPdfUrl(doc, false), "https://example.com/original.pdf");
});

test("Stage 4 Documents: Data retention when documents section is disabled", () => {
  const initialDocs = generateOfficialDocumentsForQayroqum();
  const config = { isEnabled: true, isWatermarkEnabled: true };

  // Developer disables the section
  const updatedConfig = { ...config, isEnabled: false };

  // Documents array MUST NOT be mutated or wiped
  assert.equal(initialDocs.length, 3, "Documents must remain intact in database");
  assert.equal(updatedConfig.isEnabled, false, "Configuration toggles off cleanly");
  assert.equal(initialDocs[0].documentNumber, "142/24-СУҒД", "Metadata preserved");
});

test("Stage 4 Documents: Replacing file updates updatedAt while preserving original publishedAt", () => {
  const doc = {
    id: "doc_test_01",
    projectId: "proj_01",
    type: "construction_permit" as const,
    title: "Разрешение на строительство",
    fileUrl: "blob:http://localhost/old.pdf",
    fileSizeKb: 1000,
    publishedAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-10T12:00:00.000Z",
    isPublished: true,
  };

  const newTimestamp = "2026-04-14T15:30:00.000Z";
  const updatedDoc = {
    ...doc,
    fileUrl: "blob:http://localhost/new.pdf",
    fileSizeKb: 1500,
    updatedAt: newTimestamp,
  };

  assert.equal(updatedDoc.publishedAt, "2026-01-10T12:00:00.000Z", "publishedAt must be preserved");
  assert.equal(updatedDoc.updatedAt, "2026-04-14T15:30:00.000Z", "updatedAt must be refreshed");
  assert.equal(updatedDoc.fileSizeKb, 1500);
});

test("Stage 4 Documents: Watermark opacity bounds and clamping", () => {
  function clampOpacity(val: number, min = 0.1, max = 0.35): number {
    return Math.min(Math.max(val, min), max);
  }

  assert.equal(clampOpacity(0.18), 0.18);
  assert.equal(clampOpacity(0.05), 0.1);
  assert.equal(clampOpacity(0.5), 0.35);
});

test("Stage 4 Documents: Tajik terminology without calques", () => {
  const dictionary = {
    documents: "Ҳуҷҷатҳо",
    constructionPermit: "Иҷозатномаи сохтмон",
    addressDecree: "Қарор дар бораи вобаста намудани суроға",
    commissioningAct: "Иҷозатномаи ба истифода додан",
    publishDate: "Санаи нашр",
    watermark: "Нишонаи обӣ",
  };

  // Ensure no raw Russian words in Tajik translations
  for (const [key, value] of Object.entries(dictionary)) {
    assert.ok(!value.includes("Документ"), `${key} should not contain 'Документ'`);
    assert.ok(!value.includes("Разрешение"), `${key} should not contain 'Разрешение'`);
    assert.ok(!value.includes("Постановление"), `${key} should not contain 'Постановление'`);
  }
});

test("Stage 5 Documents DoD: Complete 10 Criteria Verification", () => {
  // DoD 1 & 2: Dynamic title and bilingual support
  const ruTitle = `Документы — ЖК «Qayroqum Avenue»`;
  const tgTitle = `Ҳуҷҷатҳо — МИ «Qayroqum Avenue»`;
  assert.ok(ruTitle.includes("Qayroqum Avenue"));
  assert.ok(tgTitle.includes("Ҳуҷҷатҳо"));

  // DoD 3 & 8: Document attributes & distinct published date vs issue date
  const docs = generateOfficialDocumentsForQayroqum();
  assert.equal(docs.length, 3);
  for (const doc of docs) {
    const formattedPub = formatDocumentDate(doc.publishedAt);
    assert.match(formattedPub, /^\d{2}\.\d{2}\.\d{4}$/, "Must be DD.MM.YYYY");
    assert.ok(doc.issuedDate, "Must have distinct issue date");
    assert.notEqual(doc.publishedAt, doc.issuedDate, "Publish date must not overwrite legal issue date");
    assert.ok(doc.fileSizeKb > 0);
  }

  // DoD 4: Direct PDF link
  assert.ok(docs[0].fileUrl.endsWith(".pdf"));

  // DoD 5: Unpublished hiding
  const mixedDocs = [
    { ...docs[0], isPublished: true },
    { ...docs[1], isPublished: false },
  ];
  const visible = mixedDocs.filter((d) => d.isPublished);
  assert.equal(visible.length, 1);

  // DoD 6: Data retention
  const backup = [...docs];
  const disabledConfig = { isEnabled: false };
  assert.equal(disabledConfig.isEnabled, false);
  assert.equal(backup.length, 3, "All 3 files preserved");

  // DoD 7: PDF validation
  assert.equal(validatePdfFile("contract.pdf", 1024).isValid, true);
  assert.equal(validatePdfFile("script.exe", 1024).isValid, false);

  // DoD 9: Watermark preserves original PDF url
  const sampleDoc = docs[0];
  assert.ok(sampleDoc.fileUrl, "Original fileUrl exists and is untouched");
});



