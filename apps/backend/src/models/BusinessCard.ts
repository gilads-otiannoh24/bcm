import mongoose, { type Document, Schema, type Model } from "mongoose";

export type CardTemplate =
  | "professional"
  | "creative"
  | "minimal"
  | "bold"
  | "elegant";
export type CardStatus = "active" | "inactive" | "draft";

export interface IBusinessCard extends Document {
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  template: CardTemplate;
  color: string;
  status: CardStatus;
  views: number;
  shares: number;
  owner: mongoose.Types.ObjectId;
  organization?: mongoose.Types.ObjectId;
  preview: string;
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBusinessCardModel extends Model<IBusinessCard> {
  // Add any static methods here
}

const BusinessCardSchema = new Schema<IBusinessCard>(
  {
    title: {
      type: String,
      required: [true, "Card title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    template: {
      type: String,
      enum: ["professional", "creative", "minimal", "bold", "elegant"],
      default: "professional",
    },
    color: {
      type: String,
      default: "blue",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    preview: {
      type: String,
      default: "/placeholder.svg",
    },
    shareableLink: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate a shareable link when a card is created
BusinessCardSchema.pre("save", function (this: IBusinessCard, next) {
  if (!this.shareableLink) {
    this.shareableLink = `${process.env.FRONTEND_URL}/share/${this._id}`;
  }
  next();
});

// Virtual for card collections
BusinessCardSchema.virtual("collections", {
  ref: "CardCollection",
  localField: "_id",
  foreignField: "card",
  justOne: false,
});

export const BusinessCard = mongoose.model<IBusinessCard, IBusinessCardModel>(
  "BusinessCard",
  BusinessCardSchema
);
