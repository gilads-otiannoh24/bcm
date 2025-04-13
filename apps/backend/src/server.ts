import express, { type Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "x-xss-protection";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import connectDB from "./config/db";
import errorHandler from "./middleware/error";

// Route files
import auth from "./routes/auth.route";
import settings from "./routes/settings.route";
import users from "./routes/users.route";
import misc from "./routes/misc.route";
import businessCards from "./routes/businessCards.route";
import organizations from "./routes/organizations.route";
import connections from "./routes/connections.route";
import cardCollections from "./routes/cardCollections.route";
import activities from "./routes/activities.route";
import { config } from "dotenv";
import { logError, logInfo } from "./utils/logger";

// Load env vars
config();

const app: Application = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [
      ...process.env.ALLOWED_ORIGINS.split(","),
      process.env.FRONTEND_URL as string,
    ]
  : [process.env.FRONTEND_URL as string];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/businesscards", businessCards);
app.use("/api/v1/organizations", organizations);
app.use("/api/v1/connections", connections);
app.use("/api/v1/collections", cardCollections);
app.use("/api/v1/activities", activities);
app.use("/api/v1/settings", settings);
app.use("/api/v1/misc", misc);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  await connectDB();
  logInfo(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error, promise) => {
  logError("Unhandled Rejection", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logError("Uncaught Exception", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
