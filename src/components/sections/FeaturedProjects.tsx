import Link from "next/link";
import { projects } from "@/data/projects";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  FolderGit2,
} from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";

export function FeaturedProjects() {
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
    .slice(0, 6);

  return (
    <section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[var(--border-subtle)]/70"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Selected Engineering Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Projects Built From Real Problems
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Each project starts with a concrete problem—working through the data and system constraints, shipping a usable solution, and noting what worked and what broke along the way.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[#0ea5e9]/40 text-sm font-medium text-[var(--text-primary)] transition-colors self-start md:self-auto shrink-0"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-4 h-4 text-[#0ea5e9]" />
        </Link>
      </div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featured.map((project, idx) => {
          const isLead = idx === 0;
          return (
            <article
              key={project.id}
              className={`group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[#0ea5e9]/40 transition-colors flex flex-col justify-between overflow-hidden ${isLead ? "lg:col-span-2" : ""
                }`}
            >
              <div className="p-6 sm:p-7 space-y-5">
                {/* Meta & Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-[#0ea5e9] font-medium">
                      {project.category}
                    </span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--text-muted)]">
                      {project.domain}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                    {project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[#0ea5e9] transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Engineering Narrative: Problem / Approach / Challenges */}
                {project.problem && project.approach && project.challenges ? (
                  <div
                    className={`grid grid-cols-1 ${isLead ? "md:grid-cols-3" : ""
                      } gap-4 pt-1`}
                  >
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)]/80 space-y-1">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#0ea5e9]">
                        Problem
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)]/80 space-y-1">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                        Approach
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.approach}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)]/80 space-y-1">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                        Challenge &amp; Lesson
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.challenges}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {project.summary}
                  </p>
                )}

                {/* Metrics Row */}
                {project.metrics && project.metrics.length > 0 && (
                  <div
                    className={`grid grid-cols-2 ${project.metrics.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
                      } gap-3 pt-1`}
                  >
                    {project.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="px-3 py-2.5 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)]"
                      >
                        <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                          {metric.value}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] leading-snug">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 sm:px-7 py-4 bg-[var(--bg-secondary)]/55 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
                <div className="flex items-center gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-[#0ea5e9] hover:text-sky-300 font-semibold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Full Write-Up</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
