export const DEFAULT_PRIMARY_COLOR = "#f97316";
export const DEFAULT_ACCENT_COLOR = "#0ea5e9";

function parseHex(hex: string): [number, number, number] | null {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function mixHex(hex: string, target: "white" | "black", amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const t = target === "white" ? 255 : 0;
  return `#${rgb
    .map((c) => Math.round(c + (t - c) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function foregroundForBg(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "oklch(0.99 0.01 80)";
  return relativeLuminance(...rgb) > 0.55 ? "oklch(0.18 0.04 250)" : "oklch(0.99 0.01 80)";
}

export function normalizeBrandColor(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return fallback;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return parseHex(withHash) ? withHash.toLowerCase() : fallback;
}

export function buildThemeCssVars(primaryColor?: string, accentColor?: string): Record<string, string> {
  const primary = normalizeBrandColor(primaryColor, DEFAULT_PRIMARY_COLOR);
  const accent = normalizeBrandColor(accentColor, DEFAULT_ACCENT_COLOR);
  const primaryLight = mixHex(primary, "white", 0.18);
  const primaryDark = mixHex(primary, "black", 0.32);
  const accentLight = mixHex(accent, "white", 0.15);
  const warmAccent = mixHex(primary, "white", 0.42);

  return {
    "--primary": primary,
    "--primary-foreground": foregroundForBg(primary),
    "--primary-dark": primaryDark,
    "--primary-dark-foreground": foregroundForBg(primaryDark),
    "--ring": primary,
    "--secondary": accent,
    "--secondary-foreground": foregroundForBg(accent),
    "--gradient-hero": `linear-gradient(135deg, ${primary}, ${primaryLight})`,
    "--gradient-accent": `linear-gradient(135deg, ${accent}, ${accentLight})`,
    "--gradient-warm": `linear-gradient(135deg, ${warmAccent}, ${primary})`,
    "--shadow-soft": `0 4px 20px -4px color-mix(in srgb, ${primary} 15%, transparent)`,
    "--shadow-glow": `0 0 60px -10px color-mix(in srgb, ${primary} 40%, transparent)`,
  };
}

export function buildThemeCssBlock(primaryColor?: string, accentColor?: string): string {
  return Object.entries(buildThemeCssVars(primaryColor, accentColor))
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}
