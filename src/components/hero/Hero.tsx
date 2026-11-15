"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { MobileHeroVisual } from "./MobileHeroVisual";

const NeuralScene = dynamic(
  () => import("./NeuralScene").then((mod) => mod.NeuralScene),
  {
    ssr: false,
    loading: () => <MobileHeroVisual />,
  }
);

const heroHighlights = [
  {
    value: "99.55%",
    label: "CropPulse AI Test Accuracy",
  },
  {
    value: "~90.1%",
    label: "Moodline BiGRU Validation",
  },
  {
    value: "5+",
    label: "Deployed AI & Web Projects",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle 3D Constellation & Deep Navy Radial Glow */}
      <NeuralScene />
      <div className="absolute inset-0 neural-radial pointer-events-none" aria-hidden="true" />

      {/* Main Centered Hero Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center pt-6">
        {/* Left Column: Natural Personal Introduction */}
        <div className="lg:col-span-7 space-y-7 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 text-xs font-medium text-[var(--text-secondary)]">
            <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
            <span>CSE Student · Aspiring AI/ML Engineer</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.12]">
              <span className="block text-[#0ea5e9]">Hi, I&apos;m {profile.name},</span>
              <span className="block text-[var(--text-primary)]">building AI that works.</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              I&apos;m an undergraduate Computer Science student at Metropolitan University exploring Machine Learning, Computer Vision, and RAG systems—learning through real code, honest experiments, and practical engineering.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-sky-500/15"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={profile.socials.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border-active)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-card)] text-[var(--text-primary)] font-medium text-sm transition-colors"
            >
              <Download className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* Right Column: Clean Circular Framed Portrait */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[350px] lg:h-[350px] flex items-center justify-center">
            {/* Soft ambient sky-cyan glow behind the circle */}
            <div
              className="absolute -inset-6 rounded-full bg-[#0ea5e9]/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            {/* Outer delicate concentric ring */}
            <div
              className="absolute inset-0 rounded-full border border-[#0ea5e9]/20 pointer-events-none"
              aria-hidden="true"
            />
            {/* Circular Portrait Container */}
            <div className="relative w-[91%] h-[91%] rounded-full overflow-hidden border-2 border-[#0ea5e9]/55 bg-[var(--bg-secondary)] shadow-2xl shadow-sky-950/50">
              <Image
                src={profile.avatar}
                alt={`${profile.name} portrait`}
                fill
                priority
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 295px, 325px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verified Highlight Metrics Strip + Scroll Mouse Indicator */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-14 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {heroHighlights.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0ea5e9]">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="#about"
            aria-label="Scroll to About section"
            className="w-6 h-10 rounded-full border border-[var(--border-active)] hover:border-[#0ea5e9]/70 flex justify-center pt-2 transition-colors"
          >
            <span className="w-1 h-2 rounded-full bg-[var(--text-secondary)] animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
