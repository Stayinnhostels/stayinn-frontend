"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, Users } from "lucide-react";
import { useCurrency } from "@/components/currency-provider";
import { fetchRooms, formatSeatsFree, type MarketingRoom } from "@/lib/rooms-api";

export function FeaturedRoomsSection() {
  const { currency, formatPrice, ready } = useCurrency();
  const [rooms, setRooms] = useState<MarketingRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchRooms({ limit: 12, currency });
        if (!cancelled) setRooms(list);
      } catch {
        if (!cancelled) setRooms([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currency, ready]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" /> Loading available rooms…
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed py-16 text-center">
        <p className="font-bold">No seats available right now</p>
        <p className="mt-2 text-sm text-muted-foreground">Check back soon — rooms reappear when seats open up.</p>
        <Button asChild variant="outline" className="mt-6 rounded-full font-bold">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((r) => (
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
                <h3 className="text-2xl font-extrabold">{r.title}</h3>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.type}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-primary">{formatPrice(r.price)}</div>
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
            <div className="grid grid-cols-2 gap-2 pt-1">
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
  );
}
