import type { BookingContact } from "@/lib/bookings-api";

export type ResolvedPropertyContact = {
  name: string;
  phone: string | null;
  phoneTel: string | null;
  whatsapp: string | null;
  whatsappDisplay: string | null;
  whatsapp_url: string | null;
};

/** Format digits or a phone string for display (e.g. +92 300 1234567). */
export function formatPhoneForDisplay(value: string): string {
  const trimmed = value.trim();
  if (trimmed.includes("+") || (trimmed.includes(" ") && trimmed.length > 6)) {
    return trimmed;
  }
  const d = trimmed.replace(/\D/g, "");
  if (!d) return trimmed;
  if (d.startsWith("92") && d.length >= 11) {
    return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  }
  if (d.length === 10) {
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }
  if (d.length > 10) {
    return `+${d}`;
  }
  return trimmed;
}

export function resolvePropertyContact(api?: Partial<BookingContact> | null): ResolvedPropertyContact {
  const name = api?.name?.trim() || "Stay Inn";
  const phone =
    api?.phone?.trim() ||
    process.env.NEXT_PUBLIC_PROPERTY_PHONE?.trim() ||
    null;
  const whatsappDigits =
    api?.whatsapp?.replace(/\D/g, "") ||
    process.env.NEXT_PUBLIC_PROPERTY_WHATSAPP?.replace(/\D/g, "") ||
    phone?.replace(/\D/g, "") ||
    null;

  const whatsapp_url =
    api?.whatsapp_url ||
    (whatsappDigits ? `https://wa.me/${whatsappDigits}` : null);

  return {
    name,
    phone,
    phoneTel: phone ? phone.replace(/\s/g, "") : null,
    whatsapp: whatsappDigits,
    whatsappDisplay: whatsappDigits ? formatPhoneForDisplay(whatsappDigits) : null,
    whatsapp_url,
  };
}
