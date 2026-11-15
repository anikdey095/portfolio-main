"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lock, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "LOGIN", password }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.message || "Invalid admin password.");
        setSubmitting(false);
        return;
      }

      setPassword("");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error while verifying credentials.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-5 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-[#0ea5e9]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                Private Admin Login
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Protected by HTTP-only session cookies
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="admin-password"
              className="text-xs font-mono text-[var(--text-secondary)]"
            >
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:border-[#0ea5e9] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-semibold text-xs font-mono transition-colors"
          >
            {submitting ? "Verifying..." : "Sign In to Admin Studio"}
          </button>

          <div className="text-center pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[#0ea5e9]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
