import { NextResponse } from "next/server";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { researchCards } from "@/data/research";
import { skillCategories } from "@/data/skills";
import { verifiedMetrics } from "@/data/metrics";
import { journeyMilestones } from "@/data/journey";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    profile,
    metrics: verifiedMetrics,
    projects,
    research: researchCards,
    skills: skillCategories,
    journey: journeyMilestones,
  });
}
