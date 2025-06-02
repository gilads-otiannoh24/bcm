"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardStats = exports.duplicateCard = exports.getCardByShareableLink = exports.shareCard = exports.deleteBulkCards = exports.deleteCard = exports.updateCard = exports.createCard = exports.getMyCards = exports.getCard = exports.getCards = void 0;
const BusinessCard_1 = require("../models/BusinessCard");
const Activity_1 = require("../models/Activity");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const logger_1 = require("../utils/logger");
const User_1 = require("../models/User");
// @desc    Get all business cards
// @route   GET /api/v1/businesscards
// @access  Private/Admin
exports.getCards = (0, async_1.default)(async (req, res, next) => {
    res.status(200).json(res.advancedResults); //
});
// @desc    Get single business card
// @route   GET /api/v1/businesscards/:id
// @access  Private
exports.getCard = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findById(req.params.id).populate({
        path: "owner",
        select: "firstName lastName email avatar",
    });
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: card,
    });
});
// @desc    Get business cards for current user
// @route   GET /api/v1/businesscards/me
// @access  Private
exports.getMyCards = (0, async_1.default)(async (req, res, next) => {
    const cards = await BusinessCard_1.BusinessCard.find({ owner: req.user.id });
    res.status(200).json({
        success: true,
        count: cards.length,
        data: cards,
    });
});
// @desc    Create new business card
// @route   POST /api/v1/businesscards
// @access  Private
exports.createCard = (0, async_1.default)(async (req, res, next) => {
    // Add user to req.body
    req.body.owner = req.body.userId || req.user.id;
    // Check if user has organization
    if (req.user.organization) {
        req.body.organization = req.user.organization.toString();
    }
    const card = await BusinessCard_1.BusinessCard.create(req.body);
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_created",
        details: `Created business card: ${card.title} ${req.body.userId
            ? `for user ${(await User_1.User.findById(req.body.userId))?.firstName}`
            : ""}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`Business card created: ${card._id} by user ${req.user.id}`);
    res.status(201).json({
        success: true,
        data: card,
    });
});
// @desc    Update business card
// @route   PUT /api/v1/businesscards/:id
// @access  Private
exports.updateCard = (0, async_1.default)(async (req, res, next) => {
    let card = await BusinessCard_1.BusinessCard.findById(req.params.id);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to update this card`, 401));
    }
    card = await BusinessCard_1.BusinessCard.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_updated",
        details: `Updated business card: ${card.title}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`Business card updated: ${card.id} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: card,
    });
});
// @desc    Delete business card
// @route   DELETE /api/v1/businesscards/:id
// @access  Private
exports.deleteCard = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findById(req.params.id);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to delete this card`, 401));
    }
    await card.deleteOne();
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_deleted",
        details: `Deleted business card: ${card.title}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`Business card deleted: ${card.id} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Delete bulk business card
// @route   POST /api/v1/businesscards/deletebulk
// @access  Private
exports.deleteBulkCards = (0, async_1.default)(async (req, res, next) => {
    const ids = req.body.ids;
    const deletedCards = await BusinessCard_1.BusinessCard.deleteMany({
        _id: { $in: ids },
    });
    const deletedCount = deletedCards.deletedCount;
    (0, logger_1.logInfo)(`Deleted ${deletedCount} business cards by user ${req.user?.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Share business card
// @route   POST /api/v1/businesscards/:id/share
// @access  Private
exports.shareCard = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findById(req.params.id);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is card owner or admin
    if (card.owner.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to share this card`, 401));
    }
    // Increment shares count
    card.shares += 1;
    await card.save();
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_shared",
        details: `Shared business card: ${card.title}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`Business card shared: ${card.id} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {
            shareableLink: card.shareableLink,
        },
    });
});
// @desc    Get business card by shareable link
// @route   GET /api/v1/businesscards/share/:shareableLink
// @access  Public
exports.getCardByShareableLink = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findOne({
        _id: req.params.shareableLink,
        status: "active",
    }).populate({
        path: "owner",
        select: "firstName lastName email avatar",
    });
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with this link`, 404));
    }
    // Increment views count
    card.views += 1;
    await card.save();
    // Create activity log
    await Activity_1.Activity.create({
        user: card.owner.id,
        type: "card_viewed",
        details: `Viewed business card: ${card.title}`,
        relatedCard: card._id,
    });
    (0, logger_1.logInfo)(`Business card viewed: ${card.id} by user ${card.owner.id}`);
    res.status(200).json({
        success: true,
        data: card,
    });
});
// @desc    Duplicate business card
// @route   POST /api/v1/businesscards/:id/duplicate
// @access  Private
exports.duplicateCard = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findById(req.params.id);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is card owner or admin
    if (card.owner.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to duplicate this card`, 401));
    }
    // Create a new card with the same data
    const newCard = await BusinessCard_1.BusinessCard.create({
        title: `Copy of ${card.title}`,
        name: card.name,
        jobTitle: card.jobTitle,
        company: card.company,
        email: card.email,
        phone: card.phone,
        website: card.website,
        address: card.address,
        template: card.template,
        color: card.color,
        status: "draft",
        owner: req.user.id,
        organization: card.organization,
    });
    // Create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "card_created",
        details: `Duplicated business card: ${card.title}`,
        relatedCard: newCard._id,
    });
    (0, logger_1.logInfo)(`Business card duplicated: ${newCard.id} by user ${req.user.id}`);
    res.status(201).json({
        success: true,
        data: newCard,
    });
});
// @desc    Get business card stats
// @route   GET /api/v1/businesscards/:id/stats
// @access  Private
exports.getCardStats = (0, async_1.default)(async (req, res, next) => {
    const card = await BusinessCard_1.BusinessCard.findById(req.params.id);
    if (!card) {
        return next(new errorResponse_1.default(`Business card not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is card owner or admin
    if (card.owner.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to view stats for this card`, 401));
    }
    // Get activities related to this card
    const activities = await Activity_1.Activity.find({
        relatedCard: card._id,
        type: { $in: ["card_shared", "card_collected"] },
    })
        .sort("-createdAt")
        .limit(10);
    (0, logger_1.logInfo)(`Business card stats viewed: ${card.id} by user ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {
            views: card.views,
            shares: card.shares,
            recentActivities: activities,
        },
    });
});
