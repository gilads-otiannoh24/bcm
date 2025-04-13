"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const User_1 = require("../models/User");
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("./async"));
const jwt = require("jsonwebtoken");
// Protect routes
exports.protect = (0, async_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new errorResponse_1.default("Not authorized to access this route", 401));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = (await User_1.User.findById(decoded.id));
        next();
    }
    catch (err) {
        return next(new errorResponse_1.default("Not authorized to access this route : errr" + err, 401));
    }
});
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorResponse_1.default(`User role ${req.user?.role || "undefined"} is not authorized to access this route`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
