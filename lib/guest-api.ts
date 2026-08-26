import { apiFetch, getApiBaseUrl } from "@/lib/api/client";
import { loadSession } from "@/lib/auth-session";
import type { DisplayCurrency } from "@/lib/currency";
import { filenameFromContentDisposition, triggerBrowserDownload } from "@/lib/download-blob";

export type GuestBookingStatus = "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled";

export type GuestRentLedgerEntry = {
  month: string;
  rent_amount: number | null;
  payment_status: string;
};

export type GuestSecurityLedgerEntry = {
  id?: string;
  type: "deposit" | "refund" | "forfeit" | "adjustment";
  amount: number;
  balance_after: number;
  note: string;
  payer_name: string;
  recorded_at: string | null;
};

export type GuestBooking = {
  id: string;
  room_id: string | null;
  room_title: string | null;
  room_number: number | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  seats_booked: number;
  stay_unit?: "month" | "night";
  nights?: number | null;
  months: number;
  months_paid_upfront?: number | null;
  amount_paid_upfront?: number;
  amount_outstanding?: number;
  security_status?: string;
  security_amount?: number | null;
  security_returned?: number | null;
  security_retained?: number | null;
  security_remaining?: number;
  security_ledger?: GuestSecurityLedgerEntry[];
  move_in: string | null;
  check_out: string | null;
  price_per_seat: number;
  total_amount: number;
  original_total?: number | null;
  discount_amount?: number | null;
  coupon_code?: string | null;
  currency?: DisplayCurrency | null;
  status: GuestBookingStatus;
  amount_refunded?: number | null;
  amount_retained?: number | null;
  rent_ledger?: GuestRentLedgerEntry[];
  created_at: string | null;
  updated_at: string | null;
};

export type GuestBookingsSummary = {
  total: number;
  active: number;
  outstanding: number;
  security_held: number;
};

type ListResponse = {
  success: boolean;
  message?: string;
  bookings: GuestBooking[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary: GuestBookingsSummary;
};

function requireToken() {
  const token = loadSession()?.token;
  if (!token) {
    throw new Error("Sign in required");
  }
  return token;
}

export async function fetchMyBookings(params?: { status?: GuestBookingStatus; limit?: number; page?: number }) {
  const token = requireToken();
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.page) search.set("page", String(params.page));
  const q = search.toString();
  const data = await apiFetch<ListResponse>(`/api/v1/me/bookings${q ? `?${q}` : ""}`, { token });
  if (!data.success) {
    throw new Error(data.message ?? "Could not load bookings");
  }
  return data;
}

export async function fetchMyBooking(id: string) {
  const token = requireToken();
  const data = await apiFetch<{ success: boolean; message?: string; booking: GuestBooking }>(
    `/api/v1/me/bookings/${id}`,
    { token },
  );
  if (!data.success || !data.booking) {
    throw new Error(data.message ?? "Booking not found");
  }
  return data.booking;
}

async function downloadGuestPdf(path: string, fallbackFilename: string) {
  const token = requireToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? `Could not download document (${response.status})`);
  }

  const blob = await response.blob();
  const filename = filenameFromContentDisposition(
    response.headers.get("Content-Disposition"),
    fallbackFilename,
  );
  triggerBrowserDownload(blob, filename);
}

export async function downloadMyCurrentMonthReceipt(bookingId: string, month: string) {
  return downloadGuestPdf(
    `/api/v1/me/bookings/${bookingId}/receipt`,
    `rent-receipt-${month}.pdf`,
  );
}

export async function downloadMyBookingInvoice(bookingId: string) {
  return downloadGuestPdf(
    `/api/v1/me/bookings/${bookingId}/invoice`,
    `booking-invoice-${bookingRef(bookingId)}.pdf`,
  );
}

export type GuestBookingRequestType = "cancel" | "room_change" | "additional_seat";
export type GuestBookingRequestStatus = "pending" | "approved" | "rejected" | "withdrawn";

export type GuestBookingRequest = {
  id: string;
  booking_id: string;
  type: GuestBookingRequestType;
  type_label: string;
  status: GuestBookingRequestStatus;
  reason: string;
  payload: {
    requested_room_id?: string;
    requested_room_title?: string;
    additional_seats?: number;
    current_seats?: number;
    target_seats?: number;
  };
  admin_note: string;
  amount_refunded: number | null;
  resolved_at: string | null;
  created_at: string | null;
};

export async function fetchMyBookingRequests(bookingId: string) {
  const token = requireToken();
  const data = await apiFetch<{ success: boolean; message?: string; requests: GuestBookingRequest[] }>(
    `/api/v1/me/bookings/${bookingId}/requests`,
    { token },
  );
  if (!data.success) {
    throw new Error(data.message ?? "Could not load requests");
  }
  return data.requests ?? [];
}

export async function createMyBookingRequest(
  bookingId: string,
  body: {
    type: GuestBookingRequestType;
    reason?: string;
    requested_room_id?: string;
    additional_seats?: number;
  },
) {
  const token = requireToken();
  const data = await apiFetch<{ success: boolean; message?: string; request: GuestBookingRequest }>(
    `/api/v1/me/bookings/${bookingId}/requests`,
    {
      token,
      method: "POST",
      body: JSON.stringify(body),
    },
  );
  if (!data.success || !data.request) {
    throw new Error(data.message ?? "Could not submit request");
  }
  return data.request;
}

export async function withdrawMyBookingRequest(bookingId: string, requestId: string) {
  const token = requireToken();
  const data = await apiFetch<{ success: boolean; message?: string; request: GuestBookingRequest }>(
    `/api/v1/me/bookings/${bookingId}/requests/${requestId}/withdraw`,
    { token, method: "POST" },
  );
  if (!data.success || !data.request) {
    throw new Error(data.message ?? "Could not withdraw request");
  }
  return data.request;
}

export function bookingRef(id: string) {
  return id.slice(-8).toUpperCase();
}
