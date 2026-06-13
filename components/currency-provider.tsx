"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { formatMoney, type DisplayCurrency } from "@/lib/currency";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (c: DisplayCurrency) => void;
  formatPrice: (amount: number) => string;
  ready: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Website pricing is PKR-only for now; USD/international checkout comes later. */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      currency: "pkr" as const,
      setCurrency: () => {},
      formatPrice: (amount: number) => formatMoney(amount, "pkr"),
      ready: true,
    }),
    [],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
