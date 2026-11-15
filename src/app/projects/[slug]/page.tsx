import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPortfolioData, getProjectWithCaseStudyBySlug } from "@/lib/portfolioDb";
import { ArrowLeft, ExternalLink, AlertTriangle, Info, CheckCircle2, BookOpen, Terminal, Layers } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";

export const dynamic = "force-dynamic";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [{ project, study }, portfolio] = await Promise.all([
    getProjectWithCaseStudyBySlug(slug),
    getPortfolioData(),
  ]);

  if (!study || !project) {
    notFound();
  }

  const sectionsList = [
    study.sections.overview,
    study.sections.problem,
    study.sections.motivation,
    study.sections.dataset,
    study.sections.dataProcessing,
    study.sections.baseline,
    study.sections.architecture,
    study.sections.methodology,
    study.sections.experiments,
    study.sections.evaluation,
    study.sections.errorAnalysis,
    study.sections.engineeringDecisions,
    study.sections.challenges,
    study.sections.deployment,
    study.sections.limitations,
    study.sections.futureWork,
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar profile={portfolio.profile} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-8">
          <Link href="/" className="hover:text-cyan-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-cyan-400">
            Projects
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] truncate">{project.title}</span>
        </div>

        {/* Engineering Document Header */}
        <div className="p-6 sm:p-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] mb-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {project.category}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {project.domain}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                  project.status === "Completed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : project.status === "Research Direction"
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                Status: {project.status}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                DOC-REF: CS-{study.projectId.toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {study.title}
            </h1>
            <p className="text-sm sm:text-base font-mono text-emerald-400/90 mt-2">
              {study.subtitle}
            </p>
          </div>

          {project.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] max-h-[420px]">
              <img
                src={project.imageUrl}
                alt={`${project.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {project.galleryImages.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] aspect-[16/10]"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} gallery ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action Links (17 GitHub & 18 Demo) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-cyan-500/40 text-xs font-mono text-[var(--text-primary)] hover:text-cyan-400 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>17. Source Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>18. Interactive Demonstration</span>
              </a>
            )}
          </div>
        </div>

        {/* Main 18-Point Document Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Table of Contents Sticky Bar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Document Outline</span>
              </div>
              <nav className="space-y-1 text-xs font-mono max-h-[70vh] overflow-y-auto pr-1">
                {sectionsList.map((sec) => (
                  <a
                    key={sec.number}
                    href={`#section-${sec.number}`}
                    className="block px-2 py-1 rounded text-[var(--text-muted)] hover:text-cyan-400 hover:bg-[var(--bg-secondary)] transition-colors truncate"
                  >
                    {sec.number} — {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Document Sections */}
          <div className="lg:col-span-9 space-y-12">
            {sectionsList.map((sec) => (
              <section
                key={sec.number}
                id={`section-${sec.number}`}
                className="scroll-mt-28 p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {sec.number}
                  </span>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {sec.title}
                  </h2>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {sec.content}
                </p>

                {/* Bullets if present */}
                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-[var(--text-secondary)]">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono mt-0.5">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Alert callouts if present */}
                {sec.alert && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm font-mono ${
                      sec.alert.type === "warning"
                        ? "bg-amber-950/20 border-amber-500/30 text-amber-300"
                        : "bg-cyan-950/20 border-cyan-500/30 text-cyan-300"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>{sec.alert.text}</span>
                  </div>
                )}

                {/* Tables if present */}
                {sec.table && (
                  <div className="pt-3 overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left border border-[var(--border-subtle)] rounded-lg overflow-hidden">
                      <thead className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]">
                        <tr>
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-2.5 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-[var(--bg-card-hover)] transition-colors"
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-2.5 ${
                                  cIdx === 0
                                    ? "font-bold text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)]"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sec.table.caption && (
                      <div className="text-[10px] font-mono text-[var(--text-muted)] mt-1.5 italic">
                        Table: {sec.table.caption}
                      </div>
                    )}
                  </div>
                )}

                {/* Code Snippets if present */}
                {sec.codeSnippet && (
                  <div className="pt-3 space-y-1">
                    <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-x-auto">
                      <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
                        <code>{sec.codeSnippet.code}</code>
                      </pre>
                    </div>
                    {sec.codeSnippet.caption && (
                      <div className="text-[10px] font-mono text-[var(--text-muted)] italic">
                        Listing: {sec.codeSnippet.caption}
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}

            {/* Back link */}
            <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to All Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={portfolio.profile} />
    </div>
  );
}
