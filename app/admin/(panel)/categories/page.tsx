"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

const empty = { id: "", name: "", slug: "", description: "", image: "/images/rice-unsplash.jpg" };

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState(empty);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/categories")
      .then(async (response) => {
        const body = (await response.json()) as { categories?: Category[]; error?: string };
        if (!response.ok || !body.categories) throw new Error(body.error ?? "Could not load categories.");
        setCategories(body.categories);
      })
      .catch((reason: Error) => setError(reason.message));
  }

  useEffect(load, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch(draft.id ? `/api/admin/categories/${draft.id}` : "/api/admin/categories", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not save the category.");
      return;
    }
    setDraft(empty);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this category?")) return;
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "Could not delete the category.");
      return;
    }
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <h1 className="font-serif text-4xl">Categories</h1>
        {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
        <ul className="mt-6 space-y-3">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4">
              <div>
                <p className="font-serif text-2xl">{category.name}</p>
                <p className="text-sm text-muted">{category.description}</p>
              </div>
              <div className="space-x-3 text-sm">
                <button type="button" className="underline" onClick={() => setDraft(category)}>Edit</button>
                <button type="button" className="underline" onClick={() => remove(category.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={save} className="h-fit rounded-3xl bg-white p-5">
        <h2 className="font-serif text-2xl">{draft.id ? "Edit category" : "New category"}</h2>
        <label className="mt-4 grid gap-1 text-sm">Name<input required className="field" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label className="mt-3 grid gap-1 text-sm">Link<input className="field" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} /></label>
        <label className="mt-3 grid gap-1 text-sm">Description<textarea required className="field" rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
        <label className="mt-3 grid gap-1 text-sm">Image path<input required className="field" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} /></label>
        <div className="mt-4 flex gap-3">
          <button type="submit" className="btn btn-dark">Save</button>
          {draft.id ? <button type="button" className="btn btn-line" onClick={() => setDraft(empty)}>Cancel</button> : null}
        </div>
      </form>
    </div>
  );
}
