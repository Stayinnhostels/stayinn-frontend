import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { AboutIntro } from "@/components/about-intro";

export const metadata: Metadata = {
  title: "About — Stay Inn Hostels",
  description: "Learn about Stay Inn Hostels — our story, mission, and commitment to safe, affordable hostel living.",
};

const values = [
  { icon: Heart, title: "Resident-first", desc: "Every decision starts with what makes life easier for our residents." },
  { icon: ShieldCheck, title: "Safety always", desc: "Verified entry, CCTV, and trained staff — round the clock." },
  { icon: Sparkles, title: "Spotless living", desc: "Daily cleaning and weekly deep-cleans across every property." },
  { icon: Users, title: "Real community", desc: "Events, lounges and shared meals that turn neighbors into friends." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            ABOUT US
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Hostel living, <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">reimagined.</span>
          </h1>
          <AboutIntro />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Build the most loved network of seat-based hostels in the country — places that feel less like accommodation and more like home. We believe great living shouldn&apos;t cost a fortune, and that community is the most underrated amenity of all.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From biometric entry to nutritionist-approved meals, every detail at Stay Inn is designed to give you back the one thing you can&apos;t buy more of — time.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { k: "2,500+", v: "Residents" },
            { k: "12", v: "Locations" },
            { k: "4.8/5", v: "Avg. rating" },
            { k: "0", v: "Brokerage" },
          ].map((s) => (
            <div key={s.v} className="rounded-3xl border-2 p-6 text-center bg-muted/30">
              <div className="text-3xl font-extrabold text-primary">{s.k}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary font-bold mb-4">
              VALUES
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">What we stand for</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-3xl bg-card border-2 p-7 hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to find your seat?</h2>
        <p className="mt-4 text-muted-foreground">Browse rooms across all our locations and book in 60 seconds.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7 font-bold">
            <Link href="/rooms">Browse Rooms</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7 font-bold border-2">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
