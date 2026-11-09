import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartCheckout";

export const metadata: Metadata = { title: "Cart" };

export default function Page() {
  return <CartView />;
}
