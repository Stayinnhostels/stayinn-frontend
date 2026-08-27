"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AccountCard,
  AccountEmpty,
  AccountField,
  AccountPage,
  AccountSection,
} from "@/components/account/account-page";
import {
  BookingStatusBadge,
  RentStatusBadge,
  SecurityStatusBadge,
} from "@/components/account/status-badges";
import { BookingActionsPanel } from "@/components/account/booking-actions-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { downloadMyCurrentMonthReceipt, fetchMyBooking } from "@/lib/guest-api";
import {
  formatBookingMoney,
  formatLedgerMonth,
  formatStayDate,
  stayLengthLabel,
} from "@/lib/guest-format";

export default function AccountBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState<string | null>(null);
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["guest-booking", id, user?.id],
    queryFn: () => fetchMyBooking(id),
    enabled: Boolean(user && id),
  });

  const downloadDocument = async (key: string, action: () => Promise<void>) => {
    setDownloading(key);
    try {
      await action();
      toast.success("Document downloaded");
    } catch (downloadError) {
      toast.error(downloadError instanceof Error ? downloadError.message : "Could not download document");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <AccountPage>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-5 rounded-full">
        <Link href="/account/bookings">
          <ArrowLeft className="h-4 w-4" />
          Bookings
        </Link>
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      ) : error || !booking ? (
        <AccountEmpty
          title="Booking not found"
          description={error instanceof Error ? error.message : "This booking is not linked to your account."}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/account/bookings">Back to bookings</Link>
            </Button>
          }
        />
      ) : (
        <>
          <header className="mb-7 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.03em] sm:text-[2.1rem]">
                {booking.room_title ?? "Room"}
              </h1>
              <p className="mt-2 text-[15px] text-muted-foreground">
                {stayLengthLabel(booking)} · {booking.seats_booked}{" "}
                {booking.seats_booked === 1 ? "seat" : "seats"}
                {booking.room_number != null ? ` · Room ${booking.room_number}` : ""}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </header>

          <div className="grid gap-3 md:grid-cols-2">
            <AccountCard>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Stay</h2>
              <dl className="space-y-2">
                <AccountField label="Move in" value={formatStayDate(booking.move_in)} />
                <AccountField label="Checkout" value={formatStayDate(booking.check_out)} />
                <AccountField label="Stay" value={stayLengthLabel(booking)} />
                <AccountField
                  label="Seats"
                  value={`${booking.seats_booked} ${booking.seats_booked === 1 ? "seat" : "seats"}`}
                />
              </dl>
            </AccountCard>

            <AccountCard>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Guest</h2>
              <dl className="space-y-2">
                <AccountField label="Name" value={booking.guest_name} />
                <AccountField label="Email" value={booking.guest_email} />
                <AccountField label="Phone" value={booking.guest_phone} />
              </dl>
            </AccountCard>

            <AccountCard>
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">Amounts</h2>
              <dl className="space-y-2">
                <AccountField label="Stay total" value={formatBookingMoney(booking.total_amount, booking)} />
                {booking.discount_amount ? (
                  <AccountField
                    label={booking.coupon_code ? `Discount (${booking.coupon_code})` : "Discount"}
                    value={formatBookingMoney(booking.discount_amount, booking)}
                  />
                ) : null}
                <AccountField
                  label="Collected upfront"
                  value={formatBookingMoney(booking.amount_paid_upfront, booking)}
                />
                <AccountField
                  label="Due this month"
                  value={formatBookingMoney(booking.amount_outstanding, booking)}
                />
              </dl>
            </AccountCard>

            <AccountCard>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-muted-foreground">Security deposit</h2>
                <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
              </div>
              <dl className="space-y-2">
                <AccountField
                  label="Required"
                  value={formatBookingMoney(booking.security_amount, booking)}
                />
                <AccountField
                  label="Returned"
                  value={formatBookingMoney(booking.security_returned, booking)}
                />
                <AccountField
                  label="Held now"
                  value={formatBookingMoney(booking.security_remaining, booking)}
                />
              </dl>
              {(booking.security_ledger ?? []).length > 0 ? (
                <ul className="mt-3 space-y-2 border-t border-border/70 pt-3">
                  {booking.security_ledger?.map((entry, index) => (
                    <li key={entry.id ?? `${entry.type}-${index}`}>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-sm capitalize text-muted-foreground">{entry.type}</p>
                        <p className="text-sm font-medium">
                          {formatBookingMoney(entry.amount, booking)}
                        </p>
                      </div>
                      {entry.note ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{entry.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </AccountCard>
          </div>

          <AccountSection title="Monthly rent">
            {(booking.rent_ledger ?? []).length === 0 ? (
              <AccountCard className="py-8 text-center text-sm text-muted-foreground">
                No rent months on file yet.
              </AccountCard>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {booking.rent_ledger?.map((entry) => {
                  const key = `receipt-${entry.month}`;
                  const paid = entry.payment_status === "paid";
                  return (
                    <AccountCard key={entry.month} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{formatLedgerMonth(entry.month)}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {formatBookingMoney(entry.rent_amount, booking)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RentStatusBadge status={entry.payment_status} />
                        {paid ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            disabled={downloading === key}
                            onClick={() =>
                              downloadDocument(key, () =>
                                downloadMyCurrentMonthReceipt(booking.id, entry.month),
                              )
                            }
                          >
                            {downloading === key ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            Receipt
                          </Button>
                        ) : null}
                      </div>
                    </AccountCard>
                  );
                })}
              </div>
            )}
          </AccountSection>

          <BookingActionsPanel booking={booking} />
        </>
      )}
    </AccountPage>
  );
}
