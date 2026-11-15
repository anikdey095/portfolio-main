export type ProjectCategory =
  | "All"
  | "Deep Learning"
  | "Machine Learning"
  | "Computer Vision"
  | "Generative AI"
  | "Applied Research"
  | "Systems & Web";

export type ProjectStatus =
  | "Completed"
  | "Ongoing"
  | "Learning / Building"
  | "Research Direction"
  | "Prototype";

export interface ProjectMetric {
  label: string;
  value: string;
  subtext?: string;
  isTrainMetric?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: ProjectCategory;
  domain: string;
  status: ProjectStatus;
  featured: boolean;
  featuredOrder?: number;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  paperUrl?: string;
  metrics?: ProjectMetric[];
  highlights: string[];
  problem?: string;
  approach?: string;
  challenges?: string;
  keyArchitecture: string;
  hasDetailedCaseStudy: boolean;
}

export interface CaseStudySection {
  number: string;
  title: string;
  content: string;
  bullets?: string[];
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
    caption?: string;
  };
  alert?: {
    type: "note" | "important" | "warning" | "tip";
    text: string;
  };
}

export interface ProjectCaseStudy {
  projectId: string;
  slug: string;
  title: string;
  subtitle: string;
  sections: {
    overview: CaseStudySection;
    problem: CaseStudySection;
    motivation: CaseStudySection;
    dataset: CaseStudySection;
    dataProcessing: CaseStudySection;
    baseline: CaseStudySection;
    architecture: CaseStudySection;
    methodology: CaseStudySection;
    experiments: CaseStudySection;
    evaluation: CaseStudySection;
    errorAnalysis: CaseStudySection;
    engineeringDecisions: CaseStudySection;
    challenges: CaseStudySection;
    deployment: CaseStudySection;
    limitations: CaseStudySection;
    futureWork: CaseStudySection;
    links: {
      github?: string;
      demo?: string;
      report?: string;
    };
  };
}

export type ResearchStatus =
  | "Exploring"
  | "Ongoing"
  | "Experimenting"
  | "Completed"
  | "Published";

export interface ResearchCard {
  id: string;
  title: string;
  tagline: string;
  status: ResearchStatus;
  domain: string;
  targetOutcome: string;
  problem: string;
  researchQuestion: string;
  whyItMatters: string;
  existingApproaches: string;
  researchGap: string;
  proposedDirection: string;
  experiments: string;
  currentResults: string;
  limitations: string;
  futureWork: string;
  tags: string[];
  statusNote?: string;
}

export type SkillLevel =
  | "Building with"
  | "Working with"
  | "Exploring"
  | "Focused on";

export interface SkillItem {
  name: string;
  status: SkillLevel;
  focusArea?: string;
  context?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  items: SkillItem[];
}

export interface JourneyMilestone {
  step: string;
  title: string;
  domain: string;
  period: string;
  description: string;
  focusPoints: string[];
  keyOutcome: string;
}

export interface EngineeringPhilosophyStep {
  stepNumber: string;
  title: string;
  tagline: string;
  description: string;
  engineeringAction: string;
  artifact: string;
}

export interface VerifiedMetric {
  value: string;
  label: string;
  detail: string;
  source: string;
  verified: boolean;
}
