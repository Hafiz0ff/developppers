import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sanitizeIncompatibleAttributes } from "@/components/classifieds/attributes-manager";

describe("Stage 4 - Cabinets and Publication Flow", () => {
  describe("sanitizeIncompatibleAttributes", () => {
    it("strips legal_info attributes when dealType is rent", () => {
      const raw = {
        ceiling_height: 3.2,
        minor_owners: true,
        has_encumbrance: false,
        wifi: true,
      };

      const sanitized = sanitizeIncompatibleAttributes("rent_long", "apartment", raw);

      assert.equal(sanitized.ceiling_height, 3.2);
      assert.equal(sanitized.wifi, true);
      assert.equal(sanitized.minor_owners, undefined);
      assert.equal(sanitized.has_encumbrance, undefined);
    });

    it("retains legal_info attributes when dealType is sale and category is apartment", () => {
      const raw = {
        ceiling_height: 3.0,
        minor_owners: false,
        elevators_count: 2,
      };

      const sanitized = sanitizeIncompatibleAttributes("sale", "apartment", raw);

      assert.equal(sanitized.ceiling_height, 3.0);
      assert.equal(sanitized.minor_owners, false);
      assert.equal(sanitized.elevators_count, 2);
    });

    it("strips commercial sections for residential categories", () => {
      const raw = {
        ceiling_height: 2.8,
        building_class: "a",
        fire_extinguishing: true,
        electricity_power_kwt: 50,
      };

      const sanitized = sanitizeIncompatibleAttributes("sale", "apartment", raw);

      assert.equal(sanitized.ceiling_height, 2.8);
      assert.equal(sanitized.building_class, undefined);
      assert.equal(sanitized.fire_extinguishing, undefined);
      assert.equal(sanitized.electricity_power_kwt, undefined);
    });

    it("retains commercial attributes for commercial category", () => {
      const raw = {
        building_class: "a",
        is_in_business_center: true,
        fire_extinguishing: true,
        electricity_power_kwt: 30,
        comm_ceiling_height: 3.5,
      };

      const sanitized = sanitizeIncompatibleAttributes("rent_long", "commercial", raw);

      assert.equal(sanitized.building_class, "a");
      assert.equal(sanitized.is_in_business_center, true);
      assert.equal(sanitized.fire_extinguishing, true);
      assert.equal(sanitized.electricity_power_kwt, 30);
      assert.equal(sanitized.comm_ceiling_height, 3.5);
    });
  });

  describe("Draft persistence simulation", () => {
    it("serializes and deserializes draft structure correctly", () => {
      const draft = {
        dealType: "sale",
        propertyType: "apartment",
        title: "3-комнатная квартира",
        priceUsd: "50000",
        priceTjs: "547500",
        attributes: {
          ceiling_height: 3.0,
          elevators_count: 1,
        },
        savedAt: new Date().toISOString(),
      };

      const serialized = JSON.stringify(draft);
      const parsed = JSON.parse(serialized);

      assert.equal(parsed.dealType, "sale");
      assert.equal(parsed.propertyType, "apartment");
      assert.equal(parsed.attributes.ceiling_height, 3.0);
      assert.equal(parsed.attributes.elevators_count, 1);
    });
  });

  describe("Moderation rejection requirements", () => {
    it("validates that rejected status requires non-empty moderationNote", () => {
      function validateRejection(status: string, note?: string) {
        if (status === "rejected" && (!note || note.trim() === "")) {
          return { valid: false, error: "moderation_note_required" };
        }
        return { valid: true };
      }

      assert.equal(validateRejection("rejected", "").valid, false);
      assert.equal(validateRejection("rejected", "   ").valid, false);
      assert.equal(validateRejection("rejected", undefined).valid, false);
      assert.equal(validateRejection("rejected", "Некорректная цена").valid, true);
      assert.equal(validateRejection("active").valid, true);
      assert.equal(validateRejection("archived").valid, true);
    });
  });
});
