import type { Category, Product, StoreData } from "./types";
import { deliveryCharge, brand } from "./site";

export type ShopFilters = {
  q: string;
  category: string;
  min: number | null;
  max: number | null;
  weight: string;
  availability: "all" | "in" | "out";
  sort: "featured" | "price-asc" | "price-desc" | "newest" | "bestseller";
  page: number;
};

export const pageSize = 12;

export const weightChoices = ["250g", "500g", "1kg", "5kg", "10kg", "25kg", "50kg"];

export function referenceWeight(product: Product) {
  return product.weights.find((weight) => weight.grams === 1000) ?? product.weights[0];
}

export function isInStock(product: Product) {
  return product.weights.some((weight) => weight.stock > 0);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

export function categoryById(categories: Category[], id: string) {
  return categories.find((category) => category.id === id);
}

export function categoryBySlug(categories: Category[], slug: string) {
  return categories.find((category) => category.slug === slug);
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFilters(
  input: Record<string, string | string[] | undefined>,
  lockedCategory = "",
): ShopFilters {
  const min = Number(one(input.min));
  const max = Number(one(input.max));
  const page = Number(one(input.page));
  const sort = one(input.sort);
  const availability = one(input.availability);
  const sorts = ["featured", "price-asc", "price-desc", "newest", "bestseller"] as const;
  return {
    q: (one(input.q) ?? "").trim(),
    category: lockedCategory || (one(input.category) ?? ""),
    min: Number.isFinite(min) && one(input.min) ? min : null,
    max: Number.isFinite(max) && one(input.max) ? max : null,
    weight: one(input.weight) ?? "",
    availability: availability === "in" || availability === "out" ? availability : "all",
    sort: sorts.includes(sort as (typeof sorts)[number]) ? (sort as ShopFilters["sort"]) : "featured",
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}

export function filtersToQuery(filters: ShopFilters, includeCategory = true) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (includeCategory && filters.category) params.set("category", filters.category);
  if (filters.min != null) params.set("min", String(filters.min));
  if (filters.max != null) params.set("max", String(filters.max));
  if (filters.weight) params.set("weight", filters.weight);
  if (filters.availability !== "all") params.set("availability", filters.availability);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function applyFilters(products: Product[], categories: Category[], filters: ShopFilters) {
  const category = categoryBySlug(categories, filters.category);
  const query = filters.q.toLowerCase();
  const matched = products.filter((product) => {
    if (category && product.categoryId !== category.id) return false;
    if (query) {
      const haystack = `${product.name} ${product.summary}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    const price = referenceWeight(product).price;
    if (filters.min != null && price < filters.min) return false;
    if (filters.max != null && price > filters.max) return false;
    if (filters.weight && !product.weights.some((weight) => weight.label === filters.weight)) return false;
    const stocked = isInStock(product);
    if (filters.availability === "in" && !stocked) return false;
    if (filters.availability === "out" && stocked) return false;
    return true;
  });

  const items = [...matched].sort((a, b) => {
    if (filters.sort === "price-asc") return referenceWeight(a).price - referenceWeight(b).price;
    if (filters.sort === "price-desc") return referenceWeight(b).price - referenceWeight(a).price;
    if (filters.sort === "newest") return b.createdAt.localeCompare(a.createdAt);
    if (filters.sort === "bestseller") {
      return Number(b.bestseller) - Number(a.bestseller) || a.name.localeCompare(b.name);
    }
    return (
      Number(b.bestseller) - Number(a.bestseller) ||
      Number(b.featured) - Number(a.featured) ||
      a.name.localeCompare(b.name)
    );
  });

  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(filters.page, pages);
  const start = (page - 1) * pageSize;
  return {
    total: items.length,
    pages,
    page,
    items: items.slice(start, start + pageSize),
  };
}

export type QuoteRequestItem = {
  productId: string;
  weightLabel: string;
  qty: number;
};

export function buildQuote(store: StoreData, items: QuoteRequestItem[]) {
  const lines = [];
  const errors: string[] = [];
  for (const item of items) {
    const product = store.products.find((entry) => entry.id === item.productId);
    if (!product) {
      errors.push("A product in the cart is no longer listed.");
      continue;
    }
    const weight = product.weights.find((entry) => entry.label === item.weightLabel);
    if (!weight) {
      errors.push(`${product.name} is not sold in ${item.weightLabel}.`);
      continue;
    }
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      errors.push(`Choose a quantity between 1 and 99 for ${product.name}.`);
      continue;
    }
    if (weight.stock < qty) {
      errors.push(
        weight.stock === 0
          ? `${product.name} (${weight.label}) is out of stock.`
          : `Only ${weight.stock} of ${product.name} (${weight.label}) are in stock.`,
      );
      continue;
    }
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      weightLabel: weight.label,
      qty,
      unitPrice: weight.price,
      lineTotal: weight.price * qty,
    });
  }
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const delivery = lines.length ? deliveryCharge(subtotal) : 0;
  return {
    lines,
    errors,
    subtotal,
    delivery,
    total: subtotal + delivery,
    pricingNote: brand.pricingNote,
    deliveryNote: brand.deliveryNote,
  };
}
