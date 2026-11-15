import { philosophySteps } from "@/data/philosophy";
import { Terminal, Check, Layers, Cpu, Compass, FileCheck } from "lucide-react";

export function PhilosophySection() {
  return (
    <section id="methodology" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <Terminal className="w-4 h-4" />
          <span>Disciplined Engineering</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          How I Build: Engineering Methodology
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Intelligent systems require more than running tutorial notebooks. My development cycle is structured around reproducible pipelines, adversarial evaluation, and strict domain validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {philosophySteps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-cyan-500/40 hover:bg-[var(--bg-card-hover)] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-cyan-400 group-hover:text-cyan-300">
                  {step.stepNumber}
                </span>
                <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
                  Phase {step.stepNumber}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-mono text-emerald-400/90 mt-0.5">
                  {step.tagline}
                </p>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <div className="flex items-start gap-2 text-[11px] text-[var(--text-primary)] font-medium">
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{step.engineeringAction}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                <FileCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Artifact: {step.artifact}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
