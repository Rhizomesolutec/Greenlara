import { Suspense } from "react";
import { BulkSection, Newsletter } from "@/components/forms/Forms";
import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";
import {
  CategorySection,
  Editorial,
  Hero,
  QualityBand,
  Testimonials,
  WhySection,
} from "@/components/home/HomeSections";
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

  return (
    <>
      <Hero />
      <CategorySection categories={store.categories} />
      <HomeCatalogSection products={store.products} categories={store.categories} />
      <Editorial />
      <WhySection />
      <QualityBand />
      <BulkSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}
