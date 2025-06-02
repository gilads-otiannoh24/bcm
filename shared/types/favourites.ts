import { BusinessCard } from "./businessCard";
import { User } from "./user";

export interface FavouriteCard {
  _id: string;
  user: User;
  card: BusinessCard;
}
