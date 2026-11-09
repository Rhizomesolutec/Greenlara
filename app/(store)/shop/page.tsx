import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { parseFilters } from "@/lib/catalog";
import { getStore } from "@/lib/store";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Green Lara sample catalogue of grains, pulses, millets, seeds, and flours.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading the shop…</div>}>
      <ShopData searchParams={searchParams} />
    </Suspense>
  );
}

async function ShopData({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const store = await getStore();
  const filters = parseFilters(await searchParams);
  return <ShopExperience products={store.products} categories={store.categories} initial={filters} />;
}
