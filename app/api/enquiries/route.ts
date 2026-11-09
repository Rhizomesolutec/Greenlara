import { NextRequest, NextResponse } from "next/server";
import { updateStore } from "@/lib/store";
import type { Enquiry } from "@/lib/types";
import { clean, validEmail, validPhone } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Partial<Enquiry> | null;
  if (!body) return NextResponse.json({ error: "The form is empty." }, { status: 400 });
  const type = body.type === "wholesale" ? "wholesale" : body.type === "contact" ? "contact" : null;
  if (!type) return NextResponse.json({ error: "Unknown enquiry." }, { status: 400 });
  const enquiry: Enquiry = {
    id: `ENQ${Date.now().toString(36).toUpperCase()}`,
    type,
    createdAt: new Date().toISOString(),
    name: clean(body.name, 80),
    business: clean(body.business, 120),
    phone: clean(body.phone, 10),
    email: clean(body.email, 120).toLowerCase(),
    product: clean(body.product, 160),
    quantity: clean(body.quantity, 80),
    message: clean(body.message, 1000),
    status: "new",
  };
  if (enquiry.name.length < 2 || !validPhone(enquiry.phone) || !validEmail(enquiry.email)) {
    return NextResponse.json({ error: "Add a name, a 10-digit phone number, and an email." }, { status: 400 });
  }
  if (type === "wholesale" && (!enquiry.business || !enquiry.product || !enquiry.quantity)) {
    return NextResponse.json({ error: "Add the business, product, and quantity." }, { status: 400 });
  }
  if (type === "contact" && enquiry.message.length < 4) {
    return NextResponse.json({ error: "Add a short message." }, { status: 400 });
  }
  await updateStore((store) => {
    store.enquiries.unshift(enquiry);
  });
  return NextResponse.json({ ok: true });
}
