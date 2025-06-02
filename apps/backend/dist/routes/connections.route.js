"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const auth_1 = require("../middleware/auth");
const Connection_1 = require("../models/Connection");
const express = require("express");
const router = express.Router();
const { getConnections, getConnection, createConnection, updateConnection, deleteConnection, acceptConnection, rejectConnection, } = require("../controllers/connections");
// Apply protection to all routes
router.use(auth_1.protect);
// Connection routes
router.route("/").get(getConnections).post(createConnection);
router
    .route("/:id")
    .get((0, advancedResults_1.default)(Connection_1.Connection, {
    populate: [
        {
            path: "contact",
            select: "firstName lastName email avatar",
        },
        {
            path: "card",
            select: "title name jobTitle company email phone template color",
        },
    ],
}), getConnection)
    .patch(updateConnection)
    .delete(deleteConnection);
// Connection actions
router.patch("/:id/accept", acceptConnection);
router.patch("/:id/reject", rejectConnection);
exports.default = router;
