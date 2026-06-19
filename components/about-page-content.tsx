"use client";

import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";
import type { AboutValueIcon } from "@/lib/about-values";
import { normalizeAboutValues } from "@/lib/about-values";

const VALUE_ICONS: Record<AboutValueIcon, LucideIcon> = {
  heart: Heart,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  users: Users,
};

function resolveValueIcon(icon: string): LucideIcon {
  if (icon in VALUE_ICONS) return VALUE_ICONS[icon as AboutValueIcon];
  return Heart;
}

export function AboutPageContent() {
  const settings = useSiteSettings();

  const values = normalizeAboutValues(settings as unknown as Record<string, unknown>).filter(
    (v) => v.title.trim() || v.desc.trim(),
  );

  const heroStats = settings.heroShowStats
    ? [
        { k: settings.heroStat1Value, v: settings.heroStat1Label },
        { k: settings.heroStat2Value, v: settings.heroStat2Label },
        { k: settings.heroStat3Value, v: settings.heroStat3Label },
      ].filter((s) => s.k.trim() || s.v.trim())
    : [];

  const brokerageStat =
    settings.aboutShowBrokerage &&
    (settings.aboutBrokerageValue.trim() || settings.aboutBrokerageLabel.trim())
      ? [{ k: settings.aboutBrokerageValue, v: settings.aboutBrokerageLabel }]
      : [];

  const stats = [...heroStats, ...brokerageStat];

  return (
    <>
      <section className="container mx-auto px-4 pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="max-w-3xl">
          {settings.aboutBadgeText.trim() ? (
            <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
              {settings.aboutBadgeText}
            </Badge>
          ) : null}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            {settings.aboutTitleLine1.trim() ? <>{settings.aboutTitleLine1} </> : null}
            {settings.aboutTitleAccent.trim() ? (
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                {settings.aboutTitleAccent}
              </span>
            ) : null}
          </h1>
          {settings.aboutIntro.trim() ? (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{settings.aboutIntro}</p>
          ) : null}
        </div>

        <div className="mt-10 md:mt-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            {settings.aboutMissionHeading.trim() ? (
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{settings.aboutMissionHeading}</h2>
            ) : null}
            {settings.aboutMissionParagraph1.trim() ? (
              <p className="text-muted-foreground leading-relaxed">{settings.aboutMissionParagraph1}</p>
            ) : null}
            {settings.aboutMissionParagraph2.trim() ? (
              <p className="text-muted-foreground leading-relaxed">{settings.aboutMissionParagraph2}</p>
            ) : null}
          </div>
          {stats.length > 0 ? (
            <div className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={`${s.k}-${s.v}`} className="rounded-3xl border-2 p-6 text-center bg-muted/30">
                  {s.k.trim() ? <div className="text-3xl font-extrabold text-primary">{s.k}</div> : null}
                  {s.v.trim() ? <div className="text-sm text-muted-foreground mt-1">{s.v}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {values.length > 0 ? (
        <section className="bg-muted/40 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mb-12">
              {settings.aboutValuesBadge.trim() ? (
                <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary font-bold mb-4">
                  {settings.aboutValuesBadge}
                </Badge>
              ) : null}
              {settings.aboutValuesHeading.trim() ? (
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{settings.aboutValuesHeading}</h2>
              ) : null}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon, title, desc }, index) => {
                const Icon = resolveValueIcon(icon);
                return (
                <div
                  key={`${title}-${index}`}
                  className="rounded-3xl bg-card border-2 p-7 hover:border-primary/40 hover:-translate-y-1 transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  {title.trim() ? <h3 className="font-extrabold text-lg mb-1">{title}</h3> : null}
                  {desc.trim() ? <p className="text-sm text-muted-foreground">{desc}</p> : null}
                </div>
              );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {(settings.aboutCtaHeading.trim() ||
        settings.aboutCtaDescription.trim() ||
        settings.aboutCtaPrimaryLabel.trim() ||
        (settings.aboutCtaShowSecondary && settings.aboutCtaSecondaryLabel.trim())) && (
        <section className="container mx-auto px-4 py-20 text-center max-w-2xl">
          {settings.aboutCtaHeading.trim() ? (
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{settings.aboutCtaHeading}</h2>
          ) : null}
          {settings.aboutCtaDescription.trim() ? (
            <p className="mt-4 text-muted-foreground">{settings.aboutCtaDescription}</p>
          ) : null}
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            {settings.aboutCtaPrimaryLabel.trim() ? (
              <Button asChild size="lg" className="rounded-full px-7 font-bold">
                <Link href={settings.aboutCtaPrimaryHref || "/rooms"}>{settings.aboutCtaPrimaryLabel}</Link>
              </Button>
            ) : null}
            {settings.aboutCtaShowSecondary && settings.aboutCtaSecondaryLabel.trim() ? (
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 font-bold border-2">
                <Link href={settings.aboutCtaSecondaryHref || "/contact"}>{settings.aboutCtaSecondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
