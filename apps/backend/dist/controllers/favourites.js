"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavourites = exports.RemoveFromFavourites = exports.AddToFavourites = void 0;
const async_1 = __importDefault(require("../middleware/async"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const Favourites_1 = require("../models/Favourites");
// Add a card to favourites
exports.AddToFavourites = (0, async_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    const cardIds = req.body.ids || [];
    // Check if it's already in favourites
    cardIds.forEach(async (id) => {
        const exists = await Favourites_1.Favourite.findOne({ user: userId, card: id });
        if (exists) {
            return;
        }
        await Favourites_1.Favourite.create({ user: userId, card: id });
    });
    const favourites = await Favourites_1.Favourite.find();
    res.status(201).json({
        success: true,
        message: "Added to favourites",
        favourites,
    });
});
// Remove a card from favourites
exports.RemoveFromFavourites = (0, async_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    const cardId = req.params.id;
    if (!cardId) {
        return next(new errorResponse_1.default("Card id s required", 400));
    }
    const deleted = await Favourites_1.Favourite.findOneAndDelete({
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
});
// Get all user's favourite cards
exports.getMyFavourites = (0, async_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    const favourites = await Favourites_1.Favourite.find({ user: userId }).populate([
        "card",
        "user",
    ]);
    res.status(200).json({
        success: true,
        message: "Favourites retrieved successfully",
        count: favourites.length,
        favourites,
    });
});
