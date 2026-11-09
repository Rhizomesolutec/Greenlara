import type { Category, Product, Spec, StoreData, WeightOption } from "./types";
import { slugify } from "./site";
import { allowedImage, clean } from "./validators";

function readWeights(value: unknown): { error: string } | { weights: WeightOption[] } {
  if (!Array.isArray(value) || value.length === 0) return { error: "Add at least one package size." };
  const weights: WeightOption[] = [];
  for (const entry of value) {
    const raw = entry as Record<string, unknown>;
    const label = clean(raw.label, 20);
    const grams = Number(raw.grams);
    const price = Number(raw.price);
    const stock = Number(raw.stock);
    const compareRaw = raw.compareAtPrice;
    const compare = compareRaw === "" || compareRaw == null ? undefined : Number(compareRaw);
    if (!label || !Number.isFinite(grams) || grams <= 0 || !Number.isFinite(price) || price < 0) {
      return { error: "Each package needs a label, weight in grams, and a sample price." };
    }
    if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number." };
    weights.push({
      label,
      grams,
      price: Math.round(price),
      stock,
      compareAtPrice:
        compare != null && Number.isFinite(compare) && compare > price ? Math.round(compare) : undefined,
    });
  }
  return { weights };
}

function readSpecs(value: unknown): Spec[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      const raw = entry as Record<string, unknown>;
      return { label: clean(raw.label, 40), value: clean(raw.value, 160) };
    })
    .filter((spec) => spec.label && spec.value);
}

export function readProductInput(body: Record<string, unknown>, store: StoreData, currentId?: string) {
  const name = clean(body.name, 120);
  if (name.length < 2) return { error: "Add a product name." };
  const slug = slugify(clean(body.slug, 140) || name);
  if (!slug) return { error: "Add a valid product link name." };
  if (store.products.some((product) => product.slug === slug && product.id !== currentId)) {
    return { error: "Another product already uses that link name." };
  }
  const categoryId = clean(body.categoryId, 80);
  if (!store.categories.some((category) => category.id === categoryId)) {
    return { error: "Choose a category." };
  }
  const images = Array.isArray(body.images)
    ? body.images.map((image) => clean(image, 300)).filter(allowedImage)
    : [];
  if (images.length === 0) return { error: "Add a valid image path or upload." };
  const parsedWeights = readWeights(body.weights);
  if ("error" in parsedWeights) return parsedWeights;
  const existing = store.products.find((product) => product.id === currentId);
  const product: Product = {
    id: currentId ?? slug,
    slug,
    name,
    categoryId,
    summary: clean(body.summary, 280),
    description: clean(body.description, 2000),
    images,
    weights: parsedWeights.weights,
    featured: Boolean(body.featured),
    bestseller: Boolean(body.bestseller),
    newArrival: Boolean(body.newArrival),
    origin: clean(body.origin, 160),
    packaging: clean(body.packaging, 400) || "Packed for the selected weight.",
    storage: clean(body.storage, 400) || "Store in a cool, dry place.",
    specs: readSpecs(body.specs),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  if (!product.summary) return { error: "Add a short summary." };
  if (!product.description) product.description = product.summary;
  return { product };
}

export function readCategoryInput(body: Record<string, unknown>, categories: Category[], currentId?: string) {
  const name = clean(body.name, 80);
  if (name.length < 2) return { error: "Add a category name." };
  const slug = slugify(clean(body.slug, 80) || name);
  if (!slug) return { error: "Add a valid category link." };
  if (categories.some((category) => category.slug === slug && category.id !== currentId)) {
    return { error: "Another category already uses that link." };
  }
  const image = clean(body.image, 300);
  if (!allowedImage(image)) return { error: "Add a valid category image." };
  const description = clean(body.description, 180);
  if (!description) return { error: "Add a short description." };
  const category: Category = {
    id: currentId ?? slug,
    slug,
    name,
    description,
    image,
  };
  return { category };
}
