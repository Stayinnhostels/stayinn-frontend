"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactDetailsCards, ContactMapSection } from "@/components/contact-details";
import { useSiteSettings } from "@/components/site-settings-provider";
import { submitContactMessage } from "@/lib/contact-api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const { phone } = useSiteSettings();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || message.trim().length < 5) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      await submitContactMessage({
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || undefined,
        message,
      });
      toast.success("Message sent! We'll get back to you soon.");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  }

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
          onSubmit={handleSubmit}
          className="rounded-3xl border-2 p-8 bg-card space-y-5 shadow-[var(--shadow-card)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-bold mb-2 block">Full name</label>
              <Input
                placeholder="Aarav Mehta"
                required
                maxLength={80}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="you@email.com"
                required
                maxLength={120}
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">Phone</label>
            <Input
              type="tel"
              placeholder={phone}
              maxLength={20}
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-2 block">Message</label>
            <Textarea
              placeholder="Tell us what you're looking for…"
              rows={5}
              maxLength={1000}
              required
              minLength={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="rounded-full font-bold w-full sm:w-auto px-8"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…
              </>
            ) : (
              "Send Message"
            )}
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
