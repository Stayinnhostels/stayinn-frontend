"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Check } from "lucide-react";
import { useCurrency } from "@/components/currency-provider";
import { useSiteSettings } from "@/components/site-settings-provider";
import { RoomsFiltersSidebar } from "@/components/rooms-filters-sidebar";
import { RoomsPageSkeleton } from "@/components/rooms-page-skeleton";
import { normalizeRoomsFilterBounds } from "@/lib/rooms-filter";
import {
  AMENITY_LIST,
  ROOM_TYPES,
  fetchRooms,
  formatSeatsFree,
  type MarketingRoom,
} from "@/lib/rooms-api";

const CAPACITY_OPTIONS = [1, 2, 3, 4] as const;
const RESULTS_SCROLL_OFFSET = 88;

export default function RoomsPage() {
  const { roomsFilterMinPrice, roomsFilterMaxPrice } = useSiteSettings();
  const settingsBounds = useMemo(
    () => normalizeRoomsFilterBounds(roomsFilterMinPrice, roomsFilterMaxPrice),
    [roomsFilterMinPrice, roomsFilterMaxPrice],
  );
  const { currency, formatPrice, ready } = useCurrency();
  const [rooms, setRooms] = useState<MarketingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [priceBounds, setPriceBounds] = useState<[number, number]>(settingsBounds);
  const [price, setPrice] = useState<[number, number]>(settingsBounds);
  const [types, setTypes] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const skipResultsScrollRef = useRef(true);
  const [priceScrollToken, setPriceScrollToken] = useState(0);

  function scrollResultsIntoView() {
    const el = resultsRef.current;
    if (!el || typeof window === "undefined") return;
    const top = el.getBoundingClientRect().top + window.scrollY - RESULTS_SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }

  useEffect(() => {
    setPriceBounds(settingsBounds);
    setPrice(settingsBounds);
  }, [settingsBounds]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const list = await fetchRooms({ limit: 100, currency });
        if (!cancelled) {
          setRooms(list);
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
  }, [currency, ready]);

  const toggleType = (v: string) =>
    setTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const toggleCapacity = (v: number) =>
    setCapacity((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  const toggleAmenity = (v: string) =>
    setAmenities((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (types.length > 0) count += 1;
    if (capacity.length > 0) count += 1;
    if (amenities.length > 0) count += 1;
    if (price[0] !== priceBounds[0] || price[1] !== priceBounds[1]) count += 1;
    return count;
  }, [types, capacity, amenities, price, priceBounds]);

  useLayoutEffect(() => {
    if (loading || skipResultsScrollRef.current) {
      skipResultsScrollRef.current = false;
      return;
    }
    scrollResultsIntoView();
  }, [types, capacity, amenities, priceScrollToken, loading]);

  const reset = () => {
    setPrice(priceBounds);
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
          Filter rooms and book one or more seats.
        </p>
      </section>

      <section className="container mx-auto grid gap-8 px-4 pb-20 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
        <RoomsFiltersSidebar
          formatPrice={formatPrice}
          price={price}
          priceBounds={priceBounds}
          onPriceChange={setPrice}
          onPriceCommit={() => setPriceScrollToken((n) => n + 1)}
          roomTypes={ROOM_TYPES}
          types={types}
          onToggleType={toggleType}
          capacityOptions={CAPACITY_OPTIONS}
          capacity={capacity}
          onToggleCapacity={toggleCapacity}
          amenities={AMENITY_LIST}
          selectedAmenities={amenities}
          onToggleAmenity={toggleAmenity}
          onReset={reset}
          activeFilterCount={activeFilterCount}
        />

        <div ref={resultsRef} className="scroll-mt-24 [overflow-anchor:none]">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="inline-block h-4 w-36" />
              ) : (
                <>
                  <span className="font-bold text-foreground">{filtered.length}</span> rooms match your filters
                </>
              )}
            </div>
          </div>

          {loading ? (
            <RoomsPageSkeleton count={4} />
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
            <div className="grid gap-6 sm:grid-cols-2 [overflow-anchor:none]">
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
                        <div className="text-xl font-extrabold text-primary">{formatPrice(r.price)}</div>
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
