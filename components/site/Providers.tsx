"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, WishlistLine } from "@/lib/types";

type CartContextValue = {
  ready: boolean;
  items: CartLine[];
  count: number;
  addItem: (line: Omit<CartLine, "qty">, qty?: number) => void;
  updateQty: (productId: string, weightLabel: string, qty: number) => void;
  updateWeight: (productId: string, fromLabel: string, toLabel: string) => void;
  removeItem: (productId: string, weightLabel: string) => void;
  clear: () => void;
};

type WishlistContextValue = {
  ready: boolean;
  items: WishlistLine[];
  has: (productId: string) => boolean;
  toggle: (line: WishlistLine) => void;
  remove: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const WishlistContext = createContext<WishlistContextValue | null>(null);

const cartKey = "greentara-cart";
const wishKey = "greentara-wishlist";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<WishlistLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readJson<CartLine[]>(cartKey, []));
    setWishlist(readJson<WishlistLine[]>(wishKey, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(wishKey, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const cartValue = useMemo<CartContextValue>(
    () => ({
      ready,
      items: cart,
      count: cart.reduce((sum, item) => sum + item.qty, 0),
      addItem: (line, qty = 1) => {
        setCart((current) => {
          const index = current.findIndex(
            (item) => item.productId === line.productId && item.weightLabel === line.weightLabel,
          );
          if (index === -1) return [...current, { ...line, qty }];
          return current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, qty: Math.min(99, item.qty + qty) } : item,
          );
        });
      },
      updateQty: (productId, weightLabel, qty) => {
        setCart((current) =>
          current.flatMap((item) => {
            if (item.productId !== productId || item.weightLabel !== weightLabel) return [item];
            if (qty <= 0) return [];
            return [{ ...item, qty: Math.min(99, qty) }];
          }),
        );
      },
      updateWeight: (productId, fromLabel, toLabel) => {
        setCart((current) => {
          const source = current.find(
            (item) => item.productId === productId && item.weightLabel === fromLabel,
          );
          if (!source || fromLabel === toLabel) return current;
          const without = current.filter(
            (item) => !(item.productId === productId && item.weightLabel === fromLabel),
          );
          const existing = without.find(
            (item) => item.productId === productId && item.weightLabel === toLabel,
          );
          if (!existing) return [...without, { ...source, weightLabel: toLabel }];
          return without.map((item) =>
            item === existing
              ? { ...item, qty: Math.min(99, item.qty + source.qty) }
              : item,
          );
        });
      },
      removeItem: (productId, weightLabel) => {
        setCart((current) =>
          current.filter(
            (item) => !(item.productId === productId && item.weightLabel === weightLabel),
          ),
        );
      },
      clear: () => setCart([]),
    }),
    [cart, ready],
  );

  const wishlistValue = useMemo<WishlistContextValue>(
    () => ({
      ready,
      items: wishlist,
      has: (productId) => wishlist.some((item) => item.productId === productId),
      toggle: (line) => {
        setWishlist((current) =>
          current.some((item) => item.productId === line.productId)
            ? current.filter((item) => item.productId !== line.productId)
            : [...current, line],
        );
      },
      remove: (productId) => {
        setWishlist((current) => current.filter((item) => item.productId !== productId));
      },
    }),
    [wishlist, ready],
  );

  return (
    <CartContext.Provider value={cartValue}>
      <WishlistContext.Provider value={wishlistValue}>{children}</WishlistContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within Providers");
  return value;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used within Providers");
  return value;
}
