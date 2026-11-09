"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";

type WeightDraft = { label: string; grams: string; price: string; compareAtPrice: string; stock: string };
type SpecDraft = { label: string; value: string };

function fromProduct(product?: Product): {
  name: string;
  slug: string;
  categoryId: string;
  summary: string;
  description: string;
  images: string[];
  weights: WeightDraft[];
  specs: SpecDraft[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  origin: string;
  packaging: string;
  storage: string;
} {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? "",
    summary: product?.summary ?? "",
    description: product?.description ?? "",
    images: product?.images?.length ? product.images : ["/images/rice-unsplash.jpg"],
    weights: product?.weights.map((weight) => ({
      label: weight.label,
      grams: String(weight.grams),
      price: String(weight.price),
      compareAtPrice: weight.compareAtPrice ? String(weight.compareAtPrice) : "",
      stock: String(weight.stock),
    })) ?? [{ label: "1kg", grams: "1000", price: "", compareAtPrice: "", stock: "20" }],
    specs: product?.specs.length ? product.specs : [{ label: "Form", value: "" }],
    featured: product?.featured ?? false,
    bestseller: product?.bestseller ?? false,
    newArrival: product?.newArrival ?? false,
    origin: product?.origin ?? "",
    packaging: product?.packaging ?? "",
    storage: product?.storage ?? "",
  };
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => fromProduct(product));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  function set<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      setError(data.error ?? "The image could not be uploaded.");
      return;
    }
    set("images", [...draft.images, data.url]);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...draft,
      categoryId: draft.categoryId || categories[0]?.id,
      weights: draft.weights.map((weight) => ({
        ...weight,
        grams: Number(weight.grams),
        price: Number(weight.price),
        stock: Number(weight.stock),
        compareAtPrice: weight.compareAtPrice,
      })),
    };
    const response = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setError(data.error ?? "The product could not be saved.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
      <label className="grid gap-1 text-sm">Name<input className="field" required value={draft.name} onChange={(event) => set("name", event.target.value)} /></label>
      <label className="grid gap-1 text-sm">Link name<input className="field" value={draft.slug} placeholder="Leave blank to generate" onChange={(event) => set("slug", event.target.value)} /></label>
      <label className="grid gap-1 text-sm">Category
        <select className="field" value={draft.categoryId} onChange={(event) => set("categoryId", event.target.value)}>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm">Summary<textarea className="field" required rows={2} value={draft.summary} onChange={(event) => set("summary", event.target.value)} /></label>
      <label className="grid gap-1 text-sm">Description<textarea className="field" required rows={4} value={draft.description} onChange={(event) => set("description", event.target.value)} /></label>
      <div className="grid gap-2 rounded-2xl bg-white p-4">
        <p className="text-sm">Images</p>
        {draft.images.map((image, index) => (
          <div key={`${image}-${index}`} className="flex gap-2">
            <input className="field" value={image} onChange={(event) => set("images", draft.images.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />
            <button type="button" className="text-sm underline" onClick={() => set("images", draft.images.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <input className="field max-w-sm" value={imageUrl} placeholder="/images/rice-unsplash.jpg" onChange={(event) => setImageUrl(event.target.value)} />
          <button type="button" className="btn btn-line" onClick={() => { if (imageUrl.trim()) { set("images", [...draft.images, imageUrl.trim()]); setImageUrl(""); } }}>Add path</button>
          <label className="btn btn-line cursor-pointer">
            Upload
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
          </label>
        </div>
      </div>
      <div className="grid gap-3">
        <p className="text-sm">Package sizes and sample prices</p>
        {draft.weights.map((weight, index) => (
          <div key={index} className="grid gap-2 rounded-2xl bg-white p-3 sm:grid-cols-5">
            <input className="field" placeholder="1kg" value={weight.label} onChange={(event) => set("weights", draft.weights.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} />
            <input className="field" placeholder="grams" value={weight.grams} onChange={(event) => set("weights", draft.weights.map((item, itemIndex) => itemIndex === index ? { ...item, grams: event.target.value } : item))} />
            <input className="field" placeholder="price" value={weight.price} onChange={(event) => set("weights", draft.weights.map((item, itemIndex) => itemIndex === index ? { ...item, price: event.target.value } : item))} />
            <input className="field" placeholder="compare" value={weight.compareAtPrice} onChange={(event) => set("weights", draft.weights.map((item, itemIndex) => itemIndex === index ? { ...item, compareAtPrice: event.target.value } : item))} />
            <input className="field" placeholder="stock" value={weight.stock} onChange={(event) => set("weights", draft.weights.map((item, itemIndex) => itemIndex === index ? { ...item, stock: event.target.value } : item))} />
          </div>
        ))}
        <button type="button" className="text-sm underline w-fit" onClick={() => set("weights", [...draft.weights, { label: "", grams: "", price: "", compareAtPrice: "", stock: "0" }])}>Add size</button>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label><input type="checkbox" className="mr-2" checked={draft.featured} onChange={(event) => set("featured", event.target.checked)} />Featured</label>
        <label><input type="checkbox" className="mr-2" checked={draft.bestseller} onChange={(event) => set("bestseller", event.target.checked)} />Bestselling</label>
        <label><input type="checkbox" className="mr-2" checked={draft.newArrival} onChange={(event) => set("newArrival", event.target.checked)} />New arrival</label>
      </div>
      <label className="grid gap-1 text-sm">Origin<input className="field" value={draft.origin} onChange={(event) => set("origin", event.target.value)} /></label>
      <label className="grid gap-1 text-sm">Packaging<textarea className="field" rows={2} value={draft.packaging} onChange={(event) => set("packaging", event.target.value)} /></label>
      <label className="grid gap-1 text-sm">Storage<textarea className="field" rows={2} value={draft.storage} onChange={(event) => set("storage", event.target.value)} /></label>
      <div className="grid gap-2">
        <p className="text-sm">Specifications</p>
        {draft.specs.map((spec, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-2">
            <input className="field" placeholder="Label" value={spec.label} onChange={(event) => set("specs", draft.specs.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} />
            <input className="field" placeholder="Value" value={spec.value} onChange={(event) => set("specs", draft.specs.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} />
          </div>
        ))}
        <button type="button" className="text-sm underline w-fit" onClick={() => set("specs", [...draft.specs, { label: "", value: "" }])}>Add specification</button>
      </div>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button type="submit" className="btn btn-dark w-fit" disabled={saving}>{saving ? "Saving…" : "Save product"}</button>
    </form>
  );
}
