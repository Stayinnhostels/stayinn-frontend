import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Stay Inn Hostels",
  description: "Get in touch with Stay Inn Hostels. Visit our properties, call, or send us a message.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
