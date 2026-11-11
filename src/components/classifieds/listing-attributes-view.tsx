"use client";

import React, { useMemo } from "react";
import { formatAttributesForDisplay, FormattedSection } from "@/lib/classifieds/attributes";
import { Language } from "@/lib/i18n/translations";
import { ListingIcon, AmenityTile } from "@/components/ui/listing-icon";
import { Info } from "lucide-react";

export interface ListingAttributesViewProps {
  attributes: Record<string, unknown> | null | undefined;
  dealType: string;
  category: string;
  language: Language;
  className?: string;
}

export function ListingAttributesView({
  attributes,
  dealType,
  category,
  language,
  className = "",
}: ListingAttributesViewProps) {
  const sections: FormattedSection[] = useMemo(() => {
    return formatAttributesForDisplay(attributes, language, dealType, category);
  }, [attributes, language, dealType, category]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {sections.map((sec) => {
        const isLegal = sec.code === "legal_info";
        const isAmenities = sec.code === "amenities" || sec.code === "commercial_infrastructure";
        const booleanItems = sec.items.filter((item) => item.valueType === "boolean");
        const complexItems = sec.items.filter((item) => item.valueType !== "boolean");

        return (
          <div
            key={sec.code}
            className={`rounded-3xl border p-5 sm:p-7 transition-all ${
              isLegal
                ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30"
                : "bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-xs"
            }`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5 mb-5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{sec.title}</span>
                {isLegal && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    {language === "tg" ? "Маълумоти фурӯшанда" : language === "en" ? "Seller declared" : "Заявлено продавцом"}
                  </span>
                )}
              </h3>
            </div>

            {/* Legal Notice */}
            {isLegal && (
              <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5 text-xs text-amber-900 dark:text-amber-200">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {language === "tg"
                    ? "Маълумоти мазкур аз ҷониби фурӯшанда пешниҳод шудааст ва ҳангоми бастани шартнома бояд тафтиш шавад."
                    : language === "en"
                    ? "This legal information was declared by the seller and must be verified prior to completing the transaction."
                    : "Данная юридическая информация заявлена продавцом и подлежит проверке при оформлении сделки."}
                </span>
              </div>
            )}

            {/* Boolean Amenities & Features — Elevated Squircle Grid as in Reference Design */}
            {booleanItems.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-6 gap-x-3 sm:gap-x-4 justify-items-center py-2">
                  {booleanItems.map((item) => (
                    <AmenityTile
                      key={item.code}
                      iconKey={item.iconKey}
                      label={item.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Complex Attributes (Numbers, Enums, Metrics) */}
            {complexItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs pt-1">
                {complexItems.map((item) => (
                  <div
                    key={item.code}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                      <ListingIcon iconKey={item.iconKey} className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm truncate">
                      {item.displayValue}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
