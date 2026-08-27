"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck2, CreditCard, Download, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  AccountBookingCard,
  AccountCard,
  AccountEmpty,
  AccountError,
  AccountPage,
  AccountPageHeader,
  AccountSection,
  AccountStat,
} from "@/components/account/account-page";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { SupportContactPanel } from "@/components/account/support-contact-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { downloadMyCurrentMonthReceipt, fetchMyBookings } from "@/lib/guest-api";
import {
  formatBookingMoney,
  formatLedgerMonth,
  formatStayDate,
  stayLengthLabel,
} from "@/lib/guest-format";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);
  const firstName = user?.fullName.split(" ")[0] ?? "there";
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = data?.bookings ?? [];
  const summary = data?.summary;
  const latest = bookings[0] ?? { currency: "pkr" as const };
  const currentRentRows = bookings.flatMap((booking) =>
    (booking.rent_ledger ?? [])
      .filter((entry) => entry.payment_status === "paid")
      .map((entry) => ({ booking, entry })),
  );

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
    <AccountPage>
      <AccountPageHeader
        title={`Hi, ${firstName}`}
        description="Your stays, rent, and receipts in one place."
        action={
          <Button asChild className="rounded-full">
            <Link href="/booking">Book a seat</Link>
          </Button>
        }
      />

      {error ? (
        <AccountError
          message={error instanceof Error ? error.message : "Could not load your account."}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <AccountStat
          label="Active stays"
          value={isLoading ? "—" : summary?.active ?? 0}
          icon={<CalendarCheck2 className="h-5 w-5" />}
        />
        <AccountStat
          label="Due this month"
          value={isLoading ? "—" : formatBookingMoney(summary?.outstanding, latest)}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <AccountStat
          label="Security held"
          value={isLoading ? "—" : formatBookingMoney(summary?.security_held, latest)}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      {!isLoading && currentRentRows.length > 0 ? (
        <div className="mt-4 space-y-3">
          {currentRentRows.map(({ booking, entry }) => {
            const key = `${booking.id}-${entry.month}`;
            return (
              <AccountCard
                key={key}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Receipt ready</p>
                  <p className="mt-0.5 font-semibold">
                    {formatLedgerMonth(entry.month)} · {booking.room_title ?? "Room"}
                  </p>
                </div>
                <Button
                  type="button"
                  className="rounded-full"
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
              </AccountCard>
            );
          })}
        </div>
      ) : null}

      <AccountSection
        title="Recent bookings"
        action={
          bookings.length > 0 ? (
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/account/bookings">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null
        }
      >
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </div>
        ) : bookings.length === 0 ? (
          <AccountEmpty
            title="No bookings yet"
            description="Reserve a seat and it will show up here."
            action={
              <Button asChild className="rounded-full">
                <Link href="/booking">Book a seat</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {bookings.slice(0, 4).map((booking) => (
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
      </AccountSection>

      <AccountSection>
        <SupportContactPanel variant="compact" />
      </AccountSection>
    </AccountPage>
  );
}
