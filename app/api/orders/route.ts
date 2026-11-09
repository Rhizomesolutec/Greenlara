import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { buildQuote } from "@/lib/catalog";
import { updateStore } from "@/lib/store";
import type { CustomerDetails, Order, PaymentMethod } from "@/lib/types";
import { clean, isPaymentMethod, paymentPlan, validEmail, validPhone, validPin } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    customer?: Partial<CustomerDetails>;
    paymentMethod?: string;
    items?: { productId: string; weightLabel: string; qty: number }[];
  } | null;
  if (!body || !Array.isArray(body.items) || !body.customer || !body.paymentMethod) {
    return NextResponse.json({ error: "The order is incomplete." }, { status: 400 });
  }
  if (!isPaymentMethod(body.paymentMethod)) {
    return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });
  }
  const customer: CustomerDetails = {
    name: clean(body.customer.name, 80),
    phone: clean(body.customer.phone, 10),
    email: clean(body.customer.email, 120).toLowerCase(),
    address: clean(body.customer.address, 240),
    city: clean(body.customer.city, 80),
    state: clean(body.customer.state, 80),
    pin: clean(body.customer.pin, 6),
  };
  if (customer.name.length < 2 || customer.address.length < 5 || customer.city.length < 2 || customer.state.length < 2) {
    return NextResponse.json({ error: "Add the full delivery details." }, { status: 400 });
  }
  if (!validPhone(customer.phone) || !validEmail(customer.email) || !validPin(customer.pin)) {
    return NextResponse.json({ error: "Check the mobile number, email, and PIN code." }, { status: 400 });
  }
  const method = body.paymentMethod as PaymentMethod;
  const result = await updateStore((store) => {
    const quote = buildQuote(store, body.items ?? []);
    if (quote.errors.length > 0 || quote.lines.length === 0) {
      return { error: quote.errors[0] ?? "The cart could not be priced." };
    }
    for (const line of quote.lines) {
      const product = store.products.find((item) => item.id === line.productId);
      const weight = product?.weights.find((item) => item.label === line.weightLabel);
      if (weight) weight.stock -= line.qty;
    }
    const plan = paymentPlan(method);
    const order: Order = {
      id: `GT${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer,
      items: quote.lines,
      subtotal: quote.subtotal,
      delivery: quote.delivery,
      total: quote.total,
      deliveryNote: quote.deliveryNote,
      pricingNote: quote.pricingNote,
      paymentMethod: method,
      paymentStatus: plan.paymentStatus,
      orderStatus: "placed",
      paymentMessage: plan.paymentMessage,
      stockAdjusted: true,
    };
    store.orders.unshift(order);
    return { order };
  });
  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ order: result.order });
}
