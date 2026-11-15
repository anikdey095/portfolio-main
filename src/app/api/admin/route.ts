import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase, sanitizeDbError } from "@/lib/mongodb";
import {
  isCloudinaryConfigured,
  uploadAssetToCloudinary,
  type UploadAssetKind,
} from "@/lib/cloudinary";
import {
  ensurePortfolioInitialized,
  getAdminPortfolioData,
} from "@/lib/portfolioDb";
import {
  MessageModel,
  ProfileModel,
  ProjectModel,
  ResearchModel,
} from "@/models";

export const dynamic = "force-dynamic";

function parseListField(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(val || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function revalidatePortfolioRoutes(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/research");
  revalidatePath("/api/data");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await getAdminPortfolioData();
    return NextResponse.json({
      ...data,
      integrations: {
        cloudinaryConfigured: isCloudinaryConfigured(),
        web3FormsConfigured: Boolean(
          process.env.WEB3FORMS_ACCESS_KEY &&
            !/YOUR_|placeholder/i.test(process.env.WEB3FORMS_ACCESS_KEY)
        ),
        vercelAnalyticsConfigured: Boolean(
          process.env.VERCEL_API_TOKEN?.trim() &&
            process.env.VERCEL_PROJECT_ID?.trim()
        ),
      },
    });
  } catch (err) {
    console.error("Admin GET error:", sanitizeDbError(err));
    return NextResponse.json(
      { success: false, message: "Failed to load admin data from database." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, payload } = body || {};
    if (!isNonEmptyString(action) || !payload || typeof payload !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid admin action or payload." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await ensurePortfolioInitialized();

    switch (action) {
      case "UPDATE_PROFILE": {
        if (!payload.profile || typeof payload.profile !== "object") {
          return NextResponse.json(
            { success: false, message: "Profile object is required." },
            { status: 400 }
          );
        }

        const p = payload.profile as Record<string, unknown>;
        const updateSet: Record<string, unknown> = {};
        if (isNonEmptyString(p.name)) updateSet.name = p.name.trim();
        if (typeof p.avatar === "string") updateSet.avatar = p.avatar.trim();
        if (isNonEmptyString(p.title)) updateSet.title = p.title.trim();
        if (typeof p.subtitle === "string") updateSet.subtitle = p.subtitle.trim();
        if (typeof p.bio === "string") updateSet.bio = p.bio.trim();
        if (typeof p.location === "string") updateSet.location = p.location.trim();
        if (p.education && typeof p.education === "object") {
          updateSet.education = p.education;
        }
        if (p.careerVision && typeof p.careerVision === "object") {
          updateSet.careerVision = p.careerVision;
        }
        if (p.audiences && typeof p.audiences === "object") {
          updateSet.audiences = p.audiences;
        }
        if (p.socials && typeof p.socials === "object") {
          updateSet.socials = p.socials;
        }
        if (Array.isArray(payload.metrics)) {
          updateSet.metrics = payload.metrics;
        }

        await ProfileModel.updateOne(
          { key: "main" },
          { $set: updateSet },
          { upsert: true, runValidators: true }
        );

        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          message: "Profile & metrics updated in MongoDB!",
        });
      }

      case "ADD_PROJECT": {
        if (!isNonEmptyString(payload.title)) {
          return NextResponse.json(
            { success: false, message: "Project title is required." },
            { status: 400 }
          );
        }

        const rawSlug =
          (isNonEmptyString(payload.slug) ? payload.slug.trim() : "") ||
          String(payload.title)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        const slug = rawSlug || `proj-${Date.now()}`;
        const id = isNonEmptyString(payload.id) ? payload.id.trim() : slug;

        const existing = await ProjectModel.exists({
          $or: [{ slug }, { id }],
        });
        if (existing) {
          return NextResponse.json(
            {
              success: false,
              message: "A project with this slug or id already exists.",
            },
            { status: 409 }
          );
        }

        const projectCount = await ProjectModel.countDocuments();
        const newProject = {
          id,
          slug,
          title: payload.title.trim(),
          tagline: String(payload.tagline || "").trim(),
          summary: String(payload.summary || "").trim(),
          problem: String(payload.problem || "").trim(),
          approach: String(payload.approach || "").trim(),
          challenges: String(payload.challenges || "").trim(),
          category: payload.category || "Deep Learning",
          domain: payload.domain || "Applied AI",
          status: payload.status || "Completed",
          featured: Boolean(payload.featured),
          featuredOrder:
            Number.isFinite(Number(payload.featuredOrder)) &&
            Number(payload.featuredOrder) > 0
              ? Number(payload.featuredOrder)
              : projectCount + 1,
          stack: parseListField(payload.stack),
          githubUrl: String(payload.githubUrl || "").trim(),
          demoUrl: String(payload.demoUrl || "").trim(),
          paperUrl: String(payload.paperUrl || "").trim(),
          imageUrl: String(payload.imageUrl || "").trim(),
          galleryImages: Array.isArray(payload.galleryImages)
            ? payload.galleryImages.map((u: unknown) => String(u).trim()).filter(Boolean)
            : parseListField(payload.galleryImages),
          metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
          highlights:
            Array.isArray(payload.highlights) && payload.highlights.length > 0
              ? payload.highlights
              : [String(payload.summary || "Initial deployment")],
          keyArchitecture:
            String(payload.keyArchitecture || "").trim() ||
            "Pipeline: Input -> Model -> Output",
          hasDetailedCaseStudy: Boolean(payload.hasDetailedCaseStudy),
        };

        await ProjectModel.create(newProject);
        revalidatePortfolioRoutes(slug);
        return NextResponse.json({
          success: true,
          project: newProject,
          message: "Project saved to MongoDB!",
        });
      }

      case "UPDATE_PROJECT": {
        if (Array.isArray(payload.projects)) {
          for (let i = 0; i < payload.projects.length; i++) {
            const proj = payload.projects[i] as Record<string, unknown>;
            if (!isNonEmptyString(proj?.id) && !isNonEmptyString(proj?.slug)) {
              continue;
            }
            const identifier = isNonEmptyString(proj.id)
              ? proj.id.trim()
              : String(proj.slug).trim();
            await ProjectModel.updateOne(
              { $or: [{ id: identifier }, { slug: identifier }] },
              {
                $set: {
                  title: isNonEmptyString(proj.title) ? proj.title.trim() : undefined,
                  featured: Boolean(proj.featured),
                  featuredOrder:
                    Number.isFinite(Number(proj.featuredOrder))
                      ? Number(proj.featuredOrder)
                      : i + 1,
                },
              }
            );
          }
          revalidatePortfolioRoutes();
          return NextResponse.json({
            success: true,
            message: "Projects updated in MongoDB!",
          });
        }

        if (!isNonEmptyString(payload.title)) {
          return NextResponse.json(
            { success: false, message: "Project title is required." },
            { status: 400 }
          );
        }
        if (!isNonEmptyString(payload.id)) {
          return NextResponse.json(
            { success: false, message: "Project id is required." },
            { status: 400 }
          );
        }

        const updateSet: Record<string, unknown> = {
          title: payload.title.trim(),
        };
        if (isNonEmptyString(payload.slug)) updateSet.slug = payload.slug.trim();
        if (typeof payload.tagline === "string")
          updateSet.tagline = payload.tagline.trim();
        if (typeof payload.summary === "string")
          updateSet.summary = payload.summary.trim();
        if (typeof payload.problem === "string")
          updateSet.problem = payload.problem.trim();
        if (typeof payload.approach === "string")
          updateSet.approach = payload.approach.trim();
        if (typeof payload.challenges === "string")
          updateSet.challenges = payload.challenges.trim();
        if (isNonEmptyString(payload.category))
          updateSet.category = payload.category.trim();
        if (typeof payload.domain === "string")
          updateSet.domain = payload.domain.trim();
        if (isNonEmptyString(payload.status))
          updateSet.status = payload.status.trim();
        if (payload.featured !== undefined)
          updateSet.featured = Boolean(payload.featured);
        if (
          payload.featuredOrder !== undefined &&
          Number.isFinite(Number(payload.featuredOrder))
        ) {
          updateSet.featuredOrder = Number(payload.featuredOrder);
        }
        if (payload.stack !== undefined)
          updateSet.stack = parseListField(payload.stack);
        if (typeof payload.githubUrl === "string")
          updateSet.githubUrl = payload.githubUrl.trim();
        if (typeof payload.demoUrl === "string")
          updateSet.demoUrl = payload.demoUrl.trim();
        if (typeof payload.paperUrl === "string")
          updateSet.paperUrl = payload.paperUrl.trim();
        if (typeof payload.imageUrl === "string")
          updateSet.imageUrl = payload.imageUrl.trim();
        if (payload.galleryImages !== undefined) {
          updateSet.galleryImages = Array.isArray(payload.galleryImages)
            ? payload.galleryImages.map((u: unknown) => String(u).trim()).filter(Boolean)
            : parseListField(payload.galleryImages);
        }
        if (typeof payload.keyArchitecture === "string")
          updateSet.keyArchitecture = payload.keyArchitecture.trim();
        if (Array.isArray(payload.metrics)) updateSet.metrics = payload.metrics;
        if (payload.highlights !== undefined) {
          updateSet.highlights = Array.isArray(payload.highlights)
            ? payload.highlights
            : parseListField(payload.highlights);
        }
        if (payload.hasDetailedCaseStudy !== undefined) {
          updateSet.hasDetailedCaseStudy = Boolean(payload.hasDetailedCaseStudy);
        }

        const updated = await ProjectModel.findOneAndUpdate(
          { $or: [{ id: payload.id }, { slug: payload.id }] },
          { $set: updateSet },
          { returnDocument: "after", runValidators: true }
        ).lean();

        if (!updated) {
          return NextResponse.json(
            { success: false, message: "Project not found." },
            { status: 404 }
          );
        }

        revalidatePortfolioRoutes(String(updateSet.slug || payload.id));
        return NextResponse.json({
          success: true,
          message: "Project updated in MongoDB!",
        });
      }

      case "DELETE_PROJECT": {
        if (!isNonEmptyString(payload.id)) {
          return NextResponse.json(
            { success: false, message: "Project id is required." },
            { status: 400 }
          );
        }
        const delRes = await ProjectModel.deleteOne({
          $or: [{ id: payload.id }, { slug: payload.id }],
        });
        if (delRes.deletedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Project not found." },
            { status: 404 }
          );
        }
        revalidatePortfolioRoutes(String(payload.id));
        return NextResponse.json({
          success: true,
          message: "Project deleted from MongoDB!",
        });
      }

      case "ADD_RESEARCH": {
        if (!isNonEmptyString(payload.title)) {
          return NextResponse.json(
            { success: false, message: "Research title is required." },
            { status: 400 }
          );
        }

        const id = isNonEmptyString(payload.id)
          ? payload.id.trim()
          : `research-${Date.now()}`;
        const existing = await ResearchModel.exists({ id });
        if (existing) {
          return NextResponse.json(
            { success: false, message: "Research id already exists." },
            { status: 409 }
          );
        }

        const earliest = await ResearchModel.findOne({})
          .sort({ order: 1 })
          .select("order")
          .lean<{ order?: number }>();
        const nextOrder =
          typeof earliest?.order === "number" ? earliest.order - 1 : 0;

        const newResearch = {
          id,
          title: payload.title.trim(),
          tagline: String(payload.tagline || "").trim(),
          status: payload.status || "Exploring",
          domain: payload.domain || "Computer Vision",
          targetOutcome:
            payload.targetOutcome || "Academic Thesis & Proposal",
          problem: String(payload.problem || "").trim(),
          researchQuestion: String(payload.researchQuestion || "").trim(),
          whyItMatters: String(payload.whyItMatters || "").trim(),
          existingApproaches:
            payload.existingApproaches || "Standard baseline models",
          researchGap:
            payload.researchGap || "Domain shift and dataset constraints",
          proposedDirection: String(payload.proposedDirection || "").trim(),
          experiments: payload.experiments || "Benchmarking protocols",
          currentResults: payload.currentResults || "Formulation stage",
          limitations: payload.limitations || "Preliminary exploration",
          futureWork: payload.futureWork || "Prospective graduate research",
          tags: parseListField(payload.tags),
          statusNote: typeof payload.statusNote === "string" ? payload.statusNote.trim() : "",
          order: nextOrder,
        };

        await ResearchModel.create(newResearch);
        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          research: newResearch,
          message: "Research direction saved to MongoDB!",
        });
      }

      case "UPDATE_RESEARCH": {
        if (!isNonEmptyString(payload.title) || !isNonEmptyString(payload.id)) {
          return NextResponse.json(
            { success: false, message: "Research id and title are required." },
            { status: 400 }
          );
        }

        const updateSet: Record<string, unknown> = {
          title: payload.title.trim(),
        };
        if (typeof payload.tagline === "string")
          updateSet.tagline = payload.tagline.trim();
        if (isNonEmptyString(payload.status))
          updateSet.status = payload.status.trim();
        if (typeof payload.domain === "string")
          updateSet.domain = payload.domain.trim();
        if (typeof payload.targetOutcome === "string")
          updateSet.targetOutcome = payload.targetOutcome.trim();
        if (typeof payload.problem === "string")
          updateSet.problem = payload.problem.trim();
        if (typeof payload.researchQuestion === "string")
          updateSet.researchQuestion = payload.researchQuestion.trim();
        if (typeof payload.whyItMatters === "string")
          updateSet.whyItMatters = payload.whyItMatters.trim();
        if (typeof payload.existingApproaches === "string")
          updateSet.existingApproaches = payload.existingApproaches.trim();
        if (typeof payload.researchGap === "string")
          updateSet.researchGap = payload.researchGap.trim();
        if (typeof payload.proposedDirection === "string")
          updateSet.proposedDirection = payload.proposedDirection.trim();
        if (typeof payload.experiments === "string")
          updateSet.experiments = payload.experiments.trim();
        if (typeof payload.currentResults === "string")
          updateSet.currentResults = payload.currentResults.trim();
        if (typeof payload.limitations === "string")
          updateSet.limitations = payload.limitations.trim();
        if (typeof payload.futureWork === "string")
          updateSet.futureWork = payload.futureWork.trim();
        if (typeof payload.statusNote === "string")
          updateSet.statusNote = payload.statusNote.trim();
        if (payload.tags !== undefined)
          updateSet.tags = parseListField(payload.tags);

        const updated = await ResearchModel.findOneAndUpdate(
          { id: payload.id },
          { $set: updateSet },
          { returnDocument: "after", runValidators: true }
        ).lean();

        if (!updated) {
          return NextResponse.json(
            { success: false, message: "Research card not found." },
            { status: 404 }
          );
        }

        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          message: "Research direction updated in MongoDB!",
        });
      }

      case "DELETE_RESEARCH": {
        if (!isNonEmptyString(payload.id)) {
          return NextResponse.json(
            { success: false, message: "Research id is required." },
            { status: 400 }
          );
        }
        const delRes = await ResearchModel.deleteOne({ id: payload.id });
        if (delRes.deletedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Research card not found." },
            { status: 404 }
          );
        }
        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          message: "Research card removed from MongoDB!",
        });
      }

      case "UPDATE_SKILLS": {
        if (!Array.isArray(payload.skills)) {
          return NextResponse.json(
            { success: false, message: "Skills array is required." },
            { status: 400 }
          );
        }
        await ProfileModel.updateOne(
          { key: "main" },
          { $set: { skills: payload.skills } },
          { upsert: true }
        );
        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          message: "Technical skills updated in MongoDB!",
        });
      }

      case "UPDATE_JOURNEY": {
        if (!Array.isArray(payload.journey)) {
          return NextResponse.json(
            { success: false, message: "Journey array is required." },
            { status: 400 }
          );
        }
        await ProfileModel.updateOne(
          { key: "main" },
          { $set: { journey: payload.journey } },
          { upsert: true }
        );
        revalidatePortfolioRoutes();
        return NextResponse.json({
          success: true,
          message: "Learning journey updated in MongoDB!",
        });
      }

      case "DELETE_MESSAGE": {
        if (!isNonEmptyString(payload.id)) {
          return NextResponse.json(
            { success: false, message: "Message id is required." },
            { status: 400 }
          );
        }
        const delRes = await MessageModel.deleteOne({ id: payload.id });
        if (delRes.deletedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Message not found." },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "Message deleted from MongoDB!",
        });
      }

      case "UPLOAD_FILE": {
        const { fileType, base64Data, slug, projectId } = payload;
        const allowedTypes: UploadAssetKind[] = [
          "avatar",
          "resume",
          "projectCover",
          "projectGallery",
        ];
        if (!allowedTypes.includes(fileType as UploadAssetKind)) {
          return NextResponse.json(
            { success: false, message: "Invalid upload fileType." },
            { status: 400 }
          );
        }
        if (!isNonEmptyString(base64Data)) {
          return NextResponse.json(
            { success: false, message: "base64Data is required." },
            { status: 400 }
          );
        }

        if (!isCloudinaryConfigured()) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.",
            },
            { status: 503 }
          );
        }

        const kind = fileType as UploadAssetKind;
        let uploaded: { secureUrl: string; publicId: string };
        try {
          uploaded = await uploadAssetToCloudinary(kind, base64Data, {
            slug: isNonEmptyString(slug) ? slug : undefined,
          });
        } catch (uploadErr) {
          const msg =
            uploadErr instanceof Error
              ? uploadErr.message
              : "Cloudinary upload failed.";
          const isValidationErr =
            /required|empty|invalid|under|must be|unsupported|signature/i.test(
              msg
            );
          return NextResponse.json(
            { success: false, message: msg },
            { status: isValidationErr ? 400 : 502 }
          );
        }

        if (kind === "avatar") {
          await ProfileModel.updateOne(
            { key: "main" },
            { $set: { avatar: uploaded.secureUrl } },
            { upsert: true }
          );
          revalidatePortfolioRoutes();
          return NextResponse.json({
            success: true,
            secureUrl: uploaded.secureUrl,
            message: "Profile picture uploaded to Cloudinary & saved!",
          });
        }

        if (kind === "resume") {
          await ProfileModel.updateOne(
            { key: "main" },
            { $set: { "socials.resumeUrl": uploaded.secureUrl } },
            { upsert: true }
          );
          revalidatePortfolioRoutes();
          return NextResponse.json({
            success: true,
            secureUrl: uploaded.secureUrl,
            message: "Resume PDF uploaded to Cloudinary & saved!",
          });
        }

        if (isNonEmptyString(projectId)) {
          if (kind === "projectCover") {
            await ProjectModel.updateOne(
              { $or: [{ id: projectId }, { slug: projectId }] },
              { $set: { imageUrl: uploaded.secureUrl } }
            );
          } else {
            await ProjectModel.updateOne(
              { $or: [{ id: projectId }, { slug: projectId }] },
              { $push: { galleryImages: uploaded.secureUrl } }
            );
          }
          revalidatePortfolioRoutes(String(slug || projectId));
        }

        return NextResponse.json({
          success: true,
          secureUrl: uploaded.secureUrl,
          message:
            kind === "projectCover"
              ? "Project cover image uploaded to Cloudinary!"
              : "Project gallery image uploaded to Cloudinary!",
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin API error:", sanitizeDbError(error));
    return NextResponse.json(
      { success: false, message: "Failed to process update" },
      { status: 500 }
    );
  }
}
