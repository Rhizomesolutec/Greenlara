"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category, Product } from "@/lib/types";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/admin/products/${params.id}`)
      .then(async (response) => {
        const body = (await response.json()) as { product?: Product; categories?: Category[]; error?: string };
        if (!response.ok || !body.product || !body.categories) throw new Error(body.error ?? "Product not found.");
        setProduct(body.product);
        setCategories(body.categories);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [params.id]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl">Edit product</h1>
      {error ? <p>{error}</p> : null}
      {!product ? (error ? null : <p>Loading…</p>) : <ProductForm product={product} categories={categories} />}
    </div>
  );
}
