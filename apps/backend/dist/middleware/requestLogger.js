"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
/**
 * Middleware to log all incoming requests
 */
const requestLogger = (req, res, next) => {
    // Log the request
    (0, logger_1.logHttp)(`${req.method} ${req.originalUrl} from ${req.ip}`);
    // Get the start time
    const start = Date.now();
    // Once the response is finished, log the response time
    res.on("finish", () => {
        const duration = Date.now() - start;
        (0, logger_1.logHttp)(`${req.method} ${req.originalUrl} completed with status ${res.statusCode} in ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
