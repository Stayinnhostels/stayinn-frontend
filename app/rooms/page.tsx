"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Users, Check, SlidersHorizontal, Loader2 } from "lucide-react";
import {
  AMENITY_LIST,
  ROOM_TYPES,
  fetchRooms,
  formatSeatsFree,
  type MarketingRoom,
} from "@/lib/rooms-api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<MarketingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [price, setPrice] = useState<[number, number]>([3000, 15000]);
  const [types, setTypes] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const list = await fetchRooms({ limit: 100 });
        if (!cancelled) {
          setRooms(list);
          if (list.length > 0) {
            const prices = list.map((r) => r.price);
            setPrice([Math.min(...prices), Math.max(...prices)]);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load rooms");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const toggleNum = (arr: number[], v: number, set: (a: number[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(
    () =>
      rooms.filter(
        (r) =>
          r.price >= price[0] &&
          r.price <= price[1] &&
          (types.length === 0 || types.includes(r.type)) &&
          (capacity.length === 0 || capacity.includes(r.capacity)) &&
          (amenities.length === 0 || amenities.every((a) => r.amenities.includes(a))),
      ),
    [rooms, price, types, capacity, amenities],
  );

  const reset = () => {
    if (rooms.length > 0) {
      const prices = rooms.map((r) => r.price);
      setPrice([Math.min(...prices), Math.max(...prices)]);
    } else {
      setPrice([3000, 15000]);
    }
    setTypes([]);
    setCapacity([]);
    setAmenities([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-12 pb-6 md:pt-16">
        <Badge variant="outline" className="mb-4 rounded-full border-primary/30 font-bold text-primary">
          ALL ROOMS
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Find your seat</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Filter by price, room type, capacity or amenities. Book 1 seat or multiple seats in the same room.
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-20 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit space-y-7 self-start rounded-3xl border-2 bg-card p-6 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <button type="button" onClick={reset} className="text-xs font-bold text-primary hover:underline">
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Price range (per seat / month)</Label>
            <Slider
              min={price[0]}
              max={Math.max(price[1], price[0] + 500)}
              step={500}
              value={price}
              onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{price[0].toLocaleString()}</span>
              <span>₹{price[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Room type</Label>
            <div className="space-y-2">
              {ROOM_TYPES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={types.includes(t)} onCheckedChange={() => toggle(types, t, setTypes)} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Capacity</Label>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={capacity.includes(c)}
                    onCheckedChange={() => toggleNum(capacity, c, setCapacity)}
                  />
                  {c} {c === 1 ? "seat" : "seats"}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Amenities</Label>
            <div className="max-h-56 space-y-2 overflow-auto pr-1">
              {AMENITY_LIST.map((a) => (
                <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={amenities.includes(a)}
                    onCheckedChange={() => toggle(amenities, a, setAmenities)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                "Loading rooms…"
              ) : (
                <>
                  <span className="font-bold text-foreground">{filtered.length}</span> rooms match your filters
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed py-24 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" /> Loading rooms from server…
            </div>
          ) : loadError ? (
            <div className="rounded-3xl border-2 border-dashed p-16 text-center">
              <p className="mb-2 font-bold text-destructive">Could not load rooms</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed p-16 text-center">
              <p className="mb-2 font-bold">
                {rooms.length === 0 ? "No seats available right now" : "No rooms match these filters"}
              </p>
              <p className="mb-5 text-sm text-muted-foreground">
                {rooms.length === 0
                  ? "All rooms are fully booked. Check back later when seats open up."
                  : "Try widening your price range or removing some filters."}
              </p>
              <Button onClick={reset} className="rounded-full font-bold">
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((r) => (
                <Card
                  key={r.id}
                  className="group overflow-hidden rounded-3xl border-2 p-0 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {r.badge && (
                      <Badge className="absolute left-4 top-4 rounded-full border-0 bg-accent font-bold text-accent-foreground">
                        {r.badge}
                      </Badge>
                    )}
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-600/95 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      <Users className="h-3.5 w-3.5" /> {formatSeatsFree(r.beds_available)}
                    </div>
                  </div>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold">{r.title}</h3>
                        <div className="mt-0.5 text-xs text-muted-foreground">{r.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-primary">₹{r.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">/seat / month</div>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{r.desc}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {r.amenities.slice(0, 4).map((a) => (
                        <li
                          key={a}
                          className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold"
                        >
                          <Check className="h-3 w-3 text-primary" /> {a}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" className="rounded-full font-bold">
                        <Link href={`/room/${r.id}`}>Details</Link>
                      </Button>
                      <Button asChild className="rounded-full font-bold">
                        <Link href={`/booking?roomId=${encodeURIComponent(r.id)}`}>Book</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
