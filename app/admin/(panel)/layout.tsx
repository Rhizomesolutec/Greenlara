import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
