"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const CardCollection_1 = require("../models/CardCollection");
const express = require("express");
const router = express.Router();
const { getCollections, getCollection, createCollection, updateCollection, deleteCollection, toggleFavorite, addTag, removeTag, } = require("../controllers/cardCollections");
const { protect } = require("../middleware/auth");
// Apply protection to all routes
router.use(protect);
// Collection routes
router.route("/").get(getCollections).post(createCollection);
router
    .route("/:id")
    .get((0, advancedResults_1.default)(CardCollection_1.CardCollection, {
    populate: {
        path: "card",
        select: "title name jobTitle company email phone template color preview",
    },
}), getCollection)
    .patch(updateCollection)
    .delete(deleteCollection);
// Collection actions
router.patch("/:id/favorite", toggleFavorite);
router.post("/:id/tags", addTag);
router.delete("/:id/tags/:tag", removeTag);
exports.default = router;
