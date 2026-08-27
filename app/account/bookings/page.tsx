"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AccountBookingCard,
  AccountEmpty,
  AccountError,
  AccountPage,
  AccountPageHeader,
} from "@/components/account/account-page";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { fetchMyBookings } from "@/lib/guest-api";
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

export default function AccountBookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<BookingFilter>("all");
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "active") return ACTIVE_BOOKING_STATUSES.includes(booking.status);
    if (filter === "completed") return booking.status === "checked_out";
    if (filter === "cancelled") return booking.status === "cancelled";
    return true;
  });

  return (
    <AccountPage>
      <AccountPageHeader
        title="Bookings"
        description="Keep track of every stay and reservation."
        action={
          <Button asChild className="rounded-full">
            <Link href="/booking">Book a seat</Link>
          </Button>
        }
      />

      {error ? (
        <AccountError message={error instanceof Error ? error.message : "Could not load bookings."} />
      ) : null}

      <div className="mb-5 inline-flex rounded-full bg-muted p-1">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              filter === item.value
                ? "bg-background font-medium text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <AccountEmpty
          title={bookings.length === 0 ? "No bookings yet" : `No ${filter} bookings`}
          description={
            bookings.length === 0
              ? "Reserve a seat and your booking will appear here."
              : "Try another filter to see other stays."
          }
          action={
            <Button asChild className="rounded-full">
              <Link href={bookings.length === 0 ? "/rooms" : "/booking"}>
                {bookings.length === 0 ? "Browse rooms" : "Book a seat"}
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filteredBookings.map((booking) => (
            <Link key={booking.id} href={`/account/bookings/${booking.id}`} className="group">
              <AccountBookingCard
                title={booking.room_title ?? "Room"}
                dates={`${formatStayDate(booking.move_in)} – ${formatStayDate(booking.check_out)}`}
                meta={`${stayLengthLabel(booking)} · ${booking.seats_booked} ${
                  booking.seats_booked === 1 ? "seat" : "seats"
                }`}
                amount={formatBookingMoney(booking.total_amount, booking)}
                status={<BookingStatusBadge status={booking.status} />}
              />
            </Link>
          ))}
        </div>
      )}
    </AccountPage>
  );
}
