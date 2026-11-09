import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/store";
import { clean, validEmail } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = clean(body?.email, 120).toLowerCase();
  if (!validEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  await updateStore((store) => {
    if (!store.subscribers.includes(email)) store.subscribers.push(email);
  });
  return NextResponse.json({ ok: true });
}
