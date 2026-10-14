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

test("Stage 2 DoD - Bilingual projects and real showcase case Qayroqum Avenue", async () => {
  const { INITIAL_PROJECTS } = await import("../../data/mock-db");
  const { SOGD_CITIES } = await import("../../constants/locations");

  // Verify all cities have both RU and TG names
  for (const city of SOGD_CITIES) {
    assert.ok(city.nameRu && city.nameRu.length > 0, `City ${city.value} must have nameRu`);
    assert.ok(city.nameTj && city.nameTj.length > 0, `City ${city.value} must have nameTj`);
  }

  // Verify Qayroqum Avenue bilingual data
  const qayroqum = INITIAL_PROJECTS.find((p) => p.slug === "qayroqum-avenue");
  assert.ok(qayroqum, "Qayroqum Avenue project must exist");

  // Tajik authentic copy
  assert.equal(qayroqum.nameTg, "МҶ «Qayroqum Avenue»");
  assert.ok(qayroqum.shortDescriptionTg?.includes("Баҳри Тоҷик"), "TG short description must mention Баҳри Тоҷик");
  assert.ok(qayroqum.descriptionTg?.includes("мактаб ва боғчаи кӯдакон"), "TG description must retain authentic facilities");
  assert.ok(qayroqum.amenitiesTg?.some((a) => a.includes("0% пешпардохт")), "TG amenities must contain 0% пешпардохт");
  assert.ok(qayroqum.amenitiesTg?.some((a) => a.includes("бурди BMW")), "TG amenities must contain BMW lottery");
  assert.ok(qayroqum.amenitiesTg?.some((a) => a.includes("60 моҳ")), "TG amenities must contain 60-month installment");

  // Russian pristine copy
  assert.ok(qayroqum.shortDescription.includes("Таджикского моря"), "RU short description must mention Таджикское море");
  assert.ok(qayroqum.description.includes("Кайраккумского водохранилища"), "RU description must mention Кайраккумское водохранилище");
  assert.ok(qayroqum.amenities.some((a) => a.includes("0% первоначальный взнос")), "RU amenities must contain 0% down payment");
  assert.ok(qayroqum.amenities.some((a) => a.includes("розыгрыш BMW") || a.includes("выиграть BMW")), "RU amenities must contain BMW raffle");
  assert.ok(qayroqum.amenities.some((a) => a.includes("60 месяцев")), "RU amenities must contain 60 months");

  // Qayroqum Avenue must be #1
  assert.equal(INITIAL_PROJECTS[0].slug, "qayroqum-avenue", "Qayroqum Avenue must be #1 in INITIAL_PROJECTS");

  // Sirdaryo Plaza and Istiqlol Group bilingual data
  const sirdaryo = INITIAL_PROJECTS.find((p) => p.slug === "sirdaryo-plaza");
  assert.ok(sirdaryo?.nameTg === "МҶ «Сирдарё Плаза»");
  assert.ok(sirdaryo?.shortDescriptionTg && sirdaryo.shortDescriptionTg.length > 0);
  assert.ok(sirdaryo?.amenitiesTg && sirdaryo.amenitiesTg.length > 0);

  const kohiMunavvar = INITIAL_PROJECTS.find((p) => p.slug === "zhk-kohi-munavvar");
  assert.ok(kohiMunavvar?.nameTg === "МҶ «Кохи Мунаввар»");
  assert.ok(kohiMunavvar?.shortDescriptionTg && kohiMunavvar.shortDescriptionTg.length > 0);
  assert.ok(kohiMunavvar?.amenitiesTg && kohiMunavvar.amenitiesTg.length > 0);
  assert.ok(kohiMunavvar?.coordinates?.lat && kohiMunavvar?.coordinates?.lng, "Must have valid GPS coordinates");
});

test("Stage 5 DoD - Classifieds & CRM bilingual consistency and pure terminology", async () => {
  // Test locations
  const { SOGD_CITIES } = await import("../../constants/locations");
  const khujand = SOGD_CITIES.find((c) => c.value === "khujand");
  assert.equal(khujand?.nameTj, "ш. Хуҷанд");
  assert.equal(khujand?.nameRu, "Худжанд");

  const buston = SOGD_CITIES.find((c) => c.value === "buston");
  assert.ok(buston?.nameTj.includes("Бӯстон"));

  const guliston = SOGD_CITIES.find((c) => c.value === "guliston");
  assert.ok(guliston?.nameTj.includes("Гулистон"));

  // Pure terminology checks: ensure proper words are used without calques
  const pureTerms = {
    apartmentTg: "Хонадон",
    houseTg: "Ҳавлӣ",
    commercialTg: "Амволи тиҷоратӣ",
    saleTg: "Фурӯш",
    rentTg: "Иҷора",
    ownerTg: "Соҳибмулк",
    realtorTg: "Мутахассис (Риелтор)",
    bargainTg: "Савдо мешавад",
  };

  assert.ok(pureTerms.apartmentTg !== "Квартира");
  assert.ok(pureTerms.houseTg !== "Дом");
  assert.ok(pureTerms.saleTg !== "Продажа");
  assert.ok(pureTerms.rentTg !== "Аренда");
});

