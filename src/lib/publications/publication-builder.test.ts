import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildClassifiedPublicationText,
  buildProjectPublicationText,
  preparePublicationMaterial,
  formatPublicationPrice,
  hasPublishedTranslation,
} from "./publication-builder";
import { buildZipArchive, collectPublicImagesForZip } from "./zip-builder";
import { CATALOG_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS } from "@/lib/data/mock-db";
import zlib from "node:zlib";

describe("MASKANI.TJ — Module «Object Publication» (Specification v1.1)", () => {
  // Test listing sample
  const sampleApartment = CATALOG_PROPERTIES[0]; // 17034738, 1-комн. квартира в Шёлкокомбинате
  const sampleProject = INITIAL_PROJECTS[0]; // proj_qayroqum
  const sampleDev = INITIAL_DEVELOPERS[0]; // dev_qayroqum

  test("Price Formatter: formats TJS and USD with thousands separators", () => {
    const formattedRu = formatPublicationPrice(360000, 32877, "ru");
    assert.match(formattedRu, /360\s*000\s*сомони/);
    assert.match(formattedRu, /\$32[, ]877/);

    const formattedTg = formatPublicationPrice(250000, 0, "tg");
    assert.match(formattedTg, /250\s*000\s*сомонӣ/);
  });

  test("Classified Publication Text: generates 7-part universal structure strictly from facts", () => {
    const { text, title, canonicalUrl } = buildClassifiedPublicationText(
      sampleApartment,
      "ru",
      "https://maskani.tj"
    );

    // 1. Title
    assert.ok(text.includes(sampleApartment.title));
    assert.equal(title, sampleApartment.title);

    // 2. Price
    assert.ok(text.includes("Цена:"));
    assert.ok(text.includes("360"));

    // 3. Location
    assert.ok(text.includes("Местоположение:"));
    assert.ok(text.includes("Худжанд"));
    assert.ok(text.includes("Шёлкокомбинат"));

    // 4. Characteristics
    assert.ok(text.includes("Площадь: 44 м²"));
    assert.ok(text.includes("Комнат: 1"));
    assert.ok(text.includes("Этаж: 4 из 5 этаж"));

    // 5. Description
    assert.ok(text.includes("Описание:"));
    assert.ok(text.includes(sampleApartment.description.slice(0, 30)));

    // 6. Public contacts
    assert.ok(text.includes("Контакты:"));
    assert.ok(text.includes(sampleApartment.phone));

    // 7. Canonical URL from central resolver
    assert.ok(text.includes("Подробнее на Maskani.tj:"));
    assert.ok(text.includes(canonicalUrl));
    assert.match(canonicalUrl, /^https:\/\/maskani\.tj\/khujand\/kupit\/vtorichka/);
  });

  test("Tajik Language: uses authentic Tajik fields without mixing languages", () => {
    const { text, title, canonicalUrl } = buildClassifiedPublicationText(
      sampleApartment,
      "tg",
      "https://maskani.tj"
    );

    // Should use titleTg
    assert.equal(title, sampleApartment.titleTg);
    assert.ok(text.includes(sampleApartment.titleTg!));

    // Labels in Tajik
    assert.ok(text.includes("Нарх:"));
    assert.ok(text.includes("Макон:"));
    assert.ok(text.includes("Масоҳат: 44 м²"));
    assert.ok(text.includes("Ҳуҷраҳо: 1"));
    assert.ok(text.includes("Тамос:"));
    assert.ok(text.includes("Маълумоти бештар дар сомона:"));

    // Canonical URL with /tg prefix
    assert.match(canonicalUrl, /^https:\/\/maskani\.tj\/tg\/khujand\/furosh\/bozori-duyum/);
  });

  test("Language Validation: rejects generation if translation for locale is missing (TZ Rule 8.1)", () => {
    // Clone property without English translation
    const propWithoutEn: CatalogProperty = {
      ...sampleApartment,
      id: "test_no_en",
    };

    assert.equal(hasPublishedTranslation(propWithoutEn, "ru"), true);
    assert.equal(hasPublishedTranslation(propWithoutEn, "tg"), true);
    assert.equal(hasPublishedTranslation(propWithoutEn, "en"), false);

    const result = preparePublicationMaterial({
      objectType: "classified",
      classified: propWithoutEn,
      locale: "en",
    });

    assert.ok("error" in result);
    assert.equal(result.error, "no_translation");
    assert.ok(result.message.includes("English"));
  });

  test("Developer Project Text: generates complete new building showcase with installment terms", () => {
    const { text, title, canonicalUrl } = buildProjectPublicationText(
      sampleProject,
      sampleDev,
      "ru",
      "https://maskani.tj"
    );

    assert.ok(text.includes(sampleProject.name));
    assert.equal(title, sampleProject.name);
    assert.ok(text.includes("Застройщик:"));
    assert.ok(text.includes(sampleDev.name));
    assert.ok(text.includes("Строится"));
    assert.ok(text.includes("Рассрочка:"));
    assert.ok(text.includes("до 60 мес."));
    assert.ok(text.includes("взнос от 0%"));
    assert.ok(text.includes("https://maskani.tj/projects/qayroqum-avenue"));
    assert.equal(canonicalUrl, "https://maskani.tj/projects/qayroqum-avenue");
  });

  test("Security & Path Traversal: collectPublicImagesForZip blocks traversal and private files", () => {
    // Attempt directory traversal
    const maliciousPaths = [
      "../../etc/passwd",
      "/../../.env.local",
      "../../../package.json",
      "secret_contracts.pdf", // Disallowed extension
    ];

    const collected = collectPublicImagesForZip(maliciousPaths);
    assert.equal(collected.length, 0, "All malicious and non-image paths must be blocked");
  });

  test("ZIP Generator: produces valid standard PKZIP archive with CRC32", () => {
    const testFiles = [
      { name: "photo-01.jpg", content: Buffer.from("fake JPEG binary content 1") },
      { name: "photo-02.jpg", content: Buffer.from("fake JPEG binary content 2") },
    ];

    const zipBuffer = buildZipArchive(testFiles);
    assert.ok(zipBuffer.length > 50, "Zip buffer must contain data");

    // Check standard ZIP local header signature 0x04034b50
    assert.equal(zipBuffer.readUInt32LE(0), 0x04034b50);

    // Verify End of Central Directory signature 0x06054b50 at end of file
    const eocdIndex = zipBuffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    assert.ok(eocdIndex > 0, "EOCD signature must exist");
  });
});
