"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHttp = exports.logDebug = exports.logInfo = exports.logWarn = exports.logCritical = exports.logError = exports.formatError = exports.stream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure logs directory exists
const logsDir = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Define log levels with their priorities
const levels = {
    error: 0, // Highest priority
    warn: 1,
    critical: 2,
    info: 3,
    http: 4,
    debug: 5, // Lowest priority
};
// Define colors for each log level
const colors = {
    error: "red",
    warn: "yellow",
    critical: "magenta",
    info: "green",
    http: "cyan",
    debug: "blue",
};
// Add colors to winston
winston_1.default.addColors(colors);
// Custom format for console output
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ""}`));
// Custom format for file output (without colors)
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ""}`));
// Create a daily rotate file transport for all logs
const allLogsTransport = new winston_1.default.transports.DailyRotateFile({
    filename: path_1.default.join(logsDir, "application-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "debug",
    format: fileFormat,
});
// Create a daily rotate file transport for error logs only
const errorLogsTransport = new winston_1.default.transports.DailyRotateFile({
    filename: path_1.default.join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "error",
    format: fileFormat,
});
// Create the logger
const logger = winston_1.default.createLogger({
    levels,
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.json(),
    defaultMeta: { service: "business-card-manager" },
    transports: [
        // Console transport for development
        new winston_1.default.transports.Console({
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
            format: consoleFormat,
        }),
        // File transports
        allLogsTransport,
        errorLogsTransport,
    ],
    exitOnError: false, // Don't exit on handled exceptions
});
exports.logger = logger;
// Add event listeners for transport errors
allLogsTransport.on("error", (error) => {
    console.error("Error in all logs transport", error);
});
errorLogsTransport.on("error", (error) => {
    console.error("Error in error logs transport", error);
});
// Create a stream object for Morgan HTTP logger
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.stream = stream;
// Helper function to format error stacks
const formatError = (error) => {
    return `${error.message}\n${error.stack}`;
};
exports.formatError = formatError;
// Export convenience methods
const logError = (message, error) => {
    if (error) {
        logger.error(`${message}: ${error.message}`, { stack: error.stack });
    }
    else {
        logger.error(message);
    }
};
exports.logError = logError;
const logCritical = (message, error) => {
    if (error) {
        logger.log("critical", `${message}: ${error.message}`, {
            stack: error.stack,
        });
    }
    else {
        logger.log("critical", message);
    }
};
exports.logCritical = logCritical;
const logWarn = (message, meta) => {
    logger.warn(message, meta);
};
exports.logWarn = logWarn;
const logInfo = (message, meta) => {
    logger.info(message, meta);
};
exports.logInfo = logInfo;
const logDebug = (message, meta) => {
    logger.debug(message, meta);
};
exports.logDebug = logDebug;
const logHttp = (message) => {
    logger.http(message);
};
exports.logHttp = logHttp;
exports.default = logger;
