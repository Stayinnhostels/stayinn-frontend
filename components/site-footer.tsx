"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { useSiteSettings } from "@/components/site-settings-provider";
import { FOOTER_LOGO_CLASS, TAB_LOGO_SRC } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

const footerLinkClass = "text-primary-foreground/80 transition-colors hover:text-primary-foreground";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-sm font-bold tracking-wide">{children}</h3>;
}

function FooterLinks({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2.5 text-sm leading-relaxed">{children}</ul>;
}

export function SiteFooter() {
  const {
    hotelName,
    description,
    email,
    phone,
    fullAddress,
    address,
    city,
    country,
    whatsapp_url,
    website,
    instagram,
    facebook,
    twitter,
    youtube,
    linkedin,
    threads,
  } = useSiteSettings();
  const addressLine = fullAddress || [address, city, country].filter(Boolean).join(", ");

  return (
    <footer className="mt-20 border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src={TAB_LOGO_SRC}
                  alt={hotelName}
                  width={128}
                  height={128}
                  className={FOOTER_LOGO_CLASS}
                />
             
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">{description}</p>
            <SocialLinks
              inverted
              className="pt-1"
              fields={{
                website,
                instagram,
                facebook,
                twitter,
                youtube,
                linkedin,
                threads,
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <FooterLinks>
              <li>
                <Link href="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className={footerLinkClass}>
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/facilities" className={footerLinkClass}>
                  Facilities
                </Link>
              </li>
              <li>
                <Link href="/booking-rules" className={footerLinkClass}>
                  Booking Rules
                </Link>
              </li>
              <li>
                <Link href="/faq" className={footerLinkClass}>
                  FAQ
                </Link>
              </li>
            </FooterLinks>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <FooterLinks>
              <li>
                <Link href="/about" className={footerLinkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLinkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={footerLinkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={footerLinkClass}>
                  Terms &amp; Conditions
                </Link>
              </li>
            </FooterLinks>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <FooterLinks>
              {addressLine ? <li className="text-primary-foreground/80">{addressLine}</li> : null}
              <li>
                <a href={`mailto:${email}`} className={footerLinkClass}>
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className={footerLinkClass}>
                  {phone}
                </a>
              </li>
              <li className="text-primary-foreground/80">Mon–Sun · 9am–9pm</li>
              {whatsapp_url ? (
                <li className="flex items-center gap-3 pt-1">
                  <span className="font-semibold text-primary-foreground">WhatsApp</span>
                  <WhatsAppLink href={whatsapp_url} inverted />
                </li>
              ) : null}
            </FooterLinks>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div
          className={cn(
            "container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row",
            "text-primary-foreground/70",
          )}
        >
          <span className="text-center sm:text-left">
            © {new Date().getFullYear()} {hotelName}. All rights reserved.
          </span>
          <span className="flex gap-4">
            <Link href="/privacy" className={footerLinkClass}>
              Privacy
            </Link>
            <Link href="/terms" className={footerLinkClass}>
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
