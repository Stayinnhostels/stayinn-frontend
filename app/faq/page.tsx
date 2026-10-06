import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FaqPageContent } from "@/components/faq-page-content";

export const metadata: Metadata = {
  title: "FAQ — Stay Inn Hostels",
  description:
    "Answers to common questions about check-in, check-out, luggage storage, house rules and more at Stay Inn Hostels.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <FaqPageContent />
      <SiteFooter />
    </div>
  );
}
