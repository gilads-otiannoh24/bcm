import mongoose, { type Document, Model, Schema } from "mongoose";

export interface IFavourites extends Document {
  user: mongoose.Types.ObjectId;
  card: mongoose.Types.ObjectId;
}

interface IFavouritesModel extends Model<IFavourites> {}

const FavouritesSchema = new Schema<IFavourites>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Cards",
    required: true,
  },
});

export const Favourites = mongoose.model<IFavourites, IFavouritesModel>(
  "Favourites",
  FavouritesSchema
);
