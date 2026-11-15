import fs from "fs/promises";
import path from "path";
import { connectToDatabase, sanitizeDbError } from "@/lib/mongodb";
import {
  MessageModel,
  ProfileModel,
  ProjectModel,
  ResearchModel,
} from "@/models";
import { profile as defaultProfile } from "@/data/profile";
import { projects as defaultProjects } from "@/data/projects";
import { caseStudies as defaultCaseStudies } from "@/data/caseStudies";
import { researchCards as defaultResearch } from "@/data/research";
import { skillCategories as defaultSkills } from "@/data/skills";
import { verifiedMetrics as defaultMetrics } from "@/data/metrics";
import { journeyMilestones as defaultJourney } from "@/data/journey";
import type {
  JourneyMilestone,
  Project,
  ProjectCaseStudy,
  ResearchCard,
  SkillCategory,
  VerifiedMetric,
} from "@/types/portfolio";

export type PortfolioProfile = typeof defaultProfile;

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  emailStatus?: "delivered" | "failed" | "pending";
  deliveryError?: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  metrics: VerifiedMetric[];
  projects: Project[];
  research: ResearchCard[];
  skills: SkillCategory[];
  journey: JourneyMilestone[];
}

export interface AdminPortfolioData extends PortfolioData {
  messages: ContactMessageRecord[];
}

const DATA_FILE = path.join(process.cwd(), "src", "data", "content.json");

const globalForSeed = globalThis as unknown as {
  __portfolioSeeded?: boolean;
  __portfolioSeedPromise?: Promise<void> | null;
};

function toPlainJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function readLocalSeedFile(): Promise<Partial<AdminPortfolioData>> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getFallbackPortfolioData(): PortfolioData {
  return {
    profile: toPlainJson(defaultProfile),
    metrics: toPlainJson(defaultMetrics),
    projects: toPlainJson(defaultProjects),
    research: toPlainJson(defaultResearch),
    skills: toPlainJson(defaultSkills),
    journey: toPlainJson(defaultJourney),
  };
}

export async function migrateExistingDataToMongo(): Promise<{
  profilesCount: number;
  projectsCount: number;
  researchCount: number;
  messagesCount: number;
  inserted: {
    profiles: number;
    projects: number;
    research: number;
    messages: number;
  };
}> {
  await connectToDatabase();

  const localData = await readLocalSeedFile();
  const seedProfile = localData.profile
    ? { ...defaultProfile, ...localData.profile }
    : defaultProfile;
  const seedMetrics =
    Array.isArray(localData.metrics) && localData.metrics.length > 0
      ? localData.metrics
      : defaultMetrics;
  const seedSkills =
    Array.isArray(localData.skills) && localData.skills.length > 0
      ? localData.skills
      : defaultSkills;
  const seedJourney =
    Array.isArray(localData.journey) && localData.journey.length > 0
      ? localData.journey
      : defaultJourney;
  const seedProjects =
    Array.isArray(localData.projects) && localData.projects.length > 0
      ? localData.projects
      : defaultProjects;
  const seedResearch =
    Array.isArray(localData.research) && localData.research.length > 0
      ? localData.research
      : defaultResearch;
  const seedMessages = Array.isArray(localData.messages)
    ? localData.messages
    : [];

  let insertedProfiles = 0;
  let insertedProjects = 0;
  let insertedResearch = 0;
  let insertedMessages = 0;

  const profileRes = await ProfileModel.updateOne(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        ...toPlainJson(seedProfile),
        metrics: toPlainJson(seedMetrics),
        skills: toPlainJson(seedSkills),
        journey: toPlainJson(seedJourney),
      },
    },
    { upsert: true }
  );
  if (profileRes.upsertedCount > 0) insertedProfiles += profileRes.upsertedCount;

  for (const proj of seedProjects) {
    const slug = proj.slug || proj.id;
    const study = defaultCaseStudies[slug] || null;
    const res = await ProjectModel.updateOne(
      { slug },
      {
        $setOnInsert: {
          ...toPlainJson(proj),
          id: proj.id || slug,
          slug,
          caseStudy: study ? toPlainJson(study) : null,
        },
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) insertedProjects += res.upsertedCount;
  }

  for (let i = 0; i < seedResearch.length; i++) {
    const item = seedResearch[i];
    const res = await ResearchModel.updateOne(
      { id: item.id },
      {
        $setOnInsert: {
          ...toPlainJson(item),
          order: i,
        },
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) insertedResearch += res.upsertedCount;
  }

  for (const msg of seedMessages) {
    if (!msg?.id) continue;
    const res = await MessageModel.updateOne(
      { id: msg.id },
      { $setOnInsert: toPlainJson(msg) },
      { upsert: true }
    );
    if (res.upsertedCount > 0) insertedMessages += res.upsertedCount;
  }

  const [profilesCount, projectsCount, researchCount, messagesCount] =
    await Promise.all([
      ProfileModel.countDocuments(),
      ProjectModel.countDocuments(),
      ResearchModel.countDocuments(),
      MessageModel.countDocuments(),
    ]);

  globalForSeed.__portfolioSeeded = true;

  return {
    profilesCount,
    projectsCount,
    researchCount,
    messagesCount,
    inserted: {
      profiles: insertedProfiles,
      projects: insertedProjects,
      research: insertedResearch,
      messages: insertedMessages,
    },
  };
}

export async function ensurePortfolioInitialized(): Promise<void> {
  if (globalForSeed.__portfolioSeeded) {
    return;
  }

  if (!globalForSeed.__portfolioSeedPromise) {
    globalForSeed.__portfolioSeedPromise = (async () => {
      await connectToDatabase();
      const [hasProfile, projectCount, researchCount] = await Promise.all([
        ProfileModel.exists({ key: "main" }),
        ProjectModel.countDocuments(),
        ResearchModel.countDocuments(),
      ]);

      if (!hasProfile || projectCount === 0 || researchCount === 0) {
        await migrateExistingDataToMongo();
      } else {
        globalForSeed.__portfolioSeeded = true;
      }
    })().finally(() => {
      globalForSeed.__portfolioSeedPromise = null;
    });
  }

  await globalForSeed.__portfolioSeedPromise;
}

function mapProfileDoc(doc: Record<string, unknown> | null): {
  profile: PortfolioProfile;
  metrics: VerifiedMetric[];
  skills: SkillCategory[];
  journey: JourneyMilestone[];
} {
  if (!doc) {
    return {
      profile: toPlainJson(defaultProfile),
      metrics: toPlainJson(defaultMetrics),
      skills: toPlainJson(defaultSkills),
      journey: toPlainJson(defaultJourney),
    };
  }

  const plain = toPlainJson(doc) as Record<string, unknown>;
  const profile: PortfolioProfile = {
    name: String(plain.name || defaultProfile.name),
    avatar: String(plain.avatar || defaultProfile.avatar),
    title: String(plain.title || defaultProfile.title),
    subtitle: String(plain.subtitle || defaultProfile.subtitle),
    bio: String(plain.bio || defaultProfile.bio),
    location: String(plain.location || defaultProfile.location),
    education: {
      ...defaultProfile.education,
      ...((plain.education as PortfolioProfile["education"]) || {}),
    },
    careerVision: {
      ...defaultProfile.careerVision,
      ...((plain.careerVision as PortfolioProfile["careerVision"]) || {}),
    },
    audiences: {
      ...defaultProfile.audiences,
      ...((plain.audiences as PortfolioProfile["audiences"]) || {}),
    },
    socials: {
      ...defaultProfile.socials,
      ...((plain.socials as PortfolioProfile["socials"]) || {}),
    },
  };

  return {
    profile,
    metrics:
      Array.isArray(plain.metrics) && plain.metrics.length > 0
        ? (plain.metrics as VerifiedMetric[])
        : toPlainJson(defaultMetrics),
    skills:
      Array.isArray(plain.skills) && plain.skills.length > 0
        ? (plain.skills as SkillCategory[])
        : toPlainJson(defaultSkills),
    journey:
      Array.isArray(plain.journey) && plain.journey.length > 0
        ? (plain.journey as JourneyMilestone[])
        : toPlainJson(defaultJourney),
  };
}

function mapProjectDoc(doc: Record<string, unknown>): Project {
  const plain = toPlainJson(doc) as Record<string, unknown>;
  return {
    id: String(plain.id || plain.slug || ""),
    slug: String(plain.slug || plain.id || ""),
    title: String(plain.title || ""),
    tagline: String(plain.tagline || ""),
    summary: String(plain.summary || ""),
    category: (plain.category as Project["category"]) || "Deep Learning",
    domain: String(plain.domain || "Applied AI"),
    status: (plain.status as Project["status"]) || "Completed",
    featured: Boolean(plain.featured),
    featuredOrder:
      typeof plain.featuredOrder === "number" ? plain.featuredOrder : 99,
    stack: Array.isArray(plain.stack) ? (plain.stack as string[]) : [],
    githubUrl: plain.githubUrl ? String(plain.githubUrl) : undefined,
    demoUrl: plain.demoUrl ? String(plain.demoUrl) : undefined,
    paperUrl: plain.paperUrl ? String(plain.paperUrl) : undefined,
    imageUrl: plain.imageUrl ? String(plain.imageUrl) : undefined,
    galleryImages: Array.isArray(plain.galleryImages)
      ? (plain.galleryImages as string[]).filter(Boolean)
      : [],
    metrics: Array.isArray(plain.metrics)
      ? (plain.metrics as Project["metrics"])
      : [],
    highlights: Array.isArray(plain.highlights)
      ? (plain.highlights as string[])
      : [],
    problem: plain.problem ? String(plain.problem) : undefined,
    approach: plain.approach ? String(plain.approach) : undefined,
    challenges: plain.challenges ? String(plain.challenges) : undefined,
    keyArchitecture: String(plain.keyArchitecture || ""),
    hasDetailedCaseStudy: Boolean(plain.hasDetailedCaseStudy),
  };
}

function mapResearchDoc(doc: Record<string, unknown>): ResearchCard {
  const plain = toPlainJson(doc) as Record<string, unknown>;
  return {
    id: String(plain.id || ""),
    title: String(plain.title || ""),
    tagline: String(plain.tagline || ""),
    status: (plain.status as ResearchCard["status"]) || "Exploring",
    domain: String(plain.domain || "Computer Vision"),
    targetOutcome: String(plain.targetOutcome || ""),
    problem: String(plain.problem || ""),
    researchQuestion: String(plain.researchQuestion || ""),
    whyItMatters: String(plain.whyItMatters || ""),
    existingApproaches: String(plain.existingApproaches || ""),
    researchGap: String(plain.researchGap || ""),
    proposedDirection: String(plain.proposedDirection || ""),
    experiments: String(plain.experiments || ""),
    currentResults: String(plain.currentResults || ""),
    limitations: String(plain.limitations || ""),
    futureWork: String(plain.futureWork || ""),
    tags: Array.isArray(plain.tags) ? (plain.tags as string[]) : [],
    statusNote: plain.statusNote ? String(plain.statusNote) : undefined,
  };
}

function mapMessageDoc(doc: Record<string, unknown>): ContactMessageRecord {
  const plain = toPlainJson(doc) as Record<string, unknown>;
  const status = plain.emailStatus;
  return {
    id: String(plain.id || ""),
    name: String(plain.name || ""),
    email: String(plain.email || ""),
    subject: String(plain.subject || ""),
    message: String(plain.message || ""),
    createdAt: String(plain.createdAt || ""),
    emailStatus:
      status === "delivered" || status === "failed" || status === "pending"
        ? status
        : undefined,
    deliveryError: plain.deliveryError ? String(plain.deliveryError) : undefined,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await connectToDatabase();
    await ensurePortfolioInitialized();

    const [profileDoc, projectDocs, researchDocs] = await Promise.all([
      ProfileModel.findOne({ key: "main" }).lean<Record<string, unknown>>(),
      ProjectModel.find({})
        .sort({ featuredOrder: 1, createdAt: 1 })
        .lean<Record<string, unknown>[]>(),
      ResearchModel.find({})
        .sort({ order: 1, createdAt: 1 })
        .lean<Record<string, unknown>[]>(),
    ]);

    const mappedProfile = mapProfileDoc(profileDoc);
    return {
      ...mappedProfile,
      projects: projectDocs.map(mapProjectDoc),
      research: researchDocs.map(mapResearchDoc),
    };
  } catch (err) {
    console.error("getPortfolioData fallback triggered:", sanitizeDbError(err));
    return getFallbackPortfolioData();
  }
}

export async function getAdminPortfolioData(): Promise<AdminPortfolioData> {
  await connectToDatabase();
  await ensurePortfolioInitialized();

  const [profileDoc, projectDocs, researchDocs, messageDocs] =
    await Promise.all([
      ProfileModel.findOne({ key: "main" }).lean<Record<string, unknown>>(),
      ProjectModel.find({})
        .sort({ featuredOrder: 1, createdAt: 1 })
        .lean<Record<string, unknown>[]>(),
      ResearchModel.find({})
        .sort({ order: 1, createdAt: 1 })
        .lean<Record<string, unknown>[]>(),
      MessageModel.find({})
        .sort({ createdAt: -1 })
        .lean<Record<string, unknown>[]>(),
    ]);

  const mappedProfile = mapProfileDoc(profileDoc);
  return {
    ...mappedProfile,
    projects: projectDocs.map(mapProjectDoc),
    research: researchDocs.map(mapResearchDoc),
    messages: messageDocs.map(mapMessageDoc),
  };
}

function buildSynthesizedCaseStudy(project: Project): ProjectCaseStudy {
  return {
    projectId: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.tagline || project.summary,
    sections: {
      overview: {
        number: "01",
        title: "Overview",
        content: project.summary || project.tagline,
        bullets: project.highlights,
      },
      problem: {
        number: "02",
        title: "Problem Statement",
        content:
          project.problem ||
          `Designing and implementing ${project.title} within ${project.domain}.`,
      },
      motivation: {
        number: "03",
        title: "Motivation",
        content: project.tagline || project.summary,
      },
      dataset: {
        number: "04",
        title: "Domain & Inputs",
        content: `Core technology stack: ${project.stack.join(", ") || "N/A"}.`,
      },
      dataProcessing: {
        number: "05",
        title: "Data & Preprocessing",
        content:
          project.approach ||
          "Structured validation and deterministic preprocessing before inference.",
      },
      baseline: {
        number: "06",
        title: "Baseline Approach",
        content: project.approach || project.summary,
      },
      architecture: {
        number: "07",
        title: "System Architecture",
        content: project.keyArchitecture || "Pipeline: Input -> Processing -> Output",
      },
      methodology: {
        number: "08",
        title: "Methodology",
        content: project.approach || project.summary,
      },
      experiments: {
        number: "09",
        title: "Experiments & Iteration",
        content: project.highlights.join(" • ") || project.summary,
      },
      evaluation: {
        number: "10",
        title: "Evaluation & Metrics",
        content:
          project.metrics && project.metrics.length > 0
            ? project.metrics
                .map((m) => `${m.label}: ${m.value}${m.subtext ? ` (${m.subtext})` : ""}`)
                .join(" | ")
            : `Project status: ${project.status}`,
      },
      errorAnalysis: {
        number: "11",
        title: "Observations & Error Analysis",
        content:
          project.challenges || "Edge-case validation and continuous testing.",
      },
      engineeringDecisions: {
        number: "12",
        title: "Engineering Decisions",
        content: project.keyArchitecture || project.approach || project.summary,
      },
      challenges: {
        number: "13",
        title: "Challenges & Solutions",
        content:
          project.challenges || "Reliability, maintainability, and latency trade-offs.",
      },
      deployment: {
        number: "14",
        title: "Deployment",
        content: project.demoUrl
          ? `Live deployment available at ${project.demoUrl}.`
          : `Status: ${project.status}.`,
      },
      limitations: {
        number: "15",
        title: "Limitations",
        content: "Documented honestly based on current project scope.",
      },
      futureWork: {
        number: "16",
        title: "Future Work",
        content: "Continued benchmarking, iteration, and reliability hardening.",
      },
      links: {
        github: project.githubUrl,
        demo: project.demoUrl,
      },
    },
  };
}

export async function getProjectWithCaseStudyBySlug(slug: string): Promise<{
  project: Project | null;
  study: ProjectCaseStudy | null;
}> {
  try {
    await connectToDatabase();
    await ensurePortfolioInitialized();

    const doc = await ProjectModel.findOne({
      $or: [{ slug }, { id: slug }],
    }).lean<Record<string, unknown> & { caseStudy?: ProjectCaseStudy | null }>();

    if (!doc) {
      return { project: null, study: null };
    }

    const project = mapProjectDoc(doc);
    const study =
      (doc.caseStudy && toPlainJson(doc.caseStudy)) ||
      (defaultCaseStudies[project.slug]
        ? toPlainJson(defaultCaseStudies[project.slug])
        : null) ||
      buildSynthesizedCaseStudy(project);

    return { project, study };
  } catch (err) {
    console.error(
      "getProjectWithCaseStudyBySlug fallback triggered:",
      sanitizeDbError(err)
    );
    const project =
      defaultProjects.find((p) => p.slug === slug || p.id === slug) || null;
    if (!project) return { project: null, study: null };
    const study =
      defaultCaseStudies[project.slug] || buildSynthesizedCaseStudy(project);
    return { project: toPlainJson(project), study: toPlainJson(study) };
  }
}
