import type { Metadata } from "next";
import { EnquiryForm } from "@/components/forms/Forms";
import { brand } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-2">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Contact</p>
        <h1 className="mt-3 font-serif text-4xl md:text-6xl">Write to Green Lara.</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted">
          Questions about an order, a product, or a wholesale quantity can be sent here. The details below are placeholders.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div><dt className="text-muted">Email</dt><dd>{brand.email}</dd></div>
          <div><dt className="text-muted">Phone</dt><dd>{brand.phone}</dd></div>
          <div><dt className="text-muted">Address</dt><dd>{brand.address}</dd></div>
          <div><dt className="text-muted">Hours</dt><dd>{brand.hours}</dd></div>
        </dl>
      </div>
      <EnquiryForm type="contact" />
    </div>
  );
}
