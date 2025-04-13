import mongoose, { type Document, Schema, type Model } from "mongoose"

export type OrganizationSize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+"
export type OrganizationStatus = "active" | "inactive"

export interface IOrganization extends Document {
  name: string
  description?: string
  logo: string
  website?: string
  industry?: string
  size: OrganizationSize
  location?: string
  status: OrganizationStatus
  owner: mongoose.Types.ObjectId
  admins: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

interface IOrganizationModel extends Model<IOrganization> {
  // Add any static methods here
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "/placeholder.svg",
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      default: "1-10",
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for members
OrganizationSchema.virtual("members", {
  ref: "User",
  localField: "_id",
  foreignField: "organization",
  justOne: false,
})

// Virtual for organization cards
OrganizationSchema.virtual("cards", {
  ref: "BusinessCard",
  localField: "_id",
  foreignField: "organization",
  justOne: false,
})

export const Organization = mongoose.model<IOrganization, IOrganizationModel>("Organization", OrganizationSchema)

