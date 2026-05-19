import Link from "next/link";
import type { ReactNode } from "react";
import { AuthBrandPanel, AuthMobileBrand } from "@/components/auth/auth-brand-panel";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <AuthBrandPanel />

      <main className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <AuthMobileBrand />

        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          {children}

          {footer ? (
            <div className="text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground lg:hidden">
          <Link href="/" className="hover:text-primary font-semibold">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
