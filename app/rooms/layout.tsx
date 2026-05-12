import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms — Stay Inn Hostels",
  description: "Browse all available seat-based and private hostel rooms. Filter by price, room type, capacity and amenities.",
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
