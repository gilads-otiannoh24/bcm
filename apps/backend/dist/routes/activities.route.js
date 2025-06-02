"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const Activity_1 = require("../models/Activity");
const express = require("express");
const router = express.Router();
const { getActivities, getActivity, getUserActivities, } = require("../controllers/activities");
const { protect, authorize } = require("../middleware/auth");
// Apply protection to all routes
router.use(protect);
// Activity routes
router.get("/me", getUserActivities);
router.get("/:id", getActivity);
// Admin only routes
router.get("/", authorize("admin"), (0, advancedResults_1.default)(Activity_1.Activity, {
    populate: [
        {
            path: "user",
            select: "firstName lastName email avatar",
        },
        {
            path: "relatedUser",
            select: "firstName lastName email avatar",
        },
        {
            path: "relatedCard",
            select: "title name jobTitle company template color",
        },
    ],
}), getActivities);
exports.default = router;
