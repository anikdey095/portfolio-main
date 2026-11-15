import Link from "next/link";
import { Mail, ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border-subtle)]">
          {/* Col 1: Identity & Academic Stage */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold tracking-tight text-[#0ea5e9]">
                AD
              </span>
              <span className="text-lg font-semibold text-[var(--text-primary)]">
                {profile.name}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              {profile.bio}
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  B.Sc. CSE @ Metropolitan University, Sylhet, Bangladesh (Dec 2026)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sylhet, Bangladesh — Preparing for AI/ML Graduate Study Abroad</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
              Architecture & Work
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <Link href="/#projects" className="hover:text-cyan-400 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/#research" className="hover:text-cyan-400 transition-colors">
                  Research Directions
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  AI Playground <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Interactive</span>
                </Link>
              </li>
              <li>
                <Link href="/#methodology" className="hover:text-cyan-400 transition-colors">
                  Engineering Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Network & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)]">
              Connect & Verify
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub / anikdey095
                  <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </a>
              </li>
              <li>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.socials.email}`}
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4" /> {profile.socials.email}
                </a>
              </li>
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:underline pt-1"
                >
                  Curriculum Vitae (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            <Link
              href="/admin"
              className="hover:text-[var(--text-secondary)] transition-colors"
              title="Admin"
            >
              ©
            </Link>{" "}
            {new Date().getFullYear()} {profile.name}. Built in Sylhet, Bangladesh.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Open to AI/ML Internships &amp; Research Collaborations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
