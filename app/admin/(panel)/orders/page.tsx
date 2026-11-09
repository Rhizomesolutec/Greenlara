"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/site";
import type { Order } from "@/lib/types";

export default function Page() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/orders")
      .then(async (response) => {
        const body = (await response.json()) as { orders?: Order[]; error?: string };
        if (!response.ok || !body.orders) throw new Error(body.error ?? "Could not load orders.");
        setOrders(body.orders);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);
  return (
    <div>
      <h1 className="font-serif text-4xl">Orders</h1>
      {error ? <p className="mt-3 text-sm">{error}</p> : null}
      {!orders ? <p className="mt-6">Loading orders…</p> : (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr><th className="px-4 py-3">Order</th><th>Customer</th><th>City</th><th>Status</th><th>Payment</th><th>Total</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? <tr><td className="px-4 py-6" colSpan={6}>No orders yet.</td></tr> : orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-4 py-3"><Link className="underline" href={`/admin/orders/${order.id}`}>{order.id}</Link></td>
                  <td>{order.customer.name}<br /><span className="text-muted">{order.customer.email}</span></td>
                  <td>{order.customer.city}</td>
                  <td className="capitalize">{order.orderStatus}</td>
                  <td className="capitalize">{order.paymentStatus.replace(/_/g, " ")}</td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
