export type Room = {
  id: string;
  type: string;
  title: string;
  price: number;
  capacity: number;
  img: string;
  desc: string;
  amenities: string[];
  badge?: string;
};

export const ROOMS: Room[] = [
  {
    id: "twin-deluxe",
    type: "2 Seater",
    title: "Twin Deluxe Room",
    price: 6499,
    capacity: 2,
    img: "/assets/room-2seater.jpg",
    desc: "Spacious shared room ideal for friends or focused professionals.",
    amenities: ["Attached Bathroom", "Study Table", "Wardrobe", "WiFi", "AC"],
  },
  {
    id: "triple-classic",
    type: "3 Seater",
    title: "Triple Classic Room",
    price: 5499,
    capacity: 3,
    img: "/assets/room-3seater.jpg",
    desc: "Bright triple sharing — sweet spot of affordability and personal space.",
    amenities: ["Attached Bathroom", "Study Table", "Wardrobe", "WiFi", "Laundry"],
  },
  {
    id: "quad-community",
    type: "4 Seater",
    title: "Quad Community Room",
    price: 4499,
    capacity: 4,
    img: "/assets/room-4seater.jpg",
    desc: "Most affordable seat-sharing — perfect for community-loving students.",
    amenities: ["Common Bathroom", "Study Desks", "Lockers", "WiFi", "Power Backup"],
    badge: "Most Popular",
  },
  {
    id: "private-suite",
    type: "Private",
    title: "Private Suite",
    price: 11999,
    capacity: 1,
    img: "/assets/room-private.jpg",
    desc: "Your own private retreat with attached bathroom.",
    amenities: ["Attached Bathroom", "Study Setup", "Wardrobe", "Premium WiFi", "AC"],
    badge: "Premium",
  },
  {
    id: "twin-economy",
    type: "2 Seater",
    title: "Twin Economy Room",
    price: 5499,
    capacity: 2,
    img: "/assets/room-2seater.jpg",
    desc: "Comfortable twin sharing at a friendly price.",
    amenities: ["Common Bathroom", "Study Table", "Wardrobe", "WiFi"],
  },
  {
    id: "quad-budget",
    type: "4 Seater",
    title: "Quad Budget Room",
    price: 3999,
    capacity: 4,
    img: "/assets/room-4seater.jpg",
    desc: "Wallet-friendly quad sharing with all the essentials.",
    amenities: ["Common Bathroom", "Lockers", "WiFi", "Laundry"],
  },
];

export const ROOM_TYPES = ["2 Seater", "3 Seater", "4 Seater", "Private"] as const;
export const AMENITY_LIST = [
  "Attached Bathroom",
  "AC",
  "WiFi",
  "Study Table",
  "Wardrobe",
  "Laundry",
  "Power Backup",
  "Lockers",
] as const;
