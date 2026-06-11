import type { LucideIcon } from "lucide-react";
import { Heart, ShieldCheck, Users, MapPin } from "lucide-react";

export type WhyStayInnReason = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const WHY_STAY_INN_REASONS: WhyStayInnReason[] = [
  {
    icon: Heart,
    title: "Affordable Pricing",
    desc: "Transparent monthly rates with zero hidden fees. Pay per seat, save more.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Environment",
    desc: "24/7 security, CCTV in common areas, and biometric entry for total peace of mind.",
  },
  {
    icon: Users,
    title: "Comfortable Shared Living",
    desc: "Thoughtful layouts, clean bathrooms, and a community that feels like home.",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    desc: "Walking distance to colleges, metro stations, cafes and IT hubs.",
  },
];
