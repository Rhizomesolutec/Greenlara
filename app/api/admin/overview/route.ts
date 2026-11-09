import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { readStore } from "@/lib/store";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const store = await readStore();
  const open = store.orders.filter((order) => order.orderStatus !== "cancelled");
  return NextResponse.json({
    products: store.products.length,
    categories: store.categories.length,
    orders: store.orders.length,
    pending: store.orders.filter((order) => order.orderStatus === "placed" || order.orderStatus === "confirmed").length,
    orderValue: open.reduce((sum, order) => sum + order.total, 0),
    collected: open.filter((order) => order.paymentStatus === "paid").reduce((sum, order) => sum + order.total, 0),
    newEnquiries: store.enquiries.filter((enquiry) => enquiry.status === "new").length,
    recentOrders: store.orders.slice(0, 6),
  });
}
