export type CancellationPolicy = "flexible" | "moderate" | "strict";

export type BookingRulesSettings = {
  checkInTime: string;
  checkOutTime: string;
  minStay: number;
  maxStay: number;
  advanceBookingDays: number;
  cancellationWindowHours: number;
  cancellationPolicy: CancellationPolicy;
  depositPercent: number;
  allowChildren: boolean;
  allowPets: boolean;
  smokingAllowed: boolean;
  houseRules: string;
  quietHoursStart: string;
  quietHoursEnd: string;
};

export const BOOKING_RULES_DEFAULTS: BookingRulesSettings = {
  checkInTime: "14:00",
  checkOutTime: "11:00",
  minStay: 1,
  maxStay: 30,
  advanceBookingDays: 365,
  cancellationWindowHours: 48,
  cancellationPolicy: "moderate",
  depositPercent: 25,
  allowChildren: true,
  allowPets: false,
  smokingAllowed: false,
  houseRules:
    "• No loud music after 10pm\n• Keep common areas clean\n• Be respectful of other guests\n• ID required at check-in",
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

/** Format 24h "HH:mm" for display. */
export function formatTime24h(value: string): string {
  const [hRaw, mRaw] = value.split(":");
  const h = Number.parseInt(hRaw ?? "", 10);
  const m = Number.parseInt(mRaw ?? "", 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function cancellationPolicyTitle(policy: CancellationPolicy): string {
  switch (policy) {
    case "flexible":
      return "Flexible";
    case "moderate":
      return "Moderate";
    case "strict":
      return "Strict";
    default:
      return policy;
  }
}

export function cancellationPolicyDescription(
  policy: CancellationPolicy,
  windowHours: number,
): string {
  const hoursLabel =
    windowHours >= 24
      ? `${Math.round(windowHours / 24)} day(s)`
      : `${windowHours} hour(s)`;

  switch (policy) {
    case "flexible":
      return `Full refund when you cancel at least ${hoursLabel} before move-in.`;
    case "moderate":
      return `Full refund when you cancel at least ${hoursLabel} before move-in; partial or no refund closer to move-in.`;
    case "strict":
      return `Limited refund when you cancel within ${hoursLabel} of move-in; stricter terms apply closer to arrival.`;
    default:
      return `Cancellation terms apply ${hoursLabel} before move-in.`;
  }
}

export function parseHouseRulesLines(houseRules: string): string[] {
  return houseRules
    .split(/\r?\n/)
    .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
    .filter(Boolean);
}
