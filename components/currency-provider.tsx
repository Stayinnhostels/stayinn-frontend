"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CurrencyChoiceDialog } from "@/components/currency-choice-dialog";
import {
  collectRegionSignals,
  formatMoney,
  getStoredCurrency,
  hasRegionConflict,
  isCurrencyExplicitlyChosen,
  resolveCurrencyFromSignals,
  setDisplayCurrency,
  type DisplayCurrency,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: DisplayCurrency;
  setCurrency: (c: DisplayCurrency) => void;
  formatPrice: (amount: number) => string;
  ready: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>("pkr");
  const [ready, setReady] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = getStoredCurrency();
      const signals = await collectRegionSignals();
      if (cancelled) return;

      if (isCurrencyExplicitlyChosen() && stored) {
        setCurrencyState(stored);
        setReady(true);
        return;
      }

      if (hasRegionConflict(signals)) {
        setChoiceOpen(true);
        setCurrencyState(stored ?? resolveCurrencyFromSignals(signals));
        setReady(false);
        return;
      }

      const resolved = stored ?? resolveCurrencyFromSignals(signals);
      if (!stored) {
        setDisplayCurrency(resolved, { explicit: false });
      }
      setCurrencyState(resolved);
      setReady(true);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: DisplayCurrency) => {
    setDisplayCurrency(c, { explicit: true });
    setCurrencyState(c);
    setChoiceOpen(false);
    setReady(true);
  }, []);

  const handleChoice = useCallback((c: DisplayCurrency) => {
    setCurrency(c);
  }, [setCurrency]);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice: (amount: number) => formatMoney(amount, currency),
      ready,
    }),
    [currency, setCurrency, ready],
  );

  return (
    <CurrencyContext.Provider value={value}>
      <CurrencyChoiceDialog open={choiceOpen} onChoose={handleChoice} />
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
