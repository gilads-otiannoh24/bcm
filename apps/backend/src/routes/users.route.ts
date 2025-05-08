import {
  contactUs,
  createAdminUser,
  deleteBulkUsers,
  getTopUsers,
  updateUserRole,
} from "../controllers/users";
import advancedResults from "../middleware/advancedResults";
import { User } from "../models/User";

const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const { protect, authorize } = require("../middleware/auth");

// Apply protection to all routes
// Public route for initial admin setup
router.post("/create-admin", createAdminUser);
router.post("/contactus", contactUs);

router.use(protect);

// Admin only routes
router
  .route("/")
  .get(
    authorize("admin"),
    advancedResults(User, {
      populate: ["cards"],
      searchableFields: ["name", "email"],
    }),
    getUsers
  )
  .post(authorize("admin"), createUser);
router.route("/topusers").get(authorize("admin"), getTopUsers);
router.post("/deletebulk", authorize("admin"), deleteBulkUsers);

router
  .route("/:id")
  .get(authorize("admin"), getUser)
  .patch(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

// Role management route
router.patch("/:id/role", authorize("admin"), updateUserRole);

export default router;
