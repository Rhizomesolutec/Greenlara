import { NextRequest, NextResponse } from "next/server";
import { buildQuote } from "@/lib/catalog";
import { readStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { items?: unknown } | null;
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Send the cart items to price." }, { status: 400 });
  }
  const quote = buildQuote(await readStore(), body.items as { productId: string; weightLabel: string; qty: number }[]);
  return NextResponse.json(quote);
}
