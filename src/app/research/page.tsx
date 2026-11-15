import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { getPortfolioData } from "@/lib/portfolioDb";
import { FlaskConical, ArrowLeft, GraduationCap, Compass, BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const data = await getPortfolioData();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar profile={data.profile} />

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

        {/* Page Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-mono">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>Academic Agendas & Research Formulations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            AI Research Directions
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Structuring rigorous research questions around computer vision on unstructured South Asian roads, affective NLP sequence modeling, and grounded retrieval architectures in preparation for international graduate scholarship.
          </p>
        </div>

        {/* Academic Statement Banner */}
        <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>Graduate Admissions & Research Alignment</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Preparing for Master&apos;s Study in AI / Computer Vision
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Upon finishing my B.Sc. in Computer Science and Engineering in December 2026, I am preparing for IELTS and targeting international graduate research labs. I seek environments that combine rigorous algorithmic theory with high-impact applied systems.
            </p>
          </div>

          <Link
            href="/#contact"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all shrink-0 self-start md:self-center"
          >
            Discuss Graduate Research
          </Link>
        </div>

        {/* Research Cards Section */}
        <ResearchSection researchCards={data.research} />
      </main>

      <Footer profile={data.profile} />
    </div>
  );
}
