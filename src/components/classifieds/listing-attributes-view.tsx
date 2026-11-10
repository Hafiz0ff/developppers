"use client";

import React, { useMemo } from "react";
import { formatAttributesForDisplay, FormattedSection } from "@/lib/classifieds/attributes";
import { Language } from "@/lib/i18n/translations";
import { ListingIcon } from "@/components/ui/listing-icon";
import { CheckCircle2, Info } from "lucide-react";

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
    <div className={`space-y-5 ${className}`}>
      {sections.map((sec) => {
        const isLegal = sec.code === "legal_info";

        return (
          <div
            key={sec.code}
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
              isLegal
                ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30"
                : "bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800"
            }`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{sec.title}</span>
                {isLegal && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    {language === "tg" ? "Маълумоти фурӯшанда" : language === "en" ? "Seller declared" : "Заявлено продавцом"}
                  </span>
                )}
              </h3>
            </div>

            {/* Legal Notice */}
            {isLegal && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4 text-xs text-amber-900 dark:text-amber-200">
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

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {sec.items.map((item) => {
                const isBoolean = item.valueType === "boolean";

                if (isBoolean) {
                  return (
                    <div
                      key={item.code}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <ListingIcon iconKey={item.iconKey} className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.code}
                    className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px]">
                      <ListingIcon iconKey={item.iconKey} className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm truncate">
                      {item.displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
