import { apiFetch } from "@/lib/api-client";
import { AMENITY_LIST, ROOM_TYPES } from "@/lib/rooms-data";

export type { RoomCategory } from "@/lib/rooms-data";
export { AMENITY_LIST, ROOM_TYPES };

export type ApiRoom = {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  status: string;
  category: string;
  capacity: number;
  beds_total: number;
  beds_available: number;
  amenities: string[];
  images: string[];
  badge: string | null;
};

/** Room shape used by marketing pages */
export type MarketingRoom = {
  id: string;
  type: string;
  title: string;
  price: number;
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

export function mapApiRoomToMarketing(room: ApiRoom): MarketingRoom {
  const images = room.images?.length ? room.images : [PLACEHOLDER_IMG];
  return {
    id: room.id,
    type: room.category,
    title: room.title,
    price: room.price_per_night,
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
export async function fetchRooms(params?: { limit?: number }): Promise<MarketingRoom[]> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 100));
  search.set("bookable", "true");

  const data = await apiFetch<ListRoomsResponse>(`/api/v1/rooms?${search.toString()}`);
  if (!data.success || !Array.isArray(data.rooms)) {
    throw new Error("Could not load rooms");
  }

  return data.rooms.map(mapApiRoomToMarketing).filter(isRoomListedOnSite);
}

export async function fetchRoomById(id: string): Promise<MarketingRoom | null> {
  try {
    const data = await apiFetch<GetRoomResponse>(`/api/v1/rooms/${encodeURIComponent(id)}`);
    if (!data.success || !data.room) return null;
    const room = mapApiRoomToMarketing(data.room);
    return room;
  } catch {
    return null;
  }
}
