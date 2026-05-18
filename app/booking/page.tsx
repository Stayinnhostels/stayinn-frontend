"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
import { MessageCircle, Phone, Calendar, Users, Check, Loader2, Minus, Plus } from "lucide-react";
import { fetchRooms, formatSeatsFree, type MarketingRoom } from "@/lib/rooms-api";
import { createBookingApi, type BookingContact, type BookingResult } from "@/lib/bookings-api";
import { formatPhoneForDisplay, resolvePropertyContact } from "@/lib/property-contact";

function BookingForm() {
  const searchParams = useSearchParams();
  const roomIdFromQuery = searchParams.get("roomId") ?? undefined;

  const [rooms, setRooms] = useState<MarketingRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [seats, setSeats] = useState(1);
  const [months, setMonths] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ booking: BookingResult; contact: BookingContact } | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingRooms(true);
      try {
        const list = await fetchRooms({ limit: 100 });
        setRooms(list);
        const initial = roomIdFromQuery && list.some((r) => r.id === roomIdFromQuery) ? roomIdFromQuery : list[0]?.id ?? "";
        setSelectedId(initial);
        const room = list.find((r) => r.id === initial);
        if (room) setSeats(1);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load rooms");
      } finally {
        setLoadingRooms(false);
      }
    })();
  }, [roomIdFromQuery]);

  const room = useMemo(() => rooms.find((r) => r.id === selectedId), [rooms, selectedId]);

  useEffect(() => {
    if (room) setSeats((s) => Math.min(Math.max(1, s), room.beds_available));
  }, [room?.id, room?.beds_available]);

  const subtotal = room ? room.price * seats * months : 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    try {
      const result = await createBookingApi({
        room_id: room.id,
        seats_booked: seats,
        months,
        move_in: String(fd.get("moveIn") ?? ""),
        guest_name: String(fd.get("fullName") ?? ""),
        guest_email: String(fd.get("email") ?? ""),
        guest_phone: String(fd.get("phone") ?? ""),
        notes: String(fd.get("notes") ?? "") || undefined,
      });
      setSuccess({ booking: result.booking, contact: result.contact });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const { booking, contact: apiContact } = success;
    const contact = resolvePropertyContact(apiContact);
    const phoneDisplay = contact.phone ? formatPhoneForDisplay(contact.phone) : null;
    const hasContact = Boolean(contact.whatsapp_url || contact.phoneTel);

    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <section className="container mx-auto max-w-xl px-4 py-16 md:py-20">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Booking request sent</h1>
            <p className="mt-3 text-muted-foreground">
              {booking.seats_booked} seat(s) in <strong className="text-foreground">{booking.room_title}</strong> · ₹
              {booking.total_amount.toLocaleString("en-IN")} for {booking.months} month(s)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Move-in: {booking.move_in} · Reference #{booking.id.slice(-8).toUpperCase()}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              We&apos;ve also sent a confirmation email to{" "}
              <strong className="text-foreground">{booking.guest_email}</strong>.
            </p>
          </div>

          <Card className="mt-8 overflow-hidden rounded-3xl border-2 border-primary/25 shadow-[var(--shadow-card)]">
            <div className="bg-[image:var(--gradient-hero)] px-6 py-4 text-center text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">Action required</p>
              <p className="mt-1 text-lg font-extrabold">Contact us to confirm your booking</p>
            </div>
            <CardContent className="space-y-5 p-6">
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Your booking is <strong className="text-foreground">pending</strong> until we hear from you. No online
                payment was taken — please message or call using the details below so we can confirm your seat(s).
              </p>

              {hasContact ? (
                <div className="space-y-3">
                  {contact.whatsapp_url && contact.whatsappDisplay && (
                    <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">WhatsApp</p>
                          <p className="mt-0.5 text-xl font-extrabold tracking-tight text-foreground">
                            {contact.whatsappDisplay}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">Tap to open chat with your booking details</p>
                        </div>
                      </div>
                      <Button asChild className="mt-4 w-full rounded-full bg-emerald-600 font-bold hover:bg-emerald-700" size="lg">
                        <a href={contact.whatsapp_url} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-5 w-5" /> Message on WhatsApp
                        </a>
                      </Button>
                    </div>
                  )}

                  {phoneDisplay && contact.phoneTel && (
                    <div className="rounded-2xl border-2 border-primary/20 bg-muted/40 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-primary">Phone / call</p>
                          <p className="mt-0.5 text-xl font-extrabold tracking-tight text-foreground">{phoneDisplay}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Call {contact.name} to confirm booking #{booking.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="mt-4 w-full rounded-full border-2 font-bold" size="lg">
                        <a href={`tel:${contact.phoneTel}`}>
                          <Phone className="h-5 w-5" /> Call {phoneDisplay}
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl border-2 border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                  Contact numbers are not configured yet. Please check your confirmation email or visit the{" "}
                  <Link href="/contact" className="font-bold text-primary underline">
                    contact page
                  </Link>
                  .
                </p>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button asChild variant="ghost" className="rounded-full font-bold">
              <Link href="/rooms">Browse more rooms</Link>
            </Button>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="container mx-auto px-4 pt-12 pb-6 md:pt-16">
        <Badge variant="outline" className="mb-4 rounded-full border-primary/30 font-bold text-primary">
          BOOKING
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Book your seat(s)</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Choose how many seats you need in a room. Pay nothing online — we&apos;ll confirm via WhatsApp or phone.
        </p>
      </section>

      {loadingRooms ? (
        <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" /> Loading rooms…
        </div>
      ) : !room ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">No rooms available to book right now.</p>
          <Button asChild className="mt-4">
            <Link href="/rooms">View rooms</Link>
          </Button>
        </div>
      ) : (
        <section className="container mx-auto grid gap-8 px-4 pb-24 lg:grid-cols-[1fr_400px]">
          <form onSubmit={onSubmit} className="space-y-6">
            <Card className="space-y-5 rounded-3xl border-2 p-7">
              <h2 className="text-xl font-extrabold">1. Room & seats</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-bold">Room</Label>
                  <Select
                    value={selectedId}
                    onValueChange={(v) => {
                      setSelectedId(v);
                      const r = rooms.find((x) => x.id === v);
                      if (r) setSeats(1);
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.title} — {formatSeatsFree(r.beds_available)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold">Duration (months)</Label>
                  <Select value={String(months)} onValueChange={(v) => setMonths(Number(v))}>
                    <SelectTrigger className="h-11 rounded-full">
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

              <div>
                <Label className="mb-2 block text-sm font-bold">
                  Seats to book (max {room.beds_available} available)
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={seats <= 1}
                    onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center text-2xl font-extrabold">{seats}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={seats >= room.beds_available}
                    onClick={() => setSeats((s) => Math.min(room.beds_available, s + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    of {room.beds_available} free in this room
                  </span>
                </div>
              </div>
            </Card>

            <Card className="space-y-5 rounded-3xl border-2 p-7">
              <h2 className="text-xl font-extrabold">2. Your details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-bold">Full name</Label>
                  <Input name="fullName" required maxLength={80} placeholder="Aarav Mehta" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold">Email</Label>
                  <Input name="email" type="email" required maxLength={120} placeholder="you@email.com" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold">Phone</Label>
                  <Input name="phone" type="tel" required maxLength={20} placeholder="+91 90000 00000" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-bold">Move-in date</Label>
                  <Input name="moveIn" type="date" required />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block text-sm font-bold">Notes (optional)</Label>
                  <Input name="notes" maxLength={500} placeholder="Any special requests" />
                </div>
              </div>
            </Card>

            {error && (
              <div className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting || room.beds_available < 1}
              className="w-full rounded-full font-bold shadow-[var(--shadow-soft)]"
            >
              {submitting ? "Submitting…" : `Request booking · ₹${subtotal.toLocaleString("en-IN")}`}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You won&apos;t be charged online. We&apos;ll share WhatsApp & phone to confirm.
            </p>
          </form>

          <aside className="space-y-5 self-start lg:sticky lg:top-20">
            <Card className="overflow-hidden rounded-3xl border-2 p-0">
              <img src={room.img} alt={room.title} className="h-44 w-full object-cover" />
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-lg font-extrabold">{room.title}</h3>
                  <div className="text-xs text-muted-foreground">{room.type}</div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> {seats} seat(s)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> {months} mo
                  </span>
                </div>
                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ₹{room.price.toLocaleString()} × {seats} seat × {months} mo
                    </span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-extrabold">
                    <span>Total</span>
                    <span className="text-primary">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Link href="/rooms" className="block text-center text-sm font-bold text-primary hover:underline">
              ← Browse other rooms
            </Link>
          </aside>
        </section>
      )}

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
