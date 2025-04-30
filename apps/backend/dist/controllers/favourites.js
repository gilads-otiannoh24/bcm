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
    const cardIds = req.body.ids;
    const cardsToBeAdded = [];
    // Check if it's already in favourites
    cardIds.forEach(async (id) => {
        const exists = await Favourites_1.Favourites.findOne({ user: userId, card: id });
        if (!exists) {
            cardsToBeAdded.push(id);
        }
    });
    if (cardsToBeAdded.length === 0) {
        return next(new errorResponse_1.default("Cards already in favourites", 400));
    }
    const favourites = [];
    cardsToBeAdded.forEach(async (id) => {
        const favourite = await Favourites_1.Favourites.create({ user: userId, card: id });
        favourites.push(favourite);
    });
    res.status(201).json({
        message: "Added to favourites",
        favourites,
    });
});
// Remove a card from favourites
exports.RemoveFromFavourites = (0, async_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    const cardId = req.params.id;
    const deleted = await Favourites_1.Favourites.findOneAndDelete({
        user: userId,
        card: cardId,
    });
    if (!deleted) {
        return res.status(404).json({ message: "Favourite not found" });
    }
    res.status(200).json({ message: "Removed from favourites" });
});
// Get all user's favourite cards
exports.getMyFavourites = (0, async_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    const favourites = await Favourites_1.Favourites.find({ user: userId }).populate("card");
    res.status(200).json({
        count: favourites.length,
        favourites,
    });
});
