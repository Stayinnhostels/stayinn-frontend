"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";
import { resolveHeroImageSrc } from "@/lib/homepage-hero";

export function HomeHeroSection() {
  const settings = useSiteSettings();
  const {
    hotelName,
    tagline,
    description,
    heroShowBadge,
    heroBadgeText,
    heroPrimaryCtaLabel,
    heroPrimaryCtaHref,
    heroSecondaryCtaLabel,
    heroSecondaryCtaHref,
    heroImageUrl,
    heroImageAlt,
    heroShowStats,
    heroStat1Value,
    heroStat1Label,
    heroStat2Value,
    heroStat2Label,
    heroStat3Value,
    heroStat3Label,
    heroShowTrustBadge,
    heroTrustTitle,
    heroTrustSubtitle,
  } = settings;

  const heroImageSrc = resolveHeroImageSrc(heroImageUrl);

  return (
    <div className="container mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
      <div className="space-y-7 animate-fade-in">
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
          <div className="flex flex-wrap gap-3">
            {heroPrimaryCtaLabel.trim() ? (
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 font-bold shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
              >
                <Link href={heroPrimaryCtaHref || "/booking"}>
                  {heroPrimaryCtaLabel} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            {heroSecondaryCtaLabel.trim() ? (
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 font-bold border-2">
                <Link href={heroSecondaryCtaHref || "/rooms"}>{heroSecondaryCtaLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>

        {heroShowStats ? (
          <div className="flex items-center gap-6 pt-4">
            <div>
              <div className="text-2xl font-extrabold">{heroStat1Value}</div>
              <div className="text-xs text-muted-foreground">{heroStat1Label}</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="text-2xl font-extrabold">{heroStat2Value}</div>
              <div className="text-xs text-muted-foreground">{heroStat2Label}</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-accent text-accent" />
              <span className="text-2xl font-extrabold">{heroStat3Value}</span>
              <span className="text-xs text-muted-foreground">{heroStat3Label}</span>
            </div>
          </div>
        ) : null}
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
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] hidden sm:block animate-scale-in">
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
