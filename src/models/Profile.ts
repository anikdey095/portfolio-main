import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const MetricSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    source: { type: String, default: "" },
    verified: { type: Boolean, default: true },
  },
  { _id: false }
);

const SkillItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, default: "Building with" },
    focusArea: { type: String, default: "" },
    context: { type: String, default: "" },
  },
  { _id: false }
);

const SkillCategorySchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    items: { type: [SkillItemSchema], default: [] },
  },
  { _id: false }
);

const JourneyMilestoneSchema = new Schema(
  {
    step: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    domain: { type: String, default: "" },
    period: { type: String, default: "" },
    description: { type: String, default: "" },
    focusPoints: { type: [String], default: [] },
    keyOutcome: { type: String, default: "" },
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      index: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: "/profile.png" },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    education: {
      type: new Schema(
        {
          degree: { type: String, default: "" },
          institution: { type: String, default: "" },
          expectedGraduation: { type: String, default: "" },
          currentFocus: { type: String, default: "" },
          targetPath: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: {},
    },
    careerVision: {
      type: new Schema(
        {
          nearTerm: { type: String, default: "" },
          longTerm: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: {},
    },
    audiences: {
      type: new Schema(
        {
          recruiters: { type: String, default: "" },
          engineers: { type: String, default: "" },
          researchers: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: {},
    },
    socials: {
      type: new Schema(
        {
          github: { type: String, default: "" },
          linkedin: { type: String, default: "" },
          email: { type: String, default: "" },
          resumeUrl: { type: String, default: "/resume.pdf" },
        },
        { _id: false }
      ),
      default: {},
    },
    metrics: { type: [MetricSchema], default: [] },
    skills: { type: [SkillCategorySchema], default: [] },
    journey: { type: [JourneyMilestoneSchema], default: [] },
  },
  {
    collection: "profiles",
    timestamps: true,
  }
);

export type ProfileDocument = InferSchemaType<typeof ProfileSchema>;

export const ProfileModel: Model<ProfileDocument> =
  (mongoose.models.Profile as Model<ProfileDocument>) ||
  mongoose.model<ProfileDocument>("Profile", ProfileSchema);
