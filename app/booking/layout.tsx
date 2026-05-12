import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Seat — Stay Inn Hostels",
  description: "Review your room and complete your booking with secure Stripe checkout.",
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
