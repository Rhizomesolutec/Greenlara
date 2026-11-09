"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, isInStock, referenceWeight } from "@/lib/catalog";
import { formatPrice } from "@/lib/site";
import { useCart, useWishlist } from "./Providers";

export function ProductCard({ product, categoryName }: { product: Product; categoryName: string }) {
  const weight = referenceWeight(product);
  const stocked = isInStock(product);
  const discount = discountPercent(weight.price, weight.compareAtPrice);
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const [added, setAdded] = useState(false);

  function add() {
    if (!stocked) return;
    const chosen = product.weights.find((item) => item.stock > 0) ?? weight;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        weightLabel: chosen.label,
        weights: product.weights.map((item) => ({ label: item.label, grams: item.grams })),
      },
      1,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sand">
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0] || "/images/rice-unsplash.jpg"}
            alt={`${product.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        {discount > 0 ? (
          <span className="absolute top-3 left-3 rounded-full bg-cream px-3 py-1 text-[11px] tracking-wide text-forest">
            Sample −{discount}%
          </span>
        ) : null}
        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          onClick={() =>
            wishlist.toggle({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0] ?? "",
              categoryName,
            })
          }
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-cream/95 text-forest"
        >
          <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
        {!stocked ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-forest px-3 py-1 text-[11px] text-cream">
            Out of stock
          </span>
        ) : null}
      </div>
      <div className="px-0.5 pt-3 sm:px-1 sm:pt-4">
        <p className="text-[10px] tracking-[0.14em] text-muted uppercase sm:text-[11px]">{categoryName}</p>
        <h3 className="mt-1 font-serif text-lg leading-tight sm:text-[1.55rem]">
          <Link href={`/product/${product.slug}`} className="hover:text-olive">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted sm:text-sm">{weight.label} sample pack</p>
        <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div>
            <p className="text-base sm:text-lg">
              {weight.compareAtPrice ? (
                <span className="mr-2 text-xs text-muted line-through sm:text-sm">{formatPrice(weight.compareAtPrice)}</span>
              ) : null}
              {formatPrice(weight.price)}
            </p>
            <p className="text-[10px] text-muted sm:text-[11px]">{stocked ? "In stock · sample price" : "Unavailable"}</p>
          </div>
          <button type="button" className="btn btn-dark w-full px-3 py-2 text-xs sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm" onClick={add} disabled={!stocked}>
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
