"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu, X } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { ThemeToggle } from "./ThemeToggle";
import { profile as defaultProfile } from "@/data/profile";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/#projects" },
  { name: "Skills", href: "/#stack" },
  { name: "Journey", href: "/#journey" },
  { name: "Research", href: "/#research" },
  { name: "Playground", href: "/playground" },
];

export function Navbar({ profile = defaultProfile }: { profile?: typeof defaultProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-lg shadow-black/15 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Clean Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--text-primary)] hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="text-base font-bold tracking-tight text-[#0ea5e9]">
            AD
          </span>
          <span className="text-sm sm:text-base font-medium tracking-tight">
            {profile.name}
          </span>
        </Link>

        {/* Flat Center Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {navLinks.map((item) => {
            const isActive =
              (item.href === "/" && pathname === "/") ||
              (item.href === "/playground" && pathname === "/playground") ||
              (item.href === "/#projects" && pathname.startsWith("/projects")) ||
              (item.href === "/#research" && pathname.startsWith("/research"));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              title="GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          <ThemeToggle />

          <Link
            href="/#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors"
          >
            Contact
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-xl px-4 py-4 space-y-3 mt-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[#0ea5e9] hover:border-sky-500/30 transition-all text-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold text-xs text-center transition-colors"
          >
            Get in Touch
          </Link>
          <div className="flex items-center justify-around pt-3 border-t border-[var(--border-subtle)]">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#0ea5e9]"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[#0ea5e9]"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a
              href={profile.socials.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#0ea5e9] font-medium"
            >
              <FileText className="w-4 h-4" /> Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
