"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserActivities = exports.getActivity = exports.getActivities = void 0;
const Activity_1 = require("../models/Activity");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
// @desc    Get all activities
// @route   GET /api/v1/activities
// @access  Private/Admin
exports.getActivities = (0, async_1.default)(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
// @desc    Get single activity
// @route   GET /api/v1/activities/:id
// @access  Private
exports.getActivity = (0, async_1.default)(async (req, res, next) => {
    const activity = await Activity_1.Activity.findById(req.params.id)
        .populate({
        path: "user",
        select: "firstName lastName email avatar",
    })
        .populate({
        path: "relatedUser",
        select: "firstName lastName email avatar",
    })
        .populate({
        path: "relatedCard",
        select: "title name jobTitle company template color",
    });
    if (!activity) {
        return next(new errorResponse_1.default(`Activity not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is activity owner or admin
    if (activity.user.id !== req.user.id && req.user.role !== "admin") {
        return next(new errorResponse_1.default(`User ${req.user.id} is not authorized to access this activity`, 401));
    }
    res.status(200).json({
        success: true,
        data: activity,
    });
});
// @desc    Get activities for current user
// @route   GET /api/v1/activities/me
// @access  Private
exports.getUserActivities = (0, async_1.default)(async (req, res, next) => {
    const activities = await Activity_1.Activity.find({ user: req.user.id })
        .populate({
        path: "relatedUser",
        select: "firstName lastName email avatar",
    })
        .populate({
        path: "relatedCard",
        select: "title name jobTitle company template color",
    })
        .sort("-createdAt");
    res.status(200).json({
        success: true,
        count: activities.length,
        data: activities,
    });
});
