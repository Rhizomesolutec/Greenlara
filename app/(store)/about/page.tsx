import type { Metadata } from "next";
import Link from "next/link";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story of Green Lara, a grains shop for everyday staples.",
};

export default function Page() {
  return (
    <Prose
      eyebrow="About Us"
      title="A shop for the grains people cook with."
      lede="Green Lara is being prepared as a place to buy rice, millets, wheat, pulses, seeds, and the staples that sit behind a good meal."
    >
      <p>
        This page is ready for the real story of the brand. It does not invent a founding year, a founder, or a farm. Those belong here when you choose to tell them.
      </p>
      <p>
        What the shop can already do is show a wide catalogue, take a retail order, and receive a bulk enquiry. Prices on the site are sample figures so the experience can be reviewed before your own prices are entered.
      </p>
      <p>
        <Link href="/quality" className="underline decoration-olive underline-offset-4">Read the quality promise</Link>
        {" · "}
        <Link href="/shop" className="underline decoration-olive underline-offset-4">Explore the catalogue</Link>
      </p>
    </Prose>
  );
}
