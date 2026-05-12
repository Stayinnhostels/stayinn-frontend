import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms & Conditions — Stay Inn Hostels",
  description: "Booking terms, cancellation rules, liability, and house policies at Stay Inn Hostels.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl md:text-2xl font-extrabold">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-16 pb-8 md:pt-24 max-w-3xl">
        <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-5">
          LEGAL
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05]">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: May 9, 2026</p>
      </section>

      <section className="container mx-auto px-4 pb-20 max-w-3xl space-y-10">
        <Section title="1. Acceptance of Terms">
          <p>
            By booking a seat or accessing any of our services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.
          </p>
        </Section>

        <Section title="2. Bookings & Payments">
          <p>
            All bookings are confirmed only after full payment of the first month&apos;s rent and security deposit. Prices are listed per seat per month and are subject to applicable taxes. We reserve the right to refuse a booking at our discretion.
          </p>
        </Section>

        <Section title="3. Cancellation Policy">
          <p>
            Cancellations made 7 or more days before check-in receive a full refund of the first month&apos;s rent. Cancellations within 7 days forfeit the security deposit. No refunds are issued after check-in for unused days unless required by law.
          </p>
        </Section>

        <Section title="4. Refund Rules">
          <p>
            Approved refunds are processed to the original payment method within 7 business days. Bank or payment processor delays may add an additional 3–5 days. Refunds are not provided for early move-outs unless explicitly stated in your booking agreement.
          </p>
        </Section>

        <Section title="5. House Rules & Guest Behaviour">
          <p>Residents are expected to maintain a respectful, quiet, and clean environment. The following are strictly prohibited:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Smoking inside rooms or common indoor areas</li>
            <li>Drugs or illegal substances on the premises</li>
            <li>Loud noise between 10 PM and 7 AM</li>
            <li>Overnight guests in shared rooms</li>
            <li>Damage to furniture, fixtures, or other residents&apos; property</li>
          </ul>
          <p>Violations may result in warnings, fines deducted from your security deposit, or immediate termination of stay without refund.</p>
        </Section>

        <Section title="6. Liability">
          <p>
            Stay Inn Hostels is not liable for loss, theft, or damage to personal belongings. Residents are strongly encouraged to use the in-room lockers and obtain personal travel or contents insurance.
          </p>
          <p>To the maximum extent permitted by law, our total liability arising out of any stay is limited to the amount paid by the resident for the relevant booking.</p>
        </Section>

        <Section title="7. Use of Facilities">
          <p>
            Shared facilities — kitchen, lounge, gym, laundry — are provided &quot;as is&quot;. Residents use these facilities at their own risk and must follow posted safety instructions.
          </p>
        </Section>

        <Section title="8. Modifications">
          <p>We may update these Terms &amp; Conditions periodically. Continued use of our services after changes are posted constitutes acceptance of the revised terms.</p>
        </Section>

        <Section title="9. Governing Law">
          <p>These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
        </Section>

        <Section title="10. Contact">
          <p>
            For questions about these terms, email <span className="text-primary font-semibold">legal@stayinn.example</span>.
          </p>
        </Section>
      </section>

      <SiteFooter />
    </div>
  );
}
