"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_USD_TO_TJS, formatTJS, formatUSD } from "@/lib/currency";

export type Currency = "TJS" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceTjs: number | string | null | undefined, priceUsd: number | string | null | undefined) => string;
  usdToTjsRate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TJS",
  setCurrency: () => {},
  formatPrice: () => "",
  usdToTjsRate: DEFAULT_USD_TO_TJS,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TJS");

  useEffect(() => {
    const saved = localStorage.getItem("sogd_currency") as Currency | null;
    if (saved === "TJS" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("sogd_currency", c);
  };

  const formatPrice = (
    priceTjs: number | string | null | undefined,
    priceUsd: number | string | null | undefined
  ) => {
    if (currency === "USD") {
      return formatUSD(priceUsd);
    }
    return formatTJS(priceTjs);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        usdToTjsRate: DEFAULT_USD_TO_TJS,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
