import mongoose, { type Document, Schema, type Model } from "mongoose";

export type ActivityType =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "card_created"
  | "card_shared"
  | "card_collected"
  | "card_duplicated"
  | "card_viewed"
  | "card_updated"
  | "user_deleted"
  | "card_deleted"
  | "connection_created"
  | "connection_updated"
  | "connection_deleted"
  | "card_updated"
  | "user_logged_in"
  | "user_logged_out"
  | "user_reset_password"
  | "user_forgot_password"
  | "user_updated";

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: ActivityType;
  details: string;
  relatedUser?: mongoose.Types.ObjectId;
  relatedCard?: mongoose.Types.ObjectId;
  relatedConnection?: mongoose.Types.ObjectId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IActivityModel extends Model<IActivity> {
  // Add any static methods here
}

const ActivitySchema = new Schema<IActivity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "user_created",
        "user_updated",
        "user_deleted",
        "card_created",
        "card_viewed",
        "card_shared",
        "card_collected",
        "card_duplicated",
        "card_updated",
        "user_deleted",
        "card_deleted",
        "connection_created",
        "connection_updated",
        "connection_deleted",
        "card_updated",
        "user_logged_in",
        "user_logged_out",
        "user_reset_password",
        "user_forgot_password",
        "user_updated",
      ],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    relatedCard: {
      type: Schema.Types.ObjectId,
      ref: "BusinessCard",
    },
    relatedConnection: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model<IActivity, IActivityModel>(
  "Activity",
  ActivitySchema
);
