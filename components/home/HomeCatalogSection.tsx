"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { isInStock, referenceWeight } from "@/lib/catalog";
import { brand } from "@/lib/site";
import { easeOutSmooth, FadeIn } from "@/components/site/Motion";
import { ProductCard } from "@/components/site/ProductCard";

type SortMode = "bestseller" | "featured" | "price-asc" | "price-desc" | "newest";

export function HomeCatalogSection({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("bestseller");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) => {
      if (activeCategory !== "all" && product.categoryId !== activeCategory) return false;
      if (inStockOnly && !isInStock(product)) return false;
      if (term) {
        const catName = categoryNames.get(product.categoryId) ?? "";
        const haystack = `${product.name} ${product.summary} ${catName}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return referenceWeight(a).price - referenceWeight(b).price;
      if (sort === "price-desc") return referenceWeight(b).price - referenceWeight(a).price;
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "featured") {
        return Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller) || a.name.localeCompare(b.name);
      }
      return Number(b.bestseller) - Number(a.bestseller) || Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
    });
  }, [products, activeCategory, query, sort, inStockOnly, categoryNames]);

  const visible = showAll ? filtered : filtered.slice(0, 8);
  const hasActiveFilters = activeCategory !== "all" || query.trim() !== "" || inStockOnly || sort !== "bestseller";

  function resetFilters() {
    setActiveCategory("all");
    setQuery("");
    setSort("bestseller");
    setInStockOnly(false);
    setShowAll(false);
  }

  return (
    <section className="container-page pb-8">
      <FadeIn>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted uppercase">Curated selection</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Bestselling spices &amp; pulses</h2>
          </div>
          <Link
            href={activeCategory === "all" ? "/shop?sort=bestseller" : `/shop/${categories.find((c) => c.id === activeCategory)?.slug ?? ""}`}
            className="text-sm underline decoration-olive underline-offset-4 transition-colors hover:text-olive"
          >
            View all in shop
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{brand.pricingNote}</p>
      </FadeIn>

      {/* Filter Bar */}
      <FadeIn delay={0.06} className="mt-7 rounded-[1.5rem] border border-line bg-white/80 p-3.5 shadow-soft backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by category">
            {[
              { id: "all", name: "All" },
              ...categories.map((c) => ({ id: c.id, name: c.name })),
            ].map((tab) => {
              const selected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setShowAll(false);
                  }}
                  className={`relative rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors sm:text-sm ${
                    selected ? "text-cream" : "text-forest/80 hover:bg-sand hover:text-forest"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="home-filter-pill"
                      className="absolute inset-0 rounded-full bg-forest"
                      transition={{ duration: 0.28, ease: easeOutSmooth }}
                    />
                  ) : null}
                  <span className="relative z-10">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Stock Toggle, Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-52 sm:flex-initial">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowAll(false);
                }}
                placeholder="Filter spices, dals…"
                aria-label="Filter products on home screen"
                className="w-full rounded-full border border-line bg-cream/70 py-2 pr-8 pl-9 text-sm text-forest outline-none transition focus:border-olive focus:bg-white"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-muted hover:text-forest"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setInStockOnly((prev) => !prev)}
              aria-pressed={inStockOnly}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm ${
                inStockOnly
                  ? "border-olive bg-olive/20 text-forest"
                  : "border-line bg-cream/70 text-muted hover:border-forest/30 hover:text-forest"
              }`}
            >
              In stock
            </button>

            <label className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream/70 px-3.5 py-2 text-xs text-muted sm:text-sm">
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-forest/70" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                aria-label="Sort products"
                className="bg-transparent text-forest outline-none"
              >
                <option value="bestseller">Bestselling</option>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3 text-xs text-muted">
            <p>
              Showing <span className="font-medium text-forest">{visible.length}</span> of{" "}
              <span className="font-medium text-forest">{filtered.length}</span> matching products
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-forest underline decoration-olive underline-offset-4 hover:text-olive"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </FadeIn>

      {/* Product Grid */}
      {visible.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] bg-white p-10 text-center">
          <p className="font-serif text-3xl">No matching spices or pulses.</p>
          <p className="mt-2 text-sm text-muted">Try a different keyword or reset the filters.</p>
          <button type="button" onClick={resetFilters} className="btn btn-dark mt-5">
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 items-stretch gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <motion.div
                  key={product.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: easeOutSmooth }}
                  className="h-full"
                >
                  <ProductCard
                    product={product}
                    categoryName={categoryNames.get(product.categoryId) ?? ""}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length > 8 ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="btn btn-line hover:-translate-y-0.5"
              >
                {showAll ? "Show fewer" : `Show all ${filtered.length} products`}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
