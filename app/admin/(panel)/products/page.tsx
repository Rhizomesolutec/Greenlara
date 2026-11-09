"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/site";
import { referenceWeight } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export default function Page() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/products")
      .then(async (response) => {
        const body = (await response.json()) as { products?: Product[]; error?: string };
        if (!response.ok || !body.products) throw new Error(body.error ?? "Could not load products.");
        setProducts(body.products);
      })
      .catch((reason: Error) => setError(reason.message));
  }

  useEffect(load, []);

  async function remove(id: string) {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not delete the product.");
      return;
    }
    load();
  }

  const shown = (products ?? []).filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link href="/admin/products/new" className="btn btn-dark">Add product</Link>
      </div>
      <input className="field mt-5 max-w-sm" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} />
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      {!products ? <p className="mt-6">Loading products…</p> : (
        <div className="mt-4 overflow-x-auto rounded-3xl bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs tracking-wide text-muted uppercase">
              <tr><th className="px-4 py-3">Name</th><th>Sample 1kg</th><th>Stock</th><th>Flags</th><th></th></tr>
            </thead>
            <tbody>
              {shown.map((product) => {
                const weight = referenceWeight(product);
                return (
                  <tr key={product.id} className="border-t border-line">
                    <td className="px-4 py-3">{product.name}</td>
                    <td>{formatPrice(weight.price)}</td>
                    <td>{product.weights.reduce((sum, item) => sum + item.stock, 0)}</td>
                    <td>{[product.bestseller && "Bestseller", product.featured && "Featured", product.newArrival && "New"].filter(Boolean).join(", ") || "—"}</td>
                    <td className="space-x-3 pr-4 text-right">
                      <Link href={`/admin/products/${product.id}`} className="underline">Edit</Link>
                      <button type="button" className="underline" onClick={() => remove(product.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
