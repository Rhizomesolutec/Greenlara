import Link from "next/link";
import { Suspense } from "react";
import { BulkSection, Newsletter } from "@/components/forms/Forms";
import {
  CategorySection,
  Editorial,
  Hero,
  QualityBand,
  Testimonials,
  WhySection,
} from "@/components/home/HomeSections";
import { ProductCard } from "@/components/site/ProductCard";
import { brand } from "@/lib/site";
import { getStore } from "@/lib/store";

export default function Page() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-sm text-muted">Loading Green Lara…</div>}>
      <Home />
    </Suspense>
  );
}

async function Home() {
  const store = await getStore();
  const names = new Map(store.categories.map((category) => [category.id, category.name]));
  const bestsellers = store.products.filter((product) => product.bestseller).slice(0, 8);
  const shown = bestsellers.length > 0 ? bestsellers : store.products.slice(0, 8);

  return (
    <>
      <Hero />
      <CategorySection categories={store.categories} />
      <section className="container-page pb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-serif text-4xl md:text-5xl">Bestselling products</h2>
          <Link href="/shop?sort=bestseller" className="text-sm underline decoration-olive underline-offset-4">
            View all
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{brand.pricingNote}</p>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} categoryName={names.get(product.categoryId) ?? ""} />
          ))}
        </div>
      </section>
      <Editorial />
      <WhySection />
      <QualityBand />
      <BulkSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
