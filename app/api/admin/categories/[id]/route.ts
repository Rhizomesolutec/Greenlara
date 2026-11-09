import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readCategoryInput } from "@/lib/product-input";
import { updateStore } from "@/lib/store";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/categories/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Missing category." }, { status: 400 });
  const updated = await updateStore((store) => {
    const index = store.categories.findIndex((item) => item.id === id);
    if (index < 0) return { error: "Category not found." };
    const parsed = readCategoryInput(body, store.categories, id);
    if ("error" in parsed) return parsed;
    store.categories[index] = parsed.category;
    return { category: parsed.category };
  });
  if ("error" in updated) {
    return NextResponse.json(updated, { status: updated.error === "Category not found." ? 404 : 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, context: RouteContext<"/api/admin/categories/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const removed = await updateStore((store) => {
    if (store.products.some((product) => product.categoryId === id)) {
      return { error: "Move or delete the products in this category first." };
    }
    const before = store.categories.length;
    store.categories = store.categories.filter((item) => item.id !== id);
    if (store.categories.length === before) return { error: "Category not found." };
    return { ok: true };
  });
  if ("error" in removed) {
    return NextResponse.json(removed, { status: removed.error === "Category not found." ? 404 : 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
