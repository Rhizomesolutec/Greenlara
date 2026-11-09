import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";
import { brand, delivery, formatPrice } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function Page() {
  return (
    <Prose eyebrow="Draft policy" title="Shipping Policy" lede="Delivery coverage, partners, and timelines are not confirmed yet. Update this page with your real policy.">
      <p>The checkout shows a sample delivery charge of {formatPrice(delivery.fee)}, waived on sample orders of {formatPrice(delivery.freeOver)} and above. {brand.deliveryNote}</p>
      <p>An order moves through placed, confirmed, packed, shipped, and delivered when an administrator updates it. Those statuses are operational labels, not a live courier tracking feed.</p>
    </Prose>
  );
}
