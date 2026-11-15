"use client";

import { useState } from "react";
import { Mail, FileText, Send, CheckCircle2, ArrowUpRight, Terminal, ExternalLink } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

interface DeliveryState {
  emailed: boolean;
  gmailUrl: string;
  mailtoUrl: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryState, setDeliveryState] = useState<DeliveryState | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanSubject = formData.subject.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setStatus("error");
      setErrorMessage("Please complete all required fields before sending.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const emailSubject = cleanSubject || `Portfolio Inquiry from ${cleanName}`;
    const emailBody = `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      profile.socials.email
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const mailtoUrl = `mailto:${profile.socials.email}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        setStatus("error");
        setErrorMessage(
          result.message || "Could not send message automatically. Please try again or email directly."
        );
        return;
      }

      setDeliveryState({
        emailed: Boolean(result.emailed),
        gmailUrl,
        mailtoUrl,
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error while sending message. Please try again or email directly.");
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Let&apos;s Connect &amp; Build Together.
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              I&apos;d love to hear from you—whether you&apos;re hiring for AI/ML internships or entry-level roles, collaborating on research, or just want to chat about machine learning.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={`mailto:${profile.socials.email}`}
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                    Primary Email (Gmail)
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                    {profile.socials.email}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors" />
            </a>

            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                    GitHub Profile
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                    github.com/anikdey095
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-cyan-400 transition-colors" />
            </a>

            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                    Professional Network
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">
                    linkedin.com/in/anik-dey-7723a4329
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-indigo-400 transition-colors" />
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400">
                    Verified Credentials
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-semibold text-cyan-300">
                    Download Academic CV (PDF)
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Right Interactive Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Send Me a Message
              </h3>
              <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                <Terminal className="w-3 h-3 text-[#0ea5e9]" /> Inbox + Gmail Delivery
              </span>
            </div>

            {status === "error" && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-mono">
                {errorMessage}
              </div>
            )}

            {status === "success" && deliveryState && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-3">
                <div className="flex items-start gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {deliveryState.emailed
                      ? `Message sent directly to ${profile.socials.email} and saved to the portfolio inbox.`
                      : "Message saved to portfolio inbox! You can also send a copy directly via Gmail below:"}
                  </span>
                </div>
                {!deliveryState.emailed && (
                  <div className="flex flex-wrap gap-2.5 pl-6">
                    <a
                      href={deliveryState.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Send via Gmail (Browser)</span>
                    </a>
                    <a
                      href={deliveryState.mailtoUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Email App (mailto)</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Jane Smith / Recruiter"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--text-secondary)]">
                Subject / Purpose
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="AI Engineering Role / Graduate Research Discussion"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--text-secondary)]">
                Message Content *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Share project details, research collaboration ideas, or interview scheduling..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{status === "submitting" ? "Sending Message..." : "Send Message to Anik Dey"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
