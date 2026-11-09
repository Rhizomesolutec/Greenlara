import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, verifySessionToken } from "./session";

export async function requireAdmin(request: NextRequest) {
  const ok = await verifySessionToken(request.cookies.get(sessionCookieName())?.value);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
