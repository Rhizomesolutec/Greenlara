"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/types";
import {
  applyFilters,
  filtersToQuery,
  weightChoices,
  type ShopFilters,
} from "@/lib/catalog";
import { brand } from "@/lib/site";
import { ProductCard } from "@/components/site/ProductCard";

export function ShopExperience({
  products,
  categories,
  initial,
  lockedSlug = "",
}: {
  products: Product[];
  categories: Category[];
  initial: ShopFilters;
  lockedSlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(initial);
  const names = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const activeFilters = lockedSlug ? { ...filters, category: lockedSlug } : filters;
  const result = applyFilters(products, categories, activeFilters);
  const activeCategory = categories.find((category) => category.slug === activeFilters.category);

  function commit(next: ShopFilters) {
    const safe = { ...next, page: next.page < 1 ? 1 : next.page };
    setFilters(safe);
    const query = filtersToQuery(safe, !lockedSlug);
    router.replace(`${pathname}${query}`, { scroll: false });
  }

  function update(partial: Partial<ShopFilters>) {
    commit({ ...filters, ...partial, page: partial.page ?? 1 });
  }

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Shop</p>
      <h1 className="mt-3 font-serif text-4xl md:text-6xl">
        {activeCategory ? activeCategory.name : filters.q ? `Results for “${filters.q}”` : "All grains"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        {activeCategory?.description ?? "Search, filter, and sort the sample catalogue."} {brand.pricingNote}
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <form
          className="h-fit space-y-5 rounded-[1.5rem] bg-white p-5 lg:sticky lg:top-32"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="grid gap-1 text-sm">
            Search
            <input
              value={filters.q}
              onChange={(event) => update({ q: event.target.value })}
              className="field"
              placeholder="Rice, ragi, rajma"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Category
            <select
              className="field"
              value={lockedSlug || filters.category}
              onChange={(event) => {
                const slug = event.target.value;
                if (lockedSlug || slug) router.push(slug ? `/shop/${slug}` : "/shop");
                else update({ category: "" });
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-sm">
              Min 1kg price
              <input
                type="number"
                min={0}
                value={filters.min ?? ""}
                onChange={(event) => update({ min: event.target.value ? Number(event.target.value) : null })}
                className="field"
              />
            </label>
            <label className="grid gap-1 text-sm">
              Max 1kg price
              <input
                type="number"
                min={0}
                value={filters.max ?? ""}
                onChange={(event) => update({ max: event.target.value ? Number(event.target.value) : null })}
                className="field"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            Weight
            <select className="field" value={filters.weight} onChange={(event) => update({ weight: event.target.value })}>
              <option value="">Any weight</option>
              {weightChoices.map((weight) => (
                <option key={weight}>{weight}</option>
              ))}
            </select>
          </label>
          <fieldset className="grid gap-2 text-sm">
            <legend>Availability</legend>
            {[
              ["all", "All"],
              ["in", "In stock"],
              ["out", "Out of stock"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === value}
                  onChange={() => update({ availability: value as ShopFilters["availability"] })}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => {
              if (lockedSlug) router.push(`/shop/${lockedSlug}`);
              commit({
                q: "",
                category: lockedSlug,
                min: null,
                max: null,
                weight: "",
                availability: "all",
                sort: "featured",
                page: 1,
              });
            }}
          >
            Clear filters
          </button>
        </form>
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {result.total === 0
                ? "No products"
                : `Showing ${(result.page - 1) * 12 + 1}–${Math.min(result.page * 12, result.total)} of ${result.total}`}
            </p>
            <label className="flex items-center gap-2 text-sm">
              Sort
              <select className="field w-auto" value={filters.sort} onChange={(event) => update({ sort: event.target.value as ShopFilters["sort"] })}>
                <option value="featured">Featured</option>
                <option value="bestseller">Bestselling</option>
                <option value="newest">New arrivals</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
          </div>
          {result.items.length === 0 ? (
            <div className="rounded-[1.5rem] bg-white p-10 text-center">
              <p className="font-serif text-3xl">Nothing matches these filters.</p>
              <p className="mt-3 text-sm text-muted">Try another grain, or clear the filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-8 xl:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={names.get(product.categoryId) ?? ""}
                />
              ))}
            </div>
          )}
          {result.pages > 1 ? (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <button type="button" className="btn btn-line px-4 py-2" disabled={result.page <= 1} onClick={() => update({ page: result.page - 1 })}>
                Previous
              </button>
              {Array.from({ length: result.pages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm ${page === result.page ? "bg-forest text-cream" : "bg-white"}`}
                  onClick={() => update({ page })}
                >
                  {page}
                </button>
              ))}
              <button type="button" className="btn btn-line px-4 py-2" disabled={result.page >= result.pages} onClick={() => update({ page: result.page + 1 })}>
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
