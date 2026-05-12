import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-black">
              S
            </div>
            <span className="text-lg font-extrabold tracking-tight">Stay Inn.</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Comfortable, safe and affordable seat-based hostel living for students and professionals.
          </p>
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
            <li>hello@stayinn.example</li>
            <li>+91 90000 00000</li>
            <li>Mon–Sun · 9am–9pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Stay Inn Hostels. All rights reserved.</span>
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
