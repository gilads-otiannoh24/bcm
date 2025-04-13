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

// Protected routes
router.use(protect);

// User routes
router.get("/me", getMyCards);
router.post("/", createCard);
router.post("/:id/duplicate", duplicateCard);
router.post("/:id/share", shareCard);
router.get("/share/:shareableLink", getCardByShareableLink);
router.get("/:id/stats", getCardStats);

router.route("/:id").get(getCard).patch(updateCard).delete(deleteCard);

// Admin routes
router.get(
  "/",
  authorize("admin"),
  advancedResults(BusinessCard, [
    {
      path: "owner",
      select: "firstName lastName email avatar",
    },
  ]),
  getCards
);
router.post("/deletebulk", authorize("admin"), deleteBulkCards);

export default router;
