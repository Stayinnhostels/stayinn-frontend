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
import { LogOut, Menu, User } from "lucide-react";
import { useSiteSettings } from "@/components/site-settings-provider";
import { brandShortName } from "@/lib/site-settings";

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

function SiteHeaderInner() {
  const { hotelName } = useSiteSettings();
  const brand = brandShortName(hotelName);
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInHref = loginHref(
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-black">
            {brand.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            {brand}
            <span className="text-primary">.</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} exact={n.href === "/"} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
          <Button asChild size="sm" className="rounded-full px-5 font-semibold shadow-[var(--shadow-soft)] hidden sm:inline-flex">
            <Link href="/booking">Book a Seat</Link>
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
                <Link href="/booking" className="mt-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-bold">
                  Book a Seat
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
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl h-16" />
      }
    >
      <SiteHeaderInner />
    </Suspense>
  );
}
