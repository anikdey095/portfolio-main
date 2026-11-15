import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { profile as defaultProfile } from "@/data/profile";
import { projects as defaultProjects } from "@/data/projects";
import { researchCards as defaultResearch } from "@/data/research";
import { skillCategories as defaultSkills } from "@/data/skills";
import { verifiedMetrics as defaultMetrics } from "@/data/metrics";
import { journeyMilestones as defaultJourney } from "@/data/journey";

const DATA_FILE = path.join(process.cwd(), "src", "data", "content.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "anik@2026";

function isAuthorized(req: NextRequest, bodyPassword?: unknown): boolean {
  const headerPassword = req.headers.get("x-admin-password");
  return (
    headerPassword === ADMIN_PASSWORD ||
    (typeof bodyPassword === "string" && bodyPassword === ADMIN_PASSWORD)
  );
}

// Helper to read current database
async function getStoredData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      profile: parsed.profile ? { ...defaultProfile, ...parsed.profile } : defaultProfile,
      metrics: parsed.metrics || defaultMetrics,
      projects: parsed.projects || defaultProjects,
      research: parsed.research || defaultResearch,
      skills: parsed.skills || defaultSkills,
      journey: parsed.journey || defaultJourney,
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch {
    return {
      profile: defaultProfile,
      metrics: defaultMetrics,
      projects: defaultProjects,
      research: defaultResearch,
      skills: defaultSkills,
      journey: defaultJourney,
      messages: [],
    };
  }
}

// Helper to save to disk and sync TypeScript data modules
async function saveStoredData(data: Record<string, unknown>) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");

  const dataDir = path.join(process.cwd(), "src", "data");
  await Promise.all([
    fs.writeFile(
      path.join(dataDir, "profile.ts"),
      `export const profile = ${JSON.stringify(data.profile, null, 2)};\n`,
      "utf-8"
    ),
    fs.writeFile(
      path.join(dataDir, "metrics.ts"),
      `import { VerifiedMetric } from "@/types/portfolio";\n\nexport const verifiedMetrics: VerifiedMetric[] = ${JSON.stringify(
        data.metrics,
        null,
        2
      )};\n`,
      "utf-8"
    ),
    fs.writeFile(
      path.join(dataDir, "projects.ts"),
      `import { Project } from "@/types/portfolio";\n\nexport const projects: Project[] = ${JSON.stringify(
        data.projects,
        null,
        2
      )};\n`,
      "utf-8"
    ),
    fs.writeFile(
      path.join(dataDir, "research.ts"),
      `import { ResearchCard } from "@/types/portfolio";\n\nexport const researchCards: ResearchCard[] = ${JSON.stringify(
        data.research,
        null,
        2
      )};\n`,
      "utf-8"
    ),
    fs.writeFile(
      path.join(dataDir, "skills.ts"),
      `import { SkillCategory } from "@/types/portfolio";\n\nexport const skillCategories: SkillCategory[] = ${JSON.stringify(
        data.skills,
        null,
        2
      )};\n`,
      "utf-8"
    ),
    fs.writeFile(
      path.join(dataDir, "journey.ts"),
      `import { JourneyMilestone } from "@/types/portfolio";\n\nexport const journeyMilestones: JourneyMilestone[] = ${JSON.stringify(
        data.journey,
        null,
        2
      )};\n`,
      "utf-8"
    ),
  ]);
}

function parseListField(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(val || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const data = await getStoredData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, password } = body;

    if (!isAuthorized(req, password)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin password." },
        { status: 401 }
      );
    }

    if (action === "VERIFY_AUTH") {
      return NextResponse.json({ success: true, message: "Authenticated." });
    }

    const currentData = await getStoredData();

    switch (action) {
      case "UPDATE_PROFILE": {
        currentData.profile = { ...currentData.profile, ...payload.profile };
        if (payload.metrics) {
          currentData.metrics = payload.metrics;
        }
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Profile & metrics updated and synced!",
        });
      }

      case "ADD_PROJECT": {
        const slug =
          payload.slug ||
          String(payload.title || "project")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        const newProject = {
          id: slug || `proj-${Date.now()}`,
          slug: slug || `proj-${Date.now()}`,
          title: payload.title,
          tagline: payload.tagline || "",
          summary: payload.summary || "",
          problem: payload.problem || "",
          approach: payload.approach || "",
          challenges: payload.challenges || "",
          category: payload.category || "Deep Learning",
          domain: payload.domain || "Applied AI",
          status: payload.status || "Completed",
          featured: Boolean(payload.featured),
          featuredOrder: Number(payload.featuredOrder) || currentData.projects.length + 1,
          stack: parseListField(payload.stack),
          githubUrl: payload.githubUrl || "",
          demoUrl: payload.demoUrl || "",
          highlights:
            Array.isArray(payload.highlights) && payload.highlights.length > 0
              ? payload.highlights
              : [payload.summary || "Initial deployment"],
          keyArchitecture:
            payload.keyArchitecture || "Pipeline: Input -> Model -> Output",
          hasDetailedCaseStudy: Boolean(payload.hasDetailedCaseStudy),
        };

        currentData.projects = [newProject, ...currentData.projects];
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Project added and synced!",
        });
      }

      case "UPDATE_PROJECT": {
        if (Array.isArray(payload.projects)) {
          currentData.projects = payload.projects;
        } else {
          currentData.projects = currentData.projects.map(
            (proj: Record<string, unknown>) => {
              if (proj.id !== payload.id && proj.slug !== payload.id) {
                return proj;
              }
              return {
                ...proj,
                ...payload,
                stack:
                  payload.stack !== undefined
                    ? parseListField(payload.stack)
                    : proj.stack,
                highlights:
                  payload.highlights !== undefined
                    ? Array.isArray(payload.highlights)
                      ? payload.highlights
                      : parseListField(payload.highlights)
                    : proj.highlights,
              };
            }
          );
        }
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Project updated and synced!",
        });
      }

      case "DELETE_PROJECT": {
        currentData.projects = currentData.projects.filter(
          (p: { id: string; slug: string }) =>
            p.id !== payload.id && p.slug !== payload.id
        );
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Project deleted!",
        });
      }

      case "ADD_RESEARCH": {
        const newResearch = {
          id: payload.id || `research-${Date.now()}`,
          title: payload.title,
          tagline: payload.tagline || "",
          status: payload.status || "Exploring",
          domain: payload.domain || "Computer Vision",
          targetOutcome: payload.targetOutcome || "Academic Thesis & Proposal",
          problem: payload.problem || "",
          researchQuestion: payload.researchQuestion || "",
          whyItMatters: payload.whyItMatters || "",
          existingApproaches:
            payload.existingApproaches || "Standard baseline models",
          researchGap:
            payload.researchGap || "Domain shift and dataset constraints",
          proposedDirection: payload.proposedDirection || "",
          experiments: payload.experiments || "Benchmarking protocols",
          currentResults: payload.currentResults || "Formulation stage",
          limitations: payload.limitations || "Preliminary exploration",
          futureWork: payload.futureWork || "Prospective graduate research",
          tags: parseListField(payload.tags),
        };

        currentData.research = [newResearch, ...currentData.research];
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Research direction added and synced!",
        });
      }

      case "UPDATE_RESEARCH": {
        currentData.research = currentData.research.map(
          (item: Record<string, unknown>) => {
            if (item.id !== payload.id) return item;
            return {
              ...item,
              ...payload,
              tags:
                payload.tags !== undefined
                  ? parseListField(payload.tags)
                  : item.tags,
            };
          }
        );
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Research agenda updated!",
        });
      }

      case "DELETE_RESEARCH": {
        currentData.research = currentData.research.filter(
          (r: { id: string }) => r.id !== payload.id
        );
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Research card removed!",
        });
      }

      case "UPDATE_SKILLS": {
        currentData.skills = Array.isArray(payload.skills)
          ? payload.skills
          : currentData.skills;
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Technical skills updated and synced!",
        });
      }

      case "UPDATE_JOURNEY": {
        currentData.journey = Array.isArray(payload.journey)
          ? payload.journey
          : currentData.journey;
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Learning journey updated and synced!",
        });
      }

      case "DELETE_MESSAGE": {
        const existingMessages = Array.isArray(currentData.messages)
          ? currentData.messages
          : [];
        currentData.messages = existingMessages.filter(
          (m: { id: string }) => m.id !== payload.id
        );
        await saveStoredData(currentData);
        return NextResponse.json({
          success: true,
          message: "Message deleted!",
        });
      }

      case "UPLOAD_FILE": {
        const { fileType, base64Data } = payload;
        const buffer = Buffer.from(
          String(base64Data).split(",")[1] || String(base64Data),
          "base64"
        );

        if (fileType === "avatar") {
          const avatarPath = path.join(process.cwd(), "public", "profile.jpg");
          await fs.writeFile(avatarPath, buffer);
          currentData.profile.avatar = "/profile.jpg";
          await saveStoredData(currentData);
          return NextResponse.json({
            success: true,
            message: "Profile picture uploaded & replaced successfully!",
          });
        } else if (fileType === "resume") {
          const resumePath = path.join(process.cwd(), "public", "resume.pdf");
          await fs.writeFile(resumePath, buffer);
          return NextResponse.json({
            success: true,
            message: "Resume PDF uploaded & replaced successfully!",
          });
        }
        return NextResponse.json(
          { success: false, message: "Unknown file type" },
          { status: 400 }
        );
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process update" },
      { status: 500 }
    );
  }
}
