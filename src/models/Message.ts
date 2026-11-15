import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    createdAt: { type: String, required: true, index: true },
    contentHash: { type: String, default: "", index: true },
    clientIp: { type: String, default: "", index: true },
    emailStatus: {
      type: String,
      enum: ["delivered", "failed", "pending"],
      default: "pending",
    },
    deliveryError: { type: String, default: "" },
  },
  {
    collection: "messages",
    timestamps: { createdAt: "dbCreatedAt", updatedAt: "dbUpdatedAt" },
  }
);

MessageSchema.index({ contentHash: 1, dbCreatedAt: -1 });
MessageSchema.index({ clientIp: 1, dbCreatedAt: -1 });

export type MessageDocument = InferSchemaType<typeof MessageSchema>;

export const MessageModel: Model<MessageDocument> =
  (mongoose.models.Message as Model<MessageDocument>) ||
  mongoose.model<MessageDocument>("Message", MessageSchema);
