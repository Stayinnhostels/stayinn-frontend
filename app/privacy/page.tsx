import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { LegalContactNote } from "@/components/legal-contact-note";

export const metadata: Metadata = {
  title: "Privacy Policy — Stay Inn Hostels",
  description: "How Stay Inn Hostels collects, uses, and protects your personal data, including GDPR and cookie policies.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-extrabold">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-8 md:pt-24 max-w-3xl">
        <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
          LEGAL
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 9, 2026</p>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl space-y-10">
        <Section title="1. Information We Collect">
          <p>
            We collect information you provide directly — such as your name, email, phone number, government ID, and payment details — when you book a room, contact support, or create an account.
          </p>
          <p>We also collect technical data automatically, including IP address, browser type, device identifiers, and usage analytics, to improve our services.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>
            Your data helps us process bookings, verify identity, provide customer support, comply with legal obligations, and send service updates. With your consent, we may also send you offers and newsletters — you can opt out anytime.
          </p>
        </Section>

        <Section title="3. Cookies & Tracking">
          <p>
            We use essential cookies to keep you signed in and remember your preferences. Analytics cookies help us understand how visitors use our site. You can control cookies through your browser settings or our cookie banner.
          </p>
        </Section>

        <Section title="4. Data Sharing">
          <p>
            We never sell your personal data. We share information only with trusted service providers (payment processors, identity verification, cloud hosting) under strict confidentiality agreements, or when required by law.
          </p>
        </Section>

        <Section title="5. Your GDPR Rights">
          <p>
            If you are in the European Economic Area, you have the right to access, correct, delete, restrict, or port your personal data, and to withdraw consent at any time. Contact us at{" "}
            <span className="text-primary font-semibold">privacy@stayinn.example</span> to exercise these rights.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain personal data only as long as necessary to fulfil bookings, comply with tax and accounting laws, and resolve disputes. Account data is deleted within 90 days of account closure unless legally required otherwise.
          </p>
        </Section>

        <Section title="7. Security">
          <p>
            We use industry-standard encryption (TLS in transit, AES-256 at rest), restricted internal access, and regular security audits. No system is 100% secure, but we work hard to keep your data safe.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Our services are not directed at children under 16. We do not knowingly collect personal data from minors without verifiable parental consent.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this policy from time to time. Material changes will be communicated via email or a notice on our website at least 14 days before they take effect.</p>
        </Section>

        <Section title="10. Contact Us">
          <LegalContactNote />
        </Section>
      </section>

      <SiteFooter />
    </div>
  );
}
