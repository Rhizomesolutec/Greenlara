import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <Prose eyebrow="Draft policy" title="Privacy Policy" lede="Replace this draft with your confirmed privacy notice before the shop goes live.">
      <p>Orders store the name, phone, email, and delivery address a customer submits. Wholesale enquiries and newsletter addresses are stored the same way, in the site data file for this demo.</p>
      <p>The shopping cart and wishlist stay in the browser. The admin session is an httpOnly cookie. Do not put this demo online with the sample environment values.</p>
      <p>Payment card or UPI details are not collected, because a payment gateway is not connected.</p>
    </Prose>
  );
}
