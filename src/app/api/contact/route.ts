import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src", "data", "content.json");

interface ContactMessagePayload {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cleanName = String(body.name || "").trim();
    const cleanEmail = String(body.email || "").trim();
    const cleanSubject = String(body.subject || "").trim();
    const cleanMessage = String(body.message || "").trim();

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

    const newMessage: ContactMessagePayload = {
      id: `msg-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || `Inquiry from ${cleanName}`,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
    };

    let saved = false;
    try {
      let parsed: Record<string, unknown> = {};
      try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }

      const existingMessages = Array.isArray(parsed.messages)
        ? parsed.messages
        : [];
      parsed.messages = [newMessage, ...existingMessages];

      await fs.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      saved = true;
    } catch (fsErr) {
      console.warn("Could not write contact message to content.json:", fsErr);
    }

    let emailed = false;
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    if (accessKey) {
      try {
        const relayRes = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            from_name: "Anik Dey Portfolio Contact Form",
            name: cleanName,
            email: cleanEmail,
            replyto: cleanEmail,
            subject: cleanSubject || `Portfolio Inquiry from ${cleanName}`,
            message: cleanMessage,
          }),
        });
        const relayData = await relayRes.json();
        emailed = Boolean(relayRes.ok && relayData?.success);
      } catch (relayErr) {
        console.warn("Web3Forms relay failed:", relayErr);
      }
    }

    if (!saved && !emailed) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to save or send your message automatically.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailed,
      saved,
      id: newMessage.id,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
