"use client";

import { useEffect, useState } from "react";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "stayinn-under-dev-notice";

export function UnderDevelopmentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== "1") {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : dismiss())}>
      <DialogContent className="max-w-md rounded-3xl border-2 border-primary/30 p-0 gap-0 overflow-hidden sm:max-w-lg">
        <div className="bg-primary px-6 py-8 text-center text-primary-foreground">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Construction className="h-8 w-8" aria-hidden />
          </div>
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-primary-foreground sm:text-2xl">
              Website under development
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-6">
          <DialogDescription className="text-center text-base font-bold leading-relaxed text-foreground">
            This website is still under construction and is not fully live yet.
          </DialogDescription>
          <p className="text-center text-sm font-semibold leading-relaxed text-muted-foreground">
            All rooms shown on this site are mock listings for preview only. Features, prices, and
            availability may change before launch.
          </p>
        </div>

        <DialogFooter className="border-t bg-muted/30 px-6 py-4 sm:justify-center">
          <Button
            type="button"
            size="lg"
            className="w-full rounded-full font-extrabold sm:w-auto sm:min-w-[12rem]"
            onClick={dismiss}
          >
            Continue to site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
