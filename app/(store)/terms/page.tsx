import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function Page() {
  return (
    <Prose eyebrow="Draft policy" title="Terms and Conditions" lede="These are draft terms for the Green Lara demo. Have them reviewed before you take real orders.">
      <p>Catalogue prices are sample figures. A real order should use the prices you publish in the admin dashboard.</p>
      <p>Placing an order records a request. It is not a completed online payment unless the payment status says paid, and only an administrator should set that after money is actually received.</p>
      <p>Product descriptions, weights, and availability can change. If a weight is out of stock, the order will not be accepted for that line.</p>
    </Prose>
  );
}
