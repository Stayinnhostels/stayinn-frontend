"use client";

import { useCurrency } from "@/components/currency-provider";
import { currencyLabel, type DisplayCurrency } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency, ready } = useCurrency();
  if (!ready) return null;

  return (
    <Select value={currency} onValueChange={(v) => setCurrency(v as DisplayCurrency)}>
      <SelectTrigger className={`h-8 w-[7.5rem] rounded-full text-xs font-bold ${className ?? ""}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="pkr">{currencyLabel("pkr")}</SelectItem>
        <SelectItem value="usd">{currencyLabel("usd")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
