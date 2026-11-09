import { NextRequest, NextResponse } from "next/server";
import { adminConfigured, sessionCookieName, verifySessionToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const authenticated = await verifySessionToken(request.cookies.get(sessionCookieName())?.value);
  return NextResponse.json({ authenticated, configured: adminConfigured() });
}
