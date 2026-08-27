"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2, ReceiptText, ScrollText } from "lucide-react";
import { toast } from "sonner";
import {
  AccountCard,
  AccountEmpty,
  AccountError,
  AccountPage,
  AccountPageHeader,
  AccountSection,
} from "@/components/account/account-page";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { useSiteSettings } from "@/components/site-settings-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { parseHouseRulesLines } from "@/lib/booking-rules";
import { downloadMyCurrentMonthReceipt, fetchMyBookings } from "@/lib/guest-api";
import { formatLedgerMonth } from "@/lib/guest-format";

const DOCUMENT_BOOKING_STATUSES = new Set(["confirmed", "checked_in"]);

export default function AccountDocumentsPage() {
  const { user } = useAuth();
  const settings = useSiteSettings();
  const houseRuleLines = parseHouseRulesLines(settings.houseRules);
  const [downloading, setDownloading] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["guest-bookings", user?.id],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    enabled: Boolean(user),
  });

  const bookings = (data?.bookings ?? []).filter((booking) =>
    DOCUMENT_BOOKING_STATUSES.has(booking.status),
  );

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
      <AccountPageHeader
        title="Documents"
        description="Confirmations, paid rent receipts, and house rules for your current stays."
      />

      {error ? (
        <AccountError
          message={error instanceof Error ? error.message : "Could not load documents."}
        />
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      ) : bookings.length === 0 ? (
        <AccountEmpty
          title="No documents yet"
          description="Files appear here when a booking is confirmed or checked in."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const paidReceipts = (booking.rent_ledger ?? []).filter(
              (entry) => entry.payment_status === "paid",
            );

            return (
              <AccountCard key={booking.id} className="overflow-hidden p-0">
                <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                  <h2 className="font-semibold tracking-tight">{booking.room_title ?? "Room booking"}</h2>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 sm:px-5">
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Booking confirmation</p>
                      <p className="text-sm text-muted-foreground">Dates, room, and status</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/account/bookings/${booking.id}`}>View</Link>
                    </Button>
                  </div>
                  {paidReceipts.map((entry) => {
                    const key = `receipt-${booking.id}-${entry.month}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3.5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ReceiptText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{formatLedgerMonth(entry.month)} receipt</p>
                          <p className="text-sm text-muted-foreground">Proof of payment</p>
                        </div>
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
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </AccountCard>
            );
          })}
        </div>
      )}

      <AccountSection title="House rules">
        <AccountCard>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ScrollText className="h-4 w-4" />
            </div>
            <p className="text-sm text-muted-foreground">Current stay policies for this property</p>
          </div>
          {houseRuleLines.length > 0 ? (
            <ul className="space-y-2.5">
              {houseRuleLines.slice(0, 4).map((rule) => (
                <li key={rule} className="text-sm leading-relaxed text-muted-foreground">
                  {rule}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Review the property’s stay policies.</p>
          )}
          <Button asChild variant="outline" size="sm" className="mt-5 rounded-full">
            <Link href="/booking-rules">View all rules</Link>
          </Button>
        </AccountCard>
      </AccountSection>
    </AccountPage>
  );
}
