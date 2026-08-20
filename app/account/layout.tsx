import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "My account — Stay Inn Hostels",
  description: "View your bookings, rent, and profile at Stay Inn Hostels.",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
