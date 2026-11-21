import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/adminAuth";
import { connectToDatabase, sanitizeDbError } from "@/lib/mongodb";
import { MessageModel } from "@/models";

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CONTACT_SUBMISSIONS = 5;

const globalForContact = globalThis as unknown as {
  contactRateLimit?: Map<string, { count: number; firstAttemptAt: number }>;
};

const contactAttempts =
  globalForContact.contactRateLimit ??
  new Map<string, { count: number; firstAttemptAt: number }>();
globalForContact.contactRateLimit = contactAttempts;

function checkInMemoryRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const existing = contactAttempts.get(ip);

  if (!existing || now - existing.firstAttemptAt > RATE_WINDOW_MS) {
    contactAttempts.set(ip, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (existing.count >= MAX_CONTACT_SUBMISSIONS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(
        (existing.firstAttemptAt + RATE_WINDOW_MS - now) / 1000
      ),
    };
  }

  contactAttempts.set(ip, {
    count: existing.count + 1,
    firstAttemptAt: existing.firstAttemptAt,
  });
  return { allowed: true };
}

function sanitizeInput(
  value: unknown,
  maxLen: number,
  preserveNewlines = false
): string {
  const str = String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(
      preserveNewlines
        ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
        : /[\u0000-\u001F\u007F]/g,
      ""
    )
    .trim();
  return str.slice(0, maxLen);
}

function computeMessageHash(email: string, subject: string, message: string): string {
  const normalized = `${email.toLowerCase()}|${subject.toLowerCase()}|${message.replace(/\s+/g, " ").toLowerCase()}`;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json();

    const cleanName = sanitizeInput(body?.name, 120);
    const cleanEmail = sanitizeInput(body?.email, 160);
    const cleanSubject = sanitizeInput(body?.subject, 200);
    const cleanMessage = sanitizeInput(body?.message, 5000, true);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const finalSubject = cleanSubject || `Portfolio Inquiry from ${cleanName}`;
    const contentHash = computeMessageHash(cleanEmail, finalSubject, cleanMessage);
    const windowStart = new Date(Date.now() - RATE_WINDOW_MS);

    let savedToDb = false;
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      await connectToDatabase();

      // Serverless-safe duplicate message protection (same email+subject+message within 10 mins)
      const duplicate = await MessageModel.findOne({
        contentHash,
        dbCreatedAt: { $gte: windowStart },
      })
        .select("id")
        .lean();

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            message:
              "Duplicate message detected. Your previous identical inquiry was already received.",
          },
          { status: 429 }
        );
      }

      // Serverless-safe per-IP rate limiting via MongoDB
      const recentCount = await MessageModel.countDocuments({
        clientIp: ip,
        dbCreatedAt: { $gte: windowStart },
      });

      if (recentCount >= MAX_CONTACT_SUBMISSIONS) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Too many messages sent recently. Please wait a few minutes before sending another.",
          },
          { status: 429 }
        );
      }

      await MessageModel.create({
        id: messageId,
        name: cleanName,
        email: cleanEmail,
        subject: finalSubject,
        message: cleanMessage,
        createdAt: new Date().toISOString(),
        contentHash,
        clientIp: ip,
        emailStatus: "pending",
        deliveryError: "",
      });
      savedToDb = true;
    } catch (dbErr) {
      console.error("Failed to persist contact message:", sanitizeDbError(dbErr));
      const fallbackRate = checkInMemoryRateLimit(ip);
      if (!fallbackRate.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many messages sent recently. Please try again in ${fallbackRate.retryAfterSeconds}s.`,
          },
          { status: 429 }
        );
      }
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey || /^(YOUR_|your_|<.*>|placeholder)/i.test(accessKey)) {
      if (savedToDb) {
        await MessageModel.updateOne(
          { id: messageId },
          {
            $set: {
              emailStatus: "saved_in_db",
              deliveryError: "WEB3FORMS_ACCESS_KEY not configured",
            },
          }
        ).catch(() => {});

        return NextResponse.json({
          success: true,
          saved: true,
          id: messageId,
          message: `Thank you, ${cleanName}! Your message has been received and saved to my inbox.`,
        });
      }
      return NextResponse.json(
        {
          success: false,
          saved: false,
          id: messageId,
          message: "Email delivery is pending server configuration. Please email anikd1452@gmail.com directly.",
        },
        { status: 503 }
      );
    }

    try {
      const relayRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: finalSubject,
          from_name: cleanName,
          name: cleanName,
          email: cleanEmail,
          replyto: cleanEmail,
          message: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${finalSubject}\n\nMessage:\n${cleanMessage}`,
        }),
      });

      const contentType = relayRes.headers.get("content-type") || "";
      const relayData = contentType.includes("application/json")
        ? await relayRes.json().catch(() => null)
        : null;

      if (relayRes.ok && relayData?.success === true) {
        if (savedToDb) {
          await MessageModel.updateOne(
            { id: messageId },
            { $set: { emailStatus: "delivered", deliveryError: "" } }
          ).catch(() => {});
        }
        return NextResponse.json({
          success: true,
          saved: savedToDb,
          id: messageId,
          message: `Thank you, ${cleanName}! Your message has been delivered directly to anikd1452@gmail.com.`,
        });
      }

      const reason =
        relayRes.status === 403 && !contentType.includes("application/json")
          ? "Web3Forms blocked server-side relay (HTTP 403 Cloudflare challenge on free tier)."
          : relayData?.message
          ? `Web3Forms error (HTTP ${relayRes.status}): ${String(relayData.message).slice(0, 120)}`
          : `Web3Forms returned HTTP ${relayRes.status}`;

      if (savedToDb) {
        await MessageModel.updateOne(
          { id: messageId },
          { $set: { emailStatus: "saved_in_db", deliveryError: reason } }
        ).catch(() => {});

        return NextResponse.json({
          success: true,
          saved: true,
          forwardKey: accessKey,
          id: messageId,
          message: `Thank you, ${cleanName}! Your message has been received and saved. I will get back to you soon.`,
        });
      }

      return NextResponse.json(
        {
          success: false,
          saved: false,
          id: messageId,
          message: "Email delivery failed via Web3Forms. Please email anikd1452@gmail.com directly.",
        },
        { status: 502 }
      );
    } catch (relayErr) {
      console.error("Web3Forms network error:", sanitizeDbError(relayErr));
      if (savedToDb) {
        await MessageModel.updateOne(
          { id: messageId },
          {
            $set: {
              emailStatus: "saved_in_db",
              deliveryError: "Network error reaching Web3Forms",
            },
          }
        ).catch(() => {});

        return NextResponse.json({
          success: true,
          saved: true,
          forwardKey: accessKey,
          id: messageId,
          message: `Thank you, ${cleanName}! Your message has been received and saved. I will get back to you soon.`,
        });
      }
      return NextResponse.json(
        {
          success: false,
          saved: false,
          id: messageId,
          message: "Email delivery failed due to a network error. Please email anikd1452@gmail.com directly.",
        },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid contact submission." },
      { status: 400 }
    );
  }
}
