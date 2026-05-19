"use client";

import { useSiteSettings } from "@/components/site-settings-provider";

export function AboutIntro() {
  const { hotelName, description } = useSiteSettings();

  return (
    <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
      {description ||
        `${hotelName} started with a simple idea: students and young professionals deserve clean, safe and affordable places to live.`}
    </p>
  );
}
