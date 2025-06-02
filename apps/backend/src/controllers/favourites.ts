import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/async";
import { AuthenticatedRequest } from "../middleware/auth";
import ErrorResponse from "../utils/errorResponse";
import { Favourite, IFavourite } from "../models/Favourites";

// Add a card to favourites
export const AddToFavourites = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const cardIds = req.body.ids || [];

    // Check if it's already in favourites
    cardIds.forEach(async (id: string) => {
      const exists = await Favourite.findOne({ user: userId, card: id });

      if (exists) {
        return;
      }

      await Favourite.create({ user: userId, card: id });
    });

    const favourites = await Favourite.find();

    res.status(201).json({
      success: true,
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

    if (!cardId) {
      return next(new ErrorResponse("Card id s required", 400));
    }

    const deleted = await Favourite.findOneAndDelete({
      user: userId,
      card: cardId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({
      success: true,
      message: "Removed from favourites successfully!",
    });
  }
);

// Get all user's favourite cards
export const getMyFavourites = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!._id;

    const favourites = await Favourite.find({ user: userId }).populate([
      "card",
      "user",
    ]);

    res.status(200).json({
      success: true,
      message: "Favourites retrieved successfully",
      count: favourites.length,
      favourites,
    });
  }
);
