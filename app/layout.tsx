import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Stay Inn Hostels — Comfortable Hostel Living, Seat by Seat",
  description:
    "Affordable, secure & clean seat-based hostel accommodation for students and working professionals. WiFi, laundry, security & more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
