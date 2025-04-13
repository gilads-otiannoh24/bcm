"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSettings = exports.getUserSettings = exports.getSetting = exports.getSettings = void 0;
const async_1 = __importDefault(require("../middleware/async"));
const Settings_1 = require("../models/Settings");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const Activity_1 = require("../models/Activity");
const logger_1 = require("../utils/logger");
exports.getSettings = (0, async_1.default)(async (req, res, next) => {
    return res.advancedResults;
});
exports.getSetting = (0, async_1.default)(async (req, res, next) => {
    const setting = await Settings_1.Settings.findById(req.params.id);
    if (!setting) {
        return next(new errorResponse_1.default(`Settings not found for user with id of ${req.params.id}`, 404));
    }
    if (req.user?.id !== setting.user && req.user?.role !== "admin") {
        return next(new errorResponse_1.default(`Not authorized to access this setting`, 401));
    }
    return res.send({ success: true, data: setting });
});
exports.getUserSettings = (0, async_1.default)(async (req, res, next) => {
    const setting = await Settings_1.Settings.findOne({ user: req.user?.id });
    if (!setting) {
        return next(new errorResponse_1.default(`Setting not found for user ${req.user?.id}`, 404));
    }
    return res.send({ success: true, data: setting });
});
exports.updateUserSettings = (0, async_1.default)(async (req, res, next) => {
    const fieldsToUpdate = {
        theme: req.body.theme,
        language: req.body.language,
        cardLayout: req.body.cardLayout,
        cardTemplate: req.body.cardTemplate,
        autoShareCardsWithConnections: req.body.autoShareCardsWithConnections,
        requireApprovalBeforeSharing: req.body.requireApprovalBeforeSharing,
        showCardAnalytics: req.body.showCardAnalytics,
    };
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined &&
        delete fieldsToUpdate[key]);
    const setting = await Settings_1.Settings.findOneAndUpdate({ user: req.user?.id }, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    if (!setting) {
        return next(new errorResponse_1.default(`Setting not found for user ${req.user?.id}`, 404));
    }
    // create activity log
    await Activity_1.Activity.create({
        user: req.user._id,
        type: "user_updated",
        details: `User ${req.user.firstName} ${req.user.lastName} updated their details`,
        relatedUser: req.user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User settings updated - ${req.user._id}`, {
        userId: req.user._id,
        userRole: req.user.role,
    });
    return res.send({ success: true, data: setting });
});
