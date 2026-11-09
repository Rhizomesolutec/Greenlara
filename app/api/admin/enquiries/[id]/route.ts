import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { updateStore } from "@/lib/store";
import type { Enquiry } from "@/lib/types";

const statuses: Enquiry["status"][] = ["new", "in_review", "closed"];

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/enquiries/[id]">) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: Enquiry["status"] } | null;
  if (!body?.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Choose a status." }, { status: 400 });
  }
  const updated = await updateStore((store) => {
    const enquiry = store.enquiries.find((item) => item.id === id);
    if (!enquiry) return { error: "Enquiry not found." };
    enquiry.status = body.status!;
    return { enquiry };
  });
  if ("error" in updated) return NextResponse.json(updated, { status: 404 });
  return NextResponse.json(updated);
}
