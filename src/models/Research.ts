import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const ResearchSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    status: { type: String, default: "Exploring", index: true },
    domain: { type: String, default: "Computer Vision" },
    targetOutcome: { type: String, default: "" },
    problem: { type: String, default: "" },
    researchQuestion: { type: String, default: "" },
    whyItMatters: { type: String, default: "" },
    existingApproaches: { type: String, default: "" },
    researchGap: { type: String, default: "" },
    proposedDirection: { type: String, default: "" },
    experiments: { type: String, default: "" },
    currentResults: { type: String, default: "" },
    limitations: { type: String, default: "" },
    futureWork: { type: String, default: "" },
    tags: { type: [String], default: [] },
    statusNote: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
  },
  {
    collection: "researches",
    timestamps: true,
  }
);

export type ResearchDocument = InferSchemaType<typeof ResearchSchema>;

export const ResearchModel: Model<ResearchDocument> =
  (mongoose.models.Research as Model<ResearchDocument>) ||
  mongoose.model<ResearchDocument>("Research", ResearchSchema);
