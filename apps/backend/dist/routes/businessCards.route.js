"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const businessCards_1 = require("../controllers/businessCards");
const auth_1 = require("../middleware/auth");
const advancedResults_1 = __importDefault(require("../middleware/advancedResults"));
const BusinessCard_1 = require("../models/BusinessCard");
const router = express_1.default.Router();
// Public routes
router.get("/share/:shareableLink", businessCards_1.getCardByShareableLink);
router.get("/", (0, advancedResults_1.default)(BusinessCard_1.BusinessCard, {
    populate: {
        path: "owner",
        select: "firstName lastName email avatar",
    },
}), businessCards_1.getCards);
router.get("/me", auth_1.protect, businessCards_1.getMyCards);
router.route("/:id").get(businessCards_1.getCard);
// Protected routes
router.use(auth_1.protect);
// User routes
router.post("/", businessCards_1.createCard);
router.post("/:id/duplicate", businessCards_1.duplicateCard);
router.post("/:id/share", businessCards_1.shareCard);
router.get("/share/:shareableLink", businessCards_1.getCardByShareableLink);
router.get("/:id/stats", businessCards_1.getCardStats);
router.route("/:id").patch(businessCards_1.updateCard).delete(businessCards_1.deleteCard);
// Admin routes
router.post("/deletebulk", (0, auth_1.authorize)("admin"), businessCards_1.deleteBulkCards);
exports.default = router;
