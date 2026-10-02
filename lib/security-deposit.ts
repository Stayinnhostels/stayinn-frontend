import type { DisplayCurrency } from "@/lib/currency";

/** Flat default security deposit for monthly stays (not per seat). */
export const DEFAULT_SECURITY_PKR = 10000;
export const DEFAULT_SECURITY_USD = 100;

/** @deprecated Prefer DEFAULT_SECURITY_PKR */
export const SECURITY_PER_SEAT_PKR = DEFAULT_SECURITY_PKR;
/** @deprecated Prefer DEFAULT_SECURITY_USD */
export const SECURITY_PER_SEAT_USD = DEFAULT_SECURITY_USD;

export function securityPerSeat(currency: DisplayCurrency) {
  return currency === "usd" ? DEFAULT_SECURITY_USD : DEFAULT_SECURITY_PKR;
}

/** Default security for a monthly booking. `seats` is ignored (flat amount). */
export function securityDepositForSeats(_seats: number, currency: DisplayCurrency) {
  return securityPerSeat(currency);
}
