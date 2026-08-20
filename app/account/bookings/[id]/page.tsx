"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookingStatusBadge,
  RentStatusBadge,
  SecurityStatusBadge,
} from "@/components/account/status-badges";
import { useAuth } from "@/lib/auth-context";
import { bookingRef, fetchMyBooking } from "@/lib/guest-api";
import {
  formatBookingMoney,
  formatLedgerMonth,
  formatStayDate,
  stayLengthLabel,
} from "@/lib/guest-format";

export default function AccountBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["guest-booking", id, user?.id],
    queryFn: () => fetchMyBooking(id),
    enabled: Boolean(user && id),
  });

  return (
    <div className="container mx-auto px-4 py-10 pb-20">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 rounded-full font-bold">
        <Link href="/account/bookings">
          <ArrowLeft className="h-4 w-4" />
          All bookings
        </Link>
      </Button>

      {isLoading ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : error || !booking ? (
        <Card className="rounded-3xl border-2 p-8">
          <CardContent className="p-0">
            <h1 className="text-2xl font-extrabold">Booking not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "This booking is not linked to your account."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-3 rounded-full border-primary/30 font-bold text-primary">
                #{bookingRef(booking.id)}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight">{booking.room_title ?? "Room"}</h1>
              <p className="mt-2 text-muted-foreground">
                {stayLengthLabel(booking)} · {booking.seats_booked} seat
                {booking.seats_booked === 1 ? "" : "s"}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="space-y-3 p-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="font-extrabold">Stay dates</h2>
                <p className="text-sm text-muted-foreground">
                  {formatStayDate(booking.move_in)} → {formatStayDate(booking.check_out)}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="space-y-3 p-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="font-extrabold">Guest</h2>
                <p className="text-sm text-muted-foreground">
                  {booking.guest_name}
                  <br />
                  {booking.guest_email}
                  <br />
                  {booking.guest_phone}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="space-y-3 p-0">
                <h2 className="font-extrabold">Amounts</h2>
                <dl className="space-y-1 text-sm">
                  <Row label="Stay total" value={formatBookingMoney(booking.total_amount, booking)} />
                  {booking.discount_amount ? (
                    <Row label="Discount" value={formatBookingMoney(booking.discount_amount, booking)} />
                  ) : null}
                  <Row label="Collected" value={formatBookingMoney(booking.amount_paid_upfront, booking)} />
                  <Row label="Outstanding" value={formatBookingMoney(booking.amount_outstanding, booking)} />
                </dl>
              </CardContent>
            </Card>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="p-0">
                <h2 className="text-lg font-extrabold">Rent ledger</h2>
                {(booking.rent_ledger ?? []).length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No monthly rent entries for this stay.</p>
                ) : (
                  <ul className="mt-4 divide-y">
                    {booking.rent_ledger?.map((entry) => (
                      <li key={entry.month} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <p className="font-semibold">{formatLedgerMonth(entry.month)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatBookingMoney(entry.rent_amount, booking)}
                          </p>
                        </div>
                        <RentStatusBadge status={entry.payment_status} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-2 p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-extrabold">Security deposit</h2>
                  <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
                </div>
                <dl className="mt-4 space-y-1 text-sm">
                  <Row label="Required" value={formatBookingMoney(booking.security_amount, booking)} />
                  <Row label="Returned" value={formatBookingMoney(booking.security_returned, booking)} />
                  <Row label="Held now" value={formatBookingMoney(booking.security_remaining, booking)} />
                </dl>
                {(booking.security_ledger ?? []).length > 0 ? (
                  <ul className="mt-4 divide-y border-t pt-2">
                    {booking.security_ledger?.map((entry, index) => (
                      <li key={entry.id ?? `${entry.type}-${index}`} className="py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold capitalize">{entry.type}</p>
                          <p className="font-bold">{formatBookingMoney(entry.amount, booking)}</p>
                        </div>
                        {entry.note ? <p className="text-sm text-muted-foreground">{entry.note}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
