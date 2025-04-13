"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log the error with stack trace
    (0, logger_1.logError)(`${req.method} ${req.originalUrl}`, err);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new errorResponse_1.default(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new errorResponse_1.default(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new errorResponse_1.default(message, 400);
    }
    // CORS error
    if (err.message.includes("CORS policy")) {
        error = new errorResponse_1.default(err.message, 403);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};
exports.default = errorHandler;
