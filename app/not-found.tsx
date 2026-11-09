import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">404</p>
      <h1 className="mt-3 font-serif text-5xl">This page is not in the pantry.</h1>
      <p className="mt-4 max-w-md text-muted">The link may be old, or the product may have been removed.</p>
      <Link href="/shop" className="btn btn-dark mt-8">Back to the shop</Link>
    </div>
  );
}
