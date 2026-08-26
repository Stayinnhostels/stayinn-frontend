"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck2,
  CreditCard,
  Download,
  FileText,
  LayoutDashboard,
  Loader2,
  MapPin,
  Plus,
  ReceiptText,
  Shield,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { BookingStatusBadge } from "@/components/account/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import {
  bookingRef,
  downloadMyCurrentMonthReceipt,
  fetchMyBookings,
  type GuestBookingStatus,
} from "@/lib/guest-api";
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
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-20">
      <section className="relative overflow-hidden rounded-[2rem] bg-[image:var(--gradient-hero)] px-6 py-8 text-primary-foreground shadow-[var(--shadow-glow)] sm:px-9 sm:py-10">
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[42px] border-white/10"
        />
        <div aria-hidden className="absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-7">
          <div className="flex items-center gap-5">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur sm:flex">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <div>
              <Badge className="mb-3 rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/15">
                MY ACCOUNT
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Hi, {firstName}</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                Your stays, rent status, receipts and documents in one place.
              </p>
            </div>
          </div>
          <Button asChild size="lg" variant="secondary" className="rounded-full font-bold shadow-lg">
            <Link href="/booking">
              <Plus className="h-4 w-4" />
              Book a seat
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <p className="mt-8 text-sm font-medium text-destructive">
          {error instanceof Error ? error.message : "Could not load your account."}
        </p>
      ) : null}

      {!isLoading && currentRentRows.length > 0 ? (
        <section className="mt-8 space-y-4">
          {currentRentRows.map(({ booking, entry }) => {
            const key = `${booking.id}-${entry.month}`;
            return (
              <Card
                key={key}
                className="overflow-hidden rounded-3xl border-emerald-500/20 shadow-[var(--shadow-card)]"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardContent className="flex flex-wrap items-center justify-between gap-5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                      <ReceiptText className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                        Receipt ready
                      </p>
                      <h2 className="mt-0.5 text-xl font-extrabold">
                        {formatLedgerMonth(entry.month)} · {booking.room_title ?? "Room"}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This month’s rent is paid. Download your receipt anytime.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="rounded-full font-bold"
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
                </CardContent>
              </Card>
            );
          })}
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active bookings"
          value={isLoading ? "—" : String(summary?.active ?? 0)}
          icon={<CalendarCheck2 className="h-5 w-5" />}
          accent="from-sky-500 to-blue-500"
          tone="bg-sky-500/15 text-sky-700"
        />
        <StatCard
          label="Total bookings"
          value={isLoading ? "—" : String(summary?.total ?? 0)}
          icon={<MapPin className="h-5 w-5" />}
          accent="from-violet-500 to-indigo-500"
          tone="bg-violet-500/15 text-violet-700"
        />
        <StatCard
          label="This month outstanding"
          value={isLoading ? "—" : formatBookingMoney(summary?.outstanding, latest)}
          icon={<CreditCard className="h-5 w-5" />}
          accent="from-amber-500 to-orange-400"
          tone="bg-amber-500/15 text-amber-700"
        />
        <StatCard
          label="Security held"
          value={isLoading ? "—" : formatBookingMoney(summary?.security_held, latest)}
          icon={<Shield className="h-5 w-5" />}
          accent="from-emerald-500 to-teal-500"
          tone="bg-emerald-500/15 text-emerald-700"
        />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/account/bookings"
          icon={<BedDouble className="h-5 w-5" />}
          title="Bookings"
          description="View stays and status"
        />
        <QuickLink
          href="/account/payments"
          icon={<WalletCards className="h-5 w-5" />}
          title="Payments"
          description="Rent and security"
        />
        <QuickLink
          href="/account/documents"
          icon={<FileText className="h-5 w-5" />}
          title="Documents"
          description="Invoices and receipts"
        />
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Recent bookings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your latest seat reservations</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-full font-bold">
            <Link href="/account/bookings">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="rounded-3xl border-dashed">
            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BedDouble className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold">No bookings yet</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Reserve a seat on the website and it will show up here automatically.
              </p>
              <Button asChild className="mt-6 rounded-full font-bold">
                <Link href="/booking">
                  <Plus className="h-4 w-4" />
                  Book a seat
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {bookings.slice(0, 4).map((booking) => (
              <Card
                key={booking.id}
                className="group overflow-hidden rounded-3xl border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-card)]"
              >
                <div className={cn("h-1.5 bg-gradient-to-r", STATUS_ACCENT[booking.status])} />
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BedDouble className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                          #{bookingRef(booking.id)}
                        </p>
                        <h3 className="mt-0.5 text-lg font-extrabold tracking-tight">
                          {booking.room_title ?? "Room"}
                        </h3>
                      </div>
                    </div>
                    <BookingStatusBadge status={booking.status} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/45 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        Move in
                      </p>
                      <p className="mt-1 text-sm font-extrabold">{formatStayDate(booking.move_in)}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/45 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        Checkout
                      </p>
                      <p className="mt-1 text-sm font-extrabold">{formatStayDate(booking.check_out)}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    {stayLengthLabel(booking)} · {booking.seats_booked}{" "}
                    {booking.seats_booked === 1 ? "seat" : "seats"}
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-border/60 pt-5">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Booking total</p>
                      <p className="mt-0.5 text-lg font-extrabold">
                        {formatBookingMoney(booking.total_amount, booking)}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full font-bold">
                      <Link href={`/account/bookings/${booking.id}`}>
                        Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
  tone: string;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
      <div className={cn("h-1.5 bg-gradient-to-r", accent)} />
      <CardContent className="p-5">
        <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-2xl", tone)}>
          {icon}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full rounded-3xl border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-card)]">
        <CardContent className="flex items-center gap-3.5 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="font-extrabold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  );
}
