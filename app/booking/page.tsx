"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, ShieldCheck, Calendar, Users, Check } from "lucide-react";
import { ROOMS } from "@/lib/rooms-data";

function BookingForm() {
  const searchParams = useSearchParams();
  const roomIdFromQuery = searchParams.get("roomId") ?? undefined;
  const [selectedId, setSelectedId] = useState(roomIdFromQuery ?? ROOMS[0].id);
  const [months, setMonths] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const room = useMemo(() => ROOMS.find((r) => r.id === selectedId) ?? ROOMS[0], [selectedId]);
  const subtotal = room.price * months;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room.id,
          months,
          fullName: String(fd.get("fullName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          moveIn: String(fd.get("moveIn") ?? ""),
        }),
      });
      const data = (await res.json()) as { url: string | null; error: string | null };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Could not start checkout. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-12 pb-6 md:pt-16">
        <Badge variant="outline" className="rounded-full border-primary/30 text-primary font-bold mb-4">
          BOOKING
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Complete your booking</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Review your selection, share your details, and pay securely with Stripe.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-24 grid gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="rounded-3xl border-2 p-7 space-y-5">
            <h2 className="font-extrabold text-xl">1. Choose your room</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-bold mb-2 block">Room</Label>
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger className="rounded-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title} — ₹{r.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-bold mb-2 block">Duration (months)</Label>
                <Select value={String(months)} onValueChange={(v) => setMonths(Number(v))}>
                  <SelectTrigger className="rounded-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 6, 12].map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} {m === 1 ? "month" : "months"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-2 p-7 space-y-5">
            <h2 className="font-extrabold text-xl">2. Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm font-bold mb-2 block">Full name</Label>
                <Input name="fullName" required maxLength={80} placeholder="Aarav Mehta" />
              </div>
              <div>
                <Label className="text-sm font-bold mb-2 block">Email</Label>
                <Input name="email" type="email" required maxLength={120} placeholder="you@email.com" />
              </div>
              <div>
                <Label className="text-sm font-bold mb-2 block">Phone</Label>
                <Input name="phone" type="tel" required maxLength={20} placeholder="+91 90000 00000" />
              </div>
              <div>
                <Label className="text-sm font-bold mb-2 block">Move-in date</Label>
                <Input name="moveIn" type="date" required />
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-2 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-xl">3. Payment</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Secured by Stripe
              </div>
            </div>

            <div className="rounded-2xl border-2 border-dashed p-6 bg-muted/30 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <CreditCard className="h-5 w-5 text-primary" /> Card details
              </div>
              <p className="text-sm text-muted-foreground">
                For your security, card details are entered on Stripe&apos;s hosted checkout page. After clicking{" "}
                <span className="font-semibold text-foreground">&quot;Pay Now&quot;</span>, you&apos;ll be redirected to a secure Stripe checkout to complete your payment.
              </p>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px_120px] pt-1 opacity-60 pointer-events-none">
                <Input placeholder="1234 1234 1234 1234" disabled />
                <Input placeholder="MM / YY" disabled />
                <Input placeholder="CVC" disabled />
              </div>
            </div>

            {error && <div className="rounded-xl bg-destructive/10 text-destructive text-sm p-3 font-medium">{error}</div>}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]"
            >
              {submitting ? "Starting checkout…" : `Pay ₹${total.toLocaleString()} & Confirm Booking`}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By confirming, you agree to our terms and house rules. You won&apos;t be charged until you complete the Stripe checkout page.
            </p>
          </Card>
        </form>

        <aside className="lg:sticky lg:top-20 self-start space-y-5">
          <Card className="rounded-3xl border-2 overflow-hidden p-0">
            <img src={room.img} alt={room.title} className="h-44 w-full object-cover" />
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg">{room.title}</h3>
                <div className="text-xs text-muted-foreground">{room.type}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> {room.capacity} guests
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {months} mo
                </span>
              </div>
              <ul className="space-y-1.5">
                {room.amenities.slice(0, 4).map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /> {a}
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes (18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-3xl border-2 p-5 bg-muted/30 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Free cancellation up to 7 days before move-in. Zero brokerage. Refunds processed within 5 business days.
            </p>
          </div>

          <Link href="/rooms" className="text-sm text-primary font-bold hover:underline block text-center">
            ← Browse other rooms
          </Link>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BookingForm />
    </Suspense>
  );
}
