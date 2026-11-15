"use client";

import { useState } from "react";
import { researchCards } from "@/data/research";
import { FlaskConical, ChevronDown, ChevronUp, AlertCircle, Sparkles, BookOpen, Compass } from "lucide-react";

export function ResearchSection() {
  const [expandedId, setExpandedId] = useState<string>(researchCards[0]?.id || "");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  return (
    <section id="research" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
          <FlaskConical className="w-4 h-4" />
          <span>Research Interests</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Research Directions &amp; Ideas
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mt-1 leading-relaxed">
              Early problem formulations and experiments I&apos;m working toward as preparation for graduate studies in Computer Vision and Applied Deep Learning.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 self-start md:self-auto">
            Status: Problem Formulations &amp; Early Experiments
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {researchCards.map((card) => {
          const isExpanded = expandedId === card.id;

          return (
            <div
              key={card.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-[var(--bg-card)] ${
                isExpanded
                  ? "border-emerald-500/50 shadow-lg shadow-emerald-950/20"
                  : "border-[var(--border-subtle)] hover:border-[var(--border-active)]"
              }`}
            >
              {/* Header trigger */}
              <button
                onClick={() => toggleExpand(card.id)}
                className="w-full text-left p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isExpanded}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Status: {card.status}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {card.domain}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-400/90 font-mono">
                    {card.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono text-[var(--text-muted)] hidden md:inline">
                    {isExpanded ? "Show Less" : "Read Details"}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Status Note Banner */}
              {card.statusNote && (
                <div className="px-6 sm:px-8 py-2 bg-emerald-950/15 border-t border-b border-emerald-500/20 flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{card.statusNote}</span>
                </div>
              )}

              {/* Deep Technical Card Body */}
              {isExpanded && (
                <div className="p-6 sm:p-8 pt-4 space-y-8 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 text-xs sm:text-sm text-[var(--text-secondary)] animate-in fade-in duration-200">
                  {/* Problem & Research Question */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                        01 — Problem Formulation
                      </div>
                      <p className="leading-relaxed">{card.problem}</p>
                    </div>

                    <div className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-2">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                        02 — Central Research Question
                      </div>
                      <p className="leading-relaxed font-mono text-xs text-[var(--text-primary)]">
                        {card.researchQuestion}
                      </p>
                    </div>
                  </div>

                  {/* Why it Matters & Research Gap */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-primary)] font-bold">
                        03 — Why It Matters
                      </span>
                      <p className="leading-relaxed">{card.whyItMatters}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                        04 — The Identified Research Gap
                      </span>
                      <p className="leading-relaxed">{card.researchGap}</p>
                    </div>
                  </div>

                  {/* Proposed Direction & Experiments */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-400 font-bold">
                        05 — Proposed Direction & Architecture
                      </span>
                      <p className="leading-relaxed">{card.proposedDirection}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-sky-400 font-bold">
                        06 — Empirical Experiments & Setup
                      </span>
                      <p className="leading-relaxed">{card.experiments}</p>
                    </div>
                  </div>

                  {/* Results & Limitations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                        07 — Current Results & Discoveries
                      </span>
                      <p className="leading-relaxed">{card.currentResults}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                        08 — Honest Limitations & Boundaries
                      </span>
                      <p className="leading-relaxed">{card.limitations}</p>
                    </div>
                  </div>

                  {/* Future Work & Tags */}
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-primary)] font-bold">
                        09 — Future Academic Trajectory (Graduate Target)
                      </span>
                      <p className="text-xs leading-relaxed">{card.futureWork}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 shrink-0 self-start sm:self-auto">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
