import { getApiBaseUrl } from "@/lib/api-client";
import { BOOKING_RULES_DEFAULTS, type BookingRulesSettings } from "@/lib/booking-rules";
import { HOMEPAGE_HERO_DEFAULTS, type HomepageHeroSettings } from "@/lib/homepage-hero";
import { HOMEPAGE_CTA_DEFAULTS, type HomepageCtaSettings } from "@/lib/homepage-cta";
import { ABOUT_PAGE_DEFAULTS, type AboutPageSettings } from "@/lib/about-page";
import { normalizeAboutValues } from "@/lib/about-values";
import { ROOMS_FILTER_DEFAULTS, type RoomsFilterSettings } from "@/lib/rooms-filter";
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
  emergencyPhone: string;
  emergencyLabel: string;
  fullAddress: string;
  mapUrl: string;
  primaryColor: string;
  accentColor: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  threads: string;
} & BookingRulesSettings &
  RoomsFilterSettings &
  HomepageHeroSettings &
  HomepageCtaSettings &
  AboutPageSettings;

export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  hotelName: "Stay Inn Hostels",
  tagline: "Live your journey, stay with us",
  description:
    "Affordable, secure and spotlessly clean accommodation built for students and working professionals. Pick your seat — we handle the rest.",
  email: "info@stayinnhostels.com",
  phone: "+92 331 0008196",
  address: "Lahore",
  city: "Punjab",
  country: "Pakistan",
  whatsapp: "923310008196",
  whatsapp_url: "https://wa.me/923310008196",
  emergencyPhone: "",
  emergencyLabel: "Emergency / front desk",
  fullAddress: "Lahore, Punjab, Pakistan",
  mapUrl: "",
  primaryColor: DEFAULT_PRIMARY_COLOR,
  accentColor: DEFAULT_ACCENT_COLOR,
  website: "",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  linkedin: "",
  threads: "",
  ...ROOMS_FILTER_DEFAULTS,
  ...BOOKING_RULES_DEFAULTS,
  ...HOMEPAGE_HERO_DEFAULTS,
  ...HOMEPAGE_CTA_DEFAULTS,
  ...ABOUT_PAGE_DEFAULTS,
};

export function brandShortName(hotelName: string) {
  const trimmed = hotelName.trim();
  if (!trimmed) return "Stay Inn";
  const first = trimmed.split(/\s+/)[0];
  return first || trimmed;
}

async function isFetchingThisNextApp(apiBase: string) {
  if (typeof window !== "undefined") return false;
  try {
    const { headers } = await import("next/headers");
    const host = (await headers()).get("host");
    if (!host) return false;
    return new URL(apiBase).host === host;
  } catch {
    return false;
  }
}

export async function fetchPublicSiteSettings(): Promise<SiteSettings> {
  try {
    const base = getApiBaseUrl();
    // Root layout runs for 404s. If the API base is this Next server, fetching
    // /api/v1/settings/public would recurse and flood the dev log.
    if (await isFetchingThisNextApp(base)) {
      return SITE_SETTINGS_DEFAULTS;
    }
    const res = await fetch(`${base}/api/v1/settings/public`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return SITE_SETTINGS_DEFAULTS;
    const data = (await res.json()) as { success?: boolean; settings?: SiteSettings };
    if (!data.success || !data.settings) return SITE_SETTINGS_DEFAULTS;
    const merged = { ...SITE_SETTINGS_DEFAULTS, ...data.settings };
    return {
      ...merged,
      aboutValues: normalizeAboutValues(merged as unknown as Record<string, unknown>),
    };
  } catch {
    return SITE_SETTINGS_DEFAULTS;
  }
}
