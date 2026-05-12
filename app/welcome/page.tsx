"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { dashboardHref } from "@/lib/app-links";

export default function WelcomePage() {
  const { user } = useAuth();
  const name = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <AuthLayout title={`Welcome, ${name}! 🎉`} subtitle="Your Stay Inn account is ready to go.">
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <ul className="space-y-3 text-left">
          {["Browse & book seats across all properties", "Manage your bookings from one dashboard", "Get exclusive offers and member perks"].map((t) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl border-2 p-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">{t}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]">
            <Link href={dashboardHref()}>Continue to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full font-bold h-11">
            <Link href="/rooms">Browse rooms</Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
