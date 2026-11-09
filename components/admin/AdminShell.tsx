"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  ["/admin", "Overview"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/orders", "Orders"],
  ["/admin/enquiries", "Enquiries"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand md:grid md:grid-cols-[15rem_1fr]">
      <aside className="bg-forest text-cream md:min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/admin" className="font-serif text-2xl">Green Lara</Link>
          <p className="mt-1 hidden text-xs tracking-[0.16em] text-cream/60 uppercase md:block">Admin</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:px-3">
          {links.map(([href, label]) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`block rounded-full px-4 py-2 text-sm whitespace-nowrap ${active ? "bg-cream text-forest" : "text-cream/80"}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-4 px-5 py-4 text-sm md:block md:space-y-3">
          <Link href="/" className="block text-cream/70">View store</Link>
          <button type="button" onClick={logout} className="text-cream/70">Log out</button>
        </div>
      </aside>
      <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
