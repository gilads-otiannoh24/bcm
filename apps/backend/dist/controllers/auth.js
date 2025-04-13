"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.checkAdminExists = exports.resetPassword = exports.validateResetToken = exports.anonymizeAccount = exports.forgotPassword = exports.updatePassword = exports.updateDetails = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const logger_1 = require("../utils/logger");
const Activity_1 = require("../models/Activity");
const Settings_1 = require("../models/Settings");
const sendResetPasswordEmail_1 = require("../utils/sendResetPasswordEmail");
const userRestToken_1 = require("../utils/userRestToken");
const Connection_1 = require("../models/Connection");
const CardCollection_1 = require("../models/CardCollection");
const BusinessCard_1 = require("../models/BusinessCard");
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = (0, async_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    // check if email exists
    const userExists = await User_1.User.find({ email });
    if (userExists.length > 0) {
        return next(new errorResponse_1.default("Email already in use", 400));
    }
    // Create user
    const user = await User_1.User.create({
        firstName,
        lastName,
        email,
        password,
    });
    await Settings_1.Settings.create({
        user: user._id,
    });
    await Activity_1.Activity.create({
        user: user._id,
        type: "user_created",
        details: `User ${user.firstName} ${user.lastName} created`,
        relatedUser: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User created - ${user._id}`, {
        userId: user._id,
        userRole: user.role,
    });
    sendTokenResponse(user, 201, res);
});
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = (0, async_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        return next(new errorResponse_1.default("Please provide an email and password", 400));
    }
    // Check for user
    const user = await User_1.User.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorResponse_1.default("Invalid credentials", 401));
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new errorResponse_1.default("Invalid credentials", 401));
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    // create activity log
    await Activity_1.Activity.create({
        user: user._id,
        type: "user_logged_in",
        details: `User ${user.firstName} ${user.lastName} logged in`,
        relatedUser: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User log in - ${user._id}`, {
        userId: user._id,
        userRole: user.role,
    });
    sendTokenResponse(user, 200, res);
});
// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = (0, async_1.default)(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    // create activity log
    await Activity_1.Activity.create({
        user: req.user._id,
        type: "user_logged_out",
        details: `User ${req.user.firstName} ${req.user.lastName} logged out`,
        relatedUser: req.user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User log out - ${req.user._id}`, {
        userId: req.user._id,
        userRole: req.user.role,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = (0, async_1.default)(async (req, res, next) => {
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        jobTitle: req.body.jobTitle,
        company: req.body.company,
        location: req.body.location,
        phone: req.body.phone,
        bio: req.body.bio,
        socialLinks: req.body.socialLinks,
    };
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => fieldsToUpdate[key] === undefined &&
        delete fieldsToUpdate[key]);
    const user = await User_1.User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    // create activity log
    await Activity_1.Activity.create({
        user: req.user._id,
        type: "user_updated",
        details: `User ${req.user.firstName} ${req.user.lastName} updated their details`,
        relatedUser: req.user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User updated - ${req.user._id}`, {
        userId: req.user._id,
        userRole: req.user.role,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new errorResponse_1.default("User not found", 404));
    }
    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.matchPassword(currentPassword);
    // Check current password
    if (!isMatch) {
        return next(new errorResponse_1.default("Password is incorrect", 400));
    }
    user.password = newPassword;
    await user.save();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user._id,
        type: "user_updated",
        details: `User ${req.user.firstName} ${req.user.lastName} updated their password`,
        relatedUser: req.user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User updated password - ${req.user._id}`, {
        userId: req.user._id,
        userRole: req.user.role,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorResponse_1.default("There is no user with that email", 404));
    }
    const resetToken = await (0, userRestToken_1.restPasswordToken)(user);
    try {
        await (0, sendResetPasswordEmail_1.sendResetPasswordEmail)({
            user,
            resetToken,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });
        (0, logger_1.logInfo)(`User forgot password - ${user._id}`, {
            userId: user._id,
            userRole: user.role,
        });
        res.status(200).json({ success: true, data: "Email sent" });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new errorResponse_1.default("Email could not be sent", 500));
    }
});
// @desc    Anonymize user account
// @route   POST /api/v1/auth/deleteaccount
// @access  Private
exports.anonymizeAccount = (0, async_1.default)(async (req, res, next) => {
    // Get user from request
    const user = await User_1.User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new errorResponse_1.default("User not found", 404));
    }
    // Verify password
    if (!(await user.matchPassword(req.body.password))) {
        return next(new errorResponse_1.default("Incorrect password", 401));
    }
    // Generate anonymized values
    const anonymousEmail = `deleted-${crypto_1.default
        .randomBytes(8)
        .toString("hex")}@anonymized.user`;
    // Update user with anonymized data
    user.firstName = "Deleted";
    user.lastName = "User";
    user.email = anonymousEmail;
    user.phone = undefined;
    user.avatar = "/placeholder.svg";
    user.bio = "";
    user.jobTitle = "";
    user.company = "";
    user.location = "";
    user.socialLinks = {};
    user.status = "inactive";
    user.isAnonymized = true;
    user.deletedAt = new Date();
    user.deletionReason = req.body.reason || "User requested deletion";
    await user.save({ validateBeforeSave: false });
    // Mark all user's business cards as inactive
    await BusinessCard_1.BusinessCard.updateMany({ owner: user._id }, { status: "inactive" });
    // Log the anonymization
    await Activity_1.Activity.create({
        user: user._id,
        type: "user_deleted",
        details: "User account anonymized per user request",
    });
    // Clear cookies
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.cookie("refreshToken", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
        message: "Account successfully anonymized",
    });
});
// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword/validate
// @access  Public
exports.validateResetToken = (0, async_1.default)(async (req, res, next) => {
    const { resettoken } = req.body;
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resettoken)
        .digest("hex");
    const user = await User_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new errorResponse_1.default("Invalid token", 400));
    }
    res.status(200).json({ success: true, data: user });
});
// @desc    Reset password
// @route   PATCH /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = (0, async_1.default)(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");
    const user = await User_1.User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new errorResponse_1.default("Invalid token", 400));
    }
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    // create activity log
    await Activity_1.Activity.create({
        user: user._id,
        type: "user_reset_password",
        details: `User ${user.firstName} ${user.lastName} reset their password`,
        relatedUser: user._id,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User reset password - ${user._id}`, {
        userId: user._id,
        userRole: user.role,
    });
    res.status(200).json({ success: true, data: user });
});
// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() +
            (Number.parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) *
                24 *
                60 *
                60 *
                1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
    });
};
// @desc    Check if admin exists
// @route   GET /api/v1/auth/admin-exists
// @access  Public
exports.checkAdminExists = (0, async_1.default)(async (req, res, next) => {
    const adminExists = await User_1.User.findOne({ role: "admin" });
    res.status(200).json({
        success: true,
        data: {
            adminExists: !!adminExists,
        },
    });
});
// @desc    Get user profile data
// @route   GET /api/v1/auth/profile
// @access  Private
exports.getUserProfile = (0, async_1.default)(async (req, res, next) => {
    // Get user with populated data
    const user = await User_1.User.findById(req.user.id)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .populate({
        path: "cards",
        select: "title template color status views shares",
    });
    if (!user) {
        return next(new errorResponse_1.default("User not found", 404));
    }
    // Get connection stats
    const connectionsCount = await Connection_1.Connection.countDocuments({
        $or: [{ user: req.user.id }, { contact: req.user.id }],
    });
    // Get cards collected count
    const cardsCollectedCount = await CardCollection_1.CardCollection.countDocuments({
        user: req.user.id,
    });
    // Get cards shared count
    const cardsSharedCount = await Connection_1.Connection.countDocuments({
        user: req.user.id,
        type: "shared",
    });
    // Get recent activity
    const recentActivity = await Activity_1.Activity.find({
        $or: [{ user: req.user.id }, { relatedUser: req.user.id }],
    })
        .sort("-createdAt")
        .limit(5)
        .populate({
        path: "relatedCard",
        select: "title name jobTitle company",
    })
        .populate({
        path: "relatedUser",
        select: "firstName lastName avatar",
    });
    // Format the activity data to match the profile page expectations
    const formattedActivity = recentActivity.map((activity) => {
        let name = "";
        let type = "updated";
        if (activity.type === "card_collected") {
            type = "collected";
            name = activity.relatedUser
                ? // @ts-ignore
                    `${activity.relatedUser.firstName} ${activity.relatedUser.lastName}`
                : activity.relatedCard
                    ? // @ts-ignore
                        activity.relatedCard.name
                    : "Unknown";
        }
        else if (activity.type === "card_shared") {
            type = "shared";
            name = activity.relatedUser
                ? // @ts-ignore
                    `${activity.relatedUser.firstName} ${activity.relatedUser.lastName}`
                : "Unknown";
        }
        else if (activity.type === "card_updated") {
            type = "updated";
            name = activity.relatedCard
                ? // @ts-ignore
                    activity.relatedCard.title
                : "Your business card";
        }
        return {
            id: activity._id,
            type,
            name,
            date: activity.createdAt,
        };
    });
    // Construct the profile data object
    const profileData = {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        jobTitle: user.jobTitle || "",
        company: user.company || "",
        location: user.location || "",
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar,
        socialLinks: user.socialLinks || {},
        stats: {
            cardsCollected: cardsCollectedCount,
            cardsShared: cardsSharedCount,
            connections: connectionsCount,
        },
        recentActivity: formattedActivity,
    };
    res.status(200).json({
        success: true,
        data: profileData,
    });
});
