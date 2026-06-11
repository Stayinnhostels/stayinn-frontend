import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TAB_LOGO_SRC } from "@/lib/brand-assets";
import { buildThemeCssVars } from "@/lib/site-theme";
import { fetchPublicSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSiteSettings();
  return {
    title: `${settings.hotelName} — ${settings.tagline}`,
    description: settings.description,
    icons: {
      icon: TAB_LOGO_SRC,
      shortcut: TAB_LOGO_SRC,
      apple: TAB_LOGO_SRC,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await fetchPublicSiteSettings();
  const themeStyle = buildThemeCssVars(siteSettings.primaryColor, siteSettings.accentColor) as CSSProperties;

  return (
    <html lang="en" className="h-full antialiased" style={themeStyle} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers initialSiteSettings={siteSettings}>{children}</Providers>
      </body>
    </html>
  );
}
