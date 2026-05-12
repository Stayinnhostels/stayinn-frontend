import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-primary-foreground bg-[image:var(--gradient-hero)]">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-[var(--accent)]/30 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur font-black">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Stay Inn<span className="opacity-80">.</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">Comfortable hostel living, seat by seat.</h2>
          <p className="text-base text-primary-foreground/90 max-w-md">
            Join thousands of students and working professionals already enjoying premium shared living with zero brokerage.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <Stat value="12k+" label="Happy residents" />
            <div className="h-10 w-px bg-white/20" />
            <Stat value="40+" label="Properties" />
            <div className="h-10 w-px bg-white/20" />
            <Stat value="4.9★" label="Rated" />
          </div>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/70">© {new Date().getFullYear()} Stay Inn Hostels. All rights reserved.</p>
      </aside>

      <main className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-black">
              S
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              Stay Inn<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          {children}

          {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-primary-foreground/80">{label}</div>
    </div>
  );
}
