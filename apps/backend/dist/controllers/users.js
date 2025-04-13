"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUs = exports.createAdminUser = exports.deleteBulkUsers = exports.deleteUser = exports.updateUserRole = exports.updateUser = exports.createUser = exports.getUser = exports.getTopUsers = exports.getUsers = void 0;
const User_1 = require("../models/User");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
const Activity_1 = require("../models/Activity");
const logger_1 = require("../utils/logger");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const Settings_1 = require("../models/Settings");
const sendResetPasswordEmail_1 = require("../utils/sendResetPasswordEmail");
const userRestToken_1 = require("../utils/userRestToken");
// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = (0, async_1.default)(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});
exports.getTopUsers = (0, async_1.default)(async (req, res, next) => {
    const limit = req.query.limit
        ? parseInt(req.query.limit, 10)
        : 10;
    const users = await User_1.User.find({ status: "active" })
        .populate("cards")
        .sort({ cards: -1 })
        .limit(limit);
    return res.status(200).json({ success: true, data: users });
});
// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = (0, async_1.default)(async (req, res, next) => {
    (0, logger_1.logDebug)(`Creating new user with email: ${req.body.email}`);
    // Check if email already exists
    const existingUser = await User_1.User.findOne({ email: req.body.email });
    if (existingUser) {
        (0, logger_1.logError)(`Email ${req.body.email} already in use`, new Error("Validation Error"));
        return next(new errorResponse_1.default(`Email ${req.body.email} is already registered`, 400));
    }
    // Determine if we need to generate a password
    const isPasswordProvided = !!req.body.password;
    const password = isPasswordProvided
        ? req.body.password
        : generateSecurePassword();
    // Create user with all provided fields and the password
    const userData = {
        ...req.body,
        password,
    };
    const user = await User_1.User.create(userData);
    // add the default settings for the user
    await Settings_1.Settings.create({
        user: user.id,
    });
    // Send welcome email with password
    await sendWelcomeEmail(user, password, !isPasswordProvided);
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "user_created",
        resourceUser: user._id,
        details: `Created user ${user.firstName} ${user.lastName}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    // Log the action
    (0, logger_1.logInfo)(`User created with ID: ${user._id} by admin ${req.user.id}`);
    if (!isPasswordProvided) {
        (0, logger_1.logInfo)(`Auto-generated password for user ${user._id}`);
    }
    // Return the user without the password
    res.status(201).json({
        success: true,
        data: user,
        message: `User created successfully. ${!isPasswordProvided
            ? "A password has been generated and sent to the user's email."
            : "Login credentials have been sent to the user's email."}`,
    });
});
// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404));
    }
    if (req.body.sendPasswordResetmail) {
        const resetToken = await (0, userRestToken_1.restPasswordToken)(user);
        await (0, sendResetPasswordEmail_1.sendResetPasswordEmail)({
            user,
            resetToken,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });
    }
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "user_updated",
        resourceUser: user._id,
        details: `Updated user ${user.firstName} ${user.lastName}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User ${user._id} updated by ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Update user role
// @route   PUT /api/v1/users/:id/role
// @access  Private/Admin
exports.updateUserRole = (0, async_1.default)(async (req, res, next) => {
    // Check if role is valid
    const validRoles = ["user", "premium", "admin"];
    if (!validRoles.includes(req.body.role)) {
        return next(new errorResponse_1.default(`Role ${req.body.role} is not valid`, 400));
    }
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404));
    }
    // Update user role
    user.role = req.body.role;
    await user.save();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "user_updated",
        resourceUser: user._id,
        details: `Updated user ${user.firstName} ${user.lastName} role to ${req.body.role}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User ${user._id} role updated by ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = (0, async_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return next(new errorResponse_1.default(`User not found with id of ${req.params.id}`, 404));
    }
    await user.deleteOne();
    // create activity log
    await Activity_1.Activity.create({
        user: req.user.id,
        type: "user_deleted",
        resourceUser: user._id,
        details: `Deleted user ${user.firstName} ${user.lastName}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    (0, logger_1.logInfo)(`User ${user._id} deleted by ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Delete bulk users
// @route   POST /api/v1/users/deletebulk
// @access  Private/Admin
exports.deleteBulkUsers = (0, async_1.default)(async (req, res, next) => {
    const { ids } = req.body;
    const deletedUsers = await User_1.User.deleteMany({ _id: { $in: ids } });
    const deletedCount = deletedUsers.deletedCount;
    (0, logger_1.logInfo)(`Deleted ${deletedCount} users by admin ${req.user.id}`);
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc    Create initial admin user
// @route   POST /api/v1/users/create-admin
// @access  Public (but requires setup token)
exports.createAdminUser = (0, async_1.default)(async (req, res, next) => {
    // Verify setup token
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken) {
        return next(new errorResponse_1.default("Admin setup is not configured", 500));
    }
    if (req.body.setupToken !== setupToken) {
        return next(new errorResponse_1.default("Invalid setup token", 401));
    }
    // Check if any admin already exists
    const adminExists = await User_1.User.findOne({ role: "admin" });
    if (adminExists) {
        return next(new errorResponse_1.default("Admin user already exists. Use the admin panel to create more admins.", 400));
    }
    // Create admin user
    const admin = await User_1.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: "admin",
        status: "active",
    });
    // create activity log
    await Activity_1.Activity.create({});
    res.status(201).json({
        success: true,
        data: admin,
    });
});
// Helper function to send welcome email with password
const sendWelcomeEmail = async (user, password, isAutoGenerated) => {
    try {
        const subject = `Welcome to ${process.env.APP_NAME || "Business Card Manager"} - Your Account Details`;
        const message = `
Hello ${user.firstName},

Your account has been created successfully!

Here are your login details:
Email: ${user.email}
${isAutoGenerated ? "Your temporary password: " : "Password: "}${password}

${isAutoGenerated
            ? "Please change your password after your first login for security reasons."
            : ""}

You can log in at: ${process.env.FRONTEND_URL || "https://yourdomain.com"}/login

If you have any questions, please contact our support team.

Thank you,
The ${process.env.APP_NAME || "Business Card Manager"} Team
`;
        await (0, sendEmail_1.default)({
            email: user.email,
            subject,
            message,
        });
        (0, logger_1.logInfo)(`Welcome email sent to ${user.email}`);
    }
    catch (error) {
        (0, logger_1.logError)(`Failed to send welcome email to ${user.email}`, error);
        // We don't want to fail the user creation if email sending fails
        // Just log the error and continue
    }
};
// Helper function to generate a secure random password
const generateSecurePassword = (length = 12) => {
    // Define character sets for password complexity
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Removed confusing chars like I, O
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz"; // Removed confusing chars like l
    const numberChars = "23456789"; // Removed confusing chars like 0, 1
    const specialChars = "!@#$%^&*_-+=";
    // Combine all character sets
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    // Ensure password has at least one character from each set
    let password = "";
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    // Fill the rest of the password with random characters
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    // Shuffle the password characters
    return password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
};
exports.contactUs = (0, async_1.default)(async (req, res, next) => {
    (0, logger_1.logDebug)("Contact Us Request");
    const { name, email, message, subject } = req.body;
    if (!name || !email || !message || !subject) {
        return next(new errorResponse_1.default("Please provide all fields", 400));
    }
    await (0, sendEmail_1.default)({
        from: email,
        email: process.env.FROM_EMAIL ||
            process.env.SMTP_EMAIL ||
            "admin@businesscardmanager.com",
        subject,
        message,
    });
    // create activity log
    (0, logger_1.logInfo)(`Contact from ${name} via ${email}`);
    res.status(200).json({ success: true, message: "Email sent successfully" });
});
