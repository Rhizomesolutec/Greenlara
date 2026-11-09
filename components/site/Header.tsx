"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { brand, nav } from "@/lib/site";
import { Logo } from "./Logo";
import { useCart, useWishlist } from "./Providers";

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { items } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <div className="sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="bg-forest px-4 py-2 text-center text-[11px] tracking-[0.22em] text-cream uppercase">
        {brand.announcement}
      </div>
      <header className="border-b border-line bg-cream/95 backdrop-blur">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-forest hover:text-olive">
                {item.label}
              </Link>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="text-sm text-forest hover:text-olive"
                aria-expanded={categoriesOpen}
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                Categories
              </button>
              {categoriesOpen ? (
                <div className="absolute left-1/2 top-full z-40 w-[34rem] -translate-x-1/2 pt-4">
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-line bg-white p-3 shadow-soft">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop/${category.slug}`}
                        className="rounded-2xl px-3 py-3 hover:bg-sand"
                      >
                        <span className="block font-serif text-lg leading-none">{category.name}</span>
                        <span className="mt-1 block text-xs leading-5 text-muted">{category.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {nav.slice(2).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-forest hover:text-olive">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white"
              aria-label="Search"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <Link href="/account" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="Account">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {items.length > 0 ? (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-olive px-1 text-[10px] text-forest">
                  {items.length}
                </span>
              ) : null}
            </Link>
            <Link href="/cart" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white" aria-label="Shopping cart">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {count > 0 ? (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-forest px-1 text-[10px] text-cream">
                  {count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {searchOpen ? (
          <form onSubmit={onSearch} className="border-t border-line">
            <div className="container-page flex items-center gap-3 py-4">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search rice, millets, dals, seeds"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted"
                aria-label="Search products"
              />
              <button type="submit" className="btn btn-dark px-4 py-2 text-sm">
                Search
              </button>
            </div>
          </form>
        ) : null}
      </header>
      {menuOpen ? (
        <div className="fixed inset-0 top-[6.4rem] z-40 overflow-y-auto bg-cream lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-6" aria-label="Mobile">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-line py-3 font-serif text-3xl">
                {item.label}
              </Link>
            ))}
            <p className="mt-6 text-xs tracking-[0.18em] text-muted uppercase">Categories</p>
            {categories.map((category) => (
              <Link key={category.id} href={`/shop/${category.slug}`} className="py-2 text-base">
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

export function HeaderFallback() {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-forest px-4 py-2 text-center text-[11px] tracking-[0.22em] text-cream uppercase">
        {brand.announcement}
      </div>
      <div className="border-b border-line bg-cream">
        <div className="container-page flex h-[4.5rem] items-center">
          <Logo />
        </div>
      </div>
    </div>
  );
}
