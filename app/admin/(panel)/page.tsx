"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/site";
import type { Order } from "@/lib/types";

type Overview = {
  products: number;
  orders: number;
  pending: number;
  orderValue: number;
  collected: number;
  newEnquiries: number;
  recentOrders: Order[];
};

export default function Page() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then(async (response) => {
        const body = (await response.json()) as Overview & { error?: string };
        if (!response.ok) throw new Error(body.error ?? "Could not load the dashboard.");
        setData(body);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading the dashboard…</p>;
  const cards = [
    ["Products", String(data.products)],
    ["Orders", String(data.orders)],
    ["Pending", String(data.pending)],
    ["Order value", formatPrice(data.orderValue)],
    ["Collected", formatPrice(data.collected)],
    ["New enquiries", String(data.newEnquiries)],
  ];
  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Order value adds non-cancelled orders. Collected counts only orders marked paid. Sample prices are not company revenue.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-3xl bg-white p-5">
            <p className="text-xs tracking-[0.16em] text-muted uppercase">{label}</p>
            <p className="mt-2 font-serif text-3xl">{value}</p>
          </article>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-3xl">Recent orders</h2>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr><th className="px-4 py-3">Order</th><th>Customer</th><th>Status</th><th>Payment</th><th>Total</th></tr>
          </thead>
          <tbody>
            {data.recentOrders.length === 0 ? (
              <tr><td className="px-4 py-6 text-muted" colSpan={5}>No orders yet.</td></tr>
            ) : data.recentOrders.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="underline">{order.id}</Link></td>
                <td>{order.customer.name}</td>
                <td className="capitalize">{order.orderStatus}</td>
                <td className="capitalize">{order.paymentStatus.replace(/_/g, " ")}</td>
                <td>{formatPrice(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
