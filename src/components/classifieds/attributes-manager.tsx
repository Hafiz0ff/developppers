"use client";

import React, { useMemo } from "react";
import {
  getApplicableSections,
  getApplicableAttributes,
  ListingSectionDefinition,
} from "@/lib/classifieds/attributes";
import { Language } from "@/lib/i18n/translations";
import { AttributeFormSection } from "./attribute-form-section";

export interface AttributesManagerProps {
  dealType: string;
  category: string;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  language: Language;
}

/**
 * Strips attributes that are not applicable to the specified dealType and category.
 * Used before form submission to ensure clean payloads (TZ Section 10 Stage 3).
 */
export function sanitizeIncompatibleAttributes(
  dealType: string,
  category: string,
  values: Record<string, unknown>
): Record<string, unknown> {
  const applicableAttrs = getApplicableAttributes(dealType, category);
  const applicableCodes = new Set(applicableAttrs.map((a) => a.code));

  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(values)) {
    if (applicableCodes.has(key) && val !== undefined && val !== null && val !== "") {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

export function AttributesManager({
  dealType,
  category,
  values,
  onChange,
  errors = {},
  language,
}: AttributesManagerProps) {
  // Dynamically calculate applicable sections and attributes
  const applicableSections = useMemo(
    () => getApplicableSections(dealType, category),
    [dealType, category]
  );

  const applicableAttributes = useMemo(
    () => getApplicableAttributes(dealType, category),
    [dealType, category]
  );

  const handleFieldChange = (code: string, val: unknown) => {
    const next = { ...values };
    if (val === undefined || val === null || val === "") {
      delete next[code];
    } else {
      next[code] = val;
    }
    onChange(next);
  };

  if (applicableSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {applicableSections.map((section: ListingSectionDefinition) => {
        const sectionAttributes = applicableAttributes.filter(
          (a) => a.sectionCode === section.code
        );

        if (sectionAttributes.length === 0) return null;

        return (
          <AttributeFormSection
            key={section.code}
            section={section}
            attributes={sectionAttributes}
            values={values}
            onChange={handleFieldChange}
            errors={errors}
            language={language}
          />
        );
      })}
    </div>
  );
}
