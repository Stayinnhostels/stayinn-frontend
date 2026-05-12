"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROOMS } from "@/lib/rooms-data";
import { ArrowLeft, BedDouble, Check, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function RoomDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const room = useMemo(() => (id ? ROOMS.find((r) => r.id === id) : undefined), [id]);

  if (!id || !room) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center p-10 text-center">
          <div>
            <h1 className="text-3xl font-extrabold mb-3">Room not found</h1>
            <p className="text-muted-foreground mb-6">The room you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild className="rounded-full font-bold">
              <Link href="/rooms">Browse all rooms</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const gallery = [room.img, ...ROOMS.filter((r) => r.id !== room.id).slice(0, 3).map((r) => r.img)];
  const [active, setActive] = useState(0);
  const beds = Array.from({ length: room.capacity }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-8 md:pt-12">
        <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to all rooms
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border-2 bg-muted">
              <img src={gallery[active]} alt={room.title} className="h-full w-full object-cover" />
            </div>
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
          </div>

          <aside className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold">
                  {room.type}
                </Badge>
                {room.badge && (
                  <Badge className="rounded-full bg-accent text-accent-foreground border-0 font-bold">{room.badge}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{room.title}</h1>
              <p className="mt-3 text-muted-foreground">{room.desc}</p>
            </div>

            <div className="rounded-3xl border-2 p-6 bg-card shadow-[var(--shadow-card)] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-primary">₹{room.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">per seat / month</div>
                </div>
                <div className="text-right text-sm text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
                </div>
              </div>
              <Button asChild size="lg" className="w-full rounded-full font-bold">
                <Link href={`/booking?roomId=${encodeURIComponent(room.id)}`}>Book This Room</Link>
              </Button>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-muted-foreground">
                <div className="space-y-0.5">
                  <ShieldCheck className="h-4 w-4 mx-auto text-primary" /> Verified
                </div>
                <div className="space-y-0.5">
                  <Sparkles className="h-4 w-4 mx-auto text-primary" /> Cleaned weekly
                </div>
                <div className="space-y-0.5">
                  <MapPin className="h-4 w-4 mx-auto text-primary" /> Central location
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-14 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border-2 p-7 bg-card">
          <div className="flex items-center gap-2 mb-5">
            <BedDouble className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-extrabold">Bed Layout</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {beds.map((n) => (
              <div key={n} className="rounded-2xl border-2 border-dashed p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-extrabold">{n}</div>
                <div>
                  <div className="font-bold text-sm">Bed #{n}</div>
                  <div className="text-xs text-muted-foreground">Single · Memory foam mattress</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Each bed comes with a personal locker, study lamp, and power outlets.</p>
        </div>

        <div className="rounded-3xl border-2 p-7 bg-card">
          <h2 className="text-xl font-extrabold mb-5">Room Amenities</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {room.amenities.map((a: string) => (
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

      <section className="container mx-auto px-4 my-16">
        <div className="rounded-3xl p-10 md:p-14 text-center bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-card)]">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Like what you see?</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">
            Reserve your seat in {room.title} today. Most bookings are confirmed within an hour.
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
