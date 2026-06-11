import type { DisplayCurrency } from "@/lib/currency";

export const SECURITY_PER_SEAT_PKR = 5000;
export const SECURITY_PER_SEAT_USD = 50;

export function securityPerSeat(currency: DisplayCurrency) {
  return currency === "usd" ? SECURITY_PER_SEAT_USD : SECURITY_PER_SEAT_PKR;
}

export function securityDepositForSeats(seats: number, currency: DisplayCurrency) {
  const count = Math.max(1, Number(seats) || 1);
  return securityPerSeat(currency) * count;
}
