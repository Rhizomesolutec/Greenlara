"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24">
      <h1 className="font-serif text-5xl">Something went wrong.</h1>
      <p className="mt-4 text-muted">The page could not be shown. You can try it again.</p>
      <button type="button" className="btn btn-dark mt-8" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
