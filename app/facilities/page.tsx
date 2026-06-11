import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FacilitiesGrid } from "@/components/facilities-grid";

export const metadata: Metadata = {
  title: "Facilities — Stay Inn Hostels",
  description: "Explore Stay Inn facilities: high-speed WiFi, shared kitchen, lockers, laundry, common lounges and more.",
};

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            FACILITIES
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Everything you need, <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">already inside.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            WiFi, kitchen, laundry, and more — all included.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <FacilitiesGrid />

        <div className="mt-16 rounded-3xl border-2 p-10 text-center bg-card shadow-[var(--shadow-card)]">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Ready to move in?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Pick a room, lock in your seat, and you&apos;re set. Most bookings are confirmed within an hour.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 font-bold">
            <Link href="/rooms">Browse Rooms</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
