import { apiFetch } from "@/lib/api-client";

export type PublicReview = {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  room_id: string | null;
  room_title: string | null;
  featured: boolean;
  created_at: string | null;
};

export type SubmitReviewInput = {
  room_id: string;
  guest_name: string;
  guest_email?: string;
  rating: number;
  comment: string;
};

export type FetchPublicReviewsParams = {
  limit?: number;
  roomId?: string;
  featured?: boolean;
};

export async function fetchPublicReviews(
  params: FetchPublicReviewsParams = {},
): Promise<PublicReview[]> {
  const search = new URLSearchParams();
  const limit = params.limit ?? 6;
  search.set("limit", String(limit));
  if (params.roomId) search.set("room_id", params.roomId);
  if (params.featured === true) search.set("featured", "true");
  if (params.featured === false) search.set("featured", "false");

  const data = await apiFetch<{ success: boolean; reviews: PublicReview[] }>(
    `/api/v1/reviews/public?${search.toString()}`,
  );
  if (data.success && Array.isArray(data.reviews)) {
    return data.reviews;
  }
  return [];
}

export async function submitPublicReview(input: SubmitReviewInput): Promise<void> {
  await apiFetch<{ success: boolean; message?: string }>("/api/v1/reviews/public", {
    method: "POST",
    body: JSON.stringify({
      room_id: input.room_id,
      guest_name: input.guest_name.trim(),
      guest_email: input.guest_email?.trim() || undefined,
      rating: input.rating,
      comment: input.comment.trim(),
    }),
  });
}

export function reviewGuestRole(roomTitle: string | null): string {
  if (!roomTitle) return "Resident";
  if (/private/i.test(roomTitle)) return "Working Professional";
  return "Resident";
}

export function averageRating(reviews: PublicReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
