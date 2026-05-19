"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Star } from "lucide-react";
import { SubmitReviewForm } from "@/components/submit-review-form";
import { fetchRooms, type MarketingRoom } from "@/lib/rooms-api";
import { fetchPublicReviews, reviewGuestRole, type PublicReview } from "@/lib/reviews-api";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [rooms, setRooms] = useState<MarketingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [defaultRoomId, setDefaultRoomId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [reviewList, roomList] = await Promise.all([
          fetchPublicReviews({ limit: 6 }),
          fetchRooms({ limit: 50 }),
        ]);
        if (!cancelled) {
          setReviews(reviewList);
          setRooms(roomList);
          setLoadError(false);
          if (roomList[0]) setDefaultRoomId(roomList[0].id);
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
  }, []);

  return (
    <section id="reviews" className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <Badge
            variant="outline"
            className="rounded-full border-accent text-accent-foreground font-bold mb-4 bg-accent/30"
          >
            TESTIMONIALS
          </Badge>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Loved by our residents
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real feedback from guests who stayed with us.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : loadError ? (
          <Card className="mx-auto max-w-lg rounded-3xl border-2 border-dashed p-10 text-center">
            <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 font-bold">Could not load reviews</p>
            <p className="mt-1 text-sm text-muted-foreground">Please refresh the page and try again.</p>
          </Card>
        ) : reviews.length === 0 ? (
          <Card className="mx-auto max-w-lg rounded-3xl border-2 border-dashed p-10 text-center">
            <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 font-bold">No reviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share your experience — we publish reviews after a quick check by our team.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((t) => (
              <Card
                key={t.id}
                className="rounded-3xl p-7 border-2 hover:shadow-[var(--shadow-card)] transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6">&quot;{t.comment}&quot;</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground font-extrabold">
                    {t.guest_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{t.guest_name}</div>
                    <p className="text-xs text-muted-foreground">
                      {reviewGuestRole(t.room_title)}
                      {t.room_id && t.room_title ? (
                        <>
                          {" · "}
                          <Link href={`/room/${t.room_id}`} className="font-medium hover:text-primary">
                            {t.room_title}
                          </Link>
                        </>
                      ) : t.room_title ? (
                        ` · ${t.room_title}`
                      ) : null}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 max-w-xl mx-auto">
          {!showForm ? (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full font-bold"
              onClick={() => setShowForm(true)}
              disabled={rooms.length === 0 && !defaultRoomId}
            >
              Share your experience
            </Button>
          ) : defaultRoomId ? (
            <div className="space-y-3">
              <SubmitReviewForm
                roomId={defaultRoomId}
                allowRoomSelect
                rooms={rooms}
                formIdPrefix="home-review"
              />
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-full"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
