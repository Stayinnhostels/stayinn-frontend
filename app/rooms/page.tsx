"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Users, Check, SlidersHorizontal } from "lucide-react";
import { ROOMS, ROOM_TYPES, AMENITY_LIST } from "@/lib/rooms-data";

export default function RoomsPage() {
  const [price, setPrice] = useState<[number, number]>([3000, 13000]);
  const [types, setTypes] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const toggleNum = (arr: number[], v: number, set: (a: number[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(
    () =>
      ROOMS.filter(
        (r) =>
          r.price >= price[0] &&
          r.price <= price[1] &&
          (types.length === 0 || types.includes(r.type)) &&
          (capacity.length === 0 || capacity.includes(r.capacity)) &&
          (amenities.length === 0 || amenities.every((a) => r.amenities.includes(a))),
      ),
    [price, types, capacity, amenities],
  );

  const reset = () => {
    setPrice([3000, 13000]);
    setTypes([]);
    setCapacity([]);
    setAmenities([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-12 pb-6 md:pt-16">
        <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
          ALL ROOMS
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find your seat</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Filter by price, room type, capacity or amenities to find a room that fits your needs.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 self-start rounded-3xl border-2 p-6 bg-card space-y-7 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>
            <button type="button" onClick={reset} className="text-xs text-primary font-bold hover:underline">
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Price range (per month)</Label>
            <Slider min={3000} max={15000} step={500} value={price} onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{price[0].toLocaleString()}</span>
              <span>₹{price[1].toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Room type</Label>
            <div className="space-y-2">
              {ROOM_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
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
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={capacity.includes(c)} onCheckedChange={() => toggleNum(capacity, c, setCapacity)} />
                  {c} {c === 1 ? "guest" : "guests"}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Amenities</Label>
            <div className="space-y-2 max-h-56 overflow-auto pr-1">
              {AMENITY_LIST.map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggle(amenities, a, setAmenities)} />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span> rooms match your filters
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed p-16 text-center">
              <p className="font-bold mb-2">No rooms match these filters.</p>
              <p className="text-sm text-muted-foreground mb-5">Try widening your price range or removing some filters.</p>
              <Button onClick={reset} className="rounded-full font-bold">
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((r) => (
                <Card
                  key={r.id}
                  className="group overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)] p-0"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {r.badge && (
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0 font-bold rounded-full">
                        {r.badge}
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 rounded-full bg-card/95 backdrop-blur px-3 py-1.5 text-xs font-bold flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {r.capacity}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold">{r.title}</h3>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-primary">₹{r.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">/seat / month</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.desc}</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {r.amenities.slice(0, 4).map((a) => (
                        <li key={a} className="text-[11px] font-semibold rounded-full bg-muted px-2.5 py-1 flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" /> {a}
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-2 gap-2 mt-1">
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
