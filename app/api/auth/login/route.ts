import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  adminConfigured,
  createSessionToken,
  sessionCookieName,
  sessionMaxAge,
} from "@/lib/session";

function matches(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET." },
      { status: 503 },
    );
  }
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const expectedEmail = String(process.env.ADMIN_EMAIL).trim().toLowerCase();
  const expectedPassword = String(process.env.ADMIN_PASSWORD);
  if (!matches(email, expectedEmail) || !matches(password, expectedPassword)) {
    return NextResponse.json({ error: "Those details do not match." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: sessionCookieName(),
    value: await createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge(),
  });
  return response;
}
