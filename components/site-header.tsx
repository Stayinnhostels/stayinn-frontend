"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { adminHref, dashboardHref } from "@/lib/app-links";
import { loginHref } from "@/lib/auth-redirect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, User, ArrowRight } from "lucide-react";
import { BrandNavLogo } from "@/components/brand-nav-logo";
import { NAV_BAR_CLASS } from "@/lib/brand-assets";
import { useSiteSettings } from "@/components/site-settings-provider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/about", label: "About Us" },
  { href: "/facilities", label: "Facilities" },
  { href: "/booking-rules", label: "Booking Rules" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
] as const;

function NavLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const roomsSection = href === "/rooms" && (pathname === "/rooms" || pathname.startsWith("/room/"));
  const active = exact
    ? pathname === href
    : pathname === href || (href !== "/" && pathname.startsWith(href)) || roomsSection;
  return (
    <Link href={href} className={active ? "text-primary transition-colors" : "hover:text-primary transition-colors"}>
      {label}
    </Link>
  );
}

const bookSeatCtaClass =
  "rounded-full px-6 md:px-8 h-11 md:h-12 text-sm md:text-base font-extrabold shadow-[var(--shadow-glow)] bg-[image:var(--gradient-hero)] hover:scale-[1.03] transition-transform border-0";

function SiteHeaderInner() {
  const { hotelName } = useSiteSettings();
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInHref = loginHref(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className={`container mx-auto ${NAV_BAR_CLASS}`}>
        <Link href="/" className="flex shrink-0 items-center">
          <BrandNavLogo alt={hotelName} />
        </Link>
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 text-sm font-medium">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} exact={n.href === "/"} />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full font-semibold">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-bold">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref()}>Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href={adminHref()}>Admin Console</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/booking">Book a seat</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="rounded-full font-semibold hidden sm:inline-flex">
              <Link href={signInHref}>Sign in</Link>
            </Button>
          )}
          <Button asChild size="lg" className={`${bookSeatCtaClass} hidden sm:inline-flex`}>
            <Link href="/booking">
              Book a Seat
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8 text-base font-semibold">
                {nav.map((n) => (
                  <NavLink key={n.href} href={n.href} label={n.label} exact={n.href === "/"} />
                ))}
                <Link
                  href="/booking"
                  className={`mt-2 inline-flex items-center justify-center gap-1.5 ${bookSeatCtaClass} text-primary-foreground`}
                >
                  Book a Seat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl min-h-[5rem] sm:min-h-[5.25rem]" />
      }
    >
      <SiteHeaderInner />
    </Suspense>
  );
}
