"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Download, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import {
  AccountCard,
  AccountEmpty,
  AccountError,
  AccountPage,
  AccountPageHeader,
  AccountSection,
  AccountStat,
} from "@/components/account/account-page";
import { RentStatusBadge, SecurityStatusBadge } from "@/components/account/status-badges";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { downloadMyCurrentMonthReceipt, fetchMyBookings } from "@/lib/guest-api";
import { formatBookingMoney, formatLedgerMonth } from "@/lib/guest-format";

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
  const extraRows = bookings.flatMap((booking) =>
    (booking.resident_extras ?? []).flatMap((extra) =>
      (extra.ledger ?? []).map((entry) => ({ booking, extra, entry })),
    ),
  );
  const securityRows = bookings.filter(
    (booking) => booking.security_status && booking.security_status !== "not_applicable",
  );
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
    <AccountPage>
      <AccountPageHeader
        title="Payments"
        description="Rent and extra facilities are collected offline. Each has its own payment cycle."
      />

      {error ? (
        <AccountError message={error instanceof Error ? error.message : "Could not load payments."} />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <AccountStat
          label="Due this month"
          value={isLoading ? "—" : formatBookingMoney(outstanding, moneyRef)}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <AccountStat
          label="Security held"
          value={isLoading ? "—" : formatBookingMoney(securityHeld, moneyRef)}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <AccountSection title="Monthly rent">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </div>
        ) : rentRows.length === 0 ? (
          <AccountEmpty
            title="No rent months yet"
            description="Current and previous months appear here once your stay starts."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rentRows.map(({ booking, entry }) => {
              const key = `${booking.id}-${entry.month}`;
              const paid = entry.payment_status === "paid";
              return (
                <AccountCard key={key} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{formatLedgerMonth(entry.month)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {booking.room_title ?? "Room"}
                      </p>
                    </div>
                    <RentStatusBadge status={entry.payment_status} />
                  </div>
                  <p className="mt-4 text-xl font-semibold">
                    {formatBookingMoney(entry.rent_amount, booking)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {paid ? (
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-full"
                        disabled={downloading === key}
                        onClick={() => handleDownloadReceipt(booking.id, entry.month)}
                      >
                        {downloading === key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Receipt
                      </Button>
                    ) : null}
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/account/bookings/${booking.id}`}>Booking</Link>
                    </Button>
                  </div>
                </AccountCard>
              );
            })}
          </div>
        )}
      </AccountSection>

      <AccountSection title="Extra facilities">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-36 rounded-3xl" />
          </div>
        ) : extraRows.length === 0 ? (
          <AccountEmpty
            title="No extra facilities"
            description="If you get an AC, cooler, or similar extra, its charge appears here — separate from rent."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {extraRows.map(({ booking, extra, entry }) => (
              <AccountCard key={`${booking.id}-${extra.id}-${entry.month}`} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{extra.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatLedgerMonth(entry.month)}
                      {extra.billing_cycle === "one_time" ? " · one-time" : " · monthly"}
                    </p>
                  </div>
                  <RentStatusBadge status={entry.payment_status} />
                </div>
                <p className="mt-4 text-xl font-semibold">
                  {formatBookingMoney(entry.amount, booking)}
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href={`/account/bookings/${booking.id}`}>Booking</Link>
                  </Button>
                </div>
              </AccountCard>
            ))}
          </div>
        )}
      </AccountSection>

      <AccountSection title="Security deposit">
        {isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : securityRows.length === 0 ? (
          <AccountEmpty
            title="No security deposit yet"
            description="When a deposit is recorded for your stay, it will appear here."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {securityRows.map((booking) => (
              <AccountCard key={booking.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{booking.room_title ?? "Room"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Security deposit</p>
                  </div>
                  <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
                </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/60 px-3.5 py-3">
                    <p className="text-xs text-muted-foreground">Required</p>
                    <p className="mt-0.5 font-semibold">
                      {formatBookingMoney(booking.security_amount, booking)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-muted/60 px-3.5 py-3">
                    <p className="text-xs text-muted-foreground">Held now</p>
                    <p className="mt-0.5 font-semibold">
                      {formatBookingMoney(booking.security_remaining, booking)}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                  <Link href={`/account/bookings/${booking.id}`}>Booking</Link>
                </Button>
              </AccountCard>
            ))}
          </div>
        )}
      </AccountSection>
    </AccountPage>
  );
}
