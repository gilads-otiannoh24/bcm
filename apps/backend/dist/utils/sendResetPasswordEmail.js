"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = void 0;
const sendEmail_1 = __importDefault(require("./sendEmail"));
const Activity_1 = require("../models/Activity");
const sendResetPasswordEmail = async ({ user, resetToken, ip, userAgent, }) => {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the link below: \n\n ${resetUrl}`;
    await (0, sendEmail_1.default)({
        email: user.email,
        subject: "Password reset token",
        message,
    });
    await Activity_1.Activity.create({
        user: user._id,
        type: "user_forgot_password",
        details: `User ${user.firstName} ${user.lastName} requested a password reset`,
        relatedUser: user._id,
        ip,
        userAgent,
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
