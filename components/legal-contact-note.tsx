"use client";

import { useSiteSettings } from "@/components/site-settings-provider";

export function LegalContactNote() {
  const { email, fullAddress, address, city, country } = useSiteSettings();
  const addressLine = fullAddress || [address, city, country].filter(Boolean).join(", ");

  return (
    <p className="text-muted-foreground leading-relaxed">
      Questions or concerns? Email{" "}
      <a href={`mailto:${email}`} className="text-primary font-semibold">
        {email}
      </a>{" "}
      or write to {addressLine}.
    </p>
  );
}
