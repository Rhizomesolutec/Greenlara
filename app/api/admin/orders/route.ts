import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ orders: (await readStore()).orders });
}
