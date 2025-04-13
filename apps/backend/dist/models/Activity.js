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
exports.Activity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ActivitySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: [
            "user_created",
            "user_updated",
            "user_deleted",
            "card_created",
            "card_viewed",
            "card_shared",
            "card_collected",
            "card_duplicated",
            "card_updated",
            "user_deleted",
            "card_deleted",
            "connection_created",
            "connection_updated",
            "connection_deleted",
            "card_updated",
            "user_logged_in",
            "user_logged_out",
            "user_reset_password",
            "user_forgot_password",
            "user_updated",
        ],
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    relatedUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    relatedCard: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BusinessCard",
    },
    relatedConnection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Connection",
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Activity = mongoose_1.default.model("Activity", ActivitySchema);
