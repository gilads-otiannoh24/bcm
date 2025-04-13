"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ["user", "premium", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "inactive", "pending"],
        default: "pending",
    },
    avatar: {
        type: String,
        default: "/placeholder.svg",
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    jobTitle: {
        type: String,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        github: String,
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
    },
    lastLogin: {
        type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: Date.now,
    },
    isAnonymized: {
        type: Boolean,
        default: false,
    },
    deletionReason: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for full name
UserSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Virtual for cards created by this user
UserSchema.virtual("cards", {
    ref: "BusinessCard",
    localField: "_id",
    foreignField: "owner",
    count: true,
});
// Virtual for connections count
UserSchema.virtual("connectionsCount", {
    ref: "Connection",
    localField: "_id",
    foreignField: "user",
    count: true,
});
// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    return jsonwebtoken_1.default.sign({ id: this._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, // 1 hour expiration
    secret);
};
exports.User = mongoose_1.default.model("User", UserSchema);
