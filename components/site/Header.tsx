"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { brand, nav } from "@/lib/site";
import { Logo } from "./Logo";
import { easeOutSmooth } from "./Motion";
import { useCart, useWishlist } from "./Providers";

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const { count } = useCart();
  const { items } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-forest"
      >
        Skip to content
      </a>
      <div className="overflow-hidden border-b border-cream/10 bg-[#232818] py-2 text-[11px] tracking-[0.22em] text-cream/85 uppercase">
        <div className="animate-announcement" aria-label={brand.announcement}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="inline-flex shrink-0 items-center whitespace-nowrap">
                  <span className="px-6">{brand.announcement}</span>
                  <span className="text-olive" aria-hidden>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <header
        className={`border-b border-cream/12 bg-forest/95 text-cream backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_rgba(20,24,13,0.28)]" : ""
        }`}
      >
        <div className="container-page flex h-[4.75rem] items-center justify-between gap-4">
          <Logo tone="light" />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {nav.slice(0, 2).map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-sm transition-colors duration-200 ${
                    active ? "text-peach" : "text-cream/85 hover:text-peach"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-olive"
                      transition={{ duration: 0.3, ease: easeOutSmooth }}
                    />
                  ) : null}
                </Link>
              );
            })}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 py-1 text-sm text-cream/85 transition-colors duration-200 hover:text-peach"
                aria-expanded={categoriesOpen}
                onClick={() => setCategoriesOpen((open) => !open)}
              >
                Categories
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180 text-olive" : ""}`}
                  strokeWidth={1.8}
                />
              </button>
              <AnimatePresence>
                {categoriesOpen ? (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: easeOutSmooth }}
                    className="absolute left-1/2 top-full z-40 w-[34rem] -translate-x-1/2 pt-4"
                  >
                    <div className="grid grid-cols-2 gap-1.5 rounded-3xl border border-cream/15 bg-[#272c1c] p-3 shadow-[0_24px_60px_rgba(15,18,10,0.45)]">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/shop/${category.slug}`}
                          className="group rounded-2xl px-3.5 py-3 transition-colors duration-200 hover:bg-cream/8"
                        >
                          <span className="block font-serif text-lg leading-none text-cream transition-colors group-hover:text-peach">
                            {category.name}
                          </span>
                          <span className="mt-1.5 block text-xs leading-5 text-cream/65">{category.description}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            {nav.slice(2).map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-sm transition-colors duration-200 ${
                    active ? "text-peach" : "text-cream/85 hover:text-peach"
                  }`}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-olive"
                      transition={{ duration: 0.3, ease: easeOutSmooth }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-peach"
              aria-label="Search"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
            <Link
              href="/account"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-peach"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </Link>
            <Link
              href="/wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-peach"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.6} />
              {items.length > 0 ? (
                <motion.span
                  key={items.length}
                  initial={reduce ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-olive px-1 text-[10px] font-medium text-forest"
                >
                  {items.length}
                </motion.span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-peach"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-peach px-1 text-[10px] font-medium text-forest"
                >
                  {count}
                </motion.span>
              ) : null}
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/90 transition-colors duration-200 hover:bg-cream/10 hover:text-peach lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen ? (
            <motion.form
              onSubmit={onSearch}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: easeOutSmooth }}
              className="overflow-hidden border-t border-cream/10 bg-[#2a301e]"
            >
              <div className="container-page flex items-center gap-3 py-4">
                <Search className="h-4 w-4 shrink-0 text-cream/55" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search cardamom, turmeric, toor dal, rajma"
                  className="w-full bg-transparent text-base text-cream outline-none placeholder:text-cream/45"
                  aria-label="Search products"
                />
                <button type="submit" className="btn btn-olive px-4 py-2 text-sm font-medium">
                  Search
                </button>
              </div>
            </motion.form>
          ) : null}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: easeOutSmooth }}
            className="fixed inset-0 top-[6.65rem] z-40 overflow-y-auto bg-forest text-cream lg:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-6" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-cream/12 py-3 font-serif text-3xl text-cream transition-colors hover:text-peach"
                >
                  {item.label}
                </Link>
              ))}
              <p className="mt-6 text-xs tracking-[0.18em] text-olive uppercase">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="py-2 text-base text-cream/85 transition-colors hover:text-peach"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function HeaderFallback() {
  return (
    <div className="sticky top-0 z-50">
      <div className="overflow-hidden border-b border-cream/10 bg-[#232818] py-2 text-[11px] tracking-[0.22em] text-cream/85 uppercase">
        <div className="animate-announcement" aria-label={brand.announcement}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="inline-flex shrink-0 items-center whitespace-nowrap">
                  <span className="px-6">{brand.announcement}</span>
                  <span className="text-olive" aria-hidden>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="border-b border-cream/12 bg-forest text-cream">
        <div className="container-page flex h-[4.75rem] items-center">
          <Logo tone="light" />
        </div>
      </div>
    </div>
  );
}
