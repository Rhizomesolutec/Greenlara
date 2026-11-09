"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { authenticated?: boolean; configured?: boolean }) => {
        setConfigured(Boolean(data.configured));
        if (data.authenticated) router.replace(params.get("next") || "/admin");
      })
      .catch(() => setConfigured(false));
  }, [params, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const data = (await response.json()) as { error?: string };
    setSending(false);
    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }
    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-[1.6rem] bg-white p-8">
        <p className="font-serif text-4xl">Green Lara</p>
        <h1 className="mt-2 text-sm text-muted">Admin sign in</h1>
        {!configured ? (
          <p className="mt-4 text-sm leading-6">
            Sign-in is not configured. Add ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET to the environment.
          </p>
        ) : null}
        <label className="mt-6 grid gap-1 text-sm">Email<input name="email" type="email" required className="field" /></label>
        <label className="mt-3 grid gap-1 text-sm">Password<input name="password" type="password" required className="field" /></label>
        {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
        <button type="submit" className="btn btn-dark mt-6" disabled={sending}>{sending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
