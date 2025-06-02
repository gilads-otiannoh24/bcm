import mongoose, { type Document, Model, Schema } from "mongoose";

export interface IFavourite extends Document {
  user: mongoose.Types.ObjectId;
  card: mongoose.Types.ObjectId;
}

interface IFavouriteModel extends Model<IFavourite> {}

const FavouritesSchema = new Schema<IFavourite>(
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Favourite = mongoose.model<IFavourite, IFavouriteModel>(
  "Favourite",
  FavouritesSchema
);
