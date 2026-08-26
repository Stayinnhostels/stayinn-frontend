"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  Loader2,
  Mail,
  Phone,
  ReceiptText,
  Shield,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  BookingStatusBadge,
  RentStatusBadge,
  SecurityStatusBadge,
} from "@/components/account/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  bookingRef,
  downloadMyBookingInvoice,
  downloadMyCurrentMonthReceipt,
  fetchMyBooking,
  type GuestBookingStatus,
} from "@/lib/guest-api";
import { BookingActionsPanel } from "@/components/account/booking-actions-panel";
import {
  formatBookingMoney,
  formatLedgerMonth,
  formatStayDate,
  stayLengthLabel,
} from "@/lib/guest-format";
import { cn } from "@/lib/utils";

const STATUS_ACCENT: Record<GuestBookingStatus, string> = {
  pending: "from-amber-500 to-orange-400",
  confirmed: "from-sky-500 to-blue-500",
  checked_in: "from-violet-500 to-indigo-500",
  checked_out: "from-emerald-500 to-teal-500",
  cancelled: "from-rose-500 to-red-400",
};

const INVOICE_STATUSES = new Set(["confirmed", "checked_in", "checked_out"]);

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
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-20">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 rounded-full font-bold">
        <Link href="/account/bookings">
          <ArrowLeft className="h-4 w-4" />
          All bookings
        </Link>
      </Button>

      {isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-56 rounded-[2rem]" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </div>
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      ) : error || !booking ? (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="flex flex-col items-center px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BedDouble className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">Booking not found</h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "This booking is not linked to your account."}
            </p>
            <Button asChild className="mt-6 rounded-full font-bold">
              <Link href="/account/bookings">Back to bookings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-9 sm:py-10">
            <div
              aria-hidden
              className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
                  <BedDouble className="h-8 w-8" />
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/15">
                      #{bookingRef(booking.id)}
                    </Badge>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {booking.room_title ?? "Room"}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                    {stayLengthLabel(booking)} · {booking.seats_booked}{" "}
                    {booking.seats_booked === 1 ? "seat" : "seats"}
                    {booking.room_number != null ? ` · Room ${booking.room_number}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {INVOICE_STATUSES.has(booking.status) ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full font-bold shadow-lg"
                    disabled={downloading === "invoice"}
                    onClick={() =>
                      downloadDocument("invoice", () => downloadMyBookingInvoice(booking.id))
                    }
                  >
                    {downloading === "invoice" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Invoice
                  </Button>
                ) : null}
                <Button asChild variant="secondary" className="rounded-full font-bold shadow-lg">
                  <Link href="/account/documents">
                    <ReceiptText className="h-4 w-4" />
                    Documents
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoChip
              icon={<CalendarDays className="h-5 w-5" />}
              label="Move in"
              value={formatStayDate(booking.move_in)}
            />
            <InfoChip
              icon={<CalendarDays className="h-5 w-5" />}
              label="Checkout"
              value={formatStayDate(booking.check_out)}
            />
            <InfoChip
              icon={<Clock3 className="h-5 w-5" />}
              label="Stay length"
              value={stayLengthLabel(booking)}
            />
            <InfoChip
              icon={<UsersRound className="h-5 w-5" />}
              label="Seats"
              value={`${booking.seats_booked} ${booking.seats_booked === 1 ? "seat" : "seats"}`}
            />
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
              <div className={cn("h-1.5 bg-gradient-to-r", STATUS_ACCENT[booking.status])} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold">Guest details</h2>
                    <p className="text-sm text-muted-foreground">Contact on this reservation</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <DetailLine label="Name" value={booking.guest_name} />
                  <DetailLine
                    label="Email"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {booking.guest_email}
                      </span>
                    }
                  />
                  <DetailLine
                    label="Phone"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {booking.guest_phone}
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-400" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold">Amounts</h2>
                    <p className="text-sm text-muted-foreground">Booking totals for this stay</p>
                  </div>
                </div>

                <dl className="mt-6 space-y-3">
                  <MoneyRow label="Stay total" value={formatBookingMoney(booking.total_amount, booking)} strong />
                  {booking.discount_amount ? (
                    <MoneyRow
                      label={booking.coupon_code ? `Discount (${booking.coupon_code})` : "Discount"}
                      value={formatBookingMoney(booking.discount_amount, booking)}
                    />
                  ) : null}
                  <MoneyRow
                    label="Collected upfront"
                    value={formatBookingMoney(booking.amount_paid_upfront, booking)}
                  />
                  <MoneyRow
                    label="This month outstanding"
                    value={formatBookingMoney(booking.amount_outstanding, booking)}
                    accent
                  />
                </dl>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold">This month’s rent</h2>
                    <p className="text-sm text-muted-foreground">Only the current month is shown</p>
                  </div>
                </div>

                {(booking.rent_ledger ?? []).length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No rent is due for this month.</p>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {booking.rent_ledger?.map((entry) => {
                      const key = `receipt-${entry.month}`;
                      const paid = entry.payment_status === "paid";
                      return (
                        <li
                          key={entry.month}
                          className="rounded-2xl border border-border/70 bg-muted/30 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-extrabold">{formatLedgerMonth(entry.month)}</p>
                              <p className="mt-1 text-lg font-extrabold">
                                {formatBookingMoney(entry.rent_amount, booking)}
                              </p>
                            </div>
                            <RentStatusBadge status={entry.payment_status} />
                          </div>
                          {paid ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-4 rounded-full font-bold"
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
                              Download receipt
                            </Button>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-700">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold">Security deposit</h2>
                      <p className="text-sm text-muted-foreground">Deposit held against this stay</p>
                    </div>
                  </div>
                  <SecurityStatusBadge status={booking.security_status ?? "not_applicable"} />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <MiniStat
                    label="Required"
                    value={formatBookingMoney(booking.security_amount, booking)}
                  />
                  <MiniStat
                    label="Returned"
                    value={formatBookingMoney(booking.security_returned, booking)}
                  />
                  <MiniStat
                    label="Held now"
                    value={formatBookingMoney(booking.security_remaining, booking)}
                    accent
                  />
                </div>

                {(booking.security_ledger ?? []).length > 0 ? (
                  <ul className="mt-5 space-y-2 border-t border-border/60 pt-4">
                    {booking.security_ledger?.map((entry, index) => (
                      <li
                        key={entry.id ?? `${entry.type}-${index}`}
                        className="rounded-xl bg-muted/35 px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold capitalize">{entry.type}</p>
                          <p className="text-sm font-extrabold">
                            {formatBookingMoney(entry.amount, booking)}
                          </p>
                        </div>
                        {entry.note ? (
                          <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-muted-foreground">No deposit ledger entries yet.</p>
                )}
              </CardContent>
            </Card>
          </section>

          <BookingActionsPanel booking={booking} />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full font-bold">
              <Link href="/account/payments">
                View payments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full font-bold">
              <Link href="/account/documents">
                Open documents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-3xl border-border/70 shadow-sm">
      <CardContent className="flex items-center gap-3.5 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-0.5 truncate font-extrabold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/40 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl px-4 py-3",
        accent ? "bg-amber-500/10" : "bg-muted/40",
      )}
    >
      <dt className={cn("text-sm", accent ? "font-bold text-amber-800" : "text-muted-foreground")}>
        {label}
      </dt>
      <dd className={cn("font-semibold", strong || accent ? "text-base font-extrabold" : "text-sm")}>
        {value}
      </dd>
    </div>
  );
}
function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl p-3.5", accent ? "bg-sky-500/10" : "bg-muted/45")}>
      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-wide",
          accent ? "text-sky-700" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className={cn("mt-1 text-sm font-extrabold", accent ? "text-sky-800" : "")}>{value}</p>
    </div>
  );
}

