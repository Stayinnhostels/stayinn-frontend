"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";

export function HomeHero() {
  const { hotelName, tagline, description } = useSiteSettings();

  return (
    <div className="space-y-7 animate-fade-in">
      {/* <Badge className="rounded-full bg-accent text-accent-foreground hover:bg-accent border-0 px-4 py-1.5 text-xs font-bold">
        <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Now booking for 2026
      </Badge> */}
      <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
        {hotelName}{" "}
        <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">{tagline}</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground md:text-xl">{description}</p>
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          size="lg"
          className="rounded-full px-7 font-bold shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
        >
          <Link href="/booking">
            Book Your Seat <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-7 font-bold border-2">
          <Link href="/rooms">Explore Rooms</Link>
        </Button>
      </div>
    </div>
  );
}
