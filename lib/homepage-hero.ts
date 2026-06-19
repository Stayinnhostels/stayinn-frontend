export type HomepageHeroSettings = {
  heroShowBadge: boolean;
  heroBadgeText: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroShowStats: boolean;
  heroStat1Value: string;
  heroStat1Label: string;
  heroStat2Value: string;
  heroStat2Label: string;
  heroStat3Value: string;
  heroStat3Label: string;
  heroShowTrustBadge: boolean;
  heroTrustTitle: string;
  heroTrustSubtitle: string;
};

export const HOMEPAGE_HERO_DEFAULTS: HomepageHeroSettings = {
  heroShowBadge: false,
  heroBadgeText: "Now booking for 2026",
  heroPrimaryCtaLabel: "Book Your Seat",
  heroPrimaryCtaHref: "/booking",
  heroSecondaryCtaLabel: "Explore Rooms",
  heroSecondaryCtaHref: "/rooms",
  heroImageUrl: "",
  heroImageAlt: "Modern Stay Inn Hostel common room with students",
  heroShowStats: true,
  heroStat1Value: "2,500+",
  heroStat1Label: "Happy Residents",
  heroStat2Value: "12",
  heroStat2Label: "Locations",
  heroStat3Value: "4.8",
  heroStat3Label: "/5",
  heroShowTrustBadge: true,
  heroTrustTitle: "Verified Safe",
  heroTrustSubtitle: "24/7 CCTV & Security",
};

export const DEFAULT_HERO_IMAGE_SRC = "/assets/hero-hostel.jpg";

export function resolveHeroImageSrc(heroImageUrl: string) {
  const trimmed = heroImageUrl.trim();
  return trimmed || DEFAULT_HERO_IMAGE_SRC;
}
