import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readProductInput } from "@/lib/product-input";
import { readStore, updateStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const store = await readStore();
  return NextResponse.json({ products: store.products, categories: store.categories });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing product." }, { status: 400 });
  const created = await updateStore((store) => {
    const parsed = readProductInput(body, store);
    if ("error" in parsed) return parsed;
    store.products.unshift(parsed.product);
    return { product: parsed.product };
  });
  if ("error" in created) return NextResponse.json(created, { status: 400 });
  revalidatePath("/", "layout");
  return NextResponse.json(created);
}
