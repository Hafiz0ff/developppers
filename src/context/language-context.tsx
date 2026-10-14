"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Translations, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  tDual: (ru: string, tg: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ru",
  setLanguage: () => {},
  t: translations.ru,
  tDual: (ru: string) => ru,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sogd_language") as Language | null;
      if (saved === "ru" || saved === "tg") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // localStorage may fail in SSR or restricted environments
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("sogd_language", lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const tDual = (ru: string, tg: string) => {
    return language === "tg" ? tg : ru;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
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
