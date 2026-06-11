import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function resolveFacilityIcon(name: string): LucideIcon {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[name];
  return Icon ?? LucideIcons.Sparkles;
}
