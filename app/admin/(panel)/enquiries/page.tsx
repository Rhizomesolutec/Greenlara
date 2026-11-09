"use client";

import { useEffect, useState } from "react";
import type { Enquiry } from "@/lib/types";

export default function Page() {
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/enquiries")
      .then(async (response) => {
        const body = (await response.json()) as { enquiries?: Enquiry[]; error?: string };
        if (!response.ok || !body.enquiries) throw new Error(body.error ?? "Could not load enquiries.");
        setEnquiries(body.enquiries);
      })
      .catch((reason: Error) => setError(reason.message));
  }

  useEffect(load, []);

  async function update(id: string, status: Enquiry["status"]) {
    const response = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Could not update the enquiry.");
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Enquiries</h1>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
      {!enquiries ? <p className="mt-6">Loading enquiries…</p> : enquiries.length === 0 ? <p className="mt-6 text-muted">No enquiries yet.</p> : (
        <div className="mt-6 space-y-4">
          {enquiries.map((enquiry) => (
            <article key={enquiry.id} className="rounded-3xl bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.16em] text-muted uppercase">{enquiry.type} · {enquiry.id}</p>
                  <h2 className="mt-1 font-serif text-2xl">{enquiry.name}</h2>
                  <p className="text-sm text-muted">{enquiry.email} · {enquiry.phone}</p>
                </div>
                <label className="text-sm">
                  Status
                  <select className="field mt-1" value={enquiry.status} onChange={(event) => update(enquiry.id, event.target.value as Enquiry["status"])}>
                    <option value="new">new</option>
                    <option value="in_review">in review</option>
                    <option value="closed">closed</option>
                  </select>
                </label>
              </div>
              {enquiry.business ? <p className="mt-3 text-sm">Business: {enquiry.business}</p> : null}
              {enquiry.product ? <p className="text-sm">Product: {enquiry.product}</p> : null}
              {enquiry.quantity ? <p className="text-sm">Quantity: {enquiry.quantity}</p> : null}
              {enquiry.message ? <p className="mt-3 text-sm leading-6">{enquiry.message}</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
