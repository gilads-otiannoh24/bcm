import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import ErrorResponse from "../utils/errorResponse";
import { Favourites, IFavourites } from "../models/Favourites";

// Add a card to favourites
export const AddToFavourites = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const cardIds = req.body.ids;

    const cardsToBeAdded: number[] = [];
    // Check if it's already in favourites
    cardIds.forEach(async (id: number) => {
      const exists = await Favourites.findOne({ user: userId, card: id });

      if (!exists) {
        cardsToBeAdded.push(id);
      }
    });

    if (cardsToBeAdded.length === 0) {
      return next(new ErrorResponse("Cards already in favourites", 400));
    }

    const favourites: IFavourites[] = [];
    cardsToBeAdded.forEach(async (id) => {
      const favourite = await Favourites.create({ user: userId, card: id });
      favourites.push(favourite);
    });

    res.status(201).json({
      message: "Added to favourites",
      favourites,
    });
  }
);

// Remove a card from favourites
export const RemoveFromFavourites = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const cardId = req.params.id;

    const deleted = await Favourites.findOneAndDelete({
      user: userId,
      card: cardId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Removed from favourites" });
  }
);

// Get all user's favourite cards
export const getMyFavourites = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;

    const favourites = await Favourites.find({ user: userId }).populate("card");

    res.status(200).json({
      count: favourites.length,
      favourites,
    });
  }
);
