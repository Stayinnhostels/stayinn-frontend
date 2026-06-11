import { getApiBaseUrl } from "@/lib/api-client";
import { BOOKING_RULES_DEFAULTS, type BookingRulesSettings } from "@/lib/booking-rules";
import { DEFAULT_ACCENT_COLOR, DEFAULT_PRIMARY_COLOR } from "@/lib/site-theme";

export type SiteSettings = {
  hotelName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string | null;
  whatsapp_url: string | null;
  fullAddress: string;
  mapUrl: string;
  primaryColor: string;
  accentColor: string;
} & BookingRulesSettings;

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  hotelName: "Stay Inn Hostels",
  tagline: "Seat by Seat.",
  description:
    "Affordable, secure and spotlessly clean accommodation built for students and working professionals. Pick your seat — we handle the rest.",
  email: "info@stayinnhostels.com",
  phone: "+92 331 0008196",
  address: "Lahore",
  city: "Punjab",
  country: "Pakistan",
  whatsapp: "923310008196",
  whatsapp_url: "https://wa.me/923310008196",
  fullAddress: "Lahore, Punjab, Pakistan",
  mapUrl: "",
  primaryColor: DEFAULT_PRIMARY_COLOR,
  accentColor: DEFAULT_ACCENT_COLOR,
  ...BOOKING_RULES_DEFAULTS,
};

export function brandShortName(hotelName: string) {
  const trimmed = hotelName.trim();
  if (!trimmed) return "Stay Inn";
  const first = trimmed.split(/\s+/)[0];
  return first || trimmed;
}

export async function fetchPublicSiteSettings(): Promise<SiteSettings> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/v1/settings/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return SITE_SETTINGS_DEFAULTS;
    const data = (await res.json()) as { success?: boolean; settings?: SiteSettings };
    if (!data.success || !data.settings) return SITE_SETTINGS_DEFAULTS;
    return { ...SITE_SETTINGS_DEFAULTS, ...data.settings };
  } catch {
    return SITE_SETTINGS_DEFAULTS;
  }
}
