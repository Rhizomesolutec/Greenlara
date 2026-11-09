import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { categories as seedCategories } from "@/lib/catalogue";
import { parseFilters } from "@/lib/catalog";
import { getStore } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const known = seedCategories.find((item) => item.slug === category);
  return { title: known?.name ?? "Shop", description: known?.description };
}

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading the category…</div>}>
      <CategoryShop params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryShop({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: slug } = await params;
  const store = await getStore();
  const category = store.categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const filters = parseFilters(await searchParams, category.slug);
  return (
    <ShopExperience
      products={store.products}
      categories={store.categories}
      initial={filters}
      lockedSlug={category.slug}
    />
  );
}
