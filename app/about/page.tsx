import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AboutPageContent } from "@/components/about-page-content";

export const metadata: Metadata = {
  title: "About — Stay Inn Hostels",
  description: "Learn about Stay Inn Hostels — our story, mission, and commitment to safe, affordable hostel living.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <AboutPageContent />
      <SiteFooter />
    </div>
  );
}
