import { DEFAULT_FAQS, type FaqItem } from "@/lib/faqs";

export type FaqPageSettings = {
  faqBadgeText: string;
  faqTitleLine1: string;
  faqTitleAccent: string;
  faqIntro: string;
  faqs: FaqItem[];
  faqCtaLabel: string;
  faqCtaHref: string;
};

export const FAQ_PAGE_DEFAULTS: FaqPageSettings = {
  faqBadgeText: "FAQ",
  faqTitleLine1: "Frequently asked",
  faqTitleAccent: "questions.",
  faqIntro: "Can't find what you're looking for? Get in touch — we usually reply within a few hours.",
  faqs: DEFAULT_FAQS,
  faqCtaLabel: "Still have a question? Contact us",
  faqCtaHref: "/contact",
};
