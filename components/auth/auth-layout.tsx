"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BrandNavLogo } from "@/components/brand-nav-logo";
import { useSiteSettings } from "@/components/site-settings-provider";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const { hotelName } = useSiteSettings();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-muted/40 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <main className="relative w-full max-w-md">
        <Link href="/" className="mx-auto mb-7 flex w-fit items-center justify-center">
          <BrandNavLogo alt={hotelName} className="block h-10 w-auto object-contain" />
        </Link>

        <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-[var(--shadow-card)] sm:p-8">
          <div className="space-y-1.5 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">{title}</h1>
            {subtitle ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          <div className="mt-7">{children}</div>

          {footer ? (
            <div className="mt-7 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="font-semibold transition-colors hover:text-primary">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
