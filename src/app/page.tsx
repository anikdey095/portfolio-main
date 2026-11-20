import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ExploringSection } from "@/components/sections/ExploringSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getPortfolioData } from "@/lib/portfolioDb";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar profile={data.profile} />

      <main className="flex-1">
        {/* 1. Authentic Personal Hero */}
        <Hero profile={data.profile} metrics={data.metrics} projects={data.projects} />

        {/* 2. Personal CSE Story & Direction */}
        <AboutSection profile={data.profile} />

        {/* 3. Real Engineering Projects (Problem / Approach / Lessons) */}
        <FeaturedProjects projects={data.projects} />

        {/* 4. Practical Technical Stack */}
        <TechStackSection skillCategories={data.skills} />

        {/* 5. Learning Journey Timeline */}
        <JourneySection journeyMilestones={data.journey} />

        {/* 6. What I'm Exploring Next */}
        <ExploringSection />

        {/* 7. Applied Research Directions */}
        <ResearchSection researchCards={data.research} />

        {/* 8. Subtle Interactive AI Playground Callout */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Interactive Sandbox</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Curious how embeddings, RAG chunking, or edge detection work visually?
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                I built an educational playground with interactive demos simulating semantic vector similarity, RAG retrieval pipelines, and bounding-box hazard confidence thresholds.
              </p>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-colors self-start md:self-auto shrink-0"
            >
              <span>Open Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 10. Friendly Contact & Open Invitation */}
        <ContactSection profile={data.profile} />
      </main>

      <Footer profile={data.profile} />
    </div>
  );
}
