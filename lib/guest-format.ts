import { formatMoney, type DisplayCurrency } from "@/lib/currency";
import type { GuestBooking, GuestBookingStatus } from "@/lib/guest-api";

export const BOOKING_STATUS_LABELS: Record<GuestBookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  checked_out: "Checked out",
  cancelled: "Cancelled",
};

export const BOOKING_STATUS_CLASS: Record<GuestBookingStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  confirmed: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  checked_in: "bg-violet-500/15 text-violet-700 border-violet-500/30",
  checked_out: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-700 border-rose-500/30",
};

export const RENT_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  not_paid: "Unpaid",
  partial: "Partial",
  returned: "Returned",
};

export const RENT_STATUS_CLASS: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  not_paid: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  partial: "bg-sky-500/15 text-sky-700 border-sky-500/30",
  returned: "bg-muted text-muted-foreground border-border",
};

export const SECURITY_STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  held: "Held",
  returned: "Returned",
  not_paid: "Unpaid",
  not_applicable: "Not applicable",
};

export function formatStayDate(value: string | null | undefined) {
  if (!value) return "—";
  const key = value.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatLedgerMonth(month: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return month;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function bookingCurrency(booking: Pick<GuestBooking, "currency">): DisplayCurrency {
  return booking.currency === "usd" ? "usd" : "pkr";
}

export function formatBookingMoney(amount: number | null | undefined, booking: Pick<GuestBooking, "currency">) {
  return formatMoney(Number(amount) || 0, bookingCurrency(booking));
}

export function stayLengthLabel(booking: Pick<GuestBooking, "stay_unit" | "nights" | "months">) {
  if (booking.stay_unit === "night" && booking.nights) {
    return `${booking.nights} night${booking.nights === 1 ? "" : "s"}`;
  }
  return `${booking.months} month${booking.months === 1 ? "" : "s"}`;
}

export const ACTIVE_BOOKING_STATUSES: GuestBookingStatus[] = ["pending", "confirmed", "checked_in"];
