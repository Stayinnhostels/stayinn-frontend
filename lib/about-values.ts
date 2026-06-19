export type AboutValueIcon = "heart" | "shield-check" | "sparkles" | "users";

export type AboutValueCard = {
  title: string;
  desc: string;
  icon: AboutValueIcon;
};

const VALID_ICONS = new Set<AboutValueIcon>(["heart", "shield-check", "sparkles", "users"]);

export const DEFAULT_ABOUT_VALUES: AboutValueCard[] = [
  {
    title: "Resident-first",
    desc: "Every decision starts with what makes life easier for our residents.",
    icon: "heart",
  },
  {
    title: "Safety always",
    desc: "Verified entry, CCTV, and trained staff — round the clock.",
    icon: "shield-check",
  },
  {
    title: "Spotless living",
    desc: "Daily cleaning and weekly deep-cleans across every property.",
    icon: "sparkles",
  },
  {
    title: "Real community",
    desc: "Events, lounges and shared meals that turn neighbors into friends.",
    icon: "users",
  },
];

function sanitizeCard(item: Partial<AboutValueCard> | null | undefined): AboutValueCard {
  const icon = item?.icon;
  return {
    title: String(item?.title ?? "").trim(),
    desc: String(item?.desc ?? "").trim(),
    icon: icon && VALID_ICONS.has(icon) ? icon : "heart",
  };
}

/** Read about value cards from API payload (array or legacy flat fields). */
export function normalizeAboutValues(settings: Record<string, unknown>): AboutValueCard[] {
  const raw = settings.aboutValues;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item) => sanitizeCard(item as Partial<AboutValueCard>));
  }

  const legacy = [1, 2, 3, 4].map((n) =>
    sanitizeCard({
      title: settings[`aboutValue${n}Title`] as string | undefined,
      desc: settings[`aboutValue${n}Desc`] as string | undefined,
      icon: settings[`aboutValue${n}Icon`] as AboutValueIcon | undefined,
    }),
  );

  const nonEmpty = legacy.filter((v) => v.title || v.desc);
  return nonEmpty.length > 0 ? nonEmpty : DEFAULT_ABOUT_VALUES;
}
