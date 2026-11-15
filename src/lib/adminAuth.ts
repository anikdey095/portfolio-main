import crypto from "crypto";
import type { NextRequest } from "next/server";

export const COOKIE_NAME = "admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
}

const globalForAuth = globalThis as unknown as {
  adminLoginRateLimit?: Map<string, RateLimitEntry>;
};

const loginAttempts =
  globalForAuth.adminLoginRateLimit ?? new Map<string, RateLimitEntry>();
globalForAuth.adminLoginRateLimit = loginAttempts;

function getSessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  if (process.env.ADMIN_PASSWORD) {
    return crypto
      .createHash("sha256")
      .update(`session:${process.env.ADMIN_PASSWORD}`)
      .digest("hex");
  }
  return "";
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "local";
}

export function checkLoginRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) {
    return { allowed: true };
  }

  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }

  if (now - entry.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const existing = loginAttempts.get(ip);

  if (!existing || now - existing.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, {
      count: 1,
      firstAttemptAt: now,
      lockedUntil: 0,
    });
    return;
  }

  const nextCount = existing.count + 1;
  loginAttempts.set(ip, {
    count: nextCount,
    firstAttemptAt: existing.firstAttemptAt,
    lockedUntil: nextCount >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_MS : 0,
  });
}

export function clearFailedLogins(ip: string): void {
  loginAttempts.delete(ip);
}

export function verifyAdminPassword(input: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || !input) {
    return false;
  }

  const inputHash = crypto.createHash("sha256").update(input).digest();
  const configuredHash = crypto.createHash("sha256").update(configured).digest();
  return crypto.timingSafeEqual(inputHash, configuredHash);
}

export function createSessionToken(): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_DURATION_SECONDS * 1000;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${issuedAt}.${expiresAt}.${nonce}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): boolean {
  const secret = getSessionSecret();
  if (!secret || !token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const [issuedAtRaw, expiresAtRaw, nonce, signature] = parts;
  const issuedAt = Number(issuedAtRaw);
  const expiresAt = Number(expiresAtRaw);

  if (
    !Number.isFinite(issuedAt) ||
    !Number.isFinite(expiresAt) ||
    !nonce ||
    !signature ||
    expiresAt <= Date.now()
  ) {
    return false;
  }

  const payload = `${issuedAtRaw}.${expiresAtRaw}.${nonce}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (sigBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
