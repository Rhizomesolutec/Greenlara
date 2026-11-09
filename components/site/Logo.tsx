import Link from "next/link";

export function Logo({ href = "/", tone = "dark" }: { href?: string; tone?: "dark" | "light" }) {
  return (
    <Link href={href} className="inline-flex items-baseline gap-2" aria-label="Green Lara home">
      <span
        className={`font-serif text-[1.55rem] leading-none tracking-[-0.03em] ${
          tone === "light" ? "text-cream" : "text-forest"
        }`}
      >
        Green Lara
      </span>
    </Link>
  );
}
