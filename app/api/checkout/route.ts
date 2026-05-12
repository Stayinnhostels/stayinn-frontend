import { NextResponse } from "next/server";
import { createCheckoutSessionPayload } from "@/lib/create-checkout-session";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const res = await createCheckoutSessionPayload(body);
    return NextResponse.json(res);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { url: null, error: e instanceof Error ? e.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
