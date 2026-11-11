"use client";

import React from "react";
import {
  ListingSectionDefinition,
  ListingAttributeDefinition,
} from "@/lib/classifieds/attributes";
import { Language } from "@/lib/i18n/translations";
import { ListingIcon, AmenityTile } from "@/components/ui/listing-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Info } from "lucide-react";

export interface AttributeFormSectionProps {
  section: ListingSectionDefinition;
  attributes: ListingAttributeDefinition[];
  values: Record<string, unknown>;
  onChange: (code: string, value: unknown) => void;
  errors?: Record<string, string>;
  language: Language;
}

export function AttributeFormSection({
  section,
  attributes,
  values,
  onChange,
  errors = {},
  language,
}: AttributeFormSectionProps) {
  if (attributes.length === 0) return null;

  const sectionTitle = section.labels[language] || section.labels.ru;
  const isLegal = section.code === "legal_info";

  // Split attributes into booleans (toggles) and inputs/enums for optimal layout
  const booleanAttrs = attributes.filter((a) => a.valueType === "boolean");
  const complexAttrs = attributes.filter((a) => a.valueType !== "boolean");

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 transition-all">
      {/* Section Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{sectionTitle}</span>
            {isLegal && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {language === "tg" ? "Танҳо фурӯш" : language === "en" ? "Sale only" : "Только продажа"}
              </span>
            )}
          </h3>
          {isLegal && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>
                {language === "tg"
                  ? "Маълумоти ҳуқуқӣ аз ҷониби фурӯшанда пешниҳод мешавад ва пеш аз ақди аҳд бояд санҷида шавад"
                  : language === "en"
                  ? "Legal details are self-declared by seller and subject to verification"
                  : "Юридические данные заявляются продавцом и подлежат проверке перед сделкой"}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Complex Inputs (Numbers, Enums, Texts) */}
      {complexAttrs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complexAttrs.map((attr) => {
            const val = values[attr.code];
            const error = errors[attr.code];
            const label = attr.labels[language] || attr.labels.ru;
            const hint = attr.hint ? attr.hint[language] || attr.hint.ru : undefined;
            const unit = attr.unit ? attr.unit[language] || attr.unit.ru : undefined;

            return (
              <div key={attr.code} className="space-y-1.5">
                <Label
                  htmlFor={`attr_${attr.code}`}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ListingIcon iconKey={attr.iconKey} className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{label}</span>
                  {attr.required && <span className="text-rose-500">*</span>}
                </Label>

                {/* Enum Selector */}
                {attr.valueType === "enum" && (
                  <select
                    id={`attr_${attr.code}`}
                    value={val !== undefined && val !== null ? String(val) : ""}
                    onChange={(e) => onChange(attr.code, e.target.value || undefined)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 ${
                      error
                        ? "border-rose-400 ring-rose-200"
                        : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-200"
                    }`}
                  >
                    <option value="">
                      {language === "tg"
                        ? "— Интихоб кунед —"
                        : language === "en"
                        ? "— Select —"
                        : "— Выберите —"}
                    </option>
                    {(attr.enumValues || []).map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.labels[language] || opt.labels.ru}
                      </option>
                    ))}
                  </select>
                )}

                {/* Numerical / Integer Input */}
                {(attr.valueType === "integer" || attr.valueType === "number") && (
                  <div className="relative">
                    <Input
                      id={`attr_${attr.code}`}
                      type="number"
                      min={attr.min}
                      max={attr.max}
                      step={attr.step || (attr.valueType === "integer" ? 1 : 0.01)}
                      placeholder={attr.min !== undefined ? `от ${attr.min}` : ""}
                      value={val !== undefined && val !== null ? String(val) : ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          onChange(attr.code, undefined);
                        } else {
                          const n = attr.valueType === "integer" ? parseInt(raw, 10) : parseFloat(raw);
                          onChange(attr.code, isNaN(n) ? undefined : n);
                        }
                      }}
                      className={`text-xs pr-10 ${error ? "border-rose-400 ring-rose-200" : ""}`}
                    />
                    {unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">
                        {unit}
                      </span>
                    )}
                  </div>
                )}

                {/* Free Text Input */}
                {attr.valueType === "text" && (
                  <Input
                    id={`attr_${attr.code}`}
                    type="text"
                    maxLength={100}
                    value={val !== undefined && val !== null ? String(val) : ""}
                    onChange={(e) => onChange(attr.code, e.target.value || undefined)}
                    className={`text-xs ${error ? "border-rose-400 ring-rose-200" : ""}`}
                  />
                )}

                {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
                {error && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Boolean Toggles Grid — Unified Squircle Amenity Tiles */}
      {booleanAttrs.length > 0 && (
        <div className="space-y-3 pt-1">
          {complexAttrs.length > 0 && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {language === "tg" ? "Иловагӣ" : language === "en" ? "Options" : "Дополнительные удобства"}
            </span>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-6 gap-x-3 sm:gap-x-4 justify-items-center py-2">
            {booleanAttrs.map((attr) => {
              const isChecked = values[attr.code] === true;
              const label = attr.labels[language] || attr.labels.ru;

              return (
                <AmenityTile
                  key={attr.code}
                  iconKey={attr.iconKey}
                  label={label}
                  selected={isChecked}
                  selectable
                  onClick={() => onChange(attr.code, !isChecked)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
