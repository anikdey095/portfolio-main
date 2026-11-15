import { v2 as cloudinary } from "cloudinary";

export type UploadAssetKind =
  | "avatar"
  | "resume"
  | "projectCover"
  | "projectGallery";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10 MB

function isPlaceholder(val?: string): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return !trimmed || /^(YOUR_|your_|<.*>|placeholder)/i.test(trimmed);
}

export function isCloudinaryConfigured(): boolean {
  return (
    !isPlaceholder(process.env.CLOUDINARY_CLOUD_NAME) &&
    !isPlaceholder(process.env.CLOUDINARY_API_KEY) &&
    !isPlaceholder(process.env.CLOUDINARY_API_SECRET)
  );
}

function configureCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not fully configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!.trim(),
    api_key: process.env.CLOUDINARY_API_KEY!.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET!.trim(),
    secure: true,
  });
}

function detectImageMimeFromMagicBytes(buf: Buffer): string | null {
  if (buf.length < 12) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function isPdfBuffer(buf: Buffer): boolean {
  if (buf.length < 5) return false;
  return buf.subarray(0, 5).toString("ascii") === "%PDF-";
}

export function parseAndValidateUpload(
  fileType: UploadAssetKind,
  base64Input: string
): { buffer: Buffer; mimeType: string; resourceType: "image" | "raw" } {
  const trimmed = String(base64Input || "").trim();
  if (!trimmed) {
    throw new Error("File data is required.");
  }

  let declaredMime = "";
  let base64Payload = trimmed;
  const dataUrlMatch = trimmed.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUrlMatch) {
    declaredMime = dataUrlMatch[1].toLowerCase();
    base64Payload = dataUrlMatch[2];
  }

  const buffer = Buffer.from(base64Payload, "base64");
  if (buffer.length === 0) {
    throw new Error("Uploaded file is empty or invalid base64.");
  }

  if (fileType === "resume") {
    if (buffer.length > MAX_RESUME_BYTES) {
      throw new Error("Resume PDF must be under 10 MB.");
    }
    if (declaredMime && declaredMime !== "application/pdf") {
      throw new Error("Resume must be a PDF file (application/pdf).");
    }
    if (!isPdfBuffer(buffer)) {
      throw new Error("Invalid PDF signature. Please upload a valid PDF document.");
    }
    return { buffer, mimeType: "application/pdf", resourceType: "raw" };
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error("Image file must be under 5 MB.");
  }

  const detectedMime = detectImageMimeFromMagicBytes(buffer);
  if (!detectedMime) {
    throw new Error(
      "Unsupported image format. Please upload a valid JPEG, PNG, or WebP image."
    );
  }

  if (
    declaredMime &&
    !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(declaredMime)
  ) {
    throw new Error("Unsupported image MIME type.");
  }

  return { buffer, mimeType: detectedMime, resourceType: "image" };
}

export async function uploadAssetToCloudinary(
  fileType: UploadAssetKind,
  base64Input: string,
  options?: { slug?: string }
): Promise<{ secureUrl: string; publicId: string }> {
  configureCloudinary();
  const { buffer, resourceType } = parseAndValidateUpload(fileType, base64Input);

  const folderMap: Record<UploadAssetKind, string> = {
    avatar: "portfolio/profile",
    resume: "portfolio/resume",
    projectCover: "portfolio/projects/covers",
    projectGallery: "portfolio/projects/gallery",
  };

  const safeSlug = (options?.slug || "project")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const publicId =
    fileType === "avatar"
      ? "profile-avatar"
      : fileType === "resume"
      ? "anik-dey-resume.pdf"
      : `${safeSlug || "project"}-${Date.now()}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderMap[fileType],
        public_id: publicId,
        resource_type: resourceType,
        overwrite: fileType === "avatar" || fileType === "resume",
        invalidate: fileType === "avatar" || fileType === "resume",
      },
      (err, result) => {
        if (err || !result?.secure_url) {
          reject(
            new Error(err?.message || "Cloudinary upload did not return a URL.")
          );
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}
