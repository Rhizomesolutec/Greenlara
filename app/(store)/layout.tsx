import { Suspense } from "react";
import { Footer } from "@/components/site/Footer";
import { Header, HeaderFallback } from "@/components/site/Header";
import { Providers } from "@/components/site/Providers";
import { getStore } from "@/lib/store";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Suspense fallback={<HeaderFallback />}>
        <StoreHeader />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Suspense fallback={null}>
        <StoreFooter />
      </Suspense>
    </Providers>
  );
}

async function StoreHeader() {
  const store = await getStore();
  return <Header categories={store.categories} />;
}

async function StoreFooter() {
  const store = await getStore();
  return <Footer categories={store.categories} />;
}
