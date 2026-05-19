import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home-hero";
import { FeaturedRoomsSection } from "@/components/featured-rooms-section";
import { ReviewsSection } from "@/components/reviews-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  ShieldCheck,
  Sparkles,
  Droplet,
  Zap,
  Shirt,
  BookOpen,
  Archive,
  Bath,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Check,
  Heart,
} from "lucide-react";

const facilities = [
  { icon: Bath, label: "Attached Bathroom" },
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: BookOpen, label: "Study Table" },
  { icon: Archive, label: "Cupboard / Wardrobe" },
  { icon: Shirt, label: "Laundry Service" },
  { icon: Sparkles, label: "Daily Cleaning" },
  { icon: ShieldCheck, label: "24/7 Security & CCTV" },
  { icon: Zap, label: "Power Backup" },
  { icon: Droplet, label: "RO Drinking Water" },
];

const reasons = [
  {
    icon: Heart,
    title: "Affordable Pricing",
    desc: "Transparent monthly rates with zero hidden fees. Pay per seat, save more.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Environment",
    desc: "24/7 security, CCTV in common areas, and biometric entry for total peace of mind.",
  },
  {
    icon: Users,
    title: "Comfortable Shared Living",
    desc: "Thoughtful layouts, clean bathrooms, and a community that feels like home.",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    desc: "Walking distance to colleges, metro stations, cafes and IT hubs.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.85_0.18_90/0.4),transparent_60%)]" />
        <div className="container mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="space-y-7 animate-fade-in">
            <HomeHero />
            <div className="flex items-center gap-6 pt-4">
              <div>
                <div className="text-2xl font-extrabold">2,500+</div>
                <div className="text-xs text-muted-foreground">Happy Residents</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-extrabold">12</div>
                <div className="text-xs text-muted-foreground">Locations</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-2xl font-extrabold">4.8</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[image:var(--gradient-hero)] opacity-20 blur-3xl" />
            <img
              src="/assets/hero-hostel.jpg"
              alt="Modern Stay Inn Hostel common room with students"
              width={1536}
              height={1024}
              className="rounded-[2rem] shadow-[var(--shadow-card)] object-cover aspect-[4/3] w-full"
            />
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] hidden sm:block animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Verified Safe</div>
                  <div className="text-xs text-muted-foreground">24/7 CCTV & Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
            SEAT BOOKING
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Pick the seat that fits your vibe</h2>
          <p className="mt-4 text-muted-foreground text-lg">Transparent monthly pricing per seat. Move in any day. No brokerage, ever.</p>
        </div>

        <FeaturedRoomsSection />

        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full font-bold">
            <Link href="/rooms">
              View all rooms <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </section>

      <section id="facilities" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary font-bold mb-4">
              FACILITIES
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Everything you need, included</h2>
            <p className="mt-4 text-muted-foreground text-lg">No hidden charges. No “extras”. Just real comforts that make daily life easy.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
            {facilities.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group rounded-2xl bg-card border p-6 flex items-center gap-4 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-warm)] text-primary-foreground shadow-[var(--shadow-soft)] group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-bold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
            WHY STAY INN
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Built for the way you actually live</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <Card key={title} className="rounded-3xl border-2 p-7 hover:border-primary transition-all hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                <Icon className="h-7 w-7" />
              </div>
              <div className="text-xs font-black text-primary mb-1">0{i + 1}</div>
              <h3 className="text-xl font-extrabold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <ReviewsSection />

      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[image:var(--gradient-hero)] p-10 md:p-16 text-primary-foreground shadow-[var(--shadow-glow)]">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div className="space-y-5">
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Your seat is waiting.
                <br />
                Book in 60 seconds.
              </h2>
              <p className="text-lg text-primary-foreground/85 max-w-xl">
                Reserve your bed today with zero deposit. Move in whenever you&apos;re ready — flexible monthly stays, no lock-ins.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button size="lg" className="rounded-full bg-card text-foreground hover:bg-card/90 font-bold px-8 shadow-xl" asChild>
                <Link href="/booking">
                  Book Your Seat <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-bold px-8"
              >
                Schedule a Visit
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
