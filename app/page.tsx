import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHeroSection } from "@/components/home-hero-section";
import { HomeCtaBannerSection } from "@/components/home-cta-banner-section";
import { FeaturedRoomsSection } from "@/components/featured-rooms-section";
import { ReviewsSection } from "@/components/reviews-section";
import { Button } from "@/components/ui/button";
import { FacilitiesGrid } from "@/components/facilities-grid";
import { WhyStayInnGrid } from "@/components/why-stay-inn-grid";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.85_0.18_90/0.4),transparent_60%)]" />
        <HomeHeroSection />
      </section>

      <section id="rooms" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
            SEAT BOOKING
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Pick the seat that fits your vibe</h2>
        </div>

        <FeaturedRoomsSection />

        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full font-bold">
            <Link href="/rooms">
              View all rooms <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </section>

      <section id="facilities" className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary font-bold mb-4">
              FACILITIES
            </Badge>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Everything you need, included</h2>
          </div>
          <FacilitiesGrid />
        </div>
      </section>

      <section id="why" className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
            WHY STAY INN
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Built for the way you actually live</h2>
        </div>
        <WhyStayInnGrid />
      </section>

      <ReviewsSection />

      <HomeCtaBannerSection />

      <SiteFooter />
    </div>
  );
}
