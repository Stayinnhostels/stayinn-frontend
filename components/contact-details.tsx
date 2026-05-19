"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "@/components/site-settings-provider";
import { resolveMapEmbedSrc } from "@/lib/map-embed";

export function ContactDetailsCards() {
  const { hotelName, email, phone, fullAddress, address, city, country } = useSiteSettings();
  const visitLines = [hotelName, fullAddress || [address, city, country].filter(Boolean).join(", ")].filter(
    Boolean,
  );

  const cards = [
    { icon: MapPin, title: "Visit", lines: visitLines },
    { icon: Phone, title: "Call", lines: [phone, "Mon–Sun · 9am–9pm"] },
    { icon: Mail, title: "Email", lines: [email] },
  ];

  return (
    <>
      {cards.map(({ icon: Icon, title, lines }) => (
        <div key={title} className="rounded-3xl border-2 p-6 hover:border-primary/40 transition-colors">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Icon className="h-5 w-5" />
          </div>
          <div className="font-extrabold text-lg">{title}</div>
          {lines.map((l) => (
            <div key={l} className="text-sm text-muted-foreground">
              {l}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export function ContactMapSection() {
  const { hotelName, fullAddress, address, city, country, mapUrl } = useSiteSettings();
  const addressLine = fullAddress || [address, city, country].filter(Boolean).join(", ");
  const mapSrc = resolveMapEmbedSrc(mapUrl, addressLine);

  return (
    <>
      <div className="rounded-3xl overflow-hidden border-2 shadow-[var(--shadow-card)]">
        <iframe
          title={`${hotelName} location`}
          src={mapSrc}
          className="w-full h-[420px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="rounded-3xl border-2 p-8 bg-card space-y-5">
        <h2 className="text-2xl font-extrabold">Find us on socials</h2>
        <p className="text-sm text-muted-foreground">
          Follow along for room drops, community events and resident stories.
        </p>
        <div className="rounded-2xl bg-muted/50 p-5 text-sm">
          <div className="font-bold mb-1">{hotelName}</div>
          <div className="text-muted-foreground">
            {fullAddress || [address, city, country].filter(Boolean).join(", ")}
          </div>
        </div>
      </div>
    </>
  );
}
