"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const Organization_1 = require("../models/Organization");
const express = require("express");
const router = express.Router();
const { getOrganizations, getOrganization, createOrganization, updateOrganization, deleteOrganization, getOrganizationMembers, addOrganizationMember, removeOrganizationMember, getOrganizationCards, } = require("../controllers/organizations");
const { protect, authorize } = require("../middleware/auth");
// Apply protection to all routes
router.use(protect);
// Organization routes
router
    .route("/")
    .get(authorize("admin"), (0, advancedResults_1.default)(Organization_1.Organization, {
    populate: {
        path: "owner",
        select: "firstName lastName email",
    },
}), getOrganizations)
    .post(createOrganization);
router
    .route("/:id")
    .get(getOrganization)
    .patch(updateOrganization)
    .delete(deleteOrganization);
// Organization members
router
    .route("/:id/members")
    .get(getOrganizationMembers)
    .post(authorize("admin"), addOrganizationMember);
router.delete("/:id/members/:userId", authorize("admin"), removeOrganizationMember);
// Organization cards
router.get("/:id/cards", getOrganizationCards);
exports.default = router;
