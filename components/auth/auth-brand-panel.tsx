"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/site-settings-provider";
import { brandShortName } from "@/lib/site-settings";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-primary-foreground/80">{label}</div>
    </div>
  );
}

export function AuthBrandPanel() {
  const { hotelName, tagline, description } = useSiteSettings();
  const brand = brandShortName(hotelName);

  return (
    <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-primary-foreground bg-[image:var(--gradient-hero)]">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-[var(--accent)]/30 blur-3xl" />

      <Link href="/" className="relative flex items-center gap-2 z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur font-black">
          {brand.charAt(0).toUpperCase()}
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          {brand}
          <span className="opacity-80">.</span>
        </span>
      </Link>

      <div className="relative z-10 space-y-6">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          {hotelName}
          <span className="block text-2xl mt-2 opacity-95">{tagline}</span>
        </h2>
        <p className="text-base text-primary-foreground/90 max-w-md">{description}</p>
        <div className="flex items-center gap-6 pt-4">
          <Stat value="12k+" label="Happy residents" />
          <div className="h-10 w-px bg-white/20" />
          <Stat value="40+" label="Properties" />
          <div className="h-10 w-px bg-white/20" />
          <Stat value="4.9★" label="Rated" />
        </div>
      </div>

      <p className="relative z-10 text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} {hotelName}. All rights reserved.
      </p>
    </aside>
  );
}

export function AuthMobileBrand() {
  const { hotelName } = useSiteSettings();
  const brand = brandShortName(hotelName);

  return (
    <div className="lg:hidden mb-8">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-black">
          {brand.charAt(0).toUpperCase()}
        </div>
        <span className="text-lg font-extrabold tracking-tight">
          {brand}
          <span className="text-primary">.</span>
        </span>
      </Link>
    </div>
  );
}
