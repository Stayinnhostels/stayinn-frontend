import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { fetchPublicSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSiteSettings();
  return {
    title: `${settings.hotelName} — ${settings.tagline}`,
    description: settings.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await fetchPublicSiteSettings();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers initialSiteSettings={siteSettings}>{children}</Providers>
      </body>
    </html>
  );
}
