import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";

const SESSION_COOKIE = "cantamus_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SECRET must be set and at least 16 characters");
  }
  return secret;
}

/** Create an HMAC-signed session token */
async function signToken(userId: string): Promise<string> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const payload = `${userId}:${Date.now()}`;
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}:${sigHex}`;
}

/** Verify an HMAC-signed session token, return userId or null */
async function verifyToken(token: string): Promise<string | null> {
  const secret = getSecret();
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [userId, timestamp, sigHex] = parts;
  const age = Date.now() - Number(timestamp);
  if (age > SESSION_MAX_AGE * 1000 || age < 0) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const payload = `${userId}:${timestamp}`;
  const sigBytes = new Uint8Array(
    (sigHex.match(/.{2}/g) ?? []).map((b) => Number.parseInt(b, 16)),
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes,
    encoder.encode(payload),
  );
  return valid ? userId : null;
}

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const user = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.username, username),
  });
  if (!user) return false;

  const valid = await compare(password, user.passwordHash);
  if (!valid) return false;

  const token = await signToken(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
