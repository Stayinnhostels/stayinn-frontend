import type { Metadata } from "next";
import { fetchPublicSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { hotelName } = await fetchPublicSiteSettings();
  return {
    title: `Booking Rules — ${hotelName}`,
    description: `Check-in, cancellation, house rules, and booking policies at ${hotelName}.`,
  };
}

export default function BookingRulesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
