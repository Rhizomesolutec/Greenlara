import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/product/ProductDetail";
import { products as seedProducts } from "@/lib/catalogue";
import { getStore } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const known = seedProducts.find((product) => product.slug === slug);
  return {
    title: known?.name ?? "Product",
    description: known?.summary ?? "A Green Lara grain listing.",
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading product…</div>}>
      <ProductScreen params={params} />
    </Suspense>
  );
}

async function ProductScreen({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const category = store.categories.find((item) => item.id === product.categoryId);
  const related = store.products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 4);
  return (
    <ProductDetail
      product={product}
      categoryName={category?.name ?? "Shop"}
      categorySlug={category?.slug ?? ""}
      related={related}
      relatedCategories={Object.fromEntries(store.categories.map((item) => [item.id, item.name]))}
    />
  );
}
