"use client";

import { useState } from "react";
import { skillCategories as defaultSkills } from "@/data/skills";
import type { SkillCategory } from "@/types/portfolio";
import { Cpu, Terminal, Check, Info } from "lucide-react";

export function TechStackSection({
  skillCategories = defaultSkills,
}: {
  skillCategories?: SkillCategory[];
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    skillCategories.find((c) => c.id === "deep-learning")?.id ||
      skillCategories[0]?.id ||
      ""
  );

  const activeCategory =
    skillCategories.find((c) => c.id === activeCategoryId) || skillCategories[0];

  return (
    <section id="stack" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
      <div className="space-y-3 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <Cpu className="w-4 h-4" />
          <span>Technical Profile & Competencies</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Core Technical Stack
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mt-1 leading-relaxed">
              Transparent, categorized technical competencies. Grouped by discipline with honest developmental status labels—no arbitrary proficiency percentages.
            </p>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)] self-start md:self-auto">
            Honest Status: &ldquo;Building with&rdquo; • &ldquo;Working with&rdquo; • &ldquo;Exploring&rdquo; • &ldquo;Focused on&rdquo;
          </div>
        </div>
      </div>

      {/* Category Tab Selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {skillCategories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-active)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Active Category Display */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {activeCategory.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {activeCategory.description}
          </p>
        </div>

        {/* Skill Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory.items.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 hover:border-cyan-500/30 hover:bg-[var(--bg-card-hover)] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors">
                    {item.name}
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.status === "Focused on"
                        ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                        : item.status === "Building with"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : item.status === "Exploring"
                        ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        : "bg-slate-500/15 text-slate-300 border-slate-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.focusArea && (
                  <div className="text-[11px] font-mono text-emerald-400">
                    {item.focusArea}
                  </div>
                )}

                {item.context && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.context}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
