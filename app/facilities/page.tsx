import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wifi,
  UtensilsCrossed,
  Lock,
  WashingMachine,
  Coffee,
  Sofa,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Tv,
  BookOpen,
  Bike,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Facilities — Stay Inn Hostels",
  description: "Explore Stay Inn facilities: high-speed WiFi, shared kitchen, lockers, laundry, common lounges and more.",
};

const facilities = [
  { icon: Wifi, title: "High-Speed WiFi", desc: "Fibre 300 Mbps with strong coverage in every room and common area. Perfect for streaming and remote work." },
  { icon: UtensilsCrossed, title: "Shared Kitchen", desc: "Fully equipped community kitchen with stovetop, microwave, fridge and free basic condiments." },
  { icon: Lock, title: "Personal Lockers", desc: "Sturdy in-room lockers for every resident. Bring your own padlock or rent one at reception." },
  { icon: WashingMachine, title: "Laundry Service", desc: "Self-service washers and dryers, plus optional drop-off laundry at student-friendly rates." },
  { icon: Coffee, title: "Café & Lounge", desc: "All-day coffee, tea and snacks in a cozy lounge built for hangouts and casual meetings." },
  { icon: Sofa, title: "Common Areas", desc: "Multiple chill zones, study rooms and a rooftop terrace for unwinding with friends." },
  { icon: Dumbbell, title: "Mini Gym", desc: "Compact gym with cardio and free weights, open from 6am to 11pm daily." },
  { icon: ShieldCheck, title: "24/7 Security", desc: "CCTV surveillance, smart access control, and round-the-clock on-site staff." },
  { icon: Sparkles, title: "Daily Housekeeping", desc: "Common areas cleaned multiple times a day. Rooms sanitized weekly at no extra cost." },
  { icon: Tv, title: "Entertainment", desc: "Big-screen TV with OTT subscriptions and a board-game corner for community nights." },
  { icon: BookOpen, title: "Quiet Study Zone", desc: "Dedicated silent study room with desk lamps and ergonomic chairs." },
  { icon: Bike, title: "Bike Parking", desc: "Secure two-wheeler parking with charging points for e-bikes and scooters." },
];

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
            From fibre WiFi to a fully stocked kitchen — we&apos;ve designed every space for comfort, productivity and community.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="rounded-3xl border-2 hover:border-primary/40 hover:-translate-y-1 transition-all">
              <CardContent className="p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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
