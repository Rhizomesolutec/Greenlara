"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatPrice } from "@/lib/site";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const orderStatuses: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["pay_on_delivery", "awaiting_gateway", "paid", "failed", "cancelled"];

function OrderEditor() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/admin/orders/${params.id}`)
      .then(async (response) => {
        const body = (await response.json()) as { order?: Order; error?: string };
        if (!response.ok || !body.order) throw new Error(body.error ?? "Order not found.");
        setOrder(body.order);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [params.id]);

  async function save() {
    if (!order) return;
    setSaving(true);
    setError("");
    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: order.orderStatus, paymentStatus: order.paymentStatus }),
    });
    const body = (await response.json()) as { order?: Order; error?: string };
    setSaving(false);
    if (!response.ok || !body.order) {
      setError(body.error ?? "Could not update the order.");
      return;
    }
    setOrder(body.order);
  }

  if (error && !order) return <p>{error}</p>;
  if (!order) return <p>Loading order…</p>;
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{order.id}</h1>
      <p className="mt-2 text-sm text-muted">{order.paymentMessage}</p>
      <div className="mt-6 rounded-3xl bg-white p-5 text-sm leading-6">
        <p>{order.customer.name} · {order.customer.phone}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pin}</p>
      </div>
      <ul className="mt-4 divide-y divide-line rounded-3xl bg-white px-5">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.weightLabel}`} className="flex justify-between py-3 text-sm">
            <span>{item.name} · {item.weightLabel} × {item.qty}</span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">Total {formatPrice(order.total)} · {order.pricingNote}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Order status
          <select className="field" value={order.orderStatus} onChange={(event) => setOrder({ ...order, orderStatus: event.target.value as OrderStatus })}>
            {orderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Payment status
          <select className="field" value={order.paymentStatus} onChange={(event) => setOrder({ ...order, paymentStatus: event.target.value as PaymentStatus })}>
            {paymentStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, " ")}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">Mark paid only after the money has actually been received. Cancelling an order returns reserved stock.</p>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      <button type="button" className="btn btn-dark mt-4" disabled={saving} onClick={save}>{saving ? "Saving…" : "Update order"}</button>
    </div>
  );
}

export default function Page() {
  return <OrderEditor />;
}
