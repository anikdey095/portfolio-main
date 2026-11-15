import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAME,
  checkLoginRateLimit,
  clearFailedLogins,
  createSessionToken,
  getClientIp,
  getSessionCookieOptions,
  recordFailedLogin,
  verifyAdminPassword,
  verifyAdminRequest,
} from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (verifyAdminRequest(req)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password } = body;

    if (action === "LOGOUT") {
      const res = NextResponse.json({
        success: true,
        message: "Logged out.",
      });
      res.cookies.set(COOKIE_NAME, "", {
        ...getSessionCookieOptions(0),
        expires: new Date(0),
      });
      return res;
    }

    if (action === "LOGIN") {
      if (!process.env.ADMIN_PASSWORD) {
        return NextResponse.json(
          {
            success: false,
            message: "Server ADMIN_PASSWORD is not configured.",
          },
          { status: 503 }
        );
      }

      const ip = getClientIp(req);
      const rate = checkLoginRateLimit(ip);
      if (!rate.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many failed login attempts. Try again in ${rate.retryAfterSeconds}s.`,
          },
          { status: 429 }
        );
      }

      if (typeof password !== "string" || !verifyAdminPassword(password)) {
        recordFailedLogin(ip);
        return NextResponse.json(
          { success: false, message: "Invalid admin password." },
          { status: 401 }
        );
      }

      clearFailedLogins(ip);
      const token = createSessionToken();
      const res = NextResponse.json({
        success: true,
        message: "Authenticated.",
      });
      res.cookies.set(COOKIE_NAME, token, getSessionCookieOptions());
      return res;
    }

    return NextResponse.json(
      { success: false, message: "Unsupported auth action." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
