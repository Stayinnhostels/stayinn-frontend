"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, fetchMyBookings, type GuestBookingStatus } from "@/lib/guest-api";
import {
  ACTIVE_BOOKING_STATUSES,
  formatBookingMoney,
  formatStayDate,
  stayLengthLabel,
} from "@/lib/guest-format";
import { cn } from "@/lib/utils";

type BookingFilter = "all" | "active" | "completed" | "cancelled";

const FILTERS: { value: BookingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_ACCENT: Record<GuestBookingStatus, string> = {
  pending: "from-amber-500 to-orange-400",
  confirmed: "from-sky-500 to-blue-500",
  checked_in: "from-violet-500 to-indigo-500",
  checked_out: "from-emerald-500 to-teal-500",
  cancelled: "from-rose-500 to-red-400",
};

export default function AccountBookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<BookingFilter>("all");
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];
  const activeCount = bookings.filter((booking) => ACTIVE_BOOKING_STATUSES.includes(booking.status)).length;
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "active") return ACTIVE_BOOKING_STATUSES.includes(booking.status);
    if (filter === "completed") return booking.status === "checked_out";
    if (filter === "cancelled") return booking.status === "cancelled";
    return true;
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10"
        />
        <div aria-hidden className="absolute -bottom-24 right-48 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-7">
          <div className="flex items-center gap-5">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
              <CalendarCheck2 className="h-8 w-8" />
            </div>
            <div>
              <Badge className="mb-3 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/15">
                MY STAYS
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your bookings</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Keep track of every reservation, stay date and booking status in one place.
              </p>
            </div>
          </div>
          <Button asChild size="lg" variant="secondary" className="rounded-full font-bold shadow-lg">
            <Link href="/booking">
              <Plus className="h-4 w-4" />
              Book another seat
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load bookings."}
        </p>
      ) : null}

      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BedDouble className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Booking history</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading your stays…" : `${activeCount} active · ${bookings.length} total`}
              </p>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border/70 bg-muted/40 p-1.5">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
                  filter === item.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </>
        ) : filteredBookings.length === 0 ? (
          <Card className="rounded-3xl border-dashed md:col-span-2">
            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarDays className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold">
                {bookings.length === 0 ? "No bookings yet" : `No ${filter} bookings`}
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {bookings.length === 0
                  ? "Reserve a seat and your booking will appear here automatically."
                  : "Try another filter to view your other booking records."}
              </p>
              <Button asChild className="mt-6 rounded-full font-bold">
                <Link href={bookings.length === 0 ? "/rooms" : "/booking"}>
                  <Plus className="h-4 w-4" />
                  {bookings.length === 0 ? "Browse rooms" : "Book another seat"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="group overflow-hidden rounded-3xl border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-card)]"
            >
              <div className={cn("h-1.5 bg-gradient-to-r", STATUS_ACCENT[booking.status])} />
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BedDouble className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        #{bookingRef(booking.id)}
                      </p>
                      <h2 className="mt-0.5 text-xl font-extrabold tracking-tight">
                        {booking.room_title ?? "Room"}
                      </h2>
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/45 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      Move in
                    </p>
                    <p className="mt-1 text-sm font-extrabold">{formatStayDate(booking.move_in)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/45 p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      Checkout
                    </p>
                    <p className="mt-1 text-sm font-extrabold">{formatStayDate(booking.check_out)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5 text-primary" />
                    {stayLengthLabel(booking)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <UsersRound className="h-3.5 w-3.5 text-primary" />
                    {booking.seats_booked} {booking.seats_booked === 1 ? "seat" : "seats"}
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-border/60 pt-5">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <WalletCards className="h-3.5 w-3.5" />
                      Booking total
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold">
                      {formatBookingMoney(booking.total_amount, booking)}
                    </p>
                  </div>
                  <Button asChild variant="outline" className="rounded-full font-bold">
                    <Link href={`/account/bookings/${booking.id}`}>
                      View details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      </section>
    </div>
  );
}
