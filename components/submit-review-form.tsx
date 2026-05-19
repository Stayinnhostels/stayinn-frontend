"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { submitPublicReview } from "@/lib/reviews-api";
import type { MarketingRoom } from "@/lib/rooms-api";

type SubmitReviewFormProps = {
  roomId: string;
  roomTitle?: string;
  /** When true, guest picks a room (homepage). When false, room is fixed (room detail page). */
  allowRoomSelect?: boolean;
  rooms?: MarketingRoom[];
  formIdPrefix?: string;
  className?: string;
};

export function SubmitReviewForm({
  roomId: initialRoomId,
  roomTitle,
  allowRoomSelect = false,
  rooms = [],
  formIdPrefix = "review",
  className,
}: SubmitReviewFormProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [roomId, setRoomId] = useState(initialRoomId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!allowRoomSelect) {
      setRoomId(initialRoomId);
    }
  }, [initialRoomId, allowRoomSelect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const activeRoomId = allowRoomSelect ? roomId : initialRoomId;
    if (!guestName.trim() || !activeRoomId || comment.trim().length < 10) {
      toast.error("Please fill in your name, room, and a review (at least 10 characters).");
      return;
    }
    setSubmitting(true);
    try {
      await submitPublicReview({
        room_id: activeRoomId,
        guest_name: guestName,
        guest_email: guestEmail || undefined,
        rating,
        comment,
      });
      toast.success("Thank you! Your review will appear after our team approves it.");
      setGuestName("");
      setGuestEmail("");
      setComment("");
      setRating(5);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className={`rounded-3xl border-2 p-6 md:p-8 ${className ?? ""}`}>
      <h3 className="text-xl font-extrabold mb-1">Write a review</h3>
      {!allowRoomSelect && roomTitle ? (
        <p className="text-sm text-muted-foreground mb-4">
          Sharing feedback for <span className="font-semibold text-foreground">{roomTitle}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          Tell others about your stay. Reviews are published after approval.
        </p>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${formIdPrefix}-name`}>Your name</Label>
          <Input
            id={`${formIdPrefix}-name`}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${formIdPrefix}-email`}>Email (optional)</Label>
          <Input
            id={`${formIdPrefix}-email`}
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        {allowRoomSelect ? (
          <div className="grid gap-2">
            <Label>Room you stayed in</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="grid gap-2">
          <Label>Rating</Label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="p-0.5"
                aria-label={`${i + 1} stars`}
              >
                <Star
                  className={`h-7 w-7 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${formIdPrefix}-comment`}>Your review</Label>
          <Textarea
            id={`${formIdPrefix}-comment`}
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your stay (min. 10 characters)"
            required
            minLength={10}
          />
        </div>
        <Button type="submit" className="rounded-full font-bold w-full sm:w-auto" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting…
            </>
          ) : (
            "Submit review"
          )}
        </Button>
      </form>
    </Card>
  );
}
