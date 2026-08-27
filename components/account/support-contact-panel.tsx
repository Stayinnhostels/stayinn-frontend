"use client";

import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Siren } from "lucide-react";
import { useSiteSettings } from "@/components/site-settings-provider";
import { formatPhoneForDisplay } from "@/lib/property-contact";
import { resolveMapOpenUrl } from "@/lib/map-embed";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "full" | "compact";
  className?: string;
};

export function SupportContactPanel({ variant = "full", className }: Props) {
  const settings = useSiteSettings();
  const phone = settings.phone?.trim() || null;
  const email = settings.email?.trim() || null;
  const whatsappUrl = settings.whatsapp_url;
  const whatsappDisplay = settings.whatsapp
    ? formatPhoneForDisplay(settings.whatsapp)
    : null;
  const emergencyRaw = settings.emergencyPhone?.trim() || phone;
  const emergencyDisplay = emergencyRaw
    ? formatPhoneForDisplay(emergencyRaw.replace(/\D/g, "") || emergencyRaw)
    : null;
  const emergencyTel = emergencyRaw ? emergencyRaw.replace(/\s/g, "") : null;
  const phoneTel = phone ? phone.replace(/\s/g, "") : null;
  const emergencyLabel = settings.emergencyLabel?.trim() || "Emergency / front desk";
  const addressLine =
    settings.fullAddress?.trim() ||
    [settings.address, settings.city, settings.country].filter(Boolean).join(", ");
  const mapHref = addressLine ? resolveMapOpenUrl(settings.mapUrl, addressLine) : null;

  const rows = [
    whatsappUrl
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          value: whatsappDisplay ?? "Message the hostel",
          href: whatsappUrl,
          external: true,
          cta: "Message",
          icon: MessageCircle,
        }
      : null,
    phone
      ? {
          key: "phone",
          label: "Phone",
          value: phone,
          href: `tel:${phoneTel}`,
          external: false,
          cta: "Call",
          icon: Phone,
        }
      : null,
    email
      ? {
          key: "email",
          label: "Email",
          value: email,
          href: `mailto:${email}`,
          external: false,
          cta: "Email",
          icon: Mail,
        }
      : null,
    variant === "full" && addressLine
      ? {
          key: "address",
          label: "Address",
          value: addressLine,
          href: mapHref,
          external: true,
          cta: mapHref ? "Map" : null,
          icon: MapPin,
        }
      : null,
    emergencyTel
      ? {
          key: "emergency",
          label: emergencyLabel,
          value: emergencyDisplay ?? emergencyRaw,
          href: `tel:${emergencyTel}`,
          external: false,
          cta: "Call",
          icon: Siren,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    value: string;
    href: string | null;
    external: boolean;
    cta: string | null;
    icon: typeof Phone;
  }>;

  if (rows.length === 0) return null;

  return (
    <div className={cn(className)}>
      {variant === "compact" ? (
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">Need help?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Message or call {settings.hotelName}.
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          const inner = (
            <>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </p>
                <p className="mt-1 truncate text-[15px] font-semibold">{row.value}</p>
              </div>
              {row.cta ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  {row.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              ) : null}
            </>
          );

          const cardClass =
            "group flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[var(--shadow-soft)] sm:p-5";

          if (row.href) {
            return (
              <a
                key={row.key}
                href={row.href}
                className={cardClass}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {inner}
              </a>
            );
          }

          return (
            <div key={row.key} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
