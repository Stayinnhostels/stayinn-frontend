"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/components/site-settings-provider";

export function HomeCtaBannerSection() {
  const {
    homeCtaShow,
    homeCtaTitleLine1,
    homeCtaTitleLine2,
    homeCtaDescription,
    homeCtaPrimaryLabel,
    homeCtaPrimaryHref,
    homeCtaSecondaryLabel,
    homeCtaSecondaryHref,
    homeCtaShowSecondary,
  } = useSiteSettings();

  if (!homeCtaShow) return null;

  const showTitle = homeCtaTitleLine1.trim() || homeCtaTitleLine2.trim();
  const showPrimary = homeCtaPrimaryLabel.trim();
  const showSecondary = homeCtaShowSecondary && homeCtaSecondaryLabel.trim();

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[image:var(--gradient-hero)] p-10 md:p-16 text-primary-foreground shadow-[var(--shadow-glow)]">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="space-y-5">
            {showTitle ? (
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                {homeCtaTitleLine1.trim() ? (
                  <>
                    {homeCtaTitleLine1}
                    {homeCtaTitleLine2.trim() ? (
                      <>
                        <br />
                        {homeCtaTitleLine2}
                      </>
                    ) : null}
                  </>
                ) : (
                  homeCtaTitleLine2
                )}
              </h2>
            ) : null}
            {homeCtaDescription.trim() ? (
              <p className="max-w-xl text-lg text-primary-foreground/85">{homeCtaDescription}</p>
            ) : null}
          </div>
          {showPrimary || showSecondary ? (
            <div className="flex flex-col gap-3 md:items-end">
              {showPrimary ? (
                <Button
                  size="lg"
                  className="rounded-full bg-card text-foreground hover:bg-card/90 font-bold px-8 shadow-xl"
                  asChild
                >
                  <Link href={homeCtaPrimaryHref || "/booking"}>
                    {homeCtaPrimaryLabel} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {showSecondary ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-bold px-8"
                  asChild
                >
                  <Link href={homeCtaSecondaryHref || "/contact"}>{homeCtaSecondaryLabel}</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
