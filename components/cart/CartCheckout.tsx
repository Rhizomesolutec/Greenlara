"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderItem, PaymentMethod } from "@/lib/types";
import { brand, formatPrice, states } from "@/lib/site";
import { useCart } from "@/components/site/Providers";

type Quote = {
  lines: OrderItem[];
  errors: string[];
  subtotal: number;
  delivery: number;
  total: number;
  pricingNote: string;
  deliveryNote: string;
};

export function useQuote() {
  const { items, ready } = useCart();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (items.length === 0) {
      setQuote(null);
      return;
    }
    let active = true;
    setLoading(true);
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.productId,
          weightLabel: item.weightLabel,
          qty: item.qty,
        })),
      }),
    })
      .then((response) => response.json())
      .then((data: Quote) => {
        if (active) setQuote(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [items, ready]);

  return { quote, loading, ready, items };
}

function Summary({ quote, loading }: { quote: Quote | null; loading: boolean }) {
  if (loading || !quote) return <p className="text-sm text-muted">Checking current sample prices…</p>;
  return (
    <div className="space-y-3 text-sm">
      {quote.errors.map((error) => (
        <p key={error} className="rounded-2xl bg-peach px-3 py-2">{error}</p>
      ))}
      <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(quote.subtotal)}</span></div>
      <div className="flex justify-between"><span>Delivery</span><span>{quote.delivery === 0 ? "Sample free" : formatPrice(quote.delivery)}</span></div>
      <div className="flex justify-between border-t border-line pt-3 text-base"><span>Total</span><span>{formatPrice(quote.total)}</span></div>
      <p className="text-xs leading-5 text-muted">{quote.pricingNote} {quote.deliveryNote}</p>
    </div>
  );
}

export function CartView() {
  const { items, ready, updateQty, updateWeight, removeItem } = useCart();
  const { quote, loading } = useQuote();
  if (!ready) return <div className="container-page py-20">Loading your cart…</div>;
  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-serif text-4xl md:text-6xl">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 max-w-lg rounded-[1.6rem] bg-white p-8">
          <p className="font-serif text-3xl">The cart is empty.</p>
          <p className="mt-3 text-sm leading-6 text-muted">Add a grain when you are ready. Sample prices are confirmed again at checkout.</p>
          <Link href="/shop" className="btn btn-dark mt-6">Explore Products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={`${item.productId}-${item.weightLabel}`} className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-[1.4rem] bg-white p-4 sm:grid-cols-[7rem_1fr_auto]">
                <Link href={`/product/${item.slug}`} className="relative h-24 overflow-hidden rounded-2xl bg-sand sm:h-28">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="112px" />
                </Link>
                <div>
                  <Link href={`/product/${item.slug}`} className="font-serif text-2xl">{item.name}</Link>
                  <label className="mt-3 grid max-w-40 gap-1 text-xs text-muted">
                    Package
                    <select className="field" value={item.weightLabel} onChange={(event) => updateWeight(item.productId, item.weightLabel, event.target.value)}>
                      {item.weights.map((weight) => (
                        <option key={weight.label}>{weight.label}</option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" className="h-8 w-8 rounded-full bg-sand" onClick={() => updateQty(item.productId, item.weightLabel, item.qty - 1)} aria-label="Decrease">−</button>
                    <span>{item.qty}</span>
                    <button type="button" className="h-8 w-8 rounded-full bg-sand" onClick={() => updateQty(item.productId, item.weightLabel, item.qty + 1)} aria-label="Increase">+</button>
                    <button type="button" className="text-sm underline" onClick={() => removeItem(item.productId, item.weightLabel)}>Remove</button>
                  </div>
                </div>
                <p className="text-sm sm:text-right">
                  {quote?.lines.find((line) => line.productId === item.productId && line.weightLabel === item.weightLabel)
                    ? formatPrice(quote.lines.find((line) => line.productId === item.productId && line.weightLabel === item.weightLabel)!.lineTotal)
                    : "—"}
                </p>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-[1.5rem] bg-white p-6">
            <h2 className="font-serif text-2xl">Summary</h2>
            <div className="mt-4"><Summary quote={quote} loading={loading} /></div>
            <Link href="/checkout" className={`btn btn-dark mt-6 w-full ${quote && quote.errors.length === 0 && quote.lines.length > 0 ? "" : "pointer-events-none opacity-40"}`}>
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const { quote, loading } = useQuote();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("cod");

  if (!ready) return <div className="container-page py-20">Loading checkout…</div>;
  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-dark mt-6">Return to shop</Link>
      </div>
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quote || quote.errors.length || quote.lines.length === 0) return;
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          address: form.get("address"),
          city: form.get("city"),
          state: form.get("state"),
          pin: form.get("pin"),
        },
        paymentMethod: method,
        items: items.map((item) => ({
          productId: item.productId,
          weightLabel: item.weightLabel,
          qty: item.qty,
        })),
      }),
    });
    const data = (await response.json()) as { error?: string; order?: { id: string; customer: { email: string } } };
    setSending(false);
    if (!response.ok || !data.order) {
      setError(data.error ?? "The order could not be placed.");
      return;
    }
    clear();
    router.push(`/order/${data.order.id}?email=${encodeURIComponent(data.order.customer.email)}`);
  }

  const methods: { id: PaymentMethod; label: string; note: string }[] = [
    { id: "cod", label: "Cash on delivery", note: "Pay when the order arrives." },
    { id: "upi", label: "UPI", note: "Gateway not connected. No payment is taken." },
    { id: "card", label: "Card", note: "Gateway not connected. No payment is taken." },
    { id: "netbanking", label: "Net banking", note: "Gateway not connected. No payment is taken." },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-serif text-4xl md:text-6xl">Checkout</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">{brand.pricingNote}</p>
      <form onSubmit={onSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4 rounded-[1.6rem] bg-white p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">Name<input name="name" required className="field" autoComplete="name" /></label>
            <label className="grid gap-1 text-sm">Mobile number<input name="phone" required pattern="[0-9]{10}" className="field" placeholder="10 digits" /></label>
          </div>
          <label className="grid gap-1 text-sm">Email<input name="email" type="email" required className="field" autoComplete="email" /></label>
          <label className="grid gap-1 text-sm">Delivery address<textarea name="address" required rows={3} className="field" /></label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">State
              <select name="state" required className="field" defaultValue="">
                <option value="" disabled>Select</option>
                {states.map((state) => <option key={state}>{state}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">City<input name="city" required className="field" /></label>
            <label className="grid gap-1 text-sm">PIN code<input name="pin" required pattern="[0-9]{6}" className="field" /></label>
          </div>
          <fieldset className="grid gap-2 pt-2">
            <legend className="text-sm">Payment method</legend>
            {methods.map((item) => (
              <label key={item.id} className={`rounded-2xl border px-4 py-3 text-sm ${method === item.id ? "border-forest bg-sand" : "border-line"}`}>
                <input type="radio" name="payment" className="mr-2" checked={method === item.id} onChange={() => setMethod(item.id)} />
                <span className="font-medium">{item.label}</span>
                <span className="mt-1 block text-muted">{item.note}</span>
              </label>
            ))}
          </fieldset>
          {error ? <p className="text-sm text-red-800">{error}</p> : null}
          <button type="submit" className="btn btn-dark" disabled={sending || loading || !quote || quote.errors.length > 0 || quote.lines.length === 0}>
            {sending ? "Placing order…" : "Place order"}
          </button>
        </div>
        <aside className="h-fit rounded-[1.5rem] bg-white p-6">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <li key={`${item.productId}-${item.weightLabel}`} className="flex justify-between gap-3">
                <span>{item.name} · {item.weightLabel} × {item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4"><Summary quote={quote} loading={loading} /></div>
        </aside>
      </form>
    </div>
  );
}
