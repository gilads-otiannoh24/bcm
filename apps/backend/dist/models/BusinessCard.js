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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessCard = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BusinessCardSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Card title is required"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    company: {
        type: String,
        required: [true, "Company is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    template: {
        type: String,
        enum: ["professional", "creative", "minimal", "bold", "elegant"],
        default: "professional",
    },
    color: {
        type: String,
        default: "blue",
    },
    status: {
        type: String,
        enum: ["active", "inactive", "draft"],
        default: "active",
    },
    views: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
    },
    preview: {
        type: String,
        default: "/placeholder.svg",
    },
    shareableLink: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Generate a shareable link when a card is created
BusinessCardSchema.pre("save", function (next) {
    if (!this.shareableLink) {
        this.shareableLink = `${process.env.FRONTEND_URL}/share/${this._id}`;
    }
    next();
});
// Virtual for card collections
BusinessCardSchema.virtual("collections", {
    ref: "CardCollection",
    localField: "_id",
    foreignField: "card",
    justOne: false,
});
exports.BusinessCard = mongoose_1.default.model("BusinessCard", BusinessCardSchema);
