"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { currencyLabel, type DisplayCurrency } from "@/lib/currency";

type Props = {
  open: boolean;
  onChoose: (currency: DisplayCurrency) => void;
};

export function CurrencyChoiceDialog({ open, onChoose }: Props) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Choose your pricing</DialogTitle>
          <DialogDescription>
            We could not tell your region automatically (often happens with a VPN). Pick how you
            want prices shown — you can change this anytime in the header.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="default"
            className="h-auto flex-col gap-1 py-4"
            onClick={() => onChoose("pkr")}
          >
            <span className="text-base font-bold">{currencyLabel("pkr")}</span>
            <span className="text-xs font-normal opacity-90">Local rates in rupees</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-auto flex-col gap-1 py-4"
            onClick={() => onChoose("usd")}
          >
            <span className="text-base font-bold">{currencyLabel("usd")}</span>
            <span className="text-xs font-normal text-muted-foreground">International rates in US dollars</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
