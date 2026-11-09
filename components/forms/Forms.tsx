"use client";

import { useState } from "react";

export function EnquiryForm({ type }: { type: "wholesale" | "contact" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      type,
      name: String(form.get("name") ?? ""),
      business: String(form.get("business") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      product: String(form.get("product") ?? ""),
      quantity: String(form.get("quantity") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setError(data.error ?? "The enquiry could not be sent.");
      return;
    }
    setStatus("done");
    event.currentTarget.reset();
  }

  if (status === "done") {
    return (
      <p className="rounded-[1.4rem] bg-white p-6 text-sm leading-6" role="status">
        Thank you. The enquiry is saved for the Green Lara team to review. This demo does not send an email.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        Name
        <input name="name" required className="field" autoComplete="name" />
      </label>
      {type === "wholesale" ? (
        <label className="grid gap-1 text-sm">
          Business Name
          <input name="business" required className="field" />
        </label>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Phone Number
          <input name="phone" required inputMode="numeric" pattern="[0-9]{10}" className="field" placeholder="10-digit mobile" />
        </label>
        <label className="grid gap-1 text-sm">
          Email
          <input name="email" type="email" required className="field" autoComplete="email" />
        </label>
      </div>
      {type === "wholesale" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Product Required
            <input name="product" required className="field" />
          </label>
          <label className="grid gap-1 text-sm">
            Required Quantity
            <input name="quantity" required className="field" placeholder="For example, 200 kg" />
          </label>
        </div>
      ) : null}
      <label className="grid gap-1 text-sm">
        Message
        <textarea name="message" required={type === "contact"} rows={4} className="field" />
      </label>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button type="submit" className="btn btn-dark mt-2 w-fit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : type === "wholesale" ? "Request Bulk Pricing" : "Send message"}
      </button>
    </form>
  );
}

export function BulkSection() {
  return (
    <section id="bulk" className="container-page py-16 md:py-24">
      <div className="grid gap-10 rounded-[2rem] bg-white p-6 md:p-10 lg:grid-cols-2 lg:p-12">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Wholesale</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Looking for Grains in Bulk?</h2>
          <p className="mt-5 text-base leading-7 text-muted">
            Whether you&apos;re a retailer, wholesaler, restaurant, distributor, or business, Green Lara helps you find the right products and quantities.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#bulk-form" className="btn btn-dark">Request Bulk Pricing</a>
            <a href="/contact" className="btn btn-line">Contact Our Team</a>
          </div>
        </div>
        <div id="bulk-form">
          <EnquiryForm type="wholesale" />
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Could not save that email.");
      return;
    }
    setDone(true);
  }

  return (
    <section className="container-page pb-20">
      <div className="rounded-[2rem] bg-peach px-6 py-14 text-center md:px-16">
        <h2 className="font-serif text-4xl md:text-5xl">Stay Connected With Green Lara.</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted">
          Leave an email for news about the shop. This demo saves the address. It does not send a message.
        </p>
        {done ? (
          <p className="mt-8 text-sm" role="status">You are on the list.</p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <input id="newsletter-email" name="email" type="email" required placeholder="Email address" className="field" />
            <button type="submit" className="btn btn-dark">Subscribe</button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      </div>
    </section>
  );
}
