"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderLookup({ id }: { id: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  return (
    <form
      className="container-page max-w-lg py-10"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/order/${id}?email=${encodeURIComponent(email.trim())}`);
      }}
    >
      <h2 className="font-serif text-3xl">Enter the checkout email</h2>
      <label className="mt-4 grid gap-1 text-sm">
        Email
        <input type="email" required className="field" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button type="submit" className="btn btn-dark mt-4">View order</button>
    </form>
  );
}
