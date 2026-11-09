import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readProductInput } from "@/lib/product-input";
import { readStore, updateStore } from "@/lib/store";

export async function GET(request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const store = await readStore();
  const product = store.products.find((item) => item.id === id);
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product, categories: store.categories });
}

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing product." }, { status: 400 });
  const updated = await updateStore((store) => {
    const index = store.products.findIndex((item) => item.id === id);
    if (index < 0) return { error: "Product not found." };
    const parsed = readProductInput(body, store, id);
    if ("error" in parsed) return parsed;
    store.products[index] = parsed.product;
    return { product: parsed.product };
  });
  if ("error" in updated) {
    return NextResponse.json(updated, { status: updated.error === "Product not found." ? 404 : 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const removed = await updateStore((store) => {
    const before = store.products.length;
    store.products = store.products.filter((item) => item.id !== id);
    return { ok: store.products.length < before };
  });
  if (!removed.ok) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
