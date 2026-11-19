import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Returns the secret key string used for signing and verifying tokens
 */
function getSecretString(): string {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_SESSION_TOKEN ||
    "portfolio-admin-super-secure-jwt-secret-key-2026"
  );
}

/**
 * Helper to import secret as a CryptoKey for Web Crypto HMAC-SHA256
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const secret = getSecretString();
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface AdminSessionPayload {
  role: "admin";
  email: string;
  sessionId: string;
  iat: number;
  exp: number;
}

/**
 * Generates a dynamic, cryptographically signed admin session token.
 * A new unique token with a new sessionId & timestamp is generated for EVERY login.
 */
export async function createAdminSessionToken(email?: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await getCryptoKey();

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    role: "admin",
    email: email || process.env.ADMIN_EMAIL || "admin@portfolio.com",
    sessionId: crypto.randomUUID(),
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days expiration
  };

  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const signatureB64 = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Validates a session token string.
 * Verifies HMAC signature, role, and expiration date.
 */
export async function verifyAdminSessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;

  // Static override support for testing/dev environments if explicitly configured
  const staticToken = process.env.ADMIN_SESSION_TOKEN;
  if (staticToken && staticToken !== "authenticated_admin_token_active" && token === staticToken) {
    return true;
  }

  // Expect formatted payload.signature
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  try {
    const [payloadB64, signatureB64] = parts;
    const key = await getCryptoKey();
    const encoder = new TextEncoder();

    const signatureBytes = base64UrlDecode(signatureB64);
    const isValidSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadB64)
    );

    if (!isValidSignature) {
      return false;
    }

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload: AdminSessionPayload = JSON.parse(payloadJson);

    // Verify role and validity window
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== "admin") return false;
    if (payload.exp && payload.exp < now) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Verifies the current admin session from incoming cookies
 */
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  return await verifyAdminSessionToken(session);
}

/**
 * Route protection helper for API endpoints
 */
export async function requireAdminAuth() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access. Please login." },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Deprecated fallback for backwards compatibility
 */
export function getAdminSessionToken(): string {
  return (
    process.env.ADMIN_SESSION_TOKEN ||
    process.env.NEXTAUTH_SECRET ||
    "authenticated_admin_token_active"
  );
}
