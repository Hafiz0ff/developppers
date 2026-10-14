import test from "node:test";
import assert from "node:assert/strict";
import { INITIAL_DEVELOPERS, INITIAL_PROJECTS } from "./mock-db";

test("Developers - All verified developers in Sughd exist and have valid structure", () => {
  assert.equal(INITIAL_DEVELOPERS.length >= 3, true);

  const slugs = new Set(INITIAL_DEVELOPERS.map((d) => d.slug));
  assert.equal(slugs.has("qayroqum-avenue-dev"), true);
  assert.equal(slugs.has("istiqlol-group"), true);
  assert.equal(slugs.has("toch-sohtmon"), true);

  for (const dev of INITIAL_DEVELOPERS) {
    assert.ok(dev.id, "Developer must have an id");
    assert.ok(dev.name, "Developer must have a name");
    assert.ok(dev.slug, "Developer must have a url-safe slug");
    assert.ok(dev.logoUrl, "Developer must have a logo URL");
    assert.ok(dev.coverUrl, "Developer must have a cover URL");
    assert.ok(dev.description, "Developer must have a description");
    assert.ok(dev.foundedYear >= 2000 && dev.foundedYear <= 2026, "Founded year must be reasonable");
    assert.ok(dev.phone.startsWith("+992"), "Phone must be in Tajikistan +992 format");
    assert.ok(dev.whatsapp.includes("992"), "WhatsApp must contain 992");
    assert.equal(dev.isVerified, true, "All primary developers must be verified");

    const ratingNum = parseFloat(dev.rating);
    assert.ok(!isNaN(ratingNum) && ratingNum >= 4.0 && ratingNum <= 5.0, "Rating must be between 4.0 and 5.0");
  }
});

test("Developers - Bilingual localization fields are populated and pure", () => {
  for (const dev of INITIAL_DEVELOPERS) {
    assert.ok(dev.description, "Must have Russian description");
    assert.ok(dev.descriptionTg, "Must have Tajik description");
    assert.ok(dev.officeAddress, "Must have Russian office address");
    assert.ok(dev.officeAddressTg, "Must have Tajik office address");

    // Pure literary Tajik check
    assert.doesNotMatch(dev.descriptionTg, /комплекс/i, "Tajik description should avoid 'комплекс'");
    assert.doesNotMatch(dev.descriptionTg, /застройщик/i, "Tajik description should avoid 'застройщик'");
    assert.doesNotMatch(dev.descriptionTg, /квартира/i, "Tajik description should avoid 'квартира'");
  }
});

test("Developers - Every developer maps to their residential complexes in Sughd", () => {
  for (const dev of INITIAL_DEVELOPERS) {
    const devProjects = INITIAL_PROJECTS.filter((p) => p.developerId === dev.id);
    assert.ok(devProjects.length >= 1, `Developer ${dev.name} must have at least 1 complex`);

    for (const proj of devProjects) {
      assert.equal(proj.developerId, dev.id);
      assert.ok(proj.name, "Project must have a name");
      assert.ok(proj.slug, "Project must have a slug");
      assert.ok(proj.minPricePerMeterUsd > 0, "Price per meter must be positive");
      assert.ok(proj.minTotalPriceUsd > 0, "Total price must be positive");
    }
  }

  // Total projects in catalog across developers
  const totalCatalogProjects = INITIAL_PROJECTS.filter((p) =>
    INITIAL_DEVELOPERS.some((d) => d.id === p.developerId)
  );
  assert.equal(totalCatalogProjects.length >= 25, true, "Should have 25+ complexes across developers");
});
