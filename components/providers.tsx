"use client";

import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { SiteThemeStyles } from "@/components/site-theme-styles";
import { CurrencyProvider } from "@/components/currency-provider";
import type { SiteSettings } from "@/lib/site-settings";
import { SITE_SETTINGS_DEFAULTS } from "@/lib/site-settings";

export function Providers({
  children,
  initialSiteSettings = SITE_SETTINGS_DEFAULTS,
}: {
  children: React.ReactNode;
  initialSiteSettings?: SiteSettings;
}) {
  return (
    <QueryProvider>
      <SiteSettingsProvider settings={initialSiteSettings}>
        <SiteThemeStyles />
        <CurrencyProvider>
          <AuthProvider>
            {children}
          <Toaster richColors position="top-right" />
          </AuthProvider>
        </CurrencyProvider>
      </SiteSettingsProvider>
    </QueryProvider>
  );
}
