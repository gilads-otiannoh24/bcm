import express from "express";
import {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  shareCard,
  getCardByShareableLink,
  getMyCards,
  duplicateCard,
  getCardStats,
  deleteBulkCards,
} from "../controllers/businessCards";
import { protect, authorize } from "../middleware/auth";
import advancedResults from "../middleware/advancedResults";
import { BusinessCard } from "../models/BusinessCard";

const router = express.Router();

// Public routes
router.get("/share/:shareableLink", getCardByShareableLink);

router.get(
  "/",
  advancedResults(BusinessCard, {
    populate: {
      path: "owner",
      select: "firstName lastName email avatar",
    },
  }),
  getCards
);
router.get("/me", protect, getMyCards);
router.route("/:id").get(getCard);

// Protected routes
router.use(protect);

// User routes
router.post("/", createCard);
router.post("/:id/duplicate", duplicateCard);
router.post("/:id/share", shareCard);
router.get("/share/:shareableLink", getCardByShareableLink);
router.get("/:id/stats", getCardStats);

router.route("/:id").patch(updateCard).delete(deleteCard);

// Admin routes
router.post("/deletebulk", authorize("admin"), deleteBulkCards);

export default router;
