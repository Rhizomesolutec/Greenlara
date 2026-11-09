"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "", phone: "", email: "" });
  const [saved, setSaved] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("greentara-profile");
    if (!raw) return;
    try {
      setProfile(JSON.parse(raw) as typeof profile);
    } catch {
      localStorage.removeItem("greentara-profile");
    }
  }, []);

  return (
    <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:py-20">
      <section>
        <h1 className="font-serif text-4xl md:text-6xl">Account</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          This profile stays in your browser. It is not a password account. Use it to keep your details handy, then find an order with its id and email.
        </p>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            localStorage.setItem("greentara-profile", JSON.stringify(profile));
            setSaved(true);
          }}
        >
          <label className="grid gap-1 text-sm">Name<input className="field" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">Mobile<input className="field" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">Email<input type="email" className="field" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
          <button type="submit" className="btn btn-dark w-fit">Save on this device</button>
          {saved ? <p className="text-sm">Saved in this browser.</p> : null}
        </form>
      </section>
      <section className="rounded-[1.6rem] bg-white p-6">
        <h2 className="font-serif text-3xl">Find an order</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/order/${orderId.trim()}?email=${encodeURIComponent(email.trim())}`);
          }}
        >
          <label className="grid gap-1 text-sm">Order id<input required className="field" value={orderId} onChange={(event) => setOrderId(event.target.value)} /></label>
          <label className="grid gap-1 text-sm">Email used at checkout<input required type="email" className="field" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <button type="submit" className="btn btn-line w-fit">Look up</button>
        </form>
      </section>
    </div>
  );
}
