"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RentStatusBadge, SecurityStatusBadge } from "@/components/account/status-badges";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, fetchMyBookings } from "@/lib/guest-api";
import { formatBookingMoney, formatLedgerMonth } from "@/lib/guest-format";

export default function AccountPaymentsPage() {
  const { user } = useAuth();
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

  return (
    <div className="container mx-auto px-4 py-10 pb-20">
      <Badge variant="outline" className="mb-3 rounded-full border-primary/30 font-bold text-primary">
        PAYMENTS
      </Badge>
      <h1 className="text-4xl font-extrabold tracking-tight">Rent & security</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Payment is collected offline. This page shows what the property has recorded for your stays.
      </p>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load payments."}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold tracking-tight">Monthly rent</h2>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-28 rounded-3xl" />
          ) : rentRows.length === 0 ? (
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="p-0 text-sm text-muted-foreground">
                No rent ledger yet. Monthly stays show rent here after they are confirmed.
              </CardContent>
            </Card>
          ) : (
            rentRows.map(({ booking, entry }) => (
              <Card key={`${booking.id}-${entry.month}`} className="rounded-3xl border-2 p-5">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      #{bookingRef(booking.id)} · {booking.room_title}
                    </p>
                    <p className="font-extrabold">{formatLedgerMonth(entry.month)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatBookingMoney(entry.rent_amount, booking)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RentStatusBadge status={entry.payment_status} />
                    <Button asChild variant="ghost" size="sm" className="rounded-full font-bold">
                      <Link href={`/account/bookings/${booking.id}`}>Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight">Security deposits</h2>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <Skeleton className="h-28 rounded-3xl" />
          ) : securityRows.length === 0 ? (
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="p-0 text-sm text-muted-foreground">
                No security deposit recorded yet.
              </CardContent>
            </Card>
          ) : (
            securityRows.map((booking) => (
              <Card key={booking.id} className="rounded-3xl border-2 p-5">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      #{bookingRef(booking.id)} · {booking.room_title}
                    </p>
                    <p className="font-extrabold">{formatBookingMoney(booking.security_amount, booking)}</p>
                    <p className="text-sm text-muted-foreground">
                      Held now: {formatBookingMoney(booking.security_remaining, booking)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
                    <Button asChild variant="ghost" size="sm" className="rounded-full font-bold">
                      <Link href={`/account/bookings/${booking.id}`}>Details</Link>
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
