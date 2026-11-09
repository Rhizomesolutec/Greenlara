import Link from "next/link";
import { Suspense } from "react";
import { OrderLookup } from "@/components/order/OrderLookup";
import { formatPrice } from "@/lib/site";
import { getStore } from "@/lib/store";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading the order…</div>}>
      <OrderScreen params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function OrderScreen({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { id } = await params;
  const email = (await searchParams).email?.trim().toLowerCase() ?? "";
  if (!email) return <OrderLookup id={id} />;
  const store = await getStore();
  const order = store.orders.find(
    (item) => item.id === id && item.customer.email.toLowerCase() === email,
  );
  if (!order) {
    return (
      <div className="container-page py-16">
        <h1 className="font-serif text-4xl">Order not found</h1>
        <p className="mt-4 max-w-lg text-muted">We could not find an order with those details.</p>
        <OrderLookup id={id} />
      </div>
    );
  }
  return (
    <div className="container-page max-w-3xl py-14">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Order {order.id}</p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl">Your order is recorded.</h1>
      <p className="mt-4 rounded-2xl bg-peach px-4 py-3 text-sm leading-6">{order.paymentMessage}</p>
      <dl className="mt-8 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Status</dt><dd className="capitalize">{order.orderStatus}</dd></div>
        <div><dt className="text-muted">Payment</dt><dd className="capitalize">{order.paymentStatus.replace(/_/g, " ")}</dd></div>
        <div><dt className="text-muted">Delivery</dt><dd>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pin}</dd></div>
      </dl>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.weightLabel}`} className="flex justify-between gap-4 py-3 text-sm">
            <span>{item.name} · {item.weightLabel} × {item.qty}</span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 text-sm">
        <p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></p>
        <p className="flex justify-between"><span>Delivery</span><span>{formatPrice(order.delivery)}</span></p>
        <p className="flex justify-between text-base"><span>Total</span><span>{formatPrice(order.total)}</span></p>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">{order.pricingNote} {order.deliveryNote}</p>
      <Link href="/shop" className="btn btn-dark mt-8">Continue shopping</Link>
    </div>
  );
}
