"use client";

import Link from "next/link";
import { useSiteSettings } from "@/components/site-settings-provider";
import { brandShortName } from "@/lib/site-settings";

export function SiteFooter() {
  const { hotelName, description, email, phone } = useSiteSettings();
  const brand = brandShortName(hotelName);

  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-black">
              {brand.charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-extrabold tracking-tight">{brand}.</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
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
