"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Facebook } from "lucide-react";

export default function ContactPage() {
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
          <p className="mt-6 text-lg text-muted-foreground">Questions about a room, pricing, or your stay? We typically reply within a few hours.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          {[
            { icon: MapPin, title: "Visit", lines: ["Stay Inn HQ", "MG Road, Bengaluru, KA 560001"] },
            { icon: Phone, title: "Call", lines: ["+91 90000 00000", "Mon–Sun · 9am–9pm"] },
            { icon: Mail, title: "Email", lines: ["hello@stayinn.example", "support@stayinn.example"] },
          ].map(({ icon: Icon, title, lines }) => (
            <div key={title} className="rounded-3xl border-2 p-6 hover:border-primary/40 transition-colors">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-extrabold text-lg">{title}</div>
              {lines.map((l) => (
                <div key={l} className="text-sm text-muted-foreground">
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl border-2 p-8 bg-card space-y-5 shadow-[var(--shadow-card)]">
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
            <Input type="tel" placeholder="+91 90000 00000" maxLength={20} />
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
        <div className="rounded-3xl overflow-hidden border-2 shadow-[var(--shadow-card)]">
          <iframe
            title="Stay Inn Hostels location"
            src="https://www.google.com/maps?q=MG+Road,+Bengaluru,+Karnataka&output=embed"
            className="w-full h-[420px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="rounded-3xl border-2 p-8 bg-card space-y-5">
          <h2 className="text-2xl font-extrabold">Find us on socials</h2>
          <p className="text-sm text-muted-foreground">Follow along for room drops, community events and resident stories.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "#" },
              { icon: Twitter, label: "Twitter", href: "#" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-2xl border-2 p-4 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-bold text-sm">{label}</span>
              </a>
            ))}
          </div>
          <div className="rounded-2xl bg-muted/50 p-5 text-sm">
            <div className="font-bold mb-1">Stay Inn HQ</div>
            <div className="text-muted-foreground">MG Road, Bengaluru, Karnataka 560001, India</div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
