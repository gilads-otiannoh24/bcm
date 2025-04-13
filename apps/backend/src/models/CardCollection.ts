import mongoose, { type Document, Schema, type Model } from "mongoose"

export interface ICardCollection extends Document {
  user: mongoose.Types.ObjectId
  card: mongoose.Types.ObjectId
  collectedAt: Date
  notes?: string
  tags?: string[]
  favorite: boolean
  createdAt: Date
  updatedAt: Date
}

interface ICardCollectionModel extends Model<ICardCollection> {
  // Add any static methods here
}

const CardCollectionSchema = new Schema<ICardCollection>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: "BusinessCard",
      required: true,
    },
    collectedAt: {
      type: Date,
      default: Date.now,
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
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure a user can only collect a card once
CardCollectionSchema.index({ user: 1, card: 1 }, { unique: true })

export const CardCollection = mongoose.model<ICardCollection, ICardCollectionModel>(
  "CardCollection",
  CardCollectionSchema,
)

