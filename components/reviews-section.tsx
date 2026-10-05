"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Star } from "lucide-react";
import { GoogleReviewsEmbed } from "@/components/google-reviews-embed";
import { fetchPublicReviews, reviewGuestRole, type PublicReview } from "@/lib/reviews-api";

const GOOGLE_REVIEWS_WIDGET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_WIDGET_ID?.trim() ?? "";

/**
 * Homepage testimonials:
 * - Google Reviews widget when configured
 * - Site/admin reviews only as fallback when Google is not set
 * Custom room reviews still live on each room page.
 */
export function ReviewsSection() {
  const hasGoogleEmbed = GOOGLE_REVIEWS_WIDGET_ID.length > 0;
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(!hasGoogleEmbed);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (hasGoogleEmbed) return;

    let cancelled = false;
    (async () => {
      try {
        const reviewList = await fetchPublicReviews({ limit: 6 });
        if (!cancelled) {
          setReviews(reviewList);
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
  }, [hasGoogleEmbed]);

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

        {hasGoogleEmbed ? (
          <GoogleReviewsEmbed widgetId={GOOGLE_REVIEWS_WIDGET_ID} />
        ) : loading ? (
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
              Guest reviews for each room appear on the room page after our team publishes them.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((t) => (
              <Card
                key={t.id}
                className="rounded-3xl border-2 p-7 transition-shadow hover:shadow-[var(--shadow-card)]"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-foreground/90">&quot;{t.comment}&quot;</p>
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] font-extrabold text-primary-foreground">
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
      </div>
    </section>
  );
}
