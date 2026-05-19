"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactDetailsCards, ContactMapSection } from "@/components/contact-details";
import { useSiteSettings } from "@/components/site-settings-provider";

export default function ContactPage() {
  const { phone } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-10 md:pt-24">
        <div className="max-w-3xl">
          <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
            CONTACT
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Let&apos;s <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">talk.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Questions about a room, pricing, or your stay? We typically reply within a few hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <ContactDetailsCards />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-3xl border-2 p-8 bg-card space-y-5 shadow-[var(--shadow-card)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold mb-2 block">Full name</label>
              <Input placeholder="Aarav Mehta" required maxLength={80} />
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">Email</label>
              <Input type="email" placeholder="you@email.com" required maxLength={120} />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">Phone</label>
            <Input type="tel" placeholder={phone} maxLength={20} />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">Message</label>
            <Textarea placeholder="Tell us what you're looking for…" rows={5} maxLength={1000} required />
          </div>
          <Button type="submit" size="lg" className="rounded-full font-bold w-full sm:w-auto px-8">
            Send Message
          </Button>
        </form>
      </section>

      <section className="container mx-auto px-4 pb-20 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ContactMapSection />
      </section>

      <SiteFooter />
    </div>
  );
}
