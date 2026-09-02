"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addDaysIso,
  buildStaySearchQuery,
  clampMoveInDate,
  defaultCheckOut,
  todayIsoDate,
} from "@/lib/stay-dates";

const heroDateInputClassName =
  "h-11 w-full rounded-xl border-2 bg-background pr-10 [&::-webkit-calendar-picker-indicator]:size-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80";

export function HeroAvailabilityBar() {
  const router = useRouter();
  const today = useMemo(() => todayIsoDate(), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => defaultCheckOut(today, 3));
  const [seats, setSeats] = useState("1");
  const [error, setError] = useState<string | null>(null);

  function onCheckInChange(value: string) {
    const next = clampMoveInDate(value);
    setCheckIn(next);
    setError(null);
    if (checkOut <= next) {
      setCheckOut(addDaysIso(next, 1));
    }
  }

  function onCheckOutChange(value: string) {
    const next = value.slice(0, 10);
    setCheckOut(next);
    setError(null);
  }

  function search() {
    if (!checkOut || checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError(null);
    const q = buildStaySearchQuery({
      checkIn,
      checkOut,
      seats: Number.parseInt(seats, 10) || 1,
    });
    router.push(`/rooms?${q}`);
  }

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm md:p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calendar className="h-4 w-4 text-primary" />
        Check availability
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-row xl:items-end xl:gap-3">
        <div className="min-w-0 space-y-1.5 xl:flex-1">
          <Label htmlFor="hero-check-in" className="text-xs font-semibold text-muted-foreground">
            Check-in
          </Label>
          <Input
            id="hero-check-in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => onCheckInChange(e.target.value)}
            className={heroDateInputClassName}
          />
        </div>

        <div className="min-w-0 space-y-1.5 xl:flex-1">
          <Label htmlFor="hero-check-out" className="text-xs font-semibold text-muted-foreground">
            Check-out
          </Label>
          <Input
            id="hero-check-out"
            type="date"
            min={addDaysIso(checkIn, 1)}
            value={checkOut}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className={heroDateInputClassName}
          />
        </div>

        <div className="space-y-1.5 xl:w-[8.5rem] xl:shrink-0">
          <Label className="text-xs font-semibold text-muted-foreground">Seats</Label>
          <Select value={seats} onValueChange={setSeats}>
            <SelectTrigger className="h-11 w-full rounded-xl border-2 bg-background">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "seat" : "seats"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          size="lg"
          className="h-11 w-full shrink-0 rounded-xl font-bold xl:w-auto xl:px-6"
          onClick={search}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {error ? <p className="mt-2 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
