"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTag = exports.addTag = exports.toggleFavorite = exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollection = exports.getCollections = void 0;
const CardCollection_1 = require("../models/CardCollection");
const BusinessCard_1 = require("../models/BusinessCard");
const Activity_1 = require("../models/Activity");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const logger_1 = require("../utils/logger");
// @desc    Get all collections for current user
// @route   GET /api/v1/collections
// @access  Private
exports.getCollections = (0, async_1.default)(async (req, res, next) => {
    const collections = await CardCollection_1.CardCollection.find({
        user: req.user.id,
    }).populate({
        path: "card",
        select: "title name jobTitle company email phone template color preview",
    });
    res.status(200).json({
        success: true,
        count: collections.length,
        data: collections,
    });
});
// @desc    Get single collection
// @route   GET /api/v1/collections/:id
// @access  Private
exports.getCollection = (0, async_1.default)(async (req, res, next) => {
    const collection = await CardCollection_1.CardCollection.findById(req.params.id).populate({
        path: "card",
        select: "title name jobTitle company email phone website address template color preview",
    });
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this collection`, 401));
    }
    res.status(200).json({
        success: true,
        data: collection,
    });
});
// @desc    Create new collection
// @route   POST /api/v1/collections
// @access  Private
exports.createCollection = (0, async_1.default)(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;
    // Check if card exists
    const card = await BusinessCard_1.BusinessCard.findById(req.body.card);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.body.card}`, 404));
    }
    // Check if user already has this card in collection
    const existingCollection = await CardCollection_1.CardCollection.findOne({
        user: req.user.id,
        card: req.body.card,
    });
    if (existingCollection) {
        return next(new errorResponse_1.default(`You have already collected this card`, 400));
    }
    // Create collection
    const collection = await CardCollection_1.CardCollection.create(req.body);
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_collected",
        details: `Collected business card: ${card.title}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`User ${req.user.id} collected card ${card._id}`);
    // Increment card views
    card.views += 1;
    await card.save();
    res.status(201).json({
        success: true,
        data: collection,
    });
});
// @desc    Update collection
// @route   PUT /api/v1/collections/:id
// @access  Private
exports.updateCollection = (0, async_1.default)(async (req, res, next) => {
    let collection = await CardCollection_1.CardCollection.findById(req.params.id);
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this collection`, 401));
    }
    // Update collection
    collection = await CardCollection_1.CardCollection.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "collection_updated",
        details: `Updated collection with id ${req.params.id}`,
        relatedCard: collection.card.id,
    });
    (0, logger_1.logInfo)(`User ${req.user.id} updated collection ${req.params.id}`);
    res.status(200).json({
        success: true,
        data: collection,
    });
});
// @desc    Delete collection
// @route   DELETE /api/v1/collections/:id
// @access  Private
exports.deleteCollection = (0, async_1.default)(async (req, res, next) => {
    const collection = await CardCollection_1.CardCollection.findById(req.params.id);
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this collection`, 401));
    }
    await collection.deleteOne();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "collection_deleted",
        details: `Deleted collection with id ${req.params.id}`,
        relatedCard: collection.card.id,
    });
    (0, logger_1.logInfo)(`User ${req.user.id} deleted collection ${req.params.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Toggle favorite status
// @route   PUT /api/v1/collections/:id/favorite
// @access  Private
exports.toggleFavorite = (0, async_1.default)(async (req, res, next) => {
    const collection = await CardCollection_1.CardCollection.findById(req.params.id);
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this collection`, 401));
    }
    // Toggle favorite status
    collection.favorite = !collection.favorite;
    await collection.save();
    res.status(200).json({
        success: true,
        data: collection,
    });
});
// @desc    Add tag to collection
// @route   POST /api/v1/collections/:id/tags
// @access  Private
exports.addTag = (0, async_1.default)(async (req, res, next) => {
    const collection = await CardCollection_1.CardCollection.findById(req.params.id);
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this collection`, 401));
    }
    const newTags = req.body.tags; // expecting an array of tags in the request body
    if (!Array.isArray(newTags) || newTags.length === 0) {
        return next(new errorResponse_1.default("Please provide at least one tag", 400));
    }
    if (!collection.tags) {
        collection.tags = [];
    }
    const existingTags = collection.tags;
    const tagsToAdd = newTags.filter((tag) => !existingTags.includes(tag));
    const duplicateTags = newTags.filter((tag) => existingTags.includes(tag));
    // Add new unique tags
    collection.tags.push(...tagsToAdd);
    await collection.save();
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "collection_updated",
        details: `Added tags to collection with id ${req.params.id}`,
        relatedCard: collection.card.id,
    });
    (0, logger_1.logInfo)(`User ${req.user.id} added tags to collection ${req.params.id}`);
    res.status(200).json({
        success: true,
        data: collection,
        message: `Tags added: ${tagsToAdd.join(", ")}`,
        duplicateTags: duplicateTags.length > 0
            ? `Duplicate tags: ${duplicateTags.join(", ")}`
            : undefined,
    });
});
// @desc    Remove tag from collection
// @route   DELETE /api/v1/collections/:id/tags/:tag
// @access  Private
exports.removeTag = (0, async_1.default)(async (req, res, next) => {
    const collection = await CardCollection_1.CardCollection.findById(req.params.id);
    if (!collection) {
        return next(new errorResponse_1.default(`Collection not found with id of ${req.params.id}`, 404));
    }
    // Make sure user owns collection
    if (collection.user.toString() !== req.user.id &&
        req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this collection`, 401));
    }
    // Check if tag exists
    if (!collection.tags || !collection.tags.includes(req.params.tag)) {
        return next(new errorResponse_1.default(`Tag ${req.params.tag} not found`, 404));
    }
    // Remove tag
    collection.tags = collection.tags.filter((tag) => tag !== req.params.tag);
    await collection.save();
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "collection_updated",
        details: `Removed tag from collection with id ${req.params.id}`,
        relatedCard: collection.card.id,
    });
    (0, logger_1.logInfo)(`User ${req.user.id} removed tag from collection ${req.params.id}`);
    res.status(200).json({
        success: true,
        data: collection,
    });
});
