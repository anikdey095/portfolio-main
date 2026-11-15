import { journeyMilestones } from "@/data/journey";
import { GitBranch, CheckCircle2, ArrowDown } from "lucide-react";

export function JourneySection() {
  return (
    <section id="journey" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
      <div className="space-y-3 mb-16">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0ea5e9]">
          <GitBranch className="w-4 h-4" />
          <span>Learning Timeline</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          My Learning &amp; Building Journey
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          How I moved from C++ and competitive programming fundamentals into building machine learning apps, deep learning models, and RAG tools.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10 space-y-12 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-emerald-500 before:to-indigo-500">
        {journeyMilestones.map((milestone, idx) => (
          <div key={milestone.step} className="relative group">
            {/* Step Node Marker */}
            <div className="absolute -left-[30px] sm:-left-[38px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--bg-card)] group-hover:border-cyan-400 flex items-center justify-center transition-all shadow-md">
              <span className="text-[11px] font-mono font-bold text-cyan-400">
                {milestone.step}
              </span>
            </div>

            {/* Content card */}
            <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                    {milestone.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">
                    {milestone.domain}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    {milestone.period}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {milestone.description}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
                  Key Milestones & Evidence:
                </div>
                <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                  {milestone.focusPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono mt-0.5">›</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Outcome: {milestone.keyOutcome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
