import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CartCheckout";

export const metadata: Metadata = { title: "Checkout" };

export default function Page() {
  return <CheckoutView />;
}
