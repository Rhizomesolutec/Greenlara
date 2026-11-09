const COOKIE = "gt_session";
const MAX_AGE = 60 * 60 * 12;

export function sessionCookieName() {
  return COOKIE;
}

export function sessionMaxAge() {
  return MAX_AGE;
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) return null;
  return value;
}

export function adminConfigured() {
  return Boolean(
    secret() && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD,
  );
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(mode: "sign" | "verify") {
  const value = secret();
  if (!value) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(value),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [mode],
  );
}

export async function createSessionToken() {
  const key = await hmacKey("sign");
  if (!key) throw new Error("AUTH_SECRET is not configured");
  const payload = bytesToBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ role: "admin", exp: Date.now() + MAX_AGE * 1000 }),
    ),
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const key = await hmacKey("verify");
  if (!key) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(payload),
  );
  if (!valid) return false;
  try {
    const json = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payload)),
    ) as { role?: string; exp?: number };
    return json.role === "admin" && typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}
