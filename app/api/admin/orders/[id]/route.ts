import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { updateStore } from "@/lib/store";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const orderStatuses: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["pay_on_delivery", "awaiting_gateway", "paid", "failed", "cancelled"];

export async function GET(request: NextRequest, context: RouteContext<"/api/admin/orders/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const { readStore } = await import("@/lib/store");
  const order = (await readStore()).orders.find((item) => item.id === id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/orders/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus } | null;
  if (!body) return NextResponse.json({ error: "Missing update." }, { status: 400 });
  const updated = await updateStore((store) => {
    const order = store.orders.find((item) => item.id === id);
    if (!order) return { error: "Order not found." };
    const nextStatus = body.orderStatus ?? order.orderStatus;
    const nextPayment = body.paymentStatus ?? order.paymentStatus;
    if (!orderStatuses.includes(nextStatus) || !paymentStatuses.includes(nextPayment)) {
      return { error: "Unknown status." };
    }
    const cancelling = nextStatus === "cancelled" && order.orderStatus !== "cancelled";
    const reopening = order.orderStatus === "cancelled" && nextStatus !== "cancelled";
    if (cancelling && order.stockAdjusted) {
      for (const line of order.items) {
        const weight = store.products
          .find((product) => product.id === line.productId)
          ?.weights.find((item) => item.label === line.weightLabel);
        if (weight) weight.stock += line.qty;
      }
      order.stockAdjusted = false;
    }
    if (reopening) {
      for (const line of order.items) {
        const weight = store.products
          .find((product) => product.id === line.productId)
          ?.weights.find((item) => item.label === line.weightLabel);
        if (!weight || weight.stock < line.qty) {
          return { error: "Not enough stock to reopen this order." };
        }
      }
      for (const line of order.items) {
        const weight = store.products
          .find((product) => product.id === line.productId)
          ?.weights.find((item) => item.label === line.weightLabel);
        if (weight) weight.stock -= line.qty;
      }
      order.stockAdjusted = true;
    }
    order.orderStatus = nextStatus;
    order.paymentStatus = nextPayment;
    if (nextPayment === "paid") {
      order.paymentMessage = "Marked paid by an administrator after payment was received.";
    }
    return { order };
  });
  if ("error" in updated) {
    return NextResponse.json(updated, { status: updated.error === "Order not found." ? 404 : 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}
