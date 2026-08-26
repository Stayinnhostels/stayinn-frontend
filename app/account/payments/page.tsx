"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CreditCard,
  Download,
  Loader2,
  ReceiptText,
  Shield,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { RentStatusBadge, SecurityStatusBadge } from "@/components/account/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, downloadMyCurrentMonthReceipt, fetchMyBookings } from "@/lib/guest-api";
import { formatBookingMoney, formatLedgerMonth } from "@/lib/guest-format";
import { cn } from "@/lib/utils";

const RENT_ACCENT: Record<string, string> = {
  paid: "from-emerald-500 to-teal-500",
  not_paid: "from-amber-500 to-orange-400",
  partial: "from-sky-500 to-blue-500",
  returned: "from-slate-400 to-slate-500",
};

export default function AccountPaymentsPage() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];
  const rentRows = bookings.flatMap((booking) =>
    (booking.rent_ledger ?? []).map((entry) => ({ booking, entry })),
  );
  const securityRows = bookings.filter(
    (booking) => booking.security_status && booking.security_status !== "not_applicable",
  );
  const paidCount = rentRows.filter(({ entry }) => entry.payment_status === "paid").length;
  const unpaidCount = rentRows.filter(({ entry }) => entry.payment_status !== "paid").length;
  const moneyRef = bookings[0] ?? { currency: "pkr" as const };
  const outstanding = data?.summary?.outstanding ?? 0;
  const securityHeld = data?.summary?.security_held ?? 0;

  const handleDownloadReceipt = async (bookingId: string, month: string) => {
    const key = `${bookingId}-${month}`;
    setDownloading(key);
    try {
      await downloadMyCurrentMonthReceipt(bookingId, month);
      toast.success("Receipt downloaded");
    } catch (downloadError) {
      toast.error(downloadError instanceof Error ? downloadError.message : "Could not download receipt");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10"
        />
        <div aria-hidden className="absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-7">
          <div className="flex items-center gap-5">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
              <WalletCards className="h-8 w-8" />
            </div>
            <div>
              <Badge className="mb-3 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/15">
                PAYMENTS
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Rent & security</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Offline payments only. Track this month’s rent and your security deposit status here.
              </p>
            </div>
          </div>
          {!isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-extrabold">{paidCount}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Paid</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-extrabold">{unpaidCount}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">Due</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load payments."}
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden rounded-3xl border-amber-500/20 shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-400" />
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                This month outstanding
              </p>
              <p className="mt-0.5 text-2xl font-extrabold">
                {isLoading ? "—" : formatBookingMoney(outstanding, moneyRef)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden rounded-3xl border-sky-500/20 shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-500" />
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Security held</p>
              <p className="mt-0.5 text-2xl font-extrabold">
                {isLoading ? "—" : formatBookingMoney(securityHeld, moneyRef)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">This month’s rent</h2>
            <p className="text-sm text-muted-foreground">Only the current month is shown</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </>
          ) : rentRows.length === 0 ? (
            <Card className="rounded-3xl border-dashed md:col-span-2">
              <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <ReceiptText className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold">No rent due this month</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Upcoming months are not shown here. Check back when the next rent cycle starts.
                </p>
              </CardContent>
            </Card>
          ) : (
            rentRows.map(({ booking, entry }) => {
              const key = `${booking.id}-${entry.month}`;
              const paid = entry.payment_status === "paid";
              return (
                <Card
                  key={key}
                  className="group overflow-hidden rounded-3xl border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-card)]"
                >
                  <div
                    className={cn(
                      "h-1.5 bg-gradient-to-r",
                      RENT_ACCENT[entry.payment_status] ?? "from-slate-400 to-slate-500",
                    )}
                  />
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                          #{bookingRef(booking.id)} · {booking.room_title}
                        </p>
                        <h3 className="mt-1 text-xl font-extrabold tracking-tight">
                          {formatLedgerMonth(entry.month)}
                        </h3>
                      </div>
                      <RentStatusBadge status={entry.payment_status} />
                    </div>

                    <div className="mt-6 rounded-2xl bg-muted/45 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Rent amount
                      </p>
                      <p className="mt-1 text-2xl font-extrabold">
                        {formatBookingMoney(entry.rent_amount, booking)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {paid ? "Paid for this month" : "Payment collected offline by the property"}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                      {paid ? (
                        <Button
                          type="button"
                          className="rounded-full font-bold"
                          disabled={downloading === key}
                          onClick={() => handleDownloadReceipt(booking.id, entry.month)}
                        >
                          {downloading === key ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download receipt
                        </Button>
                      ) : null}
                      <Button asChild variant="outline" className="rounded-full font-bold">
                        <Link href={`/account/bookings/${booking.id}`}>
                          Booking details
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Security deposits</h2>
            <p className="text-sm text-muted-foreground">Deposit amount held against your stays</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-56 rounded-3xl" />
              <Skeleton className="h-56 rounded-3xl" />
            </>
          ) : securityRows.length === 0 ? (
            <Card className="rounded-3xl border-dashed md:col-span-2">
              <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold">No security deposit yet</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  When a deposit is recorded for your stay, it will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            securityRows.map((booking) => (
              <Card
                key={booking.id}
                className="group overflow-hidden rounded-3xl border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/25 hover:shadow-[var(--shadow-card)]"
              >
                <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-500" />
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        #{bookingRef(booking.id)} · {booking.room_title}
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold tracking-tight">Security deposit</h3>
                    </div>
                    <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/45 p-3.5">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Deposit
                      </p>
                      <p className="mt-1 text-lg font-extrabold">
                        {formatBookingMoney(booking.security_amount, booking)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-sky-500/10 p-3.5">
                      <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Held now</p>
                      <p className="mt-1 text-lg font-extrabold text-sky-800">
                        {formatBookingMoney(booking.security_remaining, booking)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    <Button asChild variant="outline" className="rounded-full font-bold">
                      <Link href={`/account/bookings/${booking.id}`}>
                        Booking details
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
