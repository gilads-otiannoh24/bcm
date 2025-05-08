import advancedResults from "../middleware/advancedResults";
import { Activity } from "../models/Activity";

const express = require("express");
const router = express.Router();
const {
  getActivities,
  getActivity,
  getUserActivities,
} = require("../controllers/activities");

const { protect, authorize } = require("../middleware/auth");

// Apply protection to all routes
router.use(protect);

// Activity routes
router.get("/me", getUserActivities);
router.get("/:id", getActivity);

// Admin only routes
router.get(
  "/",
  authorize("admin"),
  advancedResults(Activity, {
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
  }),
  getActivities
);

export default router;
