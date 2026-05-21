"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomReviewsSection } from "@/components/room-reviews-section";
import { useCurrency } from "@/components/currency-provider";
import { fetchRoomById, formatSeatsFree, isRoomListedOnSite, type MarketingRoom } from "@/lib/rooms-api";
import { ArrowLeft, BedDouble, Check, Loader2, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function RoomDetailPage() {
  const { currency, formatPrice, ready } = useCurrency();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const [room, setRoom] = useState<MarketingRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!id || !ready) {
      if (!id) setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchRoomById(id, currency);
      if (!cancelled) {
        setRoom(data);
        setActive(0);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, currency, ready]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" /> Loading room…
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!id || !room) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center p-10 text-center">
          <div>
            <h1 className="mb-3 text-3xl font-extrabold">Room not found</h1>
            <p className="mb-6 text-muted-foreground">The room you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild className="rounded-full font-bold">
              <Link href="/rooms">Browse all rooms</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!isRoomListedOnSite(room)) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center p-10 text-center">
          <div>
            <h1 className="mb-3 text-3xl font-extrabold">Fully booked</h1>
            <p className="mb-6 text-muted-foreground">
              {room.title} has no free seats right now. Check back later or browse other rooms.
            </p>
            <Button asChild className="rounded-full font-bold">
              <Link href="/rooms">See rooms with seats free</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const gallery = room.images.length > 0 ? room.images : [room.img];
  const beds = Array.from({ length: room.beds_total }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-8 md:pt-12">
        <Link
          href="/rooms"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all rooms
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border-2 bg-muted">
              <img src={gallery[active]} alt={room.title} className="h-full w-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                      active === i ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-primary/30 font-bold text-primary">
                  {room.type}
                </Badge>
                {room.badge && (
                  <Badge className="rounded-full border-0 bg-accent font-bold text-accent-foreground">{room.badge}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{room.title}</h1>
              <p className="mt-3 text-muted-foreground">{room.desc}</p>
            </div>

            <div className="space-y-4 rounded-3xl border-2 bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-primary">{formatPrice(room.price)}</div>
                  <div className="text-xs text-muted-foreground">per seat / month</div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <span className="flex items-center justify-end gap-1.5">
                    <Users className="h-4 w-4 text-emerald-600" />{" "}
                    <span className="font-semibold text-emerald-700">{formatSeatsFree(room.beds_available)}</span>
                    <span className="text-muted-foreground"> / {room.beds_total} total</span>
                  </span>
                </div>
              </div>
              <Button asChild size="lg" className="w-full rounded-full font-bold" disabled={room.beds_available < 1}>
                <Link href={`/booking?roomId=${encodeURIComponent(room.id)}`}>
                  {room.beds_available < 1 ? "Fully booked" : "Book seats"}
                </Link>
              </Button>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-muted-foreground">
                <div className="space-y-0.5">
                  <ShieldCheck className="mx-auto h-4 w-4 text-primary" /> Verified
                </div>
                <div className="space-y-0.5">
                  <Sparkles className="mx-auto h-4 w-4 text-primary" /> Cleaned weekly
                </div>
                <div className="space-y-0.5">
                  <MapPin className="mx-auto h-4 w-4 text-primary" /> Central location
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto mt-14 grid gap-8 px-4 lg:grid-cols-2">
        <div className="rounded-3xl border-2 bg-card p-7">
          <div className="mb-5 flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-extrabold">Seat layout</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {beds.map((n) => (
              <div
                key={n}
                className={`flex items-center gap-3 rounded-2xl border-2 border-dashed p-4 ${
                  n > room.beds_available ? "opacity-40" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-extrabold text-primary">
                  {n}
                </div>
                <div>
                  <div className="text-sm font-bold">Seat #{n}</div>
                  <div className="text-xs text-muted-foreground">
                    {n <= room.beds_available ? "Available" : "Reserved"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            You can book 1 seat, several seats, or all {room.beds_total} seats in this room on the booking page.
          </p>
        </div>

        <div className="rounded-3xl border-2 bg-card p-7">
          <h2 className="mb-5 text-xl font-extrabold">Room Amenities</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RoomReviewsSection roomId={room.id} roomTitle={room.title} />

      <section className="container mx-auto my-16 px-4">
        <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-10 text-center text-primary-foreground shadow-[var(--shadow-card)] md:p-14">
          <h2 className="mb-3 text-3xl font-extrabold md:text-4xl">Like what you see?</h2>
          <p className="mx-auto mb-6 max-w-xl opacity-90">
            Reserve your seat in {room.title} today. Choose how many seats you need — we&apos;ll confirm via WhatsApp.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full px-8 font-bold">
            <Link href={`/booking?roomId=${encodeURIComponent(room.id)}`}>Book Now</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
