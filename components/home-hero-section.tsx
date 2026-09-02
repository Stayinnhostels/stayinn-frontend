"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/components/site-settings-provider";
import { HeroAvailabilityBar } from "@/components/hero-availability-bar";
import { resolveHeroImageSrc } from "@/lib/homepage-hero";

export function HomeHeroSection() {
  const settings = useSiteSettings();
  const {
    hotelName,
    tagline,
    description,
    heroShowBadge,
    heroBadgeText,
    heroImageUrl,
    heroImageAlt,
    heroShowTrustBadge,
    heroTrustTitle,
    heroTrustSubtitle,
  } = settings;

  const heroImageSrc = resolveHeroImageSrc(heroImageUrl);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-12 px-3 py-16 sm:px-4 md:py-24 lg:grid-cols-2 lg:items-center lg:px-6 xl:max-w-[88rem]">
      <div className="min-w-0 space-y-7 animate-fade-in">
        <div className="space-y-7">
          {heroShowBadge && heroBadgeText.trim() ? (
            <Badge className="rounded-full bg-accent text-accent-foreground hover:bg-accent border-0 px-4 py-1.5 text-xs font-bold">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> {heroBadgeText}
            </Badge>
          ) : null}
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {hotelName}{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">{tagline}</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground md:text-xl">{description}</p>

          <HeroAvailabilityBar />
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[image:var(--gradient-hero)] opacity-20 blur-3xl" />
        <img
          src={heroImageSrc}
          alt={heroImageAlt || "Stay Inn hostel"}
          width={1536}
          height={1024}
          className="rounded-[2rem] shadow-[var(--shadow-card)] object-cover aspect-[4/3] w-full"
        />
        {heroShowTrustBadge && (heroTrustTitle.trim() || heroTrustSubtitle.trim()) ? (
          <div className="absolute -bottom-5 -right-4 z-40 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] sm:-right-6 hidden sm:block animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                {heroTrustTitle.trim() ? <div className="text-sm font-bold">{heroTrustTitle}</div> : null}
                {heroTrustSubtitle.trim() ? (
                  <div className="text-xs text-muted-foreground">{heroTrustSubtitle}</div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
