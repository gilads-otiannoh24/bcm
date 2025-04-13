"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const sendEmail = async (options) => {
    try {
        // Create a transporter
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number.parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
        });
        // Verify connection configuration
        await transporter.verify();
        (0, logger_1.logInfo)("SMTP connection verified successfully");
        // Create message object
        const message = {
            from: `${process.env.FROM_NAME || "Business Card Manager"} <${options.from || process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };
        // Send email
        const info = await transporter.sendMail(message);
        (0, logger_1.logInfo)(`Email sent: ${info.messageId}`);
    }
    catch (error) {
        (0, logger_1.logError)("Error sending email", error);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};
exports.default = sendEmail;
