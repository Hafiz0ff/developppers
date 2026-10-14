import test from "node:test";
import assert from "node:assert/strict";
import { translations } from "../translations";

test("Localization - RU and TG dictionaries have all required sections", () => {
  const sections = ["common", "nav", "marquee", "catalog", "realty", "showcase", "developer"] as const;
  
  for (const lang of ["ru", "tg"] as const) {
    const dict = translations[lang];
    assert.ok(dict, `Dictionary for ${lang} must exist`);
    for (const section of sections) {
      assert.ok(dict[section], `Section ${section} in ${lang} must exist`);
      for (const [key, val] of Object.entries(dict[section])) {
        assert.ok(
          typeof val === "string" && val.trim().length > 0,
          `Key ${section}.${key} in ${lang} must be a non-empty string`
        );
      }
    }
  }
});

test("Localization - TG dictionary avoids prohibited rusisms and calques", () => {
  const tg = translations.tg;

  // Verify pure Tajik terminology
  assert.equal(tg.realty.complex, "Маҷмааи истиқоматӣ");
  assert.equal(tg.common.floor, "ошёна");
  assert.equal(tg.realty.deliveryDate, "Муҳлати супоридан");
  assert.equal(tg.realty.installmentPlan, "Пардохти қисм-қисми бефоиз");
  assert.equal(tg.realty.downPayment, "Пешпардохт");
  assert.equal(tg.showcase.modeFloorPlan, "Тарҳи хонаҳо");
  assert.equal(tg.showcase.interactiveChessboard, "Ҷадвали шоҳмотии хонаҳо");
  assert.equal(tg.showcase.viewFromWindow, "Манзараи панорамӣ аз тирезаҳо");
  assert.equal(tg.showcase.modeCutaway, "Буриши бино");

  // Ensure forbidden terms are not present in Tajik dictionary values
  const forbiddenPatterns = [
    /\bквартира\b/i,
    /\bэтаж\b/i,
    /\bпарковка\b/i,
    /\bсрок сдачи\b/i,
    /\bпланировка\b/i,
    /\bчерновой\b/i,
  ];

  const allTgValues = [
    ...Object.values(tg.common),
    ...Object.values(tg.nav),
    ...Object.values(tg.catalog),
    ...Object.values(tg.realty),
    ...Object.values(tg.showcase),
    ...Object.values(tg.developer),
  ];

  for (const val of allTgValues) {
    for (const pattern of forbiddenPatterns) {
      assert.ok(
        !pattern.test(val),
        `Prohibited rusism matching ${pattern} found in Tajik translation: "${val}"`
      );
    }
  }
});

test("Localization - RU dictionary has pristine real estate terminology", () => {
  const ru = translations.ru;

  assert.equal(ru.realty.complex, "Жилой комплекс");
  assert.equal(ru.common.floor, "этаж");
  assert.equal(ru.realty.deliveryDate, "Срок сдачи");
  assert.equal(ru.realty.installmentPlan, "Беспроцентная рассрочка");
  assert.equal(ru.showcase.interactiveChessboard, "Интерактивная шахматка квартир");
  assert.equal(ru.showcase.modeCutaway, "Вид в срезе");
});
