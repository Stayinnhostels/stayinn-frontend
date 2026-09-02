import { apiFetch } from "@/lib/api-client";
import { AMENITY_LIST, ROOM_TYPES } from "@/lib/rooms-data";
import type { DisplayCurrency } from "@/lib/currency";

export type { RoomCategory } from "@/lib/rooms-data";
export { AMENITY_LIST, ROOM_TYPES };

export type ApiRoom = {
  id: string;
  title: string;
  room_number?: number | null;
  description: string;
  price_per_night: number;
  price_per_night_usd: number;
  price_per_night_pkr: number;
  visitor_nightly_rate?: number;
  visitor_nightly_rate_usd?: number;
  visitor_nightly_rate_pkr?: number;
  currency: DisplayCurrency;
  status: string;
  category: string;
  capacity: number;
  beds_total: number;
  beds_available: number;
  amenities: string[];
  images: string[];
  badge: string | null;
  display_order?: number;
};

/** Room shape used by marketing pages */
export type MarketingRoom = {
  id: string;
  type: string;
  title: string;
  room_number: number | null;
  price: number;
  price_usd: number;
  price_pkr: number;
  visitor_nightly_rate: number;
  visitor_nightly_rate_usd: number;
  visitor_nightly_rate_pkr: number;
  currency: DisplayCurrency;
  capacity: number;
  beds_total: number;
  beds_available: number;
  img: string;
  images: string[];
  desc: string;
  amenities: string[];
  badge?: string;
  status: string;
};

const PLACEHOLDER_IMG = "/assets/room-2seater.jpg";

/** Rooms shown on /rooms, home, and booking picker — at least one free seat. */
export function isRoomListedOnSite(room: Pick<MarketingRoom, "beds_available" | "status">) {
  return (
    room.beds_available > 0 &&
    room.status !== "maintenance" &&
    room.status !== "draft"
  );
}

export function formatSeatsFree(count: number) {
  if (count === 1) return "1 seat free";
  return `${count} seats free`;
}

export function formatMarketingRoomTitle(room: Pick<MarketingRoom, "title" | "room_number">) {
  if (room.room_number != null) {
    return `${room.room_number} · ${room.title}`;
  }
  return room.title;
}

export function mapApiRoomToMarketing(room: ApiRoom): MarketingRoom {
  const images = room.images?.length ? room.images : [PLACEHOLDER_IMG];
  return {
    id: room.id,
    type: room.category,
    title: room.title,
    room_number: room.room_number ?? null,
    price: room.price_per_night,
    price_usd: room.price_per_night_usd,
    price_pkr: room.price_per_night_pkr,
    visitor_nightly_rate:
      room.visitor_nightly_rate ??
      (room.currency === "usd" ? room.visitor_nightly_rate_usd ?? 15 : room.visitor_nightly_rate_pkr ?? 1500),
    visitor_nightly_rate_usd: room.visitor_nightly_rate_usd ?? 15,
    visitor_nightly_rate_pkr: room.visitor_nightly_rate_pkr ?? 1500,
    currency: room.currency,
    capacity: room.capacity,
    beds_total: room.beds_total,
    beds_available: room.beds_available,
    img: images[0],
    images,
    desc: room.description || "",
    amenities: room.amenities ?? [],
    badge: room.badge ?? undefined,
    status: room.status,
  };
}

type ListRoomsResponse = {
  success: boolean;
  rooms: ApiRoom[];
};

type GetRoomResponse = {
  success: boolean;
  room: ApiRoom;
};

/** Bookable rooms only (hidden when all seats are taken; reappear when seats free up). */
export async function fetchRooms(
  params?: { limit?: number; currency?: DisplayCurrency },
): Promise<MarketingRoom[]> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 100));
  search.set("bookable", "true");
  if (params?.currency) search.set("currency", params.currency);

  const data = await apiFetch<ListRoomsResponse>(`/api/v1/rooms?${search.toString()}`);
  if (!data.success || !Array.isArray(data.rooms)) {
    throw new Error("Could not load rooms");
  }

  return [...data.rooms]
    .sort((a, b) => (a.display_order ?? 100) - (b.display_order ?? 100))
    .map(mapApiRoomToMarketing)
    .filter(isRoomListedOnSite);
}

export async function fetchRoomById(
  id: string,
  currency?: DisplayCurrency,
): Promise<MarketingRoom | null> {
  try {
    const q = currency ? `?currency=${currency}&bookable=true` : "?bookable=true";
    const data = await apiFetch<GetRoomResponse>(
      `/api/v1/rooms/${encodeURIComponent(id)}${q}`,
    );
    if (!data.success || !data.room) return null;
    return mapApiRoomToMarketing(data.room);
  } catch {
    return null;
  }
}
