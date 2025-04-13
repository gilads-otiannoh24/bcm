import mongoose, { type Document, Schema, type Model } from "mongoose"

export type ConnectionType = "shared" | "collected"
export type ConnectionStatus = "pending" | "accepted" | "rejected"

export interface IExternalContact {
  name?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  notes?: string
}

export interface IConnection extends Document {
  user: mongoose.Types.ObjectId
  contact?: mongoose.Types.ObjectId
  externalContact?: IExternalContact
  card: mongoose.Types.ObjectId
  type: ConnectionType
  status: ConnectionStatus
  notes?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

interface IConnectionModel extends Model<IConnection> {
  // Add any static methods here
}

const ConnectionSchema = new Schema<IConnection>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // For external contacts not in the system
    externalContact: {
      name: String,
      email: String,
      phone: String,
      company: String,
      jobTitle: String,
      notes: String,
    },
    // The business card that was shared/collected
    card: {
      type: Schema.Types.ObjectId,
      ref: "BusinessCard",
      required: true,
    },
    type: {
      type: String,
      enum: ["shared", "collected"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Connection = mongoose.model<IConnection, IConnectionModel>("Connection", ConnectionSchema)

