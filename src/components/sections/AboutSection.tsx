import { GraduationCap, MapPin, Compass, Code2, Sparkles, ArrowUpRight, FileText } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile as defaultProfile } from "@/data/profile";

export function AboutSection({ profile = defaultProfile }: { profile?: typeof defaultProfile }) {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[var(--border-subtle)]/70"
    >
      {/* Section Header */}
      <div className="space-y-3 mb-12 max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Me</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          A CSE student learning AI by building real systems.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Authentic First-Person Story */}
        <div className="lg:col-span-7 space-y-6 text-base text-[var(--text-secondary)] leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Background &amp; Story
            </h3>
            <p>
              {profile.bio?.trim() ||
                "I started my Computer Science & Engineering degree at Metropolitan University in Sylhet focusing on C/C++, data structures, and competitive problem solving."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Near-Term Focus
            </h3>
            <p>
              {profile.careerVision?.nearTerm?.trim() ||
                "What drew me toward AI and Machine Learning was seeing how models can work on real-world problems where fixed rules fall short—like crop telemetry, emotion classification in text, and grounded document Q&A."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Long-Term Engineering Direction
            </h3>
            <p>
              {profile.careerVision?.longTerm?.trim() ||
                "Become an AI/ML Engineer and applied researcher, specializing in Machine Learning, Deep Learning, and Agentic AI. My goal is to design and build reliable, scalable, and autonomous intelligent systems that can reason, make decisions, use tools, and solve real-world problems through engineering, research, and innovation."}
            </p>
          </div>
        </div>

        {/* Right Column: Clean Personal "At a Glance" Panel */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 p-6 sm:p-7 space-y-6">
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                At a Glance
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Current background, focus, and links
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-[#0ea5e9] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {profile.education.degree}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {profile.education.institution} · Class of {profile.education.expectedGraduation}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0ea5e9] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    {profile.location}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Open to remote &amp; international opportunities
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Code2 className="w-4 h-4 text-[#0ea5e9] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Core Focus Areas
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {profile.education?.currentFocus?.trim() ||
                      "PyTorch, Computer Vision, NLP, RAG Pipelines, Python & Next.js"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#0ea5e9] mt-1 shrink-0" />
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Looking For
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {profile.education?.targetPath?.trim() ||
                      "AI/ML Internships, Junior ML Roles & Research Collaborations"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap gap-2.5">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[#0ea5e9]/50 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>

              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[#0ea5e9]/50 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>

              <a
                href={profile.socials.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0ea5e9]/30 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/15 text-xs font-medium text-[#0ea5e9] transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
