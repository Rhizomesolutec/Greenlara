"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/components/site/Providers";

export default function Page() {
  const { ready, items, remove } = useWishlist();
  return (
    <div className="container-page py-14 md:py-20">
      <h1 className="font-serif text-4xl md:text-6xl">Wishlist</h1>
      {!ready ? <p className="mt-6 text-sm text-muted">Loading your list…</p> : null}
      {ready && items.length === 0 ? (
        <div className="mt-8 max-w-lg">
          <p className="text-muted">Nothing is saved yet. Use the heart on a product to keep it here.</p>
          <Link href="/shop" className="btn btn-dark mt-6">Explore Products</Link>
        </div>
      ) : null}
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.productId}>
            <Link href={`/product/${item.slug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-sand">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="25vw" />
            </Link>
            <p className="mt-3 text-xs tracking-[0.14em] text-muted uppercase">{item.categoryName}</p>
            <h2 className="font-serif text-lg sm:text-2xl">{item.name}</h2>
            <button type="button" className="mt-2 text-sm underline" onClick={() => remove(item.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
