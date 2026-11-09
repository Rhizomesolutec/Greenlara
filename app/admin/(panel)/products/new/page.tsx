"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category } from "@/lib/types";

export default function Page() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/products")
      .then(async (response) => {
        const body = (await response.json()) as { categories?: Category[]; error?: string };
        if (!response.ok || !body.categories) throw new Error(body.error ?? "Could not load categories.");
        setCategories(body.categories);
      })
      .catch((reason: Error) => setError(reason.message));
  }, []);
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl">Add product</h1>
      {error ? <p>{error}</p> : null}
      {!categories ? <p>Loading…</p> : <ProductForm categories={categories} />}
    </div>
  );
}
