"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { projects } from "@/data/projects";
import { ProjectCategory } from "@/types/portfolio";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, BookOpen, Layers, Search } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";

const categories: ProjectCategory[] = [
  "All",
  "Deep Learning",
  "Machine Learning",
  "Computer Vision",
  "Generative AI",
  "Applied Research",
  "Systems & Web",
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio Overview</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete Engineering Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Projects &amp; Engineering Work
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            A complete look at the systems I&apos;ve built and documented: tabular ML pipelines, deep learning NLP models, RAG chatbots, real-time in-browser vision, full-stack web software, and early research directions.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  selectedCategory === cat
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, title, or keywords..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {project.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      project.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : project.status === "Research Direction"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 mt-1">
                    {project.tagline}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                {/* Stack Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 text-[var(--text-muted)]">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="px-6 py-3.5 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repo</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)]">Research Draft</span>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#0ea5e9] hover:text-sky-300 group-hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Write-Up</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
