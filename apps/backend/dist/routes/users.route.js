"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const User_1 = require("../models/User");
const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, } = require("../controllers/users");
const { protect, authorize } = require("../middleware/auth");
// Apply protection to all routes
// Public route for initial admin setup
router.post("/create-admin", users_1.createAdminUser);
router.post("/contactus", users_1.contactUs);
router.use(protect);
// Admin only routes
router
    .route("/")
    .get(authorize("admin"), (0, advancedResults_1.default)(User_1.User, {
    populate: ["cards"],
    searchableFields: ["name", "email"],
}), getUsers)
    .post(authorize("admin"), createUser);
router.route("/topusers").get(authorize("admin"), users_1.getTopUsers);
router.post("/deletebulk", authorize("admin"), users_1.deleteBulkUsers);
router
    .route("/:id")
    .get(authorize("admin"), getUser)
    .patch(authorize("admin"), updateUser)
    .delete(authorize("admin"), deleteUser);
// Role management route
router.patch("/:id/role", authorize("admin"), users_1.updateUserRole);
exports.default = router;
