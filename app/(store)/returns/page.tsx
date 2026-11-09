import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Return and Refund Policy" };

export default function Page() {
  return (
    <Prose eyebrow="Draft policy" title="Return and Refund Policy" lede="This is a draft. Publish your own return window, exceptions, and refund method before selling.">
      <p>Nothing on this page promises a refund period, a replacement, or a free return. Grains are food, and your real policy should say which packs can come back and which cannot.</p>
      <p>If an order is cancelled in the admin dashboard, reserved stock is returned to the product. A refund of money is a separate step you take with the customer once a real payment exists.</p>
    </Prose>
  );
}
