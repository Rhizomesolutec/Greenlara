import type { PaymentMethod } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clean(value: unknown, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

export function validEmail(value: string) {
  return emailPattern.test(value);
}

export function validPhone(value: string) {
  return /^\d{10}$/.test(value);
}

export function validPin(value: string) {
  return /^\d{6}$/.test(value);
}

export function isPaymentMethod(value: string): value is PaymentMethod {
  return value === "cod" || value === "upi" || value === "card" || value === "netbanking";
}

export function paymentPlan(method: PaymentMethod) {
  if (method === "cod") {
    return {
      paymentStatus: "pay_on_delivery" as const,
      paymentMessage:
        "Pay when the order is delivered. No online payment has been collected.",
    };
  }
  const gatewayReady = Boolean(
    process.env.PAYMENT_GATEWAY_KEY && process.env.PAYMENT_GATEWAY_SECRET,
  );
  return {
    paymentStatus: "awaiting_gateway" as const,
    paymentMessage: gatewayReady
      ? "The payment gateway keys are present, but a provider checkout is not connected. No payment has been taken. This order stays pending until you connect a gateway and mark it paid."
      : "A payment gateway is not connected. No payment has been taken. The order is saved with payment still pending.",
  };
}

export function allowedImage(value: string) {
  if (value.startsWith("/images/") || value.startsWith("/uploads/")) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "images.unsplash.com" || url.hostname === "upload.wikimedia.org")
    );
  } catch {
    return false;
  }
}
