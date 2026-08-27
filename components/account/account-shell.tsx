"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  Calendar,
  CreditCard,
  Files,
  Globe,
  Headphones,
  LayoutDashboard,
  Loader2,
  UserRound,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";
import { loginHref } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

const NAV: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/bookings", label: "Bookings", icon: Calendar },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/documents", label: "Documents", icon: Files },
  { href: "/account/support", label: "Support", icon: Headphones },
  { href: "/account/profile", label: "Profile", icon: UserRound },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function MiniSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="sticky top-28 z-20 flex h-[calc(100vh-8rem)] w-14 shrink-0 flex-col items-center gap-1 self-start rounded-2xl border border-border/70 bg-card py-3 shadow-sm sm:w-16">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11",
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-semibold">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mt-auto flex flex-col items-center gap-1 border-t border-border/60 pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                aria-label="Back to website"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:h-11 sm:w-11"
              >
                <Globe className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-semibold">
              Back to website
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

export function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(loginHref());
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <div className="flex flex-1 gap-3 px-3 py-6 sm:gap-5 sm:px-5 sm:py-8 lg:px-8">
        <MiniSidebar />
        <main className="min-w-0 flex-1 px-1 pb-16 pt-1 sm:px-2 sm:pt-2">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
