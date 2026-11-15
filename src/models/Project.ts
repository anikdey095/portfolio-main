import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const ProjectMetricSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    subtext: { type: String, default: "" },
    isTrainMetric: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    summary: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      default: "Deep Learning",
      index: true,
    },
    domain: { type: String, default: "Applied AI" },
    status: { type: String, default: "Completed" },
    featured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 99, index: true },
    stack: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    paperUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    galleryImages: { type: [String], default: [] },
    metrics: { type: [ProjectMetricSchema], default: [] },
    highlights: { type: [String], default: [] },
    problem: { type: String, default: "" },
    approach: { type: String, default: "" },
    challenges: { type: String, default: "" },
    keyArchitecture: { type: String, default: "" },
    hasDetailedCaseStudy: { type: Boolean, default: false },
    caseStudy: { type: Schema.Types.Mixed, default: null },
  },
  {
    collection: "projects",
    timestamps: true,
  }
);

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;

export const ProjectModel: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument>) ||
  mongoose.model<ProjectDocument>("Project", ProjectSchema);
