"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const x_xss_protection_1 = __importDefault(require("x-xss-protection"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = __importDefault(require("./middleware/error"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Route files
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const settings_route_1 = __importDefault(require("./routes/settings.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const misc_route_1 = __importDefault(require("./routes/misc.route"));
const businessCards_route_1 = __importDefault(require("./routes/businessCards.route"));
const organizations_route_1 = __importDefault(require("./routes/organizations.route"));
const connections_route_1 = __importDefault(require("./routes/connections.route"));
const cardCollections_route_1 = __importDefault(require("./routes/cardCollections.route"));
const activities_route_1 = __importDefault(require("./routes/activities.route"));
const favourites_route_1 = __importDefault(require("./routes/favourites.route"));
const dotenv_1 = require("dotenv");
const logger_1 = require("./utils/logger");
const User_1 = require("./models/User");
const Settings_1 = require("./models/Settings");
// Load env vars
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Create rate limiter middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 1000000,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
});
// Apply the rate limiter to all requests
app.use(limiter);
// Sanitize data
app.use((0, express_mongo_sanitize_1.default)());
// Set security headers
app.use((0, helmet_1.default)());
// Prevent XSS attacks
app.use((0, x_xss_protection_1.default)());
// Prevent http param pollution
app.use((0, hpp_1.default)());
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? [
        ...process.env.ALLOWED_ORIGINS.split(","),
        process.env.FRONTEND_URL,
    ]
    : [process.env.FRONTEND_URL];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin)
            return callback(null, true);
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
}));
// Mount routers
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/users", users_route_1.default);
app.use("/api/v1/businesscards", businessCards_route_1.default);
app.use("/api/v1/organizations", organizations_route_1.default);
app.use("/api/v1/connections", connections_route_1.default);
app.use("/api/v1/collections", cardCollections_route_1.default);
app.use("/api/v1/activities", activities_route_1.default);
app.use("/api/v1/settings", settings_route_1.default);
app.use("/api/v1/misc", misc_route_1.default);
app.use("/api/v1/favourites", favourites_route_1.default);
app.use(error_1.default);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
    await (0, db_1.default)();
    (0, logger_1.logInfo)(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // create a user and admin if they do not exist
    const existsNormalUser = await User_1.User.findOne({ role: "user" });
    if (!existsNormalUser) {
        // create initial user
        const userDetails = {
            firstName: "Priscilla",
            lastName: "Abunda",
            email: "user@email.com",
            password: "password123",
            status: "active",
        };
        const user = await User_1.User.create(userDetails);
        await Settings_1.Settings.create({
            user: user._id,
        });
        (0, logger_1.logInfo)("Created first user!");
    }
    const existsAdmin = await User_1.User.findOne({ role: "admin" });
    if (!existsAdmin) {
        // create initial admin
        const adminDetails = {
            firstName: "Ray",
            lastName: "Manimino",
            email: "admin@email.com",
            password: "password123",
            role: "admin",
            status: "active",
        };
        const user = await User_1.User.create(adminDetails);
        await Settings_1.Settings.create({
            user: user._id,
        });
        (0, logger_1.logInfo)("Created first admin");
    }
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    (0, logger_1.logError)("Unhandled Rejection", err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    (0, logger_1.logError)("Uncaught Exception", err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
