"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, fetchMyBookings } from "@/lib/guest-api";
import { formatBookingMoney, formatStayDate, stayLengthLabel } from "@/lib/guest-format";

export default function AccountBookingsPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];

  return (
    <div className="container mx-auto px-4 py-10 pb-20">
      <Badge variant="outline" className="mb-3 rounded-full border-primary/30 font-bold text-primary">
        BOOKINGS
      </Badge>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your bookings</h1>
          <p className="mt-2 text-muted-foreground">Seat reservations linked to this account.</p>
        </div>
        <Button asChild className="rounded-full font-bold">
          <Link href="/booking">Book a seat</Link>
        </Button>
      </div>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load bookings."}
        </p>
      ) : null}

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </>
        ) : bookings.length === 0 ? (
          <Card className="rounded-3xl border-2 p-8">
            <CardContent className="p-0">
              <h3 className="text-lg font-extrabold">No bookings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                When you book a seat — even before creating an account — it will appear here after you sign in
                with the same email.
              </p>
              <Button asChild className="mt-5 rounded-full font-bold">
                <Link href="/rooms">Browse rooms</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Link key={booking.id} href={`/account/bookings/${booking.id}`} className="block group">
              <Card className="rounded-3xl border-2 p-6 transition-colors group-hover:border-primary/40">
                <CardContent className="flex flex-col gap-4 p-0 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs font-semibold text-muted-foreground">
                        #{bookingRef(booking.id)}
                      </p>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                      {booking.room_title ?? "Room"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatStayDate(booking.move_in)} → {formatStayDate(booking.check_out)} ·{" "}
                      {stayLengthLabel(booking)} · {booking.seats_booked} seat
                      {booking.seats_booked === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                    <p className="text-lg font-extrabold">{formatBookingMoney(booking.total_amount, booking)}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
