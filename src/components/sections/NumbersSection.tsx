import { verifiedMetrics } from "@/data/metrics";
import { CheckCircle2 } from "lucide-react";

export function NumbersSection() {
  return (
    <section className="py-16 border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Verifiable Metrics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
              By the Numbers
            </h2>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] max-w-md">
            Grounded data points. No inflated statistics, no fabricated user counts or synthetic metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {verifiedMetrics.map((metric) => (
            <div
              key={metric.label}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-active)] hover:bg-[var(--bg-card-hover)] transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {metric.value}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {metric.label}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                {metric.detail}
              </p>
              <div className="text-[10px] font-mono text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2">
                Source: {metric.source}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
