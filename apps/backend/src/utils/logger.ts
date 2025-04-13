import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
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
winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${
        info.stack ? `\n${info.stack}` : ""
      }`
  )
);

// Custom format for file output (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}${
        info.stack ? `\n${info.stack}` : ""
      }`
  )
);

// Create a daily rotate file transport for all logs
const allLogsTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "debug",
  format: fileFormat,
});

// Create a daily rotate file transport for error logs only
const errorLogsTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
  format: fileFormat,
});

// Create the logger
const logger = winston.createLogger({
  levels,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.json(),
  defaultMeta: { service: "business-card-manager" },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      format: consoleFormat,
    }),
    // File transports
    allLogsTransport,
    errorLogsTransport,
  ],
  exitOnError: false, // Don't exit on handled exceptions
});

// Add event listeners for transport errors
allLogsTransport.on("error", (error: any) => {
  console.error("Error in all logs transport", error);
});

errorLogsTransport.on("error", (error: any) => {
  console.error("Error in error logs transport", error);
});

// Create a stream object for Morgan HTTP logger
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper function to format error stacks
const formatError = (error: Error): string => {
  return `${error.message}\n${error.stack}`;
};

// Export the logger and helper functions
export { logger, stream, formatError };

// Export convenience methods
export const logError = (message: string, error?: Error): void => {
  if (error) {
    logger.error(`${message}: ${error.message}`, { stack: error.stack });
  } else {
    logger.error(message);
  }
};

export const logCritical = (message: string, error?: Error): void => {
  if (error) {
    logger.log("critical", `${message}: ${error.message}`, {
      stack: error.stack,
    });
  } else {
    logger.log("critical", message);
  }
};

export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};

export const logHttp = (message: string): void => {
  logger.http(message);
};

export default logger;
