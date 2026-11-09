import type { Metadata } from "next";
import { BulkSection } from "@/components/forms/Forms";

export const metadata: Metadata = {
  title: "Bulk orders",
  description: "Request bulk pricing from Green Lara.",
};

export default function Page() {
  return <BulkSection />;
}
