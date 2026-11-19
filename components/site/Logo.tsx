import Image from "next/image";
import Link from "next/link";

export function Logo({
  href = "/",
  tone = "light",
  size = "md",
}: {
  href?: string;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const heightClass =
    size === "sm" ? "h-8" : size === "lg" ? "h-12 sm:h-14" : "h-10 sm:h-11";

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity duration-200 hover:opacity-90"
      aria-label="Green Lara home"
    >
      <Image
        src="/images/logo/greenlara-logo.png"
        alt="Green Lara"
        width={722}
        height={350}
        priority
        className={`${heightClass} w-auto object-contain ${
          tone === "dark" ? "brightness-0 opacity-85" : ""
        }`}
      />
    </Link>
  );
}
