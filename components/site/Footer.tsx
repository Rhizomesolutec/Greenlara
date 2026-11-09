import Link from "next/link";
import type { Category } from "@/lib/types";
import { brand, socials } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-auto bg-forest text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo href="/" tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-cream/75">
            Green Lara is a grains shop for rice, millets, wheat, pulses, seeds, and everyday staples.
            Contact details below are placeholders until the real ones are added.
          </p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.18em] text-olive uppercase">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/quality" className="hover:text-white">Our Quality</Link></li>
            <li><Link href="/wholesale" className="hover:text-white">Bulk orders</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs tracking-[0.18em] text-olive uppercase">Shop categories</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-cream/80">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/shop/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs tracking-[0.18em] text-olive uppercase">Customer support</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link href="/account" className="hover:text-white">Find an order</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-white">Return and Refund Policy</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms and Conditions</Link></li>
          </ul>
          <div className="mt-6 space-y-1 text-sm text-cream/80">
            <p>{brand.email}</p>
            <p>{brand.phone}</p>
            <p>{brand.address}</p>
            <p>{brand.hours}</p>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            {socials.map((item) => (
              <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className="text-cream/80 hover:text-white">
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-cream/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Green Lara. All rights reserved.</p>
          <p>Social links open the platforms until brand profiles are added.</p>
        </div>
      </div>
    </footer>
  );
}
