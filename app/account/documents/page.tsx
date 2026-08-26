"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Eye,
  FileCheck2,
  FileText,
  FolderOpen,
  Loader2,
  ReceiptText,
  ScrollText,
} from "lucide-react";
import { toast } from "sonner";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { useSiteSettings } from "@/components/site-settings-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { parseHouseRulesLines } from "@/lib/booking-rules";
import {
  bookingRef,
  downloadMyBookingInvoice,
  downloadMyCurrentMonthReceipt,
  fetchMyBookings,
} from "@/lib/guest-api";
import { formatLedgerMonth } from "@/lib/guest-format";

const DOCUMENT_BOOKING_STATUSES = new Set(["confirmed", "checked_in"]);

export default function AccountDocumentsPage() {
  const { user } = useAuth();
  const settings = useSiteSettings();
  const houseRuleLines = parseHouseRulesLines(settings.houseRules);
  const houseRulesCount = houseRuleLines.length;
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
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
              <FolderOpen className="h-8 w-8" />
            </div>
            <div>
              <Badge className="mb-3 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/15">
                DOCUMENT CENTER
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your documents</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Confirmations, invoices, receipts and property rules for your active stays.
              </p>
            </div>
          </div>
          {!isLoading ? (
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold">{bookings.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Active {bookings.length === 1 ? "folder" : "folders"}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load documents."}
        </p>
      ) : null}

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Booking files</h2>
              <p className="mt-1 text-sm text-muted-foreground">Open a folder to view its available files</p>
            </div>
            {!isLoading && bookings.length > 0 ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold">
                {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
              </Badge>
            ) : null}
          </div>

          <div className="space-y-5">
          {isLoading ? (
            <>
              <Skeleton className="h-72 rounded-3xl" />
              <Skeleton className="h-72 rounded-3xl" />
            </>
          ) : bookings.length === 0 ? (
            <Card className="rounded-3xl border-dashed">
              <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <FolderOpen className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-extrabold">No booking files yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Documents will appear here when a booking is confirmed or checked in.
                </p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => {
              const paidReceipts = (booking.rent_ledger ?? []).filter(
                (entry) => entry.payment_status === "paid",
              );

              return (
                <Card
                  key={booking.id}
                  className="overflow-hidden rounded-3xl border-primary/15 shadow-[var(--shadow-card)]"
                >
                  <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                        <FolderOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                          Booking #{bookingRef(booking.id)}
                        </p>
                        <h3 className="mt-0.5 text-lg font-extrabold">
                          {booking.room_title ?? "Room booking"}
                        </h3>
                      </div>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>

                  <CardContent className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                    <DocumentTile
                      tone="primary"
                      icon={<FileCheck2 className="h-5 w-5" />}
                      title="Booking confirmation"
                      description="Reservation details, dates, room and booking status."
                      action={
                        <Button asChild variant="outline" size="sm" className="w-full rounded-xl font-bold">
                          <Link href={`/account/bookings/${booking.id}`}>
                            <Eye className="h-4 w-4" />
                            View confirmation
                          </Link>
                        </Button>
                      }
                    />

                    <DocumentTile
                      tone="amber"
                      icon={<FileText className="h-5 w-5" />}
                      title="Booking invoice"
                      description="Itemized invoice for your complete booking."
                      action={
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl font-bold"
                          disabled={downloading === `invoice-${booking.id}`}
                          onClick={() =>
                            downloadDocument(`invoice-${booking.id}`, () =>
                              downloadMyBookingInvoice(booking.id),
                            )
                          }
                        >
                          {downloading === `invoice-${booking.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download
                        </Button>
                      }
                    />

                    {paidReceipts.map((entry) => {
                      const key = `receipt-${booking.id}-${entry.month}`;
                      return (
                        <DocumentTile
                          key={key}
                          tone="emerald"
                          icon={<ReceiptText className="h-5 w-5" />}
                          title={`${formatLedgerMonth(entry.month)} rent receipt`}
                          description="Proof of payment for this month’s rent."
                          action={
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full rounded-xl font-bold"
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
                          }
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })
          )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-28">
          <Card className="overflow-hidden rounded-3xl border-primary/15 shadow-[var(--shadow-card)]">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 to-primary/5 px-6 py-6">
              <div
                aria-hidden
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-primary/10"
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                <ScrollText className="h-6 w-6" />
              </div>
              <h2 className="relative mt-4 text-xl font-extrabold">House rules</h2>
              <p className="relative mt-1 text-sm text-muted-foreground">
                Live from your property dashboard
              </p>
            </div>
            <CardContent className="p-5">
              {houseRuleLines.length > 0 ? (
                <ul className="space-y-3">
                  {houseRuleLines.slice(0, 3).map((rule) => (
                    <li key={rule} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="line-clamp-2">{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Review the property’s current booking and stay policies.
                </p>
              )}
              {houseRulesCount > 3 ? (
                <p className="mt-4 text-xs font-bold text-primary">+ {houseRulesCount - 3} more rules</p>
              ) : null}
              <Button asChild className="mt-5 w-full rounded-xl font-bold">
                <Link href="/booking-rules">
                  <Eye className="h-4 w-4" />
                  View current rules
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function DocumentTile({
  icon,
  title,
  description,
  action,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  tone: "primary" | "amber" | "emerald";
}) {
  const toneClasses = {
    primary: {
      tile: "border-primary/20 bg-primary/[0.045] hover:border-primary/40 hover:bg-primary/[0.07]",
      icon: "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]",
      label: "CONFIRMATION",
    },
    amber: {
      tile: "border-amber-500/20 bg-amber-500/[0.055] hover:border-amber-500/40 hover:bg-amber-500/[0.08]",
      icon: "bg-amber-500 text-white shadow-lg shadow-amber-500/15",
      label: "PDF INVOICE",
    },
    emerald: {
      tile: "border-emerald-500/20 bg-emerald-500/[0.055] hover:border-emerald-500/40 hover:bg-emerald-500/[0.08]",
      icon: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/15",
      label: "PAID RECEIPT",
    },
  }[tone];

  return (
    <div
      className={`group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${toneClasses.tile}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses.icon}`}>
          {icon}
        </div>
        <span className="rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-muted-foreground">
          {toneClasses.label}
        </span>
      </div>
      <p className="mt-4 font-extrabold">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-auto pt-4">{action}</div>
    </div>
  );
}
