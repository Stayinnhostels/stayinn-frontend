import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingRulesContent } from "@/components/booking-rules-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BookingRulesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            BOOKING RULES
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Everything you need to know{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              before you book.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            These policies are set by our team and kept up to date. They apply to all seat bookings and move-ins.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full font-bold">
              <Link href="/booking">Book a seat</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full font-bold border-2">
              <Link href="/contact">Questions? Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <BookingRulesContent />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Also see our{" "}
          <Link href="/terms" className="font-semibold text-primary hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/faq" className="font-semibold text-primary hover:underline">
            FAQ
          </Link>
          .
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
