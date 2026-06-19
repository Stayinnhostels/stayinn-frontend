export type HomepageCtaSettings = {
  homeCtaShow: boolean;
  homeCtaTitleLine1: string;
  homeCtaTitleLine2: string;
  homeCtaDescription: string;
  homeCtaPrimaryLabel: string;
  homeCtaPrimaryHref: string;
  homeCtaSecondaryLabel: string;
  homeCtaSecondaryHref: string;
  homeCtaShowSecondary: boolean;
};

export const HOMEPAGE_CTA_DEFAULTS: HomepageCtaSettings = {
  homeCtaShow: true,
  homeCtaTitleLine1: "Your seat is waiting.",
  homeCtaTitleLine2: "Book in 60 seconds.",
  homeCtaDescription:
    "Reserve your bed today with zero deposit. Move in whenever you're ready — flexible monthly stays, no lock-ins.",
  homeCtaPrimaryLabel: "Book Your Seat",
  homeCtaPrimaryHref: "/booking",
  homeCtaSecondaryLabel: "Schedule a Visit",
  homeCtaSecondaryHref: "/contact",
  homeCtaShowSecondary: true,
};
