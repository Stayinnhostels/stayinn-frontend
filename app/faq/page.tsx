import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Stay Inn Hostels",
  description:
    "Answers to common questions about check-in, check-out, luggage storage, house rules and more at Stay Inn Hostels.",
};

const faqs = [
  {
    q: "What are your check-in and check-out times?",
    a: "Standard check-in is from 12:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged subject to availability.",
  },
  {
    q: "Do you offer luggage storage?",
    a: "Yes. Free luggage storage is available on the day of check-in and check-out. Long-term storage can be arranged for residents on a small monthly fee.",
  },
  {
    q: "What documents do I need to book a seat?",
    a: "A valid government-issued photo ID (Aadhaar, Passport, Driving License, or Student ID) is required at the time of check-in. Foreign nationals must present a valid passport and visa.",
  },
  {
    q: "Are your rooms gender-segregated?",
    a: "Yes, we have separate floors and rooms for male, female, and co-ed dorms. You can choose your preferred option while booking.",
  },
  {
    q: "What's included in the rent?",
    a: "Your rent covers your seat, utilities (electricity & water), high-speed WiFi, housekeeping of common areas, and access to all shared facilities.",
  },
  {
    q: "Do you allow guests or visitors?",
    a: "Visitors are welcome in common areas between 9 AM – 9 PM. Overnight guests are not permitted in shared rooms for the privacy and safety of all residents.",
  },
  {
    q: "What is the minimum stay duration?",
    a: "Minimum stay is 1 month for monthly bookings. Short-term nightly bookings are available for selected rooms — check the room details page.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancellations made 7+ days before check-in are fully refundable. Within 7 days, the security deposit is forfeited. Refunds are processed within 7 business days.",
  },
  { q: "Are pets allowed?", a: "Unfortunately, pets are not allowed in our hostels at this time." },
  {
    q: "Is smoking or alcohol permitted on the premises?",
    a: "Smoking is only allowed in designated outdoor areas. Consumption of alcohol is not permitted in shared rooms or common areas.",
  },
  {
    q: "How is security handled?",
    a: "We have 24/7 CCTV surveillance, smart card access to floors, on-site staff round the clock, and personal lockers in every room.",
  },
  {
    q: "Do you provide meals?",
    a: "We don't provide cooked meals, but our shared kitchens are fully equipped, and our café serves all-day snacks, coffee and tea at affordable prices.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            FAQ
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Frequently asked <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">questions.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-primary font-semibold hover:underline">
              Get in touch
            </Link>{" "}
            — we usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="rounded-3xl border-2 bg-card p-4 md:p-8 shadow-[var(--shadow-card)]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="text-base md:text-lg font-bold py-5 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base pb-5 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full px-8 font-bold">
            <Link href="/contact">Still have a question? Contact us</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
