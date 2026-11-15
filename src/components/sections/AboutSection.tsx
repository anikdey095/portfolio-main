import { GraduationCap, MapPin, Compass, Code2, Sparkles, ArrowUpRight, FileText } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

export function AboutSection() {
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
              Where I Started
            </h3>
            <p>
              I started my Computer Science &amp; Engineering degree at Metropolitan University in Sylhet focusing on C/C++, data structures, and competitive problem solving. Learning how to break messy problems into clean logic on Beecrowd and Codeforces gave me a strong appreciation for correctness and debugging when things don&apos;t work on the first try.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Why AI &amp; Machine Learning
            </h3>
            <p>
              What drew me toward AI and Machine Learning was seeing how models can work on real-world problems where fixed rules fall short—like helping farmers pick crops from soil telemetry, classifying human emotion in text with neural sequence models, or building document Q&amp;A tools that cite their sources rather than guessing.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              What I&apos;m Learning &amp; Where I&apos;m Headed
            </h3>
            <p>
              Right now, I spend most of my time studying PyTorch architectures, RAG retrieval pipelines, and lightweight Computer Vision inference—especially how perception models might assist drivers on unstructured roadways like those in Bangladesh. My goal is to keep growing into a reliable AI/ML Engineer through internships, open-source engineering, and prospective graduate research.
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
                    PyTorch, Computer Vision, NLP, RAG Pipelines, Python &amp; Next.js
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
                    AI/ML Internships, Junior ML Roles &amp; Research Collaborations
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
