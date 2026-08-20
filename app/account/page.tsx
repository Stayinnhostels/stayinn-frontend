"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, CreditCard, MapPin, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, fetchMyBookings } from "@/lib/guest-api";
import { formatBookingMoney, formatStayDate, stayLengthLabel } from "@/lib/guest-format";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];
  const summary = data?.summary;
  const latest = bookings[0];

  return (
    <div className="container mx-auto px-4 py-10 pb-20">
      <Badge variant="outline" className="mb-3 rounded-full border-primary/30 font-bold text-primary">
        MY ACCOUNT
      </Badge>
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Hi, {firstName}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Track your seat bookings, rent, and security deposit in one place.
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active bookings"
          value={isLoading ? "—" : String(summary?.active ?? 0)}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Total bookings"
          value={isLoading ? "—" : String(summary?.total ?? 0)}
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatCard
          label="Amount outstanding"
          value={isLoading ? "—" : formatBookingMoney(summary?.outstanding, latest ?? { currency: "pkr" })}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          label="Security held"
          value={isLoading ? "—" : formatBookingMoney(summary?.security_held, latest ?? { currency: "pkr" })}
          icon={<Shield className="h-5 w-5" />}
        />
      </section>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load your account."}
        </p>
      ) : null}

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight">Recent bookings</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full font-bold">
            <Link href="/account/bookings">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-44 rounded-3xl" />
            <Skeleton className="h-44 rounded-3xl" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="rounded-3xl border-2 p-8">
            <CardContent className="p-0">
              <h3 className="text-lg font-extrabold">No bookings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reserve a seat on the website and it will show up here.
              </p>
              <Button asChild className="mt-5 rounded-full font-bold">
                <Link href="/booking">Book a seat</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookings.slice(0, 4).map((booking) => (
              <Link key={booking.id} href={`/account/bookings/${booking.id}`} className="group">
                <Card className="h-full rounded-3xl border-2 p-6 transition-colors group-hover:border-primary/40">
                  <CardContent className="flex h-full flex-col gap-3 p-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          #{bookingRef(booking.id)}
                        </p>
                        <h3 className="text-lg font-extrabold tracking-tight">
                          {booking.room_title ?? "Room"}
                        </h3>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatStayDate(booking.move_in)} → {formatStayDate(booking.check_out)} ·{" "}
                      {stayLengthLabel(booking)} · {booking.seats_booked} seat
                      {booking.seats_booked === 1 ? "" : "s"}
                    </p>
                    <p className="mt-auto text-sm font-bold">
                      {formatBookingMoney(booking.total_amount, booking)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <Card className="rounded-3xl border-2 p-5">
      <CardContent className="p-0">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
