"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Star } from "lucide-react";
import { SubmitReviewForm } from "@/components/submit-review-form";
import {
  averageRating,
  fetchPublicReviews,
  reviewGuestRole,
  type PublicReview,
} from "@/lib/reviews-api";

type RoomReviewsSectionProps = {
  roomId: string;
  roomTitle: string;
};

function ReviewCard({ review, showRoomTitle }: { review: PublicReview; showRoomTitle?: boolean }) {
  return (
    <Card className="rounded-3xl border-2 p-6">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <p className="text-foreground/90 leading-relaxed mb-5">&quot;{review.comment}&quot;</p>
      <div className="flex items-center gap-3 border-t pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-sm font-extrabold text-primary-foreground">
          {review.guest_name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold truncate">{review.guest_name}</p>
          <p className="text-xs text-muted-foreground">
            {reviewGuestRole(review.room_title)}
            {showRoomTitle && review.room_title ? ` · ${review.room_title}` : ""}
            {review.created_at
              ? ` · ${new Date(review.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
              : ""}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function RoomReviewsSection({ roomId, roomTitle }: RoomReviewsSectionProps) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchPublicReviews({ roomId, limit: 24 });
        if (!cancelled) {
          setReviews(list);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) {
          setReviews([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const avg = averageRating(reviews);

  return (
    <section className="container mx-auto mt-14 px-4" id="room-reviews">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold md:text-3xl">Guest reviews</h2>
          <p className="mt-1 text-muted-foreground">
            What residents say about {roomTitle}
          </p>
        </div>
        {!loading && !loadError && reviews.length > 0 && (
          <div className="flex items-center gap-2 rounded-full border-2 bg-card px-4 py-2">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="text-lg font-extrabold">{avg}</span>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} review{reviews.length === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : loadError ? (
            <Card className="rounded-3xl border-2 border-dashed p-10 text-center">
              <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 font-bold">Could not load reviews</p>
              <p className="mt-1 text-sm text-muted-foreground">Please refresh and try again.</p>
            </Card>
          ) : reviews.length === 0 ? (
            <Card className="rounded-3xl border-2 border-dashed p-10 text-center">
              <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 font-bold">No reviews for this room yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stayed in {roomTitle}? Be the first to leave a review using the form.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>

        <SubmitReviewForm roomId={roomId} roomTitle={roomTitle} formIdPrefix={`room-${roomId}`} />
      </div>
    </section>
  );
}
