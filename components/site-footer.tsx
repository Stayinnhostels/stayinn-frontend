"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { useSiteSettings } from "@/components/site-settings-provider";
import { FOOTER_LOGO_CLASS, FOOTER_LOGO_SRC } from "@/lib/brand-assets";

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
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="inline-flex">
            <Image
              src={FOOTER_LOGO_SRC}
              alt={hotelName}
              width={361}
              height={264}
              className={FOOTER_LOGO_CLASS}
            />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
          <SocialLinks
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
        <div>
          <div className="text-sm font-bold mb-3">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-primary">
                Rooms
              </Link>
            </li>
            <li>
              <Link href="/facilities" className="hover:text-primary">
                Facilities
              </Link>
            </li>
            <li>
              <Link href="/booking-rules" className="hover:text-primary">
                Booking Rules
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-bold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-bold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {addressLine ? <li>{addressLine}</li> : null}
            <li>
              <a href={`mailto:${email}`} className="hover:text-primary">
                {email}
              </a>
            </li>
            <li>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {phone}
              </a>
            </li>
            <li>Mon–Sun · 9am–9pm</li>
          </ul>
          {whatsapp_url ? (
            <div className="pt-3 space-y-2">
              <div className="text-sm font-bold">WhatsApp</div>
              <WhatsAppLink href={whatsapp_url} />
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>
            © {new Date().getFullYear()} {hotelName}. All rights reserved.
          </span>
          <span className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
