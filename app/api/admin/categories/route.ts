import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readCategoryInput } from "@/lib/product-input";
import { readStore, updateStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ categories: (await readStore()).categories });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing category." }, { status: 400 });
  const created = await updateStore((store) => {
    const parsed = readCategoryInput(body, store.categories);
    if ("error" in parsed) return parsed;
    store.categories.push(parsed.category);
    return { category: parsed.category };
  });
  if ("error" in created) return NextResponse.json(created, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json(created);
}
