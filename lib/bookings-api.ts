import { apiFetch } from "@/lib/api-client";
import type { DisplayCurrency } from "@/lib/currency";
import type { MarketingRoom } from "@/lib/rooms-api";

export type BookingContact = {
  name: string;
  phone: string | null;
  whatsapp: string | null;
  whatsapp_url: string | null;
};

export type BookingResult = {
  id: string;
  room_id: string;
  room_title: string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  seats_booked: number;
  months: number;
  move_in: string;
  check_out: string;
  price_per_seat: number;
  total_amount: number;
  original_total?: number | null;
  discount_amount?: number | null;
  coupon_code?: string | null;
  currency?: DisplayCurrency;
  status: string;
};

export type CreateBookingInput = {
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  seats_booked: number;
  months: number;
  move_in: string;
  notes?: string;
  coupon_code?: string;
  currency?: DisplayCurrency;
};

type CreateBookingResponse = {
  success: boolean;
  message?: string;
  booking: BookingResult;
  room: MarketingRoom & { price_per_night?: number };
  contact: BookingContact;
};

export async function createBookingApi(input: CreateBookingInput) {
  const data = await apiFetch<CreateBookingResponse>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!data.success || !data.booking) {
    throw new Error(data.message ?? "Booking failed");
  }
  return data;
}
