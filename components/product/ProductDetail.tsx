"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent } from "@/lib/catalog";
import { brand, formatPrice } from "@/lib/site";
import { useCart, useWishlist } from "@/components/site/Providers";
import { ProductCard } from "@/components/site/ProductCard";

export function ProductDetail({
  product,
  categoryName,
  categorySlug,
  related,
  relatedCategories,
}: {
  product: Product;
  categoryName: string;
  categorySlug: string;
  related: Product[];
  relatedCategories: Record<string, string>;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const initial = product.weights.find((weight) => weight.stock > 0) ?? product.weights[0];
  const [label, setLabel] = useState(initial.label);
  const [image, setImage] = useState(product.images[0] ?? "");
  const [qty, setQty] = useState(1);
  const weight = product.weights.find((item) => item.label === label) ?? initial;
  const discount = discountPercent(weight.price, weight.compareAtPrice);
  const saved = wishlist.has(product.id);
  const maxQty = Math.max(1, Math.min(99, weight.stock));

  const line = useMemo(
    () => ({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      weightLabel: weight.label,
      weights: product.weights.map((item) => ({ label: item.label, grams: item.grams })),
    }),
    [product, weight.label],
  );

  function add(goToCheckout = false) {
    if (weight.stock < 1) return;
    addItem(line, qty);
    if (goToCheckout) router.push("/checkout");
  }

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-sm text-muted">
        <Link href="/shop" className="hover:underline">Shop</Link>
        <span> / </span>
        <Link href={`/shop/${categorySlug}`} className="hover:underline">
          {categoryName}
        </Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-sand">
            <Image src={image || product.images[0]} alt={product.name} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {product.images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImage(src)}
                  className={`relative h-20 w-20 overflow-hidden rounded-2xl ${src === image ? "ring-2 ring-forest" : ""}`}
                  aria-label="Show photograph"
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">{categoryName}</p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl">{product.name}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">{product.description}</p>
          <div className="mt-6 flex items-end gap-3">
            <p className="font-serif text-4xl">{formatPrice(weight.price)}</p>
            {weight.compareAtPrice ? (
              <p className="text-muted line-through">{formatPrice(weight.compareAtPrice)}</p>
            ) : null}
            {discount > 0 ? <p className="text-sm">Sample −{discount}%</p> : null}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">{brand.pricingNote}</p>
          <p className="mt-4 text-sm">{weight.stock > 0 ? `${weight.stock} in stock for ${weight.label}` : "Out of stock for this weight"}</p>
          <div className="mt-6">
            <p className="text-sm">Available weights</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.weights.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    setLabel(option.label);
                    setQty(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm ${option.label === weight.label ? "bg-forest text-cream" : "bg-white"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full bg-white">
              <button type="button" className="px-4 py-3" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
              <span className="min-w-8 text-center">{qty}</span>
              <button type="button" className="px-4 py-3" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(maxQty, value + 1))}>+</button>
            </div>
            <button type="button" className="btn btn-dark" disabled={weight.stock < 1} onClick={() => add(false)}>Add to Cart</button>
            <button type="button" className="btn btn-line" disabled={weight.stock < 1} onClick={() => add(true)}>Buy Now</button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-white"
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() =>
                wishlist.toggle({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0] ?? "",
                  categoryName,
                })
              }
            >
              <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <dl className="mt-10 grid gap-4 border-t border-line pt-6 text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[8rem_1fr] gap-3">
                <dt className="text-muted">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[8rem_1fr] gap-3">
              <dt className="text-muted">Origin</dt>
              <dd>{product.origin || "Origin will be listed when it is added for this product."}</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-3">
              <dt className="text-muted">Packaging</dt>
              <dd>{product.packaging}</dd>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-3">
              <dt className="text-muted">Storage</dt>
              <dd>{product.storage}</dd>
            </div>
          </dl>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-4xl">Related products</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} categoryName={relatedCategories[item.categoryId] ?? categoryName} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
