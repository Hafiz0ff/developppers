"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Translations, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  tDual: (ru: string, tg: string, en?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ru",
  setLanguage: () => {},
  t: translations.ru,
  tDual: (ru: string) => ru,
});

/**
 * Calculates the localized equivalent of a given pathname.
 * Conforms to MASKANI.TJ SEO Specification v1.7:
 * - RU: strictly without prefix (e.g. /classifieds)
 * - TG: /tg/ prefix (e.g. /tg/classifieds)
 * - EN: /en/ prefix (e.g. /en/classifieds)
 */
export function getLocalizedPath(pathname: string, newLang: Language): string {
  // Strip any existing /tg, /en, or /ru prefix
  const cleanPath = pathname.replace(/^\/(?:tg|en|ru)(?=\/|$)/, "") || "/";

  if (newLang === "ru") {
    return cleanPath;
  }

  return cleanPath === "/" ? `/${newLang}` : `/${newLang}${cleanPath}`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        let detectedLang: Language = "ru";

        if (path.startsWith("/tg/") || path === "/tg") {
          detectedLang = "tg";
        } else if (path.startsWith("/en/") || path === "/en") {
          detectedLang = "en";
        } else {
          // If on root or un-prefixed RU path
          const saved = localStorage.getItem("sogd_language") as Language | null;
          if (saved === "ru" || saved === "tg" || saved === "en") {
            detectedLang = saved;
          }
        }

        setLanguageState(detectedLang);
        document.documentElement.lang = detectedLang;
      }
    } catch {
      // localStorage / window may fail in SSR or restricted environments
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("sogd_language", lang);
      document.documentElement.lang = lang;
      if (typeof window !== "undefined") {
        const nextPath = getLocalizedPath(window.location.pathname, lang);
        const nextUrl = nextPath + window.location.search;
        if (nextUrl !== window.location.pathname + window.location.search) {
          window.location.href = nextUrl;
        }
      }
    } catch {
      // ignore
    }
  };

  const tDual = (ru: string, tg: string, en?: string) => {
    if (language === "tg") return tg;
    if (language === "en") return en || ru;
    return ru;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.ru,
        tDual,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
