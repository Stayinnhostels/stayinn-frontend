import { z } from "zod";
import { ROOMS } from "@/lib/rooms-data";

const inputSchema = z.object({
  roomId: z.string().min(1).max(64),
  months: z.number().int().min(1).max(24),
  fullName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(5).max(20),
  moveIn: z.string().min(1).max(20),
});

export async function createCheckoutSessionPayload(
  input: unknown,
): Promise<{ url: string | null; error: string | null }> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { url: null, error: parsed.error.flatten().formErrors.join(" ") || "Invalid input." };
  }
  const data = parsed.data;

  const room = ROOMS.find((r) => r.id === data.roomId);
  if (!room) {
    return { url: null, error: "Selected room is no longer available." };
  }

  const subtotal = room.price * data.months;
  const total = Math.round(subtotal * 1.18);

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return {
      url: null,
      error:
        "Stripe is not configured yet. Add STRIPE_SECRET_KEY in project secrets to enable live checkout.",
    };
  }

  const origin =
    process.env.PUBLIC_APP_URL ??
    process.env.STRIPE_SUCCESS_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${origin}/booking?status=success`);
  params.append("cancel_url", `${origin}/booking?status=cancelled`);
  params.append("customer_email", data.email);
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "inr");
  params.append("line_items[0][price_data][unit_amount]", String(total * 100));
  params.append(
    "line_items[0][price_data][product_data][name]",
    `${room.title} — ${data.months} month(s)`,
  );
  params.append(
    "line_items[0][price_data][product_data][description]",
    `Stay Inn booking for ${data.fullName} · move-in ${data.moveIn}`,
  );
  params.append("metadata[roomId]", room.id);
  params.append("metadata[months]", String(data.months));
  params.append("metadata[fullName]", data.fullName);
  params.append("metadata[phone]", data.phone);
  params.append("metadata[moveIn]", data.moveIn);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Stripe checkout error:", text);
    return { url: null, error: "Could not start Stripe checkout. Please try again." };
  }

  const session = (await res.json()) as { url?: string };
  return { url: session.url ?? null, error: null };
}
